// Pinia
import { setActivePinia, createPinia } from 'pinia'

// Stores
import { useTerritorialTaxesStoreV1 } from '@/stores/accounts-payable/territorial-taxes/territorial-taxes-v1'

// APIs
import { executeApi } from '@/apis'

// Constants
import { URL_PATH_ACCOUNTS_PAYABLE } from '@/constants/apis'

// Interfaces
import {
  ITerritorialTaxesForm,
  ITerritorialTaxesItem,
} from '@/interfaces/customs/accounts-payable/TerritorialTaxes'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  })),
}))

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({
    showAlert: jest.fn(),
  })),
  useShowError: jest.fn(() => ({
    showCatchError: jest.fn(),
  })),
}))

describe('useTerritorialTaxesStoreV1', () => {
  let store: ReturnType<typeof useTerritorialTaxesStoreV1>
  const url = `${URL_PATH_ACCOUNTS_PAYABLE}/ica/territorial-taxes`

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useTerritorialTaxesStoreV1()
    jest.clearAllMocks()
  })

  it('fetches territorial taxes list successfully', async () => {
    // Arrange
    const mockList: ITerritorialTaxesItem[] = [
      {
        id: 1,
        city: { id: 10, name: 'BOGOTÁ', code: '11001' },
        third_party: {
          id: 20,
          document: '900123456',
          validator_digit: 1,
          document_type_id: 23,
          support_document_numbering_issuer_status_id: 1,
          support_document_numbering_issuer_delegate_id: null,
          legal_person: null,
          natural_person: null,
          document_type: {
            id: 23,
            name: 'Fideicomiso',
            abbreviation: 'Fideicomiso',
            model: 'Fideicomiso',
            status_id: 1,
          },
        },
        settlement_concept: {
          id: 6,
          concept_code: '0',
          class: 'ITE',
          description: 'Prueba agregado ITE',
        },
        status: { id: 1, name: 'Activo', description: null },
      },
    ]
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Lista obtenida',
        data: { data: mockList, current_page: 1, last_page: 2 },
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    const result = await store._getTerritorialTaxesList({ 'filter[city_id]': 1 })

    // Assert
    expect(mockGet).toHaveBeenCalledWith(url, {
      params: { 'filter[city_id]': 1, paginate: 1 },
    })
    expect(store.territorial_taxes_list).toEqual(mockList)
    expect(store.territorial_taxes_pages).toEqual({ currentPage: 1, lastPage: 2 })
    expect(result).toEqual({ data: mockList, pages: { currentPage: 1, lastPage: 2 } })
  })

  it('handles error when fetching list', async () => {
    // Arrange
    const mockGet = jest.fn().mockRejectedValue(new Error('Error de red'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    const result = await store._getTerritorialTaxesList({})

    // Assert
    expect(store.territorial_taxes_list).toEqual([])
    expect(store.territorial_taxes_pages).toEqual({ currentPage: 1, lastPage: 1 })
    expect(result).toBeNull()
  })

  it('creates territorial tax successfully', async () => {
    // Arrange
    const payload: ITerritorialTaxesForm = {
      city_id: 1,
      third_party_id: 2,
      settlement_concept_id: 3,
    }
    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Creado correctamente' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._createTerritorialTax(payload)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(url, payload)
    expect(result).toBe(true)
  })

  it('handles error when creating', async () => {
    // Arrange
    const mockPost = jest.fn().mockRejectedValue(new Error('Error al crear'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._createTerritorialTax({
      city_id: null,
      third_party_id: null,
      settlement_concept_id: null,
    })

    // Assert
    expect(result).toBe(false)
  })

  it('gets territorial tax by ID successfully', async () => {
    // Arrange
    const mockData: ITerritorialTaxesItem = {
      id: 10,
      city: { id: 10, name: 'BOGOTÁ', code: '11001' },
      third_party: {
        id: 20,
        document: '900123456',
        validator_digit: 1,
        document_type_id: 23,
        support_document_numbering_issuer_status_id: 1,
        support_document_numbering_issuer_delegate_id: null,
        legal_person: null,
        natural_person: null,
        document_type: {
          id: 23,
          name: 'Fideicomiso',
          abbreviation: 'Fideicomiso',
          model: 'Fideicomiso',
          status_id: 1,
        },
      },
      settlement_concept: {
        id: 6,
        concept_code: '0',
        class: 'ITE',
        description: 'Prueba agregado ITE',
      },
      status: { id: 1, name: 'Activo', description: null },
    }
    const mockGet = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Obtenido correctamente', data: mockData },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getTerritorialTaxById(10)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(`${url}/10`)
    expect(store.territorial_taxes_response).toEqual(mockData)
  })

  it('handles error when getting by ID', async () => {
    // Arrange
    const mockGet = jest.fn().mockRejectedValue(new Error('Error al obtener'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getTerritorialTaxById(99)

    // Assert
    expect(store.territorial_taxes_response).toBeNull()
  })

  it('updates territorial tax successfully', async () => {
    // Arrange
    const payload: ITerritorialTaxesForm = {
      city_id: 1,
      third_party_id: 2,
      settlement_concept_id: 3,
      status_id: 2,
    }
    const mockPut = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Actualizado correctamente' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    // Act
    const result = await store._updateTerritorialTax(payload, 7)

    // Assert
    expect(mockPut).toHaveBeenCalledWith(`${url}/7`, payload)
    expect(result).toBe(true)
  })

  it('handles error when updating', async () => {
    // Arrange
    const mockPut = jest.fn().mockRejectedValue(new Error('Error al actualizar'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    // Act
    const result = await store._updateTerritorialTax(
      {
        city_id: null,
        third_party_id: null,
        settlement_concept_id: null,
        status_id: null,
      },
      7
    )

    // Assert
    expect(result).toBe(false)
  })

  it('deletes territorial tax successfully', async () => {
    // Arrange
    const mockDelete = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Eliminado correctamente' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    // Act
    const result = await store._deleteTerritorialTax(3)

    // Assert
    expect(mockDelete).toHaveBeenCalledWith(`${url}/3`)
    expect(result).toBe(true)
  })

  it('handles error when deleting', async () => {
    // Arrange
    const mockDelete = jest.fn().mockRejectedValue(new Error('Error al eliminar'))
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    // Act
    const result = await store._deleteTerritorialTax(99)

    // Assert
    expect(result).toBe(false)
  })

  it('sets form data correctly', () => {
    // Arrange / Act
    store._setFormData({
      city_id: 1,
      third_party_id: 2,
      settlement_concept_id: 3,
      status_id: 1,
    })

    // Assert
    expect(store.territorial_taxes_form).toEqual({
      city_id: 1,
      third_party_id: 2,
      settlement_concept_id: 3,
      status_id: 1,
    })

    // Act
    store._setFormData(null)

    // Assert
    expect(store.territorial_taxes_form).toBeNull()
  })
})