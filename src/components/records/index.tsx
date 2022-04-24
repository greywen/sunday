import { IMoYuRecord } from "@interfaces/moyu";
import React, { useEffect, useState } from "react"
import styles from './index.module.less';
import camera from '../../assets/icon/icon/icon_camera.svg'
import foot from '../../assets/icon/icon/icon_foot.svg'
import Macy from 'macy'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


interface IProps {
  records: IMoYuRecord[],
}

const Records = (props: IProps) => {
  const [masonry, setMasonry] = useState<any>()
  const cn = Math.floor(Math.random() * (100 - 0)) + 0

  const { records } = props
  useEffect(() => {  
        if (masonry) {
      masonry.reInit()
    } else {
      let masonry = new Macy({
        container: `.aa${cn}`, // 图像列表容器
        trueOrder: false,
        waitForImages: false,
        useOwnImageLoader: false,
        debug: true,
        margin: { x: 0, y: 20 },    // 设计列与列的间距
        columns: 3,    // 设置列数
      })
      setMasonry(masonry)
    }

  },[records])

  return (
      <div className={[styles.body, `aa${cn}`].join(' ')}>
        {records.map((item, index) => {
          return (
            <div key={index} className={styles.itemBox}>
              <div className={styles.item} >
                <div className={styles.con}>
                  <div className={styles.user}>
                    <div>
                      <img src={item.imageUrl} alt="" />
                      <div>{item.wxUserNickName}</div>
                    </div>
                    <div>
                      <img src={item.imageUrl ? camera : foot} alt="" />
                      <div>{item.date} {item.hour}</div>
                    </div>
                  </div>
                  <div className={styles.desc}>
                    {item.desc}
                  </div>
                </div>
                {
                  item.imageUrl && <img src={item.imageUrl} className={styles.img} alt="" />
                }
              </div>
            </div>
          )
        })}
      </div>
  )
}
export default Records