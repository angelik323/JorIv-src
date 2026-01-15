import { setActivePinia, createPinia } from 'pinia'
import { useAutomaticDebitSettingsStoreV1 } from './automatic-debit-settings-v1'
import { executeApi } from '@/apis'
import { URL_PATH_BILLING } from '@/constants/apis'

const mockAutomaticDebitList = [
  {
    id: 6,
    business_trust_id: 5065,
    business_trust_code: '221',
    business_trust_name: 'Proyecto vial del norte',
    automatic_debit: false,
    collective_investment_fund_id: null,
    investment_plan_id: null,
    account_bank_id: 1,
    account_id: 10,
    balance: null,
    is_active: false,
    created_by: 14257,
    created_at: '2025-10-17T23:13:52.000000Z',
    updated_at: '2025-10-20T15:51:48.000000Z',
    collective_investment_fund_data: null,
    investment_plan_data: null,
    bank_data: {
      id: 1,
      description: 'Bancolombia',
      bank_code: '001',
    },
    account_bank_data: {
      id: 10,
      bank_id: 1,
      account_name: 'nombre de cuenta',
      account_number: '2387428341235433',
      operation_type: 'SEBRA',
      account_type: 'Cuenta corriente',
    },
    source: {
      value: 'account',
      label: 'Cuenta',
    },
  },
]

const mockAutomaticDebitResponse = {
  id: 1,
  automatic_debit: true,
  updated_at: '2025-10-20T15:30:00.000000Z',
  business_trust_id: 5001,
  collective_investment_fund_id: null,
  investment_plan_id: null,
  account_bank_id: 123,
  account_id: 456,
  source: 'account',
  business_code_snapshot: 'NEG-001',
  business_name_snapshot: 'Fideicomiso de Administración XYZ',
  is_active: true,

  collective_investment_fund_data: null,

  investment_plan_data: null,

  bank_data: {
    id: 123,
    description: 'Banco de Bogotá',
    bank_code: '001',
  },

  account_bank_data: {
    id: 456,
    bank_id: 123,
    account_name: 'Cuenta Corriente Principal',
    account_number: '123456789012',
    operation_type: 'Corriente',
    account_type: 'Ahorros',
  },

  account_balance: 50000000,

  plan_balance: {
    plan_balance: null,
  },

  document_data: {
    id: 1,
    original_name: 'autorizacion_debito.pdf',
    random_name: '68f2cdb14534d_autorizacion_debito.pdf',
    path: 'automatic_debit_parameterizations/68f2cdb14534d_autorizacion_debito.pdf',
    temporal_path:
      'https://documents-fiduv2-dev.s3.amazonaws.com/automatic_debit_parameterizations/68f2cdb14534d_autorizacion_debito.pdf',
    extension: 'pdf',
    size: 15420,
    mime_type: 'application/pdf',
    created_by: 14257,
    updated_by: null,
    created_at: '2025-10-15T10:00:00.000000Z',
  },
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
describe('useAutomaticDebitSettingsStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })
  it('should fetch list of automatic debit', async () => {
    const store = useAutomaticDebitSettingsStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: {
          data: mockAutomaticDebitList,
          current_page: 1,
          last_page: 2,
        },
        message: 'List fetched',
      },
      status: 200,
    })
    const params = { page: 1 }
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
    await store._getAutomaticDebitList(params)
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_BILLING}/automatic-debit-collection`,
      {
        params: { ...params, paginate: 1 },
      }
    )
    expect(store.automatic_debit_list).toEqual(mockAutomaticDebitList)
    expect(store.automatic_debit_pages.currentPage).toBe(1)
    expect(store.automatic_debit_pages.lastPage).toBe(2)
  })
  it('should handle error when fetching automatic debit', async () => {
    const store = useAutomaticDebitSettingsStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('API Error'))
    const params = { page: 1 }
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
    await store._getAutomaticDebitList(params)
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_BILLING}/automatic-debit-collection`,
      {
        params: { ...params, paginate: 1 },
      }
    )
    expect(store.automatic_debit_list).toEqual([])
  })
  it('should fetch automatic debit by ID', async () => {
    const store = useAutomaticDebitSettingsStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: mockAutomaticDebitResponse,
        message: 'Found',
      },
      status: 200,
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
    await store._getByIdAutomaticDebit(1)
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_BILLING}/automatic-debit-collection/1`
    )
    expect(store.automatic_debit_response).toEqual(mockAutomaticDebitResponse)
  })
  it('should handle error when fetching automatic debit by ID', async () => {
    const store = useAutomaticDebitSettingsStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('API Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
    await store._getByIdAutomaticDebit(1)
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_BILLING}/automatic-debit-collection/1`
    )
    expect(store.automatic_debit_response).toBeNull()
  })

  it('should clear all data in the store', () => {
    const store = useAutomaticDebitSettingsStoreV1()
    store.automatic_debit_list = mockAutomaticDebitList
    store.automatic_debit_response = mockAutomaticDebitResponse
    store.automatic_debit_pages = {
      currentPage: 2,
      lastPage: 3,
    }
    store._clearData()
    expect(store.automatic_debit_list).toEqual([])
    expect(store.automatic_debit_response).toBeNull()
    expect(store.automatic_debit_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
  })
})
