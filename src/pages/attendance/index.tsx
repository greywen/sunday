import { getLogs, updateCustomLogs, updateLogs } from "@apis/logs";
import useAsyncEffect from "@hooks/useAsyncEffect";
import { ILogs, IModifyLogState, IUserLogs } from "@interfaces/logs";
import {
  Checkbox,
  Col,
  InputNumber,
  Modal,
  Row,
  message,
  Input,
  Form,
  Button,
  Alert,
  Select,
} from "antd";
import moment from "moment";
import React, { useRef, useState } from "react";
import { LogState } from "../../constants";
import "./index.less";
import * as htmlToImage from "html-to-image";
import * as download from "downloadjs";
import {
  createUser,
  deleteUser,
  getUserById,
  getUserDept,
  updateUser,
} from "@apis/user";
import { IDepartmentGroup, IDepartments, IUser } from "@interfaces/user";
const { Option } = Select;
const { confirm } = Modal;

const Attendance = () => {
  const [logs, setLogs] = useState<IUserLogs[]>();
  const [departments, setDepartments] = useState<IDepartments[]>();
  const [groups, setGroups] = useState<IDepartmentGroup[]>([]);
  const [userDetail, setUserDetail] = useState<IUser | null>();
  const [loading, setLoading] = useState<boolean>(false);
  const [submiting, setSubmiting] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [subscribeVisible, setSubscribeVisible] = useState<boolean>(false);
  const [addModelVisible, setAddModelVisible] = useState<boolean>(false);
  const [userDetailVisible, setUserDetailVisible] = useState<boolean>(false);
  const dayInMonth = moment().daysInMonth();
  const weeks = ["日", "一", "二", "三", "四", "五", "六"];
  const leaveType = [LogState.C, LogState.P, LogState.S, LogState.V];
  const [modifyLog, setModifyLog] = useState<IModifyLogState>();
  const currentMonth = moment().format("YYYY-MM");
  const [form] = Form.useForm();
  const [detailForm] = Form.useForm();
  const reportRef = useRef<any>();

  useAsyncEffect(async () => {
    await initData();
    const depts = await getUserDept();
    setDepartments(depts);
    const timer = setInterval(async () => {
      await initData();
    }, 1800000);

    return () => {
      clearInterval(timer);
    };
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
        // const value = logs.map((x) => getStateKey(x.state)).join("/");
        return <div className={`state-${stateX.state}`}>X</div>;
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

  function changeState(state: LogState) {
    let _modifyLog = { ...modifyLog! };
    let logs = _modifyLog?.logs.filter((x) => x.state !== state);
    const notRightStates = [LogState.X, LogState.L];
    if (logs?.length === _modifyLog?.logs.length) {
      _modifyLog?.logs.push({ state: state, value: null });
      if (notRightStates.includes(state)) {
        logs = _modifyLog?.logs.filter((x) => x.state !== LogState.O);
        _modifyLog.logs = [...logs];
      } else if (state === LogState.O) {
        logs = _modifyLog?.logs.filter(
          (x) => !notRightStates.includes(x.state)
        );
        _modifyLog.logs = [...logs];
      }
    } else {
      _modifyLog.logs = [...logs];
    }

    setModifyLog(_modifyLog);
  }

  function changeStateValue(state: LogState, value: string) {
    let _modifyLog = { ...modifyLog! };
    let logs = _modifyLog?.logs.find((x) => x.state === state);
    logs!.value = parseFloat(value);
    setModifyLog(_modifyLog);
  }

  function getStateValue(state: LogState) {
    return modifyLog?.logs.find((x) => x.state === state)?.value || 0;
  }

  function isCheckState(state: LogState) {
    return !!modifyLog?.logs.find((x) => x.state === state);
  }

  async function save() {
    if (!modifyLog) {
      return;
    }

    const result = await updateCustomLogs({
      index: modifyLog!.index,
      userId: modifyLog!.id,
      datas: modifyLog!.logs,
    });

    if (result) {
      message.success("修改成功!");
      await initData();
    } else {
      message.success("修改失败,请稍后再试!");
    }
    setVisible(false);
  }

  async function subscribeSMS() {}

  function exportToImg() {
    htmlToImage.toPng(reportRef.current).then(function (dataUrl) {
      download.default(dataUrl, `${moment().format("YYYY-MM-DD")}.png`);
    });
  }

  async function addUser(value: any) {
    setSubmiting(true);
    const result = await createUser(value);
    if (result === true) {
      await initData();
      setAddModelVisible(false);
    } else {
      message.error(result);
    }
    setSubmiting(false);
  }

  async function removeUser(userId: string) {
    confirm({
      title: "确定删除改用户?",
      okText: "确定",
      cancelText: "取消",
      async onOk() {
        const result = await deleteUser({ userId: userId });
        await initData();
        setUserDetailVisible(false);
        message.success(result ? "删除成功!" : "删除失败!");
      },
    });
  }

  async function getUserDetail(userId: string) {
    const user = await getUserById(userId);
    const groups = departments?.find((x) => x.code === user.dept_name)?.groups;
    groups ? setGroups(groups) : setGroups([]);
    detailForm.setFieldsValue({
      english_name: null,
      groupid: null,
      phone: null,
      ...user,
    });
    setUserDetail(user);
    setUserDetailVisible(true);
  }

  async function updateUserDetail(value: any) {
    const result = await updateUser(value);
    console.log(result);
    message.success(result ? "修改成功!" : "删除失败!");
    setUserDetailVisible(false);
  }

  async function reloadLogs(day: number) {
    const date = moment().format(`YYYY-MM-${day}`);
    confirm({
      title: `确定更新${date}日志?`,
      content: "这可能要花费1分钟左右的时间,请耐心等候!",
      okText: "确定",
      cancelText: "取消",
      async onOk() {
        const result = await updateLogs({
          date: date,
          day: 1,
        });
        await initData();
        message.success(result ? "更新成功!" : "更新失败!");
      },
    });
  }

  return (
    <>
      <div className="attendance-page" ref={reportRef}>
        <div className="header">
          <div
            className="left"
            onClick={() => {
              exportToImg();
            }}
          >
            员工考勤时间表
          </div>
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
        </div>
        <div className="table-header">
          <div className="left">{currentMonth}</div>
          <div className="right">考勤日期</div>
        </div>
        <table>
          <thead>
            <tr>
              <th
                className="first-th"
                key={"key-name"}
                onClick={() => {
                  setAddModelVisible(true);
                }}
              >
                姓名
              </th>
              {dates.map((d) => {
                return (
                  <th key={"key-" + d.day}>
                    <p>{d.week}</p>
                    <p
                      onClick={() => {
                        reloadLogs(d.day);
                      }}
                    >
                      {d.day}
                    </p>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {logs?.map((ul) => {
              return (
                <tr>
                  <td
                    onClick={async () => {
                      await getUserDetail(ul.id);
                    }}
                  >
                    {ul.name}
                  </td>
                  {ul.logs.map((l, i) => {
                    return (
                      <td
                        onClick={() => {
                          setModifyLog({
                            id: ul.id,
                            name: ul.name,
                            index: i,
                            logs: [...l],
                          });
                          setVisible(true);
                        }}
                      >
                        {calcStateBlock(l)}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Modal
        title={`${modifyLog?.name} - ${moment(
          `${currentMonth}-${modifyLog?.index || 0 + 1}`
        ).format("YYYY-MM-DD")}`}
        visible={visible}
        onOk={() => {
          save();
        }}
        onCancel={() => {
          setVisible(false);
        }}
        okText="确认修改"
        cancelText="取消"
      >
        <Row gutter={[48, 12]}>
          <Col span={12}>
            <Checkbox
              value={LogState.O}
              checked={isCheckState(LogState.O)}
              onChange={() => changeState(LogState.O)}
            >
              正常(O)
            </Checkbox>
          </Col>
          <Col span={12}>
            <Checkbox
              value={LogState.X}
              checked={isCheckState(LogState.X)}
              onChange={() => changeState(LogState.X)}
            >
              未提交日志(X)
            </Checkbox>
          </Col>
          <Col span={12}>
            <Checkbox
              value={LogState.C}
              checked={isCheckState(LogState.C)}
              onChange={() => changeState(LogState.C)}
            >
              调休(C)
            </Checkbox>
            <InputNumber
              disabled={!isCheckState(LogState.C)}
              size="small"
              step="0.5"
              min="0"
              max="7.5"
              addonAfter="小时"
              onChange={(value) => {
                changeStateValue(LogState.C, value);
              }}
              value={getStateValue(LogState.C)}
            />
          </Col>
          <Col span={12}>
            <Checkbox
              value={LogState.P}
              checked={isCheckState(LogState.P)}
              onChange={() => changeState(LogState.P)}
            >
              事假(P)
            </Checkbox>
            <InputNumber
              disabled={!isCheckState(LogState.P)}
              size="small"
              step="0.5"
              min="0"
              max="7.5"
              addonAfter="小时"
              onChange={(value) => {
                changeStateValue(LogState.P, value);
              }}
              value={getStateValue(LogState.P)}
            />
          </Col>
          <Col span={12}>
            <Checkbox
              value={LogState.O}
              checked={isCheckState(LogState.L)}
              onChange={() => changeState(LogState.L)}
            >
              迟到(L)
            </Checkbox>
            <InputNumber
              disabled={!isCheckState(LogState.L)}
              size="small"
              step="1"
              min="0"
              max="540"
              addonAfter="分钟"
              value={getStateValue(LogState.L)}
            />
          </Col>
          <Col span={12}>
            <Checkbox
              value={LogState.S}
              checked={isCheckState(LogState.S)}
              onChange={() => changeState(LogState.S)}
            >
              病假(S)
            </Checkbox>
            <InputNumber
              disabled={!isCheckState(LogState.S)}
              size="small"
              step="0.5"
              min="0"
              max="7.5"
              addonAfter="小时"
              onChange={(value) => {
                changeStateValue(LogState.S, value);
              }}
              value={getStateValue(LogState.S)}
            />
          </Col>
          <Col span={12}>
            <Checkbox
              value={LogState.V}
              checked={isCheckState(LogState.V)}
              onChange={() => changeState(LogState.V)}
            >
              休假(V)
            </Checkbox>
            <InputNumber
              disabled={!isCheckState(LogState.V)}
              size="small"
              step="0.5"
              min="0"
              max="7.5"
              addonAfter="小时"
              onChange={(value) => {
                changeStateValue(LogState.V, value);
              }}
              value={getStateValue(LogState.V)}
            />
          </Col>
        </Row>
      </Modal>
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
      <Modal
        closeIcon={false}
        visible={addModelVisible}
        title="添加用户"
        onCancel={() => {
          setAddModelVisible(false);
        }}
        footer={null}
      >
        <Form
          form={form}
          name="add-form"
          onFinish={(value) => {
            addUser(value);
          }}
          initialValues={{ dept_name: "yc" }}
        >
          <Form.Item
            name="name"
            label="真实姓名"
            rules={[{ required: true, message: "请输入正确的姓名!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="dept_name"
            label="所属部门"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Select a option and change input text above"
              onChange={(value) => {
                form.setFieldsValue({ dept_name: value });
              }}
            >
              {departments?.map((x) => (
                <Option value={x.code}>{x.code.toUpperCase()}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item style={{ textAlign: "right" }}>
            <Button type="primary" htmlType="submit" loading={submiting}>
              添加
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        closeIcon={false}
        visible={userDetailVisible}
        title="用户详情"
        onCancel={() => {
          setUserDetailVisible(false);
        }}
        footer={null}
      >
        <Form
          form={detailForm}
          name="detail-form"
          onFinish={async (value) => {
            await updateUserDetail(value);
          }}
          initialValues={{ ...userDetail }}
        >
          <Form.Item hidden name="id" label="用户Id">
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            label="真实姓名"
            rules={[{ required: true, message: "请输入正确的姓名!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="english_name" label="* 英文名称">
            <Input />
          </Form.Item>
          <Form.Item
            name="dept_name"
            label="所属部门"
            rules={[{ required: true, message: "请选择所属部门!" }]}
          >
            <Select
              onChange={(value) => {
                form.setFieldsValue({ dept_name: value });
                const groups = departments?.find(
                  (x) => x.code === value
                )?.groups;
                groups ? setGroups(groups) : setGroups([]);
              }}
            >
              {departments?.map((x) => (
                <Option value={x.code}>{x.code.toUpperCase()}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            hidden={groups.length == 0}
            name="groupid"
            label="所属分组"
            rules={[
              { required: groups?.length > 0, message: "请选择部门分组!" },
            ]}
          >
            <Select
              onChange={(value) => {
                form.setFieldsValue({ groupid: value });
              }}
            >
              {groups?.map((x) => (
                <Option value={x.id}>{x.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="phone" label="* 手机号码">
            <Input />
          </Form.Item>
          <Row justify="end">
            <Col span={4}>
              <Form.Item style={{ textAlign: "right" }}>
                <Button
                  type="primary"
                  danger
                  loading={submiting}
                  onClick={() => {
                    removeUser(userDetail!.id);
                  }}
                >
                  删除
                </Button>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item style={{ textAlign: "right" }}>
                <Button type="primary" htmlType="submit" loading={submiting}>
                  修改
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default Attendance;
