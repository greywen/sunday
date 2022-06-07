import { Carousel, Col, Row } from "antd";
import React, { useState } from "react";
import styles from "./index.module.less";
import { useNavigate } from "react-router-dom";
import useAsyncEffect from "@hooks/useAsyncEffect";
import { getCurInform } from "@apis/inform";
import { IInfrom } from "@interfaces/inform";
import { EllipsisOutlined } from "@ant-design/icons";

const NoticeCard = () => {
  const navigate = useNavigate();

  const [data, setData] = useState<IInfrom[]>([])
  useAsyncEffect(async () => {
    let result = await getCurInform();
    setData(result)
  }, []);

  return (
    <Col xxl={16} lg={24} md={24} sm={24} xs={24}>
      <div className={styles.card}>
        <div className={styles.cardContent}>
          <div className={styles.cardHeader}>
            <Row justify="space-between">
              <Col>通知</Col>
              <Col onClick={() => { navigate("/inform") }}><EllipsisOutlined /></Col>
            </Row>
          </div>
          <Row className={styles.cardCarousel}>
            <Col span={24}>
              <Carousel autoplay dotPosition="bottom">
                {data.map((item) => {
                  return (
                    <div key={item.id} className={styles.cardCarouselContent} dangerouslySetInnerHTML={{ __html: item.content }}>
                    </div>
                  )
                })}
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
