import { ISheetResult } from '@interfaces/timesheet';
import {
  IClockTime,
  IDepartments,
  IUser,
  IUserAttendance,
  IUserToday,
} from '@interfaces/user';
import http from '@utils/http';
import moment from 'moment';
import { AttendanceState } from '../constants';

export async function createUser(data: any) {
  return await http.post('/v1/dingtalk/user', { body: data });
}

export async function deleteUser(userId: string) {
  return await http.delete('/v1/dingtalk/user/' + userId);
}

export async function getUserById(userId: string) {
  return await http.get<IUser>('/v1/dingtalk/user/' + userId);
}

export async function getUserDept() {
  return await http.get<IDepartments[]>('/v1/dingtalk/departments');
}

export async function updateUser(data: any) {
  return await http.put('/v1/dingtalk/user', { body: data });
}

export async function getUsers() {
  return await http.get<IUser[]>('/v1/dingtalk/user');
}

export async function updateTemplate(data: any) {
  return await http.put('/v1/timesheet/update/template', {
    body: { template: data },
  });
}

export async function getTimeSheetData(curDate: string) {
  return await http.get<ISheetResult>(`/v1/timesheet/get/yc/${curDate}`);
}

export async function getUserToday() {
  return await http.get<IUserToday>('/v1/user/today');
}

export async function getUserAttendance(
  curMonth: string
): Promise<Record<string, IUserAttendance[]>> {
  const data = await http.get<IUserAttendance[][]>(
    `/v1/user/attendance/${curMonth}`
  );
  const dataMap = {} as Record<string, IUserAttendance[]>;
  data.map((x, i) => {
    const dataKey = moment(curMonth)
      .startOf('month')
      .add(i, 'days')
      .format('YYYY-MM-DD');
    x.sort((a, b) => {
      return b.state - a.state;
    });
    const states = x.map((item) => {
      if (
        item.state === AttendanceState.C ||
        item.state === AttendanceState.P ||
        item.state === AttendanceState.S ||
        item.state === AttendanceState.V
      ) {
        item.value = '请假 ' + item.value + ' 小时';
      } else if (item.state === AttendanceState.J) {
        item.value = '加班 ' + item.value;
      } else if (item.state === AttendanceState.L) {
        item.value = '迟到 ' + item.value + ' 分钟';
      } else if (item.state === AttendanceState.X) {
        item.value = '未提交日志';
      }
      return item;
    });
    dataMap[dataKey] = states;
  });
  return dataMap;
}
