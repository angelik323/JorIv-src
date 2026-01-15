import { setActivePinia, createPinia } from 'pinia'
import { useDefinitionQuotaCounterpartPermitStoreV1 } from '@/stores/investment-portfolio/definition-quotas-counterpart-permits/definition-quotas-counterpart-permits-v1'
import { executeApi } from '@/apis'
import type {
  IDefinitionQuotaCounterpartPermitForm,
  IDefinitionQuotaCounterpartPermitList,
  IDefinitionQuotaCounterpartPermitRequest,
} from '@/interfaces/customs'
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'

const URL_PATH = `${URL_PATH_INVESTMENT_PORTFOLIO}/permits-quotas-counterpart`

const mockDefinitionQuotaCounterpartPermitForm: IDefinitionQuotaCounterpartPermitForm =
  {
    id: 1,
    counterpart_id: 1,
    description_counterpart_name: 'Counterpart Name',
    document_counterpart: 1,
    investment_portfolio_id: 1,
    portfolio_code: 'Portfolio Code',
    description_portfolio_name: 'Portfolio Name',
    general_quota: 1,
    type_of_investment: 'Type of Investment',
    paper_type_id: 1,
    papers: 'Papers',
    history_permits_quotas_counterpart: {
      created_at: '2022-01-01',
      creator_data: 'Creator Data',
      updated_at: '2022-01-01',
      update_data: 'Update Data',
    },
  }

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

