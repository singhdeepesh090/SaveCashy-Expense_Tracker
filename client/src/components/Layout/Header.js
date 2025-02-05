import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogoutOutlined } from '@ant-design/icons';
import { message } from 'antd';
import logo from './expenseLogo.png';

const Header = () => {
  const [loginUser, setLoginUser] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setLoginUser(user);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
    message.success('Logout successfully');
  };

  return (
    <header className="bg-gray-700 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <img src={logo} alt="Expense Tracker Logo" className="h-[60px] max-w-[250px] mx-3" />
          <h1 className="text-xl font-bold"></h1>
        </div>
        <nav>
          <ul className="flex space-x-4 justify-center align-middle">
            <li>
              <Link to="/" className="text-white hover:text-gray-200">
                {/*loginUser && loginUser.name.split(' ')[0]*/}
              </Link>
            </li>
            <li>
            <button
  className="absolute top-1 right-4 flex items-center gap-2 bg-gradient-to-r from-black to-gray-800 hover:from-green-500 hover:to-green-400 text-white font-semibold py-3 px-5 rounded-full shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400"
  onClick={handleLogout}
>
  <LogoutOutlined className="text-lg" />
  Logout
</button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
