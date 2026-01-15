import { setActivePinia, createPinia } from 'pinia'
import { useGuaranteeOperationsStoreV1 } from './guarantee-operations-v1'
import { executeApi } from '@/apis'
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import {
  IGuaranteeOperationPayload,
  IGuaranteeOperationResponseById,
  IGuaranteeOperationMoneyOperationsResponse,
  IGuaranteeOperationTilesResponse,
} from '@/interfaces/customs/investment-portfolio/GuaranteeOperations'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
  })),
}))

jest.mock('@/composables', () => {
  const useAlert = jest.fn(() => ({ showAlert: jest.fn() }))
  const useShowError = jest.fn(() => ({
    showCatchError: jest.fn(() => 'Error!'),
  }))
  const useUtils = jest.fn(() => ({
    defaultIconsLucide: {
      plusCircleOutline: 'mocked-icon',
    },
  }))
  return { useAlert, useShowError, useUtils }
})

describe('useGuaranteeOperationsStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  // --- STORE INITIALIZATION ---
  it('should initialize with correct default state', () => {
    // Arrange & Act
    const store = useGuaranteeOperationsStoreV1()

    // Assert
    expect(store.headerPropsDefault).toEqual({
      title: 'Llamado al margen y mantenimiento de garantías',
      breadcrumbs: [
        {
          label: 'Inicio',
          route: 'HomeView',
        },
        {
          label: 'Portafolio de inversiones',
        },
        {
          label: 'Operaciones renta fija',
          route: 'GuaranteeOperationsList',
        },
      ],
      btn: {
        label: 'Crear',
        icon: 'mocked-icon',
        options: [
          { label: 'Llamado al margen', routeName: 'MarginCallCreate' },
          {
            label: 'Mantenimiento de garantías',
            routeName: 'MaintenanceGuaranteesCreate',
          },
        ],
        color: 'primary',
        textColor: 'white',
        size: 'md',
        class: 'btn-header',
        outline: false,
        disable: false,
      },
    })
    expect(store.guarantee_operation_list).toEqual([])
    expect(store.pages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
  })

  // --- CREATE GUARANTEE OPERATION ---
  it('should create a new guarantee operation successfully', async () => {
    // Arrange
    const store = useGuaranteeOperationsStoreV1()
    const payload: IGuaranteeOperationPayload = {
      position: 'LONG',
      money_market_transaction_record_id: 1,
      operation: 'COMPRA',
      title_guarantee_new_id: 10,
      type_guarantee_operation: 'TITULO',
    }
    const mockPost = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Guarantee operation created successfully',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._createGuaranteeOperation(payload)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/guarantee-operation/new`,
      payload
    )
    expect(result).toBe(true)
  })

  it('should handle failure when creating guarantee operation', async () => {
    // Arrange
    const store = useGuaranteeOperationsStoreV1()
    const payload: IGuaranteeOperationPayload = {
      position: 'SHORT',
      money_market_transaction_record_id: 2,
      operation: 'VENTA',
      title_guarantee_new_id: 20,
      type_guarantee_operation: 'TITULO',
    }
    const mockPost = jest.fn().mockResolvedValue({
      data: {
        success: false,
        message: 'Failed to create guarantee operation',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._createGuaranteeOperation(payload)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/guarantee-operation/new`,
      payload
    )
    expect(result).toBe(false)
  })

  it('should handle error when creating guarantee operation', async () => {
    // Arrange
    const store = useGuaranteeOperationsStoreV1()
    const payload: IGuaranteeOperationPayload = {
      position: 'LONG',
      money_market_transaction_record_id: 1,
      operation: 'COMPRA',
      title_guarantee_new_id: 10,
      type_guarantee_operation: 'TITULO',
    }
    const mockPost = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._createGuaranteeOperation(payload)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/guarantee-operation/new`,
      payload
    )
    expect(result).toBe(false)
  })

  // --- GET GUARANTEE OPERATION BY ID ---
  it('should fetch guarantee operation by id successfully', async () => {
    // Arrange
    const store = useGuaranteeOperationsStoreV1()
    const mockData: IGuaranteeOperationResponseById = {
      basic_data: {
        created_by_user: 'María García',
        operation_date: '2023-10-23',
        portfolio_code: 'PORT002',
        portfolio_description: 'Portfolio de garantías',
        operation: 'MANTENIMIENTO',
        position: 'LONG',
        status: 'ACTIVE',
      },
      monetary_operation: {
        number_operation: 54321,
        operation: 'Operación de mantenimiento',
        operation_type: 2,
        operation_description: 'Mantenimiento de garantía',
        start_date: '2023-10-23',
        end_date: '2024-10-23',
        agreed_rate: '6.0',
        rate_class: 'Fija',
        base_days: 365,
        face_value: '15000000',
        return_value: '15900000',
        guarantee_value: '7500000',
        guarantee_percentage: '50',
        title_id: 8,
      },
      current_warranty: {
        issuer: 'Banco Central',
        isin_code: 'COL111222333',
        mnemonic: 'BCO25',
        number_title: 200,
        paper: 'Bonos',
        issue_date: '2021-03-15',
        maturity_date: '2026-03-15',
        rate_type: 'Variable',
        rate_code: 'V003',
        fixed_rate_value: '0',
        spread: '2.0',
        modality: 'Desmaterializado',
        perioricity: 'Trimestral',
        currency_code: 'COP',
        deposit: 'DCV',
        face_value: '1500000',
        unit_value: '1550000',
        market_value: '1550000',
        irr_purchase: '6.8',
      },
      guarantee_operation: {
        issuer: 'Entidad Financiera',
        isin_code: 'COL444555666',
        mnemonic: 'ENT24',
        number_title: 75,
        paper: 'CDT',
        issue_date: '2022-05-01',
        maturity_date: '2024-05-01',
        rate_type: 'Fija',
        rate_code: 'F003',
        fixed_rate_value: '7.5',
        spread: '0',
        modality: 'Electrónico',
        perioricity: 'Mensual',
        currency_code: 'COP',
        deposit: 'Banco',
        face_value: '750000',
        unit_value: '780000',
        market_value: '780000',
        irr_purchase: '7.2',
      },
    }
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Guarantee operation found',
        data: mockData,
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    const result = await store._getGuaranteeOperationById(1)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/guarantee-operation/show/1`
    )
    expect(result).toEqual(mockData)
  })

  it('should handle failure when fetching guarantee operation by id', async () => {
    // Arrange
    const store = useGuaranteeOperationsStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: false,
        message: 'Guarantee operation not found',
        data: null,
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    const result = await store._getGuaranteeOperationById(999)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/guarantee-operation/show/999`
    )
    expect(result).toBeNull()
  })

  it('should handle error when fetching guarantee operation by id', async () => {
    // Arrange
    const store = useGuaranteeOperationsStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    const result = await store._getGuaranteeOperationById(1)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/guarantee-operation/show/1`
    )
    expect(result).toBeNull()
  })

  // --- GET LIST MONEY MARKET OPERATIONS ---
  it('should fetch list of money market operations successfully', async () => {
    // Arrange
    const store = useGuaranteeOperationsStoreV1()
    const mockData: IGuaranteeOperationMoneyOperationsResponse = {
      data: [
        {
          id: 1,
          type: 'MANTENIMIENTO',
          operation: 'Operación de garantía 1',
          operation_code: 20001,
          start_date: '2023-10-23',
          end_date: '2024-10-23',
          agreed_rate: '6.5',
          rate_class: 'Variable',
          base_days: 365,
          face_value: '12000000',
          return_value: '12780000',
          guarantee_value: '6000000',
          guarantee_percentage: '50',
          title_id: 15,
          current_warranty: {
            issuer: 'Corporación Financiera',
            isin_code: 'COL777888',
            mnemonic: 'CORP01',
            number_title: 150,
            paper: 'Pagaré',
            issue_date: '2023-02-10',
            maturity_date: '2024-02-10',
            rate_type: 'Variable',
            rate_code: 'V004',
            fixed_rate_value: '0',
            spread: '1.8',
            modality: 'Desmaterializado',
            perioricity: 'Bimestral',
            currency_code: 'COP',
            deposit: 'DCV',
            face_value: '1200000',
            unit_value: '1230000',
            market_value: '1250000',
            irr_purchase: '6.3',
            title_id: 15,
          },
        },
        {
          id: 2,
          type: 'RENOVACION',
          operation: 'Operación de garantía 2',
          operation_code: 20002,
          start_date: '2023-10-20',
          end_date: '2023-12-20',
          agreed_rate: '5.2',
          rate_class: 'Fija',
          base_days: 360,
          face_value: '8000000',
          return_value: '8416000',
          guarantee_value: '4000000',
          guarantee_percentage: '50',
          title_id: 12,
        },
      ],
      current_page: 1,
      last_page: 2,
    }
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'List fetched successfully',
        data: mockData,
      },
    })
    const params = '&type=MANTENIMIENTO'
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    const result = await store._getListMoneyMarketOperations(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/guarantee-operation/list-money-market?paginate=1${params}`
    )
    expect(result).toEqual(mockData)
  })

  it('should handle failure when fetching money market operations list', async () => {
    // Arrange
    const store = useGuaranteeOperationsStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: false,
        message: 'Failed to fetch list',
        data: null,
      },
    })
    const params = '&type=MANTENIMIENTO'
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    const result = await store._getListMoneyMarketOperations(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/guarantee-operation/list-money-market?paginate=1${params}`
    )
    expect(result).toBeNull()
  })

  it('should handle error when fetching money market operations list', async () => {
    // Arrange
    const store = useGuaranteeOperationsStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    const params = '&type=MANTENIMIENTO'
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    const result = await store._getListMoneyMarketOperations(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/guarantee-operation/list-money-market?paginate=1${params}`
    )
    expect(result).toBeNull()
  })

  // --- GET TITLES LIST ---
  it('should fetch titles list successfully', async () => {
    // Arrange
    const store = useGuaranteeOperationsStoreV1()
    const mockData: IGuaranteeOperationTilesResponse = {
      data: [
        {
          id: 1,
          issuers_counterparty_id: 20,
          balance: 250,
          status_id: 1,
          unit_value: '2050000',
          purchase_value: 2000000,
          isin_code_id: 10,
          tir: '7.5',
          paper_type_id: 3,
          deposit_issuer_id: 'DCV003',
          currency_code: 'COP',
          issuer: 'Ministerio de Hacienda',
          isin: 'COL555666777',
          mnemonic: 'TES30',
          paper: 'TES',
          issue_date: '2021-06-01',
          maturity_date: '2030-06-01',
          rate_type: 'Fija',
          rate_code: 'F005',
          rate_value: '7.5',
          modality: 'Desmaterializado',
          spread: '0',
          perioricity: 'Anual',
        },
        {
          id: 2,
          issuers_counterparty_id: 21,
          balance: 100,
          status_id: 1,
          unit_value: '1520000',
          purchase_value: 1500000,
          isin_code_id: 11,
          tir: '6.8',
          paper_type_id: 4,
          deposit_issuer_id: 'DCV004',
          currency_code: 'COP',
          issuer: 'Banco de la República',
          isin: 'COL999888777',
          mnemonic: 'REPO24',
          paper: 'REPO',
          issue_date: '2023-07-01',
          maturity_date: '2024-07-01',
          rate_type: 'Variable',
          rate_code: 'V005',
          rate_value: '6.8',
          modality: 'Electrónico',
          spread: '1.2',
          perioricity: 'Trimestral',
        },
      ],
      current_page: 1,
      last_page: 3,
    }
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Titles list fetched successfully',
        data: mockData,
      },
    })
    const params = '&status_id=1'
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    const result = await store._getTitlesList(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/title-handler/titles-list?paginate=1${params}`
    )
    expect(result).toEqual(mockData)
  })

  it('should handle failure when fetching titles list', async () => {
    // Arrange
    const store = useGuaranteeOperationsStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: false,
        message: 'Failed to fetch titles list',
        data: null,
      },
    })
    const params = '&status_id=1'
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    const result = await store._getTitlesList(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/title-handler/titles-list?paginate=1${params}`
    )
    expect(result).toBeNull()
  })

  it('should handle error when fetching titles list', async () => {
    // Arrange
    const store = useGuaranteeOperationsStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    const params = '&status_id=1'
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    const result = await store._getTitlesList(params)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/title-handler/titles-list?paginate=1${params}`
    )
    expect(result).toBeNull()
  })

  // --- GET GUARANTEE OPERATION LIST ---
  it('should fetch guarantee operation list successfully', async () => {
    // Arrange
    const store = useGuaranteeOperationsStoreV1()
    const mockData = {
      data: [
        {
          id: 1,
          type: 'MANTENIMIENTO',
          operation: 'OP001',
          portfolio_code: 'PORT001',
          position: 'LONG',
          status: 'ACTIVE',
        },
        {
          id: 2,
          type: 'LLAMADO',
          operation: 'OP002',
          portfolio_code: 'PORT002',
          position: 'SHORT',
          status: 'PENDING',
        },
      ],
      current_page: 1,
      last_page: 3,
    }
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'List fetched successfully',
        data: mockData,
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getGuaranteeOperationList({ page: 1 })

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/guarantee-operation/list`,
      {
        params: { page: 1, paginate: 1 },
      }
    )
    expect(store.guarantee_operation_list).toEqual(mockData.data)
    expect(store.pages.currentPage).toBe(1)
    expect(store.pages.lastPage).toBe(3)
  })

  it('should handle failure when fetching guarantee operation list', async () => {
    // Arrange
    const store = useGuaranteeOperationsStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: false,
        message: 'Failed to fetch list',
        data: null,
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getGuaranteeOperationList({ page: 1 })

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/guarantee-operation/list`,
      {
        params: { page: 1, paginate: 1 },
      }
    )
    expect(store.guarantee_operation_list).toEqual([])
  })

  it('should handle error when fetching guarantee operation list', async () => {
    // Arrange
    const store = useGuaranteeOperationsStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getGuaranteeOperationList({ page: 1 })

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/guarantee-operation/list`,
      {
        params: { page: 1, paginate: 1 },
      }
    )
  })

  it('should handle empty data response when fetching guarantee operation list', async () => {
    // Arrange
    const store = useGuaranteeOperationsStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'List fetched successfully',
        data: {
          data: undefined,
          current_page: undefined,
          last_page: undefined,
        },
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getGuaranteeOperationList({ page: 1 })

    // Assert
    expect(store.guarantee_operation_list).toEqual([])
    expect(store.pages.currentPage).toBe(1)
    expect(store.pages.lastPage).toBe(1)
  })

  // --- CLEAR DATA ---
  it('should clear store data successfully', () => {
    // Arrange
    const store = useGuaranteeOperationsStoreV1()
    store.guarantee_operation_list = [
      {
        id: 1,
        type: 'MANTENIMIENTO',
        operation: 'OP001',
        portfolio_code: 'PORT001',
        position: 'LONG',
        status: 'ACTIVE',
      },
    ]
    store.pages = {
      currentPage: 5,
      lastPage: 10,
    }

    // Act
    store._clearData()

    // Assert
    expect(store.guarantee_operation_list).toEqual([])
    expect(store.pages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
  })
})
