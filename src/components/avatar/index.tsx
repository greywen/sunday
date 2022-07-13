import React from 'react';
import styles from './index.module.less';

interface IAvatar {
  text: string;
  size?: 'small' | 'middle' | 'large';
}

const Avatar = ({ text, size = 'large' }: IAvatar) => {
  return <div className={`${styles.avatar} ${styles['' + size]}`}>{text}</div>;
};

export default Avatar;
