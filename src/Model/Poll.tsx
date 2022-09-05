export interface selectedCriteriaOption {
  criteria_id: number | undefined;
  poll_option_id: number | undefined;
}

export interface PollModel {
  id?: number;
  title: string | undefined;
  description: string | undefined;
  criteria_option_id_array?: selectedCriteriaOption[];
  created_by?: number;
  img_url?: string | null;
  start_at?: number;
  end_at?: number | string;
  updated_at?: Date;
  created_at?: Date;
}

export interface OptionModel {
  id?: number;
  title?: string;
  description?: string;
  options?: string[];
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
