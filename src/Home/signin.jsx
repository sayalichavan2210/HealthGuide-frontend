import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation, useRegisterMutation } from '../Api/authApi';
import { setCredentials } from '../Slice/authSlice';
import toast from 'react-hot-toast';

const styles = {
  page: {
    minHeight: '100vh',
    background: '#050A05',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1.5rem',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
  },
  blob1: {
    position: 'absolute',
    top: '60px',
    left: '40px',
    width: '320px',
    height: '320px',
    background: 'radial-gradient(circle, rgba(34,197,94,0.10) 0%, transparent 70%)',
    borderRadius: '50%',
    pointerEvents: 'none',
    animation: 'pulse 5s ease-in-out infinite',
  },
  blob2: {
    position: 'absolute',
    bottom: '60px',
    right: '40px',
    width: '380px',
    height: '380px',
    background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)',
    borderRadius: '50%',
    pointerEvents: 'none',
    animation: 'pulse 5s ease-in-out infinite 1.5s',
  },
  blob3: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '500px',
    height: '500px',
    background: 'radial-gradient(circle, rgba(22,163,74,0.04) 0%, transparent 70%)',
    borderRadius: '50%',
    pointerEvents: 'none',
    animation: 'pulse 6s ease-in-out infinite 0.7s',
  },
  cardWrapper: {
    width: '100%',
    maxWidth: '460px',
    position: 'relative',
    zIndex: 2,
  },
  card: {
    background: 'rgba(6,14,6,0.96)',
    border: '1px solid rgba(34,197,94,0.22)',
    borderRadius: '28px',
    padding: '2.5rem 2.25rem',
    position: 'relative',
    boxShadow: '0 32px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(34,197,94,0.06) inset',
    backdropFilter: 'blur(12px)',
  },
  cardTopGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '120px',
    background: 'linear-gradient(180deg, rgba(34,197,94,0.06) 0%, transparent 100%)',
    borderRadius: '28px 28px 0 0',
    pointerEvents: 'none',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(34,197,94,0.09)',
    border: '1px solid rgba(34,197,94,0.22)',
    borderRadius: '50px',
    padding: '4px 12px',
    fontSize: '11px',
    fontWeight: 600,
    color: '#22C55E',
    letterSpacing: '0.05em',
    marginBottom: '1.2rem',
  },
  badgeDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#22C55E',
    boxShadow: '0 0 6px #22C55E',
    animation: 'blink 1.5s ease-in-out infinite',
  },
  toggleWrap: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1.5rem',
  },
  toggle: {
    background: 'rgba(34,197,94,0.06)',
    border: '1px solid rgba(34,197,94,0.16)',
    borderRadius: '50px',
    padding: '4px',
    display: 'inline-flex',
  },
  togBtnBase: {
    padding: '8px 30px',
    borderRadius: '50px',
    border: 'none',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    color: '#3A7A4A',
    background: 'transparent',
    letterSpacing: '0.01em',
  },
  togBtnActive: {
    background: 'linear-gradient(90deg, #15803D, #22C55E)',
    color: '#F0FFF4',
    boxShadow: '0 2px 14px rgba(34,197,94,0.28)',
  },
  headline: {
    textAlign: 'center',
    marginBottom: '1.75rem',
  },
  h2: {
    fontSize: '1.75rem',
    fontWeight: 700,
    color: '#DCFCE7',
    marginBottom: '6px',
    letterSpacing: '-0.02em',
    lineHeight: 1.2,
  },
  subtext: {
    fontSize: '13px',
    color: '#3A6A4A',
    lineHeight: 1.5,
  },
  errorBox: {
    background: 'rgba(220,38,38,0.10)',
    border: '1px solid rgba(220,38,38,0.25)',
    borderRadius: '12px',
    padding: '10px 14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '1.2rem',
    color: '#F87171',
    fontSize: '13px',
    fontWeight: 500,
  },
  twoCol: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginBottom: '1rem',
  },
  fieldGroup: {
    marginBottom: '1.1rem',
  },
  label: {
    display: 'block',
    fontSize: '11px',
    fontWeight: 700,
    color: '#4A8A5A',
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    background: 'rgba(5,20,8,0.95)',
    border: '1px solid rgba(34,197,94,0.16)',
    borderRadius: '12px',
    padding: '11px 14px',
    color: '#DCFCE7',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  labelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
  },
  forgotLink: {
    fontSize: '11px',
    color: '#22C55E',
    textDecoration: 'none',
    cursor: 'pointer',
    fontWeight: 500,
    background: 'none',
    border: 'none',
    padding: 0,
  },
  strengthWrap: {
    marginTop: '6px',
  },
  strengthRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '4px',
  },
  strengthLabel: {
    fontSize: '11px',
    color: '#3A5A42',
  },
  strengthTrack: {
    height: '3px',
    background: 'rgba(255,255,255,0.07)',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  checkRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '1rem 0 1.5rem',
  },
  checkLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    color: '#4A8A5A',
    fontWeight: 500,
  },
  secureRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '11px',
    color: '#2A5A32',
  },
  secureDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#22C55E',
  },
  submitBtn: {
    width: '100%',
    padding: '13px',
    border: 'none',
    borderRadius: '12px',
    background: 'linear-gradient(90deg, #15803D, #16A34A, #22C55E)',
    color: '#F0FFF4',
    fontSize: '15px',
    fontWeight: 700,
    cursor: 'pointer',
    letterSpacing: '0.02em',
    transition: 'opacity 0.2s, transform 0.15s',
    boxShadow: '0 4px 16px rgba(34,197,94,0.22)',
    fontFamily: 'inherit',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  divider: {
    position: 'relative',
    margin: '1.6rem 0',
    borderTop: '1px solid rgba(34,197,94,0.09)',
  },
  dividerText: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'rgba(6,14,6,0.96)',
    padding: '0 12px',
    fontSize: '10px',
    fontWeight: 700,
    color: '#2A4A30',
    letterSpacing: '0.12em',
    whiteSpace: 'nowrap',
  },
  socialRow: {
    display: 'flex',
    gap: '10px',
  },
  socialBtn: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '10px',
    background: 'rgba(5,20,8,0.95)',
    border: '1px solid rgba(34,197,94,0.16)',
    borderRadius: '12px',
    color: '#4A9A5A',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: 'inherit',
  },
};

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
    @keyframes pulse {
      0%, 100% { opacity: 0.4; transform: scale(1); }
      50% { opacity: 0.65; transform: scale(1.04); }
    }
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-14px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .auth-input:focus {
      border-color: #22C55E !important;
      box-shadow: 0 0 0 3px rgba(34,197,94,0.10) !important;
    }
    .auth-input::placeholder { color: #1A3A22; }
    .social-btn:hover {
      border-color: #22C55E !important;
      background: rgba(34,197,94,0.08) !important;
      color: #22C55E !important;
    }
    .submit-btn:hover:not(:disabled) {
      opacity: 0.88;
      transform: translateY(-1px);
      box-shadow: 0 8px 24px rgba(34,197,94,0.3) !important;
    }
    .submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }
    .toggle-btn:hover { color: #22C55E; }
    .slidedown-anim { animation: slideDown 0.35s ease-out; }
    .fadein-anim { animation: fadeIn 0.3s ease-out; }
    .spin { animation: spin 1s linear infinite; }
  `}</style>
);

const getStrengthInfo = (pwd) => {
  if (!pwd) return { label: '', color: 'transparent', width: '0%' };
  if (pwd.length < 6) return { label: 'Weak', color: '#DC2626', width: `${Math.min((pwd.length / 15) * 100, 40)}%` };
  if (pwd.length < 10) return { label: 'Medium', color: '#CA8A04', width: `${Math.min((pwd.length / 15) * 100, 70)}%` };
  return { label: 'Strong', color: '#22C55E', width: `${Math.min((pwd.length / 15) * 100, 100)}%` };
};

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading: loginLoading }] = useLoginMutation();
  const [register, { isLoading: registerLoading }] = useRegisterMutation();
  const isLoading = loginLoading || registerLoading;

  const strength = getStrengthInfo(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isSignUp) {
      if (!firstName || !lastName || !email || !password) { setError('Please fill in all fields'); return; }
      if (password.length < 8) { setError('Password must be at least 8 characters'); return; }
    } else {
      if (!email || !password) { setError('Please fill in all fields'); return; }
    }

    try {
      let result;
      if (isSignUp) {
        result = await register({ firstName, lastName, email, password }).unwrap();
        toast.success('Account created successfully!');
      } else {
        result = await login({ email, password }).unwrap();
        toast.success(`Welcome back, ${result.user.firstName}!`);
      }
      dispatch(setCredentials({ user: result.user, accessToken: result.accessToken }));
      navigate('/home');
    } catch (err) {
      const msg = err?.data?.message || 'Something went wrong. Try again.';
      setError(msg);
      toast.error(msg);
    }
  };

  const switchTab = (signup) => { setIsSignUp(signup); setError(''); };

  return (
    <>
      <GlobalStyles />
      <div style={styles.page}>
        <div style={styles.blob1} />
        <div style={styles.blob2} />
        <div style={styles.blob3} />

        <div style={styles.cardWrapper}>
          <div style={styles.card}>
            <div style={styles.cardTopGlow} />

            {/* Badge */}
            <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <div style={{ ...styles.badge, margin: '0 auto 1.2rem' }}>
                <span style={styles.badgeDot} />
                HealthGuard AI
              </div>
            </div>

            {/* Toggle */}
            <div style={{ ...styles.toggleWrap, position: 'relative', zIndex: 1 }}>
              <div style={styles.toggle}>
                <button
                  className="toggle-btn"
                  style={{ ...styles.togBtnBase, ...(!isSignUp ? styles.togBtnActive : {}) }}
                  onClick={() => switchTab(false)}
                  type="button"
                >
                  Sign In
                </button>
                <button
                  className="toggle-btn"
                  style={{ ...styles.togBtnBase, ...(isSignUp ? styles.togBtnActive : {}) }}
                  onClick={() => switchTab(true)}
                  type="button"
                >
                  Sign Up
                </button>
              </div>
            </div>

            {/* Headline */}
            <div style={{ ...styles.headline, position: 'relative', zIndex: 1 }}>
              <h2 style={styles.h2}>{isSignUp ? 'Create an account' : 'Welcome back'}</h2>
              <p style={styles.subtext}>
                {isSignUp
                  ? 'Join HealthGuard AI to manage your risk portfolio'
                  : 'Sign in to access your risk portfolio'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ position: 'relative', zIndex: 1 }}>

              {/* Error */}
              {error && (
                <div style={styles.errorBox}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {error}
                </div>
              )}

              {/* Name fields */}
              {isSignUp && (
                <div style={styles.twoCol} className="slidedown-anim">
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>First name</label>
                    <input
                      className="auth-input"
                      type="text"
                      placeholder="Sayali"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={isLoading}
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Last name</label>
                    <input
                      className="auth-input"
                      type="text"
                      placeholder="Kulkarni"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={isLoading}
                      style={styles.input}
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Email address</label>
                <input
                  className="auth-input"
                  type="email"
                  placeholder="hello@healthguard.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  style={styles.input}
                />
              </div>

              {/* Password */}
              <div style={styles.fieldGroup}>
                <div style={styles.labelRow}>
                  <label style={styles.label}>Password</label>
                  {!isSignUp && (
                    <button type="button" style={styles.forgotLink}>Forgot password?</button>
                  )}
                </div>
                <input
                  className="auth-input"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  style={styles.input}
                />

                {/* Strength bar */}
                {isSignUp && password && (
                  <div style={styles.strengthWrap} className="fadein-anim">
                    <div style={styles.strengthRow}>
                      <span style={styles.strengthLabel}>Password strength</span>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: strength.color }}>{strength.label}</span>
                    </div>
                    <div style={styles.strengthTrack}>
                      <div style={{
                        height: '100%',
                        width: strength.width,
                        background: strength.color,
                        borderRadius: '4px',
                        transition: 'width 0.3s ease, background 0.3s ease',
                      }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Remember / Secure */}
              <div style={styles.checkRow}>
                <label style={styles.checkLabel}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ accentColor: '#22C55E', width: '15px', height: '15px', cursor: 'pointer' }}
                  />
                  {isSignUp ? 'I agree to the Terms & Conditions' : 'Remember me'}
                </label>
                <div style={styles.secureRow}>
                  <div style={styles.secureDot} />
                  <span>Secure</span>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="submit-btn"
                style={styles.submitBtn}
              >
                {isLoading ? (
                  <>
                    <svg className="spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
                      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                    </svg>
                    {isSignUp ? 'Creating account...' : 'Authenticating...'}
                  </>
                ) : (
                  <>{isSignUp ? 'Create Account' : 'Sign In'} →</>
                )}
              </button>
            </form>

            {/* Divider */}
            <div style={{ ...styles.divider, position: 'relative', zIndex: 1 }}>
              <span style={styles.dividerText}>OR CONTINUE WITH</span>
            </div>

            {/* Social */}
            <div style={{ ...styles.socialRow, position: 'relative', zIndex: 1 }}>
              <button
                type="button"
                className="social-btn"
                style={styles.socialBtn}
                onClick={() => { window.location.href = 'http://localhost:5000/api/auth/google'; }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button
                type="button"
                className="social-btn"
                style={styles.socialBtn}
                onClick={() => { window.location.href = 'http://localhost:5000/api/auth/github'; }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthPage;