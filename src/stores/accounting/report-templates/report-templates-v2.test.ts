import { setActivePinia, createPinia } from 'pinia'
import { useReportTemplateStoreV2 } from './report-templates-v2'
import { TIMEOUT_ALERT } from '@/constants/alerts'

let mockShowAlert: jest.Mock
let mockShowCatchError: jest.Mock

jest.mock('@/apis', () => ({
  executeApi: jest.fn(),
}))

jest.mock('@/composables/useAlert', () => {
  mockShowAlert = jest.fn()
  return {
    useAlert: () => ({ showAlert: mockShowAlert }),
  }
})

jest.mock('@/composables/useShowError', () => {
  mockShowCatchError = jest.fn().mockReturnValue('Error catch')
  return {
    useShowError: () => ({ showCatchError: mockShowCatchError }),
  }
})

jest.mock('@/composables/useUtils', () => ({
  useUtils: () => ({ defaultIconsLucide: { plusCircle: 'icon' } }),
}))

jest.mock('@/constants/apis', () => ({
  URL_PATH_ACCOUNTING: '/api/accounting',
}))

jest.mock('@/constants/alerts', () => ({
  TIMEOUT_ALERT: 3000,
}))

const executeApi = jest.requireMock('@/apis').executeApi as jest.Mock

const setApiMock = (
  handlers: Partial<
    Record<'get' | 'post' | 'put' | 'patch' | 'delete', jest.Mock>
  >
) => {
  executeApi.mockReturnValue({
    get: handlers.get,
    post: handlers.post,
    put: handlers.put,
    patch: handlers.patch,
    delete: handlers.delete,
  })
}

beforeEach(() => {
  setActivePinia(createPinia())
  jest.clearAllMocks()
})

it('default state', () => {
  const store = useReportTemplateStoreV2()
  expect(store.headerPropsDefault.title).toBe('Plantilla de Reportes')
  expect(store.report_template_logo_response).toEqual({})
  expect(store.report_template_signature_response).toEqual({})
  expect(store.report_template_response).toEqual({})
})

it('getReportTemplateLogo success', async () => {
  const store = useReportTemplateStoreV2()
  const mockResponse = {
    data: {
      success: true,
      message: 'ok',
      data: { data: [{ id: 1 }], current_page: 2, last_page: 3 },
    },
  }
  setApiMock({ get: jest.fn(() => Promise.resolve(mockResponse)) })

  const result = await store._getReportTemplateLogo()

  expect(result).toStrictEqual({
    data: [{ id: 1 }],
    current_page: 2,
    last_page: 3,
  })
  expect(mockShowAlert).not.toHaveBeenCalled()
})

it('getReportTemplateLogo failure', async () => {
  const store = useReportTemplateStoreV2()
  const mockResponse = {
    data: { success: false, message: 'fail', data: { data: [] } },
  }
  setApiMock({ get: jest.fn(() => Promise.resolve(mockResponse)) })

  const result = await store._getReportTemplateLogo()

  expect(result).toBeNull()
  expect(mockShowAlert).toHaveBeenCalledWith(
    'fail',
    'error',
    undefined,
    TIMEOUT_ALERT
  )
})

it('getReportTemplateLogo catch', async () => {
  const store = useReportTemplateStoreV2()
  setApiMock({ get: jest.fn(() => Promise.reject(new Error('boom'))) })

  const result = await store._getReportTemplateLogo()

  expect(result).toBeNull()
  expect(mockShowCatchError).toHaveBeenCalled()
  expect(mockShowAlert).toHaveBeenCalledWith(
    'Error catch',
    'error',
    undefined,
    TIMEOUT_ALERT
  )
})

it('getShowReportTemplateLogo success', async () => {
  const store = useReportTemplateStoreV2()
  const mockResponse = {
    data: { success: true, message: 'ok', data: { id: 2 } },
  }
  setApiMock({ get: jest.fn(() => Promise.resolve(mockResponse)) })

  await store._getShowReportTemplateLogo(2)

  expect(store.report_template_response).toStrictEqual({ id: 2 })
  expect(mockShowAlert).toHaveBeenCalledWith(
    'ok',
    'success',
    undefined,
    TIMEOUT_ALERT
  )
})

