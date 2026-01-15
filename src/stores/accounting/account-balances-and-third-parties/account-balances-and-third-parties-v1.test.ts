import { useAccountBalancesAndThirdPartiesStoreV1 } from './account-balances-and-third-parties-v1'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'
import { setActivePinia, createPinia } from 'pinia'
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
    getNameBlob: jest.fn(() => 'archivo.xlsx'),
    downloadBlobXlxx: jest.fn(),
  })),
}))

describe('useAccountBalancesAndThirdPartiesStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('fetches account balances successfully', async () => {
    const store = useAccountBalancesAndThirdPartiesStoreV1()

    const mockData = {
      data: {
        success: true,
        message: 'Cargado correctamente',
        data: {
          data: [
            { id: 1, account_name: 'Cuenta 1' },
            { id: 2, account_name: 'Cuenta 2' },
          ],
          current_page: 1,
          last_page: 1,
        },
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockData)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._listAction({ param: 'test' })

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/balances/get-balances`,
      { params: { param: 'test', paginate: 1 } }
    )
    expect(store.account_balances_list.length).toBe(2)
    expect(store.account_balances_pages).toEqual({
      currentPage: 1,
      lastPage: 1,
    })
  })

  it('handles error when fetching account balances', async () => {
    const store = useAccountBalancesAndThirdPartiesStoreV1()

    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._listAction({ param: 'test' })

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/balances/get-balances`,
      { params: { param: 'test', paginate: 1 } }
    )
    expect(store.account_balances_list).toEqual([])
  })

  it('fetches single account balance successfully', async () => {
    const store = useAccountBalancesAndThirdPartiesStoreV1()

    const mockData = {
      data: {
        success: true,
        data: { id: 123, name: 'Balance A' },
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockData)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getBalanceAction(123)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/balances/get-account-structure/123`
    )
    expect(result).toEqual({ id: 123, name: 'Balance A' })
  })

  it('handles API error when fetching single account balance', async () => {
    const store = useAccountBalancesAndThirdPartiesStoreV1()

    const mockData = {
      data: {
        success: false,
        message: 'No se pudo obtener el balance',
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockData)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getBalanceAction(123)

    expect(result).toBeNull()
    expect(mockGet).toHaveBeenCalled()
  })

  it('exports Excel file successfully', async () => {
    const store = useAccountBalancesAndThirdPartiesStoreV1()

    const mockResponse = {
      data: new Blob(['ExcelContent'], { type: 'application/vnd.ms-excel' }),
      headers: {
        'content-type': 'application/vnd.ms-excel',
        'content-disposition': 'attachment; filename=archivo.xlsx',
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._exportExcelAction('param=test')

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/balances/export?param=test`,
      { responseType: 'blob' }
    )
  })

  it('handles error when exporting Excel file', async () => {
    const store = useAccountBalancesAndThirdPartiesStoreV1()

    const mockGet = jest.fn().mockRejectedValue(new Error('Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._exportExcelAction('param=test')

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/balances/export?param=test`,
      { responseType: 'blob' }
    )
  })
})
