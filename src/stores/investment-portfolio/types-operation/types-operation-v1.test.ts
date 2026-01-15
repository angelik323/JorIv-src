import { setActivePinia, createPinia } from 'pinia'
import { useTypesOperationCollectionStoreV1 } from './types-operation-v1'
import { executeApi } from '@/apis'
import { ITypesOperation } from '@/interfaces/customs'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
  })),
}))

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useShowError: jest.fn(() => ({ showCatchError: jest.fn() })),
}))

const mockTypesOperationData: ITypesOperation = {
  code: 1,
  description: 'Test Operation',
  generates_fic_movement: true,
  fic_movement_code: 101,
  operation_nature: 'Ingreso',
  accounting_origin: 'Portafolio',
  generates_papeleta: true,
  inversion_type_id: 10,
  treasury_movement_code_id: 20,
}

describe('useTypesOperationCollectionStoreV1', () => {
  let store: ReturnType<typeof useTypesOperationCollectionStoreV1>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useTypesOperationCollectionStoreV1()
    jest.clearAllMocks()
  })

  describe('_getTypesOperationList', () => {
    it('fetches and stores list successfully', async () => {
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Success',
          data: {
            data: [mockTypesOperationData],
            current_page: 1,
            last_page: 2,
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      await store._getTypesOperationList('page=1')

      expect(mockGet).toHaveBeenCalledWith(
        'investment-portfolio/api/investment-portfolio/operation-types?page=1'
      )
      expect(store.types_operation_list).toHaveLength(1)
      expect(store.types_operation_list[0]).toEqual(mockTypesOperationData)
      expect(store.types_operation_pages.currentPage).toBe(1)
      expect(store.types_operation_pages.lastPage).toBe(2)
    })

    it('handles errors gracefully', async () => {
      const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      await store._getTypesOperationList('')

      expect(store.types_operation_list).toHaveLength(0)
    })

    it('handles API response with success false', async () => {
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'Error fetching data',
          data: null,
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      await store._getTypesOperationList('')

      expect(store.types_operation_list).toHaveLength(0)
    })
  })

  describe('_getTypesOperationById', () => {
    it('fetches and stores single item successfully', async () => {
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          data: mockTypesOperationData,
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      await store._getTypesOperationById(1)

      expect(mockGet).toHaveBeenCalledWith(
        'investment-portfolio/api/investment-portfolio/operation-types/show/1'
      )
      expect(store.data_information_form?.code).toBe(1)
      expect(store.data_information_form?.inversion_type_id).toBe(10)
      expect(store.data_information_form?.treasury_movement_code_id).toBe(20)
    })

    it('clears form data on error', async () => {
      const mockGet = jest.fn().mockRejectedValue(new Error('Not found'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      await store._getTypesOperationById(999)

      expect(store.data_information_form).toBeNull()
    })
  })

  describe('_createTypesOperation', () => {
    it('creates successfully and returns true', async () => {
      const mockPost = jest.fn().mockResolvedValue({
        data: { success: true },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const result = await store._createTypesOperation(mockTypesOperationData)

      expect(mockPost).toHaveBeenCalledWith(
        'investment-portfolio/api/investment-portfolio/operation-types/new',
        mockTypesOperationData
      )
      expect(result).toBe(true)
    })

    it('returns false on error', async () => {
      const mockPost = jest
        .fn()
        .mockRejectedValue(new Error('Validation error'))
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const result = await store._createTypesOperation(mockTypesOperationData)

      expect(result).toBe(false)
    })
  })

  describe('_updateTypesOperation', () => {
    it('updates successfully and returns true', async () => {
      const mockPut = jest.fn().mockResolvedValue({
        data: { success: true },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      const result = await store._updateTypesOperation(
        mockTypesOperationData,
        1
      )

      expect(mockPut).toHaveBeenCalledWith(
        'investment-portfolio/api/investment-portfolio/operation-types/update/1',
        mockTypesOperationData
      )
      expect(result).toBe(true)
    })

    it('returns false on error', async () => {
      const mockPut = jest.fn().mockRejectedValue(new Error('Update failed'))
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      const result = await store._updateTypesOperation(
        mockTypesOperationData,
        1
      )

      expect(result).toBe(false)
    })
  })

  describe('_setDataInformationForm', () => {
    it('sets form data', () => {
      store._setDataInformationForm(mockTypesOperationData)

      expect(store.data_information_form).toEqual(mockTypesOperationData)
    })

    it('clears form data when null', () => {
      store._setDataInformationForm(mockTypesOperationData)
      store._setDataInformationForm(null)

      expect(store.data_information_form).toBeNull()
    })
  })
})
