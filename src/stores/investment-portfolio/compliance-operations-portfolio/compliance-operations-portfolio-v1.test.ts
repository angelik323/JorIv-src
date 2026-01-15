import { setActivePinia, createPinia } from 'pinia'
import { useComplianceOperationsPortfolioStoreV1 } from './compliance-operations-portfolio-v1'
import { executeApi } from '@/apis'
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import {
  IComplianceOperationsPortfolioForm,
  IComplianceOperationsPortfolio,
} from '@/interfaces/customs'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
  })),
}))

jest.mock('@/composables', () => {
  const useAlert = jest.fn(() => ({ showAlert: jest.fn() }))
  const useShowError = jest.fn(() => ({
    showCatchError: jest.fn(() => 'Error!'),
  }))
  const useUtils = jest.fn(() => ({
    defaultIconsLucide: { plusCircleOutline: 'plus-circle' },
  }))
  return { useAlert, useShowError, useUtils }
})

describe('useComplianceOperationsPortfolioStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  // --- GET COMPLIANCE OPERATIONS PORTFOLIO LIST ---
  it('should fetch list of compliance operations portfolio without pagination', async () => {
    // Arrange
    const store = useComplianceOperationsPortfolioStoreV1()
    const mockData: IComplianceOperationsPortfolio[] = [
      {
        investment_portfolio_id: 1,
        investment_portfolio: 'Portfolio ABC',
        instrucion_slip_id: 101,
        payment_or_collection_method: 'Transferencia',
        compliance_bank: 'Banco XYZ',
        compliance_bank_account: '1234567890',
        operation_value: '100000.00',
        operation_type: 'Ingreso',
        benefit: '5000.00',
      },
      {
        investment_portfolio_id: 2,
        investment_portfolio: 'Portfolio DEF',
        instrucion_slip_id: 102,
        payment_or_collection_method: 'Cheque',
        compliance_bank: 'Banco ABC',
        compliance_bank_account: '0987654321',
        operation_value: '200000.00',
        operation_type: 'Egreso',
        benefit: '8000.00',
      },
    ]
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: {
          operation_compliance_list: mockData,
        },
        message: 'List fetched successfully',
      },
    })
    const params = '&filter[status]=25'
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    const result = await store._getComplianceOperationsPortfolioList(
      params,
      false
    )

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/select-tables?keys[]=operation_compliance_list${params}`
    )
    expect(result).toEqual(mockData)
    expect(store.pages.currentPage).toBe(1)
    expect(store.pages.lastPage).toBe(1)
  })

  it('should fetch list of compliance operations portfolio with pagination', async () => {
    // Arrange
    const store = useComplianceOperationsPortfolioStoreV1()
    const mockData: IComplianceOperationsPortfolio[] = [
      {
        investment_portfolio_id: 1,
        investment_portfolio: 'Portfolio ABC',
        instrucion_slip_id: 101,
        payment_or_collection_method: 'Transferencia',
        compliance_bank: 'Banco XYZ',
        compliance_bank_account: '1234567890',
        operation_value: '100000.00',
        operation_type: 'Ingreso',
        benefit: '5000.00',
      },
      {
        investment_portfolio_id: 2,
        investment_portfolio: 'Portfolio DEF',
        instrucion_slip_id: 102,
        payment_or_collection_method: 'Cheque',
        compliance_bank: 'Banco ABC',
        compliance_bank_account: '0987654321',
        operation_value: '200000.00',
        operation_type: 'Egreso',
        benefit: '8000.00',
      },
    ]
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: {
          operation_compliance_list: { data: mockData },
          current_page: 2,
          last_page: 5,
        },
        message: 'List fetched successfully',
      },
    })
    const params = '&filter[status]=25'
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    const result = await store._getComplianceOperationsPortfolioList(
      params,
      true
    )

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/select-tables?keys[]=operation_compliance_list${params}&operation_compliance_list_paginated=true`
    )
    expect(result).toEqual(mockData)
    expect(store.pages.currentPage).toBe(2)
    expect(store.pages.lastPage).toBe(5)
  })

  it('should handle API failure when fetching compliance operations portfolio list', async () => {
    // Arrange
    const store = useComplianceOperationsPortfolioStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: false,
        data: { operation_compliance_list: null },
        message: 'Failed to fetch list',
      },
    })
    const params = '&filter[status]=25'
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    const result = await store._getComplianceOperationsPortfolioList(
      params,
      false
    )

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/select-tables?keys[]=operation_compliance_list${params}`
    )
    expect(result).toEqual([])
    expect(store.pages.currentPage).toBe(1)
    expect(store.pages.lastPage).toBe(1)
  })

  it('should handle error when fetching compliance operations portfolio list', async () => {
    // Arrange
    const store = useComplianceOperationsPortfolioStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    const params = '&filter[status]=25'
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    const result = await store._getComplianceOperationsPortfolioList(
      params,
      false
    )

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/select-tables?keys[]=operation_compliance_list${params}`
    )
    expect(result).toEqual([])
  })

  // --- CREATE COMPLIANCE OPERATIONS PORTFOLIO ---
  it('should create a new compliance operations portfolio successfully', async () => {
    // Arrange
    const store = useComplianceOperationsPortfolioStoreV1()
    const payload: IComplianceOperationsPortfolioForm = {
      date: '2023-10-09',
      operation_nature: 'Ingreso',
      instruction_slip_ids: [1, 2, 3],
    }
    const mockPost = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Compliance operation created successfully',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._createComplianceOperationsPortfolio(payload)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/operation-compliance`,
      payload
    )
    expect(result).toBe(true)
  })

  it('should handle failure when creating compliance operations portfolio', async () => {
    // Arrange
    const store = useComplianceOperationsPortfolioStoreV1()
    const payload: IComplianceOperationsPortfolioForm = {
      date: '2023-10-09',
      operation_nature: 'Ingreso',
      instruction_slip_ids: [1, 2, 3],
    }
    const mockPost = jest.fn().mockResolvedValue({
      data: {
        success: false,
        message: 'Failed to create compliance operation',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._createComplianceOperationsPortfolio(payload)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/operation-compliance`,
      payload
    )
    expect(result).toBe(false)
  })

  it('should handle error when creating compliance operations portfolio', async () => {
    // Arrange
    const store = useComplianceOperationsPortfolioStoreV1()
    const payload: IComplianceOperationsPortfolioForm = {
      date: '2023-10-09',
      operation_nature: 'Ingreso',
      instruction_slip_ids: [1, 2, 3],
    }
    const mockPost = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._createComplianceOperationsPortfolio(payload)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/operation-compliance`,
      payload
    )
    expect(result).toBe(false)
  })

  // --- CANCEL COMPLIANCE OPERATIONS PORTFOLIO ---
  it('should cancel compliance operations portfolio with number id successfully', async () => {
    // Arrange
    const store = useComplianceOperationsPortfolioStoreV1()
    const operationId = 123
    const mockPut = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Compliance operation cancelled successfully',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    // Act
    const result = await store._cancelComplianceOperationsPortfolio(operationId)

    // Assert
    expect(mockPut).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/operation-compliance/cancel/${operationId}`
    )
    expect(result).toBe(true)
  })

  it('should cancel compliance operations portfolio with string id successfully', async () => {
    // Arrange
    const store = useComplianceOperationsPortfolioStoreV1()
    const operationId = 'OP123'
    const mockPut = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Compliance operation cancelled successfully',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    // Act
    const result = await store._cancelComplianceOperationsPortfolio(operationId)

    // Assert
    expect(mockPut).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/operation-compliance/cancel/${operationId}`
    )
    expect(result).toBe(true)
  })

  it('should handle failure when cancelling compliance operations portfolio', async () => {
    // Arrange
    const store = useComplianceOperationsPortfolioStoreV1()
    const operationId = 123
    const mockPut = jest.fn().mockResolvedValue({
      data: {
        success: false,
        message: 'Failed to cancel compliance operation',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    // Act
    const result = await store._cancelComplianceOperationsPortfolio(operationId)

    // Assert
    expect(mockPut).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/operation-compliance/cancel/${operationId}`
    )
    expect(result).toBe(false)
  })

  it('should handle error when cancelling compliance operations portfolio', async () => {
    // Arrange
    const store = useComplianceOperationsPortfolioStoreV1()
    const operationId = 123
    const mockPut = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    // Act
    const result = await store._cancelComplianceOperationsPortfolio(operationId)

    // Assert
    expect(mockPut).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/operation-compliance/cancel/${operationId}`
    )
    expect(result).toBe(false)
  })

  it('should update pagination correctly when data is received', async () => {
    // Arrange
    const store = useComplianceOperationsPortfolioStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: {
          operation_compliance_list: { data: [] },
          current_page: 3,
          last_page: 10,
        },
        message: 'List fetched successfully',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getComplianceOperationsPortfolioList('', true)

    // Assert
    expect(store.pages.currentPage).toBe(3)
    expect(store.pages.lastPage).toBe(10)
  })
})
