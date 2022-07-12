import React from 'react';
import styles from './index.module.less';

interface IAvatar {
  text: string;
}

const Avatar = ({ text }: IAvatar) => {
  return <div className={styles.avatar}>{text}</div>;
};

export default Avatar;
