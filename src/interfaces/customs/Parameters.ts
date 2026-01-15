export interface IParameters {
  auto_deactivate_unused?: boolean;
  created_at?: string;
  id?: number;
  login_type?: string;
  max_active_sessions?: number;
  max_failed_attempts?: number;
  max_inactivity_days?: number;
  password_expiry_days?: number;
  password_history_count?:number;
  session_timeout_minutes?: number;
  status_id?: number;
  updated_at?: string
}