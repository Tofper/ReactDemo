import { useState, useCallback } from 'react';

export function useButtonInteraction(disabled?: boolean) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pressed, setPressed] = useState(false);

  const handleMouseEnter = useCallback(() => {
    if (!disabled) setHovered(true);
  }, [disabled]);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    setPressed(false);
  }, []);

  const handleFocus = useCallback(() => {
    if (!disabled) setFocused(true);
  }, [disabled]);

  const handleBlur = useCallback(() => {
    setFocused(false);
    setHovered(false);
    setPressed(false);
  }, []);

  const handlePress = useCallback(() => {
    if (!disabled) setPressed(true);
  }, [disabled]);

  const handleRelease = useCallback(() => {
    setPressed(false);
  }, []);

  return {
    hovered,
    focused,
    pressed,
    handleMouseEnter,
    handleMouseLeave,
    handleFocus,
    handleBlur,
    handlePress,
    handleRelease,
  };
}