// components/RankingSlider.tsx

import React from 'react';
import * as Slider from '@radix-ui/react-slider';
import styles from './RankingSlider.module.css';
import {
  FaThumbsDown,
  FaMeh,
  FaThumbsUp,
  FaHeart,
} from 'react-icons/fa';

interface RankingSliderProps {
  name: string;
  ranking: number;
  onChange: (value: number) => void;
}

const RankingSlider: React.FC<RankingSliderProps> = ({ name, ranking, onChange }) => {
  const labels = ['Avoid', 'Neutral', 'Prefer', 'Must-Have'];
  const icons = [
    <FaThumbsDown key="thumbs-down" />,
    <FaMeh key="meh" />,
    <FaThumbsUp key="thumbs-up" />,
    <FaHeart key="heart" />
  ];  
  const colors = ['#ff4d4f', '#faad14', '#52c41a', '#1890ff'];

  return (
    <div className={styles.sliderContainer}>
      <label className="text-white mb-2 flex items-center">
        <span
          className={styles.sliderIcon}
          style={{ color: colors[ranking - 1] }}
        >
          {icons[ranking - 1]}
        </span>
        {name}
      </label>
      <Slider.Root
        className={styles.SliderRoot}
        min={1}
        max={4}
        step={1}
        value={[ranking]}
        onValueChange={(value) => onChange(value[0])}
        aria-label={`Preference for ${name}`}
      >
        <Slider.Track className={styles.SliderTrack}>
          <Slider.Range className={styles.SliderRange} />
        </Slider.Track>
        <Slider.Thumb
          className={styles.SliderThumb}
          style={{ borderColor: colors[ranking - 1] }}
        />
      </Slider.Root>
      <div
        className={styles.sliderLabel}
        style={{ color: colors[ranking - 1] }}
      >
        {labels[ranking - 1]}
      </div>
    </div>
  );
};

export default RankingSlider;
