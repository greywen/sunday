import { AttendanceState } from '../constants/constants';

export interface IUser {
  id: string;
  unionid: string;
  name: string;
  dept_name?: string;
  dept_id_list?: string[];
  phone?: string;
  groupid?: number;
  english_name?: string;
}

export interface IDepartments {
  id: number;
  name: string;
  code: string;
  groups: IDepartmentGroup[];
}
export interface IDepartmentGroup {
  id: number;
  name: string;
}

export interface IAccountInfo {
  refresh_token: string;
  expires_at: number;
  access_token: string;
  refresh_expires_in: string;
  username: string;
  email: string;
  phone: string;
  avatar: string;
  title: string;
  hiredDate: number;
  resources: string;
}

export interface IUserAttendance {
  state: AttendanceState;
  value: string | number | IClockTime | any;
}

export interface IClockTime {
  onDutyTime: string;
  offDutyTime: string;
}

export interface IUserMember {
  username: string;
  avatar: string;
}
