const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
}));
app.use(express.json());

// Initialize Gemini Client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Models to try in order if rate limit (429 / quota) is hit
const FALLBACK_MODELS = [
  'gemini-2.5-flash',
  'gemini-flash-latest',
  'gemini-2.5-pro',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
];

// Simple in-memory cache for news (lives for 1 hour)
const newsCache = { hi: null, mr: null, ta: null, bn: null, en: null };

// ─── NPCI / RBI Official Guidelines (cited from real sources) ────────────────
const NPCI_RBI_RULES = `
OFFICIAL NPCI / RBI GUIDELINES (always cite these accurately):

1. UPI PIN Privacy (NPCI): "UPI PIN is personal and must never be shared with anyone — not even bank officials, NPCI employees, or customer care representatives." Source: NPCI UPI Safety Guidelines.

2. No OTP sharing (RBI): RBI Circular RBI/2021-22/39 states that banks and payment companies will NEVER ask for OTP, password or card details over call or SMS.

3. Complaint Redressal (RBI): UPI transaction complaints must be resolved within T+1 (next business day). If not resolved, customer can escalate to NPCI at https://www.npci.org.in or call 1800-120-1740 (toll-free).

4. UPI Fraud Reporting (MHA/Cyber): Report UPI fraud immediately at https://cybercrime.gov.in or National Cybercrime Helpline: 1930 (24×7). Also report to your bank immediately.

5. KYC Scam Warning (RBI): RBI has officially warned that fake KYC update messages asking to click links or share Aadhaar/OTP are fraudulent. Banks update KYC through official branches only.

6. Merchant Verification (NPCI): Before paying any merchant UPI ID, verify the name shown after entering the ID. If name doesn't match or says "Unable to verify", do not pay.

7. QR Code Safety (NPCI): Scanning a QR code to RECEIVE money is always a scam. QR codes are for PAYING, not receiving money.

8. UPI Limit (NPCI): Maximum per-transaction UPI limit is ₹1 lakh (₹2 lakh for capital markets, insurance, IPO). No legitimate service requires you to exceed this limit in one shot.

9. SIM Swap Fraud (RBI): If your phone suddenly loses signal, immediately call your bank and telecom operator — this may be a SIM swap attack by fraudsters.

10. International UPI (NPCI): UPI is available in select countries (Singapore, UAE, UK, France, etc.) via NPCI International. Only use official BHIM/bank apps for international UPI.
`;

// ─── Language Instructions ────────────────────────────────────────────────────
function getLanguageInstruction(lang) {
  const instructions = {
    hi: `- Always respond in Hindi using Devanagari script (हिंदी).
- If user writes in English or Hinglish, reply in Hindi but stay friendly.
- Use polite respectful language (आप, जी, नमस्ते).`,

    mr: `- Always respond in Marathi using Devanagari script (मराठी).
- If user writes in Hindi or English, reply in Marathi.
- Use polite forms: तुम्ही (not तू). Use "नमस्कार", "धन्यवाद", "कृपया".`,

    ta: `- Always respond in Tamil using Tamil script (தமிழ்).
- If user writes in Hindi or English, reply in Tamil.
- Use polite forms. Use "வணக்கம்", "நன்றி", "தயவுசெய்து".`,

    bn: `- Always respond in Bengali using Bengali script (বাংলা).
- If user writes in Hindi or English, reply in Bengali.
- Use polite forms. Use "নমস্কার", "ধন্যবাদ", "দয়া করে".`,

    en: `- Always respond in English.
- If user writes in Hindi or another language, reply in English.
- Use polite, clear, and encouraging forms.`,
  };
  return instructions[lang] || instructions.hi;
}

