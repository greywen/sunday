import { AttendanceState } from '../constants/constants';

export interface IUserAttendances {
  id: string;
  name: string;
  dept_name: string;
  attendances: IAttendances[][];
}

export interface IAttendances {
  state: AttendanceState;
  value?: any;
}

export interface IModifyAttendanceState {
  id: string;
  name: string;
  index: number;
  attendances: IAttendances[];
}

export interface IUpdateAttendance {
  userId: string;
  index: number;
  datas: IAttendances[];
  date: string;
}
