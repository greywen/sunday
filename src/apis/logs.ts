import { IUpdateLog, IUserLogs } from "@interfaces/logs";
import http from "@utils/http";

export async function getLogs() {
    return await http.get<IUserLogs[]>("/api/logs/get");
}

export async function updateCustomLogs(data: IUpdateLog) {
    return await http.put("/api/logs/custom", { body: data });
}

export async function updateLogs(data: any) {
    return await http.put("/api/logs/update", { body: data });
}