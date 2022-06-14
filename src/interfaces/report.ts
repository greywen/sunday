import { IDingTalkBaseResult } from "./dingTalkBase";

export interface IGetReportTemplateResult {
  default_received_convs: Defaultreceivedconv[];
  default_receivers: Defaultreceiver[];
  fields: Field[];
  id: string;
  name: string;
  user_name: string;
  userid: string;
}

interface Field {
  field_name: string;
  sort: number;
  type: number;
}

interface Defaultreceiver {
  user_name: string;
  userid: string;
}

interface Defaultreceivedconv {
  conversation_id: string;
  title: string;
}

export type IReportTemplateResult =
  IDingTalkBaseResult<IGetReportTemplateResult>;
