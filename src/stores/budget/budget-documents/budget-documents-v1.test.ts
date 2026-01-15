import { createPinia, setActivePinia } from 'pinia'
import { executeApi } from '@/apis'
import { useBudgetDocumentsStoreV1 } from './budget-documents-v1'
import {
  IBudgetBalanceListItem,
  IBudgetDocumentDetailsListItem,
  IBudgetDocumentsAccountingVoucherListItem,
  IBudgetDocumentsAssociatedListItem,
  IBudgetDocumentsListItem,
  IBudgetDocumentsPaymentOrderListItem,
} from '@/interfaces/customs/budget/BudgetDocuments'
import { URL_PATH_BUDGET } from '@/constants/apis'

const URL_PATH_BUDGET_DOCUMENTS = `${URL_PATH_BUDGET}/budget-documents-management`

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
  })),
}))

jest.mock('@/composables', () => {
  const showAlert = jest.fn()
  const showCatchError = jest.fn(() => 'Error')
  const getNameBlob = jest.fn(() => 'test-file.xlsx')
  const downloadBlobXlxx = jest.fn()

  return {
    useAlert: () => ({ showAlert }),
    useShowError: () => ({ showCatchError }),
    useUtils: () => ({
      getNameBlob,
      downloadBlobXlxx,
    }),
  }
})

