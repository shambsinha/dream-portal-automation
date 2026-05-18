import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { Logger } from '../utils/logger';
import { TestHelpers } from '../utils/helpers';
import config from '../config/config';

export interface DreamRow {
  dreamName: string;
  daysAgo: string;
  dreamType: string;
}

export class DreamsDiaryPage extends BasePage {
  // Locators
  readonly TABLE_SELECTOR = 'table, [role="table"]';
  readonly TABLE_BODY = 'table tbody tr, [role="table"] [role="row"]';
  readonly TABLE_ROWS = 'table tbody tr, [role="rowgroup"] [role="row"]';
  readonly PAGE_TITLE = 'h1, h2, .title';
  readonly BACK_BUTTON = 'button:has-text("Back"), a:has-text("Back"), [data-testid="back-btn"]';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to dreams diary page
   */
  async navigateToDreamsDiary(): Promise<void> {
    Logger.info('Navigating to Dreams Diary page...');
    await this.navigateTo('https://arjitnigam.github.io/myDreams/dreams-diary.html');
    Logger.success('Dreams Diary page loaded');
  }

  /**
   * Wait for page to load
   */
  async waitForPageLoad(): Promise<void> {
    Logger.info('Waiting for Dreams Diary page to load...');
    await this.page.waitForLoadState('networkidle');
    await this.waitForElement(this.TABLE_SELECTOR, config.TIMEOUT);
    Logger.success('Dreams Diary page loaded');
  }

  /**
   * Get all dream rows
   */
  async getAllDreamRows(): Promise<DreamRow[]> {
    Logger.section('Extracting Dream Rows from Table');

    try {
      // Wait for table to be visible
      await this.waitForElement(this.TABLE_SELECTOR);

      // Get all rows using Playwright's evaluate
      const rows = await this.page.evaluate(() => {
        const rowElements = document.querySelectorAll('table tbody tr, [role="table"] [role="row"]');
        const dreamsArray: Array<{ cells: string[] }> = [];

        rowElements.forEach((row) => {
          const cells = row.querySelectorAll('td, [role="cell"]');
          const cellsText = Array.from(cells).map((cell) => cell.textContent?.trim() || '');
          if (cellsText.length > 0) {
            dreamsArray.push({ cells: cellsText });
          }
        });

        return dreamsArray;
      });

      if (rows.length === 0) {
        Logger.error('No table rows found');
        throw new Error('Could not extract dream rows from table');
      }

      // Parse rows into DreamRow objects
      const dreamRows: DreamRow[] = rows.map((row, index) => {
        if (row.cells.length < 3) {
          Logger.warn(`Row ${index} has fewer than 3 columns: ${row.cells.length}`);
        }

        return {
          dreamName: row.cells[0] || '',
          daysAgo: row.cells[1] || '',
          dreamType: row.cells[2] || '',
        };
      });

      Logger.success(`Extracted ${dreamRows.length} dream rows`);
      Logger.table(dreamRows);

      return dreamRows;
    } catch (error) {
      Logger.error('Error extracting dream rows', error as Error);
      throw error;
    }
  }

  /**
   * Verify table has exactly 10 rows
   */
  async verifyTableHasTenRows(): Promise<number> {
    Logger.section('Verifying Table Has Exactly 10 Rows');

    try {
      const rows = await this.getAllDreamRows();
      const rowCount = rows.length;

      Logger.info(`Found ${rowCount} rows in table`);

      if (rowCount === config.EXPECTED_DIARY_ROWS) {
        Logger.success(`✓ Table has exactly ${config.EXPECTED_DIARY_ROWS} rows`);
      } else {
        Logger.error(`✗ Expected ${config.EXPECTED_DIARY_ROWS} rows, but found ${rowCount}`);
        throw new Error(`Row count mismatch: expected ${config.EXPECTED_DIARY_ROWS}, got ${rowCount}`);
      }

      return rowCount;
    } catch (error) {
      Logger.error('Error verifying row count', error as Error);
      throw error;
    }
  }

