import { setActivePinia, createPinia } from 'pinia'
import { useAccountingSettingsStoreV2 } from './accounting-settings-v2'
import { executeApi } from '@/apis'
import { URL_PATH_SETTLEMENT_COMMISSIONS } from '@/constants/apis'
import { IAccountingSettingsInformationFormV2 } from '@/interfaces/customs/settlement-commissions/AccountingSettingsV2'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  })),
}))

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useShowError: jest.fn(() => ({ showCatchError: jest.fn(() => 'Error!') })),
}))

const URL_ACCOUNTING_SETTINGS = `${URL_PATH_SETTLEMENT_COMMISSIONS}/v2/accounting-parameters`

const mockAccountingSettingResponse = {
  id: 4,
  business_id: 5011,
  business_code_snapshot: '3496945',
  business_name_snapshot: 'Quia cumque id animi et dolorum reiciendis.',
  snapshotted_at: '2025-11-05',
  who_pays: 'fideicomiso',
  accounts: true,
  generates_iva: true,
  iva: '1.00',
  created_by: 14257,
  updated_by: 14257,
  billing_trusts_id: 1,
  created_at: '2025-11-05T13:28:13.000000Z',
  updated_at: '2025-11-05T21:17:20.000000Z',
  business_movement_code_snapshot: '00026',
  business_movement_name_snapshot: '00026 - test26v2',
  business_movement_id_snapshot: '26',
  is_accounting: false,
  has_iva: false,
  has_retefuente: false,
  has_reteica: false,
  has_reteiva: false,
  retefuente: '0.00',
  reteica: '0.00',
  reteiva: '0.00',
}

const mockAccountingSettingList = [
  {
    id: 4,
    start_date: '2025-09-10',
    end_date: '2025-09-19',
    periodicity: 'Mensual',
    code: '0001',
    business_movement_code_snapshot: '00026',
    business_movement_name_snapshot: '00026 - test26v2',
    business_code_snapshot: '3496945',
    business_name_snapshot: 'Quia cumque id animi et dolorum reiciendis.',
  },
]

const mockAccountingSettingForm: IAccountingSettingsInformationFormV2 = {
  who_pays: 'fideicomiso',
  accounts: true,

  generates_iva: true,
  has_retefuente: true,
  has_reteica: false,
  has_reteiva: false,

  iva: 19,
  retefuente: 25,
  reteica: 9,
  reteiva: 0,

  business_code_snapshot: '12223456',

  business_movement_code_snapshot: 'VTA01',
  business_movement_name_snapshot: 'VENTA',
  business_movement_id_snapshot: '00042',
  business_movement_nature_snapshot: 'No aplica',

  billing_trusts_id: 2,
}

describe('useAccountingSettingsStoreV2', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('should fetch list of accounting settings', async () => {
    const store = useAccountingSettingsStoreV2()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: {
          data: mockAccountingSettingList,
          current_page: 1,
          last_page: 2,
        },
        message: 'List fetched',
      },
      status: 200,
    })
    const params = { page: 1 }

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getAccountingSettingsList(params)

    expect(mockGet).toHaveBeenCalledWith(`${URL_ACCOUNTING_SETTINGS}`, {
      params: { ...params, paginate: 1 },
    })
    expect(store.accounting_settings_list).toEqual(mockAccountingSettingList)
    expect(store.accounting_settings_pages).toEqual({
      currentPage: 1,
      lastPage: 2,
    })
  })

  it('should handle error when fetching accounting settings', async () => {
    const store = useAccountingSettingsStoreV2()
    const mockGet = jest.fn().mockRejectedValue(new Error('API Error'))
    const params = { page: 1 }

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getAccountingSettingsList(params)

    expect(mockGet).toHaveBeenCalledWith(`${URL_ACCOUNTING_SETTINGS}`, {
      params: { ...params, paginate: 1 },
    })
    expect(store.accounting_settings_list).toEqual([])
  })

  it('should fetch accounting settings by ID', async () => {
    const store = useAccountingSettingsStoreV2()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: mockAccountingSettingResponse,
        message: 'Found',
      },
      status: 200,
    })

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const response = await store._getByIdAccountingSettings(1)

    expect(mockGet).toHaveBeenCalledWith(`${URL_ACCOUNTING_SETTINGS}/1`)
    expect(response).toEqual(mockAccountingSettingResponse)
  })

  it('should handle error when fetching accounting settings by ID', async () => {
    const store = useAccountingSettingsStoreV2()
    const mockGet = jest.fn().mockRejectedValue(new Error('API Error'))

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const response = await store._getByIdAccountingSettings(1)

    expect(mockGet).toHaveBeenCalledWith(`${URL_ACCOUNTING_SETTINGS}/1`)
    expect(response).toBeNull()
  })

  it('should create a new accounting setting', async () => {
    const store = useAccountingSettingsStoreV2()
    const formData = mockAccountingSettingForm

    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Rejection reason created' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAccountingSettings(formData)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_ACCOUNTING_SETTINGS}`,
      formData
    )
    expect(result).toBe(true)
  })

  it('should return false if creation fails', async () => {
    const store = useAccountingSettingsStoreV2()
    const formData = mockAccountingSettingForm

    const mockPost = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Error' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAccountingSettings(formData)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_ACCOUNTING_SETTINGS}`,
      formData
    )
    expect(result).toBe(false)
  })

  it('should return false when API throws an error', async () => {
    const store = useAccountingSettingsStoreV2()
    const formData = mockAccountingSettingForm

    const mockPost = jest.fn().mockRejectedValue(new Error('Network error'))

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAccountingSettings(formData)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_ACCOUNTING_SETTINGS}`,
      formData
    )
    expect(result).toBe(false)
  })

  it('should update a accounting setting', async () => {
    const store = useAccountingSettingsStoreV2()
    const form = mockAccountingSettingForm

    const mockPut = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Updated' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateAccountingSettings(form, 1)

    expect(mockPut).toHaveBeenCalledWith(`${URL_ACCOUNTING_SETTINGS}/1`, form)
    expect(result).toBe(true)
  })

  it('should return false if update fails', async () => {
    const store = useAccountingSettingsStoreV2()
    const form = mockAccountingSettingForm

    const mockPut = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Error' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateAccountingSettings(form, 1)

    expect(result).toBe(false)
  })

  it('should delete a accounting setting', async () => {
    const store = useAccountingSettingsStoreV2()

    const mockDelete = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Deleted' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    const result = await store._deleteAccountingSettings(1)

    expect(mockDelete).toHaveBeenCalledWith(`${URL_ACCOUNTING_SETTINGS}/1`)
    expect(result).toBe(true)
  })

  it('should return false if delete fails', async () => {
    const store = useAccountingSettingsStoreV2()

    const mockDelete = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Error' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    const result = await store._deleteAccountingSettings(1)

    expect(mockDelete).toHaveBeenCalledWith(`${URL_ACCOUNTING_SETTINGS}/1`)
    expect(result).toBe(false)
  })
})
