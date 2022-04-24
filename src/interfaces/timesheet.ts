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
    name: string;
    value?: string;
    groupid?: number;
}