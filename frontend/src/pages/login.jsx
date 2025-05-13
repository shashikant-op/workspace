import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Alert, Button } from 'react-bootstrap';
import AuthLayout from '../components/AuthLayout';
import styles from '../styles/Auth.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${process.env.BACKEND_URL}/api/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to continue to your workspace"
      footerText="Don't have an account?"
      footerLink={{ path: '/signup', text: 'Create Account' }}
    >
      <Form onSubmit={handleSubmit} className={styles.authForm}>
        {error && <Alert variant="danger" className={styles.alert}>{error}</Alert>}

        <Form.Group className={styles.formGroup}>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className={styles.formGroup}>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button 
          type="submit" 
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>

        <div className={styles.socialAuth}>
          <p className={styles.socialDivider}>Or continue with</p>
          <div className={styles.socialButtons}>
            <Button variant="outline" className={styles.socialButton}>
              <i className="bi bi-google"></i>
            </Button>
            <Button variant="outline" className={styles.socialButton}>
              <i className="bi bi-github"></i>
            </Button>
          </div>
        </div>
      </Form>
    </AuthLayout>
  );
};

export default Login;