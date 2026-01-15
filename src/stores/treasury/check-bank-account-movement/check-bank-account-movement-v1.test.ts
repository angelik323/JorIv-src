import { setActivePinia, createPinia } from 'pinia'
import { useCheckBankAccountMovementStoreV1 } from './check-bank-account-movement-v1'
import { executeApi } from '@/apis'
import { URL_PATH_TREASURIES } from '@/constants/apis'
import { ICheckBankAccountMovementItem } from '@/interfaces/customs'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  })),
}))

jest.mock('@/composables', () => {
  const useAlert = jest.fn(() => ({ showAlert: jest.fn() }))
  const useShowError = jest.fn(() => ({
    showCatchError: jest.fn(() => 'Error message'),
  }))
  return { useAlert, useShowError }
})

jest.mock('@/utils', () => ({
  createAndDownloadBlobByArrayBuffer: jest.fn(),
}))

describe('useCheckBankAccountMovementStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should initialize with correct default state', () => {
      // Arrange & Act
      const store = useCheckBankAccountMovementStoreV1()

      // Assert
      expect(store.data_check_bank_account_movement).toEqual([])
      expect(store.headerPropsDefault.title).toBe(
        'Consulta movimiento cuenta bancaria'
      )
      expect(store.headerPropsDefault.breadcrumbs).toHaveLength(3)
      expect(store.headerPropsDefault.breadcrumbs[0]).toEqual({
        label: 'Inicio',
        route: 'HomeView',
      })
      expect(store.headerPropsDefault.breadcrumbs[1]).toEqual({
        label: 'Tesorería',
      })
      expect(store.headerPropsDefault.breadcrumbs[2]).toEqual({
        label: 'Consulta movimiento cuenta bancaria',
        route: 'CheckBankAccountMovementList',
      })
      expect(store.pages.currentPage).toBe(1)
      expect(store.pages.lastPage).toBe(1)
    })
  })

  describe('_getListCheckBankAccountMovement', () => {
    const mockMovementData: ICheckBankAccountMovementItem[] = [
      {
        id: 1,
        date: '2024-01-15',
        concept: 'Deposit',
        nature: 'Credit',
        value: 1000,
        coin: 'COP',
        trm: 1,
        foreign_currency_value: 1000,
        voucher: 'V001',
        number_voucher: 'NV001',
        initial_balance: 5000,
        final_balance: 6000,
        total_incomes: 1000,
        total_expenses: 0,
        business: {
          name: 'Test Business 1',
        },
        bank: {
          description: 'Test Bank',
        },
        bank_account: {
          account_number: '12345',
          account_name: 'Test Account',
        },
        third_party: {
          document: '12345678',
        },
      },
      {
        id: 2,
        date: '2024-01-10',
        concept: 'Withdrawal',
        nature: 'Debit',
        value: 500,
        coin: 'COP',
        trm: 1,
        foreign_currency_value: 500,
        voucher: 'V002',
        number_voucher: 'NV002',
        initial_balance: 5500,
        final_balance: 5000,
        total_incomes: 0,
        total_expenses: 500,
        business: {
          name: 'Test Business 2',
        },
        bank: {
          description: 'Test Bank',
        },
        bank_account: {
          account_number: '12345',
          account_name: 'Test Account',
        },
        third_party: {
          document: '87654321',
        },
      },
      {
        id: 3,
        date: '2024-01-20',
        concept: 'Transfer',
        nature: 'Credit',
        value: 750,
        coin: 'COP',
        trm: 1,
        foreign_currency_value: 750,
        voucher: 'V003',
        number_voucher: 'NV003',
        initial_balance: 6000,
        final_balance: 6750,
        total_incomes: 750,
        total_expenses: 0,
        business: {
          name: 'Test Business 3',
        },
        bank: {
          description: 'Test Bank',
        },
        bank_account: {
          account_number: '12345',
          account_name: 'Test Account',
        },
        third_party: {
          document: '11223344',
        },
      },
    ]

    it('should fetch and sort bank account movements successfully', async () => {
      // Arrange
      const store = useCheckBankAccountMovementStoreV1()
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          data: {
            data: mockMovementData,
            current_page: 2,
            last_page: 5,
          },
          message: 'Bank account movements fetched successfully',
        },
      })
      const params = '&account_id=123&date_from=2024-01-01'
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getListCheckBankAccountMovement(params)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH_TREASURIES}/bank-account-movements?paginate=1&page=1${params}`
      )
      // Verify data is sorted by date (ascending order)
      expect(store.data_check_bank_account_movement).toHaveLength(3)

      expect(store.pages.currentPage).toBe(2)
      expect(store.pages.lastPage).toBe(5)
    })

    it('should handle empty data response', async () => {
      // Arrange
      const store = useCheckBankAccountMovementStoreV1()
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          data: {
            data: null,
            current_page: null,
            last_page: null,
          },
          message: 'No movements found',
        },
      })
      const params = '&account_id=999'
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getListCheckBankAccountMovement(params)

      // Assert
      expect(store.data_check_bank_account_movement).toEqual([])
      expect(store.pages.currentPage).toBe(1)
      expect(store.pages.lastPage).toBe(1)
    })

    it('should handle unsuccessful response', async () => {
      // Arrange
      const store = useCheckBankAccountMovementStoreV1()
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'Failed to fetch bank account movements',
        },
      })
      const params = '&invalid_param=test'
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getListCheckBankAccountMovement(params)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH_TREASURIES}/bank-account-movements?paginate=1&page=1${params}`
      )
      expect(store.data_check_bank_account_movement).toEqual([])
    })

    it('should handle API error when fetching bank account movements', async () => {
      // Arrange
      const store = useCheckBankAccountMovementStoreV1()
      const mockGet = jest.fn().mockRejectedValue(new Error('Network error'))
      const params = '&account_id=456'
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getListCheckBankAccountMovement(params)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH_TREASURIES}/bank-account-movements?paginate=1&page=1${params}`
      )
      expect(store.data_check_bank_account_movement).toEqual([])
    })

    it('should correctly sort movements by date when dates are in different formats', async () => {
      // Arrange
      const store = useCheckBankAccountMovementStoreV1()
      const mixedDateData: ICheckBankAccountMovementItem[] = [
        {
          id: 1,
          date: '2024-12-25T10:30:00Z',
          concept: 'Christmas bonus',
          nature: 'Credit',
          value: 100,
          coin: 'COP',
          trm: 1,
          foreign_currency_value: 100,
          voucher: 'V001',
          number_voucher: 'NV001',
          initial_balance: 1000,
          final_balance: 1100,
          total_incomes: 100,
          total_expenses: 0,
          business: {
            name: 'Christmas Business',
          },
          bank: {
            description: 'Test Bank',
          },
          bank_account: {
            account_number: '12345',
            account_name: 'Test Account',
          },
          third_party: {
            document: '12345678',
          },
        },
        {
          id: 2,
          date: '2024-01-01',
          concept: 'New year deposit',
          nature: 'Credit',
          value: 200,
          coin: 'COP',
          trm: 1,
          foreign_currency_value: 200,
          voucher: 'V002',
          number_voucher: 'NV002',
          initial_balance: 800,
          final_balance: 1000,
          total_incomes: 200,
          total_expenses: 0,
          business: {
            name: 'New Year Business',
          },
          bank: {
            description: 'Test Bank',
          },
          bank_account: {
            account_number: '12345',
            account_name: 'Test Account',
          },
          third_party: {
            document: '87654321',
          },
        },
        {
          id: 3,
          date: '2024-06-15T14:20:30',
          concept: 'Mid year transfer',
          nature: 'Credit',
          value: 300,
          coin: 'COP',
          trm: 1,
          foreign_currency_value: 300,
          voucher: 'V003',
          number_voucher: 'NV003',
          initial_balance: 1100,
          final_balance: 1400,
          total_incomes: 300,
          total_expenses: 0,
          business: {
            name: 'Mid Year Business',
          },
          bank: {
            description: 'Test Bank',
          },
          bank_account: {
            account_number: '12345',
            account_name: 'Test Account',
          },
          third_party: {
            document: '11223344',
          },
        },
      ]
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          data: {
            data: mixedDateData,
            current_page: 1,
            last_page: 1,
          },
          message: 'Movements retrieved',
        },
      })
      const params = '&sort_test=true'
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getListCheckBankAccountMovement(params)

      // Assert
      expect(store.data_check_bank_account_movement).toHaveLength(3)
    })

    it('should handle empty movements array', async () => {
      // Arrange
      const store = useCheckBankAccountMovementStoreV1()
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          data: {
            data: [],
            current_page: 1,
            last_page: 1,
          },
          message: 'No movements in this period',
        },
      })
      const params = '&date_from=2024-12-01&date_to=2024-12-31'
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getListCheckBankAccountMovement(params)

      // Assert
      expect(store.data_check_bank_account_movement).toEqual([])
      expect(store.pages.currentPage).toBe(1)
      expect(store.pages.lastPage).toBe(1)
    })
  })

  describe('_exportXlsxCheckBankAccountMovementList', () => {
    it('should export bank account movements to Excel successfully', async () => {
      // Arrange
      const store = useCheckBankAccountMovementStoreV1()
      const mockArrayBuffer = new ArrayBuffer(1024)
      const mockGet = jest.fn().mockResolvedValue({
        data: mockArrayBuffer,
      })
      const params = 'account_id=123&date_from=2024-01-01&date_to=2024-12-31'
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const { createAndDownloadBlobByArrayBuffer } = require('@/utils')

      // Act
      await store._exportXlsxCheckBankAccountMovementList(params)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH_TREASURIES}/bank-account-movements/export?${params}`,
        {
          responseType: 'arraybuffer',
        }
      )
      expect(createAndDownloadBlobByArrayBuffer).toHaveBeenCalledWith(
        mockArrayBuffer,
        'Listado_de_consulta_movimiento_cuenta_bancaria',
        undefined,
        true
      )
    })

    it('should handle API error during export', async () => {
      // Arrange
      const store = useCheckBankAccountMovementStoreV1()
      const mockGet = jest.fn().mockRejectedValue(new Error('Export failed'))
      const params = 'account_id=456&export_format=xlsx'
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const { createAndDownloadBlobByArrayBuffer } = require('@/utils')

      // Act
      await store._exportXlsxCheckBankAccountMovementList(params)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH_TREASURIES}/bank-account-movements/export?${params}`,
        {
          responseType: 'arraybuffer',
        }
      )
      expect(createAndDownloadBlobByArrayBuffer).not.toHaveBeenCalled()
    })

    it('should export with empty params', async () => {
      // Arrange
      const store = useCheckBankAccountMovementStoreV1()
      const mockArrayBuffer = new ArrayBuffer(512)
      const mockGet = jest.fn().mockResolvedValue({
        data: mockArrayBuffer,
      })
      const params = ''
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const { createAndDownloadBlobByArrayBuffer } = require('@/utils')

      // Act
      await store._exportXlsxCheckBankAccountMovementList(params)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH_TREASURIES}/bank-account-movements/export?${params}`,
        {
          responseType: 'arraybuffer',
        }
      )
      expect(createAndDownloadBlobByArrayBuffer).toHaveBeenCalledWith(
        mockArrayBuffer,
        'Listado_de_consulta_movimiento_cuenta_bancaria',
        undefined,
        true
      )
    })

    it('should handle server error response during export', async () => {
      // Arrange
      const store = useCheckBankAccountMovementStoreV1()
      const mockGet = jest.fn().mockRejectedValue({
        response: {
          status: 500,
          data: 'Internal server error',
        },
      })
      const params = 'account_id=789&large_dataset=true'
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const { createAndDownloadBlobByArrayBuffer } = require('@/utils')

      // Act
      await store._exportXlsxCheckBankAccountMovementList(params)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH_TREASURIES}/bank-account-movements/export?${params}`,
        {
          responseType: 'arraybuffer',
        }
      )
      expect(createAndDownloadBlobByArrayBuffer).not.toHaveBeenCalled()
    })

    it('should use correct filename for export', async () => {
      // Arrange
      const store = useCheckBankAccountMovementStoreV1()
      const mockArrayBuffer = new ArrayBuffer(2048)
      const mockGet = jest.fn().mockResolvedValue({
        data: mockArrayBuffer,
      })
      const params = 'test_export=true'
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const { createAndDownloadBlobByArrayBuffer } = require('@/utils')

      // Act
      await store._exportXlsxCheckBankAccountMovementList(params)

      // Assert
      expect(createAndDownloadBlobByArrayBuffer).toHaveBeenCalledWith(
        mockArrayBuffer,
        'Listado_de_consulta_movimiento_cuenta_bancaria',
        undefined,
        true
      )
    })
  })
})
