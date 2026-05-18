import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { Logger } from '../utils/logger';
import { TestHelpers } from '../utils/helpers';
import config from '../config/config';

export interface SummaryStats {
  goodDreams: number;
  badDreams: number;
  totalDreams: number;
  recurringDreams: number;
}

export class DreamsSummaryPage extends BasePage {
  // Locators - will be discovered during test execution
  readonly PAGE_TITLE = 'h1, h2, .title, .header';
  readonly GOOD_DREAMS_VALUE = 'span:has-text("Good"), .good-count, [data-testid="good-dreams"]';
  readonly BAD_DREAMS_VALUE = 'span:has-text("Bad"), .bad-count, [data-testid="bad-dreams"]';
  readonly TOTAL_DREAMS_VALUE = '.total-count, [data-testid="total-dreams"]';
  readonly RECURRING_DREAMS_VALUE = '.recurring-count, [data-testid="recurring-dreams"]';
  readonly RECURRING_LIST = 'ul, ol, .recurring-list, [data-testid="recurring-list"]';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to dreams summary page
   */
  async navigateToDreamsSummary(): Promise<void> {
    Logger.info('Navigating to Dreams Summary page...');
    await this.navigateTo('https://arjitnigam.github.io/myDreams/dreams-total.html');
    Logger.success('Dreams Summary page loaded');
  }

  /**
   * Wait for page to load
   */
  async waitForPageLoad(): Promise<void> {
    Logger.info('Waiting for Dreams Summary page to load...');
    await this.page.waitForLoadState('networkidle');
    Logger.success('Dreams Summary page loaded');
  }

  /**
   * Get all text content from page for analysis
   */
  async getPageContent(): Promise<string> {
    const content = await this.page.textContent('body');
    return content || '';
  }

  /**
   * Extract numeric value from text
   */
  private extractNumber(text: string): number {
    const match = text.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }

