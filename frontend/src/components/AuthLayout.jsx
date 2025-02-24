import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Auth.module.css';

const AuthLayout = ({ children, title, subtitle, footerText, footerLink }) => {
  return (
    <div className={styles.authContainer}>
      <div className={styles.authWrapper}>
        {/* Left Branding Section */}
        <div className={styles.authBrand}>
          <h1 className={styles.brandTitle}>WELCOME TO PAYLOAD</h1>
          <p className={styles.brandTagline}>Create your own public space</p>
        </div>

        {/* Right Authentication Section */}
        <div className={styles.authCard}>
          <div className={styles.authHeader}>
            <h1 className={styles.authTitle}>{title}</h1>
            <p className={styles.authSubtitle}>{subtitle}</p>
          </div>

          {children}

          <div className={styles.authFooter}>
            {footerText} 
            <Link to={footerLink.path} className={styles.footerLink}>
              {footerLink.text}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
