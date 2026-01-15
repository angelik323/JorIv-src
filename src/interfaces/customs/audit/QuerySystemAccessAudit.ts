export interface IQuerySystemAccessAuditList {
  id: number
  type: string
  used_at: string
  ip_address: string
  user: IQuerySystemAccessAuditUser
}

export interface IQuerySystemAccessAuditUser {
  id: number
  name: string
  role: string
  role_id: number
}
