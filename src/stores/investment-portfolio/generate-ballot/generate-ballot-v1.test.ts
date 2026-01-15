import { setActivePinia, createPinia } from 'pinia'
import { executeApi } from '@/apis'
import { useGenerateBallotCollectionStoreV1 } from './generate-ballot-v1'
import {
  ICreateBallotPayload,
  IGenerateBallotMenu,
  ISelectionMenuPayload,
} from '@/interfaces/customs'

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
    getNameBlob: jest.fn(() => 'archivo.xlsx'),
    downloadBlobXlxx: jest.fn(),
  })),
}))

describe('useGenerateBallotCollectionStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('should initialize with default state', () => {
    const store = useGenerateBallotCollectionStoreV1()
    expect(store.menu_data).toEqual({})
    expect(store.investmentId).toBeNull()
    expect(store.nature_operation).toBe('')
    expect(store.request_flag).toBe(false)
  })

  it('should call _createBallot and return success true when blob is valid', async () => {
    const store = useGenerateBallotCollectionStoreV1()
    const mockResponse = {
      data: new Blob(['mockdata'], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      }),
      headers: {
        'content-type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    }

    const mockPayload: ICreateBallotPayload = {
      investment_portfolio_id: '1',
      operation_type_id: '2',
      instruction_slip_type_id: '3',
      operation_date: '2024-01-01',
      issuers_counterparty_id: '123',
      titles: [
        {
          title_id: 1,
          payment_or_collection_method_id: '1',
          origin_bank_id: 1,
          origin_bank_account_id: 1,
          destiny_bank_id: 1,
          destiny_bank_account_id: 1,
          compliance_bank_id: 1,
          compliance_bank_account_id: 1,
          operation_value: 1000,
          benefit_id: 1,
          id: 1,
        },
      ],

      treasury_instructions: [
        {
          treasury_means_of_payment_id: '1',
          account_types: [
            {
              account_type: 'savings',
              bank_id: 1,
              bank_account_number: '123456789',
              value: 1000,
            },
          ],
        },
      ],
    }

    ;(executeApi as jest.Mock).mockReturnValue({
      post: jest.fn(() => Promise.resolve(mockResponse)),
    })

    const result = await store._createBallot(mockPayload)
    expect(result).toBe(true)
  })

  it('should call _createBallot and return false when blob is empty', async () => {
    const store = useGenerateBallotCollectionStoreV1()
    const mockResponse = {
      data: new Blob([], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      }),
      headers: {
        'content-type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    }

    const mockPayload: ICreateBallotPayload = {
      investment_portfolio_id: '1',
      operation_type_id: '2',
      instruction_slip_type_id: '3',
      operation_date: '2024-01-01',
      issuers_counterparty_id: '123',
      titles: [
        {
          title_id: 1,
          payment_or_collection_method_id: '1',
          origin_bank_id: 1,
          origin_bank_account_id: 1,
          destiny_bank_id: 1,
          destiny_bank_account_id: 1,
          compliance_bank_id: 1,
          compliance_bank_account_id: 1,
          operation_value: 1000,
          benefit_id: 1,
          id: 1,
        },
      ],

      treasury_instructions: [],
    }

    ;(executeApi as jest.Mock).mockReturnValue({
      post: jest.fn(() => Promise.resolve(mockResponse)),
    })

    const result = await store._createBallot(mockPayload)
    expect(result).toBe(false)
  })

  it('should handle error in _createBallot gracefully', async () => {
    const store = useGenerateBallotCollectionStoreV1()
    const mockPost = jest.fn().mockRejectedValue(new Error('Network Error'))

    const mockPayload: ICreateBallotPayload = {
      investment_portfolio_id: '1',
      operation_type_id: '2',
      instruction_slip_type_id: '3',
      operation_date: '2024-01-01',
      issuers_counterparty_id: '123',
      titles: [
        {
          title_id: 1,
          payment_or_collection_method_id: '1',
          origin_bank_id: 1,
          origin_bank_account_id: 1,
          destiny_bank_id: 1,
          destiny_bank_account_id: 1,
          compliance_bank_id: 1,
          compliance_bank_account_id: 1,
          operation_value: 1000,
          benefit_id: 1,
          id: 1,
        },
      ],

      treasury_instructions: [],
    }

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createBallot(mockPayload)
    expect(result).toBe(false)
  })

  it('should verify _createBallot calls executeApi with correct params', async () => {
    const store = useGenerateBallotCollectionStoreV1()
    const mockResponse = {
      data: new Blob(['mock'], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      }),
      headers: {
        'content-type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    }

    const mockPayload: ICreateBallotPayload = {
      investment_portfolio_id: '1',
      operation_type_id: '2',
      instruction_slip_type_id: '3',
      operation_date: '2024-01-01',
      issuers_counterparty_id: '123',
      titles: [
        {
          title_id: 1,
          payment_or_collection_method_id: '1',
          origin_bank_id: 1,
          origin_bank_account_id: 1,
          destiny_bank_id: 1,
          destiny_bank_account_id: 1,
          compliance_bank_id: 1,
          compliance_bank_account_id: 1,
          operation_value: 1000,
          benefit_id: 1,
          id: 1,
        },
      ],

      treasury_instructions: [],
    }

    const mockPost = jest.fn(() => Promise.resolve(mockResponse))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    await store._createBallot(mockPayload)

    expect(mockPost).toHaveBeenCalledWith(
      'investment-portfolio/api/investment-portfolio/instruction-slip/store',
      mockPayload,
      { responseType: 'blob' }
    )
  })

  it('should call useUtils functions when blob is valid', async () => {
    const store = useGenerateBallotCollectionStoreV1()
    const mockGetNameBlob = jest.fn(() => 'file.xlsx')
    const mockDownloadBlobXlxx = jest.fn()

    const { useUtils } = require('@/composables')
    useUtils.mockReturnValue({
      getNameBlob: mockGetNameBlob,
      downloadBlobXlxx: mockDownloadBlobXlxx,
    })

    const mockResponse = {
      data: new Blob(['mockdata'], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      }),
      headers: {
        'content-type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    }

    const mockPayload: ICreateBallotPayload = {
      investment_portfolio_id: '1',
      operation_type_id: '2',
      instruction_slip_type_id: '3',
      operation_date: '2024-01-01',
      issuers_counterparty_id: '123',
      titles: [
        {
          title_id: 1,
          payment_or_collection_method_id: '1',
          origin_bank_id: 1,
          origin_bank_account_id: 1,
          destiny_bank_id: 1,
          destiny_bank_account_id: 1,
          compliance_bank_id: 1,
          compliance_bank_account_id: 1,
          operation_value: 1000,
          benefit_id: 1,
          id: 1,
        },
      ],

      treasury_instructions: [],
    }

    ;(executeApi as jest.Mock).mockReturnValue({
      post: jest.fn(() => Promise.resolve(mockResponse)),
    })

    const result = await store._createBallot(mockPayload)
    expect(result).toBe(true)
    expect(mockGetNameBlob).toHaveBeenCalledWith(mockResponse)
    expect(mockDownloadBlobXlxx).toHaveBeenCalledWith(
      expect.any(Blob),
      'file.xlsx'
    )
  })

  it('should set menu_data with _setMenuData', () => {
    const store = useGenerateBallotCollectionStoreV1()
    const mockMenuData: IGenerateBallotMenu = {
      investment_portfolio_id: '1',
      operation_type_id: '2',
      instruction_slip_type_id: '3',
      operation_date: '2024-01-01',
    }

    store._setMenuData(mockMenuData)
    expect(store.menu_data).toEqual(mockMenuData)

    store._setMenuData(null)
    expect(store.menu_data).toBeNull()
  })

  it('should set investmentId with _setInvestmentId', () => {
    const store = useGenerateBallotCollectionStoreV1()
    store._setInvestmentId(123)
    expect(store.investmentId).toBe(123)
    store._setInvestmentId(null)
    expect(store.investmentId).toBeNull()
  })

  it('should set nature_operation with _setNatureOperation', () => {
    const store = useGenerateBallotCollectionStoreV1()
    store._setNatureOperation('Ingreso')
    expect(store.nature_operation).toBe('Ingreso')
    store._setNatureOperation('Egreso')
    expect(store.nature_operation).toBe('Egreso')
  })

  it('should set request_flag with _setRequestFlag', () => {
    const store = useGenerateBallotCollectionStoreV1()
    store._setRequestFlag(true)
    expect(store.request_flag).toBe(true)
    store._setRequestFlag(false)
    expect(store.request_flag).toBe(false)
  })

  it('should call _getSelectionMenu successfully', async () => {
    const store = useGenerateBallotCollectionStoreV1()
    const mockPayload: ISelectionMenuPayload = {
      investment_portfolio_id: 1,
      operation_type_id: 2,
      instruction_slip_type_id: 3,
      operation_date: '2024-01-01',
    }

    const mockResponse = {
      data: { success: true, data: { result: 'ok' } },
    }

    ;(executeApi as jest.Mock).mockReturnValue({
      post: jest.fn(() => Promise.resolve(mockResponse)),
    })

    const result = await store._getSelectionMenu(mockPayload)
    expect(result).toEqual({ result: 'ok' })
  })

  it('should handle error in _getSelectionMenu gracefully', async () => {
    const store = useGenerateBallotCollectionStoreV1()
    const mockPayload: ISelectionMenuPayload = {
      investment_portfolio_id: 1,
      operation_type_id: 2,
      instruction_slip_type_id: 3,
      operation_date: '2024-01-01',
    }

    const mockPost = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._getSelectionMenu(mockPayload)
    expect(result).toBeUndefined()
  })
})
