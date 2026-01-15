import { setActivePinia, createPinia } from 'pinia'
import { useCheckTreasuryReceiptStoreV1 } from './check-treasury-receipt-v1'
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
  useShowError: jest.fn(() => ({ showCatchError: jest.fn(() => 'Error') })),
  useUtils: jest.fn(() => ({
    getNameBlob: jest.fn(() => 'archivo.xlsx'),
    downloadBlobXlxx: jest.fn(),
  })),
}))

describe('useCheckTreasuryReceipt', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('fetches check treasury receipts list', async () => {
    const store = useCheckTreasuryReceiptStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: [{ id: 1, name: 'test' }],
        message: 'ok',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getCheckTreasuryReceipts('param=1')
    expect(mockGet).toHaveBeenCalledWith(
      'treasuries/api/treasuries/treasury-movements?param=1'
    )
    expect(store.checkTreasuryReceiptList).toEqual([{ id: 1, name: 'test' }])
  })

  it('handles error in _getCheckTreasuryReceipts', async () => {
    const store = useCheckTreasuryReceiptStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getCheckTreasuryReceipts('param=1')
    expect(store.checkTreasuryReceiptList).toEqual([])
  })

  it('downloads check treasury receipts', async () => {
    const store = useCheckTreasuryReceiptStoreV1()
    const blobData = new Uint8Array([1, 2, 3])
    const mockGet = jest.fn().mockResolvedValue({
      data: blobData,
      headers: { 'content-type': 'application/vnd.ms-excel' },
      config: {},
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._downloadCheckTreasuryReceipts('?param=1')
    expect(mockGet).toHaveBeenCalledWith(
      'treasuries/api/treasuries/treasury-movements/export?param=1',
      { responseType: 'blob' }
    )
  })

  it('handles error in _downloadCheckTreasuryReceipts', async () => {
    const store = useCheckTreasuryReceiptStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._downloadCheckTreasuryReceipts('?param=1')
  })

  it('fetches check treasury receipt by id', async () => {
    const store = useCheckTreasuryReceiptStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: { id: 5, name: 'receipt' },
        message: 'ok',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdCheckTreasuryReceipts(5)
    expect(mockGet).toHaveBeenCalledWith(
      'treasuries/api/treasuries/treasury-movements/5'
    )
    expect(store.data_information_form).toEqual({ id: 5, name: 'receipt' })
  })

  it('handles error in _getByIdCheckTreasuryReceipts', async () => {
    const store = useCheckTreasuryReceiptStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdCheckTreasuryReceipts(5)
    expect(store.data_information_form).toBeNull()
  })

  it('fetches accounting voucher list', async () => {
    const store = useCheckTreasuryReceiptStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: [{ id: 1, voucher: 'A' }],
        message: 'ok',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getAccountingVoucherList(10)
    expect(mockGet).toHaveBeenCalledWith(
      'treasuries/api/treasuries/treasury-movements/10/accounting-vouchers'
    )
    expect(store.accountingCoucherList).toEqual([{ id: 1, voucher: 'A' }])
  })

  it('handles error in _getAccountingVoucherList', async () => {
    const store = useCheckTreasuryReceiptStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getAccountingVoucherList(10)
    expect(store.accountingCoucherList).toEqual([])
  })
})
