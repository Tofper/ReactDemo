import React, { useRef, useEffect } from 'react';
import cx from 'classnames';
import styles from './CurrencyDisplay.module.scss';
import { useCurrency } from '../../../context/CurrencyContext';
import { useSpring, animated } from 'react-spring';

export type Props = {
  className?: string;
  style?: React.CSSProperties;
};

const CurrencyDisplay: React.FC<Props> = ({ className, style }) => {
  const { currency } = useCurrency();
  const { coins, gems } = currency;

  // Track previous values
  const prevCoins = useRef(coins);
  const prevGems = useRef(gems);

  // Animate coins
  const coinsSpring = useSpring({
    from: { val: prevCoins.current },
    to: { val: coins },
    reset: prevCoins.current !== coins,
    onRest: () => { prevCoins.current = coins; }
  });

  // Animate gems
  const gemsSpring = useSpring({
    from: { val: prevGems.current },
    to: { val: gems },
    reset: prevGems.current !== gems,
    onRest: () => { prevGems.current = gems; }
  });

  useEffect(() => {
    prevCoins.current = coins;
    prevGems.current = gems;
  }, [coins, gems]);

  return (
    <div className={cx(styles['currency-display'], className)} style={style} role="status" aria-live="polite">
      <span className={styles['currency-display__label']}>COINS:</span>
      <animated.span className={cx(styles['currency-display__currency'], styles['currency-display__currency--coins'])}>
        {coinsSpring.val.to((v) => Math.floor(v))}
      </animated.span>
      <span className={styles['currency-display__label']}>GEMS:</span>
      <animated.span className={cx(styles['currency-display__currency'], styles['currency-display__currency--gems'])}>
        {gemsSpring.val.to((v) => Math.floor(v))}
      </animated.span>
    </div>
  );
};

export default CurrencyDisplay;