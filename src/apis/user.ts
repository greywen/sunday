import http from "@utils/http";

export async function createUser(data: any) {
    return await http.post("/api/user/add", data);
}

export async function deleteUser(data: any) {
    return await http.delete("/api/user/delete", { params: data });
}