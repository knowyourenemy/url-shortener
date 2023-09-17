import styles from './Button.module.css';
import { Link } from 'react-router-dom';

interface ButtonProps {
  text: string;
  navTo?: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ text, navTo, onClick }) => {
  return navTo ? (
    <Link to={navTo}>
      <div className={styles.wrapper}>
        <p className={styles.text}>{text}</p>
      </div>
    </Link>
  ) : (
    <div className={styles.wrapper} onClick={onClick}>
      <p className={styles.text}>{text}</p>
    </div>
  );
};

export default Button;
