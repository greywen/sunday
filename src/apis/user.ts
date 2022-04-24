import { ISheetResult, ISheetTemplate } from "@interfaces/timesheet";
import { IDepartments, IUser } from "@interfaces/user";
import http from "@utils/http";

export async function createUser(data: any) {
    return await http.post("/api/user/add", { body: data });
}

export async function deleteUser(data: any) {
    return await http.delete("/api/user/delete", { params: data });
}

export async function getUserById(userId: string) {
    return await http.get<IUser>("/api/user/get?userId=" + userId);
}

export async function getUserDept() {
    return await http.get<IDepartments[]>("/api/user/dept");
}

export async function updateUser(data: any) {
    return await http.put("/api/user/update", { body: data });
}

export async function getUsers() {
    return await http.get<IUser[]>("/api/user/get");
}

export async function updateTemplate(data: any) {
    return await http.put("/api/timesheet/update", { body: { template: data } });
}

export async function getTimeSheetData() {
    return await http.get<ISheetResult>("/api/timesheet/get?dept_name=yc");
}