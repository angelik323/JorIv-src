import { setActivePinia, createPinia } from 'pinia'
import { useBudgetAreasResponsibilityStoreV1 } from './areas-responsibility-v1'
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
  useUtils: jest.fn(() => ({
    getNameBlob: jest.fn(() => 'archivo.xlsx'),
    downloadBlobXlxx: jest.fn(),
    defaultIconsLucide: {
      plusCircleOutline: 'plus-circle',
    },
  })),
}))

describe('useBudgetAreasResponsibilityStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('fetches list of areas responsibility', async () => {
    // Arrange
    const store = useBudgetAreasResponsibilityStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Fetched',
        data: {
          data: [
            {
              id: 1,
              code: '1',
              description: 'PRUEBAS',
              type: 'Totalizador',
              structure_area_id: 111,
              structure_cost_center_id: 97,
              cost_center_id: 1,
              auxiliary_id: 2,
              structure_area: {
                code: '',
                description: '',
              },
              structure_cost_center: {
                code: '',
                description: '',
              },
              cost_center: {
                code: '',
                description: '',
              },
              auxiliary: {
                auxiliary: [],
              },
              created_at: null,
              updated_at: null,
            },
          ],
        },
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getListAction('')

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      'budget/api/budget/areas-responsibilities?paginate=1'
    )
    expect(store.data_areas_responsibility_list).toHaveLength(1)
    expect(store.data_areas_responsibility_list[0].id).toBe(1)
  })

  it('handles error when fetching areas responsibility fails', async () => {
    // Arrange
    const store = useBudgetAreasResponsibilityStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getListAction('')

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      'budget/api/budget/areas-responsibilities?paginate=1'
    )
    expect(store.data_areas_responsibility_list).toHaveLength(0)
  })

  it('creates a areas responsibility and returns true on success', async () => {
    const store = useBudgetAreasResponsibilityStoreV1()
    const mockPost = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Created',
      },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAreasResponsibility({
      structure_area_id: 111,
      structure_cost_center_id: 97,
      code: '10000',
      description: 'pruebas',
      type: 'Totalizador',
      cost_center_id: 91,
      auxiliary_id: 2,
    })

    expect(mockPost).toHaveBeenCalled()
    expect(result).toBe(true)
  })

  it('handles error when creating a areas responsibility fails', async () => {
    // Arrange
    const store = useBudgetAreasResponsibilityStoreV1()
    const payload = {
      structure_area_id: 111,
      structure_cost_center_id: 97,
      code: '10000',
      description: 'pruebas',
      type: 'Totalizador',
      cost_center_id: 91,
      auxiliary_id: 2,
    }
    const mockPost = jest.fn().mockResolvedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._createAreasResponsibility(payload)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(
      'budget/api/budget/areas-responsibilities',
      payload
    )
    expect(result).toBe(false)
  })

  it('updates a areas responsibility and returns true on success', async () => {
    const store = useBudgetAreasResponsibilityStoreV1()
    const mockPut = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Updated',
      },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateAreasResponsibility(3, {
      structure_area_id: 111,
      structure_cost_center_id: 97,
      code: '21151',
      description: 'pruebas',
      type: 'Totalizador',
      cost_center_id: 91,
      auxiliary_id: 2,
    })

    expect(mockPut).toHaveBeenCalledWith(
      'budget/api/budget/areas-responsibilities/3',
      {
        structure_area_id: 111,
        structure_cost_center_id: 97,
        code: '21151',
        description: 'pruebas',
        type: 'Totalizador',
        cost_center_id: 91,
        auxiliary_id: 2,
      }
    )

    expect(result).toBe(true)
  })

  it('handles error when updating a areas responsibility fails', async () => {
    // Arrange
    const store = useBudgetAreasResponsibilityStoreV1()
    const payload = {
      structure_area_id: 111,
      structure_cost_center_id: 97,
      code: '21151',
      description: 'pruebas',
      type: 'Totalizador',
      cost_center_id: 91,
      auxiliary_id: 2,
    }

    const mockPut = jest.fn().mockResolvedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    // Act
    const result = await store._updateAreasResponsibility(3, payload)

    // Assert
    expect(mockPut).toHaveBeenCalledWith(
      'budget/api/budget/areas-responsibilities/3',
      payload
    )
    expect(result).toBe(false)
  })

  it('deletes a areas responsibility and refetches the list', async () => {
    const store = useBudgetAreasResponsibilityStoreV1()
    const mockDelete = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Deleted',
      },
    })

    ;(executeApi as jest.Mock).mockReturnValue({
      delete: mockDelete,
    })

    await store._deleteAreasResponsibility(5)

    expect(mockDelete).toHaveBeenCalledWith(
      'budget/api/budget/areas-responsibilities/5'
    )
  })

  it('handles error when deleting a areas responsability fails', async () => {
    // Arrange
    const store = useBudgetAreasResponsibilityStoreV1()
    const mockDelete = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    // Act
    await store._deleteAreasResponsibility(1)

    // Assert
    expect(mockDelete).toHaveBeenCalledWith(
      'budget/api/budget/areas-responsibilities/1'
    )
  })
})
