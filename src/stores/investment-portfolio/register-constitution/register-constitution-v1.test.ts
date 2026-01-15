import { setActivePinia, createPinia } from 'pinia'
import { useRegisterConstitutionStoreV1 } from '@/stores/investment-portfolio/register-constitution/register-constitution-v1'
import { executeApi } from '@/apis'
import {
  IRegisterConstitutionGeneric,
  IRegisterConstitutionValuesForeign,
  IRegisterConstitutionConditions,
  IRegisterConstitutionCurrencyLocal,
  IRegisterConstitutionForeignCurrency,
} from '@/interfaces/customs'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
  })),
}))

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useShowError: jest.fn(() => ({
    showCatchError: jest.fn(() => 'Error capturado'),
  })),
}))

describe('useRegisterConstitutionStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  describe('_getCurrencyForeignAndLocalConstitution', () => {
    it('should fetch constitution list successfully', async () => {
      const store = useRegisterConstitutionStoreV1()
      const mockResponse = {
        data: {
          success: true,
          message: 'Lista obtenida correctamente',
          data: {
            data: [{ id: 1 }, { id: 2 }],
            current_page: 1,
            last_page: 5,
          },
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      await store._getCurrencyForeignAndLocalConstitution('page=1')

      expect(mockGet).toHaveBeenCalledWith(
        expect.stringContaining(
          'investment-portfolio/api/investment-portfolio/fic-participation-constitution-list/list?paginate=1&page=1'
        )
      )
      expect(store.data_constitution_list).toEqual(mockResponse.data.data.data)
      expect(store.data_constitution_pages.currentPage).toBe(
        mockResponse.data.data.current_page
      )
      expect(store.data_constitution_pages.lastPage).toBe(
        mockResponse.data.data.last_page
      )
    })

    it('should handle error in _getCurrencyForeignAndLocalConstitution', async () => {
      const store = useRegisterConstitutionStoreV1()
      const mockGet = jest.fn().mockRejectedValue(new Error('Network error'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      await store._getCurrencyForeignAndLocalConstitution('page=1')

      expect(store.data_constitution_list).toEqual([])
    })
  })

  describe('_createCurrencyLocal', () => {
    it('should create local currency successfully', async () => {
      const store = useRegisterConstitutionStoreV1()
      const payload: IRegisterConstitutionCurrencyLocal = {
        investment_portfolio_id: 1,
        operation_date: '2023-09-24',
        issuer_id: 1,
        counterparty_id: 1,
        administrator_id: 1,
        details: {
          unit_value: 100,
          portfolio_class: 'A',
          currency_id: 1,
          value_currency: 3000,
          operation_type_id: 1,
          paper_type_id: 1,
          isin_id: 1,
          participation_number: 10,
          constitution_value: 1000,
        },
      }

      const mockPost = jest.fn().mockResolvedValue({
        data: { success: true, message: 'Creado correctamente' },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const result = await store._createCurrencyLocal(payload)

      expect(mockPost).toHaveBeenCalledWith(
        expect.stringContaining('/fic-participations-local-currency/new'),
        payload
      )
      expect(result).toBe(true)
    })

    it('should return false on error in _createCurrencyLocal', async () => {
      const store = useRegisterConstitutionStoreV1()
      const payload: IRegisterConstitutionCurrencyLocal = {
        investment_portfolio_id: 1,
        operation_date: '2023-09-24',
        issuer_id: 1,
        counterparty_id: 1,
        administrator_id: 1,
        details: {
          unit_value: 100,
          portfolio_class: 'A',
          currency_id: 1,
          value_currency: 3000,
          operation_type_id: 1,
          paper_type_id: 1,
          isin_id: 1,
          participation_number: 10,
          constitution_value: 1000,
        },
      }

      const mockPost = jest.fn().mockRejectedValue(new Error('Network error'))
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const result = await store._createCurrencyLocal(payload)

      expect(result).toBe(false)
    })
  })

  describe('_createCurrencyForeign', () => {
    it('should create foreign currency successfully', async () => {
      const store = useRegisterConstitutionStoreV1()
      const payload: IRegisterConstitutionForeignCurrency = {
        investment_portfolio_id: 1,
        operation_date: '2023-09-24',
        issuer_id: 1,
        counterparty_id: 1,
        administrator_id: 1,
        conditions: {
          currency_value: 3500,
          conversion_factor: 1.2,
          compliance_date: '2023-09-27',
          resource_placement_date: '2023-09-25',
          compliance_value_origin_currency: 4200,
          compliance_transfer_value_local_currency: 5040,
        },
      }

      const mockPost = jest.fn().mockResolvedValue({
        data: { success: true, message: 'Creado correctamente' },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      await store._createCurrencyForeign(payload)

      expect(mockPost).toHaveBeenCalledWith(
        expect.stringContaining('/fic-participations-foreign-currency/new'),
        payload
      )
    })

    it('should handle error in _createCurrencyForeign', async () => {
      const store = useRegisterConstitutionStoreV1()
      const payload: IRegisterConstitutionForeignCurrency = {
        investment_portfolio_id: 1,
        operation_date: '2023-09-24',
        issuer_id: 1,
        counterparty_id: 1,
        administrator_id: 1,
        conditions: {
          currency_value: 3500,
          conversion_factor: 1.2,
          compliance_date: '2023-09-27',
          resource_placement_date: '2023-09-25',
          compliance_value_origin_currency: 4200,
          compliance_transfer_value_local_currency: 5040,
        },
      }

      const mockPost = jest.fn().mockRejectedValue(new Error('Network error'))
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      await store._createCurrencyForeign(payload)

      expect(mockPost).toHaveBeenCalled()
    })
  })

  describe('State mutations', () => {
    it('should set generic data with _setDataInformationGeneric', () => {
      const store = useRegisterConstitutionStoreV1()
      const data: IRegisterConstitutionGeneric = {
        investment_portfolio_id: 1,
        operation_date: '2023-09-24',
        issuer_id: 2,
        counterparty_id: 3,
        administrator_id: 4,
      }

      store._setDataInformationGeneric(data)
      expect(store.data_information_generic).toEqual(data)

      store._setDataInformationGeneric(null)
      expect(store.data_information_generic).toBeNull()
    })

    it('should set values data with _setDataInformationValues', () => {
      const store = useRegisterConstitutionStoreV1()
      const data: IRegisterConstitutionValuesForeign = {
        details: {
          unit: 100,
          portfolio_class: 'A',
          currency_id: 1,
          unit_value_origin_currency: 2500,
          constitution_value_origin_currency: 25000,
          isin_id: 1,
          participation_number: 10,
          constitution_unit_number: 10,
          operation_type_id: 1,
          number_of_cash_operation_days: 3,
          paper_type_id: 1,
        },
      }

      store._setDataInformationValues(data)
      expect(store.data_information_values).toEqual(data)

      store._setDataInformationValues(null)
      expect(store.data_information_values).toBeNull()
    })

    it('should set conditions data with _setDataInformationConditions', () => {
      const store = useRegisterConstitutionStoreV1()
      const data: IRegisterConstitutionConditions = {
        currency_value: 3500,
        conversion_factor: 1.2,
        compliance_date: '2023-09-27',
        resource_placement_date: '2023-09-25',
        compliance_value_origin_currency: 4200,
        compliance_transfer_value_local_currency: 5040,
      }

      store._setDataInformationConditions(data)
      expect(store.data_information_conditions).toEqual(data)

      store._setDataInformationConditions(null)
      expect(store.data_information_conditions).toBeNull()
    })

    it('should set reference tabs with _setReferenceTabs', () => {
      const store = useRegisterConstitutionStoreV1()
      const tabData = { valuePosition: 2 }

      store._setReferenceTabs(tabData)
      expect(store.referenceTabs).toEqual(tabData)
    })

    it('should set data value money with _setDataValueMoney', () => {
      const store = useRegisterConstitutionStoreV1()
      const data = {
        currency_identifier: 'USD',
        currency_local_value: 3500,
        currency_conversion_factor: 1.2,
      }

      store._setDataValueMoney(data)
      expect(store.data_value_money).toEqual(data)
    })

    it('should set reference local tabs with _setReferenceLocalTabs', () => {
      const store = useRegisterConstitutionStoreV1()
      const data = {
        genericData: true,
        valuesData: false,
      }

      store._setReferenceLocalTabs(data)
      expect(store.referenceLocalTabs).toEqual(data)
    })
  })

  describe('Initial state', () => {
    it('should have correct initial state', () => {
      const store = useRegisterConstitutionStoreV1()

      expect(store.data_constitution_list).toEqual([])
      expect(store.data_constitution_pages).toEqual({
        currentPage: 0,
        lastPage: 0,
      })
      expect(store.data_information_generic).toEqual({})
      expect(store.data_information_values).toEqual({})
      expect(store.data_information_conditions).toEqual({})
      expect(store.data_value_money).toEqual({})
      expect(store.referenceLocalTabs).toEqual({})
      expect(store.referenceTabs).toEqual({
        valuePosition: 0,
      })
    })
  })

  describe('Updated store actions and state', () => {
    it('should handle updated state properties correctly', () => {
      const store = useRegisterConstitutionStoreV1()

      // Verify initial state for new or updated properties
      expect(store.data_constitution_list).toEqual([])
      expect(store.data_constitution_pages).toEqual({
        currentPage: 0,
        lastPage: 0,
      })
      expect(store.data_information_generic).toEqual({})
      expect(store.data_information_values).toEqual({})
      expect(store.data_information_conditions).toEqual({})
      expect(store.data_value_money).toEqual({})
      expect(store.referenceLocalTabs).toEqual({})
      expect(store.referenceTabs).toEqual({
        valuePosition: 0,
      })
    })

    it('should call _createCurrencyForeign with updated payload', async () => {
      const store = useRegisterConstitutionStoreV1()
      const payload: IRegisterConstitutionForeignCurrency = {
        investment_portfolio_id: 1,
        operation_date: '2023-09-24',
        issuer_id: 1,
        counterparty_id: 1,
        administrator_id: 1,
        conditions: {
          currency_value: 3500,
          conversion_factor: 1.2,
          compliance_date: '2023-09-27',
          resource_placement_date: '2023-09-25',
          compliance_value_origin_currency: 4200,
          compliance_transfer_value_local_currency: 5040,
        },
      }

      const mockPost = jest.fn().mockResolvedValue({
        data: { success: true, message: 'Creado correctamente' },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const result = await store._createCurrencyForeign(payload)

      expect(mockPost).toHaveBeenCalledWith(
        expect.stringContaining('/fic-participations-foreign-currency/new'),
        payload
      )
      expect(result).toBe(true)
    })
  })
})
