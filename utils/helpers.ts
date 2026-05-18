import { Page, expect } from '@playwright/test';
import { Logger } from './logger';
import config from '../config/config';

export class TestHelpers {
  /**
   * Wait for element to be visible and stable
   */
  static async waitForElementVisible(page: Page, selector: string, timeout = config.TIMEOUT): Promise<void> {
    Logger.info(`Waiting for element to be visible: ${selector}`);
    try {
      await page.waitForSelector(selector, { state: 'visible', timeout });
      await page.waitForLoadState('networkidle');
      Logger.success(`Element is visible: ${selector}`);
    } catch (error) {
      Logger.error(`Element not found or timed out: ${selector}`, error as Error);
      throw error;
    }
  }

  /**
   * Wait for element to be hidden
   */
  static async waitForElementHidden(page: Page, selector: string, timeout = config.TIMEOUT): Promise<void> {
    Logger.info(`Waiting for element to be hidden: ${selector}`);
    try {
      await page.waitForSelector(selector, { state: 'hidden', timeout });
      Logger.success(`Element is hidden: ${selector}`);
    } catch (error) {
      Logger.error(`Element wait timeout: ${selector}`, error as Error);
      throw error;
    }
  }

  /**
   * Wait for loading animation to disappear
   */
  static async waitForLoadingToComplete(page: Page, timeout = config.LOADING_ANIMATION_TIMEOUT): Promise<void> {
    Logger.info('Waiting for loading animation to complete...');

    const loaders = [
      '.loading-spinner',
      '.loader',
      '[role="status"]',
      '.loading',
      '#loader',
      '.spin',
      '.lds-ring',
    ];

    for (const loader of loaders) {
      const element = await page.$(loader);
      if (element) {
        Logger.debug(`Found loader: ${loader}`);
        try {
          await page.waitForSelector(loader, { state: 'hidden', timeout });
          Logger.success(`Loading animation disappeared: ${loader}`);
          return;
        } catch (error) {
          Logger.warn(`Timeout waiting for loader to hide: ${loader}`);
        }
      }
    }

    Logger.info('No loading animation found or already hidden');
  }

  /**
   * Click element and handle errors
   */
  static async clickElement(page: Page, selector: string, timeout = config.ACTION_TIMEOUT): Promise<void> {
    Logger.info(`Clicking element: ${selector}`);
    try {
      await page.click(selector, { timeout });
      Logger.success(`Successfully clicked: ${selector}`);
    } catch (error) {
      Logger.error(`Failed to click element: ${selector}`, error as Error);
      throw error;
    }
  }

  /**
   * Get all rows from a table
   */
  static async getTableRows(page: Page, tableSelector: string): Promise<string[][]> {
    Logger.info(`Extracting rows from table: ${tableSelector}`);

    const rows = await page.$$eval(
      `${tableSelector} tbody tr`,
      (elements) => {
        return elements.map((row) => {
          const cells = row.querySelectorAll('td');
          return Array.from(cells).map((cell) => cell.textContent?.trim() || '');
        });
      }
    );

    Logger.success(`Found ${rows.length} rows in table`);
    return rows;
  }

  /**
   * Get all table headers
   */
  static async getTableHeaders(page: Page, tableSelector: string): Promise<string[]> {
    Logger.info(`Extracting headers from table: ${tableSelector}`);

    const headers = await page.$$eval(
      `${tableSelector} thead th`,
      (elements) => elements.map((th) => th.textContent?.trim() || '')
    );

    Logger.success(`Found ${headers.length} headers: ${headers.join(', ')}`);
    return headers;
  }

  /**
   * Get text content from element
   */
  static async getElementText(page: Page, selector: string): Promise<string> {
    Logger.info(`Getting text from element: ${selector}`);
    const text = await page.textContent(selector);
    Logger.success(`Text retrieved: ${text}`);
    return text?.trim() || '';
  }

  /**
   * Handle multiple tabs/windows
   */
  static async handleNewTab(page: Page): Promise<Page> {
    Logger.info('Waiting for new page/tab to open...');
    const newPage = await page.context().waitForEvent('page');
    await newPage.waitForLoadState('load');
    Logger.success('New page opened and loaded');
    return newPage;
  }

  /**
   * Wait for page navigation
   */
  static async waitForNavigation(page: Page, timeout = config.NAVIGATION_TIMEOUT): Promise<void> {
    Logger.info('Waiting for page navigation...');
    await page.waitForNavigation({ waitUntil: 'load', timeout }).catch(() => {
      Logger.warn('Page navigation timeout - but page might have loaded');
    });
    Logger.success('Page navigation complete');
  }

  /**
   * Take screenshot on failure
   */
  static async takeScreenshot(page: Page, name: string): Promise<void> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `test-results/screenshots/${name}-${timestamp}.png`;
      await page.screenshot({ path: filename });
      Logger.success(`Screenshot saved: ${filename}`);
    } catch (error) {
      Logger.error('Failed to take screenshot', error as Error);
    }
  }

  /**
   * Get numerical value from text
   */
  static extractNumber(text: string): number {
    const match = text.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }

  /**
   * Compare arrays ignoring order
   */
  static arraysEqual(arr1: string[], arr2: string[]): boolean {
    return arr1.length === arr2.length && arr1.every((item) => arr2.includes(item));
  }

  /**
   * Sleep for specified milliseconds
   */
  static async sleep(ms: number): Promise<void> {
    Logger.debug(`Sleeping for ${ms}ms`);
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Validate text matches pattern
   */
  static validatePattern(text: string, pattern: RegExp): boolean {
    return pattern.test(text);
  }
}