// ─── System Prompt Builder ───────────────────────────────────────────────────
function buildSystemPrompt(module, confusionLevel = 0, lang = 'hi') {
  const simplicity =
    confusionLevel === 0
      ? 'Use clear, simple language.'
      : confusionLevel === 1
      ? 'User said they are confused. Use even simpler language, shorter sentences, and add a relatable example from daily Indian life.'
      : 'User is still confused. Break the answer into numbered steps (1, 2, 3...). Use very short sentences. Add an encouraging message at the end.';

  const moduleContext = {
    upi: `You are helping the user learn UPI (Unified Payments Interface) payments.
Topics: how to set up UPI, send/receive money, check balance, create UPI ID, troubleshoot failed transactions, and most importantly how to avoid UPI fraud.
Always cite the relevant NPCI/RBI guideline when discussing safety topics.`,

    scam: `You are helping the user identify phone/SMS/call scams and phishing attempts.
Topics: what is a scam call/message, common tricks (fake KYC update, lottery, bank fraud, OTP request, QR code scam), what to do if you receive a scam, how to report to cybercrime.in (1930 helpline).
Always mention the official reporting channels and RBI warnings when relevant.`,

    digilocker: `You are helping the user learn DigiLocker — the Indian government's official document storage app (officially backed by MeitY/GoI).
Topics: what DigiLocker is, how to register using Aadhaar mobile-linked number, how to find and download documents (Aadhaar, PAN, driving license, marksheets, vehicle RC), how to share documents digitally, security features, why it is safe.`,

    general: `You are a general digital literacy tutor. Help the user with any smartphone or internet question they have.`,
  };

  const langInstruction = getLanguageInstruction(lang);

  return `You are Sahayak (सहायक), a warm, patient, and encouraging AI digital literacy tutor for first-time smartphone users in India.

Your current teaching topic:
${moduleContext[module] || moduleContext.general}

Communication Rules:
${langInstruction}
- Never use complex technical English words without a simple local-language explanation.
- Never be condescending. Always be encouraging and praise the user for asking good questions.
- Keep responses focused on the active topic. If off-topic, gently redirect.
- ${simplicity}

Official Guidelines Reference (USE THESE — never fabricate rules):
${NPCI_RBI_RULES}

IMPORTANT: When discussing safety, fraud, or legal matters — ONLY cite the above official NPCI/RBI guidelines. Never make up rules or statistics.`;
}

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'Sahayak API is running! 🚀' });
});

// ─── Chat Endpoint ───────────────────────────────────────────────────────────
app.post('/api/chat', async (req, res) => {
  try {
    const {
      message,
      messageHistory = [],
      module = 'general',
      confusionLevel = 0,
      language = 'hi',
    } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'A valid message string is required.' });
    }

    const systemPrompt = buildSystemPrompt(module, confusionLevel, language);

    let history = messageHistory.map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    while (history.length > 0 && history[0].role === 'model') {
      history.shift();
    }

    let result = null;
    let lastErr = null;

    for (const modelName of FALLBACK_MODELS) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: systemPrompt,
        });

        const chat = model.startChat({ history });
        result = await chat.sendMessage(message);
        break; // Success
      } catch (err) {
        const isRateLimit = err.message?.includes('429') || err.message?.includes('quota') || err.message?.includes('retry');
        if (isRateLimit) {
          console.warn(`[RateLimit] Chat (${modelName}) hit quota. Trying next...`);
          lastErr = err;
          continue;
        }
        throw err;
      }
    }

    if (!result) throw lastErr || new Error('All models exhausted');

    const reply = result.response.text();

    res.json({ reply });
  } catch (error) {
    console.error('Gemini API Error:', error.message);
    const isRateLimit = error.message?.includes('429') || error.message?.includes('quota') || error.message?.includes('retry');
    res.status(500).json({
      error: isRateLimit
        ? 'AI अभी बहुत व्यस्त है। 1 मिनट बाद दोबारा कोशिश करें। 🙏'
        : 'AI से बात करने में समस्या हुई। कृपया दोबारा कोशिश करें।',
    });
  }
});

