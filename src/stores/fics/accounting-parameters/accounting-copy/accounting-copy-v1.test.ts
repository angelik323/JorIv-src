// Vue - Pinia
import { setActivePinia, createPinia } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import type { IAccountingParametersAccountingCopyForm } from '@/interfaces/customs/fics/AccountingCopy'

// Constants
import { URL_PATH_FICS } from '@/constants/apis'

// Store
import { useAccountingParametersAccountingCopyStoreV1 } from '@/stores/fics/accounting-parameters/accounting-copy/accounting-copy-v1'

const URL_PATH = `${URL_PATH_FICS}/accounting-blocks/copy-accounting-parameters`

const mockAccountingCopyForm: IAccountingParametersAccountingCopyForm = {
  origin_accounting_block_id: 1,
  destination_accounting_block_id: 2,
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

describe('useAccountingParametersAccountingCopyStoreV1', () => {
  let store: ReturnType<typeof useAccountingParametersAccountingCopyStoreV1>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useAccountingParametersAccountingCopyStoreV1()
    jest.clearAllMocks()
  })

  describe('_createAccountingCopy', () => {
    it('should create a new accounting copy successfully', async () => {
      // Arrange
      const mockPost = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Created',
          data: mockAccountingCopyForm,
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._createAccountingCopy(mockAccountingCopyForm)

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH}`,
        mockAccountingCopyForm
      )
      expect(result).toBe(true)
    })

    it('should handle API success=false on create', async () => {
      const mockPost = jest.fn().mockResolvedValue({
        data: { success: false, message: 'Error', data: null },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const result = await store._createAccountingCopy(mockAccountingCopyForm)
      expect(result).toBe(false)
    })

    it('handles error when creating accounting copy fails', async () => {
      // Arrange
      const mockPost = jest.fn().mockRejectedValue(new Error('Network Error'))
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._createAccountingCopy(mockAccountingCopyForm)

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH}`,
        mockAccountingCopyForm
      )
      expect(result).toBe(false)
    })
  })

  describe('_setAccountingCopyForm', () => {
    it('should set the form data', () => {
      // Arrange
      const formData = mockAccountingCopyForm

      // Act
      store._setAccountingCopyForm(formData)

      // Assert
      expect(store.accounting_copy_form).toEqual(formData)
    })

    it('should clear form data when passed null', () => {
      store.accounting_copy_form = {} as IAccountingParametersAccountingCopyForm
      store._setAccountingCopyForm(null)
      expect(store.accounting_copy_form).toBeNull()
    })
  })
})
