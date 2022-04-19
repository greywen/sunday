import styles from './index.module.less';
import img from '../../assets/crown.svg';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import { useEffect, useState } from 'react';
import { IMoYuRecord, IRankList } from '../../interfaces/index';
import React from 'react';
import useAsyncEffect from '@hooks/useAsyncEffect';
import QueueAnim from 'rc-queue-anim';
import { getRankList, getRecords } from '@apis/moyu';


const settings = {
  vertical: true,
  verticalSwiping: true,
  arrows: false,
  infinite: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  speed: 100000,
  autoplaySpeed: -100,
  cssEase: "linear",
};

const Rank = () => {
  const [rankList, setRankList] = useState<IRankList[]>([]);
  const [records, setRecords] = useState<IMoYuRecord[]>([]);


  useAsyncEffect(async () => {
    const rankList = await getRankList();
    setRankList(rankList)
    const records = await getRecords();
    setRecords(records)
  }, [])


  //前三名
  const topThreeRank = (
    <div className={styles.topThree}>
      <div className={[styles.itemShadow, styles.notFirst].join(' ')}>
        <div className={styles.item}>
          <img src={rankList[2]?.wxUserAvatarUrl} alt="" />
        </div>
      </div>
      <div className={styles.itemShadow}>
        <div className={styles.item}>
          <img src={rankList[0]?.wxUserAvatarUrl} alt="" />
        </div>
      </div>
      <div className={[styles.itemShadow, styles.notFirst].join(' ')}>
        <div className={styles.item}>
          <img src={rankList[1]?.wxUserAvatarUrl} alt="" />
        </div>
      </div>
    </div>
  )

  //前六名
  const afterSevenRank = (
    <div className={styles.box}>
      {
        rankList.slice(0, 6).map((item, index) => {
          return (
            <div className={styles.item} key={index}>
              <div>
                <div>{index + 1}</div>
                <img src={item.wxUserAvatarUrl} alt="" />
                <div>{item.nickName}</div>
              </div>
              <div>
                <p>积分 {item.integral}</p>
                {/* <p>打卡次数 {item.count}</p> */}
              </div>
            </div>
          )
        })
      }
    </div>
  )
  //轮播图内容
  const recordsSliderItem = (
    <div>
      {records.map((item, index) => {
        return (
          <div key={index} className={styles.item}>
            {item.imageUrl ? <p className={styles.imgText}>照片</p> : <p>步数</p>}
            <div className={styles.user}>
              <div>
                <img src={item.wxUserAvatarUrl} alt="" />
                <div>{item.wxUserNickName}</div>
              </div>
              <div className={styles.time}>
                <div>{item.date}</div>
                <div>{item.hour}</div>
              </div>
            </div>
            <div className={styles.desc}>{item.desc}</div>
            {
              item.imageUrl ?
                <img src={item.imageUrl} className={styles.img} alt="" /> :
                <div style={{ height: '' }}></div>
            }
          </div>
        )
      })}
    </div>
  )

  //轮播图
  const recordsSlider = (
    <Slider {...settings} className={styles.Slider}>
      {recordsSliderItem}
      {recordsSliderItem}
      {recordsSliderItem}
    </Slider>
  )

  return (
    <QueueAnim delay={300} className="queue-simple">
      <div className={styles.container}  key="a">
        <div className={styles.left}>
          <div className={styles.head}>
            <div className={styles.crown}>
              <img src={img} alt="" style={{ width: '100%' }} />
            </div>
            {rankList && topThreeRank}
          </div>
          {rankList && afterSevenRank}
        </div>

        <div className={styles.right}>
          {records && recordsSlider}
        </div>
      </div>
    </QueueAnim>
  )
}

export default Rank