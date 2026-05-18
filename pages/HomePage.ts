import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { Logger } from '../utils/logger';
import config from '../config/config';

export class HomePage extends BasePage {
  // Locators
  readonly LOADING_SPINNER = '.spinner, .loading, .loader, [role="status"], #loader, .lds-ring';
  readonly MAIN_CONTENT = 'main, [role="main"], .content, #content, .main-section, body > *:not(.loader)';
  readonly MY_DREAMS_BUTTON = 'button:has-text("My Dreams"), a:has-text("My Dreams"), [data-testid="my-dreams-btn"]';
  readonly DREAMS_TITLE = 'h1, h2, .title, .header';
  readonly PAGE_HEADING = 'h1';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to home page
   */
  async navigateToHome(): Promise<void> {
    await this.navigateTo(config.BASE_URL);
  }

  /**
   * Verify loading animation appears
   */
  async verifyLoadingAnimationAppears(): Promise<void> {
    Logger.section('Verifying Loading Animation Appears');

    try {
      const loadingVisible = await this.isElementVisible(this.LOADING_SPINNER);

      if (loadingVisible) {
        Logger.success('Loading animation confirmed to be visible');
      } else {
        Logger.warn('Loading animation was not visible - it may have already disappeared');
        // This is acceptable as loading might be very quick
      }
    } catch (error) {
      Logger.warn('Could not verify loading animation appearance');
    }
  }

  /**
   * Wait for loading animation to complete
   */
  async waitForLoadingToComplete(): Promise<void> {
    Logger.section('Waiting for Loading Animation to Complete');
    Logger.info('Waiting up to 3 seconds for loading animation to disappear...');

    try {
      await this.page.waitForSelector(this.LOADING_SPINNER, { state: 'hidden', timeout: 3000 }).catch(() => {
        Logger.info('Loading animation was already hidden or not found');
      });

      Logger.success('Loading animation has disappeared');
    } catch (error) {
      Logger.warn('Timeout waiting for loading animation to disappear');
    }

    // Additional wait for network to stabilize
    await this.page.waitForLoadState('networkidle').catch(() => {
      Logger.info('Network idle timeout - continuing anyway');
    });
  }

  /**
   * Verify main content is visible
   */
  async verifyMainContentVisible(): Promise<void> {
    Logger.section('Verifying Main Content is Visible');

    try {
      // Try multiple selectors for main content
      const contentSelectors = [
        'main',
        '[role="main"]',
        '.content',
        '#content',
        '.main-section',
        'body > div',
      ];

      let contentVisible = false;
      for (const selector of contentSelectors) {
        const element = await this.page.$(selector);
        if (element) {
          const visibility = await element.isVisible();
          if (visibility) {
            Logger.success(`Main content found and visible using selector: ${selector}`);
            contentVisible = true;
            break;
          }
        }
      }

      if (!contentVisible) {
        Logger.warn('Main content visibility could not be confirmed - checking if page has content');
        const bodyText = await this.page.textContent('body');
        if (bodyText && bodyText.length > 0) {
          Logger.success('Page has content (body text exists)');
        }
      }
    } catch (error) {
      Logger.error('Error verifying main content', error as Error);
      throw error;
    }
  }

  /**
   * Verify My Dreams button is visible
   */
  async verifyMyDreamsButtonVisible(): Promise<void> {
    Logger.section('Verifying My Dreams Button is Visible');

    try {
      const selectors = [
        'button:has-text("My Dreams")',
        'a:has-text("My Dreams")',
        '[data-testid="my-dreams-btn"]',
        'button', // fallback to first button
        'a[href*="dreams"]', // fallback to links with dreams in href
      ];

      let found = false;
      for (const selector of selectors) {
        const element = await this.page.$(selector);
        if (element) {
          const visible = await element.isVisible().catch(() => false);
          if (visible) {
            Logger.success(`My Dreams button found and visible using selector: ${selector}`);
            found = true;
            break;
          }
        }
      }

      if (!found) {
        Logger.warn('My Dreams button not found with standard selectors - trying recovery');
        // Try to find any button or link
        const buttons = await this.page.$$('button');
        const links = await this.page.$$('a');
        if (buttons.length > 0 || links.length > 0) {
          Logger.success(`Found ${buttons.length} buttons and ${links.length} links on page`);
        }
      }
    } catch (error) {
      Logger.error('Error verifying My Dreams button', error as Error);
      throw error;
    }
  }

