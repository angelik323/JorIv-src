import { setActivePinia, createPinia } from 'pinia'
import { useThirdPartyBillingStoreV2 } from './third-party-billing-v2'
import { executeApi } from '@/apis'
import { URL_PATH_SETTLEMENT_COMMISSIONS } from '@/constants/apis'
import { IThirdPartyBillingFormV2 } from '@/interfaces/customs/settlement-commissions/ThirdPartyBillingV2'

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

const URL_PATH_THIRD_PARTY_BILLING = `${URL_PATH_SETTLEMENT_COMMISSIONS}/thirdparty-billing`

const mockThirdPartyBillingResponse = {
  id: 20,
  third_party_id: 3367,
  created_date: '2025-11-05',
  third_party_document_type_id: 8,
  third_party_document: '1088348388',
  third_party_name: 'Cesar Dev Trujillo Dev',
  third_party_email: 'cesar.trujillo@linktic.com',
  third_party_address: 'MZ 34',
  snapshotted_at: '2025-11-05T19:22:19.603061Z',
  created_by: 14257,
  updated_by: 14257,
  comission_settlement_statuses_id: 1,
  created_at: '2025-11-05T15:24:34.000000Z',
  updated_at: '2025-11-05T19:22:19.000000Z',
  third_party_document_type: 'Cédula de ciudadanía',
  business_code_snapshot: '3496945',
  business_name_snapshot: 'Quia cumque id animi et dolorum reiciendis.',
  third_party_phone: null,
  address: [
    {
      id: 317,
      third_party_id: 3367,
      address_type: 'residencial',
      address: 'MZ 34',
      postal_code: '000000',
      is_main: true,
      created_at: '06-10-2025 21:10',
      updated_at: '06-10-2025 21:10',
      country_id: 41,
      department_id: 20,
      city_id: 833,
      country: {
        id: 41,
        name: 'Colombia',
        code: '57',
        status_id: 1,
        nationality: 'Colombiano',
        code_iso3: null,
      },
      department: {
        id: 20,
        name: 'RISARALDA',
        code: '66',
        country_id: 41,
      },
      city: {
        id: 833,
        name: 'PEREIRA',
        code: '66001',
        department_id: 20,
      },
      phone: '(+57)305 400 2886',
    },
  ],
  email: [
    {
      id: 754,
      email_address: 'cesar.trujillo@linktic.com',
      is_main: true,
    },
  ],
  phones: [
    {
      id: 755,
      phone_type: 'mobile',
      phone_number: '(+57)305 400 2886',
      is_main: true,
    },
  ],
  comission_settlement_statuses: {
    id: 1,
    name: 'Activo',
    created_by: null,
    created_at: '2025-08-21T02:25:12.000000Z',
    updated_at: '2025-08-21T02:25:12.000000Z',
  },
}

const mockThirdPartyBillingList = [
  {
    id: 20,
    third_party_id: 3367,
    created_date: '2025-11-05',
    third_party_email: 'cesar.trujillo@linktic.com',
    third_party_address: 'MZ 34',
    snapshotted_at: '2025-11-05',
    created_by: 14257,
    updated_by: 14257,
    comission_settlement_statuses_id: 1,
    third_party_document_type_id: 8,
    third_party_document_type: 'Cédula de ciudadanía',
    third_party_document: '1088348388',
    third_party_name: 'Cesar Dev Trujillo Dev',
    business_code_snapshot: '3496945',
    business_name_snapshot: 'Quia cumque id animi et dolorum reiciendis.',
    comission_settlement_statuses: {
      id: 1,
      name: 'Activo',
      created_by: null,
      created_at: '2025-08-21T02:25:12.000000Z',
      updated_at: '2025-08-21T02:25:12.000000Z',
    },
  },
]

const mockThirdPartyBillingForm: IThirdPartyBillingFormV2 = {
  third_party_id: 3336,
  business_code_snapshot: '178',
  created_date: '2025-08-28',
  emails: [
    {
      id: 10,
      email_address: 'correo@ejemplo.com',
      is_main: true,
    },
  ],
  phones: [
    {
      id: 5,
      phone_type: 'mobile',
      phone_number: '3001234567',
      is_main: true,
    },
  ],
  addresses: [
    {
      id: 2,
      country_id: 1,
      department_id: 5,
      city_id: 10,
      address_type: 'residencial',
      address: 'Calle 123 #45-67',
      postal_code: '110111',
      is_main: true,
    },
  ],
}

describe('useThirdPartyBillingStoreV2', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('should fetch list of third party billings', async () => {
    const store = useThirdPartyBillingStoreV2()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: {
          data: mockThirdPartyBillingList,
          current_page: 1,
          last_page: 2,
        },
        message: 'List fetched',
      },
      status: 200,
    })
    const params = { page: 1 }

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getThirdPartyBillingList(params)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH_THIRD_PARTY_BILLING}`, {
      params: { ...params, paginate: 1 },
    })
    expect(store.third_party_billing_list).toEqual(mockThirdPartyBillingList)
    expect(store.third_party_billing_pages).toEqual({
      currentPage: 1,
      lastPage: 2,
    })
  })

  it('should handle error when fetching third party billings', async () => {
    const store = useThirdPartyBillingStoreV2()
    const mockGet = jest.fn().mockRejectedValue(new Error('API Error'))
    const params = { page: 1 }

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getThirdPartyBillingList(params)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH_THIRD_PARTY_BILLING}`, {
      params: { ...params, paginate: 1 },
    })
    expect(store.third_party_billing_list).toEqual([])
  })

  it('should create a new third party billing', async () => {
    const store = useThirdPartyBillingStoreV2()
    const formData = mockThirdPartyBillingForm

    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Rejection reason created' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createThirdPartyBilling(formData)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_THIRD_PARTY_BILLING}`,
      formData
    )
    expect(result).toBe(true)
  })

  it('should return false if creation fails', async () => {
    const store = useThirdPartyBillingStoreV2()
    const formData = mockThirdPartyBillingForm

    const mockPost = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Error' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createThirdPartyBilling(formData)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_THIRD_PARTY_BILLING}`,
      formData
    )
    expect(result).toBe(false)
  })

  it('should fetch third party billing by ID', async () => {
    const store = useThirdPartyBillingStoreV2()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: mockThirdPartyBillingResponse,
        message: 'Found',
      },
      status: 200,
    })

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const response = await store._getByIdThirdPartyBilling(1)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH_THIRD_PARTY_BILLING}/1`)
    expect(response).toEqual(mockThirdPartyBillingResponse)
  })

  it('should handle error when fetching third party billing by ID', async () => {
    const store = useThirdPartyBillingStoreV2()
    const mockGet = jest.fn().mockRejectedValue(new Error('API Error'))

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const response = await store._getByIdThirdPartyBilling(1)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH_THIRD_PARTY_BILLING}/1`)
    expect(response).toBeNull()
  })

  it('should update a third party billing', async () => {
    const store = useThirdPartyBillingStoreV2()
    const form = mockThirdPartyBillingForm

    const mockPut = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Updated' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateThirdPartyBilling(form, 1)

    expect(mockPut).toHaveBeenCalledWith(
      `${URL_PATH_THIRD_PARTY_BILLING}/1`,
      form
    )
    expect(result).toBe(true)
  })

  it('should return false if update fails', async () => {
    const store = useThirdPartyBillingStoreV2()
    const form = mockThirdPartyBillingForm
    const mockPut = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Error' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateThirdPartyBilling(form, 1)

    expect(result).toBe(false)
  })
})
