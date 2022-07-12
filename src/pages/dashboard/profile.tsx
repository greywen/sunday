import Avatar from '@components/avatar';
import { useAccount } from '@utils/utils';
import moment from 'moment';
import React from 'react';
import styles from './index.module.less';

const Profile = () => {
  const account = useAccount();
  function calcHiredDay() {
    return moment().diff(moment(account.hiredDate), 'day');
  }

  return (
    <div className={`${styles.userProfileArea}`}>
      <div className={styles.sideWrapper}>
        <div className={styles.userProfile}>
          {account.avatar ? (
            <img src={account.avatar} className={styles.userPhoto} />
          ) : (
            <Avatar text={account.username.slice(-2)} />
          )}
          <div className={styles.userName}>{account.username}</div>
          <div className={styles.userTitle}>{account.title}</div>
          <div className={styles.userAge}>
            {account.hiredDate
              ? `在岗拼搏 ${calcHiredDay()} 天了`
              : '度过愉快的一天！'}
          </div>
          {/* <div className={styles.userMail}>
            {account.phone || account.email}
          </div> */}
        </div>
      </div>
      <div className={styles.sideWrapper}>
        <div className={styles.sideTitle}>本月摸鱼</div>
        <div className={styles.progressStatus}>
          <span>第一名</span>
          <span>12/34</span>
        </div>
        <div className={styles.progress}>
          <div className={styles.progressBar}></div>
        </div>
      </div>
      <div className={styles.sideWrapper}>
        <div className={styles.sideTitle}>团队成员</div>
        <div className={styles.teamMember}>
          <img
            src='https://images.unsplash.com/flagged/photo-1574282893982-ff1675ba4900?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80'
            className={styles.members}
          />
          <img
            src='https://images.unsplash.com/flagged/photo-1574282893982-ff1675ba4900?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80'
            className={styles.members}
          />
          <img
            src='https://assets.codepen.io/3364143/Screen+Shot+2020-08-01+at+12.24.16.png'
            className={styles.members}
          />
          <img
            src='https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60'
            className={styles.members}
          />
          <img
            src='https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=998&q=80'
            className={styles.members}
          />
          <img
            src='https://images.unsplash.com/photo-1541647376583-8934aaf3448a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80'
            className={styles.members}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