it('getShowReportTemplateLogo failure', async () => {
  const store = useReportTemplateStoreV2()
  const mockResponse = { data: { success: false, message: 'fail', data: {} } }
  setApiMock({ get: jest.fn(() => Promise.resolve(mockResponse)) })

  await store._getShowReportTemplateLogo(2)

  expect(store.report_template_response).toEqual({})
  expect(mockShowAlert).toHaveBeenCalledWith(
    'fail',
    'error',
    undefined,
    TIMEOUT_ALERT
  )
})

it('getShowReportTemplateLogo catch', async () => {
  const store = useReportTemplateStoreV2()
  setApiMock({ get: jest.fn(() => Promise.reject(new Error('boom'))) })

  await store._getShowReportTemplateLogo(2)

  expect(store.report_template_response).toEqual({})
  expect(mockShowCatchError).toHaveBeenCalled()
  expect(mockShowAlert).toHaveBeenCalledWith(
    'Error catch',
    'error',
    undefined,
    TIMEOUT_ALERT
  )
})

it('createReportTemplateLogo success', async () => {
  const store = useReportTemplateStoreV2()
  const mockResponse = {
    data: { success: true, message: 'ok', data: { id: 3 } },
  }
  setApiMock({ post: jest.fn(() => Promise.resolve(mockResponse)) })

  await store._createReportTemplateLogo({} as never)

  expect(store.report_template_logo_response).toStrictEqual({ id: 3 })
  expect(mockShowAlert).toHaveBeenCalledWith(
    'ok',
    'success',
    undefined,
    TIMEOUT_ALERT
  )
})

it('createReportTemplateLogo failure', async () => {
  const store = useReportTemplateStoreV2()
  const mockResponse = { data: { success: false, message: 'fail', data: {} } }
  setApiMock({ post: jest.fn(() => Promise.resolve(mockResponse)) })

  await store._createReportTemplateLogo({} as never)

  expect(store.report_template_logo_response).toEqual({})
  expect(mockShowAlert).toHaveBeenCalledWith(
    'fail',
    'error',
    undefined,
    TIMEOUT_ALERT
  )
})

it('createReportTemplateLogo catch', async () => {
  const store = useReportTemplateStoreV2()
  setApiMock({ post: jest.fn(() => Promise.reject(new Error('boom'))) })

  await store._createReportTemplateLogo({} as never)

  expect(store.report_template_logo_response).toEqual({})
  expect(mockShowCatchError).toHaveBeenCalled()
  expect(mockShowAlert).toHaveBeenCalledWith(
    'Error catch',
    'error',
    undefined,
    TIMEOUT_ALERT
  )
})

it('updateReportTemplateLogo success', async () => {
  const store = useReportTemplateStoreV2()
  const mockResponse = { data: { success: true, message: 'ok' } }
  setApiMock({ put: jest.fn(() => Promise.resolve(mockResponse)) })

  await store._updateReportTemplateLogo(1)

  expect(mockShowAlert).toHaveBeenCalledWith(
    'ok',
    'success',
    undefined,
    TIMEOUT_ALERT
  )
})

it('updateReportTemplateLogo failure', async () => {
  const store = useReportTemplateStoreV2()
  const mockResponse = { data: { success: false, message: 'fail' } }
  setApiMock({ put: jest.fn(() => Promise.resolve(mockResponse)) })

  await store._updateReportTemplateLogo(1)

  expect(mockShowAlert).toHaveBeenCalledWith(
    'fail',
    'error',
    undefined,
    TIMEOUT_ALERT
  )
})

