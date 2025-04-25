import React from 'react';
import cx from 'classnames';
import styles from './RewardsRerollButton.module.scss';
import { useButtonPressAnimation } from '../../../hooks/useButtonPressAnimation';
import { useButtonInteraction } from '../../../hooks/useButtonInteraction';

/**
 * Props for RewardsRerollButton
 */
export interface RewardsRerollButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

/**
 * RewardsRerollButton component
 *
 * A button that displays a dice animation when pressed and triggers a reroll action
 * Simple UI component with animation logic (doesn't need a separate model)
 */
const RewardsRerollButton: React.FC<RewardsRerollButtonProps> = ({
  className,
  disabled = false,
  onClick,
  ...props
}) => {
  const animationDuration = 300;
  const {
    hovered,
    handleMouseEnter,
    handleMouseLeave,
    handleFocus,
    handleBlur,
  } = useButtonInteraction(disabled);

  const {
    pressed,
    isInteractive,
    handlePress,
  } = useButtonPressAnimation({
    disabled,
    animationDuration,
    onAnimationComplete: onClick,
  });

  // Handle keyboard activation for accessibility
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (isInteractive && (e.key === ' ' || e.key === 'Enter')) {
      e.preventDefault();
      handlePress();
    }
  };

  // Only trigger animation on mouse or keyboard activation
  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isInteractive && e.button === 0) {
      e.preventDefault();
      handlePress();
    }
  };

  return (
    <button
      type="button"
      className={cx(
        styles['rewards-reroll'],
        {
          [styles['rewards-reroll--pressed']]: pressed,
          [styles['rewards-reroll--hovered']]: hovered,
        },
        className
      )}
      aria-label="Reroll Rewards"
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      disabled={!isInteractive}
      tabIndex={isInteractive ? 0 : -1}
      {...props}
    >
      <span className={styles['rewards-reroll__label']}>REROLL</span>
      <span className={styles['rewards-reroll__dice-wrapper']}>
        <div
          className={cx(
            styles['rewards-reroll__dice'],
            { [styles['rewards-reroll__dice-anim']]: pressed }
          )}
          style={{
            animationDuration: `${animationDuration}ms`
          }}
          aria-hidden="true"
        >
          <span className={cx(styles['rewards-reroll__pip'], styles['rewards-reroll__pip--tl'])} />
          <span className={cx(styles['rewards-reroll__pip'], styles['rewards-reroll__pip--tr'])} />
          <span className={cx(styles['rewards-reroll__pip'], styles['rewards-reroll__pip--bl'])} />
          <span className={cx(styles['rewards-reroll__pip'], styles['rewards-reroll__pip--br'])} />
          <span className={cx(styles['rewards-reroll__pip'], styles['rewards-reroll__pip--c'])} />
        </div>
      </span>
    </button>
  );
};

export default RewardsRerollButton;