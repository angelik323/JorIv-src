import { setActivePinia, createPinia } from 'pinia'
import { useFiduciaryBusinessCommissionsV1 } from './fiduciary-business-commissions-v1'
import { executeApi } from '@/apis'
import { URL_PATH_SETTLEMENT_COMMISSIONS } from '@/constants/apis'
import {
  IFiduciaryBusinessCommissionsCalculationForm,
  IFiduciaryBusinessCommissionsForm,
  IFiduciaryBusinessCommissionsToEdit,
} from '@/interfaces/customs'

const mockFiduciaryBusinessCommissions = [
  {
    id: 4,
    business_code_snapshot: '2220002',
    business_name_snapshot: 'Pruebas QA fl 2',
    business_start_date_snapshot: '2025-08-16',
    business_end_date_snapshot: '2025-08-20',
    business_status_snapshot: 57,
    created_by: 1,
    updated_by: null,
    created_at: '2025-08-01T00:00:00Z',
    updated_at: '2025-08-10T00:00:00Z',
  },
]

const mockSettlementParameters = {
  id: 5,
  calculation_type: 'Salario minimo legal vigente',
  smlmv_amount: 1500000.0,
  payment_amount: null,
  returns_percentage: null,
  balances_percentage: null,
  other_amount: null,
  smlmv_quantity: 2.0,
  payments_count: null,
  balances_amount: null,
  returns_amount: null,
  other_value_amount: null,
  base_amount: 1500000.0,
  iva_percentage: 19,
  iva_amount: 288800.0,
  total_amount: 1808800.0,
  created_by: 14332,
  updated_by: null,
  created_at: '2025-09-08T13:40:22.000000Z',
  updated_at: '2025-09-08T13:40:22.000000Z',
}

const mockFiduciaryBusinessCommissionsResponse = {
  id: 4,
  business_id: 5075,
  business_code_snapshot: '2220002',
  business_name_snapshot: 'Pruebas QA fl 2',
  commission_type_catalog_id: 1,
  commission_class_catalog_id: 1,
  snapshotted_at: '2025-09-08T19:31:04.037613Z',
  billing_trust_id: null,
  colllection: 'Anticipado',
  iva: true,
  observation: 'comisuion 1',
  comission_settlement_statuses_id: 25,
  created_by: 14332,
  updated_by: 14257,
  created_at: '2025-09-08T13:39:30.000000Z',
  updated_at: '2025-09-08T19:31:04.000000Z',
  settlement_parameters_id: 5,
  periodicity: 'Mensual',
  business_start_date_snapshot: '2025-08-16',
  business_end_date_snapshot: '2025-08-20',
  business_status_snapshot: 57,
  comission_settlement_statuses: null,
  billing_trusts: null,
  settlement_parameters: mockSettlementParameters,
  third_party_billings_id: 1,
  third_party_billings: {
    id: 1,
    third_party_document_type: 'CC',
    third_party_document: '123456789',
    third_party_name: 'Tercero S.A.S',
  },
  commission_type: {
    id: 1,
    description: 'Comisión automática',
    value: 10000.0,
  },
  commission_type_catalog: {
    id: 1,
    name: 'Automática',
    created_at: '2025-08-21T02:25:12.000000Z',
    updated_at: '2025-08-21T02:25:12.000000Z',
  },
  commission_class_catalog: {
    id: 1,
    name: 'Fija',
    created_at: '2025-08-21T02:25:12.000000Z',
    updated_at: '2025-08-21T02:25:12.000000Z',
  },
}

const mockFiduciaryBusinessCommissionsDescriptions = [
  {
    id: 4,
    observation: 'comisuion 1',
    created_at: '2025-09-08T13:39:30.000000Z',
    comission_settlement_statuses_id: 25,
    settlement_parameters_id: 5,
    comission_settlement_statuses: null,
    billing_trusts: null,
    settlement_parameters: mockSettlementParameters,
    commission_type_catalog: null,
    commission_class_catalog: null,
  },
]

const mockFiduciaryBusinessCommissionsCalculation = {
  id: 5,
  calculation_type: 'Salario minimo legal vigente',
  smlmv_amount: 1500000.0,
  payment_amount: null,
  returns_percentage: null,
  balances_percentage: null,
  other_amount: null,
  smlmv_quantity: 2.0,
  payments_count: null,
  balances_amount: null,
  returns_amount: null,
  other_value_amount: null,
  base_amount: 1500000.0,
  iva_percentage: 19,
  iva_amount: 288800.0,
  total_amount: 1808800.0,
  created_by: 14332,
  updated_by: null,
  created_at: '2025-09-08T13:40:22.000000Z',
  updated_at: '2025-09-08T13:40:22.000000Z',
}

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

