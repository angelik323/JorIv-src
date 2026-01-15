// Vue - Pinia
import { setActivePinia, createPinia } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import type {
  IAccountingParametersAccountingBlockForm,
  IAccountingParametersAccountingBlockList,
  IAccountingParametersAccountingBlockView,
} from '@/interfaces/customs/fics/AccountingBlocks'

// Constants
import { URL_PATH_FICS } from '@/constants/apis'

// Store
import { useAccountingParametersAccountingBlockStoreV1 } from '@/stores/fics/accounting-parameters/accounting-block/accounting-block-v1'

const URL_PATH = `${URL_PATH_FICS}/accounting-blocks`

const accountingBlockId: number = 1

const mockAccountingBlockList: IAccountingParametersAccountingBlockList = {
  id: 7,
  business_group: {
    id: 10,
    name: 'Sociedad fiduciaria',
    indice: 0,
    code: '010',
    sub_types: [
      {
        id: 20,
        name: 'Sociedad fiduciaria.',
        indice: 0,
        business_type_id: 10,
      },
    ],
  },
  accounting_plan: {
    id: 59,
    code: '059',
    purpose: 'Plan General de Contabilidad',
  },
  plan_cost_center: {
    id: 56,
    code: '056',
    purpose: 'prue3',
  },
  business_group_id: 10,
  accounting_plan_id: 59,
  plan_cost_center_id: 56,
  budget_block_id: 1,
  can_edit: false,
}

const mockAccountingBlockListResponse: IAccountingParametersAccountingBlockList[] =
  [mockAccountingBlockList]

const mockAccountingBlockInformationView: IAccountingParametersAccountingBlockView =
  {
    id: accountingBlockId,
    business_group_id: 1,
    accounting_plan_id: 1,
    plan_cost_center_id: 1,
    budget_block_id: 1,
    created_by_form: true,
  }

