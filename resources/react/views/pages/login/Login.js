import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CNav,
  CNavItem,
  CNavLink,
  CAlert,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilArrowThickFromTop, cilLockLocked, cilUser, cilEyedropper, cilLowVision } from '@coreui/icons';
import { login, login2 } from '../../../util/api';
import { isLogIn, storeUserData } from '../../../util/session';
import { APP_VERSION } from "../../../version";

// import logo from './../../../assets/brand/NurseryLogo.png';
import logo from './../../../assets/machBook.jpeg';
import nurseryPlant from '../../../assets/jcb-wheel-loaders.jpg';
// import nurseryPlant from '../../../assets/nurseryPlant.jpg'; 
import { useToast } from '../../common/toast/ToastContext';

const Login = () => {
  const [validated, setValidated] = useState(false);
  const [showInstall, setShowInstall] = useState(false);
  const [loginType, setLoginType] = useState('customer'); // 'customer' or 'partner'
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const userNameRef = useRef();
  const userPwdRef = useRef();
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const [requireOtp, setRequireOtp] = useState(false); // State to handle OTP flow
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState(''); // Store email for OTP verification

  async function sendOtp(email, password) {
    const respOtp = post("/api/send-otp", { email, password });
  }
  useEffect(() => {
    // Clear session and reset on component load
    setRequireOtp(false);
    setOtp('');
  }, []);


  useEffect(() => {
    if (isLogIn()) {
      navigate('/worklog');
    }
  }, []);

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    window.deferredPrompt = e;
    setShowInstall(true);
  });

  const [inputValue, setInputValue] = useState("");


  const handleInputChange = (e) => {
    let value = e.target.value;

    // Check if the value is all digits
    if (/^\d*$/.test(value)) {
      // If all digits, limit to 10
      if (value.length > 10) {
        value = value.slice(0, 10);
      }
    }

    setInputValue(value);
  };

  const onInstall = async () => {
    if (window.deferredPrompt) {
      window.deferredPrompt.prompt();
      const { outcome } = await window.deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        window.deferredPrompt = null;
        setShowInstall(false);
      }
    }
  }

  const handleLogin = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();

    if (form.checkValidity() !== true) {
      setValidated(true);
      return;
    }

    setValidated(true);
    setLoading(true);

    const email = userNameRef.current?.value;
    const password = userPwdRef.current?.value;

    try {
      let resp;
      if (loginType === 'partner') {
        resp = await login2({ email, password });
      } else {
        resp = await login({ email, password });
      }

      if (resp.blocked) {
        showToast('danger', resp.message);
      } else {
        const userOrPartner = resp?.user ?? resp?.partner;

        if (userOrPartner) {
          // Normalize response so session.js can store it
          const normalizedResp = {
            token: resp.token,
            user: userOrPartner,
          };

          storeUserData(normalizedResp);

          // Navigate based on type
          if (userOrPartner.type === 3) {
            navigate('/company/new');
          } else if (userOrPartner.type === 1) {
            navigate('/dashboard');
          } else if (userOrPartner.type === 2) {
            navigate('/worklog');
          } else if (userOrPartner.type === 0) {
            navigate('/company/all');
          }  else if (userOrPartner.type === 4) {
            navigate('/expense/new');
          }else {
            navigate('/dashboard');
          }
        } else {
          showToast('danger', 'Please provide valid email and password');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      showToast('danger', 'Please provide valid email and password');
    } finally {
      setLoading(false);
    }
  };

  const handleTabSwitch = (type) => {
    setLoginType(type);
    setValidated(false);
    // Clear form when switching tabs
    if (userNameRef.current) userNameRef.current.value = '';
    if (userPwdRef.current) userPwdRef.current.value = '';
  };

  return (
    <div
      className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${nurseryPlant})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <CContainer fluid className="px-3 px-sm-4">
        <CRow className="justify-content-center">
          <CCol xs={12} sm={10} md={8} lg={6} xl={5} xxl={4}>
            <CCardGroup>
              <CCard
                className="p-0 shadow-lg border-0"
                style={{
                  borderRadius: '20px',
                  overflow: 'hidden',
                  backdropFilter: 'blur(10px)',
                  backgroundColor: 'rgba(255, 255, 255, 0.95x`)'
                }}
              >
                <CCardBody className="p-3 p-sm-4 p-md-5">
                  {/* Logo Section - Responsive */}
                  <div className="text-center mb-3 mb-sm-4">
                    <img
                      src={logo}
                      style={{
                        width: 'clamp(80px, 15vw, 120px)',
                        height: 'auto',
                        maxHeight: '120px',
                        borderRadius: '15px',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                      }}
                      className='object-fit-contain'
                      alt="Logo"
                    />
                    <h2
                      className="mt-3 mb-1"
                      style={{
                        fontWeight: '700',
                        color: '#2c3e50',
                        fontSize: 'clamp(20px, 5vw, 28px)'
                      }}
                    >
                      Welcome Back
                    </h2>
                    <p
                      className="text-muted mb-0"
                      style={{
                        fontSize: 'clamp(14px, 3vw, 16px)',
                        fontWeight: '400'
                      }}
                    >
                      Please sign in to continue
                    </p>
                  </div>

                  {/* Enhanced Tab Structure - Responsive */}
                  <div className="mb-3 mb-sm-4">
                    <CNav
                      variant="pills"
                      className="justify-content-center p-1"
                      style={{
                        backgroundColor: '#f8f9fa',
                        borderRadius: '15px',
                        border: '1px solid #e9ecef'
                      }}
                    >
                      <CNavItem style={{ flex: 1 }}>
                        <CNavLink
                          active={loginType === 'customer'}
                          onClick={() => handleTabSwitch('customer')}
                          style={{
                            cursor: 'pointer',
                            backgroundColor: loginType === 'customer' ? '#007bff' : 'transparent',
                            color: loginType === 'customer' ? 'white' : '#6c757d',
                            border: 'none',
                            borderRadius: '12px',
                            padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 20px)',
                            fontSize: 'clamp(12px, 2.5vw, 15px)',
                            fontWeight: '600',
                            textAlign: 'center',
                            transition: 'all 0.3s ease',
                            boxShadow: loginType === 'customer' ? '0 2px 8px rgba(0, 123, 255, 0.3)' : 'none'
                          }}
                          className={`${loginType === 'customer' ? '' : 'hover-effect'} d-flex align-items-center justify-content-center`}
                        >
                          <span className="d-none d-sm-inline">👤 Customer Login</span>
                          <span className="d-inline d-sm-none">👤 Customer</span>
                        </CNavLink>
                      </CNavItem>
                      <CNavItem style={{ flex: 1 }}>
                        <CNavLink
                          active={loginType === 'partner'}
                          onClick={() => handleTabSwitch('partner')}
                          style={{
                            cursor: 'pointer',
                            backgroundColor: loginType === 'partner' ? '#28a745' : 'transparent',
                            color: loginType === 'partner' ? 'white' : '#6c757d',
                            border: 'none',
                            borderRadius: '12px',
                            padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 20px)',
                            fontSize: 'clamp(12px, 2.5vw, 15px)',
                            fontWeight: '600',
                            textAlign: 'center',
                            transition: 'all 0.3s ease',
                            boxShadow: loginType === 'partner' ? '0 2px 8px rgba(40, 167, 69, 0.3)' : 'none'
                          }}
                          className={`${loginType === 'partner' ? '' : 'hover-effect'} d-flex align-items-center justify-content-center`}
                        >
                          <span className="d-none d-sm-inline">🤝 Partner Login</span>
                          <span className="d-inline d-sm-none">🤝 Partner</span>
                        </CNavLink>
                      </CNavItem>
                    </CNav>
                  </div>

                  {/* Login Form */}
                  <CForm noValidate={true} onSubmit={handleLogin}>
                    {/* Dynamic subtitle based on login type - Responsive */}
                    <div className="text-center mb-3 mb-sm-4">
                      <p
                        className="mb-0"
                        style={{
                          color: loginType === 'partner' ? '#28a745' : '#007bff',
                          fontSize: 'clamp(14px, 3vw, 16px)',
                          fontWeight: '500'
                        }}
                      >
                        <span className="d-none d-sm-inline">
                          {loginType === 'partner'
                            ? '🏢 Onboarding Partner Access'
                            : '🛍️ Customer Portal Access'
                          }
                        </span>
                        <span className="d-inline d-sm-none">
                          {loginType === 'partner' ? '🏢 Partner' : '🛍️ Customer'}
                        </span>
                      </p>
                      <small className="text-muted d-none d-sm-block" style={{ fontSize: 'clamp(12px, 2.5vw, 14px)' }}>
                        {loginType === 'partner'
                          ? 'Access your partner dashboard and tools'
                          : 'Manage your account and orders'
                        }
                      </small>
                    </div>

                    {/* Username Input - Responsive */}
                    <CInputGroup
                      className="mb-3"
                      style={{
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      <CInputGroupText
                        style={{
                          backgroundColor: loginType === 'partner' ? '#28a745' : '#007bff',
                          color: 'white',
                          border: 'none',
                          padding: 'clamp(10px, 2.5vw, 12px) clamp(12px, 3vw, 15px)'
                        }}
                      >
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        ref={userNameRef}
                        id="username"
                        placeholder={`Enter your ${loginType === "partner" ? "partner" : "customer"
                          } email or mobile number`}
                        autoComplete="username"
                        feedbackInvalid="Please provide a valid email address or mobile number."
                        required
                        value={inputValue}
                        onChange={handleInputChange}
                        style={{
                          border: "none",
                          padding: "clamp(10px, 2.5vw, 12px) clamp(12px, 3vw, 15px)",
                          fontSize: "clamp(14px, 3vw, 15px)",
                        }}
                      />
                    </CInputGroup>

                    {/* Password Input - Responsive */}
                    <CInputGroup
                      className="mb-3 mb-sm-4 position-relative"
                      style={{
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      <CInputGroupText
                        style={{
                          backgroundColor: loginType === 'partner' ? '#28a745' : '#007bff',
                          color: 'white',
                          border: 'none',
                          padding: 'clamp(10px, 2.5vw, 12px) clamp(12px, 3vw, 15px)'
                        }}
                      >
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        ref={userPwdRef}
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        feedbackInvalid="Please provide a valid password."
                        required
                        style={{
                          border: 'none',
                          padding: 'clamp(10px, 2.5vw, 12px) clamp(12px, 3vw, 15px)',
                          paddingRight: 'clamp(40px, 8vw, 50px)',
                          fontSize: 'clamp(14px, 3vw, 15px)'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        style={{
                          position: 'absolute',
                          top: '50%',
                          right: 'clamp(12px, 3vw, 15px)',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          zIndex: 10,
                          fontSize: 'clamp(16px, 4vw, 18px)',
                          color: '#6c757d'
                        }}
                      >
                        {showPassword ? '🔒' : '👁️'}
                      </button>
                    </CInputGroup>

                    {/* Action Buttons - Responsive */}
                    <CRow className="align-items-center gy-2 gy-sm-0">
                      <CCol xs={12} sm={7} md={6} className="mb-2 mb-sm-0">
                        <CButton
                          color={loginType === 'partner' ? 'success' : 'primary'}
                          type="submit"
                          className="w-100"
                          disabled={loading}
                          style={{
                            padding: 'clamp(10px, 2.5vw, 12px) clamp(16px, 4vw, 24px)',
                            fontSize: 'clamp(14px, 3vw, 16px)',
                            fontWeight: '600',
                            borderRadius: '12px',
                            border: 'none',
                            boxShadow: `0 4px 15px rgba(${loginType === 'partner' ? '40, 167, 69' : '0, 123, 255'}, 0.3)`,
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              <span className="d-none d-sm-inline">Logging In...</span>
                              <span className="d-inline d-sm-none">Logging...</span>
                            </>
                          ) : (
                            <>
                              <span className="d-none d-sm-inline">
                                🔐 Login
                              </span>
                              <span className="d-inline d-sm-none">
                                🔐 Logging in
                              </span>
                            </>
                          )}
                        </CButton>
                      </CCol>
                      <CCol xs={12} sm={5} md={6} className="text-center text-sm-end">
                        <CButton
                          color="link"
                          className="px-0 text-decoration-none w-100 w-sm-auto"
                          onClick={() => navigate('/sendEmailForResetLink')}
                          style={{
                            color: '#6c757d',
                            fontSize: 'clamp(12px, 2.5vw, 14px)',
                            fontWeight: '500'
                          }}
                        >
                          🔑 Forgot Password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>

      {/* Install App Button - Responsive */}
      {showInstall && (
        <CButton
          onClick={onInstall}
          color="success"
          style={{
            position: 'fixed',
            top: 'clamp(15px, 4vw, 20px)',
            right: 'clamp(15px, 4vw, 20px)',
            borderRadius: '50%',
            width: 'clamp(50px, 12vw, 60px)',
            height: 'clamp(50px, 12vw, 60px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
            border: 'none',
            zIndex: 1000
          }}
        >
          <CIcon icon={cilArrowThickFromTop} style={{ fontSize: 'clamp(18px, 5vw, 24px)', color: 'white' }} />
        </CButton>
      )}

      {/* Version Display - NEW ADDITION */}
      <div
        style={{
          position: 'fixed',
          bottom: '15px',
          right: '15px',
          fontSize: '12px',
          color: '#6c757d',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '6px 12px',
          borderRadius: '15px',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(5px)',
          zIndex: 1000,
          fontFamily: 'monospace',
          userSelect: 'none',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          transition: 'all 0.3s ease'
        }}
        title={`Application Version: v${APP_VERSION}`}
      >
        v{APP_VERSION}
      </div>

      {/* Custom CSS for hover effects and responsive styles */}
      <style jsx>{`
        .hover-effect:hover {
          background-color: rgba(108, 117, 125, 0.1) !important;
          transform: translateY(-1px);
        }
        
        /* Additional responsive styles */
        @media (max-width: 576px) {
          .min-vh-100 {
            padding: 10px 0;
          }
        }
        
        @media (max-width: 400px) {
          .min-vh-100 {
            padding: 5px 0;
          }
        }
        
        /* Ensure proper touch targets on mobile */
        @media (max-width: 768px) {
          button, .btn {
            min-height: 44px;
          }
          
          input {
            min-height: 44px;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;