// ─── Live UPI Scam News Endpoint (Google Search Grounding) ───────────────────
app.get('/api/scam-news', async (req, res) => {
  try {
    const lang = req.query.lang || 'hi';

    // Serve from cache if less than 1 hour old
    if (newsCache[lang] && (Date.now() - newsCache[lang].timestamp < 3600000)) {
      return res.json(newsCache[lang].data);
    }

    const langQueryMap = {
      hi: 'आज भारत में UPI fraud scam news 2025 नए तरीके',
      mr: 'आज भारतात UPI fraud scam बातम्या 2025',
      ta: 'இன்று இந்தியாவில் UPI மோசடி செய்திகள் 2025',
      bn: 'আজ ভারতে UPI জালিয়াতি খবর 2025',
      en: 'India latest UPI fraud scam news 2025 update',
    };

    const langResponseMap = {
      hi: `आज के ताजा UPI fraud और digital scam की खबरें बताओ। 
           Response format: 3-4 bullet points, each starting with 📌. 
           हर point में: scam का नाम, कैसे होता है (1 line), और बचाव (1 line).
           सब कुछ हिंदी में लिखो। अगर कोई city/location का जिक्र हो तो जरूर लिखो।
           आखिर में official helpline 1930 जरूर mention करो।`,

      mr: `आजच्या UPI fraud आणि digital scam च्या ताज्या बातम्या सांगा.
           Format: 3-4 bullet points, each starting with 📌.
           प्रत्येक point मध्ये: scam चे नाव, कसे होते (1 ओळ), आणि काय करावे (1 ओळ).
           सर्व मराठीत लिहा. शेवटी 1930 helpline नमूद करा.`,

      ta: `இன்றைய UPI fraud மற்றும் digital scam செய்திகளை சொல்லுங்கள்.
           Format: 3-4 bullet points, each starting with 📌.
           ஒவ்வொரு point-லும்: scam பெயர், எவ்வாறு நடக்கிறது (1 வரி), தடுப்பு (1 வரி).
           அனைத்தையும் தமிழில் எழுதவும். கடைசியில் 1930 helpline குறிப்பிடவும்.`,

      bn: `আজকের UPI fraud এবং digital scam এর তাজা খবর বলুন.
           Format: 3-4 bullet points, each starting with 📌.
           প্রতিটি point এ: scam এর নাম, কীভাবে হয় (1 লাইন), সুরক্ষা (1 লাইন).
           সবকিছু বাংলায় লিখুন। শেষে 1930 helpline উল্লেখ করুন।`,

      en: `Provide the latest UPI fraud and digital scam news in India.
           Format: 3-4 bullet points, each starting with 📌.
           In each point: the scam name, how it happens (1 line), and prevention (1 line).
           Write everything in English. Mention the 1930 helpline at the end.`,
    };

    const query = langQueryMap[lang] || langQueryMap.hi;
    const prompt = langResponseMap[lang] || langResponseMap.hi;

    let result = null;
    let lastErr = null;

    for (const modelName of FALLBACK_MODELS) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        result = await model.generateContent(
          `Today's date: ${new Date().toLocaleDateString('en-IN')}\nSearch for recent news about: "${query}"\n\n${prompt}`
        );
        break; // Success
      } catch (err) {
        const isRateLimit = err.message?.includes('429') || err.message?.includes('quota') || err.message?.includes('retry');
        if (isRateLimit) {
          console.warn(`[RateLimit] News (${modelName}) hit quota.`);
          lastErr = err;
          continue;
        }
        throw err;
      }
    }

    if (!result) throw lastErr || new Error('All models exhausted');

    const newsText = result.response.text();

    const groundingMetadata = result.response.candidates?.[0]?.groundingMetadata;
    const sources = groundingMetadata?.groundingChunks
      ?.map((chunk) => chunk.web?.uri)
      .filter(Boolean)
      .slice(0, 3) || [];

    const responseData = {
      news: newsText,
      sources,
      generatedAt: new Date().toISOString(),
    };

    newsCache[lang] = { timestamp: Date.now(), data: responseData };
    res.json(responseData);
  } catch (error) {
    console.error('Scam News Error:', error.message);
    // Return a static fallback so UI never breaks
    res.status(200).json({
      news: `📌 **UPI Screen Share Scam**: कोई "customer care" बनकर screen share app install करवाता है और UPI PIN चुरा लेता है। अजनबियों को कभी screen share न करें।\n\n📌 **Fake QR Code Scam**: QR scan करने पर पैसे आते नहीं, जाते हैं। सिर्फ भेजने के लिए QR use करें, पाने के लिए नहीं।\n\n📌 **SIM Swap Fraud**: अचानक signal बंद हो जाए तो तुरंत bank को call करें — यह SIM swap attack हो सकता है।\n\n🆘 UPI fraud होने पर तुरंत **1930** पर call करें।`,
      sources: [],
      generatedAt: new Date().toISOString(),
      isFallback: true,
    });
  }
});

