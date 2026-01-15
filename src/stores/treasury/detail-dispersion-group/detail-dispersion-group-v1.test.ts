import { useDetailDispersionGroupStoreV1 } from './detail-dispersion-group-v1'
import { URL_PATH_TREASURIES } from '@/constants/apis'
import { setActivePinia, createPinia } from 'pinia'
import { executeApi } from '@/apis'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
  })),
}))

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useShowError: jest.fn(() => ({ showCatchError: jest.fn(() => 'Error') })),
}))

describe('useDetailDispersionGroupStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('fetches detail list and updates state on success', async () => {
    const store = useDetailDispersionGroupStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'Success',
        data: [{ business: 'Negocio 1' }],
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._listDetailAction('page=2')

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/generate-dispersion-group/list-detail?page=2`
    )
    expect(store.dispersion_detail_list.length).toBe(1)
  })

  it('fetches breakdown list and updates state on success', async () => {
    const store = useDetailDispersionGroupStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'Breakdown loaded',
        data: [{ id: 1 }],
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._listBreakdownAction('page=1')

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/generate-dispersion-group/list-breakdown?page=1`
    )
    expect(store.dispersion_breakdown_list.length).toBe(1)
  })

  it('gets detail by ID on success', async () => {
    const store = useDetailDispersionGroupStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'Found',
        data: { id: 1, bank: 'Bancolombia' },
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._showAction(10)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/generate-dispersion-group/detail/10`
    )
    expect(result).toEqual(mockResponse.data.data)
  })

  it('returns null and shows alert on detail fetch failure', async () => {
    const store = useDetailDispersionGroupStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._showAction(99)

    expect(mockGet).toHaveBeenCalled()
    expect(result).toBe(null)
  })

  it('creates dispersion group and returns success true', async () => {
    const store = useDetailDispersionGroupStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'Creado',
      },
    }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload = [
      {
        id: 1,
        ids: null,
        value: '1000.00',
        gmf: '0.00',
        record_expense_id: 1,
        method_payment_id: 1,
        bank_id: 1,
        bank_account_id: 1,
        authorized_document_type_id: 1,
        beneficiary_bank_account: 1,
        beneficiary_bank_id: 1,
        nit_third_party_id: 1,
        group: false,
      },
    ]
    const result = await store._createAction(payload)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/generate-dispersion-group`,
      payload
    )
    expect(result).toBe(true)
  })

  it('returns false on createAction error', async () => {
    const store = useDetailDispersionGroupStoreV1()
    const mockPost = jest.fn().mockRejectedValue(new Error('Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAction([])

    expect(result).toBe(false)
  })
})
