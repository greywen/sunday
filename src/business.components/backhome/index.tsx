import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BackHome = () => {
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
      className='back-dashboard'
      onClick={() => {
        navigate('/');
      }}
    >
      {hover ? <ArrowLeftOutlined style={{ fontSize: 22 }} /> : '返回首页'}
    </div>
  );
};
export default BackHome;