it('updateReportTemplateLogo catch', async () => {
  const store = useReportTemplateStoreV2()
  setApiMock({ put: jest.fn(() => Promise.reject(new Error('boom'))) })

  await store._updateReportTemplateLogo(1)

  expect(mockShowCatchError).toHaveBeenCalled()
  expect(mockShowAlert).toHaveBeenCalledWith(
    'Error catch',
    'error',
    undefined,
    TIMEOUT_ALERT
  )
})

it('deleteReportTemplateLogo success', async () => {
  const store = useReportTemplateStoreV2()
  const mockResponse = { data: { success: true, message: 'ok' } }
  setApiMock({ delete: jest.fn(() => Promise.resolve(mockResponse)) })

  await store._deleteReportTemplateLogo(1)

  expect(mockShowAlert).toHaveBeenCalledWith(
    'ok',
    'success',
    undefined,
    TIMEOUT_ALERT
  )
})

it('deleteReportTemplateLogo failure', async () => {
  const store = useReportTemplateStoreV2()
  const mockResponse = { data: { success: false, message: 'fail' } }
  setApiMock({ delete: jest.fn(() => Promise.resolve(mockResponse)) })

  await store._deleteReportTemplateLogo(1)

  expect(mockShowAlert).toHaveBeenCalledWith(
    'fail',
    'error',
    undefined,
    TIMEOUT_ALERT
  )
})

it('deleteReportTemplateLogo catch', async () => {
  const store = useReportTemplateStoreV2()
  setApiMock({ delete: jest.fn(() => Promise.reject(new Error('boom'))) })

  await store._deleteReportTemplateLogo(1)

  expect(mockShowCatchError).toHaveBeenCalled()
  expect(mockShowAlert).toHaveBeenCalledWith(
    'Error catch',
    'error',
    undefined,
    TIMEOUT_ALERT
  )
})

it('getReportTemplateSignature success', async () => {
  const store = useReportTemplateStoreV2()
  const mockResponse = {
    data: {
      success: true,
      message: 'ok',
      data: { data: [{ id: 4 }], current_page: 5, last_page: 6 },
    },
  }
  setApiMock({ get: jest.fn(() => Promise.resolve(mockResponse)) })

  const result = await store._getReportTemplateSignature()

  expect(result).toStrictEqual({
    data: [{ id: 4 }],
    current_page: 5,
    last_page: 6,
  })
  expect(mockShowAlert).not.toHaveBeenCalled()
})

it('getReportTemplateSignature failure', async () => {
  const store = useReportTemplateStoreV2()
  const mockResponse = {
    data: { success: false, message: 'fail', data: { data: [] } },
  }
  setApiMock({ get: jest.fn(() => Promise.resolve(mockResponse)) })

  const result = await store._getReportTemplateSignature()

  expect(result).toBeNull()
  expect(mockShowAlert).toHaveBeenCalledWith(
    'fail',
    'error',
    undefined,
    TIMEOUT_ALERT
  )
})

it('getReportTemplateSignature catch', async () => {
  const store = useReportTemplateStoreV2()
  setApiMock({ get: jest.fn(() => Promise.reject(new Error('boom'))) })

  const result = await store._getReportTemplateSignature()

  expect(result).toBeNull()
  expect(mockShowCatchError).toHaveBeenCalled()
  expect(mockShowAlert).toHaveBeenCalledWith(
    'Error catch',
    'error',
    undefined,
    TIMEOUT_ALERT
  )
})

it('getShowReportTemplateSignature success', async () => {
  const store = useReportTemplateStoreV2()
  const mockResponse = {
    data: { success: true, message: 'ok', data: { id: 5 } },
  }
  setApiMock({ get: jest.fn(() => Promise.resolve(mockResponse)) })

  await store._getShowReportTemplateSignature(5)

  expect(store.report_template_response).toStrictEqual({ id: 5 })
  expect(mockShowAlert).toHaveBeenCalledWith(
    'ok',
    'success',
    undefined,
    TIMEOUT_ALERT
  )
})

