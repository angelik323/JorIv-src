import { setActivePinia, createPinia } from 'pinia'
import { executeApi } from '@/apis'
import { URL_PATH_TREASURIES } from '@/constants/apis'
import { useRemoteAuthorizationStoreV2 } from './remote-authorization-v2'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
  })),
}))

jest.mock('@/composables', () => {
  const showAlertMock = jest.fn()
  const showCatchErrorMock = jest.fn()

  const useAlert = jest.fn(() => ({ showAlert: showAlertMock }))
  const useShowError = jest.fn(() => ({ showCatchError: showCatchErrorMock }))

  return { useAlert, useShowError, showAlertMock, showCatchErrorMock }
})

const { showAlertMock, showCatchErrorMock } = jest.requireMock('@/composables')

describe('useRemoteAuthorizationStoreV2', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('fetches list and updates state on success', async () => {
    const store = useRemoteAuthorizationStoreV2()
    const params = { page: 2, rows: 20, status: 'pending' }

    const mockResponse = {
      data: {
        success: true,
        message: 'Listado OK',
        data: {
          current_page: 2,
          last_page: 5,
          data: [{ id: 10, code: 'A-001', status: 'pending' }],
        },
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getListAction(params)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/remote-authorizations`,
      {
        params: { ...params, paginate: 1 },
      }
    )

    expect(showAlertMock).toHaveBeenCalledWith(
      'Listado OK',
      'success',
      undefined,
      3000
    )
  })

  it('handles failure when fetching list', async () => {
    const store = useRemoteAuthorizationStoreV2()

    const mockResponse = {
      data: { success: false, message: 'Falló', data: null },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params = { page: 1 }

    await store._getListAction(params)

    expect(showAlertMock).toHaveBeenCalledWith(
      undefined,
      'error',
      undefined,
      3000
    )
  })

  it('handles exception in _getListAction', async () => {
    const store = useRemoteAuthorizationStoreV2()
    const error = new Error('Error en red')
    showCatchErrorMock.mockReturnValue('Error controlado')

    const mockGet = jest.fn().mockRejectedValue(error)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getListAction({ page: 1 })

    expect(showCatchErrorMock).toHaveBeenCalledWith(error)
    expect(showAlertMock).toHaveBeenCalledWith(
      'Error controlado',
      'error',
      undefined,
      3000
    )
  })

  it('bulk update - authorize successfully', async () => {
    const store = useRemoteAuthorizationStoreV2()
    const mockResponse = {
      data: { success: true, message: 'Autorizado' },
    }

    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const authorizations = [
      { id: 1, is_authorized: true },
      { id: 2, is_authorized: true },
      { id: 3, is_authorized: true },
    ]
    const result = await store._bulkUpdate(authorizations)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/remote-authorizations/bulk-update`,
      { authorizations }
    )
    expect(showAlertMock).toHaveBeenCalledWith(
      'Autorizado',
      'success',
      undefined,
      3000
    )
    expect(result).toBe(true)
  })

  it('bulk update - handles failure in authorize', async () => {
    const store = useRemoteAuthorizationStoreV2()
    const mockResponse = {
      data: { success: false, message: 'No se pudo' },
    }

    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const authorizations = [{ id: 99, is_authorized: true }]
    const result = await store._bulkUpdate(authorizations)

    expect(result).toBe(false)
    expect(showAlertMock).toHaveBeenCalledWith(
      'No se pudo',
      'error',
      undefined,
      3000
    )
  })

  it('bulk update - handles exception in authorize', async () => {
    const store = useRemoteAuthorizationStoreV2()
    const error: unknown = new Error('Falla en autorizar')

    ;(error as { response?: { data?: { message?: string } } }).response = {
      data: { message: undefined },
    }
    showCatchErrorMock.mockReturnValue('Error controlado')

    const mockPost = jest.fn().mockRejectedValue(error)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const authorizations = [{ id: 1, is_authorized: true }]
    const result = await store._bulkUpdate(authorizations)

    expect(result).toBe(false)
    expect(showCatchErrorMock).not.toHaveBeenCalledWith(error)
    expect(showAlertMock).not.toHaveBeenCalledWith(
      'Error controlado',
      'error',
      undefined,
      3000
    )
  })

  it('bulk update - reject successfully', async () => {
    const store = useRemoteAuthorizationStoreV2()
    const mockResponse = {
      data: { success: true, message: 'Rechazado' },
    }

    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const authorizations = [
      {
        id: 4,
        is_authorized: false,
        rejection_reason: 'Documentación incompleta',
      },
      { id: 5, is_authorized: false, rejection_reason: 'Saldo insuficiente' },
    ]
    const result = await store._bulkUpdate(authorizations)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/remote-authorizations/bulk-update`,
      { authorizations }
    )
    expect(showAlertMock).toHaveBeenCalledWith(
      'Rechazado',
      'success',
      undefined,
      3000
    )
    expect(result).toBe(true)
  })

  it('bulk update - handles failure in reject', async () => {
    const store = useRemoteAuthorizationStoreV2()
    const mockResponse = {
      data: { success: false, message: 'No se rechazó' },
    }

    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const authorizations = [
      { id: 7, is_authorized: false, rejection_reason: 'Test reason' },
    ]
    const result = await store._bulkUpdate(authorizations)

    expect(result).toBe(false)
    expect(showAlertMock).toHaveBeenCalledWith(
      'No se rechazó',
      'error',
      undefined,
      3000
    )
  })

  it('bulk update - handles exception in reject', async () => {
    const store = useRemoteAuthorizationStoreV2()
    const error = new Error('Falla en rechazo')
    if (typeof error === 'object' && error !== null) {
      ;(error as { response?: { data?: { message?: string } } }).response = {
        data: { message: 'Mensaje de error backend' },
      }
    }
    showCatchErrorMock.mockReturnValue('Error controlado')

    const mockPost = jest.fn().mockRejectedValue(error)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const authorizations = [
      { id: 8, is_authorized: false, rejection_reason: 'Test error' },
    ]
    const result = await store._bulkUpdate(authorizations)

    expect(result).toBe(false)
    expect(showCatchErrorMock).not.toHaveBeenCalledWith(error)
    expect(showAlertMock).toHaveBeenCalledWith(
      'Mensaje de error backend',
      'error',
      undefined,
      3000
    )
  })

  it('bulk update - mixed authorize and reject successfully', async () => {
    const store = useRemoteAuthorizationStoreV2()
    const mockResponse = {
      data: { success: true, message: 'Procesado exitosamente' },
    }

    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const authorizations = [
      { id: 1, is_authorized: true },
      { id: 2, is_authorized: false, rejection_reason: 'Datos incorrectos' },
      { id: 3, is_authorized: true },
    ]
    const result = await store._bulkUpdate(authorizations)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/remote-authorizations/bulk-update`,
      { authorizations }
    )
    expect(showAlertMock).toHaveBeenCalledWith(
      'Procesado exitosamente',
      'success',
      undefined,
      3000
    )
    expect(result).toBe(true)
  })

  it('bulk update - generates correct success messages for authorizations only', async () => {
    const store = useRemoteAuthorizationStoreV2()
    const mockResponse = {
      data: { success: true },
    }

    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const authorizations = [
      { id: 1, is_authorized: true },
      { id: 2, is_authorized: true },
    ]
    await store._bulkUpdate(authorizations)

    expect(showAlertMock).toHaveBeenCalledWith(
      'Se autorizaron 2 registros exitosamente',
      'success',
      undefined,
      3000
    )
  })

  it('bulk update - generates correct success messages for rejections only', async () => {
    const store = useRemoteAuthorizationStoreV2()
    const mockResponse = {
      data: { success: true },
    }

    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const authorizations = [
      { id: 3, is_authorized: false, rejection_reason: 'Test' },
      { id: 4, is_authorized: false, rejection_reason: 'Test2' },
    ]
    await store._bulkUpdate(authorizations)

    expect(showAlertMock).toHaveBeenCalledWith(
      'Se rechazaron 2 registros exitosamente',
      'success',
      undefined,
      3000
    )
  })

  it('bulk update - generates correct success messages for mixed operations', async () => {
    const store = useRemoteAuthorizationStoreV2()
    const mockResponse = {
      data: { success: true },
    }

    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const authorizations = [
      { id: 5, is_authorized: true },
      { id: 6, is_authorized: false, rejection_reason: 'Test' },
    ]
    await store._bulkUpdate(authorizations)

    expect(showAlertMock).toHaveBeenCalledWith(
      'Se procesaron 1 autorizaciones y 1 rechazos exitosamente',
      'success',
      undefined,
      3000
    )
  })

  it('authorizes individual successfully', async () => {
    const store = useRemoteAuthorizationStoreV2()
    const mockResponse = {
      data: { success: true, message: 'Autorizado' },
    }

    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const ok = await store._authorize(42)

    expect(mockPost).toHaveBeenCalledWith(
      `/api/v1/remote-authorizations/42/authorize`
    )
    expect(ok).toBe(true)
    expect(showAlertMock).toHaveBeenCalledWith(
      'Autorizado',
      'success',
      undefined,
      3000
    )
  })

  it('handles failure in authorize individual', async () => {
    const store = useRemoteAuthorizationStoreV2()
    const mockResponse = {
      data: { success: false, message: 'No fue posible autorizar' },
    }

    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const ok = await store._authorize(1)

    expect(ok).toBe(false)
    expect(showAlertMock).toHaveBeenCalledWith(
      'No fue posible autorizar',
      'error',
      undefined,
      3000
    )
  })

  it('handles exception in authorize individual', async () => {
    const store = useRemoteAuthorizationStoreV2()
    const error = new Error('Falla auth')
    showCatchErrorMock.mockReturnValue('Error controlado')

    const mockPost = jest.fn().mockRejectedValue(error)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const ok = await store._authorize(1)

    expect(ok).toBe(false)
    expect(showCatchErrorMock).toHaveBeenCalledWith(error)
    expect(showAlertMock).toHaveBeenCalledWith(
      'Error controlado',
      'error',
      undefined,
      3000
    )
  })

  it('rejects individual successfully', async () => {
    const store = useRemoteAuthorizationStoreV2()
    const mockResponse = {
      data: { success: true, message: 'Rechazado' },
    }

    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const ok = await store._reject(55)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/remote-authorizations/55/reject`
    )
    expect(ok).toBe(true)
    expect(showAlertMock).toHaveBeenCalledWith(
      'Rechazado',
      'success',
      undefined,
      3000
    )
  })

  it('handles failure in reject individual', async () => {
    const store = useRemoteAuthorizationStoreV2()
    const mockResponse = {
      data: { success: false, message: 'No fue posible rechazar' },
    }

    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const ok = await store._reject(2)

    expect(ok).toBe(false)
    expect(showAlertMock).toHaveBeenCalledWith(
      'No fue posible rechazar',
      'error',
      undefined,
      3000
    )
  })

  it('handles exception in reject individual', async () => {
    const store = useRemoteAuthorizationStoreV2()
    const error = new Error('Falla reject')
    showCatchErrorMock.mockReturnValue('Error controlado')

    const mockPost = jest.fn().mockRejectedValue(error)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const ok = await store._reject(2)

    expect(ok).toBe(false)
    expect(showCatchErrorMock).toHaveBeenCalledWith(error)
    expect(showAlertMock).toHaveBeenCalledWith(
      'Error controlado',
      'error',
      undefined,
      3000
    )
  })

  it('gets detail successfully', async () => {
    const store = useRemoteAuthorizationStoreV2()

    const mockItem = { id: 123, code: 'A-123', status: 'approved' }
    const mockResponse = {
      data: { success: true, data: mockItem },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._get(123)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/remote-authorizations/123/view`
    )
    expect(result).toEqual(mockItem)
  })

  it('returns null and alerts on get detail when success=false', async () => {
    const store = useRemoteAuthorizationStoreV2()

    const mockResponse = {
      data: { success: false, data: null, message: 'No disponible' },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._get(999)

    expect(result).toBeNull()
    expect(showAlertMock).toHaveBeenCalledWith(
      'No disponible',
      'error',
      undefined,
      3000
    )
  })

  it('handles exception in _get (detail)', async () => {
    const store = useRemoteAuthorizationStoreV2()
    const error = new Error('Detalle no disponible')
    showCatchErrorMock.mockReturnValue('Error controlado')

    const mockGet = jest.fn().mockRejectedValue(error)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._get(1)

    expect(result).toBeNull()
    expect(showCatchErrorMock).toHaveBeenCalledWith(error)
    expect(showAlertMock).toHaveBeenCalledWith(
      'Error controlado',
      'error',
      undefined,
      3000
    )
  })

  it('updates record successfully', async () => {
    const store = useRemoteAuthorizationStoreV2()
    const mockResponse = {
      data: { success: true, message: 'Actualizado correctamente' },
    }

    const mockPut = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const ok = await store._update(55, {
      status: { id: 1, name: 'authorized' },
    })

    expect(mockPut).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/remote-authorizations/55`,
      { status: { id: 1, name: 'authorized' } }
    )
    expect(ok).toBe(true)
    expect(showAlertMock).toHaveBeenCalledWith(
      'Actualizado correctamente',
      'success',
      undefined,
      3000
    )
  })

  it('handles failure in update', async () => {
    const store = useRemoteAuthorizationStoreV2()
    const mockResponse = {
      data: { success: false, message: 'No fue posible actualizar' },
    }

    const mockPut = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const ok = await store._update(77, { status: { id: 2, name: 'rejected' } })

    expect(ok).toBe(false)
    expect(showAlertMock).toHaveBeenCalledWith(
      'No fue posible actualizar',
      'error',
      undefined,
      3000
    )
  })

  it('handles exception in update', async () => {
    const store = useRemoteAuthorizationStoreV2()
    const error = new Error('Falla en update')
    showCatchErrorMock.mockReturnValue('Error controlado')

    const mockPut = jest.fn().mockRejectedValue(error)
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const ok = await store._update(70, { status: { id: 3, name: 'pending' } })

    expect(ok).toBe(false)
    expect(showCatchErrorMock).toHaveBeenCalledWith(error)
    expect(showAlertMock).toHaveBeenCalledWith(
      'Error controlado',
      'error',
      undefined,
      3000
    )
  })

  it('loads statuses', async () => {
    const store = useRemoteAuthorizationStoreV2()
    const mockResponse = {
      data: {
        success: true,
        data: [{ id: 1, code: 'pending', name: 'Por Autorizar' }],
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getStatuses()

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/remote-authorizations/statuses`
    )
    expect(store.statuses).toEqual([
      { id: 1, code: 'pending', name: 'Por Autorizar' },
    ])
  })

  it('loads modules', async () => {
    const store = useRemoteAuthorizationStoreV2()
    const mockResponse = {
      data: {
        success: true,
        data: [{ id: 1, code: 'treasury', name: 'Tesorería' }],
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getModules()

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/remote-authorizations/modules`
    )
    expect(store.modules).toEqual([
      { id: 1, code: 'treasury', name: 'Tesorería' },
    ])
  })

  it('loads processes', async () => {
    const store = useRemoteAuthorizationStoreV2()
    const mockResponse = {
      data: {
        success: true,
        data: [{ id: 1, code: 'dispersion', name: 'Dispersión' }],
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getProcesses()

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/remote-authorizations/processes`
    )
    expect(store.processes).toEqual([
      { id: 1, code: 'dispersion', name: 'Dispersión' },
    ])
  })

  it('loads general stats', async () => {
    const store = useRemoteAuthorizationStoreV2()
    const mockResponse = {
      data: {
        success: true,
        data: { total: 10, authorized: 4, pending: 5, rejected: 1 },
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getStatsGeneral()

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/remote-authorizations/stats`
    )
    expect(store.stats_general).toEqual({
      total: 10,
      authorized: 4,
      pending: 5,
      rejected: 1,
    })
  })

  it('loads stats by module', async () => {
    const store = useRemoteAuthorizationStoreV2()
    const mockResponse = {
      data: {
        success: true,
        data: [
          {
            module_code: 'treasury',
            module_name: 'Tesorería',
            total: 6,
            authorized: 3,
            pending: 2,
            rejected: 1,
          },
        ],
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getStatsByModule()

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/remote-authorizations/stats-by-module`
    )
    expect(store.stats_by_module).toEqual([
      {
        module_code: 'treasury',
        module_name: 'Tesorería',
        total: 6,
        authorized: 3,
        pending: 2,
        rejected: 1,
      },
    ])
  })

  it('loads pending list with pagination', async () => {
    const store = useRemoteAuthorizationStoreV2()
    const params = 'page=3&rows=10'

    const mockResponse = {
      data: {
        success: true,
        data: {
          current_page: 3,
          last_page: 7,
          data: [{ id: 99, code: 'P-099', status: 'pending' }],
        },
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getPending(params)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/remote-authorizations/pending?paginate=1&${params}`
    )
    expect(store.pending_list).toEqual([
      { id: 99, code: 'P-099', status: 'pending' },
    ])
    expect(store.pending_pages).toEqual({ currentPage: 3, lastPage: 7 })
  })
})
