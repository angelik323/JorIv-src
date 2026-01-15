import { setActivePinia, createPinia } from 'pinia'
import { useBalancesOnlineStoreV1 } from '@/stores/treasury/balances-online/balances-online-v1'
import { executeApi } from '@/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { IBalancesOnlineList } from '@/interfaces/customs'

const mockShowAlert = jest.fn()
const mockShowCatchError = jest.fn(() => {
  mockShowAlert('Error', 'error', undefined, TIMEOUT_ALERT)
})
const mockGetNameBlob = jest.fn(() => 'test-file.pdf')
const mockDownloadBlobXlxx = jest.fn()

jest.mock('quasar', () => ({
  Notify: {
    create: jest.fn(),
  },
}))

jest.mock(
  '@/apis',
  () => ({
    executeApi: jest.fn(() => ({
      get: jest.fn(),
    })),
  }),
  { virtual: true }
)

jest.mock('@/composables/useAlert', () => ({
  useAlert: () => ({
    showAlert: mockShowAlert,
  }),
}))

jest.mock('@/composables/useShowError', () => ({
  useShowError: () => ({
    showCatchError: mockShowCatchError,
  }),
}))

jest.mock('@/composables', () => ({
  useUtils: () => ({
    getNameBlob: mockGetNameBlob,
    downloadBlobXlxx: mockDownloadBlobXlxx,
    fileNameValidate: jest.fn((fileName) => fileName)
  }),
  __esModule: true,
}))

describe('useBalancesOnlineStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()

  global.URL.createObjectURL = jest.fn(() => 'blob:mocked-url')
  global.URL.revokeObjectURL = jest.fn()
  })

  const URL = 'treasuries/api/treasuries/bank-accounts'

  it('fetches balances online successfully', async () => {
    const store = useBalancesOnlineStoreV1()

    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Datos cargados',
        data: {
          data: [{ id: 1, business_code: '1000' }] as IBalancesOnlineList[],
          current_page: 2,
          last_page: 4,
        },
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getBalancesOnline('&bank=1')

    expect(mockGet).toHaveBeenCalledWith(`${URL}/balance?paginate=1&bank=1`)
    expect(store.data_balances_online_list).toHaveLength(1)
    expect(store.data_balances_online_pages.currentPage).toBe(2)
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Datos cargados',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('handles error when fetching balances online', async () => {
    const store = useBalancesOnlineStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getBalancesOnline('&bank=2')

    expect(mockGet).toHaveBeenCalled()
    expect(store.data_balances_online_list).toHaveLength(0)
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('downloads PDF successfully', async () => {
    const store = useBalancesOnlineStoreV1()

    const mockGet = jest.fn().mockResolvedValue({
      status: 200,
      data: 'fake-pdf-data',
      headers: {
        'content-type': 'application/pdf',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._downloadPdf('bank=1')

    expect(mockGet).toHaveBeenCalledWith(`${URL}/balance/export?bank=1`, {
      responseType: 'blob',
    })
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Descarga exitosa',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('handles error when downloading PDF', async () => {
    const store = useBalancesOnlineStoreV1()

    const mockGet = jest.fn().mockRejectedValue(new Error('Error PDF'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._downloadPdf('bank=1')

    expect(mockGet).toHaveBeenCalled()
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error PDF', 
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('clears data correctly', () => {
    const store = useBalancesOnlineStoreV1()

    store.data_balances_online_list = [
      { id: 1, business_code: '1000' } as IBalancesOnlineList,
    ]
    store.data_balances_online_pages = {
      currentPage: 5,
      lastPage: 10,
    }

    store._clearData()

    expect(store.data_balances_online_list).toHaveLength(0)
    expect(store.data_balances_online_pages.currentPage).toBe(0)
    expect(store.data_balances_online_pages.lastPage).toBe(0)
  })
})
