import React, { useState } from 'react';
import { Form, Input, Checkbox, Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../utilities/AuthProvider';
import toast from 'react-hot-toast';

const generatePath = (path) => {
  return window.origin + import.meta.env.BASE_URL + path;
};

const SignIn = () => {
  const [form] = Form.useForm();
  const [otpForm] = Form.useForm();
  const { login, verifyOtp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [otpRequired, setOtpRequired] = useState(false);
  const [preAuthToken, setPreAuthToken] = useState('');
  const navigate = useNavigate();

  // Step 1: Email + Password
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const { email, password } = values;
      const responseData = await login(email.toLowerCase(), password);

      // Production: OTP required
      if (responseData?.otpRequired) {
        setPreAuthToken(responseData.preAuthToken);
        setOtpRequired(true);
        toast.success(responseData.message || 'OTP sent to your registered email');
        return;
      }

      // Development: direct login (no OTP)
      if (responseData?.user && responseData?.tokens) {
        toast.success('Logged in');
        navigate('/');
      }
    } catch (err) {
      console.log('[Login error]', err);
      toast.error(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: OTP verification
  const handleOtpSubmit = async (values) => {
    try {
      setLoading(true);
      await verifyOtp(preAuthToken, values.otp);
      toast.success('Logged in successfully');
      navigate('/');
    } catch (err) {
      console.log('[OTP error caught in sign-in]', err);
      toast.error(err?.message || 'Invalid or expired OTP');
      otpForm.resetFields();
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setOtpRequired(false);
    setPreAuthToken('');
    otpForm.resetFields();
  };

  return (
    <section className="sign-in-page d-flex align-items-center min-vh-100">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <Link to="/" className="sign-in-logo mb-4 d-block">
              <img src={generatePath('/assets/images/hwrf-vertical.svg')} className="img-fluid" alt="Logo" />
            </Link>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5 p-4 border rounded bg-light">

            {!otpRequired ? (
              // ── Step 1: Login form ──────────────────────────────────────
              <>
                <h2 className="text-center mb-4">Sign In</h2>
                <Form form={form} layout="vertical" onFinish={handleSubmit} className="signin-form" size="large">
                  <Form.Item
                    label="Email Address"
                    name="email"
                    className="email_address"
                    rules={[
                      { required: true, message: 'Please enter your email' },
                      { type: 'email', message: 'Enter a valid email' },
                    ]}
                  >
                    <Input className="ant-input" placeholder="Enter email" />
                  </Form.Item>

                  <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please enter your password' }]}
                  >
                    <Input.Password placeholder="Enter password" />
                  </Form.Item>

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                      <Checkbox>Remember Me</Checkbox>
                    </Form.Item>
                    <Link to="/auth/recover-password" className="text-decoration-none text-decoration-underline">
                      Forgot Password?
                    </Link>
                  </div>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      variant="solid"
                      className="btn-primary bg-primary w-100"
                      size="large"
                      loading={loading}
                    >
                      Sign In
                    </Button>
                  </Form.Item>
                </Form>
              </>
            ) : (
              // ── Step 2: OTP form ────────────────────────────────────────
              <>
                <h2 className="text-center mb-2">Verify OTP</h2>
                <p className="text-center text-muted mb-4">
                  A 6-digit OTP has been sent to your registered email address. It is valid for 10 minutes.
                </p>
                <Form form={otpForm} layout="vertical" onFinish={handleOtpSubmit} size="large">
                  <Form.Item
                    label="Enter OTP"
                    name="otp"
                    rules={[
                      { required: true, message: 'Please enter the OTP' },
                      { len: 6, message: 'OTP must be exactly 6 digits' },
                      { pattern: /^[0-9]{6}$/, message: 'OTP must be numeric' },
                    ]}
                  >
                    <Input
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                      inputMode="numeric"
                      style={{ letterSpacing: '0.3em', fontSize: '1.2rem', textAlign: 'center' }}
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) => {
                        // Strip any non-numeric characters on paste
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        otpForm.setFieldValue('otp', val);
                      }}
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="btn-primary bg-primary w-100"
                      size="large"
                      loading={loading}
                    >
                      Verify OTP
                    </Button>
                  </Form.Item>

                  <div className="text-center">
                    <Button type="link" onClick={handleBackToLogin} disabled={loading}>
                      ← Back to Login
                    </Button>
                  </div>
                </Form>
              </>
            )}

          </div>
        </div>
      </div>
    </section>
  );
};

export default SignIn;
