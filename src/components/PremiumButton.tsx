import React from 'react';
import cx from 'classnames';
import styles from './PremiumButton.module.scss';
import { useButtonInteraction } from '../hooks/useButtonInteraction';

/**
 * Props for PremiumButton
 */
export interface PremiumButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

/**
 * PremiumButton component
 * A simple button with press state animation
 */
const PremiumButton: React.FC<PremiumButtonProps> = ({
  className,
  style,
  children,
  disabled,
  ...props
}) => {
  const {
    hovered,
    pressed,
    handleMouseEnter,
    handleMouseLeave,
    handleFocus,
    handleBlur,
    handlePress,
    handleRelease,
  } = useButtonInteraction(disabled);

  const label = children || 'CLAIM';

  return (
    <button
      className={cx(
        styles['premium-button'],
        hovered && styles['premium-button--hovered'],
        pressed && styles['premium-button--pressed'],
        className
      )}
      style={style}
      disabled={disabled}
      onMouseDown={handlePress}
      onMouseUp={handleRelease}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...props}
    >
      {label}
    </button>
  );
};

export default PremiumButton;