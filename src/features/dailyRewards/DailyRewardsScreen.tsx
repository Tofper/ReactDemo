import React from 'react';
import CurrencyDisplay from './components/CurrencyDisplay';
import DynamicBackground from './components/DynamicBackground';
import RewardsRerollButton from './components/RewardsRerollButton';
import DailyRewardCard from './components/DailyRewardCard';
import styles from './DailyRewardsScreen.module.scss';
import { useDailyRewardsScreenModel } from './model/useDailyRewardsScreenModel';

/**
 * DailyRewardsScreen Page Component
 *
 * Implements the MVVM pattern for complex screens:
 * - Uses a ViewModel to manage state and business logic
 * - Focuses on rendering the UI based on the ViewModel data
 * - Delegates user interactions to the ViewModel's actions
 */
const DailyRewardsScreen: React.FC = () => {
  const { state, actions, computed } = useDailyRewardsScreenModel();
  
  return (
    <div className={styles['daily-rewards-screen']}>
      <div className={styles['daily-rewards-screen__currency-display']}>
        <CurrencyDisplay />
      </div>
      <DynamicBackground />
      <div className={styles['daily-rewards-screen__content']}>
        <div className={styles['daily-rewards-screen__title-wrapper']}>
          <span className={styles['daily-rewards-screen__title-main']}>DAILY </span>
          <span className={styles['daily-rewards-screen__title-accent']}>REWARDS</span>
          <div className={styles['daily-rewards-screen__title-underline']} />
        </div>
        <div className={styles['daily-rewards-screen__cards-row']}>
          {state.cards.map((card, i) => (
            <DailyRewardCard
              key={i}
              day={card.day}
              type={card.type}
              rewardType={card.rewardType}
              rewardAmount={card.rewardAmount}
              claimed={card.claimed}
              isCurrentDay={card.day === computed.currentDay}
              onClaim={actions.claimReward}
            />
          ))}
        </div>
        <div className={styles['daily-rewards-screen__cards-shadow-row']}>
          {state.cards.map((_, i) => (
            <div key={i} className={styles['daily-rewards-screen__card-shadow']} />
          ))}
        </div>
        <div className={styles['daily-rewards-screen__reroll-info']}>
          <span>
            Rerolls used: {state.rerollCount}/{state.maxRerolls} &mdash;{' '}
            {computed.remainingRerolls > 0
              ? `Remaining: ${computed.remainingRerolls}`
              : 'No rerolls left today'}
          </span>
        </div>
      </div>
      <RewardsRerollButton
        onClick={actions.reroll}
        disabled={!computed.canReroll}
      />
    </div>
  );
};

export default DailyRewardsScreen;