import styles from './index.module.less';
import React, { useState } from 'react';
import Rank from '@components/rank';
import Records from '@components/records';
import { Carousel } from 'antd';
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
  autoplay: true,
  speed: 180000,
  autoplaySpeed: 100,
  cssEase: "linear",
};

const MoyuRank = () => {
  const [records, setRecords] = useState<IMoYuRecord[]>([]);
  const [itemHieght, setItemHieght] = useState(0);
  setTimeout(() => {
    const bodyItemEle = document.getElementsByClassName('bodyItem')[0];
    if (bodyItemEle) {
      setItemHieght(bodyItemEle?.clientHeight)
    }
  }, 100)

  useAsyncEffect(async () => {
    const records = await getRecords();
    setRecords(records)
    let timer = setInterval(async () => {
      const records = await getRecords();
      setRecords(records)
    }, 600000)
    return () => {
      clearInterval(timer)
    }
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <Rank />
      </div>
      <div className={styles.right}>
        {records.length !== 0 && (
            <Slider {...settings}>
              <Records records={records} />
              {itemHieght > 1040 && <Records records={records} />}
              <Records records={records} />
            </Slider>
        )}
        {/* {records.length !== 0 && (
          itemHieght > 1040 ?
            <Carousel
              autoplay
              dotPosition={'left'}
              arrows={false}
              speed={180000}
              dots={false}
            >
              <Records records={records} />
              <Records records={records} />
            </Carousel> :
            <Records records={records} />
        )} */}
      </div>
    </div>
  )
}

export default MoyuRank