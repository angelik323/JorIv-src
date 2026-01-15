export const URL_PATH_ASSET = 'assets/api/assets'

// Terceros ----------------------------------------------------------------------------------------------------
export const URL_PATH_THIRD_PARTIES_V2 = `${URL_PATH_ASSET}/v2/third-party`
export const URL_PATH_THIRD_PARTIES_V1 = 'third-parties/api/third-parties'

// Inspektor ----------------------------------------------------------------------------------------------------
export const URL_PATH_INSPEKTOR = `watchlist/api/watchlist/inspektor`

// Negocios fiduciarios
export const TRUST_BUSINESS_API_URL = 'business-trust/api/business-trust'

// Tesoreria
export const URL_PATH_TREASURIES = 'treasuries/api/treasuries'
export const URL_PATH_TREASURIES_DISPERSION_GROUP_LETTERS = `${URL_PATH_TREASURIES}/generate-dispersion-group-letter`

// Contabilidad
export const URL_PATH_ACCOUNTING = 'accounting/api/accounting'

// Portafolio de inversiones
export const URL_PATH_INVESTMENT_PORTFOLIO =
  'investment-portfolio/api/investment-portfolio'

// Agenda y notificaciones
export const URL_PATH_SCHEDULES = 'schedules/api/schedules'
/* Notificaciones */
export const URL_PATH_SCHEDULES_NOTIFICATIONS = `${URL_PATH_SCHEDULES}/notifications`

// Seguridad ----------------------------------------------------------------------------------------------------------------
export const URL_PATH_SECURITY = 'security/api/security'

/* Login - Logout - LDAP */
export const URL_PATH_SECURITY_LOGIN = `${URL_PATH_SECURITY}/login`
export const URL_PATH_SECURITY_LOGOUT = `${URL_PATH_SECURITY}/logout`
export const URL_PATH_SECURITY_LDAP = `${URL_PATH_SECURITY_LOGIN}/ldap`

/* Intentos Fallidos */
export const URL_PATH_SECURITY_FAILED_LOGIN_ATTEMPS = `${URL_PATH_SECURITY}/failed-login-attempts`
export const URL_PATH_SECURITY_FAILED_LOGIN_ATTEMPS_EXPORT = `${URL_PATH_SECURITY_FAILED_LOGIN_ATTEMPS}/export`

/* Estado de usuarios */
export const URL_PATH_SECURITY_USERS_STATUS = `${URL_PATH_SECURITY}/users-status`
export const URL_PATH_SECURITY_USERS_STATUS_LIST = `${URL_PATH_SECURITY_USERS_STATUS}/list`
export const URL_PATH_SECURITY_USERS_STATUS_EXPORT = `${URL_PATH_SECURITY_USERS_STATUS}/export`

/* Usuarios conectados */
export const URL_PATH_SECURITY_USERS_CONNECTED = `${URL_PATH_SECURITY}/connected-users`

/* Historial de conexiones */
export const URL_PATH_SECURITY_USER_CONNECTIONS = `${URL_PATH_SECURITY}/user-connections`

/* Horario de ingreso  de usuarios */
export const URL_PATH_SECURITY_USER_CHECKIN = `${URL_PATH_SECURITY}/entry-times`

/* Control de versiones de modulos */
export const URL_PATH_SECURITY_USER_VERSIONS_MODULES = `${URL_PATH_SECURITY}/modules-app`

// Clientes ------------------------------------------------------------------------------------------------------------------

// Terceros ------------------------------------------------------------------------------------------------------------------
export const THIRD_PARTY_API_URL = 'third-parties/api/third-parties/'

// Recursos
export const URL_PATH_RESOURCES = 'assets/api/assets/utils/select-tables'

// FICS ----------------------------------------------------------------------------------------------------------------------
export const URL_PATH_FICS = 'fics/api/fics'

// Obligaciones financieras --------------------------------------------------------------------------------------------------
export const URL_PATH_FINANCIAL_OBLIGATION =
  'financial-obligations/api/financial-obligations'

// Usuarios ------------------------------------------------------------------------------------------------------------------
export const URL_PATH_USERS = 'users/api/users'

/* Roles */
export const URL_PATH_USERS_ROLES = `${URL_PATH_USERS}/roles`
/* Permisos */
export const URL_PATH_USERS_ROLES_PERMISSIONS = `${URL_PATH_USERS}/permissions`

/* Gestion de usuarios */
export const URL_PATH_USERS_LIST = `${URL_PATH_USERS}/fidu-users/get?paginate=1`
export const URL_PATH_USERS_GET_BY_ID = `${URL_PATH_USERS}/fidu-users`

// Liquidación de comisiones -------------------------------------------------------------------------------------------
export const URL_PATH_SETTLEMENT_COMMISSIONS =
  'commission-settlement/api/commission-settlement'

// Facturación y cartera -----------------------------------------------------------------------------------------------
export const URL_PATH_BILLING = 'billing-collect/api/billing-collect'

// Presupuesto ---------------------------------------------------------------------------------------------------------
export const URL_PATH_BUDGET = 'budget/api/budget'

// Contratación derivada -----------------------------------------------------------------------------------------------
export const URL_PATH_DERIVATIVE_CONTRACTING =
  'derivative-contracting/api/derivative-contracting'

/* Documentos anexos */
export const URL_PATH_DERIVATIVE_CONTRACTING_ATTACHED_DOCUMENT = `${URL_PATH_DERIVATIVE_CONTRACTING}/annex-document`

/* Modificación de hitos de pago */
export const URL_PATH_DERIVATIVE_CONTRACTING_PAYMENT_MILESTONES_MODIFICATION = `${URL_PATH_DERIVATIVE_CONTRACTING}/contract-milestone-modification`
/* Contratación Derivada  - Consulta general de contratos */
export const URL_PATH_DERIVATIVE_CONTRACTING_GENERAL_CONTRACT_INQUIRY = `${URL_PATH_DERIVATIVE_CONTRACTING}/general-consultation-contracts`
// Cuentas por pagar ---------------------------------------------------------------------------------------------------
export const URL_PATH_ACCOUNTS_PAYABLE = 'accounts-payable/api/accounts-payable'

// Normativo -----------------------------------------------------------------------------------------------------------
export const URL_PATH_NORMATIVE = 'normative/api/normative'

// Clientes -----------------------------------------------------------------------------------------------
export const URL_PATH_CLIENTS = 'clients/api/clients/third-parties'

// Activos fijos -------------------------------------------------------------------------------------------------------
export const URL_PATH_FIXED_ASSETS = 'fixed-assets/api/fixed-assets'

// Tributario -----------------------------------------------------------------------------------------------------------
export const URL_PATH_TAX = 'tax-service/api/tax-service'

/* Tipos de impuestos */
export const URL_PATH_TAX_TYPES = `${URL_PATH_TAX}/tax-types`

/* Jurisdicciones */
export const URL_PATH_JURISDICTIONS = `${URL_PATH_TAX}/jurisdictions`

/* Impuestos y retenciones */
export const URL_PATH_TAXES_AND_WITHHOLDINGS = `${URL_PATH_TAX}/taxes`

/* Tipos de impuestos - recursos */
export const URL_PATH_TAX_RESOURCES = `${URL_PATH_TAX}/select-tables`

// Auditoría ------------------------------------------------------------------------------------------------------------
export const URL_PATH_AUDIT = '/audit/api/audit'

// Embargos
export const URL_PATH_SEIZURES = 'seizure/api/seizure'

// Sarlaft ---------------------------------------------------------------------------------------------------------------
export const URL_PATH_SARLAFT = 'sarlaft/api/sarlaft'