describe('useDefinitionQuotaCounterpartPermitStoreV1', () => {
  let store: ReturnType<typeof useDefinitionQuotaCounterpartPermitStoreV1>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useDefinitionQuotaCounterpartPermitStoreV1()
    jest.clearAllMocks()
  })

  describe('_getListAction', () => {
    const filters = '&page=1&filter[search]=0001'
    const filtersEmpty = ''

    const mockDefinitionQuotaCounterpartPermitListResponse: IDefinitionQuotaCounterpartPermitList =
      [mockDefinitionQuotaCounterpartPermitForm]

    it('should fetch definition quota counterpart permit list successfully', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Success',
          data: {
            data: mockDefinitionQuotaCounterpartPermitListResponse,
            current_page: 1,
            last_page: 1,
            per_page: 10,
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getListAction(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/list?paginate=1${filters}`
      )
      expect(store.data_list).toEqual(
        mockDefinitionQuotaCounterpartPermitListResponse
      )
      expect(store.data_pages).toEqual({
        currentPage: 1,
        lastPage: 1,
        per_page: 10,
      })
    })

    it('should fetch definition quota counterpart permit list successfully without filters', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Success without filters',
          data: {
            data: mockDefinitionQuotaCounterpartPermitListResponse,
            current_page: 1,
            last_page: 1,
            per_page: 10,
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getListAction(filtersEmpty)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/list?paginate=1${filtersEmpty}`
      )
      expect(store.data_list).toEqual(
        mockDefinitionQuotaCounterpartPermitListResponse
      )
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
            per_page: 10,
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      await store._getListAction(filters)

      expect(mockGet).toHaveBeenCalled()
      expect(store.data_list).toEqual([])
    })

    it('handles error when fetching definition quota counterpart permit list fails', async () => {
      // Arrange
      const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getListAction(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/list?paginate=1${filters}`
      )
      expect(store.data_list).toEqual([])
    })
  })

  describe('_getByIdAction', () => {
    it('should fetch definition quota counterpart permit by ID successfully', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Success',
          data: mockDefinitionQuotaCounterpartPermitForm,
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getByIdAction(1)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/show/1`)
      expect(store.data_view).toEqual(mockDefinitionQuotaCounterpartPermitForm)
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
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/show/1`)
      expect(store.data_view).toBeNull()
    })

    it('handles error when fetching definition quota counterpart permit by ID fails', async () => {
      // Arrange
      const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getByIdAction(1)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/show/1`)
      expect(store.data_view).toBeNull()
    })
  })

  describe('_createAction', () => {
    it('should handle response without success property', async () => {
      // Arrange
      const mockPost = jest.fn().mockResolvedValue({
        data: {
          message: 'Response without success',
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._createAction(
        {} as IDefinitionQuotaCounterpartPermitRequest
      )

      // Assert
      expect(result).toBe(false)
    })

    it('should create a new definition quota counterpart permit successfully', async () => {
      // Arrange
      const mockPost = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Created successfully',
          data: mockDefinitionQuotaCounterpartPermitForm,
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._createAction(
        mockDefinitionQuotaCounterpartPermitForm
      )

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH}/new`,
        mockDefinitionQuotaCounterpartPermitForm
      )
      expect(result).toBe(true)
    })

    it('should handle API success=false on create', async () => {
      const mockPost = jest.fn().mockResolvedValue({
        data: { success: false, message: 'Error', data: null },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const result = await store._createAction(
        mockDefinitionQuotaCounterpartPermitForm
      )
      expect(result).toBe(false)
    })

    it('handles error when creating definition quota counterpart permit fails', async () => {
      // Arrange
      const mockPost = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._createAction(
        mockDefinitionQuotaCounterpartPermitForm
      )

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH}/new`,
        mockDefinitionQuotaCounterpartPermitForm
      )
      expect(result).toBe(false)
    })
  })

  describe('_updateAction', () => {
    const id = 1

    it('should update an existing definition quota counterpart permit successfully', async () => {
      // Arrange
      const mockPut = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Updated',
          data: {
            id: id,
            ...mockDefinitionQuotaCounterpartPermitForm,
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      // Act
      const result = await store._updateAction(
        mockDefinitionQuotaCounterpartPermitForm,
        id
      )

      // Assert
      expect(mockPut).toHaveBeenCalledWith(
        `${URL_PATH}/update/${id}`,
        mockDefinitionQuotaCounterpartPermitForm
      )
      expect(result).toBe(true)
    })

    it('should handle API success=false on update', async () => {
      const mockPut = jest.fn().mockResolvedValue({
        data: { success: false, message: 'Error', data: null },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      const result = await store._updateAction(
        mockDefinitionQuotaCounterpartPermitForm,
        id
      )
      expect(result).toBe(false)
    })

    it('handles error when updating definition quota counterpart permit fails', async () => {
      // Arrange
      const mockPut = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      // Act
      const result = await store._updateAction(
        mockDefinitionQuotaCounterpartPermitForm,
        id
      )

      // Assert
      expect(mockPut).toHaveBeenCalledWith(
        `${URL_PATH}/update/${id}`,
        mockDefinitionQuotaCounterpartPermitForm
      )
      expect(result).toBe(false)
    })
  })

  describe('_deleteAction', () => {
    const id = 1

    it('should handle response without success property', async () => {
      // Arrange
      const mockDelete = jest.fn().mockResolvedValue({
        data: {
          message: 'Response without success',
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

      // Act
      const result = await store._deleteAction(id)

      // Assert
      expect(result).toBe(false)
    })

    it('should delete an definition quota counterpart permit successfully', async () => {
      // Arrange
      const mockDelete = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Deleted successfully',
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

      // Act
      const result = await store._deleteAction(id)

      // Assert
      expect(mockDelete).toHaveBeenCalledWith(`${URL_PATH}/destroy/${id}`)
      expect(result).toBe(true)
    })

    it('should handle API success=false on delete', async () => {
      const mockDelete = jest.fn().mockResolvedValue({
        data: { success: false, message: 'Error', data: null },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

      const result = await store._deleteAction(id)
      expect(result).toBe(false)
    })

    it('handles error when deleting definition quota counterpart permit fails', async () => {
      // Arrange
      const mockDelete = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

      // Act
      const result = await store._deleteAction(id)

      // Assert
      expect(mockDelete).toHaveBeenCalledWith(`${URL_PATH}/destroy/${id}`)
      expect(result).toBe(false)
    })
  })

  describe('_setDataForm', () => {
    it('should set the form data', () => {
      // Arrange
      const formData = mockDefinitionQuotaCounterpartPermitForm

      // Act
      store._setDataForm(formData)

      // Assert
      expect(store.data_form).toEqual(formData)
    })

    it('should clear form data when passed null', () => {
      store.data_form = {} as IDefinitionQuotaCounterpartPermitForm
      store._setDataForm(null)
      expect(store.data_form).toBeNull()
    })
  })

  describe('_clearData', () => {
    it('should clear all data from the store', () => {
      // Arrange
      store.data_list = [{ id: 1 } as IDefinitionQuotaCounterpartPermitForm]
      store.data_view = {} as IDefinitionQuotaCounterpartPermitForm
      store.data_form = {} as IDefinitionQuotaCounterpartPermitForm
      store.data_pages = {
        currentPage: 1,
        lastPage: 1,
        per_page: 10,
      }

      // Act
      store._clearData()

      // Assert
      expect(store.data_list).toEqual([])
      expect(store.data_view).toBeNull()
      expect(store.data_form).toBeNull()
      expect(store.data_pages).toEqual({
        currentPage: 0,
        lastPage: 0,
        per_page: 0,
      })
    })
  })
})
