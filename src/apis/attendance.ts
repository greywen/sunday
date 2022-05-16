import { IUpdateAttendance, IUserAttendances } from "@interfaces/attendance";
import http from "@utils/http";

export async function getAttendances() {
    return await http.get<IUserAttendances[]>("/v1/attendance/get");
}

export async function updateCustomAttendances(data: IUpdateAttendance) {
    return await http.put("/v1/attendance/update/custom", { body: data });
}

export async function updateAttendances(data: any) {
    return await http.put("/v1/attendance/update", { body: data });
}