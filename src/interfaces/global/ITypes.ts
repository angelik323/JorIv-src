export type IActions = 'edit' | 'Inactive' | 'Active' | 'Delete' | 'view';
export type ICrud = "create" | "read" |"update" | "delete"
export type IStatus = 'success' | 'error' | 'warning' | "info"
export interface IApiResponse {
    message: string
    status: IStatus
}

export interface IResponseAction {
    message: string
    status: IStatus
}

export type IChartAccountsGroup = 'Todos' | 'Activos' | 'Pasivos' | 'Patrimonio' | 'Ingresos' | 'Gastos' | 'Costos de ventas' | 'Costos de producción' | 'Cuentas de orden deudoras' | 'Cuentas de orden acreedoras'
  
export type IFilters = {
    'filter[status_id]'?: string | number | null;
    'filter[search]'?: string | null;
  };

  export type IChartAccountsType = 'main-group' |'sub-group' | 'account-group' | 'sub-account-group' | 'auxiliary-group' | 'update-auxiliary-group'

  export type IImpairmentsType = 'main-group' |'sub-group' | 'account-group' | 'sub-account-group' | 'auxiliary-group' | 'update-auxiliary-group'

  export type IImpairmentsGroup = 'Todos' | 'Activos' | 'Pasivos' | 'Patrimonio' | 'Ingresos' | 'Gastos' | 'Costos de ventas' | 'Costos de producción' | 'Cuentas de orden deudoras' | 'Cuentas de orden acreedoras'
  




