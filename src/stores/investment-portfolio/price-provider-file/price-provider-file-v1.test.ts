import { setActivePinia, createPinia } from 'pinia'
import { usePriceProviderFileStoreV1 } from '@/stores/investment-portfolio/price-provider-file/price-provider-file-v1'
import { IPriceProviderFileFormModel } from '@/interfaces/customs'

// ✅ Los mocks deben llamarse mockXxx para que Jest los permita usar dentro de jest.mock
const mockGet = jest.fn()
const mockPost = jest.fn()
const mockPatch = jest.fn()
const mockDelete = jest.fn()

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: mockGet,
    post: mockPost,
    patch: mockPatch,
    delete: mockDelete,
  })),
}))

jest.mock('@/composables', () => ({
  useAlert: () => ({
    showAlert: jest.fn(),
  }),
  useShowError: () => ({
    showCatchError: jest.fn().mockReturnValue('Error procesando'),
  }),
}))

describe('usePriceProviderFileStoreV1', () => {
  let store: ReturnType<typeof usePriceProviderFileStoreV1>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = usePriceProviderFileStoreV1()

    jest.clearAllMocks()
  })

  it('should fetch price provider file list successfully', async () => {
    const mockData = {
      data: {
        data: [{ id: 1, name: 'Archivo 1' }],
        current_page: 1,
        last_page: 2,
      },
      message: 'Consulta exitosa',
      success: true,
    }

    mockGet.mockResolvedValue({ data: mockData })

    await store._getPriceProviderFileList('&search=test')

    expect(store.price_provider_file_list).toHaveLength(1)
    expect(store.price_provider_file.currentPage).toBe(1)
    expect(store.price_provider_file.lastPage).toBe(2)
  })

  it('should handle error on list fetch', async () => {
    mockGet.mockRejectedValue(new Error('Error'))

    await store._getPriceProviderFileList('')

    expect(store.price_provider_file_list).toHaveLength(0)
  })

  it('should create a price provider file successfully', async () => {
    mockPost.mockResolvedValue({
      data: { success: true, message: 'Creado correctamente' },
    })

    const result = await store._createPriceProviderFile({ name: 'test' })

    expect(result).toBe(true)
  })

  it('should fail to create and handle error', async () => {
    mockPost.mockRejectedValue(new Error('Error'))

    const result = await store._createPriceProviderFile({})

    expect(result).toBe(false)
  })

  it('should get item by id and set store state', async () => {
    const mockResponse = {
      data: {
        success: true,
        data: { id: 99, name: 'Test Archivo' },
        message: 'OK',
      },
    }

    mockGet.mockResolvedValue(mockResponse)

    await store._getByIdPriceProviderFile(99)

    expect(store.information_receipt_request).toEqual({
      id: 99,
      name: 'Test Archivo',
    })
  })

  it('should handle error in _getByIdPriceProviderFile (catch block)', async () => {
    mockGet.mockRejectedValue(new Error('Network error'))

    await store._getByIdPriceProviderFile(123)

    expect(store.information_receipt_request).toBeNull()
  })

  it('should update price provider file status', async () => {
    mockPatch.mockResolvedValue({
      data: {
        success: true,
        message: 'Actualizado',
      },
    })

    const result = await store._updatePriceProviderFile(12)
    expect(result).toBe(true)
  })

  it('should return false when update fails in response', async () => {
    mockPatch.mockResolvedValue({
      data: {
        success: false,
        message: 'Falló actualización',
      },
    })

    const result = await store._updatePriceProviderFile(999)
    expect(result).toBe(false)
  })

  it('should handle error when update request throws', async () => {
    mockPatch.mockRejectedValue(new Error('Error al actualizar'))

    const result = await store._updatePriceProviderFile(999)
    expect(result).toBe(false)
  })

  it('should handle delete error (catch block)', async () => {
    mockDelete.mockRejectedValue({
      response: {
        data: {
          data: ['error message'],
        },
      },
    })

    const result = await store._deletePriceProviderFile(123)

    expect(result).toBe(false)
    expect(store.information_receipt_request_delete).toEqual(['error message'])
  })

  it('should handle delete error (catch block)', async () => {
    mockDelete.mockRejectedValue(new Error('Network error'))

    const result = await store._deletePriceProviderFile(123)

    expect(result).toBe(false)
  })

  it('should clear data correctly', () => {
    store.price_provider_file_list = [
      {
        id: 1,
        document_third: '123456789',
        identification: 'CC123',
      },
    ]
    store.price_provider_file = { currentPage: 5, lastPage: 10 }

    store._clearData()

    expect(store.price_provider_file_list).toEqual([])
    expect(store.price_provider_file.currentPage).toBe(0)
    expect(store.price_provider_file.lastPage).toBe(0)
  })

  it('should set data information form', () => {
    const form: IPriceProviderFileFormModel = {
      issuers_counterparty_id: 1,
      description: 'Archivo de prueba',
      files: [],
    }

    store._setDataInformationForm(form)

    expect(store.data_information_form).toEqual(form)
  })

  it('should set data information form to null', () => {
    store._setDataInformationForm(null)

    expect(store.data_information_form).toBeNull()
  })
})
