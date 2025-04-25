/**
 * Daily Rewards related type definitions
 */

/**
 * Card type enum
 */
export enum CardType {
  Free = 'free',
  Premium = 'premium',
  Locked = 'locked'
}

/**
 * Reward type enum
 */
export enum RewardType {
  Coins = 'COINS',
  Gems = 'GEMS',
  Tokens = 'TOKENS',
  XP = 'XP'
}

/**
 * Icon type enum
 */
export enum IconType {
  Star = 'star',
  Crown = 'crown',
  Gem = 'gem',
  Lock = 'lock'
}

/**
 * Mapping between reward types and their corresponding icon types
 */
export const REWARD_ICON_MAP: Record<RewardType, IconType> = {
  [RewardType.Coins]: IconType.Star,
  [RewardType.Gems]: IconType.Gem,
  [RewardType.Tokens]: IconType.Crown,
  [RewardType.XP]: IconType.Star
};

/**
 * Function to get the icon type for a given reward type
 */
export function getIconTypeForReward(rewardType: RewardType): IconType {
  return REWARD_ICON_MAP[rewardType];
}

/**
 * Card data interface
 */
export interface CardData {
  day: number;
  type: CardType;
  rewardType: RewardType;
  rewardAmount: number;
  claimed?: boolean;
}