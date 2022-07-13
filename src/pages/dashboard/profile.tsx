import { getMembers } from '@apis/user';
import Avatar from '@components/avatar';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { IUserMember } from '@interfaces/user';
import { useAccount } from '@utils/utils';
import moment from 'moment';
import React from 'react';
import { useState } from 'react';
import styles from './index.module.less';

const Profile = () => {
  const account = useAccount();
  const [members, setMembers] = useState<IUserMember[]>([]);
  function calcHiredDay() {
    return moment().diff(moment(account.hiredDate), 'day');
  }

  useAsyncEffect(async () => {
    const data = await getMembers();
    setMembers(data);
  }, []);

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
          {members.length > 0 &&
            members.map((x) => {
              return x.avatar ? (
                <img src={x.avatar} className={styles.members} />
              ) : (
                <Avatar size='small' text={x.username} />
              );
            })}
        </div>
      </div>
      <div className={styles.copyrightTips}>
        {`© ${new Date().getFullYear()} 猿媛乐园. All Rights Reserved.`}
      </div>
    </div>
  );
};

export default Profile;
