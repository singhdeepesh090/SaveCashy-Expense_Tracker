import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../components/Spinner';
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const onFinish = async (values) => {
    try {
      setLoading(true);
      const { data } = await axios.post('/users/login', values);
      message.success("Login successfully");
      localStorage.setItem('user', JSON.stringify({ ...data.user, password: '' }));
      setLoading(false);
      navigate('/');
    } catch (err) {
      setLoading(false);
      message.error("Something went wrong");
      console.log(err);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('user')) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-900">
      {loading && <Spinner />}
      <Form
        layout="vertical"
        className="flex flex-col gap-4 p-8 bg-gray-800 rounded-2xl shadow-lg transition-transform transform hover:scale-105 border border-gray-700"
        onFinish={onFinish}
      >
        <h1 className="text-center text-white text-xl font-semibold mb-4">Login</h1>
        <Form.Item
          label={<span className="text-gray-300">Email</span>}
          name="email"
          rules={[{ required: true, message: 'Please enter your email' }]}
        >
          <Input 
  type="email" 
  className="w-full p-3 rounded-lg bg-gray-700 text-white border-none focus:bg-gray-800 focus:ring-2 focus:ring-gray-600" 
/>

        </Form.Item>
        <Form.Item
          label={<span className="text-gray-300">Password</span>}
          name="password"
          rules={[{ required: true, message: 'Please enter your password' }]}
        >
          <input
          id="password"
          type={visible ? "text" : "password"}
          className="w-full p-3 rounded-lg bg-gray-700 text-white border-none focus:ring-2 focus:ring-gray-600"
          placeholder="Enter password"
        />

        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" className="w-full py-2 bg-gray-700 text-white rounded-lg transition hover:bg-black">
            Log in
          </Button>
        </Form.Item>
        <div className="text-center">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-400 hover:underline">Register Here</Link>
          </p>
        </div>
      </Form>
      <div className="mt-6 text-center text-gray-300">
        <p className="text-lg font-bold">Demo user</p>
        <p>Email: demo@demo.com</p>
        <p>Password: 123456789</p>
      </div>
    </div>
  );
};

export default Login;