it('getShowReportTemplateSignature failure', async () => {
  const store = useReportTemplateStoreV2()
  const mockResponse = { data: { success: false, message: 'fail', data: {} } }
  setApiMock({ get: jest.fn(() => Promise.resolve(mockResponse)) })

  await store._getShowReportTemplateSignature(5)

  expect(store.report_template_response).toEqual({})
  expect(mockShowAlert).toHaveBeenCalledWith(
    'fail',
    'error',
    undefined,
    TIMEOUT_ALERT
  )
})

it('getShowReportTemplateSignature catch', async () => {
  const store = useReportTemplateStoreV2()
  setApiMock({ get: jest.fn(() => Promise.reject(new Error('boom'))) })

  await store._getShowReportTemplateSignature(5)

  expect(store.report_template_response).toEqual({})
  expect(mockShowCatchError).toHaveBeenCalled()
  expect(mockShowAlert).toHaveBeenCalledWith(
    'Error catch',
    'error',
    undefined,
    TIMEOUT_ALERT
  )
})

it('createReportTemplateSignature success', async () => {
  const store = useReportTemplateStoreV2()
  const mockResponse = {
    data: { success: true, message: 'ok', data: { id: 6 } },
  }
  setApiMock({ post: jest.fn(() => Promise.resolve(mockResponse)) })

  await store._createReportTemplateSignature({} as never)

  expect(store.report_template_signature_response).toStrictEqual({ id: 6 })
  expect(mockShowAlert).toHaveBeenCalledWith(
    'ok',
    'success',
    undefined,
    TIMEOUT_ALERT
  )
})

it('createReportTemplateSignature failure', async () => {
  const store = useReportTemplateStoreV2()
  const mockResponse = { data: { success: false, message: 'fail', data: {} } }
  setApiMock({ post: jest.fn(() => Promise.resolve(mockResponse)) })

  await store._createReportTemplateSignature({} as never)

  expect(store.report_template_signature_response).toEqual({})
  expect(mockShowAlert).toHaveBeenCalledWith(
    'fail',
    'error',
    undefined,
    TIMEOUT_ALERT
  )
})

it('createReportTemplateSignature catch', async () => {
  const store = useReportTemplateStoreV2()
  setApiMock({ post: jest.fn(() => Promise.reject(new Error('boom'))) })

  await store._createReportTemplateSignature({} as never)

  expect(store.report_template_signature_response).toEqual({})
  expect(mockShowCatchError).toHaveBeenCalled()
  expect(mockShowAlert).toHaveBeenCalledWith(
    'Error catch',
    'error',
    undefined,
    TIMEOUT_ALERT
  )
})

it('updateReportTemplateSignature success', async () => {
  const store = useReportTemplateStoreV2()
  const mockResponse = { data: { success: true, message: 'ok' } }
  setApiMock({ put: jest.fn(() => Promise.resolve(mockResponse)) })

  await store._updateReportTemplateSignature(1)

  expect(mockShowAlert).toHaveBeenCalledWith(
    'ok',
    'success',
    undefined,
    TIMEOUT_ALERT
  )
})

it('updateReportTemplateSignature failure', async () => {
  const store = useReportTemplateStoreV2()
  const mockResponse = { data: { success: false, message: 'fail' } }
  setApiMock({ put: jest.fn(() => Promise.resolve(mockResponse)) })

  await store._updateReportTemplateSignature(1)

  expect(mockShowAlert).toHaveBeenCalledWith(
    'fail',
    'error',
    undefined,
    TIMEOUT_ALERT
  )
})

it('updateReportTemplateSignature catch', async () => {
  const store = useReportTemplateStoreV2()
  setApiMock({ put: jest.fn(() => Promise.reject(new Error('boom'))) })

  await store._updateReportTemplateSignature(1)

  expect(mockShowCatchError).toHaveBeenCalled()
  expect(mockShowAlert).toHaveBeenCalledWith(
    'Error catch',
    'error',
    undefined,
    TIMEOUT_ALERT
  )
})

