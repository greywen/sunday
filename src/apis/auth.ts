import { IAccountInfo } from "@interfaces/user";
import http from "@utils/http";

export async function getAuthUrl() {
    return await http.get<string>("/v1/auth/url");
}

export async function signin(body: any) {
    return await http.post<IAccountInfo>("/v1/auth/authentication", { body: body });
}

export async function signout() {
    return await http.post<string>("/v1/auth/signout");
}