import { useRangesForDeferredStoreV1 } from './ranges-for-deferred-v1'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'
import { setActivePinia, createPinia } from 'pinia'
import { executeApi } from '@/apis'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    put: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  })),
}))

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useShowError: jest.fn(() => ({ showCatchError: jest.fn() })),
}))

describe('useRangesForDeferredStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('fetches resources successfully', async () => {
    const store = useRangesForDeferredStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'Cargado',
        data: {
          account_structures: [{ id: 1, name: 'Cuenta' }],
          business_trusts: [{ id: 2, name: 'Fiducia' }],
          range_types: [{ id: 3, name: 'Tipo' }],
        },
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._resourcesAction()

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/deferred-impairments/filter-options`
    )
    expect(store.account_structures).toEqual([{ value: 1, label: 'Cuenta' }])
    expect(store.business_trusts).toEqual([{ value: 2, label: 'Fiducia' }])
    expect(store.range_types).toEqual([{ value: 3, label: 'Tipo' }])
  })

  it('handles error in _resourcesAction', async () => {
    const store = useRangesForDeferredStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Error de red'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._resourcesAction()

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/deferred-impairments/filter-options`
    )
  })

  it('lists ranges successfully', async () => {
    const store = useRangesForDeferredStoreV1()

    const mockResponse = {
      data: {
        success: true,
        message: 'Listo',
        current_page: 1,
        last_page: 3,
        data: {
          data: [
            {
              id: 1,
              account_structure: { code: '123', purpose: 'General' },
              business_trusts: [{ name: 'FiduciaX' }],
              ranges: [
                {
                  id: 1,
                  range_type: 'Tipo1',
                  receipt_type: { code: 'RC' },
                  sub_receipt_type: { code: 'RC-01' },
                },
              ],
            },
          ],
        },
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._listAction({ page: 1 })

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/deferred-impairments`,
      {
        params: { page: 1, paginate: 1 },
      }
    )

    expect(store.ranges_list).toHaveLength(1)
    expect(store.ranges_pages.currentPage).toBe(1)
    expect(store.ranges_pages.lastPage).toBe(3)
  })

  it('handles error in _listAction', async () => {
    const store = useRangesForDeferredStoreV1()

    const mockGet = jest.fn().mockRejectedValue(new Error('Error inesperado'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._listAction({ page: 1 })

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/deferred-impairments`,
      {
        params: { page: 1, paginate: 1 },
      }
    )

    expect(store.ranges_list).toEqual([])
  })

  it('shows single range successfully', async () => {
    const store = useRangesForDeferredStoreV1()
    const mockResponse = {
      data: {
        success: true,
        data: { id: 9, name: 'Detalle' },
        message: 'Éxito',
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._showAction(9)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/deferred-impairments/9`
    )
    expect(result).toEqual({ id: 9, name: 'Detalle' })
  })

  it('handles error in _showAction', async () => {
    const store = useRangesForDeferredStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Falló show'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._showAction(99)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/deferred-impairments/99`
    )
    expect(result).toBeNull()
  })

  it('creates successfully', async () => {
    const store = useRangesForDeferredStoreV1()
    const mockResponse = {
      data: { success: true, message: 'Creado' },
    }

    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload = { id: 1 }
    const result = await store._createAction(payload as any)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/deferred-impairments/`,
      payload
    )
    expect(result).toBe(true)
  })

  it('handles error in _createAction', async () => {
    const store = useRangesForDeferredStoreV1()
    const mockPost = jest.fn().mockRejectedValue(new Error('Falló create'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload = { id: 1 }
    const result = await store._createAction(payload as any)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/deferred-impairments/`,
      payload
    )
    expect(result).toBe(false)
  })

  it('updates successfully', async () => {
    const store = useRangesForDeferredStoreV1()
    const mockResponse = {
      data: { success: true, message: 'Actualizado' },
    }

    const mockPut = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const payload = { id: 2 }
    const result = await store._updateAction(payload as any)

    expect(mockPut).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/deferred-impairments/2`,
      payload
    )
    expect(result).toBe(true)
  })

  it('handles error in _updateAction', async () => {
    const store = useRangesForDeferredStoreV1()
    const mockPut = jest.fn().mockRejectedValue(new Error('Falló update'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const payload = { id: 2 }
    const result = await store._updateAction(payload as any)

    expect(mockPut).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/deferred-impairments/2`,
      payload
    )
    expect(result).toBe(false)
  })
})
