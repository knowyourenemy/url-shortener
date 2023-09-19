import styles from './IconButton.module.css';
import { Link } from 'react-router-dom';

interface IconButtonProps {
  image: string;
  navTo?: string;
  onClick?: () => void;
  iconAlt: string;
}

const IconButton: React.FC<IconButtonProps> = ({ image, navTo, onClick, iconAlt }) => {
  return navTo ? (
    <Link to={navTo}>
      <div className={styles.wrapper}>
        <img className={styles.icon} src={image} alt={iconAlt} />
      </div>
    </Link>
  ) : (
    <div className={styles.wrapper} onClick={onClick}>
      <img className={styles.icon} src={image} alt={iconAlt} />
    </div>
  );
};

export default IconButton;
