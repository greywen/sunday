import { IUpdateLog, IUserLogs } from "@interfaces/logs";
import http from "@utils/http";

export async function getLogs() {
    return await http.get<IUserLogs[]>("/api/logs/get");
}

export async function updateLogs(data: IUpdateLog) {
    return await http.put("/api/logs/custom", {data});
}