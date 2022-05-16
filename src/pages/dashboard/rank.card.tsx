import { getRankList } from "@apis/moyu";
import useAsyncEffect from "@hooks/useAsyncEffect";
import { IRankList } from "@interfaces/moyu";
import { Col, Row, Table } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
        return <div className={`rank rank-${_.index}`}>{_.index}</div>;
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
      <div className="card">
        <div className="card-content">
          <div className="card-header">
            <Row justify="space-between">
              <Col span={20}>摸鱼排行榜</Col>
              <Col span={4}>
                <span
                  className="seemore-text"
                  onClick={() => {
                    navigate("/moyu");
                  }}
                >
                  查看更多
                </span>
              </Col>
            </Row>
          </div>
          <Row className="card-body" style={{ overflow: "scroll" }}>
            <Table
              showHeader={false}
              style={{ width: "100%" }}
              pagination={false}
              columns={columns}
              dataSource={rankList}
            />
            {/* <div className="col-12">
          <img
            className="moyu-cover"
            src={require("../../assets/cover.png").default}
          ></img>
        </div> */}
          </Row>
        </div>
        <div className="card-footer"></div>
      </div>
    </Col>
  );
};

export default RankCard;
