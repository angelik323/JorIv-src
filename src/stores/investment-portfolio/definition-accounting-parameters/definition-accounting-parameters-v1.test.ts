import { setActivePinia, createPinia } from 'pinia'
import { useDefinitionAccountingParametersStoreV1 } from '@/stores/investment-portfolio/definition-accounting-parameters/definition-accounting-parameters-v1'
import { executeApi } from '@/apis'
import type {
  IDefinitionAccountingParametersForm,
  IDefinitionAccountingParametersList,
  IDefinitionAccountingParametersDetails,
  IDefinitionAccountingParametersPositions,
  IDefinitionAccountingParametersDerivates,
} from '@/interfaces/customs'
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'

const URL_PATH = `${URL_PATH_INVESTMENT_PORTFOLIO}/definition-accounting-parameters`

const mockDefinitionAccountingParametersForm: IDefinitionAccountingParametersForm =
  {
    id: 1,
    system_code: 'INV123',
    business_group: 'Fiducia de inversión',
    accounting_structure: '0.0.0',
    cost_center: 'Centro de Costos A',
    company_code: 5326987,
    bussiness_description: 'business description',
    created_by: 1,
    updated_by: 1,
    created_at: '2025-07-03T20:32:57.000000Z',
    updated_at: '2025-07-03T20:32:57.000000Z',
    details: [
      {
        id: 1,
        operation_id: 5,
        operation_code: 23555,
        paper_type_id: 14,
        paper_type: 'paper type',
        investment_class: 'DV - Disponible para la venta',
        nature: 'Débito',
        main_match_id: 29937,
        main_match: 'main match',
        auxiliary: 'EM - Emisor',
        cost_center_id: 24,
        cost_center: 'const center',
        higher_account_receivable_id: 93,
        higher_account_receivable: 'high account receivable',
        receivable_auxiliary: 'VE - Vendedor',
        receivable_cost_center_id: 69,
        receivable_cost_center: 'receivable cost center',
        counterparty_account_id: 94,
        counterparty_account: 'counterparty account',
        counterparty_auxiliary: 'CO - Comprador',
        counterparty_cost_center_id: 71,
        counterparty_cost_center: 'counterparty cost center',
        voucher_type_id: 5,
        voucher_type: 'voucher type',
        sub_receipt_types_id: 3,
        sub_receipt_types: 'sub receipt types',
        operation_description: 'Cobro simultánea/repo activo',
      },
    ],
    positions: [
      {
        id: 1,
        operation_code_id: 5,
        operation_code: 23555,
        paper_type_id: 14,
        paper_type: 'paper type',
        investment_class: 'DV - Disponible para la venta',
        position: 'Pasiva',
        main_match_id: 29937,
        main_match: 'main match',
        auxiliary: 'EM - Emisor',
        cost_center_id: 24,
        cost_center: 'const center',
        counterparty_account_id: 94,
        counterparty_account: 'counterparty account',
        nature: 'Débito',
        receivable_cost_center_id: 69,
        receivable_cost_center: 'receivable cost center',
        counterparty_auxiliary: 'CO - Comprador',
        voucher_type_id: 5,
        voucher_type: 'voucher type',
        sub_receipt_types_id: 3,
        sub_receipt_types: 'sub receipt types',
        operation_description: 'Cobro simultánea/repo activo',
      },
    ],
    derivatives: [
      {
        id: 1,
        operation_code_id: 5,
        operation_code: 23555,
        paper_type_id: 14,
        paper_type: 'paper type',
        investment_class: 'IV - Inversiones hasta el vencimiento',
        objective: 'Especulación',
        main_match_id: 29937,
        main_match: 'main match',
        auxiliary: 'CO - Comprador',
        cost_center_id: 24,
        cost_center: 'cost center',
        counterparty_account_id: 94,
        counterparty_account: 'counterparty account',
        nature: 'Débito',
        counterparty_auxiliary: 'CO - Comprador',
        counterparty_cost_center_id: 71,
        counterparty_cost_center: 'counterparty cost center',
        voucher_type_id: 5,
        voucher_type: 'voucher type',
        sub_receipt_types_id: 3,
        sub_receipt_types: 'sub receipt types',
        operation_description: 'Cobro simultánea/repo activo',
      },
    ],
  }

const definitionAccountingParametersId = 1

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