  /**
   * Verify each row has exactly 3 columns
   */
  async verifyEachRowHasThreeColumns(): Promise<void> {
    Logger.section('Verifying Each Row Has Exactly 3 Columns');

    try {
      const rows = await this.getAllDreamRows();

      let allValid = true;
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const columnCount = Object.values(row).filter((val) => val && val.toString().length > 0).length;

        if (row.dreamName && row.daysAgo && row.dreamType) {
          Logger.success(`Row ${i + 1}: Has all required columns`);
        } else {
          Logger.error(`Row ${i + 1}: Missing columns!`);
          allValid = false;
        }
      }

      if (!allValid) {
        throw new Error('Some rows have missing columns');
      }

      Logger.success('✓ All rows have exactly 3 columns');
    } catch (error) {
      Logger.error('Error verifying column count', error as Error);
      throw error;
    }
  }

  /**
   * Verify dream types are valid (Good or Bad)
   */
  async verifyDreamTypesAreValid(): Promise<void> {
    Logger.section('Verifying Dream Types Are Valid');

    try {
      const rows = await this.getAllDreamRows();
      const validTypes = config.VALID_DREAM_TYPES;

      let invalidCount = 0;
      for (let i = 0; i < rows.length; i++) {
        const dreamType = rows[i].dreamType.trim();

        if (validTypes.includes(dreamType)) {
          Logger.debug(`Row ${i + 1}: Dream Type "${dreamType}" is valid`);
        } else {
          Logger.error(`Row ${i + 1}: Invalid dream type "${dreamType}". Must be ${validTypes.join(' or ')}`);
          invalidCount++;
        }
      }

      if (invalidCount === 0) {
        Logger.success('✓ All dream types are valid');
      } else {
        throw new Error(`${invalidCount} rows have invalid dream types`);
      }
    } catch (error) {
      Logger.error('Error verifying dream types', error as Error);
      throw error;
    }
  }

  /**
   * Get all dream data as simple objects
   */
  async getDreamData(): Promise<Array<{ name: string; type: string }>> {
    Logger.info('Extracting dream data for AI validation...');
    const rows = await this.getAllDreamRows();

    return rows.map((row) => ({
      name: row.dreamName.trim(),
      type: row.dreamType.trim(),
    }));
  }

  /**
   * Verify no empty values in any row
   */
  async verifyNoEmptyValues(): Promise<void> {
    Logger.section('Verifying No Empty Values in Rows');

    try {
      const rows = await this.getAllDreamRows();

      let emptyCount = 0;
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];

        if (!row.dreamName?.trim()) {
          Logger.error(`Row ${i + 1}: Dream Name is empty`);
          emptyCount++;
        }

        if (!row.daysAgo?.trim()) {
          Logger.error(`Row ${i + 1}: Days Ago is empty`);
          emptyCount++;
        }

        if (!row.dreamType?.trim()) {
          Logger.error(`Row ${i + 1}: Dream Type is empty`);
          emptyCount++;
        }
      }

      if (emptyCount === 0) {
        Logger.success('✓ No empty values found in any row');
      } else {
        throw new Error(`Found ${emptyCount} empty values`);
      }
    } catch (error) {
      Logger.error('Error verifying empty values', error as Error);
      throw error;
    }
  }

  /**
   * Get count of good dreams
   */
  async getGoodDreamCount(): Promise<number> {
    Logger.info('Counting good dreams...');
    const rows = await this.getAllDreamRows();
    const count = rows.filter((r) => r.dreamType.trim() === 'Good').length;
    Logger.success(`Found ${count} good dreams`);
    return count;
  }

  /**
   * Get count of bad dreams
   */
  async getBadDreamCount(): Promise<number> {
    Logger.info('Counting bad dreams...');
    const rows = await this.getAllDreamRows();
    const count = rows.filter((r) => r.dreamType.trim() === 'Bad').length;
    Logger.success(`Found ${count} bad dreams`);
    return count;
  }

  /**
   * Get all unique dream names
   */
  async getUniqueDreamNames(): Promise<string[]> {
    Logger.info('Extracting unique dream names...');
    const rows = await this.getAllDreamRows();
    const names = rows.map((r) => r.dreamName.trim());
    const unique = [...new Set(names)];
    Logger.success(`Found ${unique.length} unique dream names`);
    return unique;
  }

  /**
   * Get recurring dreams
   */
  async getRecurringDreams(): Promise<string[]> {
    Logger.section('Finding Recurring Dreams');

    try {
      const rows = await this.getAllDreamRows();
      const dreamNames = rows.map((r) => r.dreamName.trim());

      const recurring = dreamNames.filter((name, index) => dreamNames.indexOf(name) !== index);
      const uniqueRecurring = [...new Set(recurring)];

      Logger.success(`Found ${uniqueRecurring.length} recurring dreams`);
      uniqueRecurring.forEach((dream, index) => {
        const count = dreamNames.filter((d) => d === dream).length;
        Logger.info(`  ${index + 1}. "${dream}" (appears ${count} times)`);
      });

      return uniqueRecurring;
    } catch (error) {
      Logger.error('Error finding recurring dreams', error as Error);
      throw error;
    }
  }

  /**
   * Verify recurring dreams exist
   */
  async verifyRecurringDreamsExist(): Promise<void> {
    Logger.section('Verifying Expected Recurring Dreams');

    try {
      const recurring = await this.getRecurringDreams();
      const expectedRecurring = config.EXPECTED_RECURRING_DREAM_NAMES;

      Logger.info(`Expected: ${expectedRecurring.join(', ')}`);
      Logger.info(`Found: ${recurring.join(', ')}`);

      for (const expected of expectedRecurring) {
        if (recurring.includes(expected)) {
          Logger.success(`✓ Found recurring dream: "${expected}"`);
        } else {
          Logger.error(`✗ Expected recurring dream not found: "${expected}"`);
          throw new Error(`Recurring dream "${expected}" not found`);
        }
      }

      Logger.success('✓ All expected recurring dreams were found');
    } catch (error) {
      Logger.error('Error verifying recurring dreams', error as Error);
      throw error;
    }
  }

  /**
   * Print summary of dreams diary data
   */
  async printSummary(): Promise<void> {
    Logger.section('Dreams Diary Summary');

    try {
      const rows = await this.getAllDreamRows();
      const goodCount = await this.getGoodDreamCount();
      const badCount = await this.getBadDreamCount();
      const uniqueCount = (await this.getUniqueDreamNames()).length;
      const recurringCount = (await this.getRecurringDreams()).length;

      Logger.info(`Total Rows: ${rows.length}`);
      Logger.info(`Good Dreams: ${goodCount}`);
      Logger.info(`Bad Dreams: ${badCount}`);
      Logger.info(`Unique Dreams: ${uniqueCount}`);
      Logger.info(`Recurring Dreams: ${recurringCount}`);
    } catch (error) {
      Logger.error('Error printing summary', error as Error);
    }
  }
}

