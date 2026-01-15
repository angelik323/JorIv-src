// Vue - Pinia - Router - Quasar
import { setActivePinia, createPinia } from 'pinia'

// Interfaces
import type {
  IProjectManagementResponse,
  IProjectManagementRequest,
  IProjectManagementList,
  IProjectManagementBusinessChildrenList,
  IProjectManagementAssociatedBusinessList,
} from '@/interfaces/customs/derivative-contracting/ProjectManagement'

// Constantes
import { URL_PATH_DERIVATIVE_CONTRACTING } from '@/constants/apis'

// APIs
import { executeApi } from '@/apis'

// Stores
import { useProjectManagementStoreV1 } from '@/stores/derivative-contracting/project-management/project-management-v1'

const URL_PATH = `${URL_PATH_DERIVATIVE_CONTRACTING}/project`

const mockProjectManagementList: IProjectManagementList = [
  {
    id: 1,
    code: 'COD',
    name: 'Proyecto de infraestructura vial',
    business: 'Business',
    business_id: 1,
    business_code: 'COD',
    business_name: 'Business',
    status: {
      id: 1,
      status: 'status',
    },
    start_date: '2022-01-01',
    end_date: '2022-01-01',
    expenditure_computer: 'expenditure_computer',
    created_at: '2022-01-01',
    updated_at: '2022-01-01',
  },
]

const mockProjectManagementBusinessChildrenList: IProjectManagementBusinessChildrenList =
  [
    {
      business_id: 1,
      code: 'COD',
      name: 'Proyecto de infraestructura vial',
      status: {
        id: 1,
        status: 'status',
      },
      is_associated: true,
    },
  ]

const mockProjectManagementAssociatedBusinessList: IProjectManagementAssociatedBusinessList =
  [
    {
      id: 1,
      business_id: 1,
      code: 'COD',
      business_code: 'COD',
      name: 'Proyecto de infraestructura vial',
      status: {
        id: 1,
        status: 'status',
      },
      is_associated: true,
    },
  ]

const mockProjectManagementForm: IProjectManagementRequest = {
  name: 'Proyecto de infraestructura vial',
  description: 'description',
  start_date: '2022-01-01',
  end_date: '2022-01-01',
  expenditure_computer: 'expenditure_computer',
  status_id: 1,
  fiduciary_business_id: 1,
  business_type_id: 1,
  business_status_id: 1,
  business_ids: [1, 2, 3],
}

const mockProjectManagementResponse: IProjectManagementResponse = {
  id: 1,
  name: 'Proyecto de infraestructura vial',
  description: 'description',
  start_date: '2022-01-01',
  end_date: '2022-01-01',
  expenditure_computer: 'expenditure_computer',
  status_id: 1,
  fiduciary_business_id: 1,
  business_id: 1,
  business_type_id: 1,
  business_status_id: 1,
  status: {
    id: 1,
  },
  business_ids: [1, 2, 3],
}

const projectManagementId = 1

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

jest.mock('quasar', () => ({
  Notify: {
    create: jest.fn(),
  },
}))