describe('useFiduciaryBusinessCommissionsV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('should fetch list of fiduciary business commissions', async () => {
    const store = useFiduciaryBusinessCommissionsV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: {
          data: mockFiduciaryBusinessCommissions,
          current_page: 1,
          last_page: 2,
        },
        message: 'List fetched',
      },
      status: 200,
    })
    const params = { page: 1 }

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getFiduciaryBusinessCommissionsList(params)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_SETTLEMENT_COMMISSIONS}/business-trust-commissions`,
      {
        params: { ...params, paginate: 1 },
      }
    )
    expect(store.fiduciary_business_commissions_list).toEqual(
      mockFiduciaryBusinessCommissions
    )
    expect(store.fiduciary_business_commissions_pages.currentPage).toBe(1)
    expect(store.fiduciary_business_commissions_pages.lastPage).toBe(2)
  })

  it('should handle error when fetching fiduciary business commissions', async () => {
    const store = useFiduciaryBusinessCommissionsV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('API Error'))
    const params = { page: 1 }

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getFiduciaryBusinessCommissionsList(params)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_SETTLEMENT_COMMISSIONS}/business-trust-commissions`,
      {
        params: { ...params, paginate: 1 },
      }
    )
    expect(store.fiduciary_business_commissions_list).toEqual([])
  })

  it('should fetch fiduciary business commission by ID', async () => {
    const store = useFiduciaryBusinessCommissionsV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: mockFiduciaryBusinessCommissionsResponse,
        message: 'Found',
      },
      status: 200,
    })

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdFiduciaryBusinessCommissions(1)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_SETTLEMENT_COMMISSIONS}/business-trust-commissions/1`
    )
    expect(store.fiduciary_business_commissions_response).toEqual(
      mockFiduciaryBusinessCommissionsResponse
    )
  })

  it('should handle error when fetching fiduciary business commission by ID', async () => {
    const store = useFiduciaryBusinessCommissionsV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('API Error'))

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdFiduciaryBusinessCommissions(1)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_SETTLEMENT_COMMISSIONS}/business-trust-commissions/1`
    )
    expect(store.fiduciary_business_commissions_response).toBeNull()
  })

  it('should create a new fiduciary business commission', async () => {
    const store = useFiduciaryBusinessCommissionsV1()
    const formData: IFiduciaryBusinessCommissionsForm = {
      business_code: '2220002',
      name: 'Test Business',
      commission_class_catalog_id: 1,
      commission_class_catalog_name: 'Test Class',
      commission_type_catalog_id: 1,
      commission_type_catalog_name: 'Test Type',
      periodicity: 'Mensual',
      colllection: 'Anticipado',
      iva: true,
      observation: null,
      third_party_billings_id: 1,
    }

    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Rejection reason created' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createFiduciaryBusinessCommissions(formData)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_SETTLEMENT_COMMISSIONS}/business-trust-commissions`,
      formData
    )
    expect(result).toBe(true)
  })

  it('should return false if creation fails', async () => {
    const store = useFiduciaryBusinessCommissionsV1()
    const formData: IFiduciaryBusinessCommissionsForm = {
      business_code: '2220002',
      name: 'Test Business',
      commission_class_catalog_id: 1,
      commission_class_catalog_name: 'Test Class',
      commission_type_catalog_id: 1,
      commission_type_catalog_name: 'Test Type',
      periodicity: 'Mensual',
      colllection: 'Anticipado',
      iva: true,
      observation: null,
      third_party_billings_id: 1,
    }

    const mockPost = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Error' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createFiduciaryBusinessCommissions(formData)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_SETTLEMENT_COMMISSIONS}/business-trust-commissions`,
      formData
    )
    expect(result).toBe(false)
  })

  it('should return false when API throws an error', async () => {
    const store = useFiduciaryBusinessCommissionsV1()
    const formData: IFiduciaryBusinessCommissionsForm = {
      business_code: '2220002',
      name: 'Test Business',
      commission_class_catalog_id: 1,
      commission_class_catalog_name: 'Test Class',
      commission_type_catalog_id: 1,
      commission_type_catalog_name: 'Test Type',
      periodicity: 'Mensual',
      colllection: 'Anticipado',
      iva: true,
      observation: null,
      third_party_billings_id: 1,
    }

    const mockPost = jest.fn().mockRejectedValue(new Error('Network error'))

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createFiduciaryBusinessCommissions(formData)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_SETTLEMENT_COMMISSIONS}/business-trust-commissions`,
      formData
    )
    expect(result).toBe(false)
  })

  it('should update a fiduciary business commission', async () => {
    const store = useFiduciaryBusinessCommissionsV1()
    const form: IFiduciaryBusinessCommissionsToEdit = {
      commission_class_catalog_id: 1,
      commission_type_catalog_id: 1,
      periodicity: 'Mensual',
      colllection: 'Anticipado',
      iva: true,
      observation: null,
      third_party_billings_id: 1,
    }

    const mockPut = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Updated' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateRFiduciaryBusinessCommissions(form, 1)

    expect(mockPut).toHaveBeenCalledWith(
      `${URL_PATH_SETTLEMENT_COMMISSIONS}/business-trust-commissions/1`,
      form
    )
    expect(result).toBe(true)
  })

  it('should return false if update fails', async () => {
    const store = useFiduciaryBusinessCommissionsV1()
    const form: IFiduciaryBusinessCommissionsToEdit = {
      commission_class_catalog_id: 1,
      commission_type_catalog_id: 1,
      periodicity: 'Mensual',
      colllection: 'Anticipado',
      iva: true,
      observation: null,
      third_party_billings_id: 1,
    }

    const mockPut = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Error' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateRFiduciaryBusinessCommissions(form, 1)

    expect(result).toBe(false)
  })

  it('should fetch list of fiduciary business commissions descriptions', async () => {
    const store = useFiduciaryBusinessCommissionsV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: {
          descriptions: {
            data: mockFiduciaryBusinessCommissionsDescriptions,
            current_page: 1,
            last_page: 2,
          },
        },
        message: 'List fetched',
      },
      status: 200,
    })
    const params = { page: 1 }

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdDescriptionsFiduciaryBusinessCommissions(1, params)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_SETTLEMENT_COMMISSIONS}/business-trust-commissions/1/descriptions`,
      {
        params: { ...params, paginate: 1 },
      }
    )
    expect(store.fiduciary_business_commissions_descriptions).toEqual(
      mockFiduciaryBusinessCommissionsDescriptions
    )
    expect(store.fiduciary_business_commissions_pages.currentPage).toBe(1)
    expect(store.fiduciary_business_commissions_pages.lastPage).toBe(2)
  })

  it('should handle error when fetching fiduciary business commissions descriptions', async () => {
    const store = useFiduciaryBusinessCommissionsV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('API Error'))
    const params = { page: 1 }

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdDescriptionsFiduciaryBusinessCommissions(1, params)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_SETTLEMENT_COMMISSIONS}/business-trust-commissions/1/descriptions`,
      {
        params: { ...params, paginate: 1 },
      }
    )
    expect(store.fiduciary_business_commissions_descriptions).toEqual([])
  })

  it('should fetch fiduciary business commission calculation by ID', async () => {
    const store = useFiduciaryBusinessCommissionsV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: mockFiduciaryBusinessCommissionsCalculation,
        message: 'Found',
      },
      status: 200,
    })

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdCalculationCommissions(1)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_SETTLEMENT_COMMISSIONS}/business-trust-commissions/1/settlement-parameters`
    )
    expect(store.calculation_commissions_response).toEqual(
      mockFiduciaryBusinessCommissionsCalculation
    )
  })

  it('should handle error when fetching fiduciary business commission calculation by ID', async () => {
    const store = useFiduciaryBusinessCommissionsV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('API Error'))

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdCalculationCommissions(1)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_SETTLEMENT_COMMISSIONS}/business-trust-commissions/1/settlement-parameters`
    )
    expect(store.calculation_commissions_response).toBeNull()
  })

  it('should create a new fiduciary business commission calculation', async () => {
    const store = useFiduciaryBusinessCommissionsV1()
    const formData: IFiduciaryBusinessCommissionsCalculationForm =
      mockSettlementParameters

    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Rejection reason created' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createCalculationCommissions(1, formData)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_SETTLEMENT_COMMISSIONS}/business-trust-commissions/1/settlement-parameters`,
      formData
    )
    expect(result).toBe(true)
  })

  it('should return false if creation fails - commission calculation', async () => {
    const store = useFiduciaryBusinessCommissionsV1()
    const formData: IFiduciaryBusinessCommissionsCalculationForm =
      mockSettlementParameters

    const mockPost = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Error' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createCalculationCommissions(1, formData)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_SETTLEMENT_COMMISSIONS}/business-trust-commissions/1/settlement-parameters`,
      formData
    )
    expect(result).toBe(false)
  })

  it('should return false when API throws an error - commission calculation', async () => {
    const store = useFiduciaryBusinessCommissionsV1()
    const formData: IFiduciaryBusinessCommissionsCalculationForm =
      mockSettlementParameters

    const mockPost = jest.fn().mockRejectedValue(new Error('Network error'))

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createCalculationCommissions(1, formData)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_SETTLEMENT_COMMISSIONS}/business-trust-commissions/1/settlement-parameters`,
      formData
    )
    expect(result).toBe(false)
  })

  it('should clear all data in the store', () => {
    const store = useFiduciaryBusinessCommissionsV1()

    store.fiduciary_business_commissions_list = mockFiduciaryBusinessCommissions

    store.fiduciary_business_commissions_descriptions =
      mockFiduciaryBusinessCommissionsDescriptions

    store.fiduciary_business_commissions_response =
      mockFiduciaryBusinessCommissionsResponse

    store.calculation_commissions_response =
      mockFiduciaryBusinessCommissionsCalculation

    store.fiduciary_business_commissions_pages = {
      currentPage: 2,
      lastPage: 3,
    }

    store._clearData()

    expect(store.fiduciary_business_commissions_list).toEqual([])
    expect(store.fiduciary_business_commissions_descriptions).toEqual([])
    expect(store.fiduciary_business_commissions_response).toBeNull()
    expect(store.fiduciary_business_commissions_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
  })
})
