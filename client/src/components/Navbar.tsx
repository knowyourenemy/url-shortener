import { NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';

interface NavbarProps {
  loggedIn: boolean;
  username?: string;
}

const Navbar: React.FC<NavbarProps> = ({ loggedIn, username }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.logo}>URL Shortener</div>
      <div className={styles.links}>
        {loggedIn ? (
          <>
            <div className={styles.link}>
              <NavLink to="/manage">Manage</NavLink>
            </div>
            <div className={styles.link}>
              <NavLink to="/logout">Logout</NavLink>
            </div>
          </>
        ) : (
          <>
            <div className={styles.link}>
              <NavLink to="/login">Login</NavLink>
            </div>
            <div className={styles.link}>
              <NavLink to="/signup">Sign Up</NavLink>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
