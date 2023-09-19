import Button from '../../components/button/Button';
import styles from './LandingPage.module.css';

const LandingPage: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <div className={styles.headline}>Shorten your URLs, lengthen your reach.</div>
        <div className={styles.buttons}>
          <Button navTo="/signup" text="Sign Up" />
          <Button navTo="/login" text="Login" />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
