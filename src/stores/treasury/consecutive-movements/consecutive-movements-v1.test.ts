import { setActivePinia, createPinia } from 'pinia'
import { useConsecutiveMovementsV1 } from './consecutive-movements-v1'
import { executeApi } from '@/apis'
import { URL_PATH_TREASURIES } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
  })),
}))

jest.mock('@/composables', () => {
  const showAlertMock = jest.fn()
  const showCatchErrorMock = jest.fn(
    (error) => `Mensaje de error: ${error.message}`
  )
  const getNameBlobMock = jest.fn(() => 'archivo.xlsx')
  const downloadBlobXlxxMock = jest.fn()

  const useAlert = jest.fn(() => ({ showAlert: showAlertMock }))
  const useShowError = jest.fn(() => ({ showCatchError: showCatchErrorMock }))
  const useUtils = jest.fn(() => ({
    getNameBlob: getNameBlobMock,
    downloadBlobXlxx: downloadBlobXlxxMock,
  }))

  return {
    useAlert,
    useShowError,
    useUtils,
    showAlertMock,
    showCatchErrorMock,
    getNameBlobMock,
    downloadBlobXlxxMock,
  }
})

describe('useConsecutiveMovementsV1', () => {
  const BASE_URL = `${URL_PATH_TREASURIES}/treasury-movement-consecutives`

  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('_getConsecutiveMovementList updates list and pages correctly', async () => {
    const store = useConsecutiveMovementsV1()
    const mockResponse = {
      data: {
        success: true,
        data: {
          data: [{ id: 1, code: 'MOV-001' }],
          current_page: 2,
          last_page: 4,
        },
        message: 'Listado cargado correctamente',
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getConsecutiveMovementList({ page: 2 })

    expect(mockGet).toHaveBeenCalledWith(`${BASE_URL}`, {
      params: { page: 2, paginate: 1 },
    })
    expect(store.consecutiveMovementList).toEqual(mockResponse.data.data.data)
    expect(store.consecutiveMovemenPages.currentPage).toBe(2)
    expect(store.consecutiveMovemenPages.lastPage).toBe(4)
  })

  it('_getConsecutiveMovementList handles API error', async () => {
    const store = useConsecutiveMovementsV1()
    const { showAlertMock, showCatchErrorMock } = require('@/composables')

    const mockError = new Error('Fallo en API')
    const mockGet = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getConsecutiveMovementList({ page: 1 })

    expect(showCatchErrorMock).toHaveBeenCalledWith(mockError)
    expect(showAlertMock).toHaveBeenCalledWith(
      'Mensaje de error: Fallo en API',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
    expect(store.consecutiveMovementList).toEqual([])
  })

  it('_showConsecutiveDetail returns data when success=true', async () => {
    const store = useConsecutiveMovementsV1()

    const mockResponse = {
      data: {
        success: true,
        data: { id: 5, code: 'MOV-005' },
        message: 'Detalle cargado',
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._showConsecutiveDetail(5)

    expect(mockGet).toHaveBeenCalledWith(`${BASE_URL}/5`)
    expect(result).toEqual(mockResponse.data)
  })

  it('_showConsecutiveDetail returns null and shows alert when success=false', async () => {
    const store = useConsecutiveMovementsV1()
    const { showAlertMock } = require('@/composables')

    const mockResponse = {
      data: {
        success: false,
        message: 'No encontrado',
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._showConsecutiveDetail(99)

    expect(mockGet).toHaveBeenCalledWith(`${BASE_URL}/99`)
    expect(result).toBeNull()
    expect(showAlertMock).toHaveBeenCalledWith(
      'No encontrado',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('_showConsecutiveDetail handles catch error', async () => {
    const store = useConsecutiveMovementsV1()
    const { showAlertMock, showCatchErrorMock } = require('@/composables')

    const mockError = new Error('Error detalle')
    const mockGet = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._showConsecutiveDetail(10)

    expect(showCatchErrorMock).toHaveBeenCalledWith(mockError)
    expect(showAlertMock).toHaveBeenCalledWith(
      'Mensaje de error: Error detalle',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
    expect(result).toBeNull()
  })

  it('_downloadExcelAction downloads file correctly', async () => {
    const store = useConsecutiveMovementsV1()
    const {
      getNameBlobMock,
      downloadBlobXlxxMock,
      showAlertMock,
    } = require('@/composables')

    const mockBlob = new Blob(['mock data'])
    const mockResponse = {
      data: mockBlob,
      headers: { 'content-type': 'application/vnd.ms-excel' },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._downloadExcelAction('filter[user_id]=1')

    expect(mockGet).toHaveBeenCalledWith(
      `${BASE_URL}/export?filter[user_id]=1`,
      { responseType: 'blob' }
    )
    expect(getNameBlobMock).toHaveBeenCalledWith(mockResponse)
    expect(downloadBlobXlxxMock).toHaveBeenCalled()
    expect(showAlertMock).toHaveBeenCalledWith(
      'Archivo descargado correctamente',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('_downloadExcelAction handles error correctly', async () => {
    const store = useConsecutiveMovementsV1()
    const { showAlertMock, showCatchErrorMock } = require('@/composables')

    const mockError = new Error('Error descarga')
    const mockGet = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._downloadExcelAction('page=1')

    expect(showCatchErrorMock).toHaveBeenCalledWith(mockError)
    expect(showAlertMock).toHaveBeenCalledWith(
      'Mensaje de error: Error descarga',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })
})
