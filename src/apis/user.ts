import http from "@utils/http";

export async function createUser(data: any) {
    return await http.post("/api/user/add", data);
}