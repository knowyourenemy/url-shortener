import styles from './Button.module.css';
import { Link } from 'react-router-dom';

interface ButtonProps {
  text: string;
  navTo: string;
}

const Button: React.FC<ButtonProps> = ({ text, navTo }) => {
  return (
    <Link to={navTo}>
      <div className={styles.wrapper}>
        <p className={styles.text}>{text}</p>
      </div>
    </Link>
  );
};

export default Button;
