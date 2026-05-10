import logoSrc from '../assets/brainwave-logo-black.png';

interface Props {
  size?: number;
}

export const Logo = ({ size = 32 }: Props) => {
  return <img src={logoSrc} alt="Logo" width={size} height={size} />;
};
