import { IUpdateLog } from "@interfaces/logs";
import http from "@utils/http";

export async function getLogs() {
    return await http.get("/api/logs/get");
}

export async function updateLogs(data: IUpdateLog) {
    return await http.put("/api/logs/custom", data);
}