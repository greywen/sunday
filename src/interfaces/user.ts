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