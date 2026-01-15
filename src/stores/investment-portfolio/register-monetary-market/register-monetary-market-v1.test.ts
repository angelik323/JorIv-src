import { setActivePinia, createPinia } from 'pinia'
import { useMonetaryMarketOperationsStoreV1 } from './register-monetary-market-v1'
import { executeApi } from '@/apis'
import {
  IRegisterMonetaryMarketPayload,
  ITitleExtraInfo,
  IMonetaryMarketOperation,
  IUpdateMoneyMarketPayload,
  IMonetaryMarketOperationListItem,
} from '@/interfaces/customs'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
  })),
}))

let mockShowAlert: jest.Mock
let mockShowCatchError: jest.Mock

jest.mock('@/composables', () => {
  mockShowAlert = jest.fn()
  mockShowCatchError = jest.fn().mockReturnValue('Error catch')
  return {
    useAlert: () => ({ showAlert: mockShowAlert }),
    useShowError: () => ({ showCatchError: mockShowCatchError }),
  }
})

describe('useMonetaryMarketOperationsStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  const payload = {} as IRegisterMonetaryMarketPayload
  const updatePayload = {} as IUpdateMoneyMarketPayload

  it('should get list successfully', async () => {
    const store = useMonetaryMarketOperationsStoreV1()
    const mockResponse = {
      data: {
        success: true,
        data: [{ id: 1 }],
        current_page: 1,
        last_page: 2,
        total: 10,
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getListAction('page=1')
    expect(store.operations_list).toEqual(mockResponse.data.data)
    expect(store.operations_pages.total).toBe(10)
  })

  it('should handle failure in getListAction', async () => {
    const store = useMonetaryMarketOperationsStoreV1()
    const mockResponse = { data: { success: false, message: 'Error list' } }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getListAction('page=2')
    expect(mockShowAlert).toHaveBeenCalledWith('Error list', 'error')
  })

  it('should handle catch error in getListAction', async () => {
    const store = useMonetaryMarketOperationsStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getListAction('page=3')
    expect(mockShowAlert).toHaveBeenCalledWith('Error catch', 'error')
  })

  it('should clean operations data', () => {
    const store = useMonetaryMarketOperationsStoreV1()
    store.operations_list = [{ id: 1 } as IMonetaryMarketOperationListItem]
    store.operations_pages = { currentPage: 1, lastPage: 2, total: 10 }

    store._cleanOperationsData()
    expect(store.operations_list).toEqual([])
    expect(store.operations_pages.total).toBe(0)
  })

  it('should update operation successfully', async () => {
    const store = useMonetaryMarketOperationsStoreV1()
    const mockResponse = { data: { success: true, message: 'Updated ok' } }
    const mockPut = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateAction(1, updatePayload)
    expect(result).toBe(true)
  })

  it('should handle failed updateAction', async () => {
    const store = useMonetaryMarketOperationsStoreV1()
    const mockResponse = { data: { success: false, message: 'Update fail' } }
    const mockPut = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateAction(5, updatePayload)
    expect(result).toBe(false)
  })

  it('should handle catch error in updateAction', async () => {
    const store = useMonetaryMarketOperationsStoreV1()
    const mockPut = jest.fn().mockRejectedValue(new Error('crash'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateAction(8, updatePayload)
    expect(result).toBe(false)
  })

  it('should create TTV operation successfully', async () => {
    const store = useMonetaryMarketOperationsStoreV1()
    const mockResponse = { data: { success: true, message: 'TTV creada' } }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createTtvOperation(payload)
    expect(result).toBe(true)
  })

  it('should fail to create TTV operation', async () => {
    const store = useMonetaryMarketOperationsStoreV1()
    const mockResponse = { data: { success: false, message: 'Error TTV' } }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createTtvOperation(payload)
    expect(result).toBe(false)
  })

  it('should handle catch error on _createTtvOperation', async () => {
    const store = useMonetaryMarketOperationsStoreV1()
    const mockPost = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createTtvOperation(payload)
    expect(result).toBe(false)
  })

  it('should create Repo operation successfully', async () => {
    const store = useMonetaryMarketOperationsStoreV1()
    const mockResponse = { data: { success: true, message: 'Repo creada' } }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createRepoOperation(payload)
    expect(result).toBe(true)
  })

  it('should fail to create Repo operation', async () => {
    const store = useMonetaryMarketOperationsStoreV1()
    const mockResponse = { data: { success: false, message: 'Error Repo' } }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createRepoOperation(payload)
    expect(result).toBe(false)
  })

  it('should handle catch error on _createRepoOperation', async () => {
    const store = useMonetaryMarketOperationsStoreV1()
    const mockPost = jest.fn().mockRejectedValue(new Error('Repo fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createRepoOperation(payload)
    expect(result).toBe(false)
  })

  it('should create Simultaneous operation successfully', async () => {
    const store = useMonetaryMarketOperationsStoreV1()
    const mockResponse = { data: { success: true, message: 'Sim creada' } }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createSimultaneousOperation(payload)
    expect(result).toBe(true)
  })

  it('should fail to create Simultaneous operation', async () => {
    const store = useMonetaryMarketOperationsStoreV1()
    const mockResponse = { data: { success: false, message: 'Error Sim' } }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createSimultaneousOperation(payload)
    expect(result).toBe(false)
  })

  it('should handle catch error on _createSimultaneousOperation', async () => {
    const store = useMonetaryMarketOperationsStoreV1()
    const mockPost = jest.fn().mockRejectedValue(new Error('Sim fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createSimultaneousOperation(payload)
    expect(result).toBe(false)
  })

  it('should get TTV operation successfully', async () => {
    const store = useMonetaryMarketOperationsStoreV1()
    const mockResponse = {
      data: { success: true, message: 'ok', data: { id: 1 } },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getTtvOperation(1)
    expect(result).toEqual(mockResponse.data)
  })

  it('should handle failure in getTtvOperation', async () => {
    const store = useMonetaryMarketOperationsStoreV1()
    const mockResponse = { data: { success: false, message: 'fail' } }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getTtvOperation(2)
    expect(result).toBeNull()
  })

  it('should handle catch error in getTtvOperation', async () => {
    const store = useMonetaryMarketOperationsStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getTtvOperation(3)
    expect(result).toBeNull()
  })

  it('should get Repo operation successfully', async () => {
    const store = useMonetaryMarketOperationsStoreV1()
    const mockResponse = {
      data: { success: true, message: 'ok', data: { id: 1 } },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getRepoOperation(1)
    expect(result).toEqual(mockResponse.data)
  })

  it('should handle failure in getRepoOperation', async () => {
    const store = useMonetaryMarketOperationsStoreV1()
    const mockResponse = { data: { success: false, message: 'fail' } }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getRepoOperation(2)
    expect(result).toBeNull()
  })

  it('should handle catch error in getRepoOperation', async () => {
    const store = useMonetaryMarketOperationsStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getRepoOperation(3)
    expect(result).toBeNull()
  })

  it('should get Simultaneous operation successfully', async () => {
    const store = useMonetaryMarketOperationsStoreV1()
    const mockResponse = {
      data: { success: true, message: 'ok', data: { id: 1 } },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getSimultaneousOperation(1)
    expect(result).toEqual(mockResponse.data)
  })

  it('should handle failure in getSimultaneousOperation', async () => {
    const store = useMonetaryMarketOperationsStoreV1()
    const mockResponse = { data: { success: false, message: 'fail' } }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getSimultaneousOperation(2)
    expect(result).toBeNull()
  })

  it('should handle catch error in getSimultaneousOperation', async () => {
    const store = useMonetaryMarketOperationsStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getSimultaneousOperation(3)
    expect(result).toBeNull()
  })

  it('should select operation correctly', () => {
    const store = useMonetaryMarketOperationsStoreV1()
    const operation = { id: 1 } as IMonetaryMarketOperation
    store._selectOperation(operation)
    expect(store.selected_operation).toEqual(operation)
  })

  it('should get titles by issuer successfully', async () => {
    const store = useMonetaryMarketOperationsStoreV1()
    const mockTitles: ITitleExtraInfo[] = [
      {
        id: 1,
        issuers_counterparty_id: 10,
        balance: 500,
        status_id: 1,
        unit_value: 100,
        purchase_value: 200,
        isin_code_id: 99,
        tir: 5,
        paper_type_id: 3,
        deposit_issuer_id: 8,
        currency_code: 'COP',
      },
    ]
    const mockResponse = { data: { success: true, data: mockTitles } }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getTitlesByIssuer(99)
    expect(result).toEqual(mockTitles)
  })

  it('should handle failure in getTitlesByIssuer', async () => {
    const store = useMonetaryMarketOperationsStoreV1()
    const mockResponse = { data: { success: false, data: [] } }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getTitlesByIssuer(5)
    expect(result).toBeNull()
  })

  it('should handle catch error on getTitlesByIssuer', async () => {
    const store = useMonetaryMarketOperationsStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getTitlesByIssuer(7)
    expect(result).toBeNull()
  })
})
