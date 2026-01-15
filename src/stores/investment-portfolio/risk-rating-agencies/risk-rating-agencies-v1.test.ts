import { setActivePinia, createPinia } from 'pinia'
import { executeApi } from '@/apis'

import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import { IRiskRatingAgencies } from '@/interfaces/customs'

import { useRiskRatingAgenciesStoreV1 } from './risk-rating-agencies-v1'

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

describe('useRiskRatingAgenciesStoreV1', () => {
  const BASE_URL = `${URL_PATH_INVESTMENT_PORTFOLIO}/risk-rating-agencies`

  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('lists data correctly on _listAction', async () => {
    const store = useRiskRatingAgenciesStoreV1()
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

    expect(mockGet).toHaveBeenCalledWith(`${BASE_URL}/get?page=2`)
    expect(store.risk_rating_agencies_list).toEqual([{ id: 1 }])
    expect(store.risk_rating_agencies_pages.currentPage).toBe(2)
    expect(store.risk_rating_agencies_pages.lastPage).toBe(3)
  })

  it('handles error in _listAction', async () => {
    const store = useRiskRatingAgenciesStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Falló la petición'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._listAction('page=1')

    expect(mockGet).toHaveBeenCalled()
    expect(store.risk_rating_agencies_list).toEqual([])
  })

  it('returns data correctly in _showAction', async () => {
    const store = useRiskRatingAgenciesStoreV1()
    const mockResponse = {
      data: {
        success: true,
        data: { id: 1, code: 99 },
        message: 'Correcto',
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._showAction('1')

    expect(mockGet).toHaveBeenCalledWith(`${BASE_URL}/show/1`)
    expect(result).toEqual({ id: 1, code: 99 })
  })

  it('returns null on error in _showAction', async () => {
    const store = useRiskRatingAgenciesStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Error inesperado'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._showAction('123')

    expect(mockGet).toHaveBeenCalled()
    expect(result).toBeNull()
  })

  it('creates data correctly in _createAction', async () => {
    const store = useRiskRatingAgenciesStoreV1()
    const payload = { id: 1 } as IRiskRatingAgencies

    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Creado correctamente' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAction(payload)

    expect(mockPost).toHaveBeenCalledWith(`${BASE_URL}/new`, payload)
    expect(result).toBe(true)
  })

  it('returns false on error in _createAction', async () => {
    const store = useRiskRatingAgenciesStoreV1()
    const mockPost = jest.fn().mockRejectedValue(new Error('Falló'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createAction({} as IRiskRatingAgencies)

    expect(mockPost).toHaveBeenCalled()
    expect(result).toBe(false)
  })

  it('updates data correctly in _updateAction', async () => {
    const store = useRiskRatingAgenciesStoreV1()
    const payload = { id: 1 } as IRiskRatingAgencies

    const mockPut = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Actualizado correctamente' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateAction('10', payload)

    expect(mockPut).toHaveBeenCalledWith(`${BASE_URL}/update/10`, payload)
    expect(result).toBe(true)
  })

  it('returns false on error in _updateAction', async () => {
    const store = useRiskRatingAgenciesStoreV1()
    const mockPut = jest.fn().mockRejectedValue(new Error('Error update'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateAction('99', {} as IRiskRatingAgencies)

    expect(mockPut).toHaveBeenCalled()
    expect(result).toBe(false)
  })

  it('clears data with _clearData', () => {
    const store = useRiskRatingAgenciesStoreV1()

    store.risk_rating_agencies_list = [{ id: 123 }] as IRiskRatingAgencies[]
    store.risk_rating_agencies_pages.currentPage = 4
    store.risk_rating_agencies_pages.lastPage = 10

    store._clearData()

    expect(store.risk_rating_agencies_list).toEqual([])
    expect(store.risk_rating_agencies_pages).toEqual({
      currentPage: 1,
      lastPage: 1,
    })
  })
})
