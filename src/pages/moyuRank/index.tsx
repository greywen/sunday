import styles from './index.module.less';
import React, { useState } from 'react';
import Rank from '@components/rank';
import Records from '@components/records';
import { Spin } from 'antd';
import Slider from 'react-slick';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { getRecords } from '@apis/moyu';
import { IMoYuRecord } from '@interfaces/moyu';
import BackHome from '@components/backhome';

const settings = {
  vertical: true,
  verticalSwiping: true,
  arrows: false,
  infinite: true,
  autoplay: true,
  speed: 250000,
  autoplaySpeed: 10,
  cssEase: 'linear',
  pauseOnHover: false,
  adaptiveHeight: true,
};

const MoyuRank = () => {
  const [records, setRecords] = useState<IMoYuRecord[]>([]);

  useAsyncEffect(async () => {
    const records = await getRecords();
    setRecords(records);
    let timer = setInterval(async () => {
      const records = await getRecords();
      setRecords(records);
    }, 600000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className={styles.container}>
      <BackHome />
      <div className={styles.left}>
        <Rank />
      </div>
      <div className={styles.right}>
        {records.length !== 0 || (
          <div className={styles.loading}>
            <Spin size={'large'} />
          </div>
        )}

        <Slider {...settings}>
          <Records records={records} />
          <Records records={records} />
        </Slider>
      </div>
    </div>
  );
};

export default MoyuRank;