describe('useDefinitionAccountingParametersStoreV1', () => {
  let store: ReturnType<typeof useDefinitionAccountingParametersStoreV1>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useDefinitionAccountingParametersStoreV1()
    jest.clearAllMocks()
  })

  describe('_getDefinitionAccountingParameters', () => {
    const filters = '&page=1&filter[search]=0001'
    const filtersEmpty = ''

    const mockDefinitionAccountingParametersList: IDefinitionAccountingParametersList =
      [
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
            data: mockDefinitionAccountingParametersList,
            current_page: 1,
            last_page: 1,
            total: 1,
            per_page: 10,
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getDefinitionAccountingParameters(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/list?paginate=1${filters}`
      )
      expect(store.definition_accounting_parameters_list).toEqual(
        mockDefinitionAccountingParametersList
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
            data: mockDefinitionAccountingParametersList,
            current_page: 1,
            last_page: 1,
            total: 1,
            per_page: 10,
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getDefinitionAccountingParameters(filtersEmpty)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/list?paginate=1${filtersEmpty}`
      )
      expect(store.definition_accounting_parameters_list).toEqual(
        mockDefinitionAccountingParametersList
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

      await store._getDefinitionAccountingParameters(filters)

      expect(mockGet).toHaveBeenCalled()
      expect(store.definition_accounting_parameters_list).toEqual([])
    })

    it('handles error when fetching definition accounting parameters fails', async () => {
      // Arrange
      const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getDefinitionAccountingParameters(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/list?paginate=1${filters}`
      )
      expect(store.definition_accounting_parameters_list).toEqual([])
    })
  })

  describe('_getByIdDefinitionAccountingParameters', () => {
    it('should fetch definition accounting parameters by ID successfully', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Success',
          data: mockDefinitionAccountingParametersForm,
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getByIdDefinitionAccountingParameters(1)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/show/1`)
      expect(store.definition_accounting_parameters_view).toEqual(
        mockDefinitionAccountingParametersForm
      )
    })

    it('should handle API success=false or no data', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: { success: false, message: 'Not found', data: null },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getByIdDefinitionAccountingParameters(1)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/show/1`)
      expect(store.definition_accounting_parameters_view).toBeNull()
    })

    it('handles error when fetching definition accounting parameters by ID fails', async () => {
      // Arrange
      const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getByIdDefinitionAccountingParameters(1)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/show/1`)
      expect(store.definition_accounting_parameters_view).toBeNull()
    })
  })

  describe('_createDefinitionAccountingParameters', () => {
    it('should create a new definition accounting parameters successfully', async () => {
      // Arrange
      const mockPost = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Created',
          data: mockDefinitionAccountingParametersForm,
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._createDefinitionAccountingParameters(
        mockDefinitionAccountingParametersForm
      )

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH}/new`,
        mockDefinitionAccountingParametersForm
      )
      expect(result).toBe(true)
    })

    it('should handle API success=false on create', async () => {
      const mockPost = jest.fn().mockResolvedValue({
        data: { success: false, message: 'Error', data: null },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const result = await store._createDefinitionAccountingParameters(
        mockDefinitionAccountingParametersForm
      )
      expect(result).toBe(false)
    })

    it('handles error when creating definition accounting parameters fails', async () => {
      // Arrange
      const mockPost = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._createDefinitionAccountingParameters(
        mockDefinitionAccountingParametersForm
      )

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH}/new`,
        mockDefinitionAccountingParametersForm
      )
      expect(result).toBe(false)
    })
  })

  describe('_updateDefinitionAccountingParameters', () => {
    it('should update an existing definition accounting parameters successfully', async () => {
      // Arrange
      const mockPut = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Updated',
          data: {
            id: definitionAccountingParametersId,
            ...mockDefinitionAccountingParametersForm,
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      // Act
      const result = await store._updateDefinitionAccountingParameters(
        mockDefinitionAccountingParametersForm,
        definitionAccountingParametersId
      )

      // Assert
      expect(mockPut).toHaveBeenCalledWith(
        `${URL_PATH}/update/${definitionAccountingParametersId}`,
        mockDefinitionAccountingParametersForm
      )
      expect(result).toBe(true)
    })

    it('should handle API success=false on update', async () => {
      const mockPut = jest.fn().mockResolvedValue({
        data: { success: false, message: 'Error', data: null },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      const result = await store._updateDefinitionAccountingParameters(
        mockDefinitionAccountingParametersForm,
        definitionAccountingParametersId
      )
      expect(result).toBe(false)
    })

    it('handles error when updating definition accounting parameters fails', async () => {
      // Arrange
      const mockPut = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      // Act
      const result = await store._updateDefinitionAccountingParameters(
        mockDefinitionAccountingParametersForm,
        definitionAccountingParametersId
      )

      // Assert
      expect(mockPut).toHaveBeenCalledWith(
        `${URL_PATH}/update/${definitionAccountingParametersId}`,
        mockDefinitionAccountingParametersForm
      )
      expect(result).toBe(false)
    })
  })

  describe('_deleteDefinitionAccountingParameters', () => {
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
      const result = await store._deleteDefinitionAccountingParameters(
        definitionAccountingParametersId
      )

      // Assert
      expect(mockDelete).toHaveBeenCalledWith(
        `${URL_PATH}/destroy/${definitionAccountingParametersId}`
      )
      expect(result).toBe(true)
    })

    it('should handle API success=false on delete', async () => {
      const mockDelete = jest.fn().mockResolvedValue({
        data: { success: false, message: 'Error', data: null },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

      const result = await store._deleteDefinitionAccountingParameters(
        definitionAccountingParametersId
      )
      expect(result).toBe(false)
    })

    it('handles error when deleting definition accounting parameters fails', async () => {
      // Arrange
      const mockDelete = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

      // Act
      const result = await store._deleteDefinitionAccountingParameters(
        definitionAccountingParametersId
      )

      // Assert
      expect(mockDelete).toHaveBeenCalledWith(
        `${URL_PATH}/destroy/${definitionAccountingParametersId}`
      )
      expect(result).toBe(false)
    })
  })

  describe('_setDefinitionAccountingParametersForm', () => {
    it('should set the form data', () => {
      // Arrange
      const formData = mockDefinitionAccountingParametersForm

      // Act
      store._setDefinitionAccountingParametersForm(formData)

      // Assert
      expect(store.definition_accounting_parameters_form).toEqual(formData)
    })

    it('should clear form data when passed null', () => {
      store.definition_accounting_parameters_form =
        {} as IDefinitionAccountingParametersForm
      store._setDefinitionAccountingParametersForm(null)
      expect(store.definition_accounting_parameters_form).toBeNull()
    })
  })

  describe('_setDefinitionAccountingParametersDetails', () => {
    it('should set the form data', () => {
      // Arrange
      const formData = mockDefinitionAccountingParametersForm

      // Act
      const detailsItem = formData.details?.[0] || null
      store._setDefinitionAccountingParametersDetails(detailsItem)

      // Assert
      expect(store.definition_accounting_parameters_details).toEqual(
        detailsItem
      )
    })

    it('should clear form data when passed null', () => {
      store.definition_accounting_parameters_details =
        {} as IDefinitionAccountingParametersDetails
      store._setDefinitionAccountingParametersDetails(null)
      expect(store.definition_accounting_parameters_details).toBeNull()
    })
  })

  describe('_setDefinitionAccountingParametersPositions', () => {
    it('should set the form data', () => {
      // Arrange
      const formData = mockDefinitionAccountingParametersForm

      // Act
      const positionsItem = formData.positions?.[0] || null
      store._setDefinitionAccountingParametersPositions(positionsItem)

      // Assert
      expect(store.definition_accounting_parameters_positions).toEqual(
        positionsItem
      )
    })

    it('should clear form data when passed null', () => {
      store.definition_accounting_parameters_positions =
        {} as IDefinitionAccountingParametersPositions
      store._setDefinitionAccountingParametersPositions(null)
      expect(store.definition_accounting_parameters_positions).toBeNull()
    })
  })

  describe('_setDefinitionAccountingParametersDerivates', () => {
    it('should set the form data', () => {
      // Arrange
      const formData = mockDefinitionAccountingParametersForm

      // Act
      const derivatesItem = formData.derivatives?.[0] || null
      store._setDefinitionAccountingParametersDerivates(derivatesItem)

      // Assert
      expect(store.definition_accounting_parameters_derivates).toEqual(
        derivatesItem
      )
    })

    it('should clear form data when passed null', () => {
      store.definition_accounting_parameters_derivates =
        {} as IDefinitionAccountingParametersDerivates
      store._setDefinitionAccountingParametersDerivates(null)
      expect(store.definition_accounting_parameters_derivates).toBeNull()
    })
  })

  describe('_clearData', () => {
    it('should clear all data from the store', () => {
      // Arrange
      store.definition_accounting_parameters_form =
        {} as IDefinitionAccountingParametersForm
      store.definition_accounting_parameters_details =
        {} as IDefinitionAccountingParametersDetails
      store.definition_accounting_parameters_positions =
        {} as IDefinitionAccountingParametersPositions
      store.definition_accounting_parameters_derivates =
        {} as IDefinitionAccountingParametersDerivates

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
