import { setActivePinia, createPinia } from 'pinia'
import { useForeignCurrencyWithdrawalStoreV1 } from '@/stores/investment-portfolio/registration-withdrawal-participation-foreign/foreign-currency-withdrawal-v1'
import { executeApi } from '@/apis'
import type { IForeignCurrencyWithdrawalParticipationForm } from '@/interfaces/customs'
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'

const URL_PATH = `${URL_PATH_INVESTMENT_PORTFOLIO}/withdrawal-participation-fic/foreign-currency`

const mockForeignCurrencyWithdrawalForm: IForeignCurrencyWithdrawalParticipationForm =
  {
    investment_portfolio_id: 101,
    investment_portfolio_description: 'Portafolio Internacional USD',
    operation_date: '2025-09-10', // ISO YYYY-MM-DD

    issuer_id: 3001,
    issuer_description: 'JP Morgan Securities',

    counterparty_id: 4502,
    counterparty_description: 'Banco XYZ',

    administrator_id: 12,
    administrator_description: 'Administrador Alpha',

    details: {
      unit_value: 10.5,
      portfolio_class: 'Clase A',
      operation_type_id: 7,
      cash_operation_days: 2,
    },

    compliance: {
      withdrawal_value_origin_currency: 100000,
      compliance_date: '2025-09-12',
      placement_resource_date: '2025-09-13',
    },
  }

const ForeignCurrencyWithdrawalId = 1

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

