import { createPinia, setActivePinia } from 'pinia'
import { useUploadAccountingVouchersStoreV1 } from './upload-accounting-vouchers-v1'
import { executeApi } from '@/apis'
import { IViewUploadAccountingVouchers } from '@/interfaces/customs/accounting/UploadAccountingVouchers'

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

describe('useUploadAccountingVouchersStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('fetches Excel template', async () => {
    const store = useUploadAccountingVouchersStoreV1()
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
      'accounting/api/accounting/vouchers-upload/download-template',
      { responseType: 'blob' }
    )
  })

  it('handles error when fetching Excel template fails', async () => {
    const store = useUploadAccountingVouchersStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getFormatExcel()
    expect(mockGet).toHaveBeenCalled()
  })

  it('sets documents_import with _setDataDocuments', () => {
    const store = useUploadAccountingVouchersStoreV1()
    const file = new File(['dummy'], 'dummy.xlsx', {
      type: 'application/vnd.ms-excel',
    })
    store._setDataDocuments(file)
    expect(store.documents_import).toBe(file)
  })

  it('fetches list of vouchers', async () => {
    const store = useUploadAccountingVouchersStoreV1()
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
      'accounting/api/accounting/vouchers-upload?paginate=1'
    )
    expect(store.uploadAccountingVouchersList).toHaveLength(2)
  })

  it('handles error when fetching list of vouchers fails', async () => {
    const store = useUploadAccountingVouchersStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getListAction('')
    expect(store.uploadAccountingVouchersList).toHaveLength(0)
  })

  it('imports vouchers successfully', async () => {
    const store = useUploadAccountingVouchersStoreV1()
    store.documents_import = new File(['dummy'], 'dummy.xlsx', {
      type: 'application/vnd.ms-excel',
    })
    const mockPost = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Import successful',
        data: {
          total_count: 5,
          failed_count: 1,
        },
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._importUploadVouchers()
    expect(mockPost).toHaveBeenCalledWith(
      'accounting/api/accounting/vouchers-upload/validate',
      { file: store.documents_import },
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    expect(result).toBe(true)
    expect(store.total_records).toBe(5)
    expect(store.failed_count).toBe(1)
  })

  it('handles error when importing vouchers fails', async () => {
    const store = useUploadAccountingVouchersStoreV1()
    store.documents_import = new File(['dummy'], 'dummy.xlsx', {
      type: 'application/vnd.ms-excel',
    })
    const mockPost = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._importUploadVouchers()
    expect(result).toBe(false)
  })

  it('processes upload vouchers successfully', async () => {
    const store = useUploadAccountingVouchersStoreV1()
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
      'accounting/api/accounting/vouchers-upload',
      payload
    )
    expect(result).toBe(true)
    expect(store.data_process).toEqual({ processed: true })
  })

  it('handles error when processing upload vouchers fails', async () => {
    const store = useUploadAccountingVouchersStoreV1()
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

  it('shows upload accounting voucher view', async () => {
    const store = useUploadAccountingVouchersStoreV1()
    const mockVoucher: IViewUploadAccountingVouchers = {
      id: 1,
      registration_date: '2024-06-01',
      registration_day: 1,
      business_trust: {
        id: 1,
        business_code: 'BT001',
        name: 'Trust Name',
        account: {
          id: 1,
          current_period: '2024',
          account_structure: {
            id: 1,
            code: '001',
            purpose: 'PUC-2024',
          },
        },
      },
      status: { id: 1, status: 'Activo' },
      receipt_type: { id: 1, code: 1, name: 'Ingreso' },
      sub_receipt_type: { id: 1, code: 1, name: 'Subtipo' },
      code: 123,
      total_amount_debits: '1000',
      total_amount_credits: '1000',
      difference_amount: '0',
      voucher_data: [],
    }
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        data: mockVoucher,
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._showUploadAccountingVoucher(1)
    expect(mockGet).toHaveBeenCalledWith(
      'accounting/api/accounting/voucher/1/show'
    )
    expect(store.uploadAccountingVoucherView.id).toBe(1)
    expect(store.uploadAccountingVoucherView.status.status).toBe('Activo')
    expect(store.uploadAccountingVoucherView.code).toBe(123)
    expect(store.uploadAccountingVoucherView.receipt_type.name).toBe('Ingreso')
    expect(store.uploadAccountingVoucherView.sub_receipt_type.name).toBe(
      'Subtipo'
    )
    expect(store.uploadAccountingVoucherView.total_amount_debits).toBe('1000')
    expect(store.uploadAccountingVoucherView.total_amount_credits).toBe('1000')
    expect(store.uploadAccountingVoucherView.difference_amount).toBe('0')
    expect(store.uploadAccountingVoucherView.voucher_data).toEqual([])
  })

  it('handles error when showing upload accounting voucher view fails', async () => {
    const store = useUploadAccountingVouchersStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._showUploadAccountingVoucher(1)
    expect(mockGet).toHaveBeenCalledWith(
      'accounting/api/accounting/voucher/1/show'
    )
    expect(store.uploadAccountingVoucherView).toEqual({})
  })
})
