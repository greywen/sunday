import { AttendanceState } from '../constants';

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
}

export interface IUserToday {
  timesheet: {
    value: string;
    name: string;
  };
  attendance: {
    late: number;
    notCommitReportCount: number;
    tomorrowIsHoliday: boolean;
  };
}

export interface IUserAttendance {
  state: AttendanceState;
  value: string | number | IClockTime | any;
}

export interface IClockTime {
  onDutyTime: string;
  offDutyTime: string;
}
