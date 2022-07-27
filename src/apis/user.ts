import { ISheetResult } from '@interfaces/timesheet';
import {
  IDepartments,
  IUser,
  IUserAttendance,
  IUserMember,
} from '@interfaces/user';
import http from '@utils/http';

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

export async function updateTemplate(data: any) {
  return await http.put('/v1/timesheet/update/template', {
    body: { template: data },
  });
}

export async function getTimeSheetData(curDate: string) {
  return await http.get<ISheetResult>(`/v1/timesheet/get/yc/${curDate}`);
}

export async function getUserAttendance(curMonth: string) {
  return await http.get<IUserAttendance[][]>(`/v1/user/attendance/${curMonth}`);
}

export async function getMembers() {
  return await http.get<IUserMember[]>(`/v1/user/members`);
}
