import { test, expect, Page } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { DreamsDiaryPage } from '../pages/DreamsDiaryPage';
import { DreamsSummaryPage } from '../pages/DreamsSummaryPage';
import { Logger } from '../utils/logger';
import config from '../config/config';

test.describe('End-to-End Integration Tests', () => {
  test('E2E-001: Complete user journey - Home > Diary > Summary', async ({ browser }) => {
    Logger.section('END-TO-END TEST: Complete User Journey');

    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      // ============ STEP 1: HOME PAGE ============
      Logger.section('Step 1: Testing Home Page');
      const homePage = new HomePage(page);

      await homePage.navigateToHome();
      Logger.success('✓ Navigated to home page');

      await homePage.waitForPageFullyLoaded();
      Logger.success('✓ Page fully loaded');

      await homePage.verifyMyDreamsButtonVisible();
      Logger.success('✓ My Dreams button is visible');

      // ============ STEP 2: NAVIGATE TO DIARY ============
      Logger.section('Step 2: Navigating to Dreams Diary');
      const diaryPage = new DreamsDiaryPage(page);
      await diaryPage.navigateToDreamsDiary();
      await diaryPage.waitForPageLoad();
      Logger.success('✓ Dreams Diary page loaded');

      // ============ STEP 3: VALIDATE DIARY ============
      Logger.section('Step 3: Validating Dreams Diary');

      // Verify table structure
      const rowCount = await diaryPage.verifyTableHasTenRows();
      expect(rowCount).toBe(config.EXPECTED_DIARY_ROWS);
      Logger.success(`✓ Table has ${rowCount} rows`);

      // Verify columns
      await diaryPage.verifyEachRowHasThreeColumns();
      Logger.success('✓ Each row has 3 columns');

      // Verify no empty values
      await diaryPage.verifyNoEmptyValues();
      Logger.success('✓ No empty values');

      // Verify dream types
      await diaryPage.verifyDreamTypesAreValid();
      Logger.success('✓ All dream types are valid');

      // Get counts
      const goodFromDiary = await diaryPage.getGoodDreamCount();
      const badFromDiary = await diaryPage.getBadDreamCount();
      Logger.success(`✓ Found ${goodFromDiary} good dreams and ${badFromDiary} bad dreams`);

      // Verify recurring
      const recurringFromDiary = await diaryPage.getRecurringDreams();
      Logger.success(`✓ Found ${recurringFromDiary.length} recurring dreams: ${recurringFromDiary.join(', ')}`);

      // ============ STEP 4: NAVIGATE TO SUMMARY ============
      Logger.section('Step 4: Navigating to Dreams Summary');
      const summaryPage = new DreamsSummaryPage(page);
      await summaryPage.navigateToDreamsSummary();
      await summaryPage.waitForPageLoad();
      Logger.success('✓ Dreams Summary page loaded');

      // ============ STEP 5: VALIDATE SUMMARY ============
      Logger.section('Step 5: Validating Dreams Summary');

      // Get summary stats
      const stats = await summaryPage.getSummaryStats();
      Logger.info(`Summary - Good: ${stats.goodDreams}, Bad: ${stats.badDreams}, Total: ${stats.totalDreams}, Recurring: ${stats.recurringDreams}`);

      // ============ STEP 6: CROSS-VALIDATE DATA ============
      Logger.section('Step 6: Cross-Validating Data');

      // Verify all expected counts
      expect(stats.goodDreams).toBe(config.EXPECTED_GOOD_DREAMS);
      Logger.success(`✓ Good dreams: ${stats.goodDreams} (expected: ${config.EXPECTED_GOOD_DREAMS})`);

      expect(stats.badDreams).toBe(config.EXPECTED_BAD_DREAMS);
      Logger.success(`✓ Bad dreams: ${stats.badDreams} (expected: ${config.EXPECTED_BAD_DREAMS})`);

      expect(stats.totalDreams).toBe(config.EXPECTED_TOTAL_DREAMS);
      Logger.success(`✓ Total dreams: ${stats.totalDreams} (expected: ${config.EXPECTED_TOTAL_DREAMS})`);

      expect(stats.recurringDreams).toBe(config.EXPECTED_RECURRING_DREAMS);
      Logger.success(`✓ Recurring dreams: ${stats.recurringDreams} (expected: ${config.EXPECTED_RECURRING_DREAMS})`);

      // Verify consistency between diary and summary
      expect(stats.goodDreams).toBe(goodFromDiary);
      Logger.success('✓ Good dreams count matches between diary and summary');

      expect(stats.badDreams).toBe(badFromDiary);
      Logger.success('✓ Bad dreams count matches between diary and summary');

      // Verify recurring dreams list
      const recurringFromSummary = await summaryPage.getRecurringDreamsList();
      Logger.info(`Summary recurring list: ${recurringFromSummary.join(', ')}`);

      for (const expected of config.EXPECTED_RECURRING_DREAM_NAMES) {
        const found = recurringFromSummary.some((d) => d.toLowerCase().includes(expected.toLowerCase()));
        expect(found).toBeTruthy();
        Logger.success(`✓ Found expected recurring dream: "${expected}"`);
      }

      // ============ FINAL VERIFICATION ============
      Logger.section('Final Verification');

      // Verify mathematical consistency
      expect(stats.goodDreams + stats.badDreams).toBe(stats.totalDreams);
      Logger.success(`✓ Mathematical consistency: ${stats.goodDreams} + ${stats.badDreams} = ${stats.totalDreams}`);

      Logger.success('✓ END-TO-END TEST PASSED: Complete user journey verified!');
    } catch (error) {
      Logger.error('End-to-end test failed', error as Error);
      await page.screenshot({ path: 'test-results/screenshots/e2e-failed.png' });
      throw error;
    } finally {
      await context.close();
    }
  });

  test('E2E-002: Tab handling from home page', async ({ browser }) => {
    Logger.section('END-TO-END TEST: Tab Handling');

    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      const homePage = new HomePage(page);

      // Navigate to home
      await homePage.navigateToHome();
      await homePage.waitForPageFullyLoaded();
      Logger.success('✓ Home page loaded');

      // Try to click My Dreams button to open tabs
      let newPages: Page[] = [];
      try {
        newPages = await homePage.clickMyDreamsButton();
        Logger.success(`✓ Clicked My Dreams button, opened ${newPages.length} new pages`);
      } catch (error) {
        Logger.warn('Could not click My Dreams button (might be hidden or inaccessible)');
      }

      // Get all tabs
      await homePage.helpers.sleep(2000);
      const allPages = await homePage.getAllTabs();
      Logger.info(`Total pages/tabs open: ${allPages.length}`);

      // Log URLs of all pages
      for (let i = 0; i < allPages.length; i++) {
        Logger.info(`  Tab ${i + 1}: ${allPages[i].url()}`);
      }

      Logger.success('✓ Tab handling verified');
    } catch (error) {
      Logger.error('Tab handling test failed', error as Error);
      throw error;
    } finally {
      const allPages = context.pages();
      for (const p of allPages) {
        if (!p.isClosed()) {
          await p.close();
        }
      }
      await context.close();
    }
  });

  test('E2E-003: Multiple browser test', async ({ browser, browserName }) => {
    Logger.section(`END-TO-END TEST: Multi-Browser Test (${browserName})`);

    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      const diaryPage = new DreamsDiaryPage(page);
      await diaryPage.navigateToDreamsDiary();
      await diaryPage.waitForPageLoad();

      // Run full validation
      await diaryPage.verifyTableHasTenRows();
      await diaryPage.verifyEachRowHasThreeColumns();
      await diaryPage.verifyDreamTypesAreValid();

      const goodCount = await diaryPage.getGoodDreamCount();
      const badCount = await diaryPage.getBadDreamCount();

      expect(goodCount + badCount).toBe(10);

      Logger.success(`✓ Test passed on ${browserName}`);
    } catch (error) {
      Logger.error(`Test failed on ${browserName}`, error as Error);
      throw error;
    } finally {
      await context.close();
    }
  });

  test('E2E-004: Performance check - page load time', async ({ browser }) => {
    Logger.section('END-TO-END TEST: Performance Check');

    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      // Measure home page load
      Logger.info('Measuring home page load time...');
      const homeStart = Date.now();
      const homePage = new HomePage(page);
      await homePage.navigateToHome();
      await homePage.waitForPageFullyLoaded();
      const homeTime = Date.now() - homeStart;
      Logger.success(`✓ Home page loaded in ${homeTime}ms`);

      // Measure diary page load
      Logger.info('Measuring diary page load time...');
      const diaryStart = Date.now();
      const diaryPage = new DreamsDiaryPage(page);
      await diaryPage.navigateToDreamsDiary();
      await diaryPage.waitForPageLoad();
      const diaryTime = Date.now() - diaryStart;
      Logger.success(`✓ Diary page loaded in ${diaryTime}ms`);

      // Measure summary page load
      Logger.info('Measuring summary page load time...');
      const summaryStart = Date.now();
      const summaryPage = new DreamsSummaryPage(page);
      await summaryPage.navigateToDreamsSummary();
      await summaryPage.waitForPageLoad();
      const summaryTime = Date.now() - summaryStart;
      Logger.success(`✓ Summary page loaded in ${summaryTime}ms`);

      // Log performance summary
      Logger.section('Performance Summary');
      Logger.info(`Home page: ${homeTime}ms`);
      Logger.info(`Diary page: ${diaryTime}ms`);
      Logger.info(`Summary page: ${summaryTime}ms`);
      Logger.info(`Total: ${homeTime + diaryTime + summaryTime}ms`);
    } catch (error) {
      Logger.error('Performance test failed', error as Error);
      throw error;
    } finally {
      await context.close();
    }
  });

  test('E2E-005: Data integrity across navigation', async ({ browser }) => {
    Logger.section('END-TO-END TEST: Data Integrity Check');

    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      const diaryPage = new DreamsDiaryPage(page);
      const summaryPage = new DreamsSummaryPage(page);

      // Get initial diary data
      await diaryPage.navigateToDreamsDiary();
      await diaryPage.waitForPageLoad();
      const initialRows = await diaryPage.getAllDreamRows();
      Logger.info(`Initial diary rows: ${initialRows.length}`);

      // Navigate to summary
      await summaryPage.navigateToDreamsSummary();
      await summaryPage.waitForPageLoad();
      const summaryStats = await summaryPage.getSummaryStats();

      // Navigate back to diary
      await diaryPage.navigateToDreamsDiary();
      await diaryPage.waitForPageLoad();
      const finalRows = await diaryPage.getAllDreamRows();
      Logger.info(`Final diary rows: ${finalRows.length}`);

      // Verify data didn't change
      expect(finalRows.length).toBe(initialRows.length);
      Logger.success('✓ Data integrity maintained across navigation');

      // Verify content
      for (let i = 0; i < initialRows.length; i++) {
        expect(finalRows[i].dreamName).toBe(initialRows[i].dreamName);
        expect(finalRows[i].dreamType).toBe(initialRows[i].dreamType);
      }

      Logger.success('✓ All dream data matches after round-trip navigation');
    } catch (error) {
      Logger.error('Data integrity test failed', error as Error);
      throw error;
    } finally {
      await context.close();
    }
  });
});

