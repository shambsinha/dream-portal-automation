export interface Dream {
  name: string;
  daysAgo: number;
  type: 'Good' | 'Bad';
}

export interface SummaryData {
  goodDreams: number;
  badDreams: number;
  totalDreams: number;
  recurringDreams: number;
  recurringDreamsList: string[];
}

export class TestData {
  /**
   * Expected data from the Dreams Diary
   */
  static readonly EXPECTED_DIARY_DATA: Dream[] = [
    { name: 'Flying over mountains', daysAgo: 1, type: 'Good' },
    { name: 'Lost in maze', daysAgo: 2, type: 'Bad' },
    { name: 'Swimming in ocean', daysAgo: 3, type: 'Good' },
    { name: 'Running from shadow', daysAgo: 4, type: 'Bad' },
    { name: 'Meeting old friend', daysAgo: 5, type: 'Good' },
    { name: 'Falling down stairs', daysAgo: 6, type: 'Bad' },
    { name: 'Flying over mountains', daysAgo: 7, type: 'Good' }, // Recurring
    { name: 'Winning lottery', daysAgo: 8, type: 'Good' },
    { name: 'Lost in maze', daysAgo: 9, type: 'Bad' }, // Recurring
    { name: 'Dancing at party', daysAgo: 10, type: 'Good' },
  ];

  /**
   * Expected summary data
   */
  static readonly EXPECTED_SUMMARY: SummaryData = {
    goodDreams: 6,
    badDreams: 4,
    totalDreams: 10,
    recurringDreams: 2,
    recurringDreamsList: ['Flying over mountains', 'Lost in maze'],
  };

  /**
   * Get dream by name
   */
  static getDreamByName(name: string): Dream | undefined {
    return this.EXPECTED_DIARY_DATA.find((d) => d.name.toLowerCase() === name.toLowerCase());
  }

  /**
   * Get all good dreams
   */
  static getGoodDreams(): Dream[] {
    return this.EXPECTED_DIARY_DATA.filter((d) => d.type === 'Good');
  }

  /**
   * Get all bad dreams
   */
  static getBadDreams(): Dream[] {
    return this.EXPECTED_DIARY_DATA.filter((d) => d.type === 'Bad');
  }

  /**
   * Get recurring dreams
   */
  static getRecurringDreams(): string[] {
    const dreamNames = this.EXPECTED_DIARY_DATA.map((d) => d.name);
    const recurring = dreamNames.filter((name, index) => dreamNames.indexOf(name) !== index);
    return [...new Set(recurring)];
  }

  /**
   * Count occurrences of each dream
   */
  static getDreamCounts(): Map<string, number> {
    const counts = new Map<string, number>();
    for (const dream of this.EXPECTED_DIARY_DATA) {
      counts.set(dream.name, (counts.get(dream.name) || 0) + 1);
    }
    return counts;
  }
}