// ─── Scam Detection Endpoint ─────────────────────────────────────────────────
app.post('/api/detect-scam', async (req, res) => {
  try {
    const { text, language = 'hi' } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'A text message is required for scam detection.' });
    }

    const scamSystemPrompt = `You are an expert scam and phishing message detector for Indian users.
Analyze the following SMS or message and determine if it is a scam/phishing attempt or legitimate.

Common Indian scam patterns to check for:
- Requests for OTP, PIN, CVV, or bank passwords (violates RBI Circular RBI/2021-22/39)
- Fake KYC update threats (RBI has officially warned these are fraudulent)
- Fake lottery or prize winnings
- Fake job offers with advance fee
- Government impersonation (Income Tax, TRAI, police)
- Fake bank/UPI fraud alerts asking to click a link
- QR code scams (asking to scan to "receive" money — this is always fraud per NPCI)
- Urgency and fear tactics

Official rules to reference:
${NPCI_RBI_RULES}

Respond ONLY with a valid JSON object in this exact format (no extra text, no markdown, no code fences):
{
  "isScam": true or false,
  "confidence": "high", "medium", or "low",
  "reason_hi": "2-3 sentence explanation in ${language === 'hi' ? 'Hindi (Devanagari)' : language === 'mr' ? 'Marathi (Devanagari)' : language === 'ta' ? 'Tamil script' : language === 'bn' ? 'Bengali script' : 'English'} for why this is or isn't a scam — cite official NPCI/RBI guideline if relevant",
  "warning_signs": ["sign 1 in local language", "sign 2 in local language"],
  "advice_hi": "one sentence of advice in local language on what the user should do",
  "official_rule": "if applicable, cite the specific NPCI/RBI rule being violated, else null"
}`;

    let result = null;
    let lastErr = null;

    for (const modelName of FALLBACK_MODELS) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: scamSystemPrompt,
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
        });
        result = await model.generateContent(`Message to analyze:\n"${text}"`);
        break;
      } catch (err) {
        const isRateLimit = err.message?.includes('429') || err.message?.includes('quota') || err.message?.includes('retry');
        if (isRateLimit) {
          console.warn(`[RateLimit] Detect (${modelName}) hit quota.`);
          lastErr = err;
          continue;
        }
        throw err;
      }
    }

    if (!result) throw lastErr || new Error('All models exhausted');

    const rawText = result.response.text();
    const parsed = JSON.parse(rawText);
    res.json(parsed);
  } catch (error) {
    console.error('Scam Detection Error:', error.message);
    res.status(500).json({
      error: 'संदेश की जाँच करने में समस्या हुई। कृपया दोबारा कोशिश करें।',
    });
  }
});

