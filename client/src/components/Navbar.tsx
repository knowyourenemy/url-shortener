import { NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';

interface NavbarProps {
  loggedIn: boolean;
  setLoggedIn: (loggedIn: boolean) => void;
  username?: string;
}

const Navbar: React.FC<NavbarProps> = ({ loggedIn, username, setLoggedIn }) => {
  const logout = async () => {
    await fetch('http://localhost:8000/api/user/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    setLoggedIn(false);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.logo}>URL Shortener</div>
      <div className={styles.links}>
        {loggedIn ? (
          <>
            <div className={styles.greeting}>Hello, {username}!</div>
            <div className={styles.link}>
              <NavLink to="/manage">Manage</NavLink>
            </div>
            <div className={styles.link} onClick={logout}>
              Logout
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
