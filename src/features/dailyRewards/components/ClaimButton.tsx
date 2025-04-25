import React, { useCallback } from 'react';
import PremiumButton, { PremiumButtonProps } from '@components/PremiumButton';
import { useCurrency } from '../../../context/CurrencyContext';
import { RewardType } from '../types';

export interface ClaimButtonProps extends PremiumButtonProps {
  rewardType: RewardType;
  amount: number;
  onClaim?: () => void;
}

/**
 * ClaimButton component
 *
 * Extends PremiumButton with currency claiming functionality.
 * Adds coins or gems to the global currency state when clicked.
 */
const ClaimButton: React.FC<ClaimButtonProps> = (props) => {
  const { rewardType, amount, onClaim, ...rest } = props;
  const { addCoins, addGems } = useCurrency();

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    // Skip currency addition if button is disabled
    if (rest.disabled) return;
    
    // Add the appropriate currency based on reward type
    if (rewardType === RewardType.Coins || rewardType === RewardType.Tokens || rewardType === RewardType.XP) {
      addCoins(amount);
    } else if (rewardType === RewardType.Gems) {
      addGems(amount);
    }
    
    // Call the optional onClaim callback
    if (onClaim) {
      onClaim();
    }
    
    // Call the original onClick if it exists
    if (rest.onClick) {
      rest.onClick(e);
    }
  }, [rewardType, amount, addCoins, addGems, onClaim, rest]);

  return <PremiumButton {...rest} onClick={handleClick} aria-label={`Claim ${amount} ${rewardType}`}>{rest.children || 'CLAIM'}</PremiumButton>;
};

export default ClaimButton;