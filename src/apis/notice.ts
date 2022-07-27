import { INotice } from "@interfaces/notice";
import http from "@utils/http";

export async function getInform() {
  return await http.get<INotice[]>("/v1/inform/getAll")
}

export async function getCurInform() {
  return await http.get<INotice[]>("/v1/inform/getCurrent")
}

export async function addInform(data: any) {
  return await http.post("/v1/inform/add", { body: data })
}

export async function delInform(id: string) {
  return await http.delete("/v1/inform/delete/" + id)
}

export async function modifyInform(data: any) {
  return await http.put("/v1/inform/modify", { body: data })
}