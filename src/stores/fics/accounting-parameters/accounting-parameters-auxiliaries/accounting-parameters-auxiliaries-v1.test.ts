// Vue - Pinia
import { setActivePinia, createPinia } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import {
  IAccountingParametersAccountingParametersAuxiliariesList,
  IAccountingParametersAccountingParametersAuxiliaries,
} from '@/interfaces/customs/fics/AccountingParametersAuxiliaries'

// Constants
import { URL_PATH_FICS } from '@/constants/apis'

// Store
import { useAccountingParametersAccountingParametersAuxiliariesStoreV1 } from '@/stores/fics/accounting-parameters/accounting-parameters-auxiliaries/accounting-parameters-auxiliaries-v1'

const URL_PATH = `${URL_PATH_FICS}/accounting-parameters/parameters-list`

const mockBusinessItem = {
  id: 1,
  description: 'Especifico',
  abbreviation: 'ES',
} as IAccountingParametersAccountingParametersAuxiliaries

const mockAccountingParametersAuxiliariesListResponse: IAccountingParametersAccountingParametersAuxiliariesList =
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

describe('useAccountingParametersAccountingParametersAuxiliariesStoreV1', () => {
  let store: ReturnType<
    typeof useAccountingParametersAccountingParametersAuxiliariesStoreV1
  >

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useAccountingParametersAccountingParametersAuxiliariesStoreV1()
    jest.clearAllMocks()
  })

  describe('_getAccountingParametersAuxiliaries', () => {
    it('should fetch accounting parameters auxiliaries successfully', async () => {
      // Arrange
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Success',
          data: mockAccountingParametersAuxiliariesListResponse,
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getAccountingParametersAuxiliaries()

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}`)
      expect(store.accounting_parameters_auxiliaries_list).toEqual(
        mockAccountingParametersAuxiliariesListResponse
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
          },
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      await store._getAccountingParametersAuxiliaries()

      expect(mockGet).toHaveBeenCalled()
    })

    it('handles error when fetching accounting parameters auxiliaries fails', async () => {
      // Arrange
      const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getAccountingParametersAuxiliaries()

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}`)
      expect(store.accounting_parameters_auxiliaries_list).toEqual([])
    })
  })

  describe('_clearDataAccountingParametersAuxiliaries', () => {
    it('should clear all data from the store', () => {
      // Arrange
      store.accounting_parameters_auxiliaries_list = [
        {
          ...mockBusinessItem,
        },
      ]

      // Act
      store._clearDataAccountingParametersAuxiliaries()

      // Assert
      expect(store.accounting_parameters_auxiliaries_list).toEqual([])
    })
  })
})
