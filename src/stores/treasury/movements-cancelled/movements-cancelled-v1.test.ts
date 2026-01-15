import { setActivePinia, createPinia } from 'pinia'
import { useMovementsCancelledStoreV1 } from '@/stores/treasury/movements-cancelled/movements-cancelled-v1'
import { executeApi } from '@/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
  })),
}))

jest.mock('@/composables', () => {
  const showAlertMock = jest.fn()
  const showCatchErrorMock = jest.fn((error: unknown) => {
    if (error instanceof Error) {
      return `Mensaje de error: ${error.message}`
    }
    return `Mensaje de error: ${String(error)}`
  })
  const getNameBlobMock = jest.fn(() => 'test.xlsx')
  const downloadBlobXlxxMock = jest.fn()
  const fileNameValidateMock = jest.fn((_: string, defaultName: string) => {
    return `${defaultName}_2025-10-03.xlsx`
  })

  return {
    useAlert: jest.fn(() => ({ showAlert: showAlertMock })),
    useShowError: jest.fn(() => ({ showCatchError: showCatchErrorMock })),
    useUtils: jest.fn(() => ({
      getNameBlob: getNameBlobMock,
      downloadBlobXlxx: downloadBlobXlxxMock,
      fileNameValidate: fileNameValidateMock,
    })),
    showAlertMock,
    showCatchErrorMock,
    getNameBlobMock,
    downloadBlobXlxxMock,
    fileNameValidateMock,
  }
})

describe('useMovementsCancelledV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('fetches list and updates state when successful', async () => {
    const store = useMovementsCancelledStoreV1()
    const { showAlertMock } = require('@/composables')

    const mockResponse = {
      data: {
        success: true,
        message: 'OK',
        data: {
          data: [{ id: 1 }],
          current_page: 1,
          last_page: 2,
          total: 10,
        },
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._listMovementsCancelled('&filter=test')

    expect(store.movements_cancelled_list).toEqual([{ id: 1 }])
    expect(store.movements_cancelled_pages.currentPage).toBe(1)
    expect(showAlertMock).toHaveBeenCalledWith(
      'OK',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('handles error in _listMovementsCancelled', async () => {
    const store = useMovementsCancelledStoreV1()
    const { showAlertMock, showCatchErrorMock } = require('@/composables')

    const mockError = new Error('Error en API')
    const mockGet = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._listMovementsCancelled('&filter=test')

    expect(showCatchErrorMock).toHaveBeenCalledWith(mockError)
    expect(showAlertMock).toHaveBeenCalledWith(
      'Mensaje de error: Error en API',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('downloads excel successfully', async () => {
    const store = useMovementsCancelledStoreV1()
    const {
      fileNameValidateMock,
      downloadBlobXlxxMock,
    } = require('@/composables')

    const mockBlob = new Blob(['test'], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    const mockGet = jest.fn().mockResolvedValue({
      data: mockBlob,
      headers: {
        'content-type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._downloadExcelMovementsCancelled({
      business_from: '1',
      business_to: '2',
      period_from: '2025-01-01',
      period_to: '2025-01-31',
    })

    expect(fileNameValidateMock).toHaveBeenCalledWith(
      '',
      'Movimientos_de_tesorería_anulados'
    )
    expect(downloadBlobXlxxMock).toHaveBeenCalledWith(
      mockBlob,
      'Movimientos_de_tesorería_anulados_2025-10-03.xlsx'
    )
  })

  it('handles backend error (success=false) in _listMovementsCancelled', async () => {
    const store = useMovementsCancelledStoreV1()
    const { showAlertMock } = require('@/composables')

    const mockResponse = {
      data: {
        success: false,
        message: 'Error cargando movimientos',
        data: { data: [], current_page: 1, last_page: 1, total: 0 },
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._listMovementsCancelled('&filter=test')

    expect(store.movements_cancelled_list).toEqual([])
    expect(showAlertMock).toHaveBeenCalledWith(
      'Error cargando movimientos',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('handles error in _downloadExcelMovementsCancelled', async () => {
    const store = useMovementsCancelledStoreV1()
    const { showAlertMock, showCatchErrorMock } = require('@/composables')

    const mockError = new Error('Descarga fallida')
    const mockGet = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._downloadExcelMovementsCancelled({
      business_from: '1',
      business_to: '2',
      period_from: '2025-01-01',
      period_to: '2025-01-31',
    })

    expect(showCatchErrorMock).toHaveBeenCalledWith(mockError)
    expect(showAlertMock).toHaveBeenCalledWith(
      'Mensaje de error: Descarga fallida',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('fetches a cancelled movement by id successfully', async () => {
    const store = useMovementsCancelledStoreV1()

    const mockResponse = {
      data: {
        success: true,
        message: 'OK',
        data: { id: 99, invoice_number: 'INV-001' },
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._showCancelledMovementById(99)

    expect(result).toEqual({ id: 99, invoice_number: 'INV-001' })
  })

  it('handles backend error (success=false) in _showCancelledMovementById', async () => {
    const store = useMovementsCancelledStoreV1()
    const { showAlertMock } = require('@/composables')

    const mockResponse = {
      data: {
        success: false,
        message: 'No encontrado',
        data: null,
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._showCancelledMovementById(123)

    expect(result).toBeNull()
    expect(showAlertMock).toHaveBeenCalledWith(
      'No encontrado',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('handles error in _showCancelledMovementById', async () => {
    const store = useMovementsCancelledStoreV1()
    const { showAlertMock, showCatchErrorMock } = require('@/composables')

    const mockError = new Error('API rota')
    const mockGet = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._showCancelledMovementById(50)

    expect(result).toBeNull()
    expect(showCatchErrorMock).toHaveBeenCalledWith(mockError)
    expect(showAlertMock).toHaveBeenCalledWith(
      'Mensaje de error: API rota',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })
})
