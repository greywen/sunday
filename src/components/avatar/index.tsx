import React from 'react';
import styles from './index.module.less';

interface IAvatar {
  text: string;
  size?: 'small' | 'middle' | 'large';
  title?: string;
}

const Avatar = ({ text, size = 'large', title }: IAvatar) => {
  return (
    <div title={title} className={`${styles.avatar} ${styles['' + size]}`}>
      {text}
    </div>
  );
};

export default Avatar;
