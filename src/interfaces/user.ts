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
    groups: IDepartmentGroup[]
}
export interface IDepartmentGroup {
    id: number;
    name: string;
}

export interface IAccountInfo {
    token: string;
    id: string;
    roles: string[]
    username: string;
    name: string;
    expires: number;
    refreshToken: string;
    refreshExpires: number;
    hiredDate: number;
}

export interface IUserToday {
    timesheet: {
        value: string;
        name: string;
    },
    attendance: {
        late: number;
        notCommitReportCount: number;
        tomorrowIsHoliday: boolean;
    }
}