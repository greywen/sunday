import styles from './index.module.less';
import React, { useState } from 'react';
import Rank from '@components/rank';
import Records from '@components/records';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import useAsyncEffect from '@hooks/useAsyncEffect';
import { getRecords } from '@apis/moyu';
import { IMoYuRecord } from '@interfaces/moyu';

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

const MoyuRank = () => {
  const [records, setRecords] = useState<IMoYuRecord[]>([]);
  const [time, setTime] = useState(false);

  useAsyncEffect(async () => {
    const records = await getRecords();
    setRecords(records)
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <Rank />
      </div>
      <div className={styles.right}>
        <Slider {...settings} >
          <Records records={records} />
          <Records records={records} />
        </Slider>
      </div>
    </div>
  )
}

export default MoyuRank