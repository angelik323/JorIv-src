import { setActivePinia, createPinia } from 'pinia'
import { executeApi } from '@/apis'
import { useExchangeDifferenceRestatementStoreV2 } from './exchange-difference-restatement-v2'
import {
  IExchangeDifferenceRestatementUndoProcess,
  IExchangeDifferenceRestatementVoucherProcess,
} from '@/interfaces/customs/accounting/AccountingRestatement'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
  })),
}))

jest.mock('@/composables/useAlert', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
}))

jest.mock('@/composables/useShowError', () => ({
  useShowError: jest.fn(() => ({ showCatchError: jest.fn() })),
}))

jest.mock('@/composables/useUtils', () => ({
  useUtils: jest.fn(() => ({
    defaultIconsLucide: {
      plusCircleOutline: 'plus-circle-outline',
      rotateCcw: 'rotate-ccw',
    },
    getNameBlob: jest.fn(() => 'test-file.xlsx'),
    downloadBlobXlxx: jest.fn(),
  })),
}))

describe('useExchangeDifferenceRestatementStoreV2', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    setActivePinia(createPinia())
  })

  it('should initialize with default state', () => {
    const store = useExchangeDifferenceRestatementStoreV2()
    expect(store.reexpresion_difference_list).toEqual([])
    expect(store.reexpresion_difference_process_list).toEqual([])
    expect(store.reexpresion_difference_calculation_list).toEqual([])
    expect(store.reexpresion_difference_undo_process_list).toEqual([])
    expect(store.reexpresion_difference_voucher_list).toEqual([])
    expect(store.reexpresion_difference_details_list).toEqual([])
    expect(store.pages).toEqual({ currentPage: 0, lastPage: 0 })
    expect(store.pages_calculations).toEqual({ currentPage: 0, lastPage: 0 })
    expect(store.pages_undo_process).toEqual({ currentPage: 0, lastPage: 0 })
    expect(store.reexpresion_identifier_voucher_id).toBe('')
    expect(store.reexpresion_difference_response).toEqual({})
  })

  it('should call _getExchangeDifferenceRestatementList and update state', async () => {
    const store = useExchangeDifferenceRestatementStoreV2()
    const mockResponse = {
      data: {
        success: true,
        message: 'ok',
        data: {
          data: [{ id: 1, business_trust: 'Trust 1' }],
          current_page: 1,
          last_page: 5,
        },
      },
    }
    ;(executeApi as jest.Mock).mockReturnValue({
      get: jest.fn(() => Promise.resolve(mockResponse)),
      post: jest.fn(),
    })

    await store._getExchangeDifferenceRestatementList({ page: 1 })

    expect(store.reexpresion_difference_list).toEqual([
      { id: 1, business_trust: 'Trust 1' },
    ])
    expect(store.pages.currentPage).toBe(1)
    expect(store.pages.lastPage).toBe(5)
  })

  it('should call _getExchangeDifferenceRestatementListUndo and update state', async () => {
    const store = useExchangeDifferenceRestatementStoreV2()
    const mockResponse = {
      data: {
        success: true,
        message: 'ok',
        data: {
          data: [{ id: 1, status: 'pending' }],
          current_page: 2,
          last_page: 10,
        },
      },
    }
    ;(executeApi as jest.Mock).mockReturnValue({
      get: jest.fn(() => Promise.resolve(mockResponse)),
      post: jest.fn(),
    })

    await store._getExchangeDifferenceRestatementListUndo({ page: 2 })

    expect(store.reexpresion_difference_undo_process_list).toEqual([
      { id: 1, status: 'pending' },
    ])
    expect(store.pages_undo_process.currentPage).toBe(2)
    expect(store.pages_undo_process.lastPage).toBe(10)
  })

  it('should call _getExchangeDifferenceRestatementProcessList and update state', async () => {
    const store = useExchangeDifferenceRestatementStoreV2()
    const mockResponse = {
      data: {
        success: true,
        message: 'ok',
        data: {
          process: [{ id: 1, process_name: 'Process 1' }],
          calculations: {
            data: [{ id: 1, amount: 1000 }],
            current_page: 1,
            last_page: 5,
          },
        },
      },
    }
    ;(executeApi as jest.Mock).mockReturnValue({
      get: jest.fn(() => Promise.resolve(mockResponse)),
    })

    await store._getExchangeDifferenceRestatementProcessList(1, { page: '1' })

    expect(store.reexpresion_difference_response).toEqual(
      mockResponse.data.data
    )
    expect(store.reexpresion_difference_process_list).toEqual([
      { id: 1, process_name: 'Process 1' },
    ])
    expect(store.reexpresion_difference_calculation_list).toEqual([
      { id: 1, amount: 1000 },
    ])
    expect(store.pages_calculations.currentPage).toBe(1)
    expect(store.pages_calculations.lastPage).toBe(5)
  })

  it('should call _getExchangeDifferenceRestatementListVouchers and update state', async () => {
    const store = useExchangeDifferenceRestatementStoreV2()
    const mockResponse = {
      data: {
        success: true,
        message: 'ok',
        data: {
          data: [{ id: 1, voucher_number: 'V001' }],
        },
      },
    }
    ;(executeApi as jest.Mock).mockReturnValue({
      get: jest.fn(() => Promise.resolve(mockResponse)),
    })

    await store._getExchangeDifferenceRestatementListVouchers(1)

    expect(store.reexpresion_difference_voucher_list).toEqual([
      { id: 1, voucher_number: 'V001' },
    ])
  })

  it('should call _getExchangeDifferencerRestatementNews and update state', async () => {
    const store = useExchangeDifferenceRestatementStoreV2()
    const mockResponse = {
      data: {
        success: true,
        message: 'ok',
        data: {
          related_records: [{ id: 1, novedad: 'News 1' }],
          other_info: 'test',
        },
      },
    }
    ;(executeApi as jest.Mock).mockReturnValue({
      get: jest.fn(() => Promise.resolve(mockResponse)),
    })

    await store._getExchangeDifferencerRestatementNews(1)

    expect(store.reexpresion_difference_details_list).toEqual([
      { id: 1, novedad: 'News 1' },
    ])
    expect(store.reexpresion_difference_response).toEqual(
      mockResponse.data.data
    )
  })

  it('should call _exportCalculationsExchangeDifferenceRestatement successfully', async () => {
    const store = useExchangeDifferenceRestatementStoreV2()
    const mockBlob = new Blob(['test'], { type: 'application/vnd.ms-excel' })
    const mockResponse = {
      data: mockBlob,
      status: 200,
      headers: { 'content-type': 'application/vnd.ms-excel' },
    }
    ;(executeApi as jest.Mock).mockReturnValue({
      get: jest.fn(() => Promise.resolve(mockResponse)),
    })

    await store._exportCalculationsExchangeDifferenceRestatement(1, {
      period: '2025-01',
    })

    const executeApiMock = executeApi as jest.Mock
    expect(executeApiMock().get).toHaveBeenCalled()
  })

  it('should call _exportVouchersExchangeDifferenceRestatement successfully', async () => {
    const store = useExchangeDifferenceRestatementStoreV2()
    const mockBlob = new Blob(['test'], { type: 'application/vnd.ms-excel' })
    const mockResponse = {
      data: mockBlob,
      status: 200,
      headers: { 'content-type': 'application/vnd.ms-excel' },
    }
    ;(executeApi as jest.Mock).mockReturnValue({
      get: jest.fn(() => Promise.resolve(mockResponse)),
    })

    await store._exportVouchersExchangeDifferenceRestatement(1, {
      period: '2025-01',
    })

    const executeApiMock = executeApi as jest.Mock
    expect(executeApiMock().get).toHaveBeenCalled()
  })

  it('should call _generateProcessExchangeDifferenceRestatement and update state', async () => {
    const store = useExchangeDifferenceRestatementStoreV2()
    const mockResponse = {
      data: {
        success: true,
        message: 'Process generated',
        data: { id: 123 },
      },
    }
    ;(executeApi as jest.Mock).mockReturnValue({
      post: jest.fn(() => Promise.resolve(mockResponse)),
    })

    const result = await store._generateProcessExchangeDifferenceRestatement({
      period: '2025-01',
    })

    expect(store.reexpresion_identifier_voucher_id).toBe(123)
    expect(result).toBe(true)
  })

  it('should call _generateUndoProcessExchangeDifferenceRestatement and return data', async () => {
    const store = useExchangeDifferenceRestatementStoreV2()
    const mockResponse = {
      data: {
        success: true,
        message: 'Undo process generated',
        data: { id: 1 },
      },
    }
    ;(executeApi as jest.Mock).mockReturnValue({
      post: jest.fn(() => Promise.resolve(mockResponse)),
    })

    const payload: IExchangeDifferenceRestatementUndoProcess = {
      ids: [1],
      filter: {
        period: '2025-01',
        structure_id: 1,
        from_business: '100',
        to_business: '200',
        undo_date: '2025-01-15',
        closing_type: 'monthly',
      },
    }

    const result =
      await store._generateUndoProcessExchangeDifferenceRestatement(payload)

    expect(result).toBe(1)
  })

  it('should call _generateVouchersExchangeDifferenceRestatement and return data', async () => {
    const store = useExchangeDifferenceRestatementStoreV2()
    const mockResponse = {
      data: {
        success: true,
        message: 'Vouchers generated',
      },
    }
    ;(executeApi as jest.Mock).mockReturnValue({
      post: jest.fn(() => Promise.resolve(mockResponse)),
    })

    const payload: IExchangeDifferenceRestatementVoucherProcess = {
      restatement_ids: [1, 2, 3],
      sub_receipt_type_id: 5,
    }

    const result = await store._generateVouchersExchangeDifferenceRestatement(
      payload
    )

    expect(result).toBe(true)
  })

  it('should handle error in _getExchangeDifferenceRestatementList gracefully', async () => {
    const store = useExchangeDifferenceRestatementStoreV2()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getExchangeDifferenceRestatementList({ page: 1 })

    expect(store.reexpresion_difference_list).toEqual([])
  })

  it('should handle error in _generateProcessExchangeDifferenceRestatement gracefully', async () => {
    const store = useExchangeDifferenceRestatementStoreV2()
    const mockPost = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._generateProcessExchangeDifferenceRestatement({
      period: '2025-01',
    })

    expect(store.reexpresion_identifier_voucher_id).toBe('')
    expect(result).toBe(false)
  })

  it('should handle error in _generateUndoProcessExchangeDifferenceRestatement gracefully', async () => {
    const store = useExchangeDifferenceRestatementStoreV2()
    const mockPost = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload: IExchangeDifferenceRestatementUndoProcess = {
      ids: [1],
      filter: {
        period: '2025-01',
        structure_id: 1,
        from_business: '100',
        to_business: '200',
        undo_date: '2025-01-15',
        closing_type: 'monthly',
      },
    }

    const result =
      await store._generateUndoProcessExchangeDifferenceRestatement(payload)

    expect(result).toBeNull()
  })

  it('should handle error in _generateVouchersExchangeDifferenceRestatement gracefully', async () => {
    const store = useExchangeDifferenceRestatementStoreV2()
    const mockPost = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload: IExchangeDifferenceRestatementVoucherProcess = {
      restatement_ids: [1],
      sub_receipt_type_id: 1,
    }

    const result = await store._generateVouchersExchangeDifferenceRestatement(
      payload
    )

    expect(result).toBe(false)
  })
})
