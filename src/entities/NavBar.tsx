import styles from './NavBar.module.css';
import {Logo} from "../shared/ui/Logo.tsx";
import {Text} from "../shared/ui/Text.tsx";

export const NavBar = () => {
    return (
        <div className={styles['nav-bar']}>
            <Logo />
            <Text text={"Главная"} />
            <Text text={"Главная"} />
            <Text text={"Главная"} />
        </div>
    )
};
