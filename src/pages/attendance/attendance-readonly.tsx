import { getAttendances } from '@apis/attendance';
import BackHome from '@components/backhome';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { IAttendances, IUserAttendances } from '@interfaces/attendance';
import moment from 'moment';
import React, { useRef, useState } from 'react';
import { AttendanceState } from '../../constants';
import './index.less';

const AttendanceReadonly = () => {
  const [attendances, setAttendances] = useState<IUserAttendances[]>();
  const dayInMonth = moment().daysInMonth();
  const weeks = ['日', '一', '二', '三', '四', '五', '六'];
  const leaveType = [
    AttendanceState.C,
    AttendanceState.P,
    AttendanceState.S,
    AttendanceState.V,
  ];
  const currentMonth = moment().format('YYYY-MM');
  const reportRef = useRef<any>();

  useAsyncEffect(async () => {
    await initData();
    const timer = setInterval(async () => {
      await initData();
    }, 1800000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  async function initData() {
    const data = await getAttendances(moment().format('YYYY-MM'));
    setAttendances(data);
  }

  const dates = Array.from({ length: dayInMonth }, (v, i) => {
    return {
      day: i + 1,
      week: weeks[moment().startOf('month').add(i, 'days').day()],
    };
  });

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

  return (
    <>
      <BackHome />
      <div className='attendance-page' ref={reportRef}>
        <div className='header'>
          <div className='left'>员工考勤时间表</div>
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
          <div className='left'>{currentMonth}</div>
          <div className='right'>考勤日期</div>
        </div>
        <table>
          <thead>
            <tr>
              <th className='first-th' key={'key-name'}>
                姓名
              </th>
              {dates.map((d) => {
                return (
                  <th key={'key-' + d.day}>
                    <p>{d.week}</p>
                    <p>{d.day}</p>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {attendances?.map((ul) => {
              return (
                <tr key={'key-tr-' + ul.id}>
                  <td>{ul.name}</td>
                  {ul.attendances.map((l, i) => {
                    return (
                      <td key={'key-td-' + i + ul.id}>{calcStateBlock(l)}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AttendanceReadonly;
