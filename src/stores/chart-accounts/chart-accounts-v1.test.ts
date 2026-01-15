import { createPinia, setActivePinia } from 'pinia'
import { useChartAccountsStoreV1 } from './chart-accounts-v1'
import { executeApi } from '@/apis'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  })),
}))

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useShowError: jest.fn(() => ({ showCatchError: jest.fn() })),
}))

describe('useChartAccountsStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('fetches list of chart accounts', async () => {
    // Arrage
    const store = useChartAccountsStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Success',
        data: {
          data: [
            {
              id: 1,
              code: '001',
              structure: 'PUC-2024',
              purpose: 'Plan Único de Cuentas 2024',
              status: {
                id: 1,
                status: 'Activo',
              },
            },
          ],
          current_page: 1,
          last_page: 1,
        },
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getListAction('')

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      'accounting/api/accounting/account-charts?paginate=1'
    )
    expect(store.chart_accounts_list).toHaveLength(1)
    expect(store.chart_accounts_list[0].id).toBe(1)
  })

  it('handles error when fetching chart accounts fails', async () => {
    // Arrage
    const store = useChartAccountsStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getListAction('')

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      'accounting/api/accounting/account-charts?paginate=1'
    )
    expect(store.chart_accounts_list).toHaveLength(0)
  })

  it('fetches chart account by ID', async () => {
    // Arrange
    const store = useChartAccountsStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Success',
        data: {
          structure: {
            id: 1,
            code: '001',
            structure: 'PUC-2024',
            type: 'Catálogo de cuentas contables',
            status: {
              id: 1,
              status: 'Activo',
            },
          },
          accounts: [
            {
              id: 88,
              code: '123',
              name: 'ejemplo1',
              type: 'Totalizador',
              nature: 'Crédito',
              status: {
                id: 2,
                status: 'Inactivo',
              },
              has_cost_center: false,
              applies_ica_withholding_income: false,
              applies_withholding_profits: false,
              is_currency_reexpressed: false,
            },
            {
              id: 89,
              code: '456',
              name: 'ejemplo2',
              type: 'Operativo',
              nature: 'Débito',
              status: {
                id: 1,
                status: 'Activo',
              },
              has_cost_center: true,
              applies_ica_withholding_income: true,
              applies_withholding_profits: true,
              is_currency_reexpressed: true,
            },
            {
              id: 90,
              code: '789',
              name: 'ejemplo3',
              type: 'Totalizador',
              nature: 'Crédito',
              status: {
                id: 2,
                status: 'Inactivo',
              },
              has_cost_center: true,
              applies_ica_withholding_income: true,
              applies_withholding_profits: false,
              is_currency_reexpressed: false,
            },
          ],
        },
        accounts_to_delete: [86, 87],
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getByIdChartAccount(1)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      'accounting/api/accounting/account-charts/1'
    )
    expect(store.chart_accounts_request?.accounts).not.toBeNull()
  })

  it('handles error when fetching chart account by ID fails', async () => {
    // Arrange
    const store = useChartAccountsStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getByIdChartAccount(2)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      'accounting/api/accounting/account-charts/2'
    )
    expect(store.chart_accounts_request).toBeNull()
  })

  it('creates a chart account an return true on success', async () => {
    // Arrange
    const store = useChartAccountsStoreV1()
    const mockPost = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Created',
      },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createChartAccount({})

    expect(mockPost).toHaveBeenCalled()
    expect(result).toBe(true)
  })

  it('handles error when creating a chart account fails', async () => {
    // Arrange
    const store = useChartAccountsStoreV1()

    const payload = {}
    const mockPost = jest.fn().mockResolvedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._createChartAccount(payload)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(
      'accounting/api/accounting/account-charts',
      payload
    )
    expect(result).toBe(false)
  })

  it('imports a chart account and returns true on success', async () => {
    const CONFIG = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }

    // Arrange
    const store = useChartAccountsStoreV1()
    const mockPost = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Import successful',
      },
    })

    store.documents_import = new File(['dummy content'], 'dummy.csv', {
      type: 'text/csv',
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._importChartAccount(123)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(
      `accounting/api/accounting/account-charts/validate-import/excel/123`,
      { file: store.documents_import },
      CONFIG
    )
    expect(result).toBe(true)
  })

  it('handles error when importing a chart account fails', async () => {
    const CONFIG = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }

    // Arrange
    const store = useChartAccountsStoreV1()

    store.documents_import = new File(['dummy content'], 'dummy.csv', {
      type: 'text/csv',
    })

    const mockPost = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._importChartAccount(123)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(
      `accounting/api/accounting/account-charts/validate-import/excel/123`,
      { file: store.documents_import },
      CONFIG
    )
    expect(result).toBe(false)
  })

  it('fetches the Excel template and sets the template_file', async () => {
    // Arrange
    const store = useChartAccountsStoreV1()

    const mockData = new ArrayBuffer(8)
    const mockGet = jest.fn().mockResolvedValue({
      data: mockData,
      headers: {
        'content-type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'content-disposition': 'attachment; filename="template_chart.xlsx"',
      },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getFormatExcel()

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `accounting/api/accounting/account-charts/excel/template`,
      { responseType: 'blob' }
    )
  })

  it('handles error when importing a chart account fails', async () => {
    const CONFIG = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }

    // Arrange
    const store = useChartAccountsStoreV1()

    store.documents_import = new File(['dummy content'], 'dummy.csv', {
      type: 'text/csv',
    })

    const mockPost = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._importChartAccount(123)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(
      `accounting/api/accounting/account-charts/validate-import/excel/123`,
      { file: store.documents_import },
      CONFIG
    )
    expect(result).toBe(false)
  })

  it('updates a chart account and returns true on success', async () => {
    // Arrage
    const store = useChartAccountsStoreV1()
    const mockPut = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Created',
      },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    // Act
    const result = await store._updateChartAccount({}, 1)

    // Result
    expect(result).toBe(true)
  })

  it('handles error when updating a chart a account fails', async () => {
    // Arrage
    const store = useChartAccountsStoreV1()
    const payload = {}

    const mockPut = jest.fn().mockResolvedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    // Act
    const result = await store._updateChartAccount(payload, 1)

    // Assert
    expect(mockPut).toHaveBeenCalledWith(
      'accounting/api/accounting/account-charts/1',
      payload
    )
    expect(result).toBe(false)
  })

  it('deletes a chart account succesfully', async () => {
    // Arrage
    const store = useChartAccountsStoreV1()
    const mockPatch = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Status changed successfully',
      },
    })

    // Act
    ;(executeApi as jest.Mock).mockReturnValue({
      patch: mockPatch,
    })

    await store._changeStatusAction(1, 1)

    expect(mockPatch).toHaveBeenCalledWith(
      'accounting/api/accounting/account-charts/1/status',
      { status_id: 2 }
    )
  })

  it('handles error when deleting a chart accoount failes', async () => {
    // Arrage
    const store = useChartAccountsStoreV1()
    const mockPatch = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ patch: mockPatch })

    // Act
    await store._changeStatusAction(1, 1)

    // Assert
    expect(mockPatch).toHaveBeenCalledWith(
      'accounting/api/accounting/account-charts/1/status',
      { status_id: 2 }
    )
  })
  it('should export account charts XLS format succesfully', async () => {
    const store = useChartAccountsStoreV1()

    const accountStructureId = 1

    const mockBlob = new Blob(['data'], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

    const mockResponse = {
      data: mockBlob,
      status: 200,
      headers: {
        'content-type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._export(accountStructureId)

    expect(mockGet).toHaveBeenCalledWith(
      `accounting/api/accounting/account-charts/${accountStructureId}/export`,
      {
        responseType: 'arraybuffer',
      }
    )

    expect(result).toBe(mockBlob)
  })
  it('should handle export account charts error succesfully', async () => {
    const store = useChartAccountsStoreV1()

    const accountStructureId = 1

    const mockError = {
      data: '',
      status: false,
      message: 'No se pudo exportar el plan de cuentas',
    }

    const mockGet = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._export(accountStructureId)

    expect(mockGet).toHaveBeenCalledWith(
      `accounting/api/accounting/account-charts/${accountStructureId}/export`,
      {
        responseType: 'arraybuffer',
      }
    )

    expect(result).toEqual(null)
  })
})
