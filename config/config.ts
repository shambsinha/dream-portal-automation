import dotenv from 'dotenv';

dotenv.config();

export const config = {
  BASE_URL: 'https://arjitnigam.github.io/myDreams/',
  TIMEOUT: 30000,
  NAVIGATION_TIMEOUT: 30000,
  ACTION_TIMEOUT: 10000,
  LOADING_ANIMATION_TIMEOUT: 5000,

  // AI Configuration
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  ENABLE_AI_VALIDATION: process.env.ENABLE_AI_VALIDATION === 'true' || false,
  AI_MODEL: 'gpt-3.5-turbo',

  // Expected Test Data
  EXPECTED_DIARY_ROWS: 10,
  EXPECTED_GOOD_DREAMS: 6,
  EXPECTED_BAD_DREAMS: 4,
  EXPECTED_TOTAL_DREAMS: 10,
  EXPECTED_RECURRING_DREAMS: 2,
  EXPECTED_RECURRING_DREAM_NAMES: ['Flying over mountains', 'Lost in maze'],
  VALID_DREAM_TYPES: ['Good', 'Bad'],

  // Locators (CSS selectors)
  LOCATORS: {
    LOADING_ANIMATION: '.loading-spinner, .loader, [role="status"]',
    MAIN_CONTENT: 'main, [role="main"], .content, #content',
    MY_DREAMS_BUTTON: 'button:has-text("My Dreams")',
  },
};

export default config;

