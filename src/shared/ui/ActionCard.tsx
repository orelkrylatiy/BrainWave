import styles from './ActionCard.module.css';
import { Logo } from './Logo.tsx';
import { Text } from './Text.tsx';

interface Props {
  title: string;
  description: string;
  className?: string;
}

export const ActionCard = ({ title, description }: Props) => {
  return (
    <div className={styles.card}>
      <Logo />
      <Text text={title} />
      <span className={styles.description}>{description}</span>
    </div>
  );
};