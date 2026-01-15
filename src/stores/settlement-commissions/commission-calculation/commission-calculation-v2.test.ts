import { setActivePinia, createPinia } from 'pinia'
import { useCommissionCalculationV2 } from './commission-calculation-v2'
import { executeApi } from '@/apis'
import { URL_PATH_SETTLEMENT_COMMISSIONS } from '@/constants/apis'
import { ICommissionCalculationFormV2 } from '@/interfaces/customs/settlement-commissions/CommissionCalculationV2'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
  })),
}))

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useShowError: jest.fn(() => ({ showCatchError: jest.fn(() => 'Error!') })),
}))

const mockCommissionCalculations = [
  {
    id: 889,
    business_trust_commissions_id: 336,
    comission_settlement_statuses_id: 7,
    period_start: '2027-12-18T05:00:00.000000Z',
    period_end: '2027-12-31T05:00:00.000000Z',
    business_trust_commissions: {
      id: 336,
      business_id: 703,
      commission_type_id: 62,
      third_party_billings_id: 111,
      business_code_snapshot: '121226',
      business_name_snapshot: 'Capital Platinum',
      business_status_snapshot: 57,
      business_start_date_snapshot: '2025-03-06',
      business_end_date_snapshot: '2025-12-10',
      periodicity: null,
      calculation_type: 'Salario minimo mensual legal vigente',
      type_commission: {
        id: 62,
        code: '004',
        description: 'Fija manual',
      },
      billing_trust: {
        id: 73,
        business_id: 703,
        code: '00023',
        start_date: '2025-12-18',
        end_date: '2027-12-31',
        periodicity: 'Trimestral',
      },
    },
  },
]

const mockFiduciaryCommisionsResponse = {
  business_trust_commission: {
    id: 336,
    business_id: 703,
    billing_trust_id: 73,
    third_party_billings_id: 111,
    commission_type_id: 62,
    commission_type_catalog_id: 2,
    commission_class_catalog_id: 1,
    settlement_parameters_id: null,
    comission_settlement_statuses_id: 25,
    business_code_snapshot: '121226',
    business_name_snapshot: 'Capital Platinum',
    business_start_date_snapshot: '2025-03-06',
    business_end_date_snapshot: '2025-12-10',
    business_status_snapshot: 58,
    description: 'Comisión administración centro',
    observation: 'Cobro comisión',
    collection: 'Anticipado',
    periodicity: null,
    count_transaction: null,
    snapshotted_at: '2026-01-13T15:11:29.124052Z',
    iva: false,
    calculation: {
      calculation_type: 'Salario minimo mensual legal vigente',
      minimum_wage_amount: '1423500.00',
      count_salaries: 1,
      base_commission_amount: '1423500.00',
      fixed_value: '80000.00',
      commission_percentage: null,
      commission_transaction: null,
      count_transaction: null,
    },
  },
  relationships: {
    billing_trust: {
      id: 73,
      business_id: 703,
      code: '00023',
      business_code_snapshot: '121226',
      business_name_snapshot: 'Capital Platinum',
      start_date: '2025-12-18',
      end_date: '2027-12-31',
      periodicity: 'Trimestral',
    },
    accounting_parameters: {
      id: 52,
      billing_trusts_id: 73,
      who_pays: 'fideicomiso',
      accounts: true,
      generates_iva: true,
      is_accounting: false,
      has_iva: false,
      iva: '19.00',
      has_retefuente: false,
      retefuente: '0.00',
      has_reteica: false,
      reteica: '0.00',
      has_reteiva: false,
      reteiva: '0.00',
      business_movement_code_snapshot: '00044',
      business_movement_name_snapshot:
        '00044 - COBRO COMISIÓN POR ADMINISTRACIÓN',
      business_movement_id_snapshot: '44',
    },
    third_party_billing: {
      id: 111,
      third_party_id: 2174,
      third_party_name: 'Jersson Salazar Prada SAS',
      third_party_document_type: 'NIT',
      third_party_document: '601235441',
      third_party_email: 'jsalazarp@gmail.com',
      third_party_phone: '(+57)314 360 5309',
      third_party_address: 'AV CL 56',
      status: {
        id: 1,
        name: 'Activo',
      },
    },
    commission_type: {
      id: 62,
      code: '004',
      description: 'Fija manual',
      commission_type_catalog_id: 2,
      commission_class_catalog_id: 1,
    },
    commission_type_catalog: {
      id: 2,
      name: 'Manual',
    },
    commission_class_catalog: {
      id: 1,
      name: 'Fija',
    },
    settlement_commissions: [
      {
        id: 881,
        business_trust_commissions_id: 336,
        base_amount: '1423500.00',
        iva_percentage: 19,
        iva_amount: '27046500.00',
        total_amount: '28470000.00',
        comission_settlement_statuses_id: 7,
        created_by: 29,
        updated_by: 29,
        created_at: '2026-01-08T23:13:17.000000Z',
        updated_at: '2026-01-09T15:52:23.000000Z',
        period_start: '2025-12-18T05:00:00.000000Z',
        period_end: '2026-03-18T05:00:00.000000Z',
        settled_at: '2026-01-09T15:52:23.000000Z',
        period_code: 1,
        retefuente_percentage: 0,
        retefuente_amount: 0,
        reteica_percentage: 0,
        reteica_amount: 0,
        reteiva_percentage: 0,
        reteiva_amount: 0,
        comission_settlement_statuses: {
          id: 7,
          name: 'Liquidado',
          created_by: null,
          created_at: '2025-09-10T15:17:14.000000Z',
          updated_at: '2025-09-10T15:17:14.000000Z',
        },
      },
    ],
  },
}

