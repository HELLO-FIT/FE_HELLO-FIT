export interface ScheduleProps {
  id: number;
}

// 임시 type
export interface ScheduleItem {
  id: number;
  name: string;
  item_nm: string;
  location: string;
  address: string;
  start_tm: string;
  close_tm: string;
  lectr_weekday_val: string;
  lectr_nm: string;
  phone: string;
  settl_amt: string;
  course_nm: string;
}
