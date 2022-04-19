import { ICleanOffice } from "@interfaces/clean-office";
import http from "@utils/http";

export async function getCleanOfficeName(): Promise<ICleanOffice> {
    return await http.get("/api/user/clean-office");
}