// ─── Visual Guidance Engine (Screenshot Analysis) ────────────────────────────
app.post('/api/analyze-screenshot', async (req, res) => {
  try {
    const {
      imageBase64,      // data URI or raw base64 string
      mimeType = 'image/jpeg',
      question = '',
      module = 'general',
      recentMessages = [],
      language = 'hi',
    } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'imageBase64 is required.' });
    }

    // Strip data-URI prefix if present
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    // Build context string from last 3 messages
    const contextStr = recentMessages
      .slice(-3)
      .map((m) => `${m.role === 'assistant' ? 'Sahayak' : 'User'}: ${m.content}`)
      .join('\n');

    const vgeSystemPrompt = `You are a Visual Guidance Engine for "Sahayak", an AI digital literacy assistant for first-time smartphone users in rural/semi-urban India.

A user has uploaded a screenshot of their phone screen. Analyze it carefully and return ONLY a single valid JSON object matching EXACTLY the schema below — no markdown, no code fences, no extra keys.

Active module context: ${module}
User's question or confusion: ${question || '(not provided)'}
Recent conversation context:
${contextStr || '(no prior context)'}

Official safety rules you must apply:
${NPCI_RBI_RULES}

OUTPUT SCHEMA (return ONLY this JSON):
{
  "language": "hi",
  "ocr_text": "All visible text extracted from the screenshot as a single string",
  "ui_elements": [
    {
      "type": "button | input | nav | text | image | unknown",
      "label": "visible label or placeholder text",
      "location": "top-left | top-center | top-right | middle-left | center | middle-right | bottom-left | bottom-center | bottom-right",
      "is_next_action": true
    }
  ],
  "user_intent": "One sentence in English: what the user is trying to do",
  "annotations": [
    {
      "id": 1,
      "target_element": "label of the element",
      "location": "center | bottom-right | top-left | ...",
      "action_type": "tap | type | scroll | swipe | ignore",
      "highlight_color": "#e67e22",
      "arrow_direction": "down | up | left | right | none",
      "label_hindi": "इस बटन को दबाएं",
      "label_english": "Tap this button"
    }
  ],
  "steps": [
    {
      "step_number": 1,
      "instruction_hindi": "पहले यहाँ अपना UPI PIN डालें",
      "instruction_english": "First, enter your UPI PIN here",
      "instruction_marathi": "प्रथम येथे आपला UPI PIN टाका",
      "instruction_tamil": "முதலில் உங்கள் UPI PIN ஐ இங்கே உள்ளிடவும்",
      "target_element": "UPI PIN input field",
      "action": "type",
      "is_warning": false,
      "warning_hindi": null
    }
  ],
  "safety_alert": {
    "triggered": false,
    "message_hindi": null,
    "message_english": null
  },
  "voice_script_hindi": "ठीक है, देखिए इस screen पर क्या करना है...",
  "confidence": "high | medium | low",
  "fallback_message_hindi": "स्क्रीनशॉट साफ़ नहीं दिख रहा। कृपया दोबारा स्पष्ट screenshot लें।"
}

STRICT RULES:
1. Maximum 3 annotations. Mark only ONE as most important (is_next_action: true on the ui_element).
2. Maximum 5 steps. Each step = one simple action only.
3. For any step involving PIN, OTP, or password: set is_warning:true and warning_hindi: "यह PIN किसी को न बताएं — बैंक भी नहीं।"
4. safety_alert.triggered = true if you detect: OTP/PIN request from unfamiliar app, suspicious link, lottery/prize, fake KYC urgency, phishing page.
5. highlight_color: "#e67e22" for primary action, "#e74c3c" for danger/warning, "#27ae60" for safe/confirmed.
6. voice_script_hindi: natural spoken Hindi paragraph, max 4 sentences, start with "ठीक है," or "देखिए,".
7. All instruction fields MUST be in simple everyday language — Class 5 level, no jargon.
8. If screenshot is blurry/blank/unrecognizable, set confidence:"low" and populate fallback_message_hindi.
9. Do NOT hallucinate UI elements. Only describe what is clearly visible.`;

    let result = null;
    let lastErr = null;

    // Vision-capable models in fallback order
    // Some older models don't support responseMimeType:'application/json' with vision,
    // so we try with it first, then without on error.
    const VISION_MODELS = [
      { name: 'gemini-2.5-flash',      jsonMode: true  },
      { name: 'gemini-2.0-flash',      jsonMode: true  },
      { name: 'gemini-1.5-flash',      jsonMode: false },
      { name: 'gemini-1.5-flash-8b',   jsonMode: false },
    ];

    for (const { name: modelName, jsonMode } of VISION_MODELS) {
      try {
        const generationConfig = {
          temperature: 0.2,
          ...(jsonMode ? { responseMimeType: 'application/json' } : {}),
        };

        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: vgeSystemPrompt,
          generationConfig,
        });

        result = await model.generateContent([
          {
            inlineData: {
              data: base64Data,
              mimeType,
            },
          },
          {
            text: question
              ? `User's question: "${question}"\n\nAnalyze this screenshot and return the JSON guidance object.`
              : 'Analyze this screenshot and return the JSON guidance object.',
          },
        ]);
        console.log(`[VGE] Success with model: ${modelName}`);
        break;
      } catch (err) {
        console.warn(`[VGE] (${modelName}) failed: ${err.message?.slice(0, 120)}`);
        lastErr = err;
        continue; // always try next model
      }
    }

    if (!result) throw lastErr || new Error('All vision models exhausted');

    const rawText = result.response.text();
    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      // Try to extract JSON object from mixed/markdown response
      const match = rawText.match(/\{[\s\S]*\}/);
      if (match) {
        try { parsed = JSON.parse(match[0]); }
        catch { throw new Error('Could not parse Gemini vision response as JSON'); }
      } else {
        throw new Error('Could not parse Gemini vision response as JSON');
      }
    }

    res.json(parsed);
  } catch (error) {
    console.error('VGE Error:', error.message);
    const isRateLimit =
      error.message?.includes('429') ||
      error.message?.includes('quota') ||
      error.message?.includes('retry');
    res.status(500).json({
      error: isRateLimit
        ? 'AI अभी व्यस्त है। 1 मिनट बाद दोबारा कोशिश करें। 🙏'
        : 'Screenshot analyze करने में समस्या हुई। कृपया दोबारा कोशिश करें।',
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Sahayak server is running on http://localhost:${PORT}`);
});
