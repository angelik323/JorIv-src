// Pinia - Apis
import { setActivePinia, createPinia } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces - Constants
import { URL_PATH_ACCOUNTS_PAYABLE } from '@/constants/apis'

// Stores
import { useAccountsPayableNotificationsStoreV1 } from '@/stores/accounts-payable/accounts-payable-notifications/accounts-payable-notifications-v1'

const URL_PATH = `${URL_PATH_ACCOUNTS_PAYABLE}/notifications`

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  })),
}))

jest.mock('@/composables', () => {
  const showAlertMock = jest.fn()
  const showCatchErrorMock = jest.fn()

  const useAlert = jest.fn(() => ({ showAlert: showAlertMock }))
  const useShowError = jest.fn(() => ({ showCatchError: showCatchErrorMock }))

  return { useAlert, useShowError, showAlertMock, showCatchErrorMock }
})

const mockAccountsPayableNotificationPayload = {
  module: 'accounts_payable',
  process: 'invoice_processing',
  sub_process: 'approval',
  recipients: [12, 34],
  channels: ['email', 'sms'],
  message: 'Reunion de aprobacion de facturas',
  has_businesses: true,
  business_type_ids: [1, 2],
  business_sub_type_ids: [10, 20],
  selected_business_trust: [],
}

const accountsPayableNotificationId = 4

describe('useAccountsPayableNotificationsStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  describe('_getAccountsPayableNotificationsList', () => {
    const filters = {
      paginate: 1,
      order_by: 'id,desc',
      'filter[business_type_ids]': 7,
      'filter[module]': 'accounts_payable',
      'filter[status_id]': 12,
    }

    const params = {
      ...filters,
    }
    it('should fetch accounts payable notifications list and update state on success', async () => {
      // Arrange
      const store = useAccountsPayableNotificationsStoreV1()

      const mockResponse = {
        data: {
          data: {
            data: [
              {
                id: 1,
                module: {
                  id: 1,
                  name: 'Accounts Payable',
                },
                process: {
                  id: 1,
                  name: 'Payment Processing',
                },
                sub_process: {
                  id: 1,
                  name: 'Invoice Review',
                },
                recipients: [
                  {
                    id: 1,
                    name: 'Finance Manager',
                  },
                  {
                    id: 2,
                    name: 'Approver',
                  },
                ],
                channels: [
                  {
                    id: 1,
                    name: 'Email',
                  },
                  {
                    id: 2,
                    name: 'SMS',
                  },
                ],
                message: 'New invoice pending approval',
                has_businesses: true,
                business_trust_ids: [
                  {
                    id: 1,
                    name: 'Trust Business 1',
                  },
                  {
                    id: 2,
                    name: 'Trust Business 2',
                  },
                ],
                business_type_ids: [
                  {
                    id: 1,
                    name: 'Type A',
                    indice: 1,
                  },
                  {
                    id: 2,
                    name: 'Type B',
                    indice: 2,
                  },
                ],
                business_sub_type_ids: [
                  {
                    id: 1,
                    name: 'SubType A1',
                    indice: 1,
                  },
                ],
                status: {
                  id: 1,
                  name: 'Active',
                },
              },
            ],
            current_page: 1,
            last_page: 1,
          },
          message: 'Listado obtenido exitosamente.',
          success: true,
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      const result = await store._getAccountsPayableNotificationsList(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}`, {
        params: params,
      })
      expect(result?.list).toEqual(mockResponse.data.data.data)
    })

    it('should handle error when fetching accounts payable notifications list', async () => {
      // Arrange
      const store = useAccountsPayableNotificationsStoreV1()
      const mockError = new Error('Network Error')
      const mockGet = jest.fn().mockRejectedValue(mockError)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      // Act
      const result = await store._getAccountsPayableNotificationsList(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}`, {
        params: params,
      })
      expect(result).toEqual(null)
    })

    it('should handle response.data as undefined when fetching accounts payable notifications list', async () => {
      // Arrange
      const store = useAccountsPayableNotificationsStoreV1()
      const mockResponse = { data: undefined }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      // Act
      const result = await store._getAccountsPayableNotificationsList(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}`, {
        params: params,
      })
      expect(result).toEqual(null)
    })

    it('should handle response.data as null when fetching accounts payable notifications list', async () => {
      // Arrange
      const store = useAccountsPayableNotificationsStoreV1()
      const mockResponse = { data: null }
      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      // Act
      const result = await store._getAccountsPayableNotificationsList(filters)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}`, {
        params: filters,
      })
      expect(result).toEqual(null)
    })
  })

  describe('_toggleAccountsPayableNotificationsStatus', () => {
    it('should update a new third parties successfully', async () => {
      // Arrange
      const store = useAccountsPayableNotificationsStoreV1()
      const mockPut = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Registro actualizado exitosamente',
          data: [],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ patch: mockPut })

      // Act
      const result = await store._toggleAccountsPayableNotificationStatus(
        accountsPayableNotificationId
      )

      // Assert
      expect(mockPut).toHaveBeenCalledWith(
        `${URL_PATH}/${accountsPayableNotificationId}/toggle-status`
      )
      expect(mockPut).toHaveBeenCalledTimes(1)
      expect(result).toBe(true)
    })

    it('should handle api response success=false', async () => {
      // Arrange
      const store = useAccountsPayableNotificationsStoreV1()

      const mockPut = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'El registro actualizado.',
          data: [],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ patch: mockPut })

      // Act
      const result = await store._toggleAccountsPayableNotificationStatus(
        accountsPayableNotificationId
      )

      // Assert
      expect(mockPut).toHaveBeenCalledWith(
        `${URL_PATH}/${accountsPayableNotificationId}/toggle-status`
      )
      expect(result).toBe(false)
    })

    it('should handle api peticion fails', async () => {
      // Arrange
      const store = useAccountsPayableNotificationsStoreV1()

      const mockPut = jest.fn().mockRejectedValue(new Error('Network error'))
      ;(executeApi as jest.Mock).mockReturnValue({ patch: mockPut })

      // Act
      const result = await store._toggleAccountsPayableNotificationStatus(
        accountsPayableNotificationId
      )

      // Assert
      expect(mockPut).toHaveBeenCalledWith(
        `${URL_PATH}/${accountsPayableNotificationId}/toggle-status`
      )
      expect(result).toBe(false)
    })
  })

  describe('_deleteAccountsPayableNotification', () => {
    it('should delete accounts payable notifications', async () => {
      // Arrange
      const store = useAccountsPayableNotificationsStoreV1()
      const mockDelete = jest.fn().mockResolvedValue({
        success: true,
        data: null,
        message: 'Registro eliminado exitosamente.',
      })
      ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

      // Act
      await store._deleteAccountsPayableNotification(
        accountsPayableNotificationId
      )

      // Assert
      expect(mockDelete).toHaveBeenCalledWith(
        `${URL_PATH}/${accountsPayableNotificationId}`
      )
      expect(mockDelete).toHaveBeenCalledTimes(1)
    })

    it('should handle error deleting accounts payable notification', async () => {
      // Arrange
      const store = useAccountsPayableNotificationsStoreV1()
      const mockDelete = jest.fn().mockResolvedValue({
        success: true,
        data: null,
        message: 'Error al eliminar el registro.',
      })
      ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

      // Act
      const result = await store._deleteAccountsPayableNotification(
        accountsPayableNotificationId
      )

      // Assert
      expect(mockDelete).toHaveBeenCalledWith(
        `${URL_PATH}/${accountsPayableNotificationId}`
      )
      expect(result).toBe(false)
    })
  })

  describe('_createAccountsPayableNotification', () => {
    it('should create a new accounts payable notification income successfully', async () => {
      // Arrange
      const store = useAccountsPayableNotificationsStoreV1()
      const mockPost = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Created',
          data: [],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      await store._createAccountsPayableNotification(
        mockAccountsPayableNotificationPayload
      )

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH}`,
        mockAccountsPayableNotificationPayload
      )
      expect(mockPost).toHaveBeenCalledTimes(1)
    })

    it('should handle error creating a new accounts payable notification income successfully', async () => {
      // Arrange
      const store = useAccountsPayableNotificationsStoreV1()

      const mockPost = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'El registro no pudo ser creado.',
          data: [],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._createAccountsPayableNotification(
        mockAccountsPayableNotificationPayload
      )

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH}`,
        mockAccountsPayableNotificationPayload
      )
      expect(result).toBe(false)
    })
  })

  describe('_getAccountsPayableNotificationById', () => {
    it('should fetch accounts payable notifications by id and update state on success', async () => {
      // Arrange
      const store = useAccountsPayableNotificationsStoreV1()

      const mockResponse = {
        data: {
          data: {
            id: 1,
            module: {
              id: 1,
              name: 'Accounts Payable',
            },
            process: {
              id: 1,
              name: 'Payment Processing',
            },
            sub_process: {
              id: 1,
              name: 'Invoice Review',
            },
            recipients: [
              {
                id: 1,
                name: 'Finance Manager',
              },
              {
                id: 2,
                name: 'Approver',
              },
            ],
            channels: [
              {
                id: 1,
                name: 'Email',
              },
              {
                id: 2,
                name: 'SMS',
              },
            ],
            message: 'New invoice pending approval',
            has_businesses: true,
            business_trust_ids: [
              {
                id: 1,
                name: 'Trust Business 1',
              },
              {
                id: 2,
                name: 'Trust Business 2',
              },
            ],
            business_type_ids: [
              {
                id: 1,
                name: 'Type A',
                indice: 1,
              },
              {
                id: 2,
                name: 'Type B',
                indice: 2,
              },
            ],
            business_sub_type_ids: [
              {
                id: 1,
                name: 'SubType A1',
                indice: 1,
              },
            ],
            status: {
              id: 1,
              name: 'Active',
            },
          },
          message: 'Registro obtenido exitosamente.',
          success: true,
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      const response = await store._getAccountsPayableNotificationById(
        accountsPayableNotificationId
      )

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/${accountsPayableNotificationId}`
      )
      expect(response).toEqual(mockResponse.data.data)
    })

    it('should handle error when fetching accounts payable notifications by id', async () => {
      // Arrange
      const store = useAccountsPayableNotificationsStoreV1()

      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'No se encontro el registro.',
          data: [],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
      // Act
      const response = await store._getAccountsPayableNotificationById(
        accountsPayableNotificationId
      )

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH}/${accountsPayableNotificationId}`
      )
      expect(response).toEqual(null)
    })
  })

  describe('_updateAccountsPayableNotification', () => {
    it('should update a new accounts payable notification income successfully', async () => {
      // Arrange
      const store = useAccountsPayableNotificationsStoreV1()
      const mockPut = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Registro actualizado exitosamente',
          data: [],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      // Act
      const result = await store._updateAccountsPayableNotification(
        mockAccountsPayableNotificationPayload,
        accountsPayableNotificationId
      )

      // Assert
      expect(mockPut).toHaveBeenCalledWith(
        `${URL_PATH}/${accountsPayableNotificationId}`,
        mockAccountsPayableNotificationPayload
      )
      expect(mockPut).toHaveBeenCalledTimes(1)
      expect(result).toBe(true)
    })

    it('should handle error updating a accounts payable notification successfully', async () => {
      // Arrange
      const store = useAccountsPayableNotificationsStoreV1()

      const mockPut = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'El registro actualizado.',
          data: [],
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      // Act
      const result = await store._updateAccountsPayableNotification(
        mockAccountsPayableNotificationPayload,
        accountsPayableNotificationId
      )

      // Assert
      expect(mockPut).toHaveBeenCalledWith(
        `${URL_PATH}/${accountsPayableNotificationId}`,
        mockAccountsPayableNotificationPayload
      )
      expect(result).toBe(false)
    })
  })
})
