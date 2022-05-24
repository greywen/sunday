import { getRankList } from "@apis/moyu";
import useAsyncEffect from "@hooks/useAsyncEffect";
import { IRankList } from "@interfaces/moyu";
import { Col, Row, Table } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.less";

const RankCard = () => {
  const navigate = useNavigate();
  const [rankList, setRankList] = useState<IRankList[]>([]);

  useAsyncEffect(async () => {
    const rankList = await getRankList();
    const _rankList = rankList
      .sort((a, b) => (a.integral > b.integral ? 0 : 1))
      .map((x, index) => {
        x.index = index + 1;
        return x;
      });
    setRankList(_rankList);
  }, []);

  const columns = [
    {
      title: "排名",
      width: "30%",
      key: "index",
      render: (_: IRankList) => {
        return <span className={`${styles.rank}`}>{_.index}</span>;
      },
    },
    {
      title: "姓名",
      width: "40%",
      dataIndex: "nickName",
      key: "nickName",
    },
    {
      title: "积分",
      width: "30%",
      dataIndex: "integral",
      key: "integral",
    },
  ];
  return (
    <Col xxl={8} lg={12} md={24} sm={24} xs={24}>
      <div className={styles.card}>
        <div className={styles.cardContent}>
          <div className={styles.cardHeader}>
            <Row justify="space-between">
              <Col span={20}>摸鱼排行榜</Col>
              <Col span={4}>
                <span
                  className={styles.seemoreText}
                  onClick={() => {
                    navigate("/moyu");
                  }}
                >
                  查看更多
                </span>
              </Col>
            </Row>
          </div>
          <Row className={styles.cardBody} style={{ overflow: "auto" }}>
            <Table
              showHeader={false}
              style={{ width: "100%" }}
              pagination={false}
              columns={columns}
              dataSource={rankList}
            />
          </Row>
        </div>
        <div className="card-footer"></div>
      </div>
    </Col>
  );
};

export default RankCard;