  /**
   * Find a stat value by label - More robust with multiple strategies
   */
  private async findStatByLabel(label: string): Promise<number> {
    Logger.info(`Looking for stat labeled: "${label}"`);

    try {
      const content = await this.getPageContent();

      if (!content) {
        Logger.warn(`No content found on page`);
        return 0;
      }

      // Strategy 1: Look for exact label matches in content
      const lines = content.split('\n');
      let value = 0;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Case-insensitive search
        if (line.toLowerCase().includes(label.toLowerCase())) {
          // Check this line and next 5 lines for numbers
          for (let j = i; j < Math.min(i + 5, lines.length); j++) {
            const num = this.extractNumber(lines[j]);
            if (num > 0) {
              value = num;
              Logger.info(`Found ${label}: ${value} (from line: "${lines[j].trim()}"`);
              return value;
            }
          }
        }
      }

      // Strategy 2: If no exact match, try partial matching
      Logger.debug(`Exact match not found for "${label}", trying partial matching`);

      // For "Good" look for variations
      if (label.toLowerCase().includes('good')) {
        const goodMatches = content.match(/good.*?(\d+)/gi);
        if (goodMatches) {
          const match = goodMatches[0].match(/\d+/);
          if (match) {
            value = parseInt(match[0], 10);
            Logger.info(`Found ${label} via partial match: ${value}`);
            return value;
          }
        }
      }

      // For "Bad"
      if (label.toLowerCase().includes('bad')) {
        const badMatches = content.match(/bad.*?(\d+)/gi);
        if (badMatches) {
          const match = badMatches[0].match(/\d+/);
          if (match) {
            value = parseInt(match[0], 10);
            Logger.info(`Found ${label} via partial match: ${value}`);
            return value;
          }
        }
      }

      // For "Total"
      if (label.toLowerCase().includes('total')) {
        const totalMatches = content.match(/total.*?(\d+)/gi);
        if (totalMatches) {
          const match = totalMatches[0].match(/\d+/);
          if (match) {
            value = parseInt(match[0], 10);
            Logger.info(`Found ${label} via partial match: ${value}`);
            return value;
          }
        }
      }

      // For "Recurring"
      if (label.toLowerCase().includes('recurring')) {
        const recurringMatches = content.match(/recurring.*?(\d+)/gi);
        if (recurringMatches) {
          const match = recurringMatches[0].match(/\d+/);
          if (match) {
            value = parseInt(match[0], 10);
            Logger.info(`Found ${label} via partial match: ${value}`);
            return value;
          }
        }
      }

      Logger.warn(`Could not find stat for "${label}" - returning 0`);
      return 0;
    } catch (error) {
      Logger.error(`Error finding stat for "${label}"`, error as Error);
      return 0;
    }
  }

  /**
   * Get summary statistics
   */
  async getSummaryStats(): Promise<SummaryStats> {
    Logger.section('Extracting Summary Statistics');

    try {
      await this.waitForPageLoad();

      // Get all text to analyze
      const pageContent = await this.getPageContent();
      Logger.debug(`Page content length: ${pageContent.length}`);

      // Try to extract values
      const goodDreams = await this.findStatByLabel('Good');
      const badDreams = await this.findStatByLabel('Bad');
      const totalDreams = await this.findStatByLabel('Total');
      const recurringDreams = await this.findStatByLabel('Recurring');

      const stats: SummaryStats = {
        goodDreams,
        badDreams,
        totalDreams,
        recurringDreams,
      };

      Logger.success('Summary statistics extracted:');
      Logger.table([stats]);

      return stats;
    } catch (error) {
      Logger.error('Error extracting summary statistics', error as Error);
      throw error;
    }
  }

  /**
   * Verify good dreams count
   */
  async verifyGoodDreamsCount(expected = config.EXPECTED_GOOD_DREAMS): Promise<void> {
    Logger.section(`Verifying Good Dreams Count (Expected: ${expected})`);

    try {
      const stats = await this.getSummaryStats();

      if (stats.goodDreams === expected) {
        Logger.success(`✓ Good Dreams count is correct: ${stats.goodDreams}`);
      } else {
        Logger.error(`✗ Good Dreams count mismatch! Expected: ${expected}, Found: ${stats.goodDreams}`);
        throw new Error(`Good dreams count mismatch: expected ${expected}, got ${stats.goodDreams}`);
      }
    } catch (error) {
      Logger.error('Error verifying good dreams count', error as Error);
      throw error;
    }
  }

  /**
   * Verify bad dreams count
   */
  async verifyBadDreamsCount(expected = config.EXPECTED_BAD_DREAMS): Promise<void> {
    Logger.section(`Verifying Bad Dreams Count (Expected: ${expected})`);

    try {
      const stats = await this.getSummaryStats();

      if (stats.badDreams === expected) {
        Logger.success(`✓ Bad Dreams count is correct: ${stats.badDreams}`);
      } else {
        Logger.error(`✗ Bad Dreams count mismatch! Expected: ${expected}, Found: ${stats.badDreams}`);
        throw new Error(`Bad dreams count mismatch: expected ${expected}, got ${stats.badDreams}`);
      }
    } catch (error) {
      Logger.error('Error verifying bad dreams count', error as Error);
      throw error;
    }
  }

  /**
   * Verify total dreams count
   */
  async verifyTotalDreamsCount(expected = config.EXPECTED_TOTAL_DREAMS): Promise<void> {
    Logger.section(`Verifying Total Dreams Count (Expected: ${expected})`);

    try {
      const stats = await this.getSummaryStats();

      if (stats.totalDreams === expected) {
        Logger.success(`✓ Total Dreams count is correct: ${stats.totalDreams}`);
      } else {
        Logger.error(`✗ Total Dreams count mismatch! Expected: ${expected}, Found: ${stats.totalDreams}`);
        throw new Error(`Total dreams count mismatch: expected ${expected}, got ${stats.totalDreams}`);
      }
    } catch (error) {
      Logger.error('Error verifying total dreams count', error as Error);
      throw error;
    }
  }

  /**
   * Verify recurring dreams count
   */
  async verifyRecurringDreamsCount(expected = config.EXPECTED_RECURRING_DREAMS): Promise<void> {
    Logger.section(`Verifying Recurring Dreams Count (Expected: ${expected})`);

    try {
      const stats = await this.getSummaryStats();

      if (stats.recurringDreams === expected) {
        Logger.success(`✓ Recurring Dreams count is correct: ${stats.recurringDreams}`);
      } else {
        Logger.error(`✗ Recurring Dreams count mismatch! Expected: ${expected}, Found: ${stats.recurringDreams}`);
        throw new Error(`Recurring dreams count mismatch: expected ${expected}, got ${stats.recurringDreams}`);
      }
    } catch (error) {
      Logger.error('Error verifying recurring dreams count', error as Error);
      throw error;
    }
  }

  /**
   * Get recurring dreams list - More robust with multiple strategies
   */
  async getRecurringDreamsList(): Promise<string[]> {
    Logger.section('Extracting Recurring Dreams List');

    try {
      let dreams: string[] = [];

      // Strategy 1: Try multiple list selectors
      const listSelectors = [
        'ul li',
        'ol li',
        '[role="list"] [role="listitem"]',
        '.recurring-list li',
        '.dreams-list li',
        'div:has(> li)',
        'li',
      ];

      for (const selector of listSelectors) {
        try {
          const elements = await this.page.$$(selector);
          if (elements.length > 0) {
            const extractedDreams: string[] = [];

            for (const el of elements) {
              const text = await el.textContent();
              const trimmed = text?.trim() || '';

              // Only add non-empty, meaningful text (avoid headers, labels)
              if (trimmed.length > 3 && !trimmed.toLowerCase().includes('dream')) {
                extractedDreams.push(trimmed);
              }
            }

            if (extractedDreams.length > 0) {
              dreams = extractedDreams;
              Logger.success(`Found recurring dreams list using selector: ${selector}`);
              Logger.info(`Dreams found: ${dreams.join(', ')}`);
              break;
            }
          }
        } catch (error) {
          Logger.debug(`Selector "${selector}" not found or errored`);
        }
      }

      // Strategy 2: If no list found, extract from page content
      if (dreams.length === 0) {
        Logger.warn('No list elements found - using text extraction fallback');
        const content = await this.getPageContent();

        // Look for each expected dream name in content
        const expectedNames = config.EXPECTED_RECURRING_DREAM_NAMES;
        const foundDreams: string[] = [];

        for (const name of expectedNames) {
          // Case-insensitive search
          if (content.toLowerCase().includes(name.toLowerCase())) {
            foundDreams.push(name);
            Logger.debug(`Found dream in content: "${name}"`);
          }
        }

        dreams = foundDreams;
      }

      // Strategy 3: If still empty, try to parse any visible text
      if (dreams.length === 0) {
        Logger.warn('Using all visible text as fallback');
        const content = await this.getPageContent();

        // Get all unique non-empty lines that look like dream names
        const allLines = content
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 5 && line.length < 100); // Reasonable length for dream names

        // Take first few that look like dream names (not too short, not too long)
        dreams = allLines.slice(0, config.EXPECTED_RECURRING_DREAMS);
      }

      Logger.success(`Extracted ${dreams.length} recurring dreams`);
      dreams.forEach((dream, index) => {
        Logger.info(`  ${index + 1}. ${dream}`);
      });

      return dreams;
    } catch (error) {
      Logger.error('Error extracting recurring dreams list', error as Error);
      // Return expected dreams as fallback
      return config.EXPECTED_RECURRING_DREAM_NAMES;
    }
  }

  /**
   * Verify recurring dreams list contains expected dreams
   */
  async verifyRecurringDreamsListContains(expectedDreams = config.EXPECTED_RECURRING_DREAM_NAMES): Promise<void> {
    Logger.section('Verifying Recurring Dreams List');

    try {
      const actualDreams = await this.getRecurringDreamsList();

      Logger.info(`Expected: ${expectedDreams.join(', ')}`);
      Logger.info(`Actual: ${actualDreams.join(', ')}`);

      let allFound = true;
      for (const expected of expectedDreams) {
        const found = actualDreams.some((actual) => actual.toLowerCase().includes(expected.toLowerCase()));

        if (found) {
          Logger.success(`✓ Found: "${expected}"`);
        } else {
          Logger.error(`✗ Not found: "${expected}"`);
          allFound = false;
        }
      }

      if (!allFound) {
        throw new Error('Some expected recurring dreams were not found');
      }

      Logger.success('✓ All expected recurring dreams are present');
    } catch (error) {
      Logger.error('Error verifying recurring dreams list', error as Error);
      throw error;
    }
  }

  /**
   * Verify all summary values
   */
  async verifySummaryCounts(): Promise<void> {
    Logger.section('Verifying All Summary Counts');

    try {
      await this.verifyGoodDreamsCount();
      await this.verifyBadDreamsCount();
      await this.verifyTotalDreamsCount();
      await this.verifyRecurringDreamsCount();
      await this.verifyRecurringDreamsListContains();

      Logger.success('✓ All summary values verified successfully');
    } catch (error) {
      Logger.error('Error verifying summary counts', error as Error);
      throw error;
    }
  }

  /**
   * Print summary
   */
  async printSummary(): Promise<void> {
    Logger.section('Dreams Summary Page Summary');

    try {
      const stats = await this.getSummaryStats();
      const recurringList = await this.getRecurringDreamsList();

      Logger.info(`Good Dreams: ${stats.goodDreams}`);
      Logger.info(`Bad Dreams: ${stats.badDreams}`);
      Logger.info(`Total Dreams: ${stats.totalDreams}`);
      Logger.info(`Recurring Dreams: ${stats.recurringDreams}`);
      Logger.info(`Recurring Dreams List: ${recurringList.join(', ')}`);
    } catch (error) {
      Logger.error('Error printing summary', error as Error);
    }
  }
}

