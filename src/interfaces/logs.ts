import { LogState } from "../constants";

export interface IUserLogs {
    id: string;
    name: string;
    dept_name: string;
    logs: ILogs[][];
}

export interface ILogs {
    state: LogState;
    value?: any;
}

export interface IModifyLogState {
    id: string;
    name: string;
    index: number;
    logs: ILogs[];
}

export interface IUpdateLog {
    userId: string;
    index: number;
    datas: ILogs[];
}