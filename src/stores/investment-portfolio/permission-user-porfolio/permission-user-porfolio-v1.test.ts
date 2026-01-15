import { setActivePinia, createPinia } from 'pinia'
import { usePermissionUserPorfolioStoreV1 } from '@/stores/investment-portfolio/permission-user-porfolio/permission-user-porfolio-v1'
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

describe('usePermissionUserPorfolioStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('should fetch permission list and update state on success', async () => {
    const store = usePermissionUserPorfolioStoreV1()

    const mockResponse = {
      data: {
        success: true,
        message: 'Listado cargado',
        data: {
          data: [{ id: 1 }],
          current_page: 2,
          last_page: 5,
        },
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getListAction('&filter[code]=ABC')

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/permission-user-portfolio/list?paginate=1&filter[code]=ABC`,
    )
    expect(store.permission_user_porfolio_list).toEqual([{ id: 1 }])
    expect(store.permission_user_porfolio_pages).toEqual({
      currentPage: 2,
      lastPage: 5,
    })
  })

  it('should fetch permission by ID and set data_information_form', async () => {
    const store = usePermissionUserPorfolioStoreV1()

    const mockData = { id: 101, user_name: 'Permission X' }
    const mockResponse = {
      data: {
        success: true,
        message: 'Encontrado',
        data: mockData,
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdPermissionUserPorfolio(101)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/permission-user-portfolio/show/101`,
    )
    expect(store.data_information_form).toEqual(mockData)
  })

  it('should update permission and return true on success', async () => {
    const store = usePermissionUserPorfolioStoreV1()

    const mockPut = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Actualizado' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updatePermissionUserPorfolio(
      { id: 2, user_name: 'Edit' },
      2,
    )

    expect(mockPut).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/permission-user-portfolio/update/2`,
      { id: 2, user_name: 'Edit' },
    )
    expect(result).toBe(true)
  })

  it('should create permission and return true on success', async () => {
    const store = usePermissionUserPorfolioStoreV1()

    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Creado' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createPermissionUserPorfolio({
      user_name: 'Nuevo',
    })

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/permission-user-portfolio/new/`,
      { user_name: 'Nuevo' },
    )
    expect(result).toBe(true)
  })

  it('should delete permission and return true on success', async () => {
    const store = usePermissionUserPorfolioStoreV1()

    const mockDelete = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Eliminado' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    const result = await store._deletePermissionUserPorfolio(8)

    expect(mockDelete).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/permission-user-portfolio/destroy/8`,
    )
    expect(result).toBe(true)
  })

  it('should set data_information_form correctly', () => {
    const store = usePermissionUserPorfolioStoreV1()
    const mockData = { id: 1, user_name: 'Example' }

    store._setDataInformationForm(mockData)
    expect(store.data_information_form).toEqual(mockData)
  })

  it('should clean list and pages', () => {
    const store = usePermissionUserPorfolioStoreV1()

    store.permission_user_porfolio_list = [
      {
        id: 1,
        investment_portfolio_code: '1',
        investment_portfolio_name: 'test',
        document: '1',
        user_name: 'user test',
      },
    ]
    store.permission_user_porfolio_pages = { currentPage: 2, lastPage: 10 }

    store._cleanData()

    expect(store.permission_user_porfolio_list).toEqual([])
    expect(store.permission_user_porfolio_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
  })
})
