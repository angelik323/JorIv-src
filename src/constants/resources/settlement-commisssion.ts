import { CalculationType } from '@/interfaces/customs/settlement-commissions/FiduciaryBusinessCommissionsV2'

export type CommissionConfigKeyCode = '001' | '002' | '003' | '004' | '005' | '006'
export type CommissionConfigKey = '1' | '2' | '3' | `${number}-${number}`

export const COMMISSION_CLASS_CODE = {
    FAUTOMATICA: '001',
    FMANUAL: '004',
    VAUTOMATICA: '002',
    VMANUAL: '005',
    EAUTOMATICA: '003',
    EMANUAL: '006',
} as const

export const COMMISSION_CLASS = {
    FIDUCIARY: 1,
    INVESTMENT_MANAGEMENT: 2,
    PORTFOLIO_ADMINISTRATION: 3
} as const

export const CALCULATION_BASE_CODES = {
    SMMLV: 'smmlv',
    VF: 'vf',
    BENEFICIARIES: 'beneficiaries',
    PERFORMANCE_PERCENTAGE: 'performance_percentage',
    BALANCES_PERCENTAGE: 'balances_percentage',
    TRANSACTIONS_PERCENTAGE: 'transactions_percentage',
    TRANSACTIONS_VALUE: 'transactions_value',
    MANUAL: 'manual',
} as const

const COMMON_CALCULATION_TYPES = [
    CALCULATION_BASE_CODES.SMMLV,
    CALCULATION_BASE_CODES.VF,
]

export const commissionTypeMap: Record<CommissionConfigKeyCode, readonly string[]> = {
    [COMMISSION_CLASS_CODE.FAUTOMATICA]: COMMON_CALCULATION_TYPES,
    [COMMISSION_CLASS_CODE.FMANUAL]: COMMON_CALCULATION_TYPES,
    [COMMISSION_CLASS_CODE.VAUTOMATICA]: [
        CALCULATION_BASE_CODES.BENEFICIARIES,
        CALCULATION_BASE_CODES.PERFORMANCE_PERCENTAGE,
        CALCULATION_BASE_CODES.BALANCES_PERCENTAGE,
        CALCULATION_BASE_CODES.TRANSACTIONS_PERCENTAGE,
        CALCULATION_BASE_CODES.TRANSACTIONS_VALUE,
    ],
    [COMMISSION_CLASS_CODE.VMANUAL]: [
        CALCULATION_BASE_CODES.MANUAL,
    ],
    [COMMISSION_CLASS_CODE.EAUTOMATICA]: COMMON_CALCULATION_TYPES,
    [COMMISSION_CLASS_CODE.EMANUAL]: COMMON_CALCULATION_TYPES,
}

export const commissionTypeMap2: Record<
    CommissionConfigKey,
    CalculationType[]
> = {
    [COMMISSION_CLASS.FIDUCIARY]: [
        CalculationType.SMLMV,
        CalculationType.FIXED_VALUE,
    ],
    [COMMISSION_CLASS.PORTFOLIO_ADMINISTRATION]: [
        CalculationType.SMLMV,
        CalculationType.FIXED_VALUE,
    ],
    [COMMISSION_CLASS.INVESTMENT_MANAGEMENT]: [
        CalculationType.BENEFICIARY_PAYMENT,
        CalculationType.PERFORMANCE_PERCENTAGE,
        CalculationType.BALANCE_PERCENTAGE,
        CalculationType.MANUAL,
        CalculationType.TRANSACTION_PERCENTAGE,
        CalculationType.TRANSACTION_VALUE,
    ],
}