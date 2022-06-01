import {
  getAttendances,
  updateCustomAttendances,
  updateAttendances,
} from '@apis/attendance';
import useAsyncEffect from '@hooks/useAsyncEffect';
import {
  IAttendances,
  IModifyAttendanceState,
  IUserAttendances,
} from '@interfaces/attendance';
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
  Select,
  DatePicker,
} from 'antd';
import moment from 'moment';
import React, { useRef, useState } from 'react';
import { AttendanceState } from '../../constants';
import './index.less';
import * as htmlToImage from 'html-to-image';
import * as download from 'downloadjs';
import {
  createUser,
  deleteUser,
  getUserById,
  getUserDept,
  updateUser,
} from '@apis/user';
import { IDepartmentGroup, IDepartments, IUser } from '@interfaces/user';
import BackHome from '@components/backhome';
const { Option } = Select;
const { confirm } = Modal;
import type { RangePickerProps } from 'antd/es/date-picker';

const Attendance = () => {
  const [attendances, setAttendances] = useState<IUserAttendances[]>();
  const [departments, setDepartments] = useState<IDepartments[]>();
  const [groups, setGroups] = useState<IDepartmentGroup[]>([]);
  const [userDetail, setUserDetail] = useState<IUser | null>();
  const [loading, setLoading] = useState<boolean>(false);
  const [submiting, setSubmiting] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [addModelVisible, setAddModelVisible] = useState<boolean>(false);
  const [userDetailVisible, setUserDetailVisible] = useState<boolean>(false);
  const [dates, setDates] = useState<any[]>([]);
  const weeks = ['日', '一', '二', '三', '四', '五', '六'];
  const leaveType = [
    AttendanceState.C,
    AttendanceState.P,
    AttendanceState.S,
    AttendanceState.V,
  ];
  const [modifyAttendance, setModifyAttendance] =
    useState<IModifyAttendanceState>();
  const [form] = Form.useForm();
  const [detailForm] = Form.useForm();
  const reportRef = useRef<any>();
  const [currentDate, setCurrentDate] = useState(moment().format('YYYY-MM-DD'));

  useAsyncEffect(async () => {
    await initData();
    const depts = await getUserDept();
    setDepartments(depts);
  }, [currentDate]);

  async function initData() {
    const _dates = Array.from(
      { length: moment(currentDate).daysInMonth() },
      (v, i) => {
        return {
          day: i + 1,
          week: weeks[
            moment(currentDate).startOf('month').add(i, 'days').day()
          ],
        };
      }
    );
    setDates(_dates);
    setLoading(true);
    const data = await getAttendances(moment(currentDate).format('YYYY-MM'));
    setAttendances(data);
    setLoading(false);
  }

  function getStateKey(state: AttendanceState) {
    return AttendanceState[state];
  }

  function calcStateBlock(attendanceList: IAttendances[]) {
    if (attendanceList.length == 0) return ' ';
    if (attendanceList.length > 1) {
      // 迟到
      let statel = attendanceList.find((x) => x.state === AttendanceState.L);
      // 未提交日志
      let stateX = attendanceList.find((x) => x.state === AttendanceState.X);
      // 请假
      let stateP = attendanceList.find((x) => leaveType.includes(x.state));

      if (statel) {
        return (
          <div className={`state-${statel.state}`}>{statel.value + '分钟'}</div>
        );
      } else if (stateX) {
        return <div className={`state-${stateX.state}`}>X</div>;
      } else if (stateP) {
        const value = attendanceList.map((x) => getStateKey(x.state)).join('/');
        return <div className={`state-${stateP.state}`}>{value}</div>;
      }
      return (
        <div className={`state-${attendanceList[0].state}`}>
          {getStateKey(attendanceList[0].state)}
        </div>
      );
    } else {
      let { state, value } = attendanceList[0];
      switch (state) {
        case AttendanceState.L:
          return <div className={`state-${state}`}>{value + '分钟'}</div>;
        case (AttendanceState.P,
        AttendanceState.C,
        AttendanceState.S,
        AttendanceState.V):
          return <div className={`state-${state}`}>{getStateKey(state)}</div>;
        default:
          return <div className={`state-${state}`}>{getStateKey(state)}</div>;
      }
    }
  }

  function changeState(state: AttendanceState) {
    let _modifyAttendance = { ...modifyAttendance! };
    let _attendances = _modifyAttendance?.attendances.filter(
      (x) => x.state !== state
    );
    const notRightStates = [AttendanceState.X, AttendanceState.L];
    if (_attendances?.length === _modifyAttendance?.attendances.length) {
      _modifyAttendance?.attendances.push({ state: state, value: null });
      if (notRightStates.includes(state)) {
        _attendances = _modifyAttendance?.attendances.filter(
          (x) => x.state !== AttendanceState.O
        );
        _modifyAttendance.attendances = [..._attendances];
      } else if (state === AttendanceState.O) {
        _attendances = _modifyAttendance?.attendances.filter(
          (x) => !notRightStates.includes(x.state)
        );
        _modifyAttendance.attendances = [..._attendances];
      }
    } else {
      _modifyAttendance.attendances = [..._attendances];
    }

    setModifyAttendance(_modifyAttendance);
  }

  function changeStateValue(state: AttendanceState, value: string) {
    let _modifyAttendance = { ...modifyAttendance! };
    let _attendances = _modifyAttendance?.attendances.find(
      (x) => x.state === state
    );
    _attendances!.value = parseFloat(value);
    setModifyAttendance(_modifyAttendance);
  }

  function getStateValue(state: AttendanceState) {
    return (
      modifyAttendance?.attendances.find((x) => x.state === state)?.value || 0
    );
  }

  function isCheckState(state: AttendanceState) {
    return !!modifyAttendance?.attendances.find((x) => x.state === state);
  }

  async function save() {
    if (!modifyAttendance) {
      return;
    }

    const result = await updateCustomAttendances({
      index: modifyAttendance!.index,
      userId: modifyAttendance!.id,
      datas: modifyAttendance!.attendances,
    });

    if (result) {
      message.success('修改成功!');
      await initData();
    } else {
      message.success('修改失败,请稍后再试!');
    }
    setVisible(false);
  }

  function exportToImg() {
    htmlToImage.toPng(reportRef.current).then(function (dataUrl) {
      download.default(
        dataUrl,
        `${moment(currentDate).format('YYYY-MM-DD')}.png`
      );
    });
  }

  async function addUser(value: any) {
    setSubmiting(true);
    const result = await createUser(value);
    if (result === true) {
      await initData();
      setAddModelVisible(false);
    } else {
      message.error(result as any);
    }
    setSubmiting(false);
  }

  async function removeUser(userId: string) {
    confirm({
      title: '确定删除改用户?',
      okText: '确定',
      cancelText: '取消',
      async onOk() {
        const result = await deleteUser(userId);
        await initData();
        setUserDetailVisible(false);
        message.success(result ? '删除成功!' : '删除失败!');
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
    message.success(result ? '修改成功!' : '删除失败!');
    setUserDetailVisible(false);
  }

  async function reloadAttendances(day: number) {
    const date = moment(currentDate).format(
      `YYYY-MM-${day.toString().padStart(2, '0')}`
    );
    confirm({
      title: `确定更新${date}日志?`,
      content: '这可能要花费1分钟左右的时间,请耐心等候!',
      okText: '确定',
      cancelText: '取消',
      async onOk() {
        const result = await updateAttendances({
          date: date,
          day: 1,
        });
        await initData();
        message.success(result ? '更新成功!' : '更新失败!');
      },
    });
  }

  async function reloadUserAttendances(name: string) {
    const _currentDate = moment(currentDate);
    if (_currentDate.date() !== 1) {
      _currentDate.add(-1, 'days');
    }
    confirm({
      title: `确定更新本月${name}日志?`,
      content: '这可能要花费1分钟左右的时间,请耐心等候!',
      okText: '确定',
      cancelText: '取消',
      async onOk() {
        const result = await updateAttendances({
          name: name,
          date: _currentDate.format(`YYYY-MM-DD`),
          day: _currentDate.date(),
        });
        await initData();
        message.success(result ? '更新成功!' : '更新失败!');
      },
    });
  }

  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    return current && current > moment().endOf('day');
  };

  return (
    <>
      <BackHome />
      <div className='attendance-page' ref={reportRef}>
        <div className='header'>
          <div
            className='left'
            onClick={() => {
              exportToImg();
            }}
          >
            员工考勤时间表
          </div>
          <div className='right'>
            全月迟到,早退时间累计10分钟以内,不予惩罚;累计10分钟(含)以上30分钟以内,罚款50元;累计30分钟(含)以上1小时以内,按半天事假处理;累计1小时以上3小时以内,按事假1天处理
            <p className='tip'>
              HR不得迟于每工作日下班前,汇总上一工作日/加班日数据到群.逾期作为迟到处罚
            </p>
          </div>
        </div>
        <div className='type'>
          <div className='left'>
            <div className='type-tip'>考勤类型键</div>
            <div className='state-block'>
              <span className='state state-3'>V</span>休假
            </div>
            <div className='state-block'>
              <span className='state state-4'>P</span>事假
            </div>
            <div className='state-block'>
              <span className='state state-5'>S</span>病假
            </div>
            <div className='state-block'>
              <span className='state state-1'>O</span>正常
            </div>
            <div className='state-block'>
              <span className='state state-8'>分钟</span>迟到(分钟)
            </div>
            <div className='state-block'>
              <span className='state state-2'>C</span>调休
            </div>
            <div className='state-block'>
              <span className='state state-6'>X</span>未提交日志
            </div>
            <div className='state-block'>
              <span className='state state-7'>J</span>加班
            </div>
          </div>
        </div>
        <div className='table-header'>
          <div className='left' onClick={() => {}}>
            <DatePicker
              picker='month'
              value={moment(currentDate)}
              onChange={(date, dateString) => {
                setCurrentDate(dateString);
              }}
              allowClear={false}
              suffixIcon={null}
              disabledDate={disabledDate}
            />
          </div>
          <div className='right'>考勤日期</div>
        </div>
        <table>
          <thead>
            <tr>
              <th
                className='first-th'
                key={'key-name'}
                onClick={() => {
                  setAddModelVisible(true);
                }}
              >
                姓名
              </th>
              {dates.map((d) => {
                return (
                  <th key={'key-' + d.day}>
                    <p>{d.week}</p>
                    <p
                      onClick={() => {
                        reloadAttendances(d.day);
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
            {attendances?.map((ul) => {
              return (
                <tr key={'key-tr-' + ul.id}>
                  <td
                    onClick={async () => {
                      await getUserDetail(ul.id);
                    }}
                  >
                    {ul.name}
                  </td>
                  {ul.attendances.map((l, i) => {
                    return (
                      <td
                        key={'key-td-' + i + ul.id}
                        onClick={() => {
                          setModifyAttendance({
                            id: ul.id,
                            name: ul.name,
                            index: i,
                            attendances: [...l],
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
        title={`${modifyAttendance?.name} - ${moment(
          `${currentDate}-${modifyAttendance?.index || 0 + 1}`
        ).format('YYYY-MM-DD')}`}
        visible={visible}
        onOk={() => {
          save();
        }}
        onCancel={() => {
          setVisible(false);
        }}
        okText='确认修改'
        cancelText='取消'
      >
        <Row gutter={[48, 12]}>
          <Col span={12}>
            <Checkbox
              value={AttendanceState.O}
              checked={isCheckState(AttendanceState.O)}
              onChange={() => changeState(AttendanceState.O)}
            >
              正常(O)
            </Checkbox>
          </Col>
          <Col span={12}>
            <Checkbox
              value={AttendanceState.X}
              checked={isCheckState(AttendanceState.X)}
              onChange={() => changeState(AttendanceState.X)}
            >
              未提交日志(X)
            </Checkbox>
          </Col>
          <Col span={12}>
            <Checkbox
              value={AttendanceState.C}
              checked={isCheckState(AttendanceState.C)}
              onChange={() => changeState(AttendanceState.C)}
            >
              调休(C)
            </Checkbox>
            <InputNumber
              disabled={!isCheckState(AttendanceState.C)}
              size='small'
              step='0.5'
              min='0'
              max='7.5'
              addonAfter='小时'
              onChange={(value) => {
                changeStateValue(AttendanceState.C, value);
              }}
              value={getStateValue(AttendanceState.C)}
            />
          </Col>
          <Col span={12}>
            <Checkbox
              value={AttendanceState.P}
              checked={isCheckState(AttendanceState.P)}
              onChange={() => changeState(AttendanceState.P)}
            >
              事假(P)
            </Checkbox>
            <InputNumber
              disabled={!isCheckState(AttendanceState.P)}
              size='small'
              step='0.5'
              min='0'
              max='7.5'
              addonAfter='小时'
              onChange={(value) => {
                changeStateValue(AttendanceState.P, value);
              }}
              value={getStateValue(AttendanceState.P)}
            />
          </Col>
          <Col span={12}>
            <Checkbox
              value={AttendanceState.O}
              checked={isCheckState(AttendanceState.L)}
              onChange={() => changeState(AttendanceState.L)}
            >
              迟到(L)
            </Checkbox>
            <InputNumber
              disabled={!isCheckState(AttendanceState.L)}
              size='small'
              step='1'
              min='0'
              max='540'
              addonAfter='分钟'
              onChange={(value) => {
                changeStateValue(AttendanceState.L, value);
              }}
              value={getStateValue(AttendanceState.L)}
            />
          </Col>
          <Col span={12}>
            <Checkbox
              value={AttendanceState.S}
              checked={isCheckState(AttendanceState.S)}
              onChange={() => changeState(AttendanceState.S)}
            >
              病假(S)
            </Checkbox>
            <InputNumber
              disabled={!isCheckState(AttendanceState.S)}
              size='small'
              step='0.5'
              min='0'
              max='7.5'
              addonAfter='小时'
              onChange={(value) => {
                changeStateValue(AttendanceState.S, value);
              }}
              value={getStateValue(AttendanceState.S)}
            />
          </Col>
          <Col span={12}>
            <Checkbox
              value={AttendanceState.V}
              checked={isCheckState(AttendanceState.V)}
              onChange={() => changeState(AttendanceState.V)}
            >
              休假(V)
            </Checkbox>
            <InputNumber
              disabled={!isCheckState(AttendanceState.V)}
              size='small'
              step='0.5'
              min='0'
              max='7.5'
              addonAfter='小时'
              onChange={(value) => {
                changeStateValue(AttendanceState.V, value);
              }}
              value={getStateValue(AttendanceState.V)}
            />
          </Col>
        </Row>
      </Modal>
      <Modal
        closeIcon={false}
        visible={addModelVisible}
        title='添加用户'
        onCancel={() => {
          setAddModelVisible(false);
        }}
        footer={null}
      >
        <Form
          form={form}
          name='add-form'
          onFinish={(value) => {
            addUser(value);
          }}
          initialValues={{ dept_name: 'yc' }}
        >
          <Form.Item
            name='name'
            label='真实姓名'
            rules={[{ required: true, message: '请输入正确的姓名!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name='dept_name'
            label='所属部门'
            rules={[{ required: true }]}
          >
            <Select
              placeholder='Select a option and change input text above'
              onChange={(value) => {
                form.setFieldsValue({ dept_name: value });
              }}
            >
              {departments?.map((x) => (
                <Option key={x.code} value={x.code}>
                  {x.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item style={{ textAlign: 'right' }}>
            <Button type='primary' htmlType='submit' loading={submiting}>
              添加
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        closeIcon={false}
        visible={userDetailVisible}
        title='用户详情'
        onCancel={() => {
          setUserDetailVisible(false);
        }}
        footer={null}
      >
        <Form
          form={detailForm}
          name='detail-form'
          onFinish={async (value) => {
            await updateUserDetail(value);
          }}
          initialValues={{ ...userDetail }}
        >
          <Form.Item hidden name='id' label='用户Id'>
            <Input />
          </Form.Item>
          <Form.Item
            name='name'
            label='真实姓名'
            rules={[{ required: true, message: '请输入正确的姓名!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name='english_name' label='* 英文名称'>
            <Input />
          </Form.Item>
          <Form.Item
            name='dept_name'
            label='所属部门'
            rules={[{ required: true, message: '请选择所属部门!' }]}
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
                <Option key={x.code} value={x.code}>
                  {x.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            hidden={groups.length == 0}
            name='groupid'
            label='所属分组'
            rules={[
              { required: groups?.length > 0, message: '请选择部门分组!' },
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
          <Form.Item name='phone' label='* 手机号码'>
            <Input />
          </Form.Item>
          <Row justify='end' gutter={[32, 16]}>
            <Col span={4}>
              <Form.Item>
                <Button
                  type='primary'
                  danger
                  loading={submiting}
                  onClick={async () => {
                    removeUser(userDetail!.id);
                  }}
                >
                  删除
                </Button>
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item>
                <Button
                  type='default'
                  loading={submiting}
                  onClick={async () => {
                    reloadUserAttendances(userDetail!.name);
                  }}
                >
                  更新考勤
                </Button>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item>
                <Button type='primary' htmlType='submit' loading={submiting}>
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
