import { setActivePinia, createPinia } from 'pinia'
import { useBudgetItemsStoreV1 } from './budget-items-v1'
import { executeApi } from '@/apis'
import { IBudgetItemsForm, IBudgetItemRow } from '@/interfaces/customs'

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
  useShowError: jest.fn(() => ({ showCatchError: jest.fn(() => 'Error!') })),
  useUtils: jest.fn(),
}))

describe('useBudgetItemsStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  const mockFormItem: IBudgetItemsForm = {
    id: 1,
    status_id: 1,
    code: 1,
    description: 'Infraestructura vial',
    budget_structure_id: 1,
    resource_structure_id: 1,
    accounting_structure_id: 1,
    type: 'operativo',
    nature: 'gasto',
  }
  const mockFormItemEdit: IBudgetItemsForm = {
    id: 1,
    status_id: 1,
    code: 1,
    description: 'Infraestructura vial',
    budget_structure_id: 100,
    resource_structure_id: 200,
    accounting_structure_id: 300,
    type: 'operativo',
    nature: 'gasto',
  }
  const mockFormItemEditApi = {
    id: 1,
    status_id: 1,
    code: 1,
    description: 'Infraestructura vial',
    budget_structure: {
      id: 100,
    },
    resource_structure: {
      id: 200,
    },
    accounting_structure: {
      id: 300,
    },
    type: 'operativo',
    nature: 'gasto',
  }

  const mockTableItem: IBudgetItemRow = {
    id: 1,
    status_id: 1,
    code: '001',
    description: 'Infraestructura vial',
    type: 'operativo',
    nature: 'gasto',
    budget_structure: { id: 1, code: '100', description: 'Infraestructura' },
    resource_structure: { id: 2, code: '200', description: 'Recursos' },
    accounting_structure: { id: 3, code: '300', description: 'Contable' },
  }

  it('should create a budget item successfully', async () => {
    // Arrange
    const store = useBudgetItemsStoreV1()
    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Creado' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._createAction(mockFormItem)

    // Assert
    expect(result).toBe(true)
    expect(mockPost).toHaveBeenCalledWith(
      expect.stringContaining('budget-items'),
      mockFormItem
    )
  })

  it('should update a budget item successfully', async () => {
    // Arrange
    const store = useBudgetItemsStoreV1()
    const mockPut = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Actualizado' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    // Act
    const result = await store._updateAction(mockFormItem)

    // Assert
    expect(result).toBe(true)
    expect(mockPut).toHaveBeenCalledWith(
      expect.stringContaining('budget-items/1'),
      mockFormItem
    )
  })

  it('should delete a budget item successfully', async () => {
    // Arrange
    const store = useBudgetItemsStoreV1()
    const mockDelete = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Eliminado' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    // Act
    const result = await store._deleteAction(1)

    // Assert
    expect(result).toBe(true)
    expect(mockDelete).toHaveBeenCalledWith(
      expect.stringContaining('budget-items/1')
    )
  })

  it('should fetch budget items list successfully', async () => {
    // Arrange
    const store = useBudgetItemsStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Listado',
        data: {data: [mockTableItem],
          current_page: 1,
          last_page: 2,},
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._listAction({ page: 1 })

    // Assert
    expect(store.budget_items_list).toEqual([mockTableItem])
    expect(store.budget_items_pages.currentPage).toBe(1)
    expect(store.budget_items_pages.lastPage).toBe(2)
  })

  it('should get a budget item by id', async () => {
    // Arrange
    const store = useBudgetItemsStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Encontrado', data: mockFormItemEditApi },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._showAction(1)

    // Assert
    expect(store.selected_budget_item).toEqual(mockFormItemEdit)
    expect(mockGet).toHaveBeenCalledWith(
      expect.stringContaining('budget-items/1')
    )
  })

  it('should download excel successfully when API responds', async () => {
    // Arrange
    const store = useBudgetItemsStoreV1()

    const mockResponse = {
      data: 'fake-excel-content',
      headers: { 'content-type': 'application/vnd.ms-excel' },
    }

    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Mock de utilidades
    const mockGetNameBlob = jest.fn().mockReturnValue('budget-items.xlsx')
    const mockDownloadBlobXlxx = jest.fn()
    
    // Mock useUtils para que retorne las funciones mockeadas
    const { useUtils } = require('@/composables')
    ;(useUtils as jest.Mock).mockReturnValue({
      getNameBlob: mockGetNameBlob,
      downloadBlobXlxx: mockDownloadBlobXlxx,
    })

    // Act
    await store._downloadExcelAction('&status=1')

    // Assert
    expect(mockPost).toHaveBeenCalledWith(
      expect.stringContaining('budget/api/budget/budget-items/export?&status=1'), null,
      { responseType: 'blob' }
    )
    expect(mockGetNameBlob).toHaveBeenCalledWith(mockResponse)
    const firstCall = mockDownloadBlobXlxx.mock.calls[0]
    expect(firstCall).toBeDefined()
    const [blobArg, nameArg] = firstCall
    expect(blobArg).toBeInstanceOf(Blob)
    expect(nameArg).toBe('budget-items.xlsx')
  })

  it('should select a budget item', () => {
    // Arrange
    const store = useBudgetItemsStoreV1()

    // Act
    store._setSelectBudgetItem(mockFormItem)

    // Assert
    expect(store.selected_budget_item).toEqual(mockFormItem)
  })
})
