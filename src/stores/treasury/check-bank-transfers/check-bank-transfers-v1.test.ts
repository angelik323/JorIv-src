import { setActivePinia, createPinia } from 'pinia'
import { useCheckBankTransfers } from './check-bank-transfers-v1'
import { executeApi } from '@/apis'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
  })),
}))

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useShowError: jest.fn(() => ({ showCatchError: jest.fn(() => 'Error') })),
  useUtils: jest.fn(() => ({
    getNameBlob: jest.fn(() => 'file.xlsx'),
    downloadBlobXlxx: jest.fn(),
  })),
}))

describe('useCheckBankTransfers', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('fetches check bank transfers successfully', async () => {
    const store = useCheckBankTransfers()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: {
          data: [{ id: 1 }],
          current_page: 2,
          last_page: 3,
          per_page: 20,
        },
        message: 'Success',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getCheckBankTransfers({ page: 2 })
    expect(mockGet).toHaveBeenCalledWith(
      'treasuries/api/treasuries/bank-transfers',
      { params: { page: 2, paginate: 1 } }
    )
    expect(store.checkBankTransfersList).toEqual([{ id: 1 }])
    expect(store.checkBankTransfersPages).toEqual({
      currentPage: 2,
      lastPage: 3,
    })
    expect(store.perPage).toBe(20)
  })

  it('handles unsuccessful response in _getCheckBankTransfers', async () => {
    const store = useCheckBankTransfers()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: false,
        data: {},
        message: 'Error',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getCheckBankTransfers({})
    expect(store.checkBankTransfersList).toEqual([])
    expect(store.checkBankTransfersPages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
  })

  it('handles error in _getCheckBankTransfers', async () => {
    const store = useCheckBankTransfers()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getCheckBankTransfers({})
    expect(store.checkBankTransfersList).toEqual([])
    expect(store.checkBankTransfersPages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
  })

  it('exports check bank transfers successfully', async () => {
    const store = useCheckBankTransfers()
    const mockGet = jest.fn().mockResolvedValue({
      data: new Uint8Array([1, 2, 3]),
      headers: { 'content-type': 'application/vnd.ms-excel' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._exportCheckBankTransfers('filter[id]=5')
    expect(mockGet).toHaveBeenCalled()
  })

  it('handles error in _exportCheckBankTransfers', async () => {
    const store = useCheckBankTransfers()
    const mockGet = jest.fn().mockRejectedValue(new Error('Export Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._exportCheckBankTransfers('filter[id]=5')
    expect(mockGet).toHaveBeenCalled()
  })
})
