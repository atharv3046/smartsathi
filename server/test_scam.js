const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const FALLBACK_MODELS = [
  'gemini-1.5-flash',
  'gemini-2.5-flash',
  'gemini-flash-latest',
  'gemini-2.5-pro',
  'gemini-2.0-flash',
  'gemini-1.5-pro'
];

async function run() {
  for (const modelName of FALLBACK_MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName, generationConfig: { responseMimeType: 'application/json' } });
      const result = await model.generateContent('{"hello": "world"}');
      console.log(`[${modelName}] SUCCESS:`, result.response.text().slice(0, 20));
    } catch (err) {
      console.error(`[${modelName}] FAILED:`, err.message);
    }
  }
}
run();
