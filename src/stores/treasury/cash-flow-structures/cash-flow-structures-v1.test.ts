import { setActivePinia, createPinia } from 'pinia'
import { useCashFlowStructuresV1 } from './cash-flow-structures-v1'
import { executeApi } from '@/apis'
import { URL_PATH_TREASURIES } from '@/constants/apis'
const URL_PATH_CASH_FLOW_STRUCTURE = `${URL_PATH_TREASURIES}/cash-flow-structures`

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  })),
}))

jest.mock('@/composables', () => {
  const useAlert = jest.fn(() => ({ showAlert: jest.fn() }))
  const useShowError = jest.fn(() => ({ showCatchError: jest.fn() }))
  return { useAlert, useShowError }
})

describe('useCashFlowStructuresV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('should fetch list of cash flow structures', async () => {
    // Arrange
    const store = useCashFlowStructuresV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: {
          data: [{ id: 1, name: 'Structure 1' }],
          current_page: 1,
          last_page: 2,
        },
      },
      status: 200,
    })
    const params = ''
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getListCashFlowStructures(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_CASH_FLOW_STRUCTURE}?paginate=1&rows=20${params}`
    )
    expect(store.data_cash_flow_list).toEqual([{ id: 1, name: 'Structure 1' }])
    expect(store.pages.currentPage).toBe(1)
    expect(store.pages.lastPage).toBe(2)
  })

  it('should create a new cash flow structure', async () => {
    // Arrange
    const store = useCashFlowStructuresV1()
    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Created successfully' },
    })
    const payload = {
      account_structure_id: 1,
      account_structure: 'Structure A',
      account_code: '12345',
      account_purpose: 'Purpose A',
      name: 'New Structure',
      code: 'NS001',
      type: 'Type A',
      nature: 'Nature A',
      activity_group: 'Group A',
    }
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._createAction(payload)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(URL_PATH_CASH_FLOW_STRUCTURE, payload)
    expect(result).toBe(true)
    expect(store.data_basic_cash_flow_structure).toBeNull()
  })

  it('should update a cash flow structure', async () => {
    // Arrange
    const store = useCashFlowStructuresV1()
    const mockPut = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Updated successfully' },
    })
    const id = '1'
    const payload = {
      account_structure_id: 1,
      account_structure: 'Structure A',
      account_code: '12345',
      account_purpose: 'Purpose A',
      name: 'New Structure',
      code: 'NS001',
      type: 'Type A',
      nature: 'Nature A',
      activity_group: 'Group A',
    }
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    // Act
    const result = await store._updateAction(id, payload)

    // Assert
    expect(mockPut).toHaveBeenCalledWith(
      `treasuries/api/treasuries/cash-flow-structures/${id}`,
      payload
    )
    expect(result).toBe(true)
  })

  it('should delete a cash flow structure', async () => {
    // Arrange
    const store = useCashFlowStructuresV1()
    const mockDelete = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Deleted successfully' },
    })
    const id = '1'
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    // Act
    const result = await store._deleteAction(id)

    // Assert
    expect(mockDelete).toHaveBeenCalledWith(
      `treasuries/api/treasuries/cash-flow-structures/${id}`
    )
    expect(result).toBe(true)
  })

  it('should handle errors when fetching cash flow structures', async () => {
    // Arrange
    const store = useCashFlowStructuresV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('API Error'))
    const params = '&page=1'
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getListCashFlowStructures(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      'treasuries/api/treasuries/cash-flow-structures?paginate=1&rows=20&page=1'
    )
    expect(store.data_cash_flow_list).toEqual([])
  })

  it('should handle empty list with status 206', async () => {
    // Arrange
    const store = useCashFlowStructuresV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: { success: true, message: 'No data', data: {} },
      status: 206,
    })
    const params = ''
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getListCashFlowStructures(params)

    // Assert
    expect(store.data_cash_flow_list).toEqual([])
    expect(store.pages.currentPage).toBe(1)
    expect(store.pages.lastPage).toBe(1)
  })

  it('should handle errors when creating a cash flow structure', async () => {
    // Arrange
    const store = useCashFlowStructuresV1()
    const mockPost = jest.fn().mockRejectedValue(new Error('API Error'))
    const payload = { name: 'Error Structure' }
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._createAction(payload as any)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(URL_PATH_CASH_FLOW_STRUCTURE, payload)
    expect(result).toBe(false)
  })

  it('should handle errors when updating a cash flow structure', async () => {
    // Arrange
    const store = useCashFlowStructuresV1()
    const mockPut = jest.fn().mockRejectedValue(new Error('API Error'))
    const id = '1'
    const payload = { name: 'Error Structure' }
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    // Act
    const result = await store._updateAction(id, payload as any)

    // Assert
    expect(mockPut).toHaveBeenCalledWith(
      `${URL_PATH_CASH_FLOW_STRUCTURE}/${id}`,
      payload
    )
    expect(result).toBe(false)
  })

  it('should handle errors when deleting a cash flow structure', async () => {
    // Arrange
    const store = useCashFlowStructuresV1()
    const mockDelete = jest.fn().mockRejectedValue(new Error('API Error'))
    const id = '1'
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    // Act
    const result = await store._deleteAction(id)

    // Assert
    expect(mockDelete).toHaveBeenCalledWith(
      `${URL_PATH_CASH_FLOW_STRUCTURE}/${id}`
    )
    expect(result).toBe(false)
  })

  it('should set data basic cash flow structure', async () => {
    // Arrange
    const store = useCashFlowStructuresV1()
    const data = { id: 10, name: 'Test Structure' }

    // Act
    await store._setDataBasicCashFlowStructures(data as any)

    // Assert
    expect(store.data_basic_cash_flow_structure).toEqual(data)
  })

  it('should set data basic cash flow structure to null', async () => {
    // Arrange
    const store = useCashFlowStructuresV1()

    // Act
    await store._setDataBasicCashFlowStructures(null)

    // Assert
    expect(store.data_basic_cash_flow_structure).toBeNull()
  })

  it('should get by id and set data_basic_cash_flow_structure', async () => {
    // Arrange
    const store = useCashFlowStructuresV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Found',
        data: { id: 2, structure_code: 'C001' },
      },
      status: 200,
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getByIdAction('2')

    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH_CASH_FLOW_STRUCTURE}/2`)
    expect(store.data_basic_cash_flow_structure).toEqual({
      id: 2,
      structure_code: 'C001',
      account_code: 'C001',
    })
  })

  it('should handle errors when getting by id', async () => {
    // Arrange
    const store = useCashFlowStructuresV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('API Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getByIdAction('3')

    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH_CASH_FLOW_STRUCTURE}/3`)
    expect(store.data_basic_cash_flow_structure).toBeNull()
  })
})
