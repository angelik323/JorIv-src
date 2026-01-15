import { createPinia, setActivePinia } from 'pinia'
import { useUploadAccountingVouchersStoreV2 } from './upload-accounting-vouchers-v2'
import { executeApi } from '@/apis'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
  })),
}))

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useShowError: jest.fn(() => ({ showCatchError: jest.fn() })),
  useUtils: jest.fn(() => ({
    getNameBlob: jest.fn(() => 'template.xlsx'),
    downloadBlobXlxx: jest.fn(),
  })),
}))

describe('useUploadAccountingVouchersStoreV2', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('fetches Excel template', async () => {
    const store = useUploadAccountingVouchersStoreV2()
    const mockGet = jest.fn().mockResolvedValue({
      data: new ArrayBuffer(8),
      headers: {
        'content-type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getFormatExcel()
    expect(mockGet).toHaveBeenCalledWith(
      'accounting/api/accounting/v2/vouchers-upload/download-template',
      { responseType: 'blob' }
    )
  })

  it('handles error when fetching Excel template fails', async () => {
    const store = useUploadAccountingVouchersStoreV2()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getFormatExcel()
    expect(mockGet).toHaveBeenCalled()
  })

  it('sets documents_import with _setDataDocuments', () => {
    const store = useUploadAccountingVouchersStoreV2()
    const file = new File(['dummy'], 'dummy.xlsx', {
      type: 'application/vnd.ms-excel',
    })
    store._setDataDocuments(file)
    expect(store.documents_import).toBe(file)
  })

  it('fetches list of vouchers', async () => {
    const store = useUploadAccountingVouchersStoreV2()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        data: {
          data: [
            { id: 1, name: 'Voucher 1' },
            { id: 2, name: 'Voucher 2' },
          ],
        },
        message: 'Success',
        success: true,
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getListAction('')
    expect(mockGet).toHaveBeenCalledWith(
      'accounting/api/accounting/v2/vouchers-upload?paginate=1'
    )
  })

  it('handles error when fetching list of vouchers fails', async () => {
    const store = useUploadAccountingVouchersStoreV2()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getListAction('')
  })

  it('processes upload vouchers successfully', async () => {
    const store = useUploadAccountingVouchersStoreV2()
    const payload = {
      vouchers: [],
      failed_count: 0,
      total_count: 0,
    }
    const mockPost = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Processed',
        data: { processed: true },
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._processUploadVouchers(payload)
    expect(mockPost).toHaveBeenCalledWith(
      'accounting/api/accounting/v2/vouchers-upload',
      payload
    )
    expect(result).toBe(true)
    expect(store.data_process).toEqual({ processed: true })
  })

  it('handles error when processing upload vouchers fails', async () => {
    const store = useUploadAccountingVouchersStoreV2()
    const payload = {
      vouchers: [],
      failed_count: 0,
      total_count: 0,
    }
    const mockPost = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._processUploadVouchers(payload)
    expect(result).toBe(false)
  })
})
