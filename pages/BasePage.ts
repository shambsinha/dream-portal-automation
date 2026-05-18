import { Page, expect } from '@playwright/test';
import { Logger } from '../utils/logger';
import { TestHelpers } from '../utils/helpers';
import config from '../config/config';

export class BasePage {
  protected page: Page;
  public helpers: typeof TestHelpers;

  constructor(page: Page) {
    this.page = page;
    this.helpers = TestHelpers;
  }

  /**
   * Navigate to a specific URL
   */
  async navigateTo(url: string = config.BASE_URL): Promise<void> {
    Logger.info(`Navigating to: ${url}`);
    await this.page.goto(url, { waitUntil: 'load' });
    Logger.success(`Successfully navigated to: ${url}`);
  }

  /**
   * Get current URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Get page title
   */
  async getPageTitle(): Promise<string> {
    return this.page.title();
  }

  /**
   * Wait for page load
   */
  async waitForPageLoad(): Promise<void> {
    Logger.info('Waiting for page to load...');
    await this.page.waitForLoadState('load');
    Logger.success('Page loaded');
  }

  /**
   * Wait for network to be idle
   */
  async waitForNetworkIdle(): Promise<void> {
    Logger.info('Waiting for network to be idle...');
    await this.page.waitForLoadState('networkidle');
    Logger.success('Network idle');
  }

  /**
   * Verify element is visible
   */
  async isElementVisible(selector: string): Promise<boolean> {
    const element = await this.page.$(selector);
    return element !== null && (await element.isVisible());
  }

  /**
   * Verify element exists
   */
  async elementExists(selector: string): Promise<boolean> {
    return (await this.page.$(selector)) !== null;
  }

  /**
   * Get element count
   */
  async getElementCount(selector: string): Promise<number> {
    return this.page.locator(selector).count();
  }

  /**
   * Click on element
   */
  async click(selector: string): Promise<void> {
    await this.helpers.clickElement(this.page, selector);
  }

  /**
   * Type text into element
   */
  async typeText(selector: string, text: string): Promise<void> {
    Logger.info(`Typing "${text}" into element: ${selector}`);
    await this.page.fill(selector, text);
    Logger.success(`Text typed successfully`);
  }

  /**
   * Get text from element
   */
  async getText(selector: string): Promise<string> {
    return this.helpers.getElementText(this.page, selector);
  }

  /**
   * Get attribute value
   */
  async getAttribute(selector: string, attribute: string): Promise<string | null> {
    Logger.info(`Getting attribute "${attribute}" from element: ${selector}`);
    return this.page.getAttribute(selector, attribute);
  }

  /**
   * Take screenshot
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.helpers.takeScreenshot(this.page, name);
  }

  /**
   * Close page
   */
  async closePage(): Promise<void> {
    Logger.info('Closing page...');
    await this.page.close();
    Logger.success('Page closed');
  }

  /**
   * Get all element texts
   */
  async getAllTexts(selector: string): Promise<string[]> {
    Logger.info(`Getting all texts from elements: ${selector}`);
    const texts = await this.page.locator(selector).allTextContents();
    return texts.map((t) => t.trim());
  }

  /**
   * Wait for element
   */
  async waitForElement(selector: string, timeout = config.TIMEOUT): Promise<void> {
    await this.helpers.waitForElementVisible(this.page, selector, timeout);
  }

  /**
   * Scroll element into view
   */
  async scrollIntoView(selector: string): Promise<void> {
    Logger.info(`Scrolling element into view: ${selector}`);
    await this.page.locator(selector).scrollIntoViewIfNeeded();
    Logger.success(`Element scrolled into view`);
  }

  /**
   * Hover over element
   */
  async hover(selector: string): Promise<void> {
    Logger.info(`Hovering over element: ${selector}`);
    await this.page.hover(selector);
    Logger.success(`Hovered successfully`);
  }

  /**
   * Double click element
   */
  async doubleClick(selector: string): Promise<void> {
    Logger.info(`Double-clicking element: ${selector}`);
    await this.page.dblclick(selector);
    Logger.success(`Double-clicked successfully`);
  }

  /**
   * Right click element
   */
  async rightClick(selector: string): Promise<void> {
    Logger.info(`Right-clicking element: ${selector}`);
    await this.page.click(selector, { button: 'right' });
    Logger.success(`Right-clicked successfully`);
  }

  /**
   * Press key
   */
  async pressKey(key: string): Promise<void> {
    Logger.info(`Pressing key: ${key}`);
    await this.page.keyboard.press(key);
    Logger.success(`Key pressed`);
  }

  /**
   * Reload page
   */
  async reloadPage(): Promise<void> {
    Logger.info('Reloading page...');
    await this.page.reload();
    Logger.success('Page reloaded');
  }
}

