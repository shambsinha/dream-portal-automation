import { Logger } from './logger';
import config from '../config/config';

export interface DreamClassification {
  dreamName: string;
  aiClassification: string;
  uiClassification: string;
  isCorrect: boolean;
}

export class AIValidator {
  private apiKey: string;
  private useRealAPI: boolean;

  constructor() {
    this.apiKey = config.OPENAI_API_KEY;
    this.useRealAPI = config.ENABLE_AI_VALIDATION && !!this.apiKey;

    if (!this.useRealAPI) {
      Logger.warn('AI Validation disabled or API key not configured. Using mock classifier.');
    }
  }

  /**
   * Classify a dream using AI or mock classifier
   */
  async classifyDream(dreamName: string): Promise<string> {
    if (this.useRealAPI) {
      return this.classifyWithOpenAI(dreamName);
    } else {
      return this.mockClassifier(dreamName);
    }
  }

  /**
   * Real OpenAI classification
   */
  private async classifyWithOpenAI(dreamName: string): Promise<string> {
    try {
      Logger.info(`Sending dream to OpenAI for classification: "${dreamName}"`);

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: config.AI_MODEL,
          messages: [
            {
              role: 'system',
              content: 'You are a dream classifier. Classify dreams as either "Good" or "Bad". Reply with ONLY the word "Good" or "Bad", nothing else.',
            },
            {
              role: 'user',
              content: `Classify this dream: "${dreamName}". Reply ONLY with "Good" or "Bad".`,
            },
          ],
          temperature: 0.5,
          max_tokens: 10,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API Error: ${response.statusText}`);
      }

      const data = await response.json();
      const classification = data.choices[0].message.content.trim();

      if (!['Good', 'Bad'].includes(classification)) {
        Logger.warn(`Unexpected AI response: ${classification}. Using mock classifier.`);
        return this.mockClassifier(dreamName);
      }

      Logger.success(`AI Classification: "${dreamName}" -> ${classification}`);
      return classification;
    } catch (error) {
      Logger.error(`OpenAI API call failed: ${error}. Falling back to mock classifier.`, error as Error);
      return this.mockClassifier(dreamName);
    }
  }

  /**
   * Mock classifier for fallback
   * Uses keyword matching for demonstration
   */
  private mockClassifier(dreamName: string): string {
    Logger.info(`Using mock classifier for: "${dreamName}"`);

    const lowerName = dreamName.toLowerCase();

    const goodKeywords = ['flying', 'mountain', 'success', 'happy', 'win', 'love', 'dream', 'soar'];
    const badKeywords = ['lost', 'maze', 'fell', 'chase', 'run', 'scary', 'nightmare', 'fail'];

    for (const keyword of goodKeywords) {
      if (lowerName.includes(keyword)) {
        Logger.debug(`Mock: Found good keyword "${keyword}" in "${dreamName}"`);
        return 'Good';
      }
    }

    for (const keyword of badKeywords) {
      if (lowerName.includes(keyword)) {
        Logger.debug(`Mock: Found bad keyword "${keyword}" in "${dreamName}"`);
        return 'Bad';
      }
    }

    // Default classification based on length (simple heuristic for demo)
    const classification = dreamName.length % 2 === 0 ? 'Good' : 'Bad';
    Logger.debug(`Mock: No keywords found. Using length-based classification: ${classification}`);
    return classification;
  }

  /**
   * Validate a dream and return classification result
   */
  async validateDream(dreamName: string, uiClassification: string): Promise<DreamClassification> {
    const aiClassification = await this.classifyDream(dreamName);
    const isCorrect = aiClassification === uiClassification;

    const result: DreamClassification = {
      dreamName,
      aiClassification,
      uiClassification,
      isCorrect,
    };

    if (isCorrect) {
      Logger.success(`✓ Dream "${dreamName}" classification verified: ${aiClassification}`);
    } else {
      Logger.error(`✗ Dream "${dreamName}" classification mismatch! AI: ${aiClassification}, UI: ${uiClassification}`);
    }

    return result;
  }

  /**
   * Validate multiple dreams
   */
  async validateMultipleDreams(dreams: Array<{ name: string; type: string }>): Promise<DreamClassification[]> {
    Logger.section('AI Dream Classification Validation');

    const results: DreamClassification[] = [];

    for (const dream of dreams) {
      const result = await this.validateDream(dream.name, dream.type);
      results.push(result);

      // Add small delay to avoid rate limiting
      await this.sleep(500);
    }

    Logger.section('Summary');
    const passCount = results.filter((r) => r.isCorrect).length;
    const totalCount = results.length;
    Logger.info(`AI Validation Results: ${passCount}/${totalCount} dreams correctly classified`);

    if (passCount < totalCount) {
      Logger.warn(`Failed validations: ${totalCount - passCount}`);
      results.filter((r) => !r.isCorrect).forEach((r) => {
        Logger.warn(`  - "${r.dreamName}": Expected ${r.uiClassification}, AI said ${r.aiClassification}`);
      });
    }

    return results;
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