describe('useProjectManagementStoreV1', () => {
  let store: ReturnType<typeof useProjectManagementStoreV1>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useProjectManagementStoreV1()
    jest.clearAllMocks()
  })

  describe('_getListAction', () => {
    const filters = '&page=1'
    const filtersEmpty = ''

    const emptyResponse = {
      data: [],
      current_page: 0,
      last_page: 0,
      total: 0,
      per_page: 10,
    }

    it('should fetch project management successfully', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Success',
          data: {
            data: mockProjectManagementList,
            current_page: 1,
            last_page: 1,
            total: 1,
            per_page: 10,
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getListAction(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}?paginate=1${filters}`)
      expect(store.project_management_list).toEqual(mockProjectManagementList)
      expect(store.project_management_pages).toEqual({
        currentPage: 1,
        lastPage: 1,
        total_items: 1,
        per_page: 10,
      })
    })

    it('should fetch project management successfully without filters', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Success without filters',
          data: {
            data: mockProjectManagementList,
            current_page: 1,
            last_page: 1,
            total: 1,
            per_page: 10,
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getListAction(filtersEmpty)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}?paginate=1${filtersEmpty}`
      )
      expect(store.project_management_list).toEqual(mockProjectManagementList)
    })

    it('should handle API success=false response', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'Failed',
          data: {
            data: [],
            current_page: 0,
            last_page: 0,
            total: 0,
            per_page: 10,
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getListAction(filters)

      // Assert
      expect(mockGet).toHaveBeenCalled()
      expect(store.project_management_list).toEqual([])
    })

    it('handles error when fetching project management fails', async () => {
      // Arrange
      const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getListAction(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}?paginate=1${filters}`)
      expect(store.project_management_list).toEqual([])
    })

    it('should handle empty response data', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Success',
          data: emptyResponse,
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getListAction('')

      // Assert
      expect(store.project_management_list).toEqual([])
      expect(store.project_management_pages).toEqual({
        currentPage: 0,
        lastPage: 0,
        total_items: 0,
        per_page: 10,
      })
    })
  })

  describe('_getListAssociatedAction', () => {
    const filters = '&page=1'
    const filtersEmpty = ''
    const projectId = '/1'

    const emptyResponse = {
      data: [],
      current_page: 0,
      last_page: 0,
      total: 0,
      per_page: 0,
    }

    it('should fetch project management associated business successfully', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Success',
          data: {
            data: mockProjectManagementAssociatedBusinessList,
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getListAssociatedAction(projectId, filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/listAssociated${projectId}${filters}`
      )
      expect(store.business_children_list).toEqual({
        data: mockProjectManagementAssociatedBusinessList,
      })
    })

    it('should fetch project management associated business successfully without filters', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Success without filters',
          data: {
            data: mockProjectManagementAssociatedBusinessList,
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getListAssociatedAction(projectId, filtersEmpty)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/listAssociated${projectId}${filtersEmpty}`
      )
      expect(store.business_children_list).toEqual({
        data: mockProjectManagementAssociatedBusinessList,
      })
    })

    it('should handle API success=false response', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'Failed',
          data: {
            data: [],
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getListAssociatedAction(projectId, filters)

      // Assert
      expect(mockGet).toHaveBeenCalled()
      expect(store.business_children_list).toEqual({ data: [] })
    })

    it('handles error when fetching project management associated business fails', async () => {
      // Arrange
      const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getListAssociatedAction(projectId, filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/listAssociated${projectId}${filters}`
      )
      expect(store.business_children_list).toEqual([])
    })

    it('should handle empty response data', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Success',
          data: emptyResponse,
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getListAssociatedAction(projectId, '')

      // Assert
      expect(store.business_children_list).toEqual({
        current_page: 0,
        data: [],
        last_page: 0,
        per_page: 0,
        total: 0,
      })
    })

    it('should handle empty projectId', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Success',
          data: {
            data: mockProjectManagementAssociatedBusinessList,
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getListAssociatedAction('', filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/listAssociated${filters}`
      )
    })

    it('should update store with default values when response data is incomplete', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Success',
          data: {},
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getListAssociatedAction(projectId, filters)

      // Assert
      expect(store.business_children_list).toEqual({})
    })
  })

  describe('_getListChildrensAction', () => {
    const filters = '&page=1'
    const filtersEmpty = ''
    const businessId = '/1'

    const emptyResponse = {
      data: [],
    }

    it('should fetch project management childrens successfully', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Success',
          data: {
            data: mockProjectManagementAssociatedBusinessList,
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getListChildrensAction(businessId, filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/listChildrens${businessId}${filters}`
      )
      expect(store.associated_business_list).toEqual({
        data: mockProjectManagementAssociatedBusinessList,
      })
    })

    it('should fetch project management associated business successfully without filters', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Success without filters',
          data: {
            data: mockProjectManagementAssociatedBusinessList,
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getListChildrensAction(businessId, filtersEmpty)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/listChildrens${businessId}${filtersEmpty}`
      )
      expect(store.associated_business_list).toEqual({
        data: mockProjectManagementAssociatedBusinessList,
      })
    })

    it('should handle API success=false response', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'Failed',
          data: {
            data: [],
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getListChildrensAction(businessId, filters)

      // Assert
      expect(mockGet).toHaveBeenCalled()
      expect(store.associated_business_list).toEqual({
        data: [],
      })
    })

    it('handles error when fetching project management associated business fails', async () => {
      // Arrange
      const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getListChildrensAction(businessId, filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/listChildrens${businessId}${filters}`
      )
      expect(store.associated_business_list).toEqual([])
    })

    it('should handle empty response data', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Success',
          data: emptyResponse,
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getListChildrensAction(businessId, '')

      // Assert
      expect(store.associated_business_list).toEqual({
        data: [],
      })
    })

    it('should handle empty businessId', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Success',
          data: {
            data: mockProjectManagementAssociatedBusinessList,
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getListChildrensAction('', filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/listChildrens${filters}`
      )
    })

    it('should update store with default values when response data is incomplete', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Success',
          data: {},
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getListChildrensAction(businessId, filters)

      // Assert
      expect(store.associated_business_list).toEqual({})
    })
  })

  describe('_getListBusinessChildrenAction', () => {
    const filters = '&page=1'
    const filtersEmpty = ''
    const projectId = '/1'

    const emptyResponse = {
      data: [],
    }

    it('should fetch project management business children successfully', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Success',
          data: {
            data: mockProjectManagementBusinessChildrenList,
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getListBusinessChildrenAction(projectId, filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/business-children${projectId}${filters}`
      )
      expect(store.associated_business_list).toEqual({
        data: mockProjectManagementBusinessChildrenList,
      })
    })

    it('should fetch project management business children successfully without filters', async () => {
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Success',
          data: {
            current_page: 1,
            data: mockProjectManagementBusinessChildrenList,
            last_page: 1,
            per_page: 0,
            total: 1,
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      await store._getListBusinessChildrenAction(projectId, filtersEmpty)

      expect(store.associated_business_list).toEqual({
        current_page: 1,
        data: mockProjectManagementBusinessChildrenList,
        last_page: 1,
        per_page: 0,
        total: 1,
      })
    })

    it('should handle API success=false response', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'Failed',
          data: {
            data: [],
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getListBusinessChildrenAction(projectId, filters)

      // Assert
      expect(mockGet).toHaveBeenCalled()
      expect(store.associated_business_list).toEqual({
        data: [],
      })
    })

    it('handles error when fetching project management business children fails', async () => {
      // Arrange
      const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getListBusinessChildrenAction(projectId, filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/business-children${projectId}${filters}`
      )
      expect(store.associated_business_list).toEqual([])
    })

    it('should handle empty response data', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Success',
          data: emptyResponse,
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getListBusinessChildrenAction(projectId, '')

      // Assert
      expect(store.associated_business_list).toEqual({
        data: [],
      })
    })

    it('should handle empty projectId', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Success',
          data: {
            data: mockProjectManagementBusinessChildrenList,
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getListBusinessChildrenAction('', filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/business-children${filters}`
      )
    })

    it('should update store with default values when response data is incomplete', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Success',
          data: {},
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getListChildrensAction(projectId, filters)

      // Assert
      expect(store.associated_business_list).toEqual({})
    })
  })

  describe('_getByIdAction', () => {
    it('should fetch project management by ID successfully', async () => {
      // Arrange
      const mockResponse = {
        success: true,
        message: 'Success',
        data: mockProjectManagementResponse,
      }
      const mockGet = jest.fn().mockResolvedValue({ data: mockResponse })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      const result = await store._getByIdAction(1)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/1`)
      expect(result).toEqual(mockProjectManagementResponse)
    })

    it('should return null when success is false', async () => {
      // Arrange
      const mockResponse = {
        success: false,
        message: 'Not found',
        data: null,
      }
      const mockGet = jest.fn().mockResolvedValue({ data: mockResponse })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      const result = await store._getByIdAction(999)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/999`)
      expect(result).toBeNull()
    })

    it('should return null when response data is null', async () => {
      // Arrange
      const mockResponse = {
        success: true,
        message: 'No data',
        data: null,
      }
      const mockGet = jest.fn().mockResolvedValue({ data: mockResponse })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      const result = await store._getByIdAction(999)

      // Assert
      expect(result).toBeNull()
    })

    it('should handle API success=false or no data', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: { success: false, message: 'Not found', data: null },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getByIdAction(1)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/1`)
    })

    it('returns null when response data is invalid', async () => {
      // Arrange
      const mockResponse = {
        data: { success: true, data: null },
      }
      const mockGet = jest.fn().mockResolvedValue({ data: mockResponse })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      const result = await store._getByIdAction(1)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/1`)
      expect(result).toBeNull()
    })

    it('handles error when fetching project management contract by ID fails', async () => {
      // Arrange
      const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      const result = await store._getByIdAction(1)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/1`)
      expect(result).toBeNull()
    })
  })

  describe('_createAction', () => {
    it('should create a new project management contract successfully', async () => {
      // Arrange
      const mockResponse = {
        success: true,
        message: 'Created successfully',
      }
      const mockPost = jest.fn().mockResolvedValue({ data: mockResponse })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const requestData: IProjectManagementRequest = {
        ...mockProjectManagementForm,
      }

      // Act
      const result = await store._createAction(requestData)

      // Assert
      expect(mockPost).toHaveBeenCalledWith(URL_PATH, requestData)
      expect(result).toBe(true)
    })

    it('should handle API success=false on create', async () => {
      // Arrange
      const mockPost = jest.fn().mockResolvedValue({
        data: { success: false, message: 'Creation failed', data: null },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const requestData: IProjectManagementRequest = {
        ...mockProjectManagementForm,
      }

      // Act
      const result = await store._createAction(requestData)

      // Assert
      expect(result).toBe(false)
    })

    it('handles error when creating project management contract fails', async () => {
      // Arrange
      const mockPost = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const requestData: IProjectManagementRequest = {
        ...mockProjectManagementForm,
      }

      // Act
      const result = await store._createAction(requestData)

      // Assert
      expect(mockPost).toHaveBeenCalledWith(URL_PATH, requestData)
      expect(result).toBe(false)
    })
  })

  describe('_updateAction', () => {
    it('should update an existing project management contract successfully', async () => {
      // Arrange
      const mockResponse = {
        success: true,
        message: 'Updated successfully',
        data: mockProjectManagementForm,
      }
      const mockPatch = jest.fn().mockResolvedValue({ data: mockResponse })
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPatch })

      const requestData: IProjectManagementRequest = {
        ...mockProjectManagementForm,
      }

      // Act
      const result = await store._updateAction(requestData, projectManagementId)

      // Assert
      expect(mockPatch).toHaveBeenCalledWith(
        `${URL_PATH}/${projectManagementId}`,
        requestData
      )
      expect(result).toBe(true)
    })

    it('should handle API success=false on update', async () => {
      // Arrange
      const mockPatch = jest.fn().mockResolvedValue({
        data: { success: false, message: 'Error', data: null },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPatch })

      // Arrange
      const requestData: IProjectManagementRequest = {
        ...mockProjectManagementForm,
      }

      // Act
      const result = await store._updateAction(requestData, projectManagementId)

      // Assert
      expect(mockPatch).toHaveBeenCalledWith(
        `${URL_PATH}/${projectManagementId}`,
        requestData
      )
      expect(result).toBe(false)
    })

    it('handles error when updating fails', async () => {
      // Arrange
      const mockPatch = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPatch })

      // Arrange
      const requestData: IProjectManagementRequest = {
        ...mockProjectManagementForm,
      }

      // Act
      const result = await store._updateAction(requestData, projectManagementId)

      // Assert
      expect(mockPatch).toHaveBeenCalledWith(
        `${URL_PATH}/${projectManagementId}`,
        requestData
      )
      expect(result).toBe(false)
    })
  })

  describe('_deleteAction', () => {
    it('should delete project management contract successfully', async () => {
      // Arrange
      const successMessage = 'Deleted successfully'
      const mockResponse = {
        success: true,
        message: successMessage,
        data: null,
      }
      const mockDelete = jest.fn().mockResolvedValue({ data: mockResponse })
      ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

      // Act
      const result = await store._deleteAction(projectManagementId)

      // Assert
      expect(mockDelete).toHaveBeenCalledWith(
        `${URL_PATH}/${projectManagementId}`
      )
      expect(result).toBe(true)
    })

    it('should handle API success=false on delete', async () => {
      // Arrange
      const mockDelete = jest.fn().mockResolvedValue({
        data: { success: false, message: 'Error', data: null },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

      // Act
      const result = await store._deleteAction(projectManagementId)

      // Assert
      expect(result).toBe(false)
    })

    it('handles error when deleting project management fails', async () => {
      // Arrange
      const mockDelete = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

      // Act
      const result = await store._deleteAction(projectManagementId)

      // Assert
      expect(mockDelete).toHaveBeenCalledWith(
        `${URL_PATH}/${projectManagementId}`
      )
      expect(result).toBe(false)
    })
  })

  describe('_clearData', () => {
    it('should clear all data from the store', () => {
      // Arrange
      store.project_management_list = mockProjectManagementList
      store.business_children_list = mockProjectManagementBusinessChildrenList
      store.associated_business_list =
        mockProjectManagementAssociatedBusinessList
      store.project_management_pages = {
        currentPage: 1,
        lastPage: 1,
        total_items: 10,
        per_page: 0,
      }

      // Act
      store._clearData()

      // Assert
      expect(store.project_management_list).toEqual([])
      expect(store.project_management_pages).toEqual({
        currentPage: 0,
        lastPage: 0,
        total_items: 0,
        per_page: 0,
      })
      expect(store.associated_business_list).toEqual([])
      expect(store.business_children_list).toEqual([])
    })
  })
})