describe('useForeignCurrencyWithdrawalStoreV1', () => {
  let store: ReturnType<typeof useForeignCurrencyWithdrawalStoreV1>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useForeignCurrencyWithdrawalStoreV1()
    jest.clearAllMocks()
  })

  describe('_getForeignCurrencyWithdrawal', () => {
    const filters = '&page=1&filter[search]=0001'
    const filtersEmpty = ''

    const mockForeignCurrencyWithdrawalList: any = [
      {
        id: 1,
        system_code: 'INV123',
        business_group: 1,
        accounting_structure: 1,
        cost_center: 'Centro de Costos A',
      },
    ]

    it('should fetch definition accounting parameters successfully', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Success',
          data: {
            data: mockForeignCurrencyWithdrawalList,
            current_page: 1,
            last_page: 1,
            total: 1,
            per_page: 10,
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getForeignCurrencyWithdrawal(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/list?paginate=1${filters}`
      )
      expect(store.definition_accounting_parameters_list).toEqual(
        mockForeignCurrencyWithdrawalList
      )
      expect(store.definition_accounting_parameters_pages).toEqual({
        currentPage: 1,
        lastPage: 1,
        total_items: 1,
        per_page: 10,
      })
    })

    it('should fetch definition accounting parameters successfully without filters', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Success without filters',
          data: {
            data: mockForeignCurrencyWithdrawalList,
            current_page: 1,
            last_page: 1,
            total: 1,
            per_page: 10,
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getForeignCurrencyWithdrawal(filtersEmpty)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/list?paginate=1${filtersEmpty}`
      )
      expect(store.definition_accounting_parameters_list).toEqual(
        mockForeignCurrencyWithdrawalList
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

      await store._getForeignCurrencyWithdrawal(filters)

      expect(mockGet).toHaveBeenCalled()
      expect(store.definition_accounting_parameters_list).toEqual([])
    })

    it('handles error when fetching definition accounting parameters fails', async () => {
      // Arrange
      const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getForeignCurrencyWithdrawal(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/list?paginate=1${filters}`
      )
      expect(store.definition_accounting_parameters_list).toEqual([])
    })
  })

  describe('_getByIdForeignCurrencyWithdrawal', () => {
    it('should fetch definition accounting parameters by ID successfully', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Success',
          data: mockForeignCurrencyWithdrawalForm,
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getByIdForeignCurrencyWithdrawal(1)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/show/1`)
      expect(store.definition_accounting_parameters_view).toEqual(
        mockForeignCurrencyWithdrawalForm
      )
    })

    it('should handle API success=false or no data', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: { success: false, message: 'Not found', data: null },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getByIdForeignCurrencyWithdrawal(1)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/show/1`)
      expect(store.definition_accounting_parameters_view).toBeNull()
    })

    it('handles error when fetching definition accounting parameters by ID fails', async () => {
      // Arrange
      const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getByIdForeignCurrencyWithdrawal(1)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/show/1`)
      expect(store.definition_accounting_parameters_view).toBeNull()
    })
  })

  describe('_createForeignCurrencyWithdrawal', () => {
    it('should create a new definition accounting parameters successfully', async () => {
      // Arrange
      const mockPost = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Created',
          data: mockForeignCurrencyWithdrawalForm,
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._createForeignCurrencyWithdrawal(
        mockForeignCurrencyWithdrawalForm
      )

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH}`,
        mockForeignCurrencyWithdrawalForm
      )
      expect(result).toBe(true)
    })

    it('should handle API success=false on create', async () => {
      const mockPost = jest.fn().mockResolvedValue({
        data: { success: false, message: 'Error', data: null },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const result = await store._createForeignCurrencyWithdrawal(
        mockForeignCurrencyWithdrawalForm
      )
      expect(result).toBe(false)
    })

    it('handles error when creating definition accounting parameters fails', async () => {
      // Arrange
      const mockPost = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._createForeignCurrencyWithdrawal(
        mockForeignCurrencyWithdrawalForm
      )

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH}`,
        mockForeignCurrencyWithdrawalForm
      )
      expect(result).toBe(false)
    })
  })

  describe('_updateForeignCurrencyWithdrawal', () => {
    it('should update an existing definition accounting parameters successfully', async () => {
      // Arrange
      const mockPut = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Updated',
          data: {
            id: ForeignCurrencyWithdrawalId,
            ...mockForeignCurrencyWithdrawalForm,
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      // Act
      const result = await store._updateForeignCurrencyWithdrawal(
        mockForeignCurrencyWithdrawalForm,
        ForeignCurrencyWithdrawalId
      )

      // Assert
      expect(mockPut).toHaveBeenCalledWith(
        `${URL_PATH}/update/${ForeignCurrencyWithdrawalId}`,
        mockForeignCurrencyWithdrawalForm
      )
      expect(result).toBe(true)
    })

    it('should handle API success=false on update', async () => {
      const mockPut = jest.fn().mockResolvedValue({
        data: { success: false, message: 'Error', data: null },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      const result = await store._updateForeignCurrencyWithdrawal(
        mockForeignCurrencyWithdrawalForm,
        ForeignCurrencyWithdrawalId
      )
      expect(result).toBe(false)
    })

    it('handles error when updating definition accounting parameters fails', async () => {
      // Arrange
      const mockPut = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      // Act
      const result = await store._updateForeignCurrencyWithdrawal(
        mockForeignCurrencyWithdrawalForm,
        ForeignCurrencyWithdrawalId
      )

      // Assert
      expect(mockPut).toHaveBeenCalledWith(
        `${URL_PATH}/update/${ForeignCurrencyWithdrawalId}`,
        mockForeignCurrencyWithdrawalForm
      )
      expect(result).toBe(false)
    })
  })

  describe('_deleteForeignCurrencyWithdrawal', () => {
    it('should delete an definition accounting parameters successfully', async () => {
      // Arrange
      const mockDelete = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Deleted',
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

      // Act
      const result = await store._deleteForeignCurrencyWithdrawal(
        ForeignCurrencyWithdrawalId
      )

      // Assert
      expect(mockDelete).toHaveBeenCalledWith(
        `${URL_PATH}/destroy/${ForeignCurrencyWithdrawalId}`
      )
      expect(result).toBe(true)
    })

    it('should handle API success=false on delete', async () => {
      const mockDelete = jest.fn().mockResolvedValue({
        data: { success: false, message: 'Error', data: null },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

      const result = await store._deleteForeignCurrencyWithdrawal(
        ForeignCurrencyWithdrawalId
      )
      expect(result).toBe(false)
    })

    it('handles error when deleting definition accounting parameters fails', async () => {
      // Arrange
      const mockDelete = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

      // Act
      const result = await store._deleteForeignCurrencyWithdrawal(
        ForeignCurrencyWithdrawalId
      )

      // Assert
      expect(mockDelete).toHaveBeenCalledWith(
        `${URL_PATH}/destroy/${ForeignCurrencyWithdrawalId}`
      )
      expect(result).toBe(false)
    })
  })

  describe('_setForeignCurrencyWithdrawalForm', () => {
    it('should set the form data', () => {
      // Arrange
      const formData = mockForeignCurrencyWithdrawalForm

      // Act
      store._setForeignCurrencyWithdrawalForm(formData)

      // Assert
      expect(store.definition_accounting_parameters_form).toEqual(formData)
    })

    it('should clear form data when passed null', () => {
      store.definition_accounting_parameters_form =
        {} as IForeignCurrencyWithdrawalParticipationForm
      store._setForeignCurrencyWithdrawalForm(null)
      expect(store.definition_accounting_parameters_form).toBeNull()
    })
  })

  describe('_clearData', () => {
    it('should clear all data from the store', () => {
      // Arrange
      store.definition_accounting_parameters_form =
        {} as IForeignCurrencyWithdrawalParticipationForm
      store.definition_accounting_parameters_details = {} as any
      store.definition_accounting_parameters_positions = {} as any
      store.definition_accounting_parameters_derivates = {} as any

      // Act
      store._clearData()

      // Assert
      expect(store.definition_accounting_parameters_form).toBeNull()
      expect(store.definition_accounting_parameters_details).toBeNull()
      expect(store.definition_accounting_parameters_positions).toBeNull()
      expect(store.definition_accounting_parameters_derivates).toBeNull()
    })
  })
})
