import { setActivePinia, createPinia } from 'pinia'
import { useCollectionReferenceStoreV1 } from '@/stores/treasury/collection-reference/collection-reference-v1'
import { executeApi } from '@/apis'
import type {
  ICollectionReference,
  ICollectionReferenceForm,
  ICollectionReferenceList,
} from '@/interfaces/customs'
import { URL_PATH_TREASURIES } from '@/constants/apis'

const URL_PATH = `${URL_PATH_TREASURIES}/collection-references`

const mockCollectionReferenceForm: ICollectionReferenceForm = {
  accounting_blocks_collection_id: 1,
  accounting_parameters_collection_id: 5,
  origin_id: 1,
  bank_reference: 'Referencia',
  bar_code: 'Código',
}

const mockCollectionReference: ICollectionReference = {
  id: 1,
  origin: {
    id: 1,
    name: 'name',
  },
  bank_reference: 'bank_reference',
  bar_code: 'bar_code',
  accounting_block_collection: {
    id: 1,
    code: "001"
  },
  accounting_parameters_collection: {
    id: 2,
    code: "002"
  }
}

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
}))

jest.mock('quasar', () => ({
  Notify: {
    create: jest.fn(),
  },
}))

describe('useCollectionReferenceStoreV1', () => {
  let store: ReturnType<typeof useCollectionReferenceStoreV1>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useCollectionReferenceStoreV1()
    jest.clearAllMocks()
  })

  describe('_getCollectionReferences', () => {
    const filters = 'page=1&filter[search]=0001'
    const filtersEmpty = ''

    const mockCollectionReferenceList: ICollectionReferenceList = [
      mockCollectionReference,
    ]

    it('should fetch collection references successfully', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Success',
          data: {
            data: mockCollectionReferenceList,
            current_page: 1,
            last_page: 1,
            total: 1,
            per_page: 10,
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getCollectionReferences(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}?paginate=1&${filters}`)
      expect(store.collection_reference_list).toEqual(
        mockCollectionReferenceList
      )
      expect(store.collection_reference_pages).toEqual({
        currentPage: 1,
        lastPage: 1,
        total_items: 1,
        per_page: 10,
      })
    })

    it('should fetch collection references successfully without filters', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Success without filters',
          data: {
            data: mockCollectionReferenceList,
            current_page: 1,
            last_page: 1,
            total: 1,
            per_page: 10,
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getCollectionReferences(filtersEmpty)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}?paginate=1&${filtersEmpty}`
      )
      expect(store.collection_reference_list).toEqual(
        mockCollectionReferenceList
      )
    })

    it('should handle API success=false response', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'Failed',
          data: {
            data: [],
            current_page: 0,
            last_page: 0,
            total: 0,
            per_page: 10,
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      await store._getCollectionReferences(filters)

      expect(mockGet).toHaveBeenCalled()
      expect(store.collection_reference_list).toEqual([])
    })

    it('handles error when fetching collection references fails', async () => {
      // Arrange
      const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getCollectionReferences(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}?paginate=1&${filters}`)
      expect(store.collection_reference_list).toEqual([])
    })
  })

  describe('_getByIdCollectionReference', () => {
    it('should fetch collection reference by ID successfully', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Success',
          data: mockCollectionReference,
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getByIdCollectionReference(1)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/1`)
      expect(store.collection_reference_view).toEqual(mockCollectionReference)
    })

    it('should handle API success=false or no data', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: { success: false, message: 'Not found', data: null },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getByIdCollectionReference(1)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/1`)
      expect(store.collection_reference_view).toBeNull()
    })

    it('handles error when fetching collection reference by ID fails', async () => {
      // Arrange
      const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getByIdCollectionReference(1)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/1`)
      expect(store.collection_reference_view).toBeNull()
    })
  })

  describe('_createCollectionReference', () => {
    it('should create a new collection reference successfully', async () => {
      // Arrange
      const mockPost = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Created',
          data: mockCollectionReference,
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._createCollectionReference(
        mockCollectionReferenceForm
      )

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH}`,
        mockCollectionReferenceForm
      )
      expect(result).toBe(true)
    })

    it('should handle API success=false on create', async () => {
      const mockPost = jest.fn().mockResolvedValue({
        data: { success: false, message: 'Error', data: null },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const result = await store._createCollectionReference(
        mockCollectionReferenceForm
      )
      expect(result).toBe(false)
    })

    it('handles error when creating collection reference fails', async () => {
      // Arrange
      const mockPost = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._createCollectionReference(
        mockCollectionReferenceForm
      )

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH}`,
        mockCollectionReferenceForm
      )
      expect(result).toBe(false)
    })
  })

  describe('_updateCollectionReference', () => {
    const collectionReferenceId = 1

    it('should update an existing collection reference successfully', async () => {
      // Arrange
      const mockPut = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Updated',
          data: mockCollectionReference,
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      // Act
      const result = await store._updateCollectionReference(
        mockCollectionReferenceForm,
        collectionReferenceId
      )

      // Assert
      expect(mockPut).toHaveBeenCalledWith(
        `${URL_PATH}/${collectionReferenceId}`,
        mockCollectionReferenceForm
      )
      expect(result).toBe(true)
    })

    it('should handle API success=false on update', async () => {
      const mockPut = jest.fn().mockResolvedValue({
        data: { success: false, message: 'Error', data: null },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      const result = await store._updateCollectionReference(
        mockCollectionReferenceForm,
        collectionReferenceId
      )
      expect(result).toBe(false)
    })

    it('handles error when updating collection reference fails', async () => {
      // Arrange
      const mockPut = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      // Act
      const result = await store._updateCollectionReference(
        mockCollectionReferenceForm,
        collectionReferenceId
      )

      // Assert
      expect(mockPut).toHaveBeenCalledWith(
        `${URL_PATH}/${collectionReferenceId}`,
        mockCollectionReferenceForm
      )
      expect(result).toBe(false)
    })
  })

  describe('_deleteCollectionReference', () => {
    const collectionReferenceId = 1

    it('should delete an collection reference successfully', async () => {
      // Arrange
      const mockDelete = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Deleted',
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

      // Act
      const result = await store._deleteCollectionReference(
        collectionReferenceId
      )

      // Assert
      expect(mockDelete).toHaveBeenCalledWith(
        `${URL_PATH}/${collectionReferenceId}`
      )
      expect(result).toBe(true)
    })

    it('should handle API success=false on delete', async () => {
      const mockDelete = jest.fn().mockResolvedValue({
        data: { success: false, message: 'Error', data: null },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

      const result = await store._deleteCollectionReference(
        collectionReferenceId
      )
      expect(result).toBe(false)
    })

    it('handles error when deleting collection reference fails', async () => {
      // Arrange
      const mockDelete = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

      // Act
      const result = await store._deleteCollectionReference(
        collectionReferenceId
      )

      // Assert
      expect(mockDelete).toHaveBeenCalledWith(
        `${URL_PATH}/${collectionReferenceId}`
      )
      expect(result).toBe(false)
    })
  })

  describe('_setCollectionReferenceForm', () => {
    it('should set the form data', () => {
      // Arrange
      const formData = mockCollectionReferenceForm

      // Act
      store._setCollectionReferenceForm(formData)

      // Assert
      expect(store.collection_reference_form).toEqual(formData)
    })

    it('should clear form data when passed null', () => {
      store.collection_reference_form = null as ICollectionReferenceForm | null
      store._setCollectionReferenceForm(null)
      expect(store.collection_reference_form).toBeNull()
    })
  })

  describe('_clearDataCollectionReference', () => {
    it('should clear all data from the store', () => {
      // Arrange
      store.collection_reference_list = [] as ICollectionReferenceList
      store.collection_reference_view = null as ICollectionReference | null
      store.collection_reference_form = null as ICollectionReferenceForm | null
      store.collection_reference_pages = {
        currentPage: 1,
        lastPage: 1,
        per_page: 10,
        total_items: 1,
      }

      // Act
      store._clearData()

      // Assert
      expect(store.collection_reference_list).toEqual([])
      expect(store.collection_reference_view).toBeNull()
      expect(store.collection_reference_form).toBeNull()
      expect(store.collection_reference_pages).toEqual({
        currentPage: 0,
        lastPage: 0,
        per_page: 0,
        total_items: 0,
      })
    })
  })
})
