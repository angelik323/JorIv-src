import { setActivePinia, createPinia } from 'pinia'
import { executeApi } from '@/apis'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'
import { usePeriodClosureV2 } from './period-closure-v2'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
  })),
}))

jest.mock('@/composables', () => {
  const showAlertMock = jest.fn()
  const showCatchErrorMock = jest.fn()
  const downloadBlobXlxx = jest.fn()

  const useAlert = jest.fn(() => ({ showAlert: showAlertMock }))
  const useShowError = jest.fn(() => ({ showCatchError: showCatchErrorMock }))
  const useUtils = jest.fn(() => ({ downloadBlobXlxx }))

  return {
    useAlert,
    useShowError,
    useUtils,
    showAlertMock,
    showCatchErrorMock,
    downloadBlobXlxx,
  }
})

describe('usePeriodClosureV2', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('should fetch period closure list and update state on success', async () => {
    const store = usePeriodClosureV2()
    const mockResponse = {
      data: {
        success: true,
        message: 'Listado exitoso',
        data: {
          current_page: 1,
          last_page: 1,
          data: [{ id: 1, executed_at: '2025-06-01' }],
        },
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getPeriodClosureList('')

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/v2/business-trust-period-closure/list-with-filters?paginate=1`
    )
    expect(store.period_closure_list).toMatchObject([
      { id: 1, executed_at: '2025-06-01' },
    ])
    expect(store.period_closure_pages).toMatchObject({
      currentPage: 1,
      lastPage: 1,
    })
  })

  it('should handle failure when fetching period closure list', async () => {
    const store = usePeriodClosureV2()
    const mockResponse = {
      data: {
        success: false,
        message: 'Error al obtener listado',
        data: null,
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getPeriodClosureList('')

    expect(store.period_closure_list).toMatchObject([])
    expect(store.period_closure_pages).toMatchObject({
      currentPage: 0,
      lastPage: 0,
    })
  })

  it('should create a period closure successfully', async () => {
    const store = usePeriodClosureV2()
    const payload = {
      accounting_structure_id: 1,
      period: '2025-05-31',
      from_business_trust: '1',
      to_business_trust: '2',
    }

    const mockResponse = {
      data: { success: true, message: 'Cierre generado' },
    }

    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createPeriodClosure(payload)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/v2/business-trust-period-closure/execute-closure`,
      payload
    )
    expect(result).toMatchObject({ success: true })
  })

  it('should handle failure when creating a period closure', async () => {
    const store = usePeriodClosureV2()
    const payload = {
      accounting_structure_id: 1,
      period: '2025-05-31',
      from_business_trust: '1',
      to_business_trust: '2',
    }

    const mockResponse = {
      data: { success: false, message: 'Error al generar cierre' },
    }

    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createPeriodClosure(payload)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/v2/business-trust-period-closure/execute-closure`,
      payload
    )
    expect(result).toMatchObject({ success: false })
  })
})
