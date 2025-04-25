import { useState, useCallback, useMemo } from 'react';
import { dailyRewardsService } from '../service/dailyRewardsService';
import { CardData } from '../types';

/**
 * Model for DailyRewardsScreen
 *
 * Responsibilities:
 * - Manage and transform model data for the view
 * - Handle UI-related logic and actions
 * - Provide computed/derived values
 * - Connect to services for data operations
 */
export const useDailyRewardsScreenModel = () => {
  // State - UI state derived from model
  const [rerollCount, setRerollCount] = useState<number>(0);
  const [cards, setCards] = useState<CardData[]>(() =>
    dailyRewardsService.getInitialCards()
  );

  // Cache constants from service
  const maxRerolls = useMemo(() =>
    dailyRewardsService.getMaxRerolls(),
    []
  );

  // Actions - functions that modify state
  const reroll = useCallback(() => {
    // Validate against business rules
    if (rerollCount >= maxRerolls) return;
    
    // Update state in an immutable way
    setRerollCount(prevCount => prevCount + 1);
    
    // Use service to generate new rewards
    setCards(prevCards =>
      dailyRewardsService.generateRandomRewards(prevCards)
    );
  }, [rerollCount, maxRerolls]);

  // New action to claim a reward
  const claimReward = useCallback((day: number) => {
    setCards(prevCards =>
      prevCards.map(card =>
        card.day === day
          ? { ...card, claimed: true }
          : card
      )
    );
  }, []);

  // Computed/derived values
  const canReroll = useMemo(() => rerollCount < maxRerolls, [rerollCount, maxRerolls]);
  const remainingRerolls = useMemo(() => maxRerolls - rerollCount, [maxRerolls, rerollCount]);
  const currentDay = useMemo(() => dailyRewardsService.getCurrentDay(), []);
  
  // Return structured MVVM data
  return {
    // Current state values
    state: {
      rerollCount,
      cards,
      maxRerolls
    },
    // Actions that can modify state
    actions: {
      reroll,
      claimReward
    },
    // Derived values that don't require storage
    computed: {
      canReroll,
      remainingRerolls,
      currentDay
    },
  };
};