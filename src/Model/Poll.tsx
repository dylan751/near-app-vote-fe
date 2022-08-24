export interface PollModel {
  id?: number;
  title: string | undefined;
  description: string | undefined;
  criteria_ids?: number[];
  poll_option_id: number | undefined;
  created_by?: number;
  img_url?: string | null;
  start_at?: number;
  end_at?: number | string;
  updated_at?: Date;
  created_at?: Date;
}

export interface OptionModel {
  title?: string;
  description?: string;
  id?: number;
  user_ids?: number[];
  created_by?: number;
  updated_at?: Date;
  created_at?: Date;
}

export interface CriteriaModel {
  id?: number;
  created_by?: number;
  description: string;
  created_at?: number;
}
