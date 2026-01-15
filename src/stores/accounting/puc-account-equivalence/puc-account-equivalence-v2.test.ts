import { setActivePinia, createPinia } from 'pinia'
import { executeApi } from '@/apis'
import { usePucAccountEquivalenceStoreV2 } from './puc-account-equivalence-v2'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'
import { IAccountingEquivalenceFailures } from '@/interfaces/customs'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
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

describe('usePucAccountEquivalenceStoreV2', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('fetches account equivalences successfully', async () => {
    const store = usePucAccountEquivalenceStoreV2()
    const mockResponse = {
      data: {
        success: true,
        message: 'OK',
        data: { data: [{ id: 1 }], current_page: 2, last_page: 5 },
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getAccountEquivalences('&page=2')

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/v2/account-equivalences?paginate=1&page=2`
    )
    expect(store.account_equivalence_list).toEqual([{ id: 1 }])
    expect(store.account_equivalence_pages).toEqual({
      currentPage: 2,
      lastPage: 5,
    })
  })

  it('handles error in _getAccountEquivalences', async () => {
    const store = usePucAccountEquivalenceStoreV2()
    const mockGet = jest.fn().mockRejectedValue(new Error('Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getAccountEquivalences('')
    expect(mockGet).toHaveBeenCalled()
  })

  it('creates account equivalence successfully', async () => {
    const store = usePucAccountEquivalenceStoreV2()
    const mockResponse = { data: { success: true, message: 'Creado' } }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload = {
      equivalences: [
        {
          source_structure_id: 1,
          source_account_id: 2,
          equivalent_structure_id: 3,
          equivalent_account_id: 4,
        },
      ],
    }
    await store._createAccountEquivalence(payload as any)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/v2/account-equivalences`,
      payload
    )
  })
  it('handles _getAccountEquivalences with no success flag', async () => {
    const store = usePucAccountEquivalenceStoreV2()
    const mockResponse = {
      data: {
        data: { data: [] },
        current_page: 0,
        last_page: 0,
        message: 'No data',
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
    await store._getAccountEquivalences('')
    expect(store.account_equivalence_list).toEqual([])
    expect(store.account_equivalence_pages.currentPage).toBe(1)
    expect(store.account_equivalence_pages.lastPage).toBe(1)
  })

  it('handles _getAccountEquivalences with null data', async () => {
    const store = usePucAccountEquivalenceStoreV2()
    const mockResponse = {
      data: {
        success: true,
        data: { data: null, current_page: 1, last_page: 1 },
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
    await store._getAccountEquivalences('')
    expect(store.account_equivalence_list).toEqual([])
  })

  it('handles _validateImportFile with missing validated_accounts_equivalences', async () => {
    const store = usePucAccountEquivalenceStoreV2()
    store.document_import = new File([''], 'test.xlsx')
    const mockResponse = {
      data: {
        data: {
          valid_accounts_equivalences: [{ id: 2 }],
          file_name: 'backup_file.xlsx',
          total_count: 5,
          valid_count: 4,
        },
        message: 'Validado',
        success: true,
      },
    }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._validateImportFile()

    expect(store.validate_list).toEqual([])
    expect(store.file_name).toBe('backup_file.xlsx')
    expect(store.total_count).toBe(5)
    expect(store.valid_count).toBe(4)
    expect(result).toBe(true)
  })

  it('handles _validateImportFile with null data', async () => {
    const store = usePucAccountEquivalenceStoreV2()
    store.document_import = new File([''], 'test.xlsx')
    const mockResponse = {
      data: {
        data: null,
        message: 'Validado',
        success: true,
      },
    }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })
    await store._validateImportFile()
    expect(store.validate_list).toEqual([])
  })

  it('handles _getAccountingEquivalenceById with no success flag', async () => {
    const store = usePucAccountEquivalenceStoreV2()
    const mockResponse = { data: { data: { id: 77 } } }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
    const result = await store._getAccountingEquivalenceById(77)
    expect(result).toBeNull()
  })

  it('handles _getAccountingEquivalenceById with null data', async () => {
    const store = usePucAccountEquivalenceStoreV2()
    const mockResponse = { data: { success: true, data: null } }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
    const result = await store._getAccountingEquivalenceById(77)
    expect(result).toBeNull()
  })
  it('handles error in _downloadTemplate', async () => {
    const store = usePucAccountEquivalenceStoreV2()
    const mockGet = jest.fn().mockRejectedValue(new Error('Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._downloadTemplate(7)
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/v2/account-equivalences/download-template?filter[source_structure_id]=7`,
      { responseType: 'blob' }
    )
  })

  it('handles error in _exportAccountingEquivalence', async () => {
    const store = usePucAccountEquivalenceStoreV2()
    const mockGet = jest.fn().mockRejectedValue(new Error('Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._exportAccountingEquivalence(5)
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/v2/account-equivalences/excel/export`,
      {
        responseType: 'blob',
        params: {
          'filter[source_structure_id]': 5,
          'filter[equivalent_structure_id]': undefined,
        },
      }
    )
  })

  it('exports accounting equivalence', async () => {
    const store = usePucAccountEquivalenceStoreV2()
    const mockResponse = {
      data: 'blobdata',
      headers: {
        'content-type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
      message: 'Exportado',
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._exportAccountingEquivalence(5)
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/v2/account-equivalences/excel/export`,
      {
        responseType: 'blob',
        params: {
          'filter[source_structure_id]': 5,
          'filter[equivalent_structure_id]': undefined,
        },
      }
    )
  })

  it('handles error in _exportExcel', async () => {
    const store = usePucAccountEquivalenceStoreV2()
    const mockGet = jest.fn().mockRejectedValue(new Error('Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._exportExcel()
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/v2/account-equivalences/excel/export`,
      { responseType: 'blob' }
    )
  })

  it('handles error in _validateImportFile', async () => {
    const store = usePucAccountEquivalenceStoreV2()
    store.document_import = new File([''], 'test.xlsx')
    const mockPost = jest.fn().mockRejectedValue(new Error('Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._validateImportFile()

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/v2/account-equivalences/validate`,
      { file: store.document_import },
      expect.any(Object)
    )
    expect(store.validate_list).toEqual([])
    expect(store.file_name).toBe('')
    expect(store.total_count).toBe(0)
    expect(store.valid_count).toBe(0)
    expect(result).toBe(false)
  })

  it('handles _validateImportFile with success false and uses valid_accounts_equivalences', async () => {
    const store = usePucAccountEquivalenceStoreV2()
    store.document_import = new File([''], 'test.xlsx')
    const mockResponse = {
      data: {
        data: {
          valid_accounts_equivalences: [{ id: 3 }],
          failures: [{ row: 2, error: 'Validation error' }],
        },
        message: 'Validation failed',
        success: false,
      },
    }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._validateImportFile()

    expect(store.validate_list).toEqual([{ id: 3 }])
    expect(store.failures_list).toEqual([{ row: 2, error: 'Validation error' }])
    expect(result).toBe(false)
  })

  it('handles error in _createAccountEquivalence', async () => {
    const store = usePucAccountEquivalenceStoreV2()
    const mockPost = jest.fn().mockRejectedValue(new Error('Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    await store._createAccountEquivalence({} as any)
    expect(mockPost).toHaveBeenCalled()
  })

  it('gets accounting equivalence by id', async () => {
    const store = usePucAccountEquivalenceStoreV2()
    const mockResponse = { data: { success: true, data: { id: 99 } } }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getAccountingEquivalenceById(99)
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/v2/account-equivalences/99`
    )
    expect(result).toEqual({ id: 99 })
  })

  it('handles error in _getAccountingEquivalenceById', async () => {
    const store = usePucAccountEquivalenceStoreV2()
    const mockGet = jest.fn().mockRejectedValue(new Error('Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getAccountingEquivalenceById(1)
    expect(mockGet).toHaveBeenCalled()
    expect(result).toBeNull()
  })

  it('exports accounting equivalence', async () => {
    const store = usePucAccountEquivalenceStoreV2()
    const mockResponse = {
      data: 'blobdata',
      headers: {
        'content-type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
      message: 'Exportado',
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._exportAccountingEquivalence(5)
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/v2/account-equivalences/excel/export`,
      {
        responseType: 'blob',
        params: {
          'filter[source_structure_id]': 5,
          'filter[equivalent_structure_id]': undefined,
        },
      }
    )
  })

  it('downloads template', async () => {
    const store = usePucAccountEquivalenceStoreV2()
    const mockResponse = {
      data: 'blobdata',
      headers: {
        'content-type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._downloadTemplate(7)
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/v2/account-equivalences/download-template?filter[source_structure_id]=7`,
      { responseType: 'blob' }
    )
  })

  it('validates import file', async () => {
    const store = usePucAccountEquivalenceStoreV2()
    store.document_import = new File([''], 'test.xlsx')
    const mockResponse = {
      data: {
        data: {
          validated_accounts_equivalences: [{ id: 1 }],
          failures: [{ row: 1, error: 'Test error' }],
          file_name: 'test_file.xlsx',
          total_count: 10,
          valid_count: 9,
        },
        message: 'Validado',
        success: true,
      },
    }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._validateImportFile()

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/v2/account-equivalences/validate`,
      { file: store.document_import },
      expect.any(Object)
    )
    expect(store.validate_list).toEqual([{ id: 1 }])
    expect(store.failures_list).toEqual([{ row: 1, error: 'Test error' }])
    expect(store.file_name).toBe('test_file.xlsx')
    expect(store.total_count).toBe(10)
    expect(store.valid_count).toBe(9)
    expect(result).toBe(true)
  })

  it('exports excel correctamente', async () => {
    const store = usePucAccountEquivalenceStoreV2()
    const mockResponse = {
      data: 'blobdata',
      headers: {
        'content-type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
      message: 'Exportado',
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await expect(store._exportExcel()).resolves.not.toThrow()
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/v2/account-equivalences/excel/export`,
      { responseType: 'blob' }
    )
  })

  it('maneja error al exportar excel', async () => {
    const store = usePucAccountEquivalenceStoreV2()
    const mockGet = jest
      .fn()
      .mockRejectedValue(new Error('Error de exportación'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await expect(store._exportExcel()).resolves.not.toThrow()
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/v2/account-equivalences/excel/export`,
      { responseType: 'blob' }
    )
  })

  it('setea correctamente el documento importado', () => {
    const store = usePucAccountEquivalenceStoreV2()
    const file = new File(['contenido'], 'archivo.xlsx')
    expect(store.document_import).toBeNull()
    store._setDataDocuments(file)
    expect(store.document_import).toBe(file)
  })

  it('setea documento importado con archivo vacío', () => {
    const store = usePucAccountEquivalenceStoreV2()
    const file = new File([''], 'archivo.xlsx')
    store._setDataDocuments(file)
    expect(store.document_import).toBe(file)
  })

  it('sets document import to null', () => {
    const store = usePucAccountEquivalenceStoreV2()
    store._setDataDocuments(null)
    expect(store.document_import).toBeNull()
  })

  it('sets document import with empty file', () => {
    const store = usePucAccountEquivalenceStoreV2()
    const file = new File([''], 'empty.xlsx')
    store._setDataDocuments(file)
    expect(store.document_import).toBe(file)
  })

  it('sets document import with invalid type (number)', () => {
    const store = usePucAccountEquivalenceStoreV2()
    // @ts-expect-error: testing invalid type
    store._setDataDocuments(123)
    expect(store.document_import).toBe(123)
  })

  it('exports excel and handles response without headers', async () => {
    const store = usePucAccountEquivalenceStoreV2()
    const mockResponse = {
      data: 'blobdata',
      message: 'Exported',
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await expect(store._exportExcel()).resolves.not.toThrow()
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/v2/account-equivalences/excel/export`,
      { responseType: 'blob' }
    )
  })

  it('validates import file and updates state correctly', async () => {
    const store = usePucAccountEquivalenceStoreV2()
    store.document_import = new File([''], 'test.xlsx')
    const mockResponse = {
      data: {
        data: {
          file_name: 'test.xlsx',
          total_count: 10,
          valid_count: 8,
          validated_accounts_equivalences: [{ id: 1 }, { id: 2 }],
        },
        message: 'Validado',
        success: true,
      },
    }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._validateImportFile()

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/v2/account-equivalences/validate`,
      { file: store.document_import },
      expect.any(Object)
    )
    expect(result).toBe(true)
    expect(store.file_name).toBe('test.xlsx')
    expect(store.total_count).toBe(10)
    expect(store.valid_count).toBe(8)
    expect(store.validate_list).toEqual([{ id: 1 }, { id: 2 }])
  })

  it('handles validation failure in _validateImportFile', async () => {
    const store = usePucAccountEquivalenceStoreV2()
    store.document_import = new File([''], 'test.xlsx')
    const mockResponse = {
      data: {
        data: {},
        message: 'Error en validación',
        success: false,
      },
    }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._validateImportFile()

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/v2/account-equivalences/validate`,
      { file: store.document_import },
      expect.any(Object)
    )
    expect(result).toBe(false)
    expect(store.file_name).toBe('')
    expect(store.total_count).toBe(0)
    expect(store.valid_count).toBe(0)
    expect(store.validate_list).toEqual([])
  })

  it('sets failures_list after _validateImportFile', async () => {
    const store = usePucAccountEquivalenceStoreV2()
    store.document_import = new File([''], 'test.xlsx')
    const failures = [
      {
        index: 1,
        source_structure_code: '022',
        source_account_code: '10000002',
        equivalent_structure_code: '011',
        equivalent_account_code: null,
        errors: ['El campo Código de cuenta equivalente es requerido.'],
      },
    ] as IAccountingEquivalenceFailures[]
    const mockResponse = {
      data: {
        data: {
          validated_accounts_equivalences: [{ id: 1 }],
          failures,
        },
        message: 'Validado',
        success: true,
      },
    }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    await store._validateImportFile()
    expect(store.failures_list).toEqual(failures)
  })

  it('calls _downloadFailuresExcel and downloads blob', async () => {
    const store = usePucAccountEquivalenceStoreV2()
    const failures = [
      {
        index: 1,
        source_structure_code: '022',
        source_account_code: '10000002',
        equivalent_structure_code: '011',
        equivalent_account_code: null,
        errors: ['El campo Código de cuenta equivalente es requerido.'],
      },
    ] as IAccountingEquivalenceFailures[]
    const mockResponse = {
      data: 'blobdata',
      headers: {
        'content-type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
      message: 'Exportado',
    }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    await store._downloadFailuresExcel(failures)
    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/v2/account-equivalences/export-failures`,
      { failures },
      { responseType: 'blob' }
    )
  })
})
