import { setActivePinia, createPinia } from 'pinia'
import { useIsinesCodesStoreV1 } from './isines-codes-v1'
import { executeApi } from '@/apis'
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    put: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  })),
}))

jest.mock('@/composables', () => {
  const showAlertMock = jest.fn()
  const showCatchErrorMock = jest.fn()

  return {
    useAlert: jest.fn(() => ({ showAlert: showAlertMock })),
    useShowError: jest.fn(() => ({ showCatchError: showCatchErrorMock })),
    showAlertMock,
    showCatchErrorMock,
  }
})

describe('useIsinesCodesStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('should fetch isines codes list and update state on success', async () => {
    const store = useIsinesCodesStoreV1()

    const mockResponse = {
      data: {
        success: true,
        message: 'Lista cargada',
        data: {
          data: [{ id: 1 }],
          current_page: 1,
          last_page: 3,
        },
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getListAction('&filter[isin_code]=ABC', 1)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/isin-code/list?paginate=1&filter[isin_code]=ABC`
    )
    expect(store.isines_codes_list).toEqual([{ id: 1 }])
    expect(store.isines_codes_pages).toEqual({ currentPage: 1, lastPage: 3 })
  })

  it('should fetch ISIN by ID and set data_information_form', async () => {
    const store = useIsinesCodesStoreV1()
    const mockData = { id: 99 }

    const mockResponse = {
      data: {
        success: true,
        message: 'ISIN encontrado',
        data: mockData,
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdIsinesCodes(99)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/isin-code/show/99`
    )
    expect(store.data_information_form).toEqual(mockData)
  })

  it('should update ISIN and return true on success', async () => {
    const store = useIsinesCodesStoreV1()
    const mockResponse = {
      data: { success: true, message: 'Actualizado' },
    }

    const mockPut = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateIsinesCodes({ isin_code: 'XYZ' }, 1)


    expect(mockPut).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/isin-code/update/1`,
      { isin_code: 'XYZ' }
    )
    expect(result).toBe(true)
  })

  it('should create ISIN and return true on success', async () => {
    const store = useIsinesCodesStoreV1()
    const mockResponse = {
      data: { success: true, message: 'Creado' },
    }

    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createIsinesCodes({ isin_code: 'NEW' })

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/isin-code/new/`,
      { isin_code: 'NEW' }
    )
    expect(result).toBe(true)
  })

  it('should delete ISIN and return true on success', async () => {
    const store = useIsinesCodesStoreV1()
    const mockResponse = {
      data: { success: true, message: 'Eliminado' },
    }

    const mockDelete = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    const result = await store._deleteIsinesCodes(5)

    expect(mockDelete).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/isin-code/destroy/5`
    )
    expect(result).toBe(true)
  })

  it('should set data_information_form correctly', () => {
    const store = useIsinesCodesStoreV1()
    const data = { isin_code: 'AAA' }
    store._setDataInformationForm(data)

    expect(store.data_information_form).toEqual(data)
  })

  it('should clean data', () => {
    const store = useIsinesCodesStoreV1()
    store.isines_codes_list = [{ id: 1 }]
    store.isines_codes_pages = { currentPage: 2, lastPage: 4 }

    store._cleanData()

    expect(store.isines_codes_list).toEqual([])
    expect(store.isines_codes_pages).toEqual({ currentPage: 0, lastPage: 0 })
  })
})