describe('useBudgetDocumentsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  describe('_getDocumentsList', () => {
    it('should fetch a list of budget documents', async () => {
      // Arrange
      const store = useBudgetDocumentsStoreV1()

      const mockResponse = {
        data: {
          success: true,
          message: 'Listado obtenido exitosamente',
          data: {
            data: [
              {
                id: 1,
                business_trust: {
                  id: 10,
                  code: 'BT-001',
                  name: 'Fideicomiso General',
                },
                vigency: 2025,
                date: '2025-11-15',
                budget_document_type: {
                  id: 3,
                  code: 'CDP',
                  description: 'Certificado de Disponibilidad Presupuestal',
                },
                budget_document_number: 4521,
                addition: false,
                operation_log_document: {
                  id: 99,
                  observations: 'Documento generado automáticamente',
                },
                responsability_area: {
                  id: 7,
                  code: 'AR-07',
                  description: 'Área de Presupuesto',
                },
                city: {
                  id: 11001,
                  name: 'Bogotá',
                },
                third_party: {
                  id: 501,
                  document: '900123456',
                  name: null,
                  legal_person: {
                    business_name: 'Empresa Ejemplo S.A.',
                  },
                  natural_person: null,
                },
                value: '15000000.50',
                observations: 'Observaciones de prueba',
                status: {
                  id: 1,
                  status: 'Aprobado',
                  comments: null,
                },
                has_operation_log: false,
                has_order_payment: false,
                has_accounting: false,
              },
            ] as IBudgetDocumentsListItem[],
            current_page: 1,
            last_page: 4,
          },
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const servicePayload = {
        page: 1,
        rows: 20,
        'filter[validity]': 2025,
      }

      // Act
      const resp = await store._getDocumentsList(servicePayload)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH_BUDGET_DOCUMENTS}/list`,
        { params: { ...servicePayload, paginate: true } }
      )
      expect(resp.list).toHaveLength(1)
      expect(resp.list).toBe(mockResponse.data.data.data)
      expect(resp.pages.currentPage).toBe(1)
      expect(resp.pages.lastPage).toBe(4)
    })

    it('should handle error when trying to fetch a list of budget documents ', async () => {
      // Arrange
      const store = useBudgetDocumentsStoreV1()
      const mockErr = new Error('Network Error')

      const mockGet = jest.fn().mockRejectedValue(mockErr)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const servicePayload = {
        page: 1,
        rows: 20,
      }

      const { useAlert } = jest.requireMock('@/composables')
      const { showAlert } = useAlert()

      // Act
      const resp = await store._getDocumentsList(servicePayload)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH_BUDGET_DOCUMENTS}/list`,
        { params: { ...servicePayload, paginate: true } }
      )

      expect(resp.list).toHaveLength(0)
      expect(resp.pages).toEqual({ currentPage: 0, lastPage: 0 })
      expect(showAlert).toHaveBeenCalled()
    })
  })

  describe('_getDocumentById', () => {
    it('should fetch a budget document by id', async () => {
      // Arrange
      const store = useBudgetDocumentsStoreV1()
      const mockResponse = {
        data: {
          data: {
            id: 1,
            business_trust: {
              id: 10,
              code: 'BT-001',
              name: 'Fideicomiso General',
            },
            vigency: 2025,
            date: '2025-11-15',
            budget_document_type: {
              id: 3,
              code: 'CDP',
              description: 'Certificado de Disponibilidad Presupuestal',
            },
            budget_document_number: 4521,
            addition: false,
            operation_log_document: {
              id: 99,
              observations: 'Documento generado automáticamente',
            },
            responsability_area: {
              id: 7,
              code: 'AR-07',
              description: 'Área de Presupuesto',
            },
            city: {
              id: 11001,
              name: 'Bogotá',
            },
            third_party: {
              id: 501,
              document: '900123456',
              name: null,
              legal_person: {
                business_name: 'Empresa Ejemplo S.A.',
              },
              natural_person: null,
            },
            value: '15000000.50',
            observations: 'Observaciones de prueba',
            status: {
              id: 1,
              status: 'Aprobado',
              comments: null,
            },
            has_operation_log: false,
            has_order_payment: false,
            has_accounting: false,
          } as IBudgetDocumentsListItem,
          message: 'Documento obtenido exitosamente',
          success: true,
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      const resp = await store._getDocumentById(1)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH_BUDGET_DOCUMENTS}/show/1`
      )
      expect(resp).toBeTruthy()
      expect(resp).toBe(mockResponse.data.data)
    })

    it('should handle error when trying to fetch a budget document by id ', async () => {
      // Arrange
      const store = useBudgetDocumentsStoreV1()
      const mockErr = new Error('Network Error')

      const mockGet = jest.fn().mockRejectedValue(mockErr)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const { useAlert } = jest.requireMock('@/composables')
      const { showAlert } = useAlert()

      // Act
      const resp = await store._getDocumentById(1)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH_BUDGET_DOCUMENTS}/show/1`
      )
      expect(resp).toBeFalsy()
      expect(showAlert).toHaveBeenCalled()
    })
  })

  describe('_getDocumentDetailsById', () => {
    it('should fetch a budget document details by id', async () => {
      // Arrange
      const store = useBudgetDocumentsStoreV1()

      const mockResponse = {
        data: {
          data: {
            current_page: 1,
            last_page: 5,
            data: [
              {
                id: 1,
                vigency: 2025,
                month: 11,
                day: 15,
                area_responsability: {
                  id: 7,
                  code: 'AR-07',
                  description: 'Área de Presupuesto',
                },
                code_movement: {
                  id: 2,
                  code: 'COMP',
                  description: 'Compromiso Presupuestal',
                },
                budget_item: {
                  id: 45,
                  code: '01',
                  description: 'Servicios profesionales',
                },
                budget_resource: {
                  id: 3,
                  code: 'RP',
                  description: 'Recursos Propios',
                },
                balance: '8500000.00',
              },
            ] as IBudgetDocumentDetailsListItem[],
          },
          message: 'Listado obtenido exitosamente',
          success: true,
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const servicePayload = { operationLogId: 1, page: 1, rows: 20 }

      // Act
      const resp = await store._getDocumentDetailsById(servicePayload)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH_BUDGET_DOCUMENTS}/show-detail/1`,
        { params: { page: 1, rows: 20, paginate: true } }
      )
      expect(resp.list).toHaveLength(1)
      expect(resp.list).toBe(mockResponse.data.data.data)
      expect(resp.pages.currentPage).toBe(1)
      expect(resp.pages.lastPage).toBe(5)
    })

    it('should handle error when trying to fetch document details by id', async () => {
      // Arrange
      const store = useBudgetDocumentsStoreV1()
      const mockErr = new Error('Network Error')

      const mockGet = jest.fn().mockRejectedValue(mockErr)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const { useAlert } = jest.requireMock('@/composables')
      const { showAlert } = useAlert()

      const servicePayload = { operationLogId: 1, page: 1, rows: 20 }

      // Act
      const resp = await store._getDocumentDetailsById(servicePayload)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH_BUDGET_DOCUMENTS}/show-detail/1`,
        { params: { page: 1, rows: 20, paginate: true } }
      )

      expect(resp.list).toHaveLength(0)
      expect(resp.pages).toEqual({ currentPage: 0, lastPage: 0 })
      expect(showAlert).toHaveBeenCalled()
    })
  })

  describe('_getDocumentBalancesById', () => {
    it('should fetch a list of budget document balances by document id', async () => {
      // Arrange
      const store = useBudgetDocumentsStoreV1()

      const mockResponse = {
        data: {
          data: {
            current_page: 2,
            last_page: 3,
            data: [
              {
                id: 1,
                vigency: 2025,
                area_responsibility: {
                  id: 7,
                  code: 'AR-07',
                  description: 'Área de Presupuesto',
                },
                budget_item: {
                  id: 45,
                  code: '2.1.1.01',
                  description: 'Servicios profesionales',
                },
                budget_resource: {
                  id: 3,
                  code: 'RP',
                  description: 'Recursos Propios',
                },
                total_value: 25000000,
              },
            ] as IBudgetBalanceListItem[],
          },
          message: 'Listado obtenido exitosamente',
          success: true,
        },
      }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const servicePayload = { operationLogId: 3, page: 2, rows: 20 }

      // Act
      const resp = await store._getDocumentBalancesById(servicePayload)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH_BUDGET_DOCUMENTS}/show-balance-budget-item/3`,
        { params: { page: 2, rows: 20, paginate: true } }
      )
      expect(resp.list).toHaveLength(1)
      expect(resp.list).toBe(mockResponse.data.data.data)
      expect(resp.pages.currentPage).toBe(2)
      expect(resp.pages.lastPage).toBe(3)
    })

    it('should handle error when trying to fetch a list of budget document balances by document id ', async () => {
      // Arrange
      const store = useBudgetDocumentsStoreV1()
      const mockErr = new Error('Network Error')

      const mockGet = jest.fn().mockRejectedValue(mockErr)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const { useAlert } = jest.requireMock('@/composables')
      const { showAlert } = useAlert()

      const servicePayload = { operationLogId: 3, page: 2, rows: 20 }

      // Act
      const resp = await store._getDocumentBalancesById(servicePayload)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH_BUDGET_DOCUMENTS}/show-balance-budget-item/3`,
        { params: { page: 2, rows: 20, paginate: true } }
      )

      expect(resp.list).toHaveLength(0)
      expect(resp.pages).toEqual({ currentPage: 0, lastPage: 0 })
      expect(showAlert).toHaveBeenCalled()
    })
  })

  describe('_downloadDocumentDetails', () => {
    it('should download a budget document details file', async () => {
      // Arrange
      const store = useBudgetDocumentsStoreV1()

      const mockResponse = {
        data: new Blob(['test data'], { type: 'application/vnd.ms-excel' }),
        headers: { 'content-type': 'application/vnd.ms-excel' },
      }

      const mockPost = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const servicePayload = {
        page: 1,
        rows: 20,
        'filter[validity]': 2025,
      }

      // Act
      await store._downloadDocumentDetails(1, servicePayload)

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH_BUDGET_DOCUMENTS}/budget-document-details-export/1`,
        undefined,
        { responseType: 'blob', params: servicePayload }
      )
    })

    it('should handle error when trying to download a budget document details file', async () => {
      // Arrange
      const store = useBudgetDocumentsStoreV1()
      const { useAlert } = jest.requireMock('@/composables')
      const { showAlert } = useAlert()

      const mockErr = new Error('Network Error')

      const mockPost = jest.fn().mockRejectedValue(mockErr)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const servicePayload = {
        page: 1,
        rows: 20,
        'filter[validity]': 2025,
      }

      // Act
      await store._downloadDocumentDetails(1, servicePayload)

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH_BUDGET_DOCUMENTS}/budget-document-details-export/1`,
        undefined,
        { responseType: 'blob', params: servicePayload }
      )
      expect(showAlert).toHaveBeenCalled()
    })
  })

  describe('_downloadDocument', () => {
    it('should download a budget documents file', async () => {
      // Arrange
      const store = useBudgetDocumentsStoreV1()

      const mockResponse = {
        data: new Blob(['test data'], { type: 'application/vnd.ms-excel' }),
        headers: { 'content-type': 'application/vnd.ms-excel' },
      }

      const mockPost = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const servicePayload = {
        page: 1,
        rows: 20,
        'filter[validity]': 2025,
      }

      // Act
      await store._downloadDocument(servicePayload)

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH_BUDGET_DOCUMENTS}/budget-document-export`,
        undefined,
        { responseType: 'blob', params: servicePayload }
      )
    })

    it('should handle error when trying to download a budget documents file', async () => {
      // Arrange
      const store = useBudgetDocumentsStoreV1()
      const { useAlert } = jest.requireMock('@/composables')
      const { showAlert } = useAlert()

      const mockErr = new Error('Network Error')

      const mockPost = jest.fn().mockRejectedValue(mockErr)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const servicePayload = {
        page: 1,
        rows: 20,
        'filter[validity]': 2025,
      }

      // Act
      await store._downloadDocument(servicePayload)

      // Assert
      expect(mockPost).toHaveBeenCalledWith(
        `${URL_PATH_BUDGET_DOCUMENTS}/budget-document-export`,
        undefined,
        { responseType: 'blob', params: servicePayload }
      )
      expect(showAlert).toHaveBeenCalled()
    })
  })

  describe('_getAssociatedDocumentsById', () => {
    it('should fetch a list of associated documents by documentId', async () => {
      // Arrange
      const store = useBudgetDocumentsStoreV1()
      const mockResponse = {
        data: {
          data: {
            current_page: 1,
            last_page: 1,
            data: [
              {
                id: 1,
                vigency: '2025',
                document_type: {
                  id: 3,
                  name: 'CDP',
                  document_number: 4521,
                },
                balance: '492674.27',
              },
            ] as IBudgetDocumentsAssociatedListItem[],
          },
          message: 'Listado obtenido exitosamente',
          success: true,
        },
      }
      const servicePayload = { documentId: 3, page: 1, rows: 20 }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      const resp = await store._getAssociatedDocumentsById(servicePayload)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH_BUDGET_DOCUMENTS}/show-associated-budget-document/3`,
        { params: { page: 1, rows: 20, paginate: true } }
      )
      expect(resp.list).toHaveLength(1)
      expect(resp.list).toBe(mockResponse.data.data.data)
      expect(resp.pages.currentPage).toBe(1)
      expect(resp.pages.lastPage).toBe(1)
    })

    it('should handle error when trying to fetch a list of associated documents by documentId', async () => {
      // Arrange
      const store = useBudgetDocumentsStoreV1()
      const { useAlert } = jest.requireMock('@/composables')
      const { showAlert } = useAlert()

      const mockErr = new Error('Network Error')
      const mockGet = jest.fn().mockRejectedValue(mockErr)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const servicePayload = { documentId: 3, page: 2, rows: 20 }

      // Act
      const resp = await store._getAssociatedDocumentsById(servicePayload)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH_BUDGET_DOCUMENTS}/show-associated-budget-document/3`,
        { params: { page: 2, rows: 20, paginate: true } }
      )

      expect(resp.list).toHaveLength(0)
      expect(resp.pages).toEqual({ currentPage: 0, lastPage: 0 })
      expect(showAlert).toHaveBeenCalled()
    })
  })

  describe('_getDocumentAccountingVouchers', () => {
    it('should fetch a list of budget document accounting vouchers', async () => {
      // Arrange
      const store = useBudgetDocumentsStoreV1()
      const mockResponse = {
        data: {
          data: {
            current_page: 1,
            last_page: 1,
            data: [
              {
                id: 120,
                date: '2025-11-20',
                period: '2025-11',
                voucher: {
                  code: 'COM',
                  number: '0004589',
                },
              },
            ] as IBudgetDocumentsAccountingVoucherListItem[],
          },
          message: 'Listado obtenido exitosamente',
          success: true,
        },
      }
      const servicePayload = { documentId: 3, page: 1, rows: 20 }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      const resp = await store._getDocumentAccountingVouchers(servicePayload)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH_BUDGET_DOCUMENTS}/show-accounting-voucher/3`,
        { params: { page: 1, rows: 20, paginate: true } }
      )
      expect(resp.list).toHaveLength(1)
      expect(resp.list).toBe(mockResponse.data.data.data)
      expect(resp.pages.currentPage).toBe(1)
      expect(resp.pages.lastPage).toBe(1)
    })

    it('should handle error when trying to fetch a list of budget document accounting vouchers', async () => {
      // Arrange
      const store = useBudgetDocumentsStoreV1()
      const { useAlert } = jest.requireMock('@/composables')
      const { showAlert } = useAlert()

      const mockErr = new Error('Network Error')
      const mockGet = jest.fn().mockRejectedValue(mockErr)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const servicePayload = { documentId: 3, page: 2, rows: 20 }

      // Act
      const resp = await store._getDocumentAccountingVouchers(servicePayload)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH_BUDGET_DOCUMENTS}/show-accounting-voucher/3`,
        { params: { page: 2, rows: 20, paginate: true } }
      )

      expect(resp.list).toHaveLength(0)
      expect(resp.pages).toEqual({ currentPage: 0, lastPage: 0 })
      expect(showAlert).toHaveBeenCalled()
    })
  })

  describe('_getDocumentPaymentOrders', () => {
    it('should fetch a list of budget document payment orders', async () => {
      // Arrange
      const store = useBudgetDocumentsStoreV1()
      const mockResponse = {
        data: {
          data: {
            current_page: 1,
            last_page: 1,
            data: [
              {
                id: 45,
                vigency: '2025',
                date: '2025-11-25',
                payment_order: 'OP-000789',
              },
            ] as IBudgetDocumentsPaymentOrderListItem[],
          },
          message: 'Listado obtenido exitosamente',
          success: true,
        },
      }
      const servicePayload = { documentId: 3, page: 1, rows: 20 }

      const mockGet = jest.fn().mockResolvedValue(mockResponse)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      const resp = await store._getDocumentPaymentOrders(servicePayload)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH_BUDGET_DOCUMENTS}/show-order-payment/3`,
        { params: { page: 1, rows: 20, paginate: true } }
      )
      expect(resp.list).toHaveLength(1)
      expect(resp.list).toBe(mockResponse.data.data.data)
      expect(resp.pages.currentPage).toBe(1)
      expect(resp.pages.lastPage).toBe(1)
    })

    it('should handle error when trying to fetch a list of budget document payment orders', async () => {
      // Arrange
      const store = useBudgetDocumentsStoreV1()
      const { useAlert } = jest.requireMock('@/composables')
      const { showAlert } = useAlert()

      const mockErr = new Error('Network Error')
      const mockGet = jest.fn().mockRejectedValue(mockErr)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const servicePayload = { documentId: 3, page: 2, rows: 20 }

      // Act
      const resp = await store._getDocumentPaymentOrders(servicePayload)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(
        `${URL_PATH_BUDGET_DOCUMENTS}/show-order-payment/3`,
        { params: { page: 2, rows: 20, paginate: true } }
      )

      expect(resp.list).toHaveLength(0)
      expect(resp.pages).toEqual({ currentPage: 0, lastPage: 0 })
      expect(showAlert).toHaveBeenCalled()
    })
  })
})