it('deleteReportTemplateSignature success', async () => {
  const store = useReportTemplateStoreV2()
  const mockResponse = { data: { success: true, message: 'ok' } }
  setApiMock({ delete: jest.fn(() => Promise.resolve(mockResponse)) })

  await store._deleteReportTemplateSignature(1)

  expect(mockShowAlert).toHaveBeenCalledWith(
    'ok',
    'success',
    undefined,
    TIMEOUT_ALERT
  )
})

it('deleteReportTemplateSignature failure', async () => {
  const store = useReportTemplateStoreV2()
  const mockResponse = { data: { success: false, message: 'fail' } }
  setApiMock({ delete: jest.fn(() => Promise.resolve(mockResponse)) })

  await store._deleteReportTemplateSignature(1)

  expect(mockShowAlert).toHaveBeenCalledWith(
    'fail',
    'error',
    undefined,
    TIMEOUT_ALERT
  )
})

it('deleteReportTemplateSignature catch', async () => {
  const store = useReportTemplateStoreV2()
  setApiMock({ delete: jest.fn(() => Promise.reject(new Error('boom'))) })

  await store._deleteReportTemplateSignature(1)

  expect(mockShowCatchError).toHaveBeenCalled()
  expect(mockShowAlert).toHaveBeenCalledWith(
    'Error catch',
    'error',
    undefined,
    TIMEOUT_ALERT
  )
})

it('getReportTemplate success', async () => {
  const store = useReportTemplateStoreV2()
  const mockResponse = {
    data: {
      success: true,
      message: 'ok',
      data: { data: [{ id: 7 }], current_page: 8, last_page: 9 },
    },
  }
  setApiMock({ get: jest.fn(() => Promise.resolve(mockResponse)) })

  const result = await store._getReportTemplate({})

  expect(result).toStrictEqual({
    data: [{ id: 7 }],
    current_page: 8,
    last_page: 9,
  })
  expect(mockShowAlert).not.toHaveBeenCalled()
})

it('getReportTemplate failure', async () => {
  const store = useReportTemplateStoreV2()
  const mockResponse = {
    data: { success: false, message: 'fail', data: { data: [] } },
  }
  setApiMock({ get: jest.fn(() => Promise.resolve(mockResponse)) })

  const result = await store._getReportTemplate({})

  expect(result).toBeNull()
  expect(mockShowAlert).toHaveBeenCalledWith(
    'fail',
    'error',
    undefined,
    TIMEOUT_ALERT
  )
})

it('getReportTemplate catch', async () => {
  const store = useReportTemplateStoreV2()
  setApiMock({ get: jest.fn(() => Promise.reject(new Error('boom'))) })

  const result = await store._getReportTemplate({})

  expect(result).toBeNull()
  expect(mockShowCatchError).toHaveBeenCalled()
  expect(mockShowAlert).toHaveBeenCalledWith(
    'Error catch',
    'error',
    undefined,
    TIMEOUT_ALERT
  )
})

it('getShowReportTemplate success', async () => {
  const store = useReportTemplateStoreV2()
  const mockResponse = {
    data: { success: true, message: 'ok', data: { id: 8 } },
  }
  setApiMock({ get: jest.fn(() => Promise.resolve(mockResponse)) })

  await store._getShowReportTemplate(8)

  expect(store.report_template_response).toStrictEqual({ id: 8 })
  expect(mockShowAlert).toHaveBeenCalledWith(
    'ok',
    'success',
    undefined,
    TIMEOUT_ALERT
  )
})

it('getShowReportTemplate failure', async () => {
  const store = useReportTemplateStoreV2()
  const mockResponse = { data: { success: false, message: 'fail', data: {} } }
  setApiMock({ get: jest.fn(() => Promise.resolve(mockResponse)) })

  await store._getShowReportTemplate(8)

  expect(store.report_template_response).toEqual({})
  expect(mockShowAlert).toHaveBeenCalledWith(
    'fail',
    'error',
    undefined,
    TIMEOUT_ALERT
  )
})