const mockCommissionForm: Partial<ICommissionCalculationFormV2> = {
  business_trust_commission_id: 337,
  commissions: [
    {
      iva_amount: '270465',
      retefuente_amount: '0',
      reteica_amount: '0',
      reteiva_amount: '0',
      id: 1,
      period_start: '2025-12-18',
      period_end: '2026-03-18',
      base_amount: '1423500',
      iva_percentage: 19,
      total_amount: '1693965',
      retefuente_percentage: 0,
      reteica_percentage: 0,
      reteiva_percentage: 0,
      commission_percentage: 0,
      transaction_commission: 0,
      count_transaction: 0,
      calculation_base: 'Salario minimo mensual legal vigente',
      commission_value: '1423500',
    },
  ],
}

const PATH_COMISSIONS = `${URL_PATH_SETTLEMENT_COMMISSIONS}/v2/commission-calculations`
const PATH_FIDUCIARY_BUSINESS_COMMISSIONS = `${URL_PATH_SETTLEMENT_COMMISSIONS}/v2/business-trust-commissions`

describe('useCommissionCalculationV2', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('should fetch list of commissions calculation', async () => {
    const store = useCommissionCalculationV2()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: {
          data: mockCommissionCalculations,
          current_page: 1,
          last_page: 2,
        },
        message: 'List fetched',
      },
      status: 200,
    })
    const params = { page: 1 }

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getCommissionCalculationList(params)

    expect(mockGet).toHaveBeenCalledWith(`${PATH_COMISSIONS}`, {
      params: { ...params, paginate: 1 },
    })
    expect(result.list).toEqual(mockCommissionCalculations)
    expect(result.pages.currentPage).toBe(1)
    expect(result.pages.lastPage).toBe(2)
  })

  it('should handle error when fetching commission calculation', async () => {
    const store = useCommissionCalculationV2()
    const mockGet = jest.fn().mockRejectedValue(new Error('API Error'))
    const params = { page: 1 }

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getCommissionCalculationList(params)

    expect(mockGet).toHaveBeenCalledWith(`${PATH_COMISSIONS}`, {
      params: { ...params, paginate: 1 },
    })
    expect(result.list).toEqual([])
  })

  it('should fetch commission calculation by ID', async () => {
    const store = useCommissionCalculationV2()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: mockFiduciaryCommisionsResponse,
        message: 'Found',
      },
      status: 200,
    })

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getByIdCommissionCalculation(1)

    expect(mockGet).toHaveBeenCalledWith(
      `${PATH_FIDUCIARY_BUSINESS_COMMISSIONS}/1`
    )
    expect(result).toEqual(mockFiduciaryCommisionsResponse)
  })

  it('should handle error when fetching commission calculation by ID', async () => {
    const store = useCommissionCalculationV2()
    const mockGet = jest.fn().mockRejectedValue(new Error('API Error'))

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getByIdCommissionCalculation(1)
    expect(mockGet).toHaveBeenCalledWith(
      `${PATH_FIDUCIARY_BUSINESS_COMMISSIONS}/1`
    )
    expect(result).toBeNull()
  })

  it('should update a commission calculation', async () => {
    const store = useCommissionCalculationV2()
    const form = mockCommissionForm

    const mockPut = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Updated' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateCommissionCalculation(form)

    expect(mockPut).toHaveBeenCalledWith(`${PATH_COMISSIONS}`, form)
    expect(result).toBe(true)
  })

  it('should return false if update fails', async () => {
    const store = useCommissionCalculationV2()
    const form = mockCommissionForm

    const mockPut = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Error' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateCommissionCalculation(form)

    expect(result).toBe(false)
  })
})
