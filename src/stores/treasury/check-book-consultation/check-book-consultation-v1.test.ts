import { setActivePinia, createPinia } from 'pinia'
import { useCheckbookQueryStorev1 } from './check-book-consultation-v1'
import { executeApi } from '@/apis'
import { ICheckbookQuery, ICheckbookHistory } from '@/interfaces/customs'
import { URL_PATH_TREASURIES } from '@/constants/apis'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
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

describe('useCheckbookQueryStorev1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  const checkbookPayload: ICheckbookQuery = {
    id: 1,
    checkbook: 'Cuenta Principal',
    check_number: '000123',
    check_date: '2025-07-28',
    beneficiary: 'Juan Pérez',
    value: 1500000,
    conciliation: 'CONC-001',
    status: 'IMPRESO',
  }

  const historyPayload: ICheckbookHistory = {
    id: 1,
    checkbook: 'Cuenta Principal',
    check_number: '000123',
    status: 'ANULADO',
    date: '2025-07-29',
    user: 'admin@empresa.com',
    annulment_reason: 'Cheque con error',
  }

  it('should fetch checkbook list successfully', async () => {
    const store = useCheckbookQueryStorev1()
    const mockResponse = {
      data: {
        success: true,
        message: 'Listado obtenido',
        data: {
          current_page: 1,
          last_page: 1,
          data: [checkbookPayload],
        },
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getListAction('')
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/check-book-inquiry?paginate=1`
    )

    expect(store.checkbook_query_list).toMatchObject([checkbookPayload])
    expect(store.checkbook_query_pages).toMatchObject({
      currentPage: 1,
      lastPage: 1,
    })
  })

  it('should handle failure when fetching checkbook list', async () => {
    const store = useCheckbookQueryStorev1()
    const mockResponse = {
      data: {
        success: false,
        message: 'Error al listar',
        data: null,
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getListAction('')
    expect(store.checkbook_query_list).toEqual([])
    expect(store.checkbook_query_pages).toMatchObject({
      currentPage: 0,
      lastPage: 0,
    })
  })

  it('should handle catch error on _getListAction', async () => {
    const store = useCheckbookQueryStorev1()
    const mockGet = jest.fn().mockRejectedValue(new Error('list error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getListAction()
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error catch',
      'error',
      undefined,
      3000
    )
  })

  it('should fetch checkbook history successfully', async () => {
    const store = useCheckbookQueryStorev1()
    const mockResponse = {
      data: {
        success: true,
        message: 'Historial obtenido',
        data: [historyPayload],
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getCheckbookHistory(1)
    expect(result).toMatchObject([historyPayload])
    expect(store.checkbook_history).toMatchObject([historyPayload])
  })

  it('should handle failure when fetching checkbook history', async () => {
    const store = useCheckbookQueryStorev1()
    const mockResponse = {
      data: {
        success: false,
        message: 'No encontrado',
        data: null,
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getCheckbookHistory(999)
    expect(result).toBeNull()
    expect(store.checkbook_history).toEqual([])
  })

  it('should handle catch error on _getCheckbookHistory', async () => {
    const store = useCheckbookQueryStorev1()
    const mockGet = jest.fn().mockRejectedValue(new Error('history error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getCheckbookHistory(1)
    expect(result).toBeNull()
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Error catch',
      'error',
      undefined,
      3000
    )
  })

  it('should select a checkbook query item', () => {
    const store = useCheckbookQueryStorev1()
    store._selectCheckbookQuery(checkbookPayload)
    expect(store.selected_checkbook_query).toMatchObject(checkbookPayload)
  })

  it('should clean checkbook list and pages', () => {
    const store = useCheckbookQueryStorev1()
    store.checkbook_query_list = [checkbookPayload]
    store.checkbook_query_pages = { currentPage: 2, lastPage: 3 }

    store._cleanList()

    expect(store.checkbook_query_list).toEqual([])
    expect(store.checkbook_query_pages).toMatchObject({
      currentPage: 0,
      lastPage: 0,
    })
  })
})
