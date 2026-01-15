import { setActivePinia, createPinia } from 'pinia'
import { executeApi } from '@/apis'
import { useAmortizationTitleTableCollectionStoreV1 } from './amortization-title-table-v1'

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
  useShowError: jest.fn(() => ({ showCatchError: jest.fn() })),
  useUtils: jest.fn(() => ({
    getNameBlob: jest.fn(() => 'file.xlsx'),
    downloadBlobXlxx: jest.fn(),
  })),
}))

describe('useAmortizationTitleTableCollectionStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('should initialize with default state', () => {
    const store = useAmortizationTitleTableCollectionStoreV1()
    expect(store.amortization_title_table_list).toEqual([])
    expect(store.amortization_title_table_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
    expect(store.data_information_form).toBeNull()
    expect(store.document_import).toBeNull()
    expect(store.document_data_table).toBeNull()
  })

  it('should call _getAmortizationTableList and update state', async () => {
    const store = useAmortizationTitleTableCollectionStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'ok',
        data: {
          data: [
            {
              isin_code: 'abc',
              payment_frequency: 'mensual',
              modality: true,
              flow_type: true,
              details: [],
            },
          ],
          current_page: 1,
          last_page: 2,
        },
      },
    }
    ;(executeApi as jest.Mock).mockReturnValue({
      get: jest.fn(() => Promise.resolve(mockResponse)),
    })
    await store._getAmortizationTableList('')
    expect(store.amortization_title_table_list).toEqual([
      {
        isin_code: 'abc',
        payment_frequency: 'mensual',
        modality: true,
        flow_type: true,
        details: [],
      },
    ])
    expect(store.amortization_title_table_pages).toEqual({
      currentPage: 1,
      lastPage: 2,
    })
  })

  it('should call _getAmortizationTableById and update data_information_form', async () => {
    const store = useAmortizationTitleTableCollectionStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'ok',
        data: {
          isin_code: 'abc',
          payment_frequency: 'mensual',
          modality: true,
          flow_type: true,
          details: [],
        },
      },
    }
    ;(executeApi as jest.Mock).mockReturnValue({
      get: jest.fn(() => Promise.resolve(mockResponse)),
    })
    await store._getAmortizationTableById(1)
    expect(store.data_information_form).toEqual({
      isin_code: 'abc',
      payment_frequency: 'mensual',
      modality: true,
      flow_type: true,
      details: [],
    })
  })

  it('should call _createAmortizationTitle and return success', async () => {
    const store = useAmortizationTitleTableCollectionStoreV1()
    const mockResponse = { data: { success: true, message: 'created' } }
    ;(executeApi as jest.Mock).mockReturnValue({
      post: jest.fn(() => Promise.resolve(mockResponse)),
    })
    const result = await store._createAmortizationTitle({
      mnemonic: 'abc',
      payment_frequency: 'mensual',
      modality: true,
      flow_type: 'Regular',
      details: [],
    })
    expect(result).toBe(true)
  })

  it('should call _updateAmortizationTitle and return success', async () => {
    const store = useAmortizationTitleTableCollectionStoreV1()
    const mockResponse = { data: { success: true, message: 'updated' } }
    ;(executeApi as jest.Mock).mockReturnValue({
      put: jest.fn(() => Promise.resolve(mockResponse)),
    })
    const result = await store._updateAmortizationTitle(1, {
      mnemonic: 'abc',
      payment_frequency: 'mensual',
      modality: true,
      flow_type: 'Regular',
      details: [],
    })
    expect(result).toBe(true)
  })

  it('should call _deleteAmortizationTitle and return success', async () => {
    const store = useAmortizationTitleTableCollectionStoreV1()
    const mockResponse = { data: { success: true, message: 'deleted' } }
    ;(executeApi as jest.Mock).mockReturnValue({
      delete: jest.fn(() => Promise.resolve(mockResponse)),
    })
    const result = await store._deleteAmortizationTitle(1)
    expect(result).toBe(true)
  })

  it('should call _importFileAmortization and update document_data_table', async () => {
    const store = useAmortizationTitleTableCollectionStoreV1()
    const mockResponse = {
      data: {
        success: true,
        message: 'ok',
        data: [{ id: 1, date: '2025-07-31', percentage: 10, origin: 'Manual' }],
      },
    }
    ;(executeApi as jest.Mock).mockReturnValue({
      post: jest.fn(() => Promise.resolve(mockResponse)),
    })
    const result = await store._importFileAmortization('Manual')
    expect(result).toBe(true)
    expect(store.document_data_table).toEqual([
      { id: 1, date: '2025-07-31', percentage: 10, origin: 'Manual' },
    ])
  })

  it('should call _getTemplate and handle blob download', async () => {
    const store = useAmortizationTitleTableCollectionStoreV1()
    const mockResponse = {
      data: new ArrayBuffer(8),
      headers: {
        'content-type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    }
    ;(executeApi as jest.Mock).mockReturnValue({
      get: jest.fn(() => Promise.resolve(mockResponse)),
    })
    await store._getTemplate()
    // No expect needed, just check that it runs without error
  })

  it('should set document_import with _setDataDocuments', () => {
    const store = useAmortizationTitleTableCollectionStoreV1()
    // Simula un objeto tipo File
    const fakeFile = { name: 'file.xlsx', size: 1234 } as File
    store._setDataDocuments(fakeFile)
    expect(store.document_import).toStrictEqual(fakeFile)
    store._setDataDocuments(null)
    expect(store.document_import).toBeNull()
  })

  it('should handle error in _getAmortizationTableList gracefully', async () => {
    const store = useAmortizationTitleTableCollectionStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
    await store._getAmortizationTableList('')
    expect(store.amortization_title_table_list).toEqual([])
  })

  it('should handle error in _getAmortizationTableById gracefully', async () => {
    const store = useAmortizationTitleTableCollectionStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
    await store._getAmortizationTableById(1)
    expect(store.data_information_form).toBeNull()
  })

  it('should handle error in _createAmortizationTitle gracefully', async () => {
    const store = useAmortizationTitleTableCollectionStoreV1()
    const mockPost = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })
    const result = await store._createAmortizationTitle({
      mnemonic: 'abc',
      payment_frequency: 'mensual',
      modality: true,
      flow_type: 'Regular',
      details: [],
    })
    expect(result).toBe(false)
  })

  it('should handle error in _updateAmortizationTitle gracefully', async () => {
    const store = useAmortizationTitleTableCollectionStoreV1()
    const mockPut = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })
    const result = await store._updateAmortizationTitle(1, {
      mnemonic: 'abc',
      payment_frequency: 'mensual',
      modality: true,
      flow_type: 'Regular',
      details: [],
    })
    expect(result).toBe(false)
  })

  it('should handle error in _deleteAmortizationTitle gracefully', async () => {
    const store = useAmortizationTitleTableCollectionStoreV1()
    const mockDelete = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })
    const result = await store._deleteAmortizationTitle(1)
    expect(result).toBe(false)
  })

  it('should handle error in _importFileAmortization gracefully', async () => {
    const store = useAmortizationTitleTableCollectionStoreV1()
    const mockPost = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })
    const result = await store._importFileAmortization('Manual')
    expect(result).toBe(false)
  })
})