it('getShowReportTemplate catch', async () => {
  const store = useReportTemplateStoreV2()
  setApiMock({ get: jest.fn(() => Promise.reject(new Error('boom'))) })

  await store._getShowReportTemplate(8)

  expect(store.report_template_response).toEqual({})
  expect(mockShowCatchError).toHaveBeenCalled()
  expect(mockShowAlert).toHaveBeenCalledWith(
    'Error catch',
    'error',
    undefined,
    TIMEOUT_ALERT
  )
})

it('createReportTemplate success', async () => {
  const store = useReportTemplateStoreV2()
  const mockResponse = { data: { success: true, message: 'ok' } }
  setApiMock({ post: jest.fn(() => Promise.resolve(mockResponse)) })

  const result = await store._createReportTemplate({} as never)

  expect(result).toBe(true)
  expect(mockShowAlert).toHaveBeenCalledWith(
    'ok',
    'success',
    undefined,
    TIMEOUT_ALERT
  )
})

it('createReportTemplate failure', async () => {
  const store = useReportTemplateStoreV2()
  const mockResponse = { data: { success: false, message: 'fail' } }
  setApiMock({ post: jest.fn(() => Promise.resolve(mockResponse)) })

  const result = await store._createReportTemplate({} as never)

  expect(result).toBe(false)
  expect(mockShowAlert).toHaveBeenCalledWith(
    'fail',
    'error',
    undefined,
    TIMEOUT_ALERT
  )
})

it('createReportTemplate catch', async () => {
  const store = useReportTemplateStoreV2()
  setApiMock({ post: jest.fn(() => Promise.reject(new Error('boom'))) })

  const result = await store._createReportTemplate({} as never)

  expect(result).toBe(false)
  expect(mockShowCatchError).toHaveBeenCalled()
  expect(mockShowAlert).toHaveBeenCalledWith(
    'Error catch',
    'error',
    undefined,
    TIMEOUT_ALERT
  )
})

it('updateReportTemplate success', async () => {
  const store = useReportTemplateStoreV2()
  const mockResponse = { data: { success: true, message: 'ok' } }
  setApiMock({ put: jest.fn(() => Promise.resolve(mockResponse)) })

  await store._updateReportTemplate(1)

  expect(mockShowAlert).toHaveBeenCalledWith(
    'ok',
    'success',
    undefined,
    TIMEOUT_ALERT
  )
})

it('updateReportTemplate failure', async () => {
  const store = useReportTemplateStoreV2()
  const mockResponse = { data: { success: false, message: 'fail' } }
  setApiMock({ put: jest.fn(() => Promise.resolve(mockResponse)) })

  await store._updateReportTemplate(1)

  expect(mockShowAlert).toHaveBeenCalledWith(
    'fail',
    'error',
    undefined,
    TIMEOUT_ALERT
  )
})

it('updateReportTemplate catch', async () => {
  const store = useReportTemplateStoreV2()
  setApiMock({ put: jest.fn(() => Promise.reject(new Error('boom'))) })

  await store._updateReportTemplate(1)

  expect(mockShowCatchError).toHaveBeenCalled()
  expect(mockShowAlert).toHaveBeenCalledWith(
    'Error catch',
    'error',
    undefined,
    TIMEOUT_ALERT
  )
})

it('updatePartialReportTemplate success', async () => {
  const store = useReportTemplateStoreV2()
  const mockResponse = { data: { success: true, message: 'ok' } }
  setApiMock({ patch: jest.fn(() => Promise.resolve(mockResponse)) })

  const result = await store._updatePartialReportTemplate(1, {} as never)

  expect(result).toBe(true)
  expect(mockShowAlert).toHaveBeenCalledWith(
    'ok',
    'success',
    undefined,
    TIMEOUT_ALERT
  )
})

