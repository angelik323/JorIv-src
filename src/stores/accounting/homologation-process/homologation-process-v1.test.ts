import { setActivePinia, createPinia } from 'pinia'
import { useHomologationProcessStoreV1 } from './homologation-process-v1'
import { executeApi } from '@/apis'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'

const URL_PATH = `${URL_PATH_ACCOUNTING}/vouchers-mapping`

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
  })),
}))

jest.mock('@/composables', () => {
  const showAlertMock = jest.fn()
  const showCatchErrorMock = jest.fn()

  const useAlert = jest.fn(() => ({ showAlert: showAlertMock }))
  const useShowError = jest.fn(() => ({ showCatchError: showCatchErrorMock }))

  return { useAlert, useShowError, showAlertMock, showCatchErrorMock }
})

describe('useHomologationProcessStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('should fetch homologation process list and update state on success', async () => {
    const store = useHomologationProcessStoreV1()
    const mockResponse = {
      data: {
        success: true,
        data: {
          data: [],
          current_page: 1,
          last_page: 1,
        },
        message: 'Listado obtenido exitosamente.',
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params = '&filter[search]=test'

    await store._getHomologationProcessList(params)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}?paginate=1${params}`)
    expect(store.homologation_process_list).toEqual(mockResponse.data.data.data)
    expect(store.homologation_process_pages.currentPage).toBe(1)
    expect(store.homologation_process_pages.lastPage).toBe(1)
  })

  it('should handle error when fetching homologation process list', async () => {
    const store = useHomologationProcessStoreV1()
    const mockError = new Error('Network Error')
    const mockGet = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params = '&filter[search]=test'

    await store._getHomologationProcessList(params)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}?paginate=1${params}`)
    expect(store.homologation_process_list).toEqual([])
  })

  it('should perform bulk homologation successfully', async () => {
    const store = useHomologationProcessStoreV1()
    const mockResponse = {
      data: {
        success: true,
        data: [],
        message: 'Homologación exitosa.',
      },
    }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload = {
      process_type: 1,
      source_structure_id: 1,
      period: '2025-09',
      type: 'Diario',
      destination_structure_id: 1,
      business_trust_start_id: 2,
      business_trust_end_id: 3,
      homologation_date: '2025-09-09',
    }

    const result = await store._bulkHomologation(payload)

    expect(mockPost).toHaveBeenCalledWith(`${URL_PATH}/bulk`, payload)
    expect(result).toBe(true)
    expect(store.processed_homologations).toEqual(mockResponse.data.data)
  })

  it('should handle error during bulk homologation', async () => {
    const store = useHomologationProcessStoreV1()
    const mockError = new Error('Network Error')
    const mockPost = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload = {
      process_type: 1,
      source_structure_id: 1,
      period: '2025-09',
      type: 'Diario',
      destination_structure_id: 1,
      business_trust_start_id: 2,
      business_trust_end_id: 3,
      homologation_date: '2025-09-09',
    }

    const result = await store._bulkHomologation(payload)

    expect(mockPost).toHaveBeenCalledWith(`${URL_PATH}/bulk`, payload)
    expect(result).toBe(false)
  })

  it('should download results successfully', async () => {
    const store = useHomologationProcessStoreV1()
    const mockResponse = {
      data: new ArrayBuffer(8),
    }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload = {
      process_type: 1,
      results: [
        {
          id: 1,
          business: 'Negocio',
          period: '2025-09',
          receipt: 'tipo 1',
          sub_receipt: 'subtipo 1',
          consecutive: 128367,
          source_structure: 'estructura origen',
          destination_structure: 'estructura destino',
          status: 'status',
          message: 'message',
          date: '2025-09-09',
          original_voucher_id: 1,
          new_voucher_id: 100,
        },
      ],
    }

    const result = await store._downloadResults(payload)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH}/export/result`,
      payload,
      {
        responseType: 'arraybuffer',
      }
    )
    expect(result).toEqual(mockResponse.data)
  })

  it('should handle error during results download', async () => {
    const store = useHomologationProcessStoreV1()
    const mockError = new Error('Network Error')
    const mockPost = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload = {
      process_type: 1,
      results: [
        {
          id: 1,
          business: 'Negocio',
          period: '2025-09',
          receipt: 'tipo 1',
          sub_receipt: 'subtipo 1',
          consecutive: 128367,
          source_structure: 'estructura origen',
          destination_structure: 'estructura destino',
          status: 'status',
          message: 'message',
          date: '2025-09-09',
          original_voucher_id: 1,
          new_voucher_id: 100,
        },
      ],
    }

    const result = await store._downloadResults(payload)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH}/export/result`,
      payload,
      {
        responseType: 'arraybuffer',
      }
    )
    expect(result).toBeNull()
  })

  it('should fetch filterable vouchers successfully', async () => {
    const store = useHomologationProcessStoreV1()
    const mockResponse = {
      data: {
        success: true,
        data: [],
        message: 'Vouchers obtenidos exitosamente.',
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params = 'filter[search]=test'

    await store._searchFilterableVouchers(params)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/filterable?${params}`)
    expect(store.filterable_vouchers_list).toEqual(mockResponse.data.data)
  })

  it('should handle error when fetching filterable vouchers', async () => {
    const store = useHomologationProcessStoreV1()
    const mockError = new Error('Network Error')
    const mockGet = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params = 'filter[search]=test'

    await store._searchFilterableVouchers(params)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/filterable?${params}`)
    expect(store.filterable_vouchers_list).toEqual([])
  })

  it('should perform selective homologation successfully', async () => {
    const store = useHomologationProcessStoreV1()
    const mockResponse = {
      data: {
        success: true,
        data: [],
        message: 'Homologación selectiva exitosa.',
      },
    }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload = {
      process_type: 3,
      source_structure_id: 1,
      period: '2025-09',
      destination_structure_id: 2,
      business_trust_start_id: 2,
      voucher_ids: [1, 2, 3],
    }

    const result = await store._selectiveHomologation(payload)

    expect(mockPost).toHaveBeenCalledWith(`${URL_PATH}/selective`, payload)
    expect(result).toBe(true)
    expect(store.processed_homologations).toEqual(mockResponse.data.data)
  })

  it('should handle error during selective homologation', async () => {
    const store = useHomologationProcessStoreV1()
    const mockError = new Error('Network Error')
    const mockPost = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload = {
      process_type: 3,
      source_structure_id: 1,
      period: '2025-09',
      destination_structure_id: 2,
      business_trust_start_id: 2,
      voucher_ids: [1, 2, 3],
    }

    const result = await store._selectiveHomologation(payload)

    expect(mockPost).toHaveBeenCalledWith(`${URL_PATH}/selective`, payload)
    expect(result).toBe(false)
  })

  it('should fetch a homologation process successfully', async () => {
    const store = useHomologationProcessStoreV1()
    const mockResponse = {
      data: {
        success: true,
        data: { id: 1, name: 'Proceso de homologación' },
        message: 'Proceso obtenido exitosamente.',
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const processId = 1

    const result = await store._getHomologationProcess(processId)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/${processId}`)
    expect(result).toEqual(mockResponse.data.data)
    expect(store.selected_homologation_process).toEqual(mockResponse.data.data)
  })

  it('should handle error when fetching a homologation process', async () => {
    const store = useHomologationProcessStoreV1()
    const mockError = new Error('Network Error')
    const mockGet = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const processId = 1

    const result = await store._getHomologationProcess(processId)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/${processId}`)
    expect(result).toBe(false)
    expect(store.selected_homologation_process).toEqual({})
  })

  it('should fetch homologation process logs successfully', async () => {
    const store = useHomologationProcessStoreV1()
    const mockResponse = {
      data: {
        success: true,
        data: {
          data: [],
          current_page: 1,
          last_page: 1,
        },
        message: 'Logs obtenidos exitosamente.',
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const processId = 1
    const params = { filter: 'test' }

    const result = await store._getHomologationProcessLogs(processId, params)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/${processId}/logs`, {
      params: { ...params, paginate: 1 },
    })
    expect(result).toEqual(mockResponse.data.data)
    expect(store.homologation_process_vouchers.list).toEqual(
      mockResponse.data.data.data
    )
    expect(store.homologation_process_vouchers.pages.currentPage).toBe(1)
    expect(store.homologation_process_vouchers.pages.lastPage).toBe(1)
  })

  it('should handle error when fetching homologation process logs', async () => {
    const store = useHomologationProcessStoreV1()
    const mockError = new Error('Network Error')
    const mockGet = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const processId = 1
    const params = { filter: 'test' }

    const result = await store._getHomologationProcessLogs(processId, params)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/${processId}/logs`, {
      params: { ...params, paginate: 1 },
    })
    expect(result).toBe(false)
    expect(store.homologation_process_vouchers.list).toEqual([])
    expect(store.homologation_process_vouchers.pages.currentPage).toBe(0)
    expect(store.homologation_process_vouchers.pages.lastPage).toBe(0)
  })

  it('should fetch voucher logs successfully', async () => {
    const store = useHomologationProcessStoreV1()
    const mockResponse = {
      data: {
        success: true,
        data: { id: 1, logs: [] },
        message: 'Logs obtenidos exitosamente.',
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const processId = 1
    const voucherId = 100

    const result = await store._getVoucherLogs(processId, voucherId)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH}/${processId}/${voucherId}/history`
    )
    expect(result).toEqual(mockResponse.data.data)
    expect(store.homologation_process_history).toEqual(mockResponse.data.data)
  })

  it('should handle error when fetching voucher logs', async () => {
    const store = useHomologationProcessStoreV1()
    const mockError = new Error('Network Error')
    const mockGet = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const processId = 1
    const voucherId = 100

    const result = await store._getVoucherLogs(processId, voucherId)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH}/${processId}/${voucherId}/history`
    )
    expect(result).toBe(false)
    expect(store.homologation_process_history).toEqual({})
  })

  it('should download detailed results successfully', async () => {
    const store = useHomologationProcessStoreV1()
    const mockResponse = {
      data: new ArrayBuffer(8),
    }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload = {
      results: [
        {
          id: 1,
          business: 'Negocio',
          period: '2025-09',
          receipt: 'tipo 1',
          sub_receipt: 'subtipo 1',
          consecutive: 128367,
          source_structure: 'estructura origen',
          destination_structure: 'estructura destino',
          status: 'status',
          message: 'message',
          date: '2025-09-09',
          original_voucher_id: 1,
          new_voucher_id: 100,
          original_voucher: {},
          new_voucher: {},
        },
      ],
    }

    const result = await store._downloadDetailedResults(payload)

    expect(mockPost).toHaveBeenCalledWith(`${URL_PATH}/export/logs`, payload, {
      responseType: 'arraybuffer',
    })
    expect(result).toEqual(mockResponse.data)
  })

  it('should handle error during detailed results download', async () => {
    const store = useHomologationProcessStoreV1()
    const mockError = new Error('Network Error')
    const mockPost = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload = {
      results: [
        {
          id: 1,
          business: 'Negocio',
          period: '2025-09',
          receipt: 'tipo 1',
          sub_receipt: 'subtipo 1',
          consecutive: 128367,
          source_structure: 'estructura origen',
          destination_structure: 'estructura destino',
          status: 'status',
          message: 'message',
          date: '2025-09-09',
          original_voucher_id: 1,
          new_voucher_id: 100,
          original_voucher: {},
          new_voucher: {},
        },
      ],
    }

    const result = await store._downloadDetailedResults(payload)

    expect(mockPost).toHaveBeenCalledWith(`${URL_PATH}/export/logs`, payload, {
      responseType: 'arraybuffer',
    })
    expect(result).toBeNull()
  })
})
