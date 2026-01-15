import { setActivePinia, createPinia } from 'pinia'
import { executeApi } from '@/apis'
import type { ILocalCurrencyWithdrawalParticipationForm } from '@/interfaces/customs'
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import { useLocalCurrencyWithdrawalStoreV1 } from './local-currency-withdrawal-v1'

const URL_PATH = `${URL_PATH_INVESTMENT_PORTFOLIO}/withdrawal-participation-fic/local-currency`

const mockLocalCurrencyWithdrawalForm: ILocalCurrencyWithdrawalParticipationForm =
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
      paper_type_id: null,
      currency_id: null,
      value_currency: null,
      withdrawal_value: null,
      paper_type: null,
    },
    currency_id: null,
    value_currency: null,
    cash_value_currency: null,
    withdrawal_value: null,
    portfolio_class: null,
    security_type: null,
    origin_currency: null,
    isin: null,
    participation_count: null,
    title_count: null,
    current_participation_balance_in_pesos: null,
    current_balance_in_units: null,
    participation_balance_in_pesos: null,
    operation_code: null,
    operation_description: null,
    cash_operation_days: null,
    unit: null,
    currency_value: null,
    conversion_factor: null,
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

describe('useLocalCurrencyWithdrawalStoreV1', () => {
  let store: ReturnType<typeof useLocalCurrencyWithdrawalStoreV1>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useLocalCurrencyWithdrawalStoreV1()
    jest.clearAllMocks()
  })

  describe('_getLocalCurrencyWithdrawal', () => {
    const filters = '&page=1&filter[search]=0001'
    const filtersEmpty = ''

    const mockLocalCurrencyWithdrawalList: any = [
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
            data: mockLocalCurrencyWithdrawalList,
            current_page: 1,
            last_page: 1,
            total: 1,
            per_page: 10,
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getLocalCurrencyWithdrawal(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/list?paginate=1${filters}`
      )
      expect(store.definition_accounting_parameters_list).toEqual(
        mockLocalCurrencyWithdrawalList
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
            data: mockLocalCurrencyWithdrawalList,
            current_page: 1,
            last_page: 1,
            total: 1,
            per_page: 10,
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getLocalCurrencyWithdrawal(filtersEmpty)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/list?paginate=1${filtersEmpty}`
      )
      expect(store.definition_accounting_parameters_list).toEqual(
        mockLocalCurrencyWithdrawalList
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

      await store._getLocalCurrencyWithdrawal(filters)

      expect(mockGet).toHaveBeenCalled()
      expect(store.definition_accounting_parameters_list).toEqual([])
    })

    it('handles error when fetching definition accounting parameters fails', async () => {
      // Arrange
      const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getLocalCurrencyWithdrawal(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/list?paginate=1${filters}`
      )
      expect(store.definition_accounting_parameters_list).toEqual([])
    })
  })

  describe('_createLocalCurrencyWithdrawal', () => {
    it('should create a new definition accounting parameters successfully', async () => {
      // Arrange
      const mockPost = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Created',
          data: mockLocalCurrencyWithdrawalForm,
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._createLocalCurrencyWithdrawal(
        mockLocalCurrencyWithdrawalForm
      )

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH}`,
        mockLocalCurrencyWithdrawalForm
      )
      expect(result).toBe(true)
    })

    it('should handle API success=false on create', async () => {
      const mockPost = jest.fn().mockResolvedValue({
        data: { success: false, message: 'Error', data: null },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const result = await store._createLocalCurrencyWithdrawal(
        mockLocalCurrencyWithdrawalForm
      )
      expect(result).toBe(false)
    })

    it('handles error when creating definition accounting parameters fails', async () => {
      // Arrange
      const mockPost = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._createLocalCurrencyWithdrawal(
        mockLocalCurrencyWithdrawalForm
      )

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH}`,
        mockLocalCurrencyWithdrawalForm
      )
      expect(result).toBe(false)
    })
  })

  describe('_setLocalCurrencyWithdrawalForm', () => {
    it('should set the form data', () => {
      // Arrange
      const formData = mockLocalCurrencyWithdrawalForm

      // Act
      store._setLocalCurrencyWithdrawalForm(formData)

      // Assert
      expect(store.definition_accounting_parameters_form).toEqual(formData)
    })

    it('should clear form data when passed null', () => {
      store.definition_accounting_parameters_form =
        {} as ILocalCurrencyWithdrawalParticipationForm
      store._setLocalCurrencyWithdrawalForm(null)
      expect(store.definition_accounting_parameters_form).toBeNull()
    })
  })

  describe('_clearData', () => {
    it('should clear all data from the store', () => {
      // Arrange
      store.definition_accounting_parameters_form =
        {} as ILocalCurrencyWithdrawalParticipationForm
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
