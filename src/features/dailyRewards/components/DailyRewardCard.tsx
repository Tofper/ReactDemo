import React, { useMemo, useCallback, useEffect, useRef, useState } from 'react';
import ClaimButton from './ClaimButton';
import styles from './DailyRewardCard.module.scss';
import cx from 'classnames';
import { FaCrown, FaGem, FaLock, FaStar, FaCheck } from 'react-icons/fa';
import {
  CardType,
  RewardType,
  getIconTypeForReward,
  IconType,
} from '../types';
import { useMediaSize, MediaSize } from '../../../hooks/useMediaQuery';
import { useSpring, animated, config } from 'react-spring';
import { easeBackOut } from 'd3-ease';

// --- Animation Configs ---
const ANIMATION_CONFIGS = {
  entrance: { tension: 100, friction: 10, easing: easeBackOut },
  reroll: { tension: 500, friction: 30 },
  claim: config.wobbly,
  claimQuick: { tension: 220, friction: 10, duration: 220 },
  claimStamp: { tension: 340, friction: 10 },
};

// --- Custom Hooks for Animations ---

// Entrance animation (card reveal)
function useEntranceSpring(day: number) {
  return useSpring({
    from: { opacity: 0, y: 60 },
    to: { opacity: 1, y: 0 },
    config: ANIMATION_CONFIGS.entrance,
    delay: day * 80,
  });
}

// Claim animation (card bounce when claimed)
function useClaimSpring(claimed: boolean) {
  const prevClaimed = useRef(claimed);
  const [spring, api] = useSpring(() => ({
    scale: 1,
    y: 0,
    config: ANIMATION_CONFIGS.claim,
  }));

  useEffect(() => {
    if (claimed && !prevClaimed.current) {
      api.start({
        scale: 1.05,
        y: -7,
        config: ANIMATION_CONFIGS.claimQuick,
        onRest: () => {
          api.start({ scale: 1, y: 0, config: ANIMATION_CONFIGS.claim });
        },
      });
    }
    prevClaimed.current = claimed;
  }, [claimed, api]);

  return spring;
}

// Claim stamp animation (stamp effect on claim button)
function useClaimStampSpring(claimed: boolean) {
  const [spring, api] = useSpring(() => ({
    scale: 1,
    opacity: 1,
    config: ANIMATION_CONFIGS.claimStamp,
    immediate: !claimed,
  }));

  useEffect(() => {
    if (claimed) {
      api.start({
        from: { scale: 1.6, opacity: 0 },
        to: { scale: 1, opacity: 1 },
        config: ANIMATION_CONFIGS.claimStamp,
      });
    }
  }, [claimed, api]);

  return spring;
}

// Reroll animation (flip and fade when reward changes)
function useRerollSpring(rewardAmount: number, rewardType: RewardType, setDisplayedReward: (r: {rewardAmount: number, rewardType: RewardType}) => void) {
  const prevRewardAmount = useRef(rewardAmount);
  const prevRewardType = useRef(rewardType);
  const [spring, api] = useSpring(() => ({
    rotateY: 0,
    opacity: 1,
    config: ANIMATION_CONFIGS.reroll,
  }));

  useEffect(() => {
    const rewardChanged =
      prevRewardAmount.current !== rewardAmount ||
      prevRewardType.current !== rewardType;

    if (rewardChanged) {
      api.start({
        from: { rotateY: 0, opacity: 1 },
        to: async (next) => {
          await next({ rotateY: 90, opacity: 0 });
          setDisplayedReward({ rewardAmount, rewardType });
          await next({ rotateY: 0, opacity: 1 });
        },
        config: ANIMATION_CONFIGS.reroll,
      });
    }
    prevRewardAmount.current = rewardAmount;
    prevRewardType.current = rewardType;
  }, [rewardAmount, rewardType, api, setDisplayedReward]);

  return spring;
}

// --- Main Component ---

export interface DailyRewardCardProps {
  day: number;
  type: CardType;
  rewardType: RewardType;
  rewardAmount: number;
  claimed?: boolean;
  isCurrentDay?: boolean;
  onClaim?: (day: number) => void;
}

