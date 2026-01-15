import { setActivePinia, createPinia } from 'pinia'
import { useCancelBankLoadsStoreV1 } from './cancel-load-banks-v1'
import { executeApi } from '@/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_TREASURIES } from '@/constants/apis'

let mockShowAlert: jest.Mock
let mockShowCatchError: jest.Mock
let mockGetNameBlob: jest.Mock
let mockDownloadBlobXlxx: jest.Mock

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
  })),
}))

jest.mock('@/composables', () => {
  mockShowAlert = jest.fn()
  mockShowCatchError = jest.fn().mockReturnValue('Error simulado')
  mockGetNameBlob = jest.fn().mockReturnValue('archivo.xlsx')
  mockDownloadBlobXlxx = jest.fn()

  return {
    useAlert: () => ({ showAlert: mockShowAlert }),
    useShowError: () => ({ showCatchError: mockShowCatchError }),
    useUtils: () => ({
      getNameBlob: mockGetNameBlob,
      downloadBlobXlxx: mockDownloadBlobXlxx,
    }),
  }
})

describe('useCancelBankLoadsStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('should get banking network uploads successfully', async () => {
    const store = useCancelBankLoadsStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: { success: true, message: 'OK', data: { id: 1 } },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getBankingNetworkUploads(1)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH_TREASURIES}/banking-network-uploads/1`)
    expect(store.banking_network_uploads_data).toEqual({ id: 1 })
    expect(result).toBe(true)
    expect(mockShowAlert).toHaveBeenCalledWith('OK', 'success', undefined, TIMEOUT_ALERT)
  })

  it('should handle error in getBankingNetworkUploads', async () => {
    const store = useCancelBankLoadsStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getBankingNetworkUploads(1)

    expect(result).toBe(false)
    expect(mockShowCatchError).toHaveBeenCalled()
    expect(mockShowAlert).toHaveBeenCalledWith('Error simulado', 'error', undefined, TIMEOUT_ALERT)
  })

  it('should get banking network upload records successfully', async () => {
    const store = useCancelBankLoadsStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Records OK' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getBankingNetworkUploadsRecords(5)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH_TREASURIES}/banking-network-uploads/5/records`)
    expect(result).toBe(true)
    expect(mockShowAlert).toHaveBeenCalledWith('Records OK', 'success', undefined, TIMEOUT_ALERT)
  })

  it('should handle error in getBankingNetworkUploadsRecords', async () => {
    const store = useCancelBankLoadsStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getBankingNetworkUploadsRecords(5)

    expect(result).toBe(false)
    expect(mockShowCatchError).toHaveBeenCalled()
  })

  it('should post annulate successfully', async () => {
    const store = useCancelBankLoadsStoreV1()
    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Anulado correctamente' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload = {
      income_record_ids: [1, 2],
      annulate_date: '2025-01-01',
      annulate_period: '202501',
      annulate_observations: 'Prueba',
      annulate_code_id: 5,
    }

    const result = await store._postBankingNetworkUploadsAnnulate(1, payload)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/banking-network-uploads/1/annulate`,
      payload
    )
    expect(result).toBe(true)
    expect(mockShowAlert).toHaveBeenCalledWith(
      'Anulado correctamente',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('should handle failure in postBankingNetworkUploadsAnnulate', async () => {
    const store = useCancelBankLoadsStoreV1()
    const mockPost = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Error de anulación' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._postBankingNetworkUploadsAnnulate(1, {
      income_record_ids: [],
      annulate_date: '',
      annulate_period: '',
      annulate_observations: '',
      annulate_code_id: 0,
    })

    expect(result).toBe(false)
    expect(mockShowAlert).toHaveBeenCalledWith('Error de anulación', 'error', undefined, TIMEOUT_ALERT)
  })

  it('should catch error in postBankingNetworkUploadsAnnulate', async () => {
    const store = useCancelBankLoadsStoreV1()
    const mockPost = jest.fn().mockRejectedValue(new Error('Fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._postBankingNetworkUploadsAnnulate(1, {
      income_record_ids: [],
      annulate_date: '',
      annulate_period: '',
      annulate_observations: '',
      annulate_code_id: 0,
    })

    expect(result).toBe(false)
    expect(mockShowCatchError).toHaveBeenCalled()
  })

  it('should export failures successfully', async () => {
    const store = useCancelBankLoadsStoreV1()
    const mockPost = jest.fn().mockResolvedValue({
      data: 'contenido',
      headers: { 'content-type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    store.banking_network_uploads_annulate_failure = [{
      row: 2,
      business_name: "Iste ut iure fugit est quam dolores.",
      business_code: "N/A",
      record_number: 2,
      error: "Estado del negocio no permitido: . Solo se aceptan negocios en estados: vigente, en liquidación y liquidado"
    }]

    await store._getBankingNetworkUploadsExport(1)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/banking-network-uploads/1/annulate/export-failures`,
      { failed_records: store.banking_network_uploads_annulate_failure }
    )
    expect(mockGetNameBlob).toHaveBeenCalled()
    expect(mockDownloadBlobXlxx).toHaveBeenCalled()
  })

  it('should handle error in getBankingNetworkUploadsExport', async () => {
    const store = useCancelBankLoadsStoreV1()
    const mockPost = jest.fn().mockRejectedValue(new Error('Fail'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    store.banking_network_uploads_annulate_failure = [{
      row: 2,
      business_name: "Iste ut iure fugit est quam dolores.",
      business_code: "N/A",
      record_number: 2,
      error: "Estado del negocio no permitido: . Solo se aceptan negocios en estados: vigente, en liquidación y liquidado"
    }]

    await store._getBankingNetworkUploadsExport(1)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/banking-network-uploads/1/annulate/export-failures`,
      { failed_records: store.banking_network_uploads_annulate_failure }
    )
    expect(mockShowCatchError).toHaveBeenCalled()
  })
})
