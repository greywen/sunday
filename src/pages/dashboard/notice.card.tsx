import { Carousel, Col, Row } from "antd";
import React from "react";
import styles from "./index.module.less";

const NoticeCard = () => {
  return (
    <Col xxl={16} lg={24} md={24} sm={24} xs={24}>
      <div className={styles.card}>
        <div className={styles.cardContent}>
          <div className={styles.cardHeader}>
            <Row justify="space-between">
              <Col span={20}>通知</Col>
              <Col span={4}></Col>
            </Row>
          </div>
          <Row className={styles.cardCarousel}>
            <Col span={24}>
              <Carousel autoplay dotPosition="bottom">
                <div className={styles.cardCarouselContent}>
                  五月鱼王争霸赛，让我们一起动起来吧！
                  <br />
                  第一名🥇获得BOSS二百元奖励， <br />
                  第二名🥈获得BOSS一百元奖励， <br />
                  第三名🥉获得BOSS五十元奖励， <br />
                  阳光普照奖️，BOSS群发瓜分五十元手气红包奖励。
                  <br />
                  五月新规如下：
                  请大家五月份开始使用我们摸鱼小程序进行打卡，必须实名制，大家进入小程序改好自己的真实姓名哦！
                  1.
                  工作时间打卡文轩公园，拍照上传小程序得一星；非工作时间打卡文轩公园或当日日行10000步以上（上传拍照打卡图或者上传微信步数）得二星。三项不叠加
                  2.
                  比赛时间为每个月的1号到月底，次月一号公布名次。月打卡天数超过10天的方有获奖资格。
                  3.如果有并列名次发生，将以谁先打的卡为获胜者，最终以小程序上显示的名次进行颁奖。
                  4.阳光普照就BOSS群里发群手气红包，它的发放条件是：有合格的前三名产生。鼓励大家怂恿其他童鞋运动打卡哦～
                  最终解释权归公司行政部所有，如有变动会另行通知哦
                </div>
                <div className={styles.cardCarouselContent}>
                  新书订阅开始了～小伙伴们有想看的技术书籍，可以跟我反馈，公司统一采购。
                  大家借阅书籍，请记得在登记册上做好登记。书籍借阅时间单次请勿超过30天，便于其他同事借阅。
                  也请小伙伴们爱护书籍，丢失毁损需照价赔偿哦！
                </div>
                <div className={styles.cardCarouselContent}>
                  1.本周搞卫生的需要在周五搞完最后一天卫生后在下周一下班前群里艾特下一个搞卫生的童鞋否则下周还是该童鞋搞卫生哦！
                  <br />
                  2.当天卫生需要在当天下班搞好，范围：办公公共区域、其中：茶水间——需把桶里的废水倒掉、桌上保持清洁无垃圾；会议室桌面保持清洁；保持办公区域地面清洁（有垃圾一定要打扫🧹干净‼️）；所有垃圾桶已经满了的倒掉换好新的垃圾袋；老板办公室日常打理保持干净整洁。
                  <br />
                  3.大家照顾好自己领的花，公共区域的花由搞卫生的人两天浇一次水，然后大家看到了公共区域的花渴了也可以动动手浇一下。每周五结束辛苦本周值日卫生员和下周值日卫生员的童鞋一起协助扫地拖地，每个人整理好自己的桌面，保持办公室舒适整洁，劳动光荣，动起来吧！
                  <br />
                  4.当天忘记搞卫生或敷衍了事的值日者以及周五未扫地及拖地的两位童鞋需罚款50元（罚款不是最终目的，一周会有一次友善提醒）
                  <br />
                </div>
              </Carousel>
            </Col>
          </Row>
        </div>
        <div className="card-footer"></div>
      </div>
    </Col>
  );
};

export default NoticeCard;
