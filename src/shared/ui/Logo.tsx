import { Link } from 'react-router-dom';

interface Props {
  size?: number;
  src: string;
  className?: string;
}

export const Logo = ({ src, size = 32, className }: Props) => {
  return (
    <Link className={className} to="/">
      <img src={src} alt="Logo" width={size} height={size} />
    </Link>
  );
};
