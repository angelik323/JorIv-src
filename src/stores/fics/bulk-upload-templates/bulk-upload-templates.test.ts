import { setActivePinia, createPinia } from 'pinia'
import { executeApi } from '@/apis'
import { URL_PATH_FICS } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { useBulkUploadTemplatesStoreV1 } from './bulk-upload-templates'

jest.mock('quasar', () => ({
  Notify: {
    create: jest.fn(),
  },
}))

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    put: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  })),
}))

jest.mock('@/composables/useAlert', () => {
  const mockShowAlert = jest.fn()
  return {
    __esModule: true,
    useAlert: () => ({ showAlert: mockShowAlert }),
    mockShowAlert,
  }
})

jest.mock('@/composables/useShowError', () => {
  const mockShowCatchError = jest.fn((err) => err?.message || 'error')
  return {
    __esModule: true,
    useShowError: () => ({ showCatchError: mockShowCatchError }),
    mockShowCatchError,
  }
})

describe('useBulkUploadTemplatesStoreV1', () => {
  let store: ReturnType<typeof useBulkUploadTemplatesStoreV1>
  let showAlertMock: jest.Mock

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useBulkUploadTemplatesStoreV1()

    const alertModule = require('@/composables/useAlert')
    showAlertMock = alertModule.mockShowAlert

    const globalAny = global as unknown as {
      URL: Partial<URL> & Record<string, unknown>
    }

    if (!globalAny.URL) {
      globalAny.URL = {}
    }

    if (!globalAny.URL.createObjectURL) {
      globalAny.URL.createObjectURL = jest.fn(() => 'blob:mock-url')
    }

    if (!globalAny.URL.revokeObjectURL) {
      globalAny.URL.revokeObjectURL = jest.fn()
    }

    jest.clearAllMocks()
  })

  it('should fetch list and update state', async () => {
    const mockResponse = {
      data: {
        success: true,
        message: 'ok',
        data: { data: [{ id: 1 }], current_page: 2, last_page: 4 },
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getApiBulkUploadTemplates('&filter=test')

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/monetary-operation-templates?paginate=1&filter=test`
    )
    expect(store.data_bulk_upload_templates_list).toEqual([{ id: 1 }])
    expect(store.data_bulk_upload_templates_pages).toEqual({
      currentPage: 2,
      lastPage: 4,
    })
    expect(showAlertMock).toHaveBeenCalledWith(
      'ok',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('should fetch by id and set data_information_form', async () => {
    const mockResponse = {
      data: {
        success: true,
        message: 'ok',
        data: { turn: 1 },
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdBulkUploadTemplates(5)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/monetary-operation-templates/5`
    )
    expect(store.data_information_form).toEqual({ turn: 1 })
    expect(showAlertMock).toHaveBeenCalledWith(
      'ok',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('should update template and return success true', async () => {
    const mockResponse = {
      data: {
        success: true,
        message: 'updated',
      },
    }
    const mockPut = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ patch: mockPut })

    const success = await store._updateBulkUploadTemplates({ id: 1 }, 1)

    expect(mockPut).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/monetary-operation-templates/1`,
      { id: 1 }
    )
    expect(success).toBe(true)
    expect(showAlertMock).toHaveBeenCalledWith(
      'updated',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('should create template and return success true', async () => {
    const mockResponse = {
      data: {
        success: true,
        message: 'created',
      },
    }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const success = await store._createBulkUploadTemplates({ id: 1 })

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/monetary-operation-templates`,
      { id: 1 }
    )
    expect(success).toBe(true)
    expect(showAlertMock).toHaveBeenCalledWith(
      'created',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('should download excel and trigger blob download', async () => {
    const mockResponse = {
      data: new ArrayBuffer(10),
      headers: { 'content-type': 'application/vnd.ms-excel' },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const appendChildSpy = jest
      .spyOn(document.body, 'appendChild')
      .mockImplementation((node: Node) => node)

    const clickMock = jest.fn()
    const removeMock = jest.fn()
    const setAttributeMock = jest.fn()

    // Mock del <a>
    const mockLink: Partial<HTMLAnchorElement> = {
      setAttribute: setAttributeMock,
      click: clickMock,
      remove: removeMock,
      href: '',
    }

    const createElementSpy = jest
      .spyOn(document, 'createElement')
      .mockReturnValue(mockLink as HTMLAnchorElement)

    const createUrlMock = jest
      .spyOn(URL, 'createObjectURL')
      .mockReturnValue('blob:mock-url')

    const revokeUrlMock = jest
      .spyOn(URL, 'revokeObjectURL')
      .mockImplementation()

    await store._downloadExcelBulkUploadTemplates('1')

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_FICS}/monetary-operation-templates/1/export/excel`,
      { responseType: 'blob' }
    )

    expect(clickMock).toHaveBeenCalled()
    expect(removeMock).toHaveBeenCalled()
    expect(revokeUrlMock).toHaveBeenCalled()

    expect(showAlertMock).toHaveBeenCalledWith(
      'Descarga exitosa',
      'success',
      undefined,
      TIMEOUT_ALERT
    )

    // Restore
    createElementSpy.mockRestore()
    appendChildSpy.mockRestore()
    createUrlMock.mockRestore()
    revokeUrlMock.mockRestore()
  })

  it('should set data_information_form', () => {
    store._setDataInformationForm({ id: 1 })
    expect(store.data_information_form).toEqual({ id: 1 })
  })

  it('should clear data', () => {
    store.data_bulk_upload_templates_list = [{ id: 1 }]
    store.data_bulk_upload_templates_pages = { currentPage: 3, lastPage: 5 }

    store._clearData()

    expect(store.data_bulk_upload_templates_list).toEqual([])
    expect(store.data_bulk_upload_templates_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
  })
})
