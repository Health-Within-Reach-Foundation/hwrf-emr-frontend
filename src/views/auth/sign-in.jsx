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
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const { email, password } = values;
      const responseData = await login(email.toLowerCase(), password);
      if (responseData.user && responseData.token) {
        toast.success('Logged in');
        navigate('/');
      }
    } catch (err) {
      console.log('[Login error]', err);
      toast.error(err.message || err || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignIn;
