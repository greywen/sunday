import { getLogs } from "@apis/logs";
import useAsyncEffect from "@hooks/useAsyncEffect";
import { ILogs, IUserLogs } from "@interfaces/logs";
import { Col, Modal, Row, Input, Form, Button, Alert } from "antd";
import moment from "moment";
import React, { useRef, useState } from "react";
import { LogState } from "../../constants";
import "./index.less";
const AttendanceForShow = () => {
  const [logs, setLogs] = useState<IUserLogs[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [subscribeVisible, setSubscribeVisible] = useState<boolean>(false);
  const dayInMonth = moment().daysInMonth();
  const weeks = ["日", "一", "二", "三", "四", "五", "六"];
  const leaveType = [LogState.C, LogState.P, LogState.S, LogState.V];
  const currentMonth = moment().format("YYYY-MM");
  const [form] = Form.useForm();
  const reportRef = useRef<any>();

  useAsyncEffect(async () => {
    await initData();
  }, []);

  async function initData() {
    setLoading(true);
    const data = await getLogs();
    setLogs(data);
    setLoading(false);
  }

  const dates = Array.from({ length: dayInMonth }, (v, i) => {
    return {
      day: i + 1,
      week: weeks[moment().startOf("month").add(i, "days").day()],
    };
  });

  function getStateKey(state: LogState) {
    return LogState[state];
  }

  function calcStateBlock(logs: ILogs[]) {
    if (logs.length == 0) return " ";
    if (logs.length > 1) {
      // 迟到
      let statel = logs.find((x) => x.state === LogState.L);
      // 未提交日志
      let stateX = logs.find((x) => x.state === LogState.X);
      // 请假
      let stateP = logs.find((x) => leaveType.includes(x.state));

      if (statel) {
        return (
          <div className={`state-${statel.state}`}>{statel.value + "分钟"}</div>
        );
      } else if (stateX) {
        const value = logs.map((x) => getStateKey(x.state)).join("/");
        return <div className={`state-${stateX.state}`}>{value}</div>;
      } else if (stateP) {
        const value = logs.map((x) => getStateKey(x.state)).join("/");
        return <div className={`state-${stateP.state}`}>{value}</div>;
      }
      return (
        <div className={`state-${logs[0].state}`}>
          {getStateKey(logs[0].state)}
        </div>
      );
    } else {
      let { state, value } = logs[0];
      switch (state) {
        case LogState.L:
          return <div className={`state-${state}`}>{value + "分钟"}</div>;
        case (LogState.P, LogState.C, LogState.S, LogState.V):
          return <div className={`state-${state}`}>{getStateKey(state)}</div>;
        default:
          return <div className={`state-${state}`}>{getStateKey(state)}</div>;
      }
    }
  }
  async function subscribeSMS() {}

  return (
    <>
      <div className="attendance-page" ref={reportRef}>
        <div className="header">
          <div className="left">员工考勤时间表</div>
          <div className="right">
            全月迟到,早退时间累计10分钟以内,不予惩罚;累计10分钟(含)以上30分钟以内,罚款50元;累计30分钟(含)以上1小时以内,按半天事假处理;累计1小时以上3小时以内,按事假1天处理
            <p className="tip">
              HR不得迟于每工作日下班前,汇总上一工作日/加班日数据到群.逾期作为迟到处罚
            </p>
          </div>
        </div>
        <div className="type">
          <div className="left">
            <div className="type-tip">考勤类型键</div>
            <div className="state-block">
              <span className="state state-3">V</span>休假
            </div>
            <div className="state-block">
              <span className="state state-4">P</span>事假
            </div>
            <div className="state-block">
              <span className="state state-5">S</span>病假
            </div>
            <div className="state-block">
              <span className="state state-1">O</span>正常
            </div>
            <div className="state-block">
              <span className="state state-8">分钟</span>迟到(分钟)
            </div>
            <div className="state-block">
              <span className="state state-2">C</span>调休
            </div>
            <div className="state-block">
              <span className="state state-6">X</span>未提交日志
            </div>
            <div className="state-block">
              <span className="state state-7">J</span>加班
            </div>
          </div>
          {/* <div
            className="right"
            onClick={() => {
              // setSubscribeVisible(true);
              message.info("😄被你发现了，功能正在开发中.");
            }}
          >
            经常忘记提交日志?
          </div> */}
        </div>
        <div className="table-header">
          <div className="left">{currentMonth}</div>
          <div className="right">考勤日期</div>
        </div>
        <table>
          <thead>
            <tr>
              <th className="first-th" key={"key-name"}>
                姓名
              </th>
              {dates.map((d) => {
                return (
                  <th key={"key-" + d.day}>
                    <p>{d.week}</p>
                    <p>{d.day}</p>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {logs?.map((ul) => {
              return (
                <tr>
                  <td>{ul.name}</td>
                  {ul.logs.map((l, i) => {
                    return <td>{calcStateBlock(l)}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Modal
        closeIcon={false}
        visible={subscribeVisible}
        title="订阅日志短信提醒"
        onCancel={() => {
          setSubscribeVisible(false);
        }}
        footer={null}
      >
        <Row style={{ margin: "0 0 12px 0" }}>
          <Col>
            <Alert
              message="Tips: 如果你订阅了我们提醒服务,工作日忘记提交日志,我们将在晚上8点以短信的方式提醒你。"
              type="info"
              showIcon
            />
          </Col>
        </Row>

        <Form
          form={form}
          name="subscribe-form"
          onFinish={() => {
            subscribeSMS();
          }}
        >
          <Form.Item
            name="name"
            label="真实姓名"
            rules={[{ required: true, message: "请输入正确的姓名!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="手机号码"
            rules={[{ required: true, message: "请输入正确的电话号码!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="code"
            label="验证号码"
            rules={[{ required: true, message: "请输入正确的验证码!" }]}
          >
            <Row>
              <Col span={18}>
                <Input />
              </Col>
              <Col span={6}>
                <Button>发送</Button>
              </Col>
            </Row>
          </Form.Item>
          <Form.Item style={{ textAlign: "right" }}>
            <Button type="primary" htmlType="submit">
              订阅
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AttendanceForShow;
