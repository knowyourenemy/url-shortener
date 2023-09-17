import { NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';
import { REACT_APP_SERVER_URL } from '../util/config';

interface NavbarProps {
  loggedIn: boolean;
  setLoggedIn: (loggedIn: boolean) => void;
  username?: string;
}

const Navbar: React.FC<NavbarProps> = ({ loggedIn, username, setLoggedIn }) => {
  const logout = async () => {
    await fetch(`${REACT_APP_SERVER_URL}api/user/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    setLoggedIn(false);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.logo}>
        <NavLink to="/">URL Shortener</NavLink>
      </div>
      <div className={styles.links}>
        {loggedIn ? (
          <>
            <div className={styles.link}>Hello, {username}!</div>
            <div className={styles.link}>
              <NavLink to="/manage">Manage</NavLink>
            </div>
            <div className={styles.link} onClick={logout}>
              <div className={styles.logout}>Logout</div>
            </div>
          </>
        ) : (
          <>
            <div className={styles.link}>
              <NavLink to="/signup">Sign Up</NavLink>
            </div>
            <div className={styles.link}>
              <NavLink to="/login">Login</NavLink>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
