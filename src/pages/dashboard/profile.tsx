import { getRankList } from '@apis/moyu';
import { getMembers } from '@apis/user';
import Avatar from '@components/avatar';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { IRankList } from '@interfaces/moyu';
import { IUserMember } from '@interfaces/user';
import { useAccount } from '@utils/utils';
import moment from 'moment';
import React from 'react';
import { useState } from 'react';
import styles from './index.module.less';

const RANK_CONFIGS = [
  {
    text: '一',
    color: '#f56a00',
  },
  {
    text: '二',
    color: '#85ce67',
  },
  {
    text: '三',
    color: '#1890ff',
  },
  {
    text: '四',
    color: '#a2b6f5',
  },
  {
    text: '五',
    color: '#a2b6f5',
  },
];
const Profile = () => {
  const account = useAccount();
  const [members, setMembers] = useState<IUserMember[]>([]);
  const [rankList, setRankList] = useState<IRankList[]>([]);
  function calcHiredDay() {
    return moment().diff(moment(account.hiredDate), 'day');
  }

  useAsyncEffect(async () => {
    const data = await getMembers();
    const rankList = await getRankList();
    const _rankList = rankList
      .sort((a, b) => (a.integral > b.integral ? 0 : 1))
      .map((x, index) => {
        x.index = index + 1;
        return x;
      });

    setMembers(data);
    setRankList(_rankList.slice(0, 5));
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
        {rankList.length > 0 &&
          rankList.map((x, index) => (
            <>
              <div key={x.wxUserId} className={styles.progressStatus}>
                <span className={styles.nickName}>{x.nickName}</span>
                <span>
                  {x.integral}/{rankList[0].integral}
                </span>
              </div>
              <div className={styles.isProgress}>
                <div
                  className={styles.isProgressBar}
                  style={{
                    backgroundColor: RANK_CONFIGS[index].color,
                    width: `${(x.integral / rankList[0].integral) * 100}%`,
                  }}
                ></div>
              </div>
            </>
          ))}
      </div>
      <div className={styles.sideWrapper}>
        <div className={styles.sideTitle}>团队成员</div>
        <div className={styles.teamMember}>
          {members.length > 0 &&
            members
              .filter((x) => x.username != account.username)
              .map((x) => {
                return x.avatar ? (
                  <img
                    title={x.username}
                    src={x.avatar}
                    className={styles.members}
                  />
                ) : (
                  <Avatar
                    title={x.username}
                    size='small'
                    text={x.username.slice(-2)}
                  />
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
