import { setActivePinia, createPinia } from 'pinia'
import { usePortfolioClassificationStoreV2 } from './portfolio-classification-v2'
import { executeApi } from '@/apis'
import { URL_PATH_SETTLEMENT_COMMISSIONS } from '@/constants/apis'
import { IPortfolioClassificationForm } from '@/interfaces/customs/settlement-commissions/PortfolioClassification'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
  })),
}))

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useShowError: jest.fn(() => ({ showCatchError: jest.fn(() => 'Error!') })),
}))

const URL_PORTFOLIO_CLASSIFICATIONS = `${URL_PATH_SETTLEMENT_COMMISSIONS}/porfolio-classifications`

const mockPortfolioClassificationResponse = {
  id: 2,
  days_start: 0,
  days_end: 180,
  type: 'F',
  credit_bureau: 0,
  comission_settlement_statuses_id: 1,
}
const mockPortfolioClassification = [{ ...mockPortfolioClassificationResponse }]

describe('usePortfolioClassificationStoreV2', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('should fetch list of portfolio classifications', async () => {
    const store = usePortfolioClassificationStoreV2()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: {
          data: mockPortfolioClassification,
          current_page: 1,
          last_page: 2,
        },
        message: 'List fetched',
      },
      status: 200,
    })
    const params = { page: 1 }

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getPortfolioClassificationList(params)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PORTFOLIO_CLASSIFICATIONS}`, {
      params: { ...params, paginate: 1 },
    })
    expect(store.portfolio_classifications_list).toEqual(
      mockPortfolioClassification
    )
    expect(store.portfolio_classifications_pages.currentPage).toBe(1)
    expect(store.portfolio_classifications_pages.lastPage).toBe(2)
  })

  it('should handle error when fetching portfolio classifications', async () => {
    const store = usePortfolioClassificationStoreV2()
    const mockGet = jest.fn().mockRejectedValue(new Error('API Error'))
    const params = { page: 1 }

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getPortfolioClassificationList(params)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PORTFOLIO_CLASSIFICATIONS}`, {
      params: { ...params, paginate: 1 },
    })
    expect(store.portfolio_classifications_list).toEqual([])
  })

  it('should fetch portfolio classification by ID', async () => {
    const store = usePortfolioClassificationStoreV2()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: mockPortfolioClassificationResponse,
        message: 'Found',
      },
      status: 200,
    })

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdPorfolioClassification(1)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PORTFOLIO_CLASSIFICATIONS}/1`)
    expect(store.portfolio_classifications_response).toEqual(
      mockPortfolioClassificationResponse
    )
  })

  it('should handle error when fetching portfolio classification by ID', async () => {
    const store = usePortfolioClassificationStoreV2()
    const mockGet = jest.fn().mockRejectedValue(new Error('API Error'))

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdPorfolioClassification(1)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PORTFOLIO_CLASSIFICATIONS}/1`)
    expect(store.portfolio_classifications_response).toBeNull()
  })

  it('should update a portfolio classification', async () => {
    const store = usePortfolioClassificationStoreV2()
    const form: IPortfolioClassificationForm = {
      type: 'F1',
      days_start: 367,
      days_end: 502,
    }

    const mockPut = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Updated' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updatePortfolioClassification(form, 1)

    expect(mockPut).toHaveBeenCalledWith(
      `${URL_PORTFOLIO_CLASSIFICATIONS}/1`,
      form
    )
    expect(result).toBe(true)
  })

  it('should return false if update fails', async () => {
    const store = usePortfolioClassificationStoreV2()
    const form: IPortfolioClassificationForm = {
      type: 'F2',
      days_start: 367,
      days_end: 502,
    }

    const mockPut = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Error' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updatePortfolioClassification(form, 1)

    expect(result).toBe(false)
  })

  it('should clear all data in the store', () => {
    const store = usePortfolioClassificationStoreV2()

    store.portfolio_classifications_list = mockPortfolioClassification
    store.portfolio_classifications_response =
      mockPortfolioClassificationResponse

    store.portfolio_classifications_pages = {
      currentPage: 2,
      lastPage: 3,
    }

    store._clearData()

    expect(store.portfolio_classifications_list).toEqual([])
    expect(store.portfolio_classifications_response).toBeNull()
    expect(store.portfolio_classifications_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
  })
})
