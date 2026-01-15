import { setActivePinia, createPinia } from 'pinia'
import { executeApi } from '@/apis'
import { useCheckBalanceCostCenterStoreV1 } from './check-balance-cost-center-v1'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
  })),
}))

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useShowError: jest.fn(() => ({ showCatchError: jest.fn(() => 'Error') })),
  useUtils: jest.fn(() => ({
    getNameBlob: jest.fn(() => 'archivo.xlsx'),
    downloadBlobXlxx: jest.fn(),
  })),
}))

describe('useCheckBalanceCostCenterStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('fetches check balance cost center successfully', async () => {
    const store = useCheckBalanceCostCenterStoreV1()
    const mockResponse = {
      data: {
        data: {
          data: [{ id: 1 }],
          current_page: 2,
          last_page: 5,
        },
        message: 'OK',
        success: true,
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getCheckBalanceCostCenter('page=2')

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/check-balance-cost-center?paginate=1page=2`
    )
    expect(store.check_balance_cost_center).toEqual([{ id: 1 }])
    expect(store.check_balance_cost_center_pages).toEqual({
      currentPage: 2,
      lastPage: 5,
    })
  })

  it('handles error in _getCheckBalanceCostCenter', async () => {
    const store = useCheckBalanceCostCenterStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getCheckBalanceCostCenter('')

    expect(mockGet).toHaveBeenCalled()
  })

  it('downloads template and calls utils to save blob', async () => {
    const store = useCheckBalanceCostCenterStoreV1()
    const mockResponse = {
      data: 'blobdata',
      headers: {
        'content-type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._downloadTemplate('params-string')

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/check-balance-cost-center/export?params-string`,
      { responseType: 'blob' }
    )
  })

  it('handles error in _downloadTemplate', async () => {
    const store = useCheckBalanceCostCenterStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._downloadTemplate('x')

    expect(mockGet).toHaveBeenCalled()
  })
})