it('updatePartialReportTemplate failure', async () => {
  const store = useReportTemplateStoreV2()
  const mockResponse = { data: { success: false, message: 'fail' } }
  setApiMock({ patch: jest.fn(() => Promise.resolve(mockResponse)) })

  const result = await store._updatePartialReportTemplate(1, {} as never)

  expect(result).toBe(false)
  expect(mockShowAlert).toHaveBeenCalledWith(
    'fail',
    'error',
    undefined,
    TIMEOUT_ALERT
  )
})

it('updatePartialReportTemplate catch', async () => {
  const store = useReportTemplateStoreV2()
  setApiMock({ patch: jest.fn(() => Promise.reject(new Error('boom'))) })

  const result = await store._updatePartialReportTemplate(1, {} as never)

  expect(result).toBe(false)
  expect(mockShowCatchError).toHaveBeenCalled()
  expect(mockShowAlert).toHaveBeenCalledWith(
    'Error catch',
    'error',
    undefined,
    TIMEOUT_ALERT
  )
})

it('deleteReportTemplateSigns success', async () => {
  const store = useReportTemplateStoreV2()
  const mockResponse = { data: { success: true, message: 'ok' } }
  setApiMock({ delete: jest.fn(() => Promise.resolve(mockResponse)) })

  await store._deleteReportTemplateSigns(1)

  expect(mockShowAlert).toHaveBeenCalledWith(
    'ok',
    'success',
    undefined,
    TIMEOUT_ALERT
  )
})

it('deleteReportTemplateSigns failure', async () => {
  const store = useReportTemplateStoreV2()
  const mockResponse = { data: { success: false, message: 'fail' } }
  setApiMock({ delete: jest.fn(() => Promise.resolve(mockResponse)) })

  await store._deleteReportTemplateSigns(1)

  expect(mockShowAlert).toHaveBeenCalledWith(
    'fail',
    'error',
    undefined,
    TIMEOUT_ALERT
  )
})

it('deleteReportTemplateSigns catch', async () => {
  const store = useReportTemplateStoreV2()
  setApiMock({ delete: jest.fn(() => Promise.reject(new Error('boom'))) })

  await store._deleteReportTemplateSigns(1)

  expect(mockShowCatchError).toHaveBeenCalled()
  expect(mockShowAlert).toHaveBeenCalledWith(
    'Error catch',
    'error',
    undefined,
    TIMEOUT_ALERT
  )
})

it('getShowReportTemplateSigns success', async () => {
  const store = useReportTemplateStoreV2()
  const mockResponse = {
    data: { success: true, message: 'ok', data: { id: 9 } },
  }
  setApiMock({ get: jest.fn(() => Promise.resolve(mockResponse)) })

  await store._getShowReportTemplateSigns(9)

  expect(store.report_template_response).toStrictEqual({ id: 9 })
  expect(mockShowAlert).toHaveBeenCalledWith(
    'ok',
    'success',
    undefined,
    TIMEOUT_ALERT
  )
})

it('getShowReportTemplateSigns failure', async () => {
  const store = useReportTemplateStoreV2()
  const mockResponse = { data: { success: false, message: 'fail', data: {} } }
  setApiMock({ get: jest.fn(() => Promise.resolve(mockResponse)) })

  await store._getShowReportTemplateSigns(9)

  expect(store.report_template_response).toEqual({})
  expect(mockShowAlert).toHaveBeenCalledWith(
    'fail',
    'error',
    undefined,
    TIMEOUT_ALERT
  )
})

it('getShowReportTemplateSigns catch', async () => {
  const store = useReportTemplateStoreV2()
  setApiMock({ get: jest.fn(() => Promise.reject(new Error('boom'))) })

  await store._getShowReportTemplateSigns(9)

  expect(store.report_template_response).toEqual({})
  expect(mockShowCatchError).toHaveBeenCalled()
  expect(mockShowAlert).toHaveBeenCalledWith(
    'Error catch',
    'error',
    undefined,
    TIMEOUT_ALERT
  )
})
