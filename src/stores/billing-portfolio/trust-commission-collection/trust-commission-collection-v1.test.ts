import { setActivePinia, createPinia } from 'pinia'
import { useTrustCommissionCollectionStoreV1 } from './trust-commission-collection-v1'
import { executeApi } from '@/apis'
import { URL_PATH_BILLING } from '@/constants/apis'
import { IApplyCollection } from '@/interfaces/customs'

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

const mockList = [
  {
    id: 8,
    business_name: 'Pruebas QA fl 2',
    business_code: '2220002',
    init_date: '2025-09-23 14:27:43',
    expire_at: '2025-10-23',
    invoice_number: '0000000002',
    status_id: 21,
    total: '119000000.00',
    status: {
      id: 21,
      name: 'Parcialmente pagado',
      created_by: null,
    },
    third_party_billing: {
      id: '1',
      third_party_address: 'Some Address',
      third_party_document: '123456789',
      third_party_document_type: 'CC',
      third_party_email: 'test@example.com',
      third_party_id: '98765',
      third_party_name: 'Test Third Party',
    },
    type_invoice: 'support_document',
  },
]

const mockApplyCollectio = {
  invoices: [
    {
      id: 8,
      payment_number: '1',
      payment_amount: 1000,
      amount_credited: 1000,
      amount_pending: 118999000,
      type: 'support_document',
    },
  ],
}

describe('useTrustCommissionCollectionStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('should fetch list of trust commissions collection', async () => {
    const store = useTrustCommissionCollectionStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: {
          data: mockList,
          current_page: 1,
          last_page: 2,
        },
        message: 'List fetched',
      },
      status: 200,
    })
    const params = { page: 1 }

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getTrustCommissionCollectionList(params)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_BILLING}/collection-trust-commission`,
      {
        params: { ...params, paginate: 1 },
      }
    )
    expect(result.list).toEqual(mockList)
    expect(result.pages.currentPage).toBe(1)
    expect(result.pages.lastPage).toBe(2)
  })

  it('should handle error when fetching trust commissions collection', async () => {
    const store = useTrustCommissionCollectionStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('API Error'))
    const params = { page: 1 }

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getTrustCommissionCollectionList(params)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_BILLING}/collection-trust-commission`,
      {
        params: { ...params, paginate: 1 },
      }
    )
    expect(result.list).toEqual([])
  })

  it('should apply collection', async () => {
    const store = useTrustCommissionCollectionStoreV1()
    const formData: IApplyCollection = mockApplyCollectio

    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Rejection reason created' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._applyCollection(formData)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_BILLING}/collection-trust-commission/apply-collection`,
      formData
    )
    expect(result).toBe(true)
  })

  it('should return false if creation fails', async () => {
    const store = useTrustCommissionCollectionStoreV1()
    const formData: IApplyCollection = mockApplyCollectio

    const mockPost = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Error' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._applyCollection(formData)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_BILLING}/collection-trust-commission/apply-collection`,
      formData
    )
    expect(result).toBe(false)
  })

  it('should return false when API throws an error', async () => {
    const store = useTrustCommissionCollectionStoreV1()
    const formData: IApplyCollection = mockApplyCollectio

    const mockPost = jest.fn().mockRejectedValue(new Error('Network error'))

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._applyCollection(formData)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_BILLING}/collection-trust-commission/apply-collection`,
      formData
    )
    expect(result).toBe(false)
  })
})
