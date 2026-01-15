import { setActivePinia, createPinia } from 'pinia'
import { useEquivalentVaucherStoreV1 } from './equivalent-vaucher-v1'
import { executeApi } from '@/apis'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  })),
}))

jest.mock('@/composables', () => {
  const showAlertMock = jest.fn()
  const showCatchErrorMock = jest.fn((error) => `Error: ${error.message}`)
  const downloadBlobXlxxMock = jest.fn()
  const getNameBlobMock = jest.fn(() => 'archivo.xlsx')

  return {
    useAlert: () => ({ showAlert: showAlertMock }),
    useShowError: () => ({ showCatchError: showCatchErrorMock }),
    useUtils: () => ({
      downloadBlobXlxx: downloadBlobXlxxMock,
      getNameBlob: getNameBlobMock,
    }),
    showAlertMock,
    showCatchErrorMock,
    downloadBlobXlxxMock,
    getNameBlobMock,
  }
})

describe('useEquivalentVaucher Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  const URL = `${URL_PATH_ACCOUNTING}/equivalent-vouchers`

  it('_getListEquivalentVaucher updates the store correctly', async () => {
    const store = useEquivalentVaucherStoreV1()

    const mockResponse = {
      data: {
        success: true,
        message: 'Obtained list',
        data: {
          data: [{ id: 1 }],
          current_page: 1,
          last_page: 3,
        },
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getListEquivalentVaucher('?page=1')

    expect(mockGet).toHaveBeenCalledWith(`${URL}?paginate=true?page=1`)
    expect(store.equivalent_vaucher_list).toEqual([{ id: 1 }])
    expect(store.equivalent_vaucher_pages.currentPage).toBe(1)
    expect(store.equivalent_vaucher_pages.lastPage).toBe(3)
  })

  it('_getListEquivalentVaucher displays error on failure', async () => {
    const store = useEquivalentVaucherStoreV1()
    const mockError = new Error('Fetch error')
    const mockGet = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const { showCatchErrorMock, showAlertMock } = require('@/composables')

    await store._getListEquivalentVaucher()

    expect(showCatchErrorMock).toHaveBeenCalledWith(mockError)
    expect(showAlertMock).toHaveBeenCalledWith(
      'Error: Fetch error',
      'error',
      undefined,
      expect.any(Number)
    )
  })

  it('_createEquivalentVaucher works correctly', async () => {
    const store = useEquivalentVaucherStoreV1()

    const mockResponse = { data: { success: true, message: 'Created' } }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })
    const payload = {
      valid_vouchers: [
        {
          index: 1,
          source_voucher_sub_type_id: 1,
          equivalent_voucher_sub_type_id: 2,
          fiscal_voucher_sub_type_id: 3,
        },
      ],
    }
    const result = await store._createEquivalentVaucher(payload)

    expect(mockPost).toHaveBeenCalledWith(URL, payload)
    expect(result).toBe(true)
  })

  it('_createEquivalentVaucher displays error alert if it fails', async () => {
    const store = useEquivalentVaucherStoreV1()

    const mockResponse = {
      data: { success: false, message: 'Creation failed' },
    }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload = {
      valid_vouchers: [
        {
          index: 1,
          source_voucher_sub_type_id: 1,
          equivalent_voucher_sub_type_id: 2,
          fiscal_voucher_sub_type_id: 3,
        },
      ],
    }

    const result = await store._createEquivalentVaucher(payload)

    expect(result).toBe(false)
    const { showAlertMock } = require('@/composables')
    expect(showAlertMock).toHaveBeenCalledWith(
      'Creation failed',
      'error',
      undefined,
      expect.any(Number)
    )
  })

  it('_validateTemplate handles errors correctly', async () => {
    const store = useEquivalentVaucherStoreV1()

    const filePayload = {
      file: new File(['dummy'], 'dummy.xlsx', {
        type: 'application/vnd.ms-excel',
      }),
    }

    const mockError = new Error('Validation error')
    const mockPost = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._validateTemplate(filePayload)

    expect(result).toBeNull()

    const { showCatchErrorMock, showAlertMock } = require('@/composables')
    expect(showCatchErrorMock).toHaveBeenCalledWith(mockError)
    expect(showAlertMock).toHaveBeenCalledWith(
      'Error: Validation error',
      'error',
      undefined,
      expect.any(Number)
    )
  })

  it('_downloadTemplate downloads the file successfully', async () => {
    const store = useEquivalentVaucherStoreV1()

    const mockBlob = new Blob(['data'], { type: 'application/vnd.ms-excel' })
    const mockResponse = {
      data: mockBlob,
      headers: { 'content-type': 'application/vnd.ms-excel' },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._downloadTemplate()

    const {
      downloadBlobXlxxMock,
      getNameBlobMock,
      showAlertMock,
    } = require('@/composables')
    expect(downloadBlobXlxxMock).toHaveBeenCalled()
    expect(getNameBlobMock).toHaveBeenCalled()
    expect(showAlertMock).toHaveBeenCalledWith(
      'Archivo exportado exitosamente',
      'success',
      undefined,
      expect.any(Number)
    )
  })

  it('_downloadTemplate handles errors correctly', async () => {
    const store = useEquivalentVaucherStoreV1()

    const mockError = new Error('Error al descargar')
    const mockGet = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._downloadTemplate()

    const { showCatchErrorMock, showAlertMock } = require('@/composables')
    expect(showCatchErrorMock).toHaveBeenCalledWith(mockError)
    expect(showAlertMock).toHaveBeenCalledWith(
      'Error: Error al descargar',
      'error',
      undefined,
      expect.any(Number)
    )
  })

  it('_deleteEquivalentVaucher deletes and updates the list', async () => {
    const store = useEquivalentVaucherStoreV1()

    const mockItem = {
      id: 1,
      source_voucher_sub_type: { id: 1, code: '01', name: 'Origen' },
      equivalent_voucher_sub_type: { id: 2, code: '02', name: 'Equivalente' },
      fiscal_voucher_sub_type: { id: 3, code: '03', name: 'Fiscal' },
      status: { id: 1, name: 'Activo', color: '#00FF00' },
    }

    const otherItem = {
      ...mockItem,
      id: 2,
    }

    store.equivalent_vaucher_list = [mockItem, otherItem]

    const mockResponse = { data: { success: true, message: 'Deleted' } }
    const mockDelete = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    const result = await store._deleteEquivalentVaucher(1)

    expect(mockDelete).toHaveBeenCalledWith(`${URL}/1`)
    expect(store.equivalent_vaucher_list).toEqual([otherItem])
    expect(result).toBe(true)
  })

  it('_validateTemplate updates errors and results', async () => {
    const store = useEquivalentVaucherStoreV1()

    const mockFile = new File(['contenido'], 'archivo.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    const filePayload = { file: mockFile }

    const mockResponse = {
      data: {
        success: true,
        message: 'Validado',
        data: {
          failures: [{ row: 1, error: 'Fallo' }],
        },
      },
    }

    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._validateTemplate(filePayload)

    expect(mockPost).toHaveBeenCalled()
    expect(store.failures_list).toHaveLength(1)
    expect(store.validate_result).toEqual(mockResponse.data)
    expect(result).toEqual(mockResponse.data)
  })

  it('_exportFailuresXlsx exports file correctly', async () => {
    const store = useEquivalentVaucherStoreV1()

    const failures = [
      {
        index: 1,
        source_voucher_sub_type: 10,
        equivalent_voucher_sub_type: 20,
        fiscal_voucher_sub_type: 30,
        errors: ['mock error'],
      },
    ]

    const mockBlob = new Blob(['data'], { type: 'application/vnd.ms-excel' })
    const mockPost = jest.fn().mockResolvedValue({
      data: mockBlob,
      headers: { 'content-type': 'application/vnd.ms-excel' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const { useUtils } = require('@/composables')
    const utils = useUtils()

    await store._exportFailuresXlsx(failures)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL}/export-failures`,
      { failures },
      { responseType: 'blob' }
    )
    expect(utils.downloadBlobXlxx).toHaveBeenCalled()
  })

  it('_exportFailuresXlsx displays warning if there are no errors', async () => {
    const store = useEquivalentVaucherStoreV1()
    const { showAlertMock } = require('@/composables')

    await store._exportFailuresXlsx([])

    expect(showAlertMock).toHaveBeenCalledWith(
      'No hay errores para exportar.',
      'warning'
    )
  })
})
