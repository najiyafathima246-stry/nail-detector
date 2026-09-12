/**
 * Kai Onnu Kaattikke! - Modular AI Vision Service
 * Supports Google Gemini Vision API, local computer vision heuristics, and presentation demo modes.
 */

import { HandAnalyzer } from './analyzer.js';

export class AiVisionService {
  constructor() {
    this.localAnalyzer = new HandAnalyzer();
    this.apiKey = localStorage.getItem('kai_gemini_api_key') || '';
    this.mode = localStorage.getItem('kai_ai_mode') || 'heuristic'; // 'heuristic' | 'gemini' | 'demo_dirty' | 'demo_clean'
  }

  setApiKey(key) {
    this.apiKey = key.trim();
    localStorage.setItem('kai_gemini_api_key', this.apiKey);
  }

  getApiKey() {
    return this.apiKey;
  }

  setMode(mode) {
    this.mode = mode;
    localStorage.setItem('kai_ai_mode', mode);
  }

  getMode() {
    return this.mode;
  }

  /**
   * Main analysis entry point
   * @param {HTMLImageElement|ImageBitmap} imageSource
   * @param {string} base64DataUrl
   * @returns {Promise<Object>}
   */
  async analyzeHand(imageSource, base64DataUrl) {
    // 1. Check for Forced Demo Modes (Great for presentations!)
    if (this.mode === 'demo_dirty') {
      const score = Math.floor(15 + Math.random() * 15); // 15 - 30
      return this.localAnalyzer.buildResult(score, 18, 20);
    }
    if (this.mode === 'demo_clean') {
      const score = Math.floor(88 + Math.random() * 10); // 88 - 98
      return this.localAnalyzer.buildResult(score, 0.4, 0.2);
    }

    // 2. If Gemini API key is configured and mode is 'gemini', call Vision AI
    if (this.mode === 'gemini' && this.apiKey) {
      try {
        const geminiResult = await this.callGeminiVision(base64DataUrl);
        if (geminiResult) {
          return geminiResult;
        }
      } catch (err) {
        console.warn('Gemini Vision call failed, falling back to local heuristic analyzer:', err);
      }
    }

    // 3. Default: Smart In-Browser Computer Vision Heuristic Analyzer
    return await this.localAnalyzer.analyze(imageSource);
  }

  /**
   * Optional Google Gemini Vision API caller
   */
  async callGeminiVision(base64DataUrl) {
    const cleanBase64 = base64DataUrl.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;

    const promptText = `
      You are judging hand hygiene for a funny Malayalam web app called 'Kai Onnu Kaattikke!'.
      Inspect the provided image of human hand and fingernails.
      Analyze whether there is visible dirt, mud, dust, or grime on the hand or around the fingernails.
      Return ONLY a JSON object with:
      {
        "isClean": boolean (true if clean and well-kept, false if noticeable dirt/mud exists),
        "score": integer between 0 and 100 (0=very dirty mud, 100=spotless),
        "explanation": brief English explanation of dirt detected or cleanliness
      }
    `;

    const payload = {
      contents: [{
        parts: [
          { text: promptText },
          {
            inline_data: {
              mime_type: "image/jpeg",
              data: cleanBase64
            }
          }
        ]
      }],
      generationConfig: {
        response_mime_type: "application/json",
        temperature: 0.2
      }
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`AI API error status: ${response.status}`);
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) throw new Error("No candidate returned from Vision AI");

    const parsed = JSON.parse(candidateText);
    const score = Math.max(5, Math.min(99, parseInt(parsed.score, 10) || 50));
    return this.localAnalyzer.buildResult(score);
  }
}
