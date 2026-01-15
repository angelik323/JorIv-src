import { setActivePinia, createPinia } from 'pinia'
import { useBillingPortfolioClosureStoreV1 } from './billing-portfolio-closure-v1'
import { executeApi } from '@/apis'
import { IBillingAndPortfolioClousureInformationForm } from '@/interfaces/customs'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
  })),
}))
jest.mock('@/composables', () => ({
  useAlert: () => ({ showAlert: jest.fn() }),
  useShowError: () => ({ showCatchError: jest.fn(() => 'Error') }),
}))

describe('useBillingPortfolioClosureStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('should update the list and pages upon successful data collection', async () => {
    const store = useBillingPortfolioClosureStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'ok',
        data: {
          data: [
            {
              id: 1,
              invoice_number: 'A',
              name_business: 'B',
              status: { id: '1', name: 'Activo' },
            },
          ],
          current_page: 2,
          last_page: 5,
        },
      },
    }
    ;(executeApi as jest.Mock).mockReturnValue({
      get: jest.fn().mockResolvedValue(mockResponse),
    })

    await store._getBillingPortfolioClosureList('&page=2')

    expect(store.billing_portfolio_clouser_list).toEqual(
      mockResponse.data.data.data
    )
    expect(store.billing_portfolio_clouser_pages).toEqual({
      currentPage: 2,
      lastPage: 5,
    })
  })

  it('should show an error alert if the request fails', async () => {
    const store = useBillingPortfolioClosureStoreV1()
    ;(executeApi as jest.Mock).mockReturnValue({
      get: jest.fn().mockRejectedValue({}),
    })

    await store._getBillingPortfolioClosureList('')

    expect(store.billing_portfolio_clouser_list).toEqual([])
  })

  it('should return true and show a success alert if the request is successful', async () => {
    const store = useBillingPortfolioClosureStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'Confirmado',
      },
    }
    ;(executeApi as jest.Mock).mockReturnValue({
      post: jest.fn().mockResolvedValue(mockResponse),
    })

    const result = await store._postBillingPortfolioClosure(1, { foo: 'bar' })

    expect(result).toBe(true)
  })

  it('should return false and show an error alert if the request fails', async () => {
    const store = useBillingPortfolioClosureStoreV1()
    ;(executeApi as jest.Mock).mockReturnValue({
      post: jest.fn().mockRejectedValue({}),
    })

    const result = await store._postBillingPortfolioClosure(1, { foo: 'bar' })

    expect(result).toBe(false)
  })

  it('should update billing_portfolio_clouser_response and show a success alert if the request is successful', async () => {
    const store = useBillingPortfolioClosureStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'ok',
        data: { id: 1, foo: 'bar' },
      },
    }
    ;(executeApi as jest.Mock).mockReturnValue({
      get: jest.fn().mockResolvedValue(mockResponse),
    })

    await store._getByIdBillingPortfolioClosure(1)

    expect(store.billing_portfolio_clouser_response).toEqual({
      id: 1,
      foo: 'bar',
    })
  })

  it('should show an error alert if the request fails', async () => {
    const store = useBillingPortfolioClosureStoreV1()
    ;(executeApi as jest.Mock).mockReturnValue({
      get: jest.fn().mockRejectedValue({}),
    })

    await store._getByIdBillingPortfolioClosure(1)

    expect(store.billing_portfolio_clouser_response).toEqual({})
  })

  it('should return true and update billing_portfolio_clouser_validated_response if the request is successful', async () => {
    const store = useBillingPortfolioClosureStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'Validado',
        data: { id: 1, foo: 'bar' },
      },
    }
    ;(executeApi as jest.Mock).mockReturnValue({
      post: jest.fn().mockResolvedValue(mockResponse),
    })

    const result = await store._postValidatePendingRequirements({ foo: 'bar' })

    expect(result).toBe(true)
    expect(store.billing_portfolio_clouser_validated_response).toEqual({
      id: 1,
      foo: 'bar',
    })
  })

  it('should return false and show an error alert if the request fails', async () => {
    const store = useBillingPortfolioClosureStoreV1()
    ;(executeApi as jest.Mock).mockReturnValue({
      post: jest.fn().mockRejectedValue({}),
    })

    const result = await store._postValidatePendingRequirements({ foo: 'bar' })

    expect(result).toBe(false)
    expect(store.billing_portfolio_clouser_validated_response).toEqual({})
  })

  it('should clear the store data', () => {
    const store = useBillingPortfolioClosureStoreV1()
    store.billing_portfolio_clouser_list = [
      {
        id: 1,
        period: '2024-01',
        closing_date: '2024-01-31',
        observations: 'Test observation',
        validate_requirements_checked: true,
        validations: 'Some validations',
        requirements_validated: true,
        confirmed_validated: false,
        status_id: 1,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
        created_by: 'user1',
        updated_by: 'user2',
        status: {
          id: 1,
          name: 'Activo',
          created_by: null,
          created_at: '',
          updated_at: '',
        },
      },
    ]
    store.billing_portfolio_clouser_response = {
      id: 1,
    } as IBillingAndPortfolioClousureInformationForm
    store.billing_portfolio_clouser_pages = { currentPage: 2, lastPage: 5 }

    store._clearData()

    expect(store.billing_portfolio_clouser_list).toEqual([])
    expect(store.billing_portfolio_clouser_response).toEqual({})
    expect(store.billing_portfolio_clouser_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
  })
})
