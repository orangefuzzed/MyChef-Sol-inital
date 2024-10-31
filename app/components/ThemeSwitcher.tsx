import React from 'react';
import { Flex, Select } from '@radix-ui/themes';
import styles from './ThemeSwitcher.module.css'; // Updated to use the correct styles file
import { useTheme } from '../ThemeContext';

type Theme = 'default' | 'ruby' | 'cyan' | 'teal';

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className={styles.container}>
      <Flex direction="column" gap="4">
        {/* Theme Switcher */}
        <Select.Root value={theme} onValueChange={(value) => setTheme(value as Theme)}>
          <Select.Trigger className={styles.themeSwitcher} />
          <Select.Content>
            <Select.Item value="default">Default (Dark)</Select.Item>
            <Select.Item value="ruby">Ruby</Select.Item>
            <Select.Item value="cyan">Cyan</Select.Item>
            <Select.Item value="teal">Teal</Select.Item>
          </Select.Content>
        </Select.Root>
      </Flex>
    </div>
  );
};

export default ThemeSwitcher;
