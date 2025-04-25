import { CardData, RewardType, CardType } from '../types';

/**
 * Reward configuration type
 */
type RewardConfig = {
  rewardType: RewardType;
  rewardAmount: number;
};

/**
 * DailyRewards Service
 *
 * Responsible for:
 * - Managing data-related operations
 * - API calls for battle pass data
 * - Business logic related to battle pass functionality
 */
class DailyRewardsService {
  private static instance: DailyRewardsService;
  
  // In a real app, these could be fetched from an API
  private possibleRewards: RewardConfig[] = [
    { rewardType: RewardType.Coins, rewardAmount: 100 },
    { rewardType: RewardType.Gems, rewardAmount: 50 },
    { rewardType: RewardType.Tokens, rewardAmount: 25 },
    { rewardType: RewardType.XP, rewardAmount: 200 },
  ];

  private initialCards: CardData[] = [
    { day: 1, type: CardType.Free, rewardType: RewardType.Coins, rewardAmount: 100 },
    { day: 2, type: CardType.Free, rewardType: RewardType.Gems, rewardAmount: 150 },
    { day: 3, type: CardType.Free, rewardType: RewardType.Gems, rewardAmount: 75 },
    { day: 4, type: CardType.Locked, rewardType: RewardType.Gems, rewardAmount: 75 },
  ];

  private constructor() {
    // Private constructor to enforce singleton
  }

  public static getInstance(): DailyRewardsService {
    if (!DailyRewardsService.instance) {
      DailyRewardsService.instance = new DailyRewardsService();
    }
    return DailyRewardsService.instance;
  }

  /**
   * Get initial cards data
   */
  public getInitialCards(): CardData[] {
    // In a real app, this could be an API call
    return [...this.initialCards];
  }

  /**
   * Get possible rewards for rerolls
   */
  public getPossibleRewards(): RewardConfig[] {
    return [...this.possibleRewards];
  }

  /**
   * Generate random rewards for rerolling
   * @param cards Current cards to reroll
   * @returns New cards with randomized rewards
   */
  public generateRandomRewards(cards: CardData[]): CardData[] {
    return cards.map(card => {
      // Don't change claimed cards
      if (card.claimed) return card;
      
      // Pick a random reward
      const randomRewardIndex = Math.floor(Math.random() * this.possibleRewards.length);
      const newReward = this.possibleRewards[randomRewardIndex];
      
      return {
        ...card,
        rewardType: newReward.rewardType,
        rewardAmount: newReward.rewardAmount,
      };
    });
  }

  /**
   * Get maximum allowed rerolls per day
   */
  public getMaxRerolls(): number {
    return 3; // Could be fetched from config or API
  }

  /**
   * Get current day number
   * In a real app, this would use a proper date calculation or server data
   * For demo purposes, we're hardcoding day 2 as the current day
   */
  public getCurrentDay(): number {
    // This would normally calculate the current day based on date logic
    // or fetch from a server endpoint
    return 3;
  }
}

// Export singleton instance
export const dailyRewardsService = DailyRewardsService.getInstance();