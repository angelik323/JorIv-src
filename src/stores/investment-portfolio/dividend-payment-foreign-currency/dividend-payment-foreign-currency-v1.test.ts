import { useDividendPaymentForeignCurrencyStoreV1 } from './dividend-payment-foreign-currency-v1'
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import { IEmitterDividend } from '@/interfaces/customs'
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

describe('useDividendPaymentForeignCurrencyStoreV1', () => {
  const BASE_URL = `${URL_PATH_INVESTMENT_PORTFOLIO}/payment-dividends-foreign-currency`

  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('lists data correctly on _listAction', async () => {
    const store = useDividendPaymentForeignCurrencyStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'Cargado correctamente',
        data: {
          data: [{ id: 1 }],
        },
        current_page: 2,
        last_page: 3,
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._listAction('page=2')

    expect(mockGet).toHaveBeenCalledWith(`${BASE_URL}/list?page=2`)
    expect(store.payment_dividends_foreign_currency_list).toEqual([{ id: 1 }])
    expect(store.payment_dividends_foreign_currency_pages.currentPage).toBe(2)
    expect(store.payment_dividends_foreign_currency_pages.lastPage).toBe(3)
  })

  it('handles error in _listAction', async () => {
    const store = useDividendPaymentForeignCurrencyStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Falló la petición'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._listAction('page=1')

    expect(mockGet).toHaveBeenCalled()
    expect(store.payment_dividends_foreign_currency_list).toEqual([])
  })

  it('returns data correctly in _showAction', async () => {
    const store = useDividendPaymentForeignCurrencyStoreV1()
    const mockResponse = {
      data: {
        success: true,
        data: { id: 1, emitter_id: 99 },
        message: 'Correcto',
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._showAction('1')

    expect(mockGet).toHaveBeenCalledWith(`${BASE_URL}/show/1`)
    expect(result).toEqual({ id: 1, emitter_id: 99 })
  })

  it('returns null on error in _showAction', async () => {
    const store = useDividendPaymentForeignCurrencyStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Error inesperado'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._showAction('123')

    expect(mockGet).toHaveBeenCalled()
    expect(result).toBeNull()
  })

  it('creates data correctly in _createAction', async () => {
    const store = useDividendPaymentForeignCurrencyStoreV1()
    const payload = { emitter_id: 1 } as IEmitterDividend

    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Creado correctamente' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAction(payload)

    expect(mockPost).toHaveBeenCalledWith(`${BASE_URL}/new`, payload)
    expect(result).toBe(true)
  })

  it('returns false on error in _createAction', async () => {
    const store = useDividendPaymentForeignCurrencyStoreV1()
    const mockPost = jest.fn().mockRejectedValue(new Error('Falló'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAction({} as IEmitterDividend)

    expect(mockPost).toHaveBeenCalled()
    expect(result).toBe(false)
  })

  it('updates data correctly in _updateAction', async () => {
    const store = useDividendPaymentForeignCurrencyStoreV1()
    const payload = { emitter_id: 1 } as IEmitterDividend

    const mockPut = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Actualizado correctamente' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateAction('10', payload)

    expect(mockPut).toHaveBeenCalledWith(`${BASE_URL}/update/10`, payload)
    expect(result).toBe(true)
  })

  it('returns false on error in _updateAction', async () => {
    const store = useDividendPaymentForeignCurrencyStoreV1()
    const mockPut = jest.fn().mockRejectedValue(new Error('Error update'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateAction('99', {} as IEmitterDividend)

    expect(mockPut).toHaveBeenCalled()
    expect(result).toBe(false)
  })

  it('calls share API correctly in _shareAction', async () => {
    const store = useDividendPaymentForeignCurrencyStoreV1()
    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, data: { shared: true }, message: 'Compartido' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._shareAction({ IEmitterDividend: 'data' })

    expect(mockPost).toHaveBeenCalledWith(`${BASE_URL}/foreign-currency-shar`, {
      IEmitterDividend: 'data',
    })
    expect(result).toEqual({ shared: true })
  })

  it('returns null on error in _shareAction', async () => {
    const store = useDividendPaymentForeignCurrencyStoreV1()
    const mockPost = jest.fn().mockRejectedValue(new Error('Error share'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._shareAction({})

    expect(mockPost).toHaveBeenCalled()
    expect(result).toBeNull()
  })

  it('clears data with _clearData', () => {
    const store = useDividendPaymentForeignCurrencyStoreV1()

    store.payment_dividends_foreign_currency_list = [
      { emitter_id: 123 },
    ] as Partial<IEmitterDividend>[] as IEmitterDividend[]
    store.payment_dividends_foreign_currency_pages.currentPage = 4
    store.payment_dividends_foreign_currency_pages.lastPage = 10

    store._clearData()

    expect(store.payment_dividends_foreign_currency_list).toEqual([])
    expect(store.payment_dividends_foreign_currency_pages).toEqual({
      currentPage: 1,
      lastPage: 1,
    })
  })
})
