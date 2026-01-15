import { setActivePinia, createPinia } from 'pinia'
import { useAccountingBlocksStoreV1 } from '@/stores/treasury/accounting-blocks/accounting-blocks-v1'
import { executeApi } from '@/apis'
import type {
  IAccountingBlockInformationForm,
  IAccountingBlockResponse,
} from '@/interfaces/customs'
import { URL_PATH_TREASURIES } from '@/constants/apis'

const URL_PATH = `${URL_PATH_TREASURIES}/accounting-blocks`

const mockAccountingBlockInformationForm: IAccountingBlockInformationForm = {
  account_structure_id: 1,
  treasury_movement_code_id: 1,
  movement_name: 'Nuevo Movimiento',
  movement_nature: 'Movimiento',
  account_chart_id: 1,
  third_type: 'Específico',
  third_party_id: 1,
  movement_funds_processes: true,
  code_movement_funds: 1,
  gmf_associate_affects: true,
  demand_investment_plan: false,
  amortizes_funds: false,
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

describe('useAccountingBlocksStoreV1', () => {
  let store: ReturnType<typeof useAccountingBlocksStoreV1>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useAccountingBlocksStoreV1()
    jest.clearAllMocks()
  })

  describe('_getAccountingBlocks', () => {
    const filters = '&page=1&filter[structure]=001&filter[search]=0001'
    const filtersEmpty = ''

    const mockAccountingBlocksResponse: IAccountingBlockResponse[] = [
      {
        id: 1,
        structure: '001',
        movement: '0001',
        movement_nature: 'Movimiento',
        accounting_account: {
          code: '110505',
          name: 'Bancos',
        },
        third_type: 'Específico',
        third_party: {
          code: 'BT001',
          name: 'Fiducuenta',
        },
        movement_funds_processes: true,
        code_movement_funds: '00001',
        demand_investment_plan: false,
        gmf_associate_affects: true,
        amortizes_funds: false,
      },
    ]

    it('should fetch accounting blocks successfully', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Success',
          data: {
            data: mockAccountingBlocksResponse,
            current_page: 1,
            last_page: 1,
            total: 1,
            per_page: 10,
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getAccountingBlocks(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}?paginate=1${filters}`)
      expect(store.accounting_blocks_list).toEqual(mockAccountingBlocksResponse)
      expect(store.accounting_blocks_pages).toEqual({
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
            data: mockAccountingBlocksResponse,
            current_page: 1,
            last_page: 1,
            total: 1,
            per_page: 10,
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getAccountingBlocks(filtersEmpty)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}?paginate=1${filtersEmpty}`
      )
      expect(store.accounting_blocks_list).toEqual(mockAccountingBlocksResponse)
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

      await store._getAccountingBlocks(filters)

      expect(mockGet).toHaveBeenCalled()
      expect(store.accounting_blocks_list).toEqual([])
    })

    it('handles error when fetching accounting blocks fails', async () => {
      // Arrange
      const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getAccountingBlocks(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}?paginate=1${filters}`)
      expect(store.accounting_blocks_list).toEqual([])
    })
  })

  describe('_getByIdAccountingBlock', () => {
    it('should fetch accounting block by ID successfully', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Success',
          data: mockAccountingBlockInformationForm,
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getByIdAccountingBlock(1)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/1`)
      expect(store.accounting_blocks_response).toEqual(
        mockAccountingBlockInformationForm
      )
    })

    it('should handle API success=false or no data', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: { success: false, message: 'Not found', data: null },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getByIdAccountingBlock(1)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/1`)
      expect(store.accounting_blocks_response).toBeNull()
    })

    it('handles error when fetching accounting block by ID fails', async () => {
      // Arrange
      const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getByIdAccountingBlock(1)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/1`)
      expect(store.accounting_blocks_response).toBeNull()
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
    const accountingBlockId = 1

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

  describe('_deleteAccountingBlock', () => {
    const accountingBlockId = 1

    it('should delete an accounting block successfully', async () => {
      // Arrange
      const mockDelete = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Deleted',
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

      // Act
      const result = await store._deleteAccountingBlock(accountingBlockId)

      // Assert
      expect(mockDelete).toHaveBeenCalledWith(
        `${URL_PATH}/${accountingBlockId}`
      )
      expect(result).toBe(true)
    })

    it('should handle API success=false on delete', async () => {
      const mockDelete = jest.fn().mockResolvedValue({
        data: { success: false, message: 'Error', data: null },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

      const result = await store._deleteAccountingBlock(accountingBlockId)
      expect(result).toBe(false)
    })

    it('handles error when deleting accounting block fails', async () => {
      // Arrange
      const mockDelete = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

      // Act
      const result = await store._deleteAccountingBlock(accountingBlockId)

      // Assert
      expect(mockDelete).toHaveBeenCalledWith(
        `${URL_PATH}/${accountingBlockId}`
      )
      expect(result).toBe(false)
    })
  })

  describe('_setDataInformationFormAccountingBlock', () => {
    it('should set the form data', () => {
      // Arrange
      const formData = mockAccountingBlockInformationForm

      // Act
      store._setDataInformationForm(formData)

      // Assert
      expect(store.data_information_form).toEqual(formData)
    })

    it('should clear form data when passed null', () => {
      store.data_information_form = {} as IAccountingBlockInformationForm
      store._setDataInformationForm(null)
      expect(store.data_information_form).toBeNull()
    })
  })

  describe('_clearDataAccountingBlock', () => {
    it('should clear all data from the store', () => {
      // Arrange
      store.accounting_blocks_list = [{ id: 1 } as IAccountingBlockResponse]
      store.accounting_blocks_response = {} as IAccountingBlockInformationForm
      store.data_information_form = {} as IAccountingBlockInformationForm
      store.accounting_blocks_pages = {
        currentPage: 1,
        lastPage: 1,
        total_items: 10,
        per_page: 10,
      }

      // Act
      store._clearData()

      // Assert
      expect(store.accounting_blocks_list).toEqual([])
      expect(store.accounting_blocks_response).toBeNull()
      expect(store.data_information_form).toBeNull()
      expect(store.accounting_blocks_pages).toEqual({
        currentPage: 0,
        lastPage: 0,
        total_items: 0,
        per_page: 0,
      })
    })
  })
})
