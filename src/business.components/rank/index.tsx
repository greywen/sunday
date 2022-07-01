import React, { useState } from 'react';
import useAsyncEffect from '@hooks/useAsyncEffect';
import styles from './index.module.less';
import { getRankList } from '@apis/moyu';
import logoImg from '@assets/logo-yellow.svg';
import TopThreeRank from '../topThreeRank';
import { IRankList } from '@interfaces/moyu';

const Rank = () => {
  const [rankList, setRankList] = useState<IRankList[]>([]);

  useAsyncEffect(async () => {
    const rankList = await getRankList();
    setRankList(rankList);
  }, []);

  const renderHeader = (
    <div className={styles.header}>
      <div className={styles.logoWrapper}>
        <img className={styles.logoImg} src={logoImg} alt='摸鱼logo' />
        <img
          className={styles.rankImg}
          src={require('../../assets/ranklogo.png').default}
        />
      </div>
    </div>
  );

  const renderRankList = () => {
    const rankSevenList = rankList.slice(3, 10);

    return (
      <div className={styles.ranklist}>
        <div className={styles.ranklistInner}>
          <div className={styles.ranklistHeader}>
            <span className={styles.rank}>排名</span>
            <span className={styles.name}>姓名</span>
            <span className={styles.score}>积分</span>
          </div>
          {rankSevenList.map((item, index) => {
            return (
              <div className={styles.item} key={`${index}-item`}>
                <span className={styles.sequence}>{index + 4}</span>
                <img src={item.wxUserAvatarUrl} alt='头像' />
                <span className={styles.nickname}>{item.nickName}</span>
                <span className={styles.integral}>{item.integral}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const rankThree = (rankList: IRankList[]) => {
    const rankThreeList = rankList.slice(0, 3);
    [rankThreeList[0], rankThreeList[1]] = [rankThreeList[1], rankThreeList[0]];
    return rankThreeList;
  };

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        {renderHeader}
        {rankList.length !== 0 && (
          <TopThreeRank rankThreeList={rankThree(rankList)} />
        )}
        {rankList && renderRankList()}
      </div>
    </div>
  );
};

export default Rank;
