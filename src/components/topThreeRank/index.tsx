import { IRankList } from "@interfaces/moyu";
import React, { FC, useState, useEffect } from "react";
import styles from './index.module.less';

import championBgImg from '@assets/冠军背景.svg';
import firstImg from '@assets/第一名.svg';
import secondImg from '@assets/第二名.svg';
import thirdImg from '@assets/第三名.svg';
import rectangleBgImg from '@assets/矩形 40.svg';
import pathBgImg from '@assets/路径 27.svg';

interface IRankThreeList {
  rankThreeList: IRankList[];
}


const TopThreeRank: FC<IRankThreeList> = ({ rankThreeList }) => {
  return (
    <div className={styles.container}>
      <div className={styles.rankThreeBg}>
        <img className={styles.rectangleBg} src={rectangleBgImg} alt="" />
        <img className={styles.championBg} src={championBgImg} alt="" />
        <img className={styles.leftPathBg} src={pathBgImg} alt="" />
        <img className={styles.rightPathBg} src={pathBgImg} alt="" />
      </div>
      <img className={styles.firstImg} src={firstImg} alt="第一名" />
      <img className={styles.secondImg} src={secondImg} alt="第二名" />
      <img className={styles.thirdImg} src={thirdImg} alt="第三名" />
      <div className={styles.rankThree}>
        {
          rankThreeList.map((item, index) => {
            return (
              <div className={styles.item}  key={`${index}-item`}>
                <div className={styles.avatar}>
                  <img src={item.wxUserAvatarUrl} alt="" />
                </div>
                <p className={styles.nickname}>
                  <span>{item.nickName}</span>
                </p>
                <p className={styles.integral}>{item.integral}</p>
              </div>
            )
          })
        }
      </div>
    </div>
  )
};

export default TopThreeRank;