const mockAccountingBlockInformationForm: IAccountingParametersAccountingBlockForm =
  {
    ...mockAccountingBlockInformationView,
    consecutive: accountingBlockId,
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

describe('useAccountingParametersAccountingBlockStoreV1', () => {
  let store: ReturnType<typeof useAccountingParametersAccountingBlockStoreV1>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useAccountingParametersAccountingBlockStoreV1()
    jest.clearAllMocks()
  })

  describe('_getAccountingBlock', () => {
    const filters = '&page=1&filter[structure]=001&filter[search]=0001'
    const filtersEmpty = ''

    it('should fetch accounting blocks successfully', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Success',
          data: {
            data: mockAccountingBlockListResponse,
            current_page: 1,
            last_page: 1,
            total: 1,
            per_page: 10,
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getAccountingBlock(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}?paginate=1${filters}`)
      expect(store.accounting_block_list).toEqual(
        mockAccountingBlockListResponse
      )
      expect(store.accounting_block_pages).toEqual({
        currentPage: 1,
        lastPage: 1,
        total_items: 1,
        per_page: 10,
      })
    })

    it('should fetch accounting blocks successfully without filters', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Success without filters',
          data: {
            data: mockAccountingBlockListResponse,
            current_page: 1,
            last_page: 1,
            total: 1,
            per_page: 10,
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getAccountingBlock(filtersEmpty)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}?paginate=1${filtersEmpty}`
      )
      expect(store.accounting_block_list).toEqual(
        mockAccountingBlockListResponse
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
            total: 0,
            per_page: 10,
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      await store._getAccountingBlock(filters)

      expect(mockGet).toHaveBeenCalled()
      expect(store.accounting_block_list).toEqual([])
    })

    it('handles error when fetching accounting blocks fails', async () => {
      // Arrange
      const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getAccountingBlock(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}?paginate=1${filters}`)
      expect(store.accounting_block_list).toEqual([])
    })

    it('should handle missing data gracefully', async () => {
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Sin datos',
          data: {},
        },
      })

      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      await store._getAccountingBlock(filters)

      expect(store.accounting_block_list).toEqual([])
      expect(store.accounting_block_pages).toEqual({
        currentPage: 0,
        lastPage: 0,
        total_items: 0,
        per_page: 0,
      })
    })
  })

  describe('_getByIdAccountingBlock', () => {
    it('should fetch accounting block by ID successfully', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Success',
          data: mockAccountingBlockInformationView,
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getByIdAccountingBlock(accountingBlockId)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/${accountingBlockId}`)
      expect(store.accounting_block_view).toEqual(
        mockAccountingBlockInformationView
      )
    })

    it('should handle API success=false or no data', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: { success: false, message: 'Not found', data: null },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getByIdAccountingBlock(accountingBlockId)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/${accountingBlockId}`)
      expect(store.accounting_block_view).toBeNull()
    })

    it('handles error when fetching accounting block by ID fails', async () => {
      // Arrange
      const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getByIdAccountingBlock(accountingBlockId)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/${accountingBlockId}`)
      expect(store.accounting_block_view).toBeNull()
    })
  })

  describe('_createAccountingBlock', () => {
    it('should create a new accounting block successfully', async () => {
      // Arrange
      const mockPost = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Created',
          data: mockAccountingBlockInformationForm,
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._createAccountingBlock(
        mockAccountingBlockInformationForm
      )

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH}`,
        mockAccountingBlockInformationForm
      )
      expect(result).toBe(true)
    })

    it('should handle API success=false on create', async () => {
      const mockPost = jest.fn().mockResolvedValue({
        data: { success: false, message: 'Error', data: null },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const result = await store._createAccountingBlock(
        mockAccountingBlockInformationForm
      )
      expect(result).toBe(false)
    })

    it('handles error when creating accounting block fails', async () => {
      // Arrange
      const mockPost = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._createAccountingBlock(
        mockAccountingBlockInformationForm
      )

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH}`,
        mockAccountingBlockInformationForm
      )
      expect(result).toBe(false)
    })
  })

  describe('_updateAccountingBlock', () => {
    it('should update an existing accounting block successfully', async () => {
      // Arrange
      const mockPut = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Updated',
          data: {
            id: accountingBlockId,
            ...mockAccountingBlockInformationForm,
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      // Act
      const result = await store._updateAccountingBlock(
        mockAccountingBlockInformationForm,
        accountingBlockId
      )

      // Assert
      expect(mockPut).toHaveBeenCalledWith(
        `${URL_PATH}/${accountingBlockId}`,
        mockAccountingBlockInformationForm
      )
      expect(result).toBe(true)
    })

    it('should handle API success=false on update', async () => {
      const mockPut = jest.fn().mockResolvedValue({
        data: { success: false, message: 'Error', data: null },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      const result = await store._updateAccountingBlock(
        mockAccountingBlockInformationForm,
        accountingBlockId
      )
      expect(result).toBe(false)
    })

    it('handles error when updating accounting block fails', async () => {
      // Arrange
      const mockPut = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      // Act
      const result = await store._updateAccountingBlock(
        mockAccountingBlockInformationForm,
        accountingBlockId
      )

      // Assert
      expect(mockPut).toHaveBeenCalledWith(
        `${URL_PATH}/${accountingBlockId}`,
        mockAccountingBlockInformationForm
      )
      expect(result).toBe(false)
    })
  })

  describe('_setAccountingBlockForm', () => {
    it('should set the form data', () => {
      // Arrange
      const formData = mockAccountingBlockInformationForm

      // Act
      store._setAccountingBlockForm(formData)

      // Assert
      expect(store.accounting_block_form).toEqual(formData)
    })

    it('should clear form data when passed null', () => {
      store.accounting_block_form =
        {} as IAccountingParametersAccountingBlockForm
      store._setAccountingBlockForm(null)
      expect(store.accounting_block_form).toBeNull()
    })
  })

  describe('_setAccountingBlockSelected', () => {
    it('should set the selected data', () => {
      // Arrange
      const selectedData = mockAccountingBlockList

      // Act
      store._setAccountingBlockSelected(selectedData)

      // Assert
      expect(store.accounting_block_selected).toEqual(selectedData)
    })

    it('should clear selected data when passed null', () => {
      store.accounting_block_selected =
        {} as IAccountingParametersAccountingBlockList
      store._setAccountingBlockSelected(null)
      expect(store.accounting_block_selected).toBeNull()
    })
  })

  describe('_setAccountingBlockView', () => {
    it('should set the view data', () => {
      // Arrange
      const viewData = mockAccountingBlockInformationView

      // Act
      store._setAccountingBlockView(viewData)

      // Assert
      expect(store.accounting_block_view).toEqual(viewData)
    })

    it('should clear view data when passed null', () => {
      store.accounting_block_view =
        {} as IAccountingParametersAccountingBlockView
      store._setAccountingBlockView(null)
      expect(store.accounting_block_view).toBeNull()
    })
  })

  describe('_clearDataAccountingBlock', () => {
    it('should clear all data from the store', () => {
      // Arrange
      store.accounting_block_list = [
        mockAccountingBlockList as IAccountingParametersAccountingBlockList,
      ]
      store.accounting_block_view =
        {} as IAccountingParametersAccountingBlockView
      store.accounting_block_form =
        {} as IAccountingParametersAccountingBlockForm
      store.accounting_block_pages = {
        currentPage: 1,
        lastPage: 1,
        total_items: 10,
        per_page: 10,
      }

      // Act
      store._clearDataAccountingBlock()

      // Assert
      expect(store.accounting_block_list).toEqual([])
      expect(store.accounting_block_view).toBeNull()
      expect(store.accounting_block_form).toBeNull()
      expect(store.accounting_block_pages).toEqual({
        currentPage: 0,
        lastPage: 0,
        total_items: 0,
        per_page: 0,
      })
    })
  })
})