const DailyRewardCard: React.FC<DailyRewardCardProps> = (props) => {
  const { day, type, rewardType, rewardAmount, claimed = false, isCurrentDay = false, onClaim } = props;
  
  const mediaSize = useMediaSize();
  const claimLabel = mediaSize === MediaSize.Mobile ? 'Get' : 'CLAIM';
  const displayDay = useMemo(() => `DAY ${day}`, [day]);
  const isLocked = useMemo(() => type === CardType.Locked, [type]);

  // --- Animation Hooks ---
  const entranceSpring = useEntranceSpring(day);
  const claimSpring = useClaimSpring(claimed);

  // Reroll state and animation
  const [displayedReward, setDisplayedReward] = useState({ rewardAmount, rewardType });
  const rerollSpring = useRerollSpring(rewardAmount, rewardType, setDisplayedReward);

  // Move hook call to top level
  const claimStampSpring = useClaimStampSpring(claimed);

  // --- UI Logic ---

  const handleClaim = useCallback(() => {
    if (onClaim) {
      onClaim(day);
    }
  }, [day, onClaim]);
  
  const renderIcon = () => {
    if (isLocked) {
      return <FaLock size={36} style={{ color: '#9b916c' }} />;
    }
    switch (getIconTypeForReward(rewardType)) {
      case IconType.Star:
        return <FaStar size={36} />;
      case IconType.Crown:
        return <FaCrown size={36} />;
      case IconType.Gem:
        return <FaGem size={36} />;
      default:
        return null;
    }
  };
  
  const renderButtonContent = (rewardType: RewardType, rewardAmount: number) => {
    if (isLocked) {
      return <div className={styles['status-text']}>LOCKED</div>;
    }

    if (claimed) {
      return (
        <ClaimButton
          rewardType={rewardType}
          amount={rewardAmount}
          disabled={true}
        >
          <animated.span style={{ scale: claimStampSpring.scale, opacity: claimStampSpring.opacity }} className={styles['claim-status']}>
            {mediaSize !== MediaSize.Mobile && <span className={styles['claim-status__text']}>CLAIMED</span>}
            <span>
              <FaCheck className={styles['claim-status__icon']} />
            </span>
          </animated.span>
        </ClaimButton>
      );
    }
    return <ClaimButton rewardType={rewardType} amount={rewardAmount} onClaim={handleClaim}>{claimLabel}</ClaimButton>;
  };
  
  const renderRewardContent = (rewardType: RewardType, rewardAmount: number) => {
    if (isLocked) {
      return (
        <>
          <div className={styles['reward']}>
            <span className={styles['reward__shadow']} style={{ opacity: 0.5 }}>
              {rewardType}
            </span>
            <span className={cx(
              styles['reward__gradient'],
              styles['reward__gradient--locked']
            )}>
              {rewardType}
            </span>
            <div className={cx(
              styles['reward__amount'],
              styles['reward__amount--locked']
            )}>
              x{rewardAmount}
            </div>
          </div>
          <div className={cx(styles['icon'], styles['icon--locked'])}>
            {renderIcon()}
          </div>
        </>
      );
    }
    const isGems = rewardType === RewardType.Gems;
    const isTokens = rewardType === RewardType.Tokens;
    return (
      <>
        <div className={styles['reward']}>
          <span className={styles['reward__shadow']}>
            {rewardType}
          </span>
          <span className={cx(
            styles['reward__gradient'],
            isGems && styles['reward__gradient--gems'],
            isTokens && styles['reward__gradient--tokens']
          )}>
            {rewardType}
          </span>
          <span className={styles['reward__highlight']}>
            {rewardType}
          </span>
          <div className={cx(
            styles['reward__amount'],
            isGems && styles['reward__amount--gems'],
            isTokens && styles['reward__amount--tokens']
          )}>
            x{rewardAmount}
          </div>
        </div>
        <div className={cx(
          styles['icon'],
          isGems && styles['icon--gems'],
          isTokens && styles['icon--tokens']
        )}>
          {renderIcon()}
        </div>
      </>
    );
  };

  // --- Render ---
  return (
    <animated.div
      className={cx(
        styles['card'],
        {
          [styles['card--locked']]: isLocked,
          [styles['card--current']]: isCurrentDay,
        }
      )}
      tabIndex={0}
      role="group"
      aria-label={`Day ${day} reward: ${rewardAmount} ${rewardType}${isLocked ? ' (locked)' : claimed ? ' (claimed)' : ''}`}
      style={{
        ...entranceSpring,
        transformStyle: 'preserve-3d',
      }}
    >
      <animated.div
        style={{
          scale: claimSpring.scale,
          y: claimSpring.y,
          rotateY: rerollSpring.rotateY,
          opacity: rerollSpring.opacity,
          width: '100%',
          height: '100%',
          backfaceVisibility: 'hidden',
        }}
      >
        <div className={styles['card__border']}>
          <div className={styles['card__bottom-darkening']} />
          <div className={styles['card__bevel-highlight']} />
          <div className={styles['card__bevel-highlight-inner']} />
          <div className={styles['card__bevel-shadow']} />
          <div className={styles['card__inner']}>
            <div className={styles['card__inner-darkening']} />
            <div className={cx(
              styles['card__glow'],
              !isLocked && rewardType === RewardType.Gems && styles['card__glow--gems'],
              !isLocked && rewardType === RewardType.Tokens && styles['card__glow--tokens']
            )} />
            <div className={cx(styles['card-header'], {
              [styles['card-header--locked']]: isLocked,
              [styles['card-header--claimed']]: claimed
            })}>
              <span className={cx(styles['card-header__day'], {
                [styles['card-header__day--locked']]: isLocked,
                [styles['card-header__day--claimed']]: claimed
              })}>
                {displayDay}
              </span>
            </div>
            <div className={styles['card__content-container']}>
              {renderRewardContent(displayedReward.rewardType, displayedReward.rewardAmount)}
            </div>
            <div className={styles['card__divider']} />
            <div className={styles['card__button-container']}>
              {renderButtonContent(displayedReward.rewardType, displayedReward.rewardAmount)}
            </div>
          </div>
        </div>
      </animated.div>
    </animated.div>
  );
};

export default DailyRewardCard;