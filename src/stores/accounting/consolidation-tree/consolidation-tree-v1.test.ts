import { setActivePinia, createPinia } from 'pinia'
import { useConsolidationTreeV1 } from './consolidation-tree-v1'
import { executeApi } from '@/apis'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'
import {
  IConsolidationTree,
  IRequestCreateConsolidationTree,
  IRequestUpdateConsolidationTree,
} from '@/interfaces/customs/accounting/ConsolidationTree'

const URL_PATH_CONSOLIDATION_TREE = `${URL_PATH_ACCOUNTING}/consolidation-tree`

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
  })),
}))

jest.mock('@/composables', () => {
  const useAlert = jest.fn(() => ({ showAlert: jest.fn() }))
  const useShowError = jest.fn(() => ({ showCatchError: jest.fn() }))
  const useUtils = jest.fn(() => ({ defaultIconsLucide: jest.fn() }))
  return { useAlert, useShowError, useUtils }
})

describe('useConsolidationTreeV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('should fetch list of consolidation trees', async () => {
    // Arrange
    const store = useConsolidationTreeV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: {
          data: [{ id: 1, name: 'Tree 1' }],
          current_page: 1,
          last_page: 2,
        },
        message: 'Listado obtenido exitosamente.',
      },
      status: 200,
    })
    const params = ''
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getListConsolidationTree(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_CONSOLIDATION_TREE}/business-list?paginate=1${params}`
    )
    expect(store.data_consolidation_tree_list).toEqual([
      { id: 1, name: 'Tree 1' },
    ])
    expect(store.pages.currentPage).toBe(1)
    expect(store.pages.lastPage).toBe(2)
  })

  it('should handle empty list with status 206', async () => {
    // Arrange
    const store = useConsolidationTreeV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: { success: true, message: 'No data', data: {} },
      status: 206,
    })
    const params = ''
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getListConsolidationTree(params)

    // Assert
    expect(store.data_consolidation_tree_list).toEqual([])
    expect(store.pages.currentPage).toBe(1)
    expect(store.pages.lastPage).toBe(1)
  })

  it('should create a new consolidation tree', async () => {
    // Arrange
    const store = useConsolidationTreeV1()
    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Created successfully' },
    })
    const payload: IRequestCreateConsolidationTree = {
      parent_id: 1,
      child_ids: [2, 3],
    }
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._createAction(payload)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_CONSOLIDATION_TREE}/create-tree`,
      payload
    )
    expect(result).toBe(true)
  })

  it('should update a consolidation tree', async () => {
    // Arrange
    const store = useConsolidationTreeV1()
    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Updated successfully' },
    })
    const payload: IRequestUpdateConsolidationTree = {
      parent_id: 1,
      new_childs_ids: [4, 5],
      remove_childs_ids: [2],
    }
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._updateAction(payload)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_CONSOLIDATION_TREE}/update-tree`,
      payload
    )
    expect(result).toBe(true)
  })

  it('should get business by ID', async () => {
    // Arrange
    const store = useConsolidationTreeV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Found',
        data: { id: 1, name: 'Tree 1' },
      },
      status: 200,
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    const result = await store._getBusinessByID(1)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_CONSOLIDATION_TREE}/get-tree/1`
    )
    expect(result).toBe(true)
    expect(store.data_basic_consolidation_tree).toEqual({
      id: 1,
      name: 'Tree 1',
    })
  })

  it('should get business by code', async () => {
    // Arrange
    const store = useConsolidationTreeV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Found', data: { id: 2, code: 'T002' } },
      status: 200,
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    const result = await store._getBusinessByCode('T002')

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_CONSOLIDATION_TREE}/get-busines-by-code?business_code=T002`
    )
    expect(result).toEqual({ id: 2, code: 'T002' })
  })

  it('should toggle account structure status', async () => {
    // Arrange
    const store = useConsolidationTreeV1()
    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Status changed' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._toggleAccountStructureStatus(1, 2)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_CONSOLIDATION_TREE}/chage-status`,
      { parent_id: 1, status_id: 2 }
    )
    expect(result).toBe(true)
  })

  it('should handle errors when fetching consolidation trees', async () => {
    // Arrange
    const store = useConsolidationTreeV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('API Error'))
    const params = '&rows=20&page=1'
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getListConsolidationTree(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_CONSOLIDATION_TREE}/business-list?paginate=1&rows=20&page=1`
    )
    expect(store.data_consolidation_tree_list).toEqual([])
  })

  it('should set consolidation tree request create', async () => {
    // Arrange
    const store = useConsolidationTreeV1()
    const data: IRequestCreateConsolidationTree = {
      parent_id: 1,
      child_ids: [2, 3],
    }

    // Act
    await store._setConsolidationTreeRequestCreate(data)

    // Assert
    expect(store.consolidation_tree_request_create).toEqual(data)
  })

  it('should set data basic consolidation tree', async () => {
    // Arrange
    const store = useConsolidationTreeV1()
    const data: IConsolidationTree = {
      id: 10,
      code: 'T010',
      name: 'Tree Y',
      status_id: 1,
      accounting_structure: {
        id: 1,
        code: 'AS001',
        purpose: 'Test purpose',
      },
      childrens: [],
    }

    // Act
    await store._setDataBasicConsolidationTree(data)

    // Assert
    expect(store.data_basic_consolidation_tree).toEqual(data)
  })

  it('should set consolidation tree request update', async () => {
    // Arrange
    const store = useConsolidationTreeV1()
    const data: IRequestUpdateConsolidationTree = {
      parent_id: 5,
      new_childs_ids: [6, 7],
      remove_childs_ids: [3],
    }

    // Act
    await store._setConsolidationTreeRequestUpdate(data)

    // Assert
    expect(store.consolidation_tree_request_update).toEqual(data)
  })

  it('should handle errors when creating a consolidation tree', async () => {
    // Arrange
    const store = useConsolidationTreeV1()
    const mockPost = jest.fn().mockRejectedValue(new Error('API Error'))
    const payload: IRequestCreateConsolidationTree = {
      parent_id: 1,
      child_ids: [2, 3],
    }
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._createAction(payload)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_CONSOLIDATION_TREE}/create-tree`,
      payload
    )
    expect(result).toBe(false)
  })

  it('should handle errors when updating a consolidation tree', async () => {
    // Arrange
    const store = useConsolidationTreeV1()
    const mockPost = jest.fn().mockRejectedValue(new Error('API Error'))
    const payload: IRequestUpdateConsolidationTree = {
      parent_id: 1,
      new_childs_ids: [4, 5],
      remove_childs_ids: [2],
    }
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._updateAction(payload)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_CONSOLIDATION_TREE}/update-tree`,
      payload
    )
    expect(result).toBe(false)
  })

  it('should set consolidation tree request create to null', async () => {
    // Arrange
    const store = useConsolidationTreeV1()

    // Act
    await store._setConsolidationTreeRequestCreate(null)

    // Assert
    expect(store.consolidation_tree_request_create).toBeNull()
  })

  it('should set data basic consolidation tree to null', async () => {
    // Arrange
    const store = useConsolidationTreeV1()

    // Act
    await store._setDataBasicConsolidationTree(null)

    // Assert
    expect(store.data_basic_consolidation_tree).toBeNull()
  })

  it('should set consolidation tree request update to null', async () => {
    // Arrange
    const store = useConsolidationTreeV1()

    // Act
    await store._setConsolidationTreeRequestUpdate(null)

    // Assert
    expect(store.consolidation_tree_request_update).toBeNull()
  })

  it('should handle errors when getting business by ID', async () => {
    // Arrange
    const store = useConsolidationTreeV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('API Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    const result = await store._getBusinessByID(123)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_CONSOLIDATION_TREE}/get-tree/123`
    )
    expect(result).toBe(false)
  })

  it('should handle errors when getting business by code', async () => {
    // Arrange
    const store = useConsolidationTreeV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('API Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    const result = await store._getBusinessByCode('ERR')

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_CONSOLIDATION_TREE}/get-busines-by-code?business_code=ERR`
    )
    expect(result).toBeNull()
  })

  it('should handle errors when toggling account structure status', async () => {
    // Arrange
    const store = useConsolidationTreeV1()
    const mockPost = jest.fn().mockRejectedValue(new Error('API Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._toggleAccountStructureStatus(1, 2)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_CONSOLIDATION_TREE}/chage-status`,
      { parent_id: 1, status_id: 2 }
    )
    expect(result).toBe(false)
  })
})
