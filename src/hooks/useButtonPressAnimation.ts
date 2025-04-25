import { useState, useCallback } from 'react';

/**
 * useButtonPressAnimation
 * Handles press state, animation timing, and disables button during animation.
 * Calls the provided callback after animation completes.
 */
export function useButtonPressAnimation({
  disabled = false,
  animationDuration = 300,
  onAnimationComplete,
}: {
  disabled?: boolean;
  animationDuration?: number;
  onAnimationComplete?: () => void;
}) {
  const [pressed, setPressed] = useState(false);
  const [animating, setAnimating] = useState(false);

  const isInteractive = !disabled && !animating;

  const handlePress = useCallback(() => {
    if (!isInteractive) return;
    setPressed(true);
    setAnimating(true);
    requestAnimationFrame(() => {
      setTimeout(() => {
        setPressed(false);
        setTimeout(() => {
          setAnimating(false);
          if (onAnimationComplete) onAnimationComplete();
        }, 50);
      }, animationDuration);
    });
  }, [isInteractive, animationDuration, onAnimationComplete]);

  return {
    pressed,
    animating,
    isInteractive,
    handlePress,
  };
}