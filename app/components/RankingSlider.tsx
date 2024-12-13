// components/RankingSlider.tsx

import React from 'react';
import * as Slider from '@radix-ui/react-slider';
import styles from './RankingSlider.module.css';
import { Meh, ThumbsDown, Heart, ThumbsUp, } from 'lucide-react';

interface RankingSliderProps {
  name: string;
  ranking: number;
  onChange: (value: number) => void;
}

const RankingSlider: React.FC<RankingSliderProps> = ({ name, ranking, onChange }) => {
  const labels = ['Avoid', 'Neutral', 'Prefer', 'Must-Have'];
  const icons = [
    <ThumbsDown strokeWidth={1.5} size={18} key="thumbs-down" />,
    <Meh strokeWidth={1.5} size={18} key="meh" />,
    <ThumbsUp strokeWidth={1.5} size={18} key="thumbs-up" />,
    <Heart strokeWidth={1.5} size={18} key="heart" />
  ];  
  const colors = ['#f43f5e', '#f59e0b', '#22d3ee', '#84cc16'];

  return (
    <div className={styles.sliderContainer}>
      <label className="text-sky-50 mb-2 flex items-center">
        <span
          className="mr-2"
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
