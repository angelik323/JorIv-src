// Vue - Pinia
import { setActivePinia, createPinia } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import {
  IAccountingParametersAssociatedBusinessesList,
  IAccountingParametersAssociatedBusinesses,
} from '@/interfaces/customs/fics/AssociatedBusinesses'

// Constants
import { TRUST_BUSINESS_API_URL } from '@/constants/apis'

// Store
import { useAccountingParametersAssociatedBusinessesStoreV1 } from '@/stores/fics/accounting-parameters/associated-businesses/associated-businesses-v1'

const URL_PATH = `${TRUST_BUSINESS_API_URL}/accounting-block/list-business-trusts`

const mockBusinessItem = {
  id: 1,
  business_code: '1',
  name: 'Test Business',
  status_id: 1,
} as IAccountingParametersAssociatedBusinesses

const mockAssociatedBusinessesListResponse: IAccountingParametersAssociatedBusinessesList =
  [mockBusinessItem]

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

describe('useAccountingParametersAssociatedBusinessesStoreV1', () => {
  let store: ReturnType<
    typeof useAccountingParametersAssociatedBusinessesStoreV1
  >

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useAccountingParametersAssociatedBusinessesStoreV1()
    jest.clearAllMocks()
  })

  describe('_getAssociatedBusinesses', () => {
    const filters =
      '&page=1&filter[type]=001&filter[accounting_structure]=0001&filter[cost_center_structure]=0001'
    const filtersEmpty = ''

    it('should fetch associated businesses successfully', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Success',
          data: {
            data: mockAssociatedBusinessesListResponse,
            current_page: 1,
            last_page: 1,
            total: 1,
            per_page: 10,
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getAssociatedBusinesses(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}?paginate=1${filters}`)
      expect(store.associated_businesses_pages).toEqual({
        currentPage: 1,
        lastPage: 1,
        total_items: 1,
        per_page: 10,
      })
      expect(store.associated_businesses_list).toEqual(
        mockAssociatedBusinessesListResponse
      )
    })

    it('should fetch associated businesses successfully without filters', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Success without filters',
          data: {
            data: mockAssociatedBusinessesListResponse,
            current_page: 1,
            last_page: 1,
            total: 1,
            per_page: 10,
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getAssociatedBusinesses(filtersEmpty)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}?paginate=1${filtersEmpty}`
      )
      expect(store.associated_businesses_list).toEqual(
        mockAssociatedBusinessesListResponse
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
            per_page: 0,
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      await store._getAssociatedBusinesses(filters)

      expect(mockGet).toHaveBeenCalled()
    })

    it('handles error when fetching associated businesses fails', async () => {
      // Arrange
      const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getAssociatedBusinesses(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}?paginate=1${filters}`)
      expect(store.associated_businesses_list).toEqual([])
    })

    it('should handle missing data gracefully', async () => {
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Sin datos',
          data: {},
        },
      })

      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      await store._getAssociatedBusinesses(filters)

      expect(store.associated_businesses_list).toEqual([])
      expect(store.associated_businesses_pages).toEqual({
        currentPage: 0,
        lastPage: 0,
        total_items: 0,
        per_page: 0,
      })
    })
  })

  describe('_clearDataAssociatedBusinesses', () => {
    it('should clear all data from the store', () => {
      // Arrange
      store.associated_businesses_list = [
        {
          ...mockBusinessItem,
        },
      ]
      store.associated_businesses_pages = {
        currentPage: 1,
        lastPage: 1,
        total_items: 10,
        per_page: 10,
      }

      // Act
      store._clearDataAssociatedBusinesses()

      // Assert
      expect(store.associated_businesses_list).toEqual([])
      expect(store.associated_businesses_pages).toEqual({
        currentPage: 0,
        lastPage: 0,
        total_items: 0,
        per_page: 0,
      })
    })
  })
})
