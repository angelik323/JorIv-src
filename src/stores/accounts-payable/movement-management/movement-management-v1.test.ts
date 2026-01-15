// core
import { setActivePinia, createPinia } from 'pinia'

// api
import { executeApi } from '@/apis'

// interfaces
import {
  IMovementManagementCreateBulkPayload,
  IMovementManagementCreatePayload,
  IMovementManagementItem,
  IMovementManagementUpdatePayload,
} from '@/interfaces/customs/accounts-payable/MovementManagement'

// constants
import { URL_PATH_ACCOUNTS_PAYABLE } from '@/constants/apis'

// store
import { useMovementManagementStoreV1 } from '@/stores/accounts-payable/movement-management/movement-management-v1'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  })),
}))

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({
    showAlert: jest.fn(),
  })),
  useShowError: jest.fn(() => ({
    showCatchError: jest.fn(),
  })),
  useUtils: jest.fn(() => ({
    getNameBlob: jest.fn(),
    downloadBlobXlxx: jest.fn(),
  })),
}))

describe('useMovementManagementStoreV1', () => {
  let store: ReturnType<typeof useMovementManagementStoreV1>
  const url = `${URL_PATH_ACCOUNTS_PAYABLE}/movement-codes`
  const filters = { 'filter[search]': 'ABC123' }

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useMovementManagementStoreV1()
    jest.clearAllMocks()
  })

  it('fetches movement management list successfully', async () => {
    // Arrange
    const mockList = [{ id: 1, code: 'XYZ', description: 'Registro de prueba' }]
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Lista obtenida',
        data: { data: mockList, current_page: 1, last_page: 2 },
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getMovementList(filters)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(url, {
      params: { 'filter[search]': 'ABC123', paginate: 1 },
    })
    expect(store.movement_management_list).toEqual(mockList)
    expect(store.movement_management_pages).toEqual({
      currentPage: 1,
      lastPage: 2,
    })
  })

  it('handles error when fetching movement list', async () => {
    // Arrange
    const mockGet = jest.fn().mockRejectedValue(new Error('Error de red'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getMovementList(filters)

    // Assert
    expect(store.movement_management_list).toEqual([])
  })

  it('toggles movement status successfully', async () => {
    // Arrange
    const mockPatch = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Estado cambiado' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ patch: mockPatch })

    // Act
    const result = await store._toggleStatusMovement(5)

    // Assert
    expect(mockPatch).toHaveBeenCalledWith(`${url}/5/toggle-status`)
    expect(result).toBe(true)
  })

  it('handles error when toggling movement status', async () => {
    // Arrange
    const mockPatch = jest.fn().mockRejectedValue(new Error('Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ patch: mockPatch })

    // Act
    const result = await store._toggleStatusMovement(1)

    // Assert
    expect(result).toBe(false)
  })

  it('creates movement successfully', async () => {
    // Arrange
    const payload = { name: 'Movimiento test' }
    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Creado correctamente' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._createMovementManagement(
      payload as IMovementManagementCreatePayload
    )

    // Assert
    expect(mockPost).toHaveBeenCalledWith(url, payload)
    expect(result).toBe(true)
  })

  it('handles error when creating movement', async () => {
    // Arrange
    const mockPost = jest.fn().mockRejectedValue(new Error('Error al crear'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._createMovementManagement(
      {} as IMovementManagementCreatePayload
    )

    // Assert
    expect(result).toBe(false)
  })

  it('deletes movement successfully', async () => {
    // Arrange
    const mockDelete = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Eliminado correctamente' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    // Act
    const result = await store._deleteMovement(7)

    // Assert
    expect(mockDelete).toHaveBeenCalledWith(`${url}/7`)
    expect(result).toBe(true)
  })

  it('handles error when deleting movement', async () => {
    // Arrange
    const mockDelete = jest
      .fn()
      .mockRejectedValue(new Error('Error al eliminar'))
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    // Act
    const result = await store._deleteMovement(99)

    // Assert
    expect(result).toBe(false)
  })

  it('gets movement by ID successfully', async () => {
    // Arrange
    const mockData = { id: 1, name: 'Movimiento' }
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Obtenido correctamente',
        data: mockData,
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    const result = await store._getMovementById(1)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${url}/1`)
    expect(result).toEqual(mockData)
  })

  it('handles error when getting movement by ID', async () => {
    // Arrange
    const mockGet = jest.fn().mockRejectedValue(new Error('Error al obtener'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    const result = await store._getMovementById(1)

    // Assert
    expect(result).toBeNull()
  })

  it('updates movement successfully', async () => {
    // Arrange
    const payload = {
      name: 'Test',
      has_handle_budget: true,
      has_generates_accrual: true,
      has_generates_treasury: true,
      has_amortizes_fund: true,
      has_contract_execution: true,
      has_compliance_without_treasury: true,
      has_requests_invoice: true,
      has_validates_final_act: true,
      budget_reference_document_type_id: 1,
      budget_generate_document_type_id: 1,
      budget_generate_movement_id: 1,
      fund_movement_code_id: 1,
      accounting_accrual_subtype_id: 1,
      treasury_funds_payment_movement_id: 1,
      treasury_bank_payment_movement_id: 1,
    }

    const mockPut = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Actualizado correctamente' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    // Act
    const result = await store._updateMovementManagement(
      payload as IMovementManagementUpdatePayload,
      1
    )

    // Assert
    expect(mockPut).toHaveBeenCalledWith(`${url}/1`, payload)
    expect(result).toBe(true)
  })

  it('handles error when updating movement', async () => {
    // Arrange
    const mockPut = jest
      .fn()
      .mockRejectedValue(new Error('Error al actualizar'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    // Act
    const result = await store._updateMovementManagement(
      {} as IMovementManagementUpdatePayload,
      1
    )

    // Assert
    expect(result).toBe(false)
  })

  it('creates bulk movement management successfully', async () => {
    // Arrange
    const payload: IMovementManagementCreateBulkPayload = {
      movement_codes: [
        {
          row_number: 1,
          name: 'test',
          disbursement_type: 'Pago',
          has_handle_budget: false,
          budget_reference_document_type_id: null,
          budget_generate_document_type_id: null,
          budget_generate_movement_id: null,
          has_requests_invoice: false,
          has_contract_execution: false,
          has_validates_final_act: false,
          has_generates_accrual: false,
          accounting_accrual_subtype_id: null,
          has_compliance_without_treasury: false,
          has_amortizes_fund: false,
          fund_movement_code_id: null,
          has_generates_treasury: false,
          treasury_funds_payment_movement_id: null,
          treasury_bank_payment_movement_id: null,
          has_error: false,
          error_message: '',
        },
      ],
    }

    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Carga masiva exitosa' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._createBulkMovementManagement(payload)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(`${url}/import/bulk`, payload)
    expect(result).toBe(true)
  })

  it('handles error when creating bulk movement management', async () => {
    // Arrange
    const mockPost = jest
      .fn()
      .mockRejectedValue(new Error('Error en carga masiva'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._createBulkMovementManagement(
      {} as IMovementManagementCreateBulkPayload
    )

    // Assert
    expect(result).toBe(false)
  })

  it('downloads Excel template successfully', async () => {
    // Arrange
    const mockBlob = new Blob(['data'], { type: 'application/vnd.ms-excel' })
    const mockResponse = {
      data: mockBlob,
      headers: { 'content-type': 'application/vnd.ms-excel' },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    const mockUtils = {
      getNameBlob: jest.fn().mockReturnValue('template.xlsx'),
      downloadBlobXlxx: jest.fn(),
    }

    jest.spyOn(require('@/composables'), 'useUtils').mockReturnValue(mockUtils)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._downloadExcelMovementManagementTemplate()

    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${url}/download-template`, {
      responseType: 'blob',
    })
    expect(mockUtils.downloadBlobXlxx).toHaveBeenCalledWith(
      mockBlob,
      'template.xlsx'
    )
  })

  it('handles error when downloading Excel template', async () => {
    // Arrange
    const mockGet = jest.fn().mockRejectedValue(new Error('Error al descargar'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._downloadExcelMovementManagementTemplate()

    // Assert
    expect(mockGet).toHaveBeenCalled()
  })

  it('downloads Excel with errors successfully', async () => {
    // Arrange
    const file = new File(['data'], 'errores.xlsx', {
      type: 'application/vnd.ms-excel',
    })
    const mockBlob = new Blob(['data'], { type: 'application/vnd.ms-excel' })
    const mockResponse = {
      data: mockBlob,
      headers: { 'content-type': 'application/vnd.ms-excel' },
    }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    const mockUtils = {
      getNameBlob: jest.fn().mockReturnValue('errores.xlsx'),
      downloadBlobXlxx: jest.fn(),
    }

    jest.spyOn(require('@/composables'), 'useUtils').mockReturnValue(mockUtils)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    await store._downloadExcelMovementManagementErrors(file)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(
      `${url}/import?download-errors=true`,
      expect.any(FormData),
      expect.objectContaining({
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob',
      })
    )
    expect(mockUtils.downloadBlobXlxx).toHaveBeenCalledWith(
      mockBlob,
      'errores.xlsx'
    )
  })

  it('handles error when downloading Excel with errors', async () => {
    // Arrange
    const file = new File(['data'], 'error.xlsx')
    const mockPost = jest
      .fn()
      .mockRejectedValue(new Error('Error al descargar errores'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    await store._downloadExcelMovementManagementErrors(file)

    // Assert
    expect(mockPost).toHaveBeenCalled()
  })

  it('downloads Excel error JSON successfully', async () => {
    // Arrange
    const file = new File(['data'], 'errores.xlsx')
    const mockData = {
      summary: { total: 1, success: 0, errors: 1, has_errors: true },
      validated_rows: [],
      error_rows: [],
    }
    const mockPost = jest.fn().mockResolvedValue({ data: { data: mockData } })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._downloadExcelMovementManagementErrorsJson(file)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(
      `${url}/import?return-rows=true`,
      expect.any(FormData),
      expect.objectContaining({
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    )
    expect(result).toEqual(mockData)
  })

  it('handles error when downloading Excel error JSON', async () => {
    // Arrange
    const file = new File(['data'], 'errores.xlsx')
    const mockPost = jest.fn().mockRejectedValue(new Error('Error JSON'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._downloadExcelMovementManagementErrorsJson(file)

    // Assert
    expect(result).toEqual({
      summary: { total: 0, success: 0, errors: 0, has_errors: false },
      validated_rows: [],
      error_rows: [],
    })
  })

  it('uploads file successfully', async () => {
    // Arrange
    const file = new File(['data'], 'movimientos.xlsx')
    const mockResponse = { inserted: 5, total: 5, errors: [] }
    const mockPost = jest.fn().mockResolvedValue({ data: mockResponse })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._uploadFile(file)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(
      `${url}/import`,
      expect.any(FormData),
      expect.objectContaining({
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    )
    expect(result).toEqual(mockResponse)
  })

  it('handles error when uploading file', async () => {
    // Arrange
    const file = new File(['data'], 'movimientos.xlsx')
    const mockErrorResponse = {
      inserted: 0,
      total: 0,
      errors: ['Error de formato'],
    }
    const mockPost = jest.fn().mockRejectedValue({
      response: { data: mockErrorResponse },
      message: 'Error al subir archivo',
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._uploadFile(file)

    // Assert
    expect(result).toEqual(mockErrorResponse)
  })

  it('clears data correctly', () => {
    // Arrange
    store.movement_management_list = [{ id: 1 } as IMovementManagementItem]
    store.movement_management_pages = { currentPage: 5, lastPage: 10 }

    // Act
    store._clearData()

    // Assert
    expect(store.movement_management_list).toEqual([])
    expect(store.movement_management_pages).toEqual({
      currentPage: 1,
      lastPage: 1,
    })
  })
})
