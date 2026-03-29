const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const testModels = [
  'gemini-1.5-flash',
  'gemini-1.5-flash-latest',
  'gemini-1.5-pro',
  'gemini-1.5-pro-latest',
  'gemini-2.0-flash',
  'gemini-2.0-flash-exp',
  'gemini-1.5-flash-8b',
  'gemini-pro',
  'gemini-1.0-pro',
  'gemini-flash-latest'
];

async function run() {
  for (const m of testModels) {
    try {
      const model = genAI.getGenerativeModel({ model: m });
      const res = await model.generateContent("hi");
      console.log(`[${m}] SUCCESS`);
    } catch(e) {
      console.log(`[${m}] FAIL: ${e.message.slice(0, 100)}`);
    }
  }
}
run();
