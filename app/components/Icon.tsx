import Image from 'next/image';

interface IconProps {
  name: string;
  size?: number;
  alt?: string;
}

const Icon: React.FC<IconProps> = ({ name, size = 24, alt = '' }) => {
  return (
    <Image
      src={`/icons/${name}.png`}
      width={size}
      height={size}
      alt={alt || name}
    />
  );
};

export default Icon;