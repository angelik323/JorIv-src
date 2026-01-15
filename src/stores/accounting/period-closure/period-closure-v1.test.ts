import { setActivePinia, createPinia } from 'pinia'
import { usePeriodClosureV1 } from './period-closure-v1'
import { executeApi } from '@/apis'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'

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

describe('usePeriodClosureV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('should fetch period closure list and update state on success', async () => {
    const store = usePeriodClosureV1()
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
      `${URL_PATH_ACCOUNTING}/business-trust/period-closure?paginate=1`
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
    const store = usePeriodClosureV1()
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
    const store = usePeriodClosureV1()
    const payload = {
      executed_at: '2025-06-01',
      accounting_structure_id: 1,
      from_date: '2025-05-01',
      to_date: '2025-05-31',
      from_business_trust_id: 1,
      to_business_trust_id: 2,
    }

    const mockResponse = {
      data: { success: true, message: 'Cierre generado' },
    }

    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createPeriodClosure(payload)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/business-trust/generate-period-close`,
      payload
    )
    expect(result).toMatchObject({ success: true })
  })

  it('should handle failure when creating a period closure', async () => {
    const store = usePeriodClosureV1()
    const payload = {
      executed_at: '2025-06-01',
      accounting_structure_id: 1,
      from_date: '2025-05-01',
      to_date: '2025-05-31',
      from_business_trust_id: 1,
      to_business_trust_id: 2,
    }

    const mockResponse = {
      data: { success: false, message: 'Error al generar cierre' },
    }

    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createPeriodClosure(payload)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/business-trust/generate-period-close`,
      payload
    )
    expect(result).toMatchObject({ success: false })
  })

  it('should download period closure report', async () => {
    const store = usePeriodClosureV1()

    const mockBlob = new Blob(['data'], { type: 'application/vnd.ms-excel' })
    const mockHeaders = {
      'content-type': 'application/vnd.ms-excel',
      'content-disposition': 'attachment; filename="reporte_test.xlsx"',
    }

    const mockGet = jest.fn().mockResolvedValue({
      data: mockBlob,
      headers: mockHeaders,
    })

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const { downloadBlobXlxx } = require('@/composables')

    await store._downloadPeriodClosureReport()

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/report/export`,
      { responseType: 'blob' }
    )

    expect(downloadBlobXlxx).toHaveBeenCalledWith(mockBlob, 'reporte_test.xlsx')
  })
})
