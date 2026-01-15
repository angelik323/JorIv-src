import { useExchangedTradedFundsStoreV1 } from './equity-ops-v1'
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import { IExchangeTradedFund } from '@/interfaces/customs'
import { setActivePinia, createPinia } from 'pinia'
import { executeApi } from '@/apis'

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
  useShowError: jest.fn(() => ({
    showCatchError: jest.fn(() => 'Error capturado'),
  })),
}))

describe('useExchangedTradedFundsStoreV1', () => {
  const URL_PATH = `${URL_PATH_INVESTMENT_PORTFOLIO}/exchange-traded-fund`

  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('lists data correctly on _listAction', async () => {
    const store = useExchangedTradedFundsStoreV1()
    const mockEtf: IExchangeTradedFund = {
      consecutive: 1,
      exchange_traded_fund_description: 'Otro Eft',
      exchange_traded_fund_number: 40,
      investment_porfolio_code: 'PDI1000001',
      investment_portfolio_description: 'prueba portafolio pdi 1',
      operation_date: null,
      operation_number: 13,
      operation_type_description: 'prueba desc',
      status_description: "Compra ETF's en operación de contado",
      status_id: 69,
      title_number: 24,
    }

    const mockResponse = {
      data: {
        success: true,
        message: 'Listado cargado',
        data: {
          data: [mockEtf],
          current_page: 5,
          last_page: 8,
        },
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._listAction({ page: 5 })

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/operations`, {
      params: { page: 5, paginate: 1 },
    })
    expect(store.exchange_traded_fund_list).toEqual([mockEtf])
    expect(store.exchange_traded_fund_pages).toEqual({
      currentPage: 5,
      lastPage: 8,
    })
  })

  it('handles error in _listAction', async () => {
    const store = useExchangedTradedFundsStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Falló ETF'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._listAction({ page: 1 })

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/operations`, {
      params: { page: 1, paginate: 1 },
    })

    expect(store.exchange_traded_fund_list).toEqual([])
    expect(store.exchange_traded_fund_pages).toEqual({
      currentPage: 1,
      lastPage: 1,
    })
  })

  it('clears data with _clearData', () => {
    const store = useExchangedTradedFundsStoreV1()
    const mockEtf: IExchangeTradedFund = {
      consecutive: 99,
      exchange_traded_fund_description: 'ETF de prueba',
      exchange_traded_fund_number: 500,
      investment_porfolio_code: 'PDI2000002',
      investment_portfolio_description: 'Portafolio de prueba',
      operation_date: '2025-01-01',
      operation_number: 22,
      operation_type_description: 'Tipo prueba',
      status_description: 'Estado de prueba',
      status_id: 100,
      title_number: 55,
    }

    store.exchange_traded_fund_list = [mockEtf]
    store.exchange_traded_fund_pages.currentPage = 3
    store.exchange_traded_fund_pages.lastPage = 9

    store._clearData()

    expect(store.exchange_traded_fund_list).toEqual([])
    expect(store.exchange_traded_fund_pages).toEqual({
      currentPage: 1,
      lastPage: 1,
    })
  })
})
