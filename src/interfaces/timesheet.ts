import { IUser } from "./user";

export interface ISheetTemplate {
    frontend?: string;
    backend?: string;
    test?: string;
}

export interface ISheetResult {
    template: ISheetTemplate;
    data: ITimeSheetData[];
}

export interface ITimeSheetData {
    userid: string;
    name: string;
    value?: string;
    groupid?: number;
}