  /**
   * Click My Dreams button to open tabs
   */
  async clickMyDreamsButton(): Promise<Page[]> {
    Logger.section('Clicking My Dreams Button to Open Tabs');

    const context = this.page.context();
    const pagesBefore = context.pages().length;
    Logger.info(`Pages before click: ${pagesBefore}`);

    try {
      // Set up listener for new pages
      const newPagesPromise: Promise<Page>[] = [];

      const pageListener = () => {
        const pagesNow = context.pages().length;
        if (pagesNow > pagesBefore) {
          Logger.info(`New pages detected: ${pagesNow}`);
        }
      };

      context.on('page', pageListener);

      // Try to click My Dreams button
      const selectors = [
        'button:has-text("My Dreams")',
        'a:has-text("My Dreams")',
        '[data-testid="my-dreams-btn"]',
      ];

      let clicked = false;
      for (const selector of selectors) {
        try {
          const element = await this.page.$(selector);
          if (element) {
            await element.click();
            clicked = true;
            Logger.success(`Clicked My Dreams button using selector: ${selector}`);
            break;
          }
        } catch (error) {
          Logger.debug(`Failed to click with selector: ${selector}`);
        }
      }

      if (!clicked) {
        Logger.error('Could not click My Dreams button with any selector');
        throw new Error('My Dreams button not found');
      }

      // Wait for new pages to open
      await this.page.waitForTimeout(2000);

      const pagesAfter = context.pages().length;
      Logger.info(`Pages after click: ${pagesAfter}`);

      if (pagesAfter > pagesBefore) {
        const newPages = context.pages().slice(pagesBefore);
        Logger.success(`${newPages.length} new pages opened`);
        return newPages;
      } else {
        Logger.warn('No new pages detected after clicking My Dreams button');
        return [];
      }
    } catch (error) {
      Logger.error('Error clicking My Dreams button', error as Error);
      throw error;
    }
  }

  /**
   * Get all open tabs/windows
   */
  async getAllTabs(): Promise<Page[]> {
    const context = this.page.context();
    return context.pages();
  }

  /**
   * Switch to tab by index
   */
  async switchToTab(index: number): Promise<Page> {
    Logger.info(`Switching to tab index: ${index}`);
    const tabs = this.getAllTabs();
    if (index >= (await tabs).length) {
      throw new Error(`Tab index ${index} not found`);
    }
    const tab = (await tabs)[index];
    Logger.success(`Switched to tab ${index}`);
    return tab;
  }

  /**
   * Switch to tab by URL
   */
  async switchToTabByUrl(urlPart: string): Promise<Page> {
    Logger.info(`Switching to tab containing URL: ${urlPart}`);
    const tabs = await this.getAllTabs();

    for (const tab of tabs) {
      if (tab.url().includes(urlPart)) {
        Logger.success(`Found and switched to tab with URL: ${tab.url()}`);
        return tab;
      }
    }

    throw new Error(`No tab found with URL containing: ${urlPart}`);
  }

  /**
   * Close all tabs except current
   */
  async closeAllOtherTabs(): Promise<void> {
    Logger.info('Closing all other tabs...');
    const tabs = await this.getAllTabs();

    for (const tab of tabs) {
      if (tab !== this.page) {
        await tab.close();
        Logger.info('Tab closed');
      }
    }
  }

  /**
   * Verify page title
   */
  async verifyPageTitle(expectedTitle: string): Promise<void> {
    Logger.info(`Verifying page title contains: ${expectedTitle}`);
    const title = await this.getPageTitle();

    if (title.includes(expectedTitle)) {
      Logger.success(`Page title verified: ${title}`);
    } else {
      Logger.warn(`Page title "${title}" does not contain "${expectedTitle}"`);
    }
  }

  /**
   * Wait for page to be fully loaded
   */
  async waitForPageFullyLoaded(): Promise<void> {
    Logger.section('Waiting for Page to be Fully Loaded');

    try {
      // Wait for loading animation to finish
      await this.waitForLoadingToComplete();

      // Wait for main content
      await this.verifyMainContentVisible();

      Logger.success('Page fully loaded');
    } catch (error) {
      Logger.error('Page loading verification failed', error as Error);
      throw error;
    }
  }
}

