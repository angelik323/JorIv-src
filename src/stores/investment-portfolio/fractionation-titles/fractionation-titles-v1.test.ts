//Pinia
import { setActivePinia, createPinia } from 'pinia'
//Api's
import { executeApi } from '@/apis'
//Store reference
import { useFractionationTitlesStorev1 } from './fractionation-titles-v1'
//Interfaces
import {
  IFractionationSendData,
  IFractionationTitles,
  IFractionationTitleRows,
} from '@/interfaces/customs/'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
  })),
}))

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useShowError: jest.fn(() => ({ showCatchError: jest.fn(() => 'Error') })),
  useUtils: jest.fn(() => ({
    defaultIconsLucide: {
      plusCircleOutline: 'mocked-plus-icon',
    },
  })),
}))

describe('useFractionationTitlesStorev1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('should initialize with default state', () => {
    const store = useFractionationTitlesStorev1()

    expect(store.headerProps.breadcrumbs).toHaveLength(3)
    expect(store.headerProps.breadcrumbs[0].label).toBe('Inicio')
    expect(store.headerProps.btn.label).toBe('Crear')
    expect(store.headerProps.btn.icon).toBe('mocked-plus-icon')
    expect(store.fractionation_titles_list).toEqual([])
    expect(store.pages.currentPage).toBe(0)
    expect(store.pages.lastPage).toBe(0)
    expect(store.fractionation_titles_response).toBeNull()
  })

  it('should call _getListFractionationTitles and update state on success', async () => {
    const store = useFractionationTitlesStorev1()
    const mockResponse = {
      data: {
        success: true,
        message: 'Lista obtenida exitosamente',
        data: {
          data: [
            { id: 1, title: 'Title 1' },
            { id: 2, title: 'Title 2' },
          ],
          current_page: 1,
          last_page: 5,
        },
      },
    }

    const mockGet = jest.fn(() => Promise.resolve(mockResponse))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getListFractionationTitles('&page=1')

    expect(mockGet).toHaveBeenCalledWith(
      'investment-portfolio/api/investment-portfolio/fixed-rate-division/list?paginate=1&page=1'
    )
    expect(store.fractionation_titles_list).toEqual(mockResponse.data.data.data)
    expect(store.pages.currentPage).toBe(1)
    expect(store.pages.lastPage).toBe(5)
  })

  it('should handle error in _getListFractionationTitles', async () => {
    const store = useFractionationTitlesStorev1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getListFractionationTitles('')

    expect(store.fractionation_titles_list).toEqual([])
  })

  it('should call _validateFractionationTitle and return data on success', async () => {
    const store = useFractionationTitlesStorev1()
    const mockPayload: IFractionationSendData = {
      investment_portfolio_id: '1',
      operation_type_id: 1,
      operation_date: '2024-01-01',
      title_id: 123,
      divisions: [
        {
          nominal_value_fraction: 1000,
          buy_value_fraction: 950,
          market_value_fraction: 980,
          market_unit_value_fraction: 98,
        },
      ],
    }

    const mockResponseData: IFractionationTitles = {
      id: 1,
      parent_title_number: 283,
      origin_title: null,
      operation_date: '2024-01-01',
      investment_portfolio: null,
      operation_type: null,
      created_by: null,
      divisions: [
        {
          id: 1,
          title_number: 283,
          purchasable_type: 'Type A',
          inversion_class: 'Class 1',
          status: { id: 1, description: 'Activo' },
          emitter: { id: 1, document: '123456', description: 'Emisor Test' },
          isin: {
            id: 1,
            code: 'ISIN123',
            description: 'ISIN Test',
            mnemonic: 'TST',
            periodicity: 'Monthly',
          },
          paper: { id: 1, description: 'Paper Test', code: 'PT001' },
          emission_date: '2024-01-01',
          expiration_date: '2025-01-01',
          buyer_date: '2024-01-01',
          periodicity: 'Monthly',
          modality: 'Fixed',
          rate_type: 'Fixed',
          rate_code: 'FX001',
          fixed_rate_value: '5.5',
          spread: '0.5',
          currency: { id: 1, code: 'COP', value: '1' },
          counterparty: {
            id: 1,
            document: '987654',
            description: 'Counterparty Test',
          },
          purchase_value: 1000,
          nominal_value: 1000,
          market_value: 980,
          market_unit_value: 98,
          tir: { id: 1, capital: '5.2', value: 5.2 },
          deposit: { id: 1, document: '555666', description: 'Deposit Test' },
          compensation_system: 'System A',
          folio_number: 12345,
        },
      ],
    }

    const mockResponse = {
      data: {
        success: true,
        message: 'Validación exitosa',
        data: mockResponseData,
      },
    }

    const mockPost = jest.fn(() => Promise.resolve(mockResponse))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._validateFractionationTitle(mockPayload)

    expect(mockPost).toHaveBeenCalledWith(
      'investment-portfolio/api/investment-portfolio/fixed-rate-division/preview',
      mockPayload
    )
    expect(result).toEqual(mockResponseData)
  })

  it('should call _validateFractionationTitle and return null on error', async () => {
    const store = useFractionationTitlesStorev1()
    const mockPayload: IFractionationSendData = {
      investment_portfolio_id: '1',
      operation_type_id: 1,
      operation_date: '2024-01-01',
      title_id: 123,
      divisions: [],
    }

    const mockResponse = {
      data: {
        success: false,
        message: 'Error en validación',
      },
    }

    const mockPost = jest.fn(() => Promise.resolve(mockResponse))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._validateFractionationTitle(mockPayload)

    expect(result).toBeNull()
  })

  it('should handle error in _validateFractionationTitle gracefully', async () => {
    const store = useFractionationTitlesStorev1()
    const mockPayload: IFractionationSendData = {
      investment_portfolio_id: '1',
      operation_type_id: 1,
      operation_date: '2024-01-01',
      title_id: 123,
      divisions: [],
    }

    const mockPost = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._validateFractionationTitle(mockPayload)

    expect(result).toBeNull()
  })

  it('should call _createFractionationTitle and return true on success', async () => {
    const store = useFractionationTitlesStorev1()
    const mockPayload: IFractionationSendData = {
      investment_portfolio_id: '1',
      operation_type_id: 1,
      operation_date: '2024-01-01',
      title_id: 123,
      divisions: [
        {
          nominal_value_fraction: 1000,
          buy_value_fraction: 950,
          market_value_fraction: 980,
          market_unit_value_fraction: 98,
        },
      ],
    }

    const mockResponse = {
      data: {
        success: true,
        message: 'Título creado exitosamente',
      },
    }

    const mockPost = jest.fn(() => Promise.resolve(mockResponse))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createFractionationTitle(mockPayload)

    expect(mockPost).toHaveBeenCalledWith(
      'investment-portfolio/api/investment-portfolio/fixed-rate-division/new',
      mockPayload
    )
    expect(result).toBe(true)
  })

  it('should call _createFractionationTitle and return false on error', async () => {
    const store = useFractionationTitlesStorev1()
    const mockPayload: IFractionationSendData = {
      investment_portfolio_id: '1',
      operation_type_id: 1,
      operation_date: '2024-01-01',
      title_id: 123,
      divisions: [],
    }

    const mockResponse = {
      data: {
        success: false,
        message: 'Error al crear título',
      },
    }

    const mockPost = jest.fn(() => Promise.resolve(mockResponse))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createFractionationTitle(mockPayload)

    expect(result).toBe(false)
  })

  it('should handle error in _createFractionationTitle gracefully', async () => {
    const store = useFractionationTitlesStorev1()
    const mockPayload: IFractionationSendData = {
      investment_portfolio_id: '1',
      operation_type_id: 1,
      operation_date: '2024-01-01',
      title_id: 123,
      divisions: [],
    }

    const mockPost = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createFractionationTitle(mockPayload)

    expect(result).toBe(false)
  })

  it('should call _getFractionationTitleDetail and update fractionation_titles_response', async () => {
    const store = useFractionationTitlesStorev1()
    const mockId = 123

    const mockResponseData: IFractionationTitles = {
      id: 1,
      parent_title_number: 283,
      origin_title: null,
      operation_date: '2024-01-01',
      investment_portfolio: null,
      operation_type: null,
      created_by: null,
      divisions: [],
    }

    const mockResponse = {
      data: {
        success: true,
        message: 'Detalle obtenido exitosamente',
        data: mockResponseData,
      },
    }

    const mockGet = jest.fn(() => Promise.resolve(mockResponse))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getFractionationTitleDetail(mockId)

    expect(mockGet).toHaveBeenCalledWith(
      'investment-portfolio/api/investment-portfolio/fixed-rate-division/123/show'
    )
    expect(store.fractionation_titles_response).toEqual(mockResponseData)
  })

  it('should handle error in _getFractionationTitleDetail', async () => {
    const store = useFractionationTitlesStorev1()
    const mockId = 123

    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getFractionationTitleDetail(mockId)

    expect(store.fractionation_titles_response).toBeNull()
  })

  it('should clear data with _clearData', () => {
    const store = useFractionationTitlesStorev1()
    ;(
      store as unknown as {
        fractionation_titles_list: IFractionationTitleRows[]
      }
    ).fractionation_titles_list = [
      {
        id: 1,
        parent_title_number: 1,
        operation_date: '2024-01-01',
        investment_portfolio: { id: 1, code: 'C', description: 'D' },
        status: { id: 1, description: 'Activo' },
      } as IFractionationTitleRows,
    ]

    const minimalResponse: IFractionationTitles = {
      id: 1,
      parent_title_number: 1,
      origin_title: null,
      operation_date: '2024-01-01',
      investment_portfolio: null,
      operation_type: null,
      created_by: null,
      divisions: [],
    }

    store.fractionation_titles_response = minimalResponse

    store._clearData()

    expect(store.fractionation_titles_list).toEqual([])
    expect(store.fractionation_titles_response).toBeNull()
    expect(store.pages.currentPage).toBe(0)
    expect(store.pages.lastPage).toBe(0)
  })

  it('should handle _getListFractionationTitles with empty params', async () => {
    const store = useFractionationTitlesStorev1()
    const mockResponse = {
      data: {
        success: true,
        message: 'Lista obtenida',
        data: {
          data: [],
          current_page: 1,
          last_page: 1,
        },
      },
    }

    const mockGet = jest.fn(() => Promise.resolve(mockResponse))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getListFractionationTitles('')

    expect(mockGet).toHaveBeenCalledWith(
      'investment-portfolio/api/investment-portfolio/fixed-rate-division/list?paginate=1'
    )
  })

  it('should handle response without data in _getListFractionationTitles', async () => {
    const store = useFractionationTitlesStorev1()
    const mockResponse = {
      data: {
        success: true,
        message: 'Lista obtenida',
        data: null,
      },
    }

    const mockGet = jest.fn(() => Promise.resolve(mockResponse))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getListFractionationTitles('')

    expect(store.fractionation_titles_list).toEqual([])
    expect(store.pages.currentPage).toBe(0)
    expect(store.pages.lastPage).toBe(0)
  })

  it('should handle response without data in _validateFractionationTitle', async () => {
    const store = useFractionationTitlesStorev1()
    const mockPayload: IFractionationSendData = {
      investment_portfolio_id: '1',
      operation_type_id: 1,
      operation_date: '2024-01-01',
      title_id: 123,
      divisions: [],
    }

    const mockResponse = {
      data: {
        success: true,
        message: 'Validación exitosa',
        data: null,
      },
    }

    const mockPost = jest.fn(() => Promise.resolve(mockResponse))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._validateFractionationTitle(mockPayload)

    expect(result).toBeNull()
    expect(store.fractionation_titles_response).toBeNull()
  })

  it('should handle response without data in _getFractionationTitleDetail', async () => {
    const store = useFractionationTitlesStorev1()
    const mockId = 123

    const mockResponse = {
      data: {
        success: true,
        message: 'Detalle obtenido',
        data: null,
      },
    }

    const mockGet = jest.fn(() => Promise.resolve(mockResponse))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getFractionationTitleDetail(mockId)

    expect(store.fractionation_titles_response).toBeNull()
  })
})
