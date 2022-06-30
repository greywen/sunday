import { IInfrom } from "@interfaces/inform";
import { IGetReportTemplateResult } from "@interfaces/report";
import http from "@utils/http";

export async function createPeport(data: any) {
  return await http.post("/v1/dingtalk/createPeport", { body: data });
}

export async function getReportTemplateByName() {
  return await http.get<IGetReportTemplateResult>("/v1/dingtalk/getReportTemplateByName");
}

export async function getReportFinished() {
  return await http.get<boolean>("/v1/dingtalk/getReportFinished");
}
