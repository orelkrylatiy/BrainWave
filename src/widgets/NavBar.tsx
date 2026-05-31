import styles from './NavBar.module.css';
import {Logo} from "../shared/ui/Logo.tsx";
import { Link } from 'react-router-dom';
import logoSrc from '../shared/assets/brainwave-logo-black.png';

export const NavBar = () => {
    return (
      <div className={styles['nav-bar']}>
        <Logo src={logoSrc} className={styles.logo} />
        <div className={styles['nav-items']}>
          <Link className={styles.selected} to="/">Главная</Link>
          <Link to="/students">Ученики</Link>
          <Link to="/tasks">Задания</Link>
          <Link to="/statistic">Статистика</Link>
        </div>
      </div>
    );
};
