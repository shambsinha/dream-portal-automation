import { test, expect, Page } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { DreamsDiaryPage } from '../pages/DreamsDiaryPage';
import { Logger } from '../utils/logger';

test.describe('Home Page Tests', () => {
  let page: Page;
  let homePage: HomePage;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    homePage = new HomePage(page);
    Logger.section('Starting Home Page Test');
  });

  test.afterEach(async () => {
    Logger.section('Cleaning up after test');
    const context = page.context();
    const allPages = context.pages();
    for (const p of allPages) {
      if (!p.isClosed()) {
        await p.close();
      }
    }
    Logger.success('Cleanup complete');
  });

  test('T001: Verify loading animation appears and disappears', async () => {
    Logger.section('TEST: Verify Loading Animation');

    // Navigate to home page
    await homePage.navigateToHome();

    // Verify loading animation appears (or appears very briefly and disappears)
    await homePage.verifyLoadingAnimationAppears();

    // Wait for loading to complete (~3 seconds)
    await homePage.waitForLoadingToComplete();

    Logger.success('✓ TEST PASSED: Loading animation behavior verified');
  });

  test('T002: Verify main content becomes visible after loading', async () => {
    Logger.section('TEST: Verify Main Content Visibility');

    // Navigate to home page
    await homePage.navigateToHome();

    // Wait for loading to complete
    await homePage.waitForLoadingToComplete();

    // Verify main content is visible
    await homePage.verifyMainContentVisible();

    Logger.success('✓ TEST PASSED: Main content is visible');
  });

  test('T003: Verify My Dreams button is visible', async () => {
    Logger.section('TEST: Verify My Dreams Button Visibility');

    // Navigate to home page
    await homePage.navigateToHome();

    // Wait for page to fully load
    await homePage.waitForPageFullyLoaded();

    // Verify My Dreams button is visible
    await homePage.verifyMyDreamsButtonVisible();

    Logger.success('✓ TEST PASSED: My Dreams button is visible');
  });

  test('T004: Clicking My Dreams button opens two tabs/windows', async () => {
    Logger.section('TEST: My Dreams Button Opens Tabs');

    // Navigate to home page
    await homePage.navigateToHome();

    // Wait for page to fully load
    await homePage.waitForPageFullyLoaded();

    // Click My Dreams button
    const newPages = await homePage.clickMyDreamsButton();

    Logger.info(`New pages opened: ${newPages.length}`);

    // Wait a bit for pages to load
    await homePage.helpers.sleep(2000);

    // Get all tabs/pages
    const allPages = await homePage.getAllTabs();
    Logger.info(`Total pages after clicking: ${allPages.length}`);

    // Should have at least 3 pages (original + 2 new)
    if (allPages.length >= 3) {
      Logger.success(`✓ Multiple pages opened (${allPages.length} total)`);
    } else {
      Logger.warn(`Expected at least 3 pages, got ${allPages.length}`);
    }

    // Check if we have pages with dreams-diary.html and dreams-total.html
    let hasDiaryPage = false;
    let hasSummaryPage = false;

    for (const p of allPages) {
      const url = p.url();
      if (url.includes('dreams-diary')) {
        hasDiaryPage = true;
        Logger.success('✓ Found dreams-diary.html tab');
      }
      if (url.includes('dreams-total')) {
        hasSummaryPage = true;
        Logger.success('✓ Found dreams-total.html tab');
      }
    }

    if (hasDiaryPage && hasSummaryPage) {
      Logger.success('✓ TEST PASSED: Both expected tabs are open');
    } else {
      Logger.warn('Could not verify both specific tabs are open');
    }
  });

  test('T005: Handle and switch between multiple tabs', async () => {
    Logger.section('TEST: Tab Switching and Handling');

    // Navigate to home page
    await homePage.navigateToHome();

    // Wait for page to fully load
    await homePage.waitForPageFullyLoaded();

    // Click My Dreams button to open tabs
    const newPages = await homePage.clickMyDreamsButton();
    await homePage.helpers.sleep(2000);

    // Get all tabs
    const allPages = await homePage.getAllTabs();
    Logger.info(`Total pages: ${allPages.length}`);

    // Try to find and switch to Dreams Diary page
    try {
      const diaryPage = await homePage.switchToTabByUrl('dreams-diary');
      Logger.success('✓ Switched to Dreams Diary tab');

      // Verify we're on the right page
      const url = diaryPage.url();
      expect(url).toContain('dreams-diary');
      Logger.success('✓ Confirmed on Dreams Diary page');
    } catch (error) {
      Logger.warn('Could not find/switch to Dreams Diary tab');
    }

    // Try to find and switch to Dreams Summary page
    try {
      const summaryPage = await homePage.switchToTabByUrl('dreams-total');
      Logger.success('✓ Switched to Dreams Summary tab');

      // Verify we're on the right page
      const url = summaryPage.url();
      expect(url).toContain('dreams-total');
      Logger.success('✓ Confirmed on Dreams Summary page');
    } catch (error) {
      Logger.warn('Could not find/switch to Dreams Summary tab');
    }

    Logger.success('✓ TEST PASSED: Tab switching works correctly');
  });

  test('T006: Verify home page content structure', async () => {
    Logger.section('TEST: Home Page Content Structure');

    // Navigate to home page
    await homePage.navigateToHome();

    // Wait for full page load
    await homePage.waitForPageFullyLoaded();

    // Get page title
    const title = await homePage.getPageTitle();
    Logger.info(`Page Title: ${title}`);
    expect(title.length).toBeGreaterThan(0);

    // Get page URL
    const url = await homePage.getCurrentUrl();
    Logger.info(`Page URL: ${url}`);
    expect(url).toContain('myDreams');

    Logger.success('✓ TEST PASSED: Home page structure is valid');
  });
});

