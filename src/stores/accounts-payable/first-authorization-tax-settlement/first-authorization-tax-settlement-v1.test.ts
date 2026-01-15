// pinia
import { setActivePinia, createPinia } from 'pinia'

// interfaces
import {
  IFirstAuthorizationTaxSettlementItem,
  IFirstAuthorizationTaxSettlementFilters,
} from '@/interfaces/customs/accounts-payable/FirstAuthorizationTaxSettlement'

// constants
import { URL_PATH_ACCOUNTS_PAYABLE } from '@/constants/apis'

// store
import { useFirstAuthorizationTaxSettlementStoreV1 } from '@/stores/accounts-payable/first-authorization-tax-settlement/first-authorization-tax-settlement-v1'

// api
import { executeApi } from '@/apis'

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

describe('useFirstAuthorizationTaxSettlementStoreV1', () => {
  let store: ReturnType<typeof useFirstAuthorizationTaxSettlementStoreV1>
  const url = `${URL_PATH_ACCOUNTS_PAYABLE}/first-authorization-tax-settlement-generation`

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useFirstAuthorizationTaxSettlementStoreV1()
    jest.clearAllMocks()
  })

  describe('_getFirstAuthorizationTaxSettlementList', () => {
    it('fetches first authorization tax settlement list successfully', async () => {
      const mockList: IFirstAuthorizationTaxSettlementItem[] = [
        {
          id: 1,
          office: {
            id: 10,
            office_code: 'OFF001',
            office_description: 'Oficina Principal',
          },
          business_trust: {
            id: 20,
            business_code: 'BUS001',
            name: 'Fideicomiso Test',
          },
          has_payment_instruction: true,
          payment_instruction: 'INS001',
          payment_instructions: [
            {
              details: [
                {
                  instruction_number: 12345,
                },
              ],
            },
          ],
          request_number: 'REQ001',
          request_status: {
            id: 1,
            name: 'Pendiente',
          },
          authorization_status: {
            id: 1,
            name: 'Por autorizar',
          },
        },
      ]

      const filters: IFirstAuthorizationTaxSettlementFilters = {
        'filter[office_id]': 10,
        'filter[orpa_authorization_status_id]': 1,
      }

      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Lista obtenida',
          data: mockList,
          current_page: 2,
          last_page: 5,
        },
      })

      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const result = await store._getFirstAuthorizationTaxSettlementList(
        filters as Record<string, string | number>
      )

      expect(mockGet).toHaveBeenCalledWith(url, {
        params: filters,
      })
      expect(result.data).toEqual(mockList)
      expect(result.pages).toEqual({
        currentPage: 2,
        lastPage: 5,
      })
    })

    it('handles error when fetching list', async () => {
      const mockGet = jest.fn().mockRejectedValue(new Error('Error de red'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const result = await store._getFirstAuthorizationTaxSettlementList({})

      expect(result.data).toEqual([])
      expect(result.pages).toEqual({
        currentPage: 1,
        lastPage: 1,
      })
    })

    it('handles response without pagination data', async () => {
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Lista obtenida',
          data: [],
        },
      })

      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const result = await store._getFirstAuthorizationTaxSettlementList({})

      expect(result.pages).toEqual({
        currentPage: 1,
        lastPage: 1,
      })
    })
  })

  describe('_getFirstAuthorizationTaxSettlementShow', () => {
    it('fetches first authorization tax settlement by ID successfully', async () => {
      const mockData = {
        id: 1,
        office_code: 'OFF001',
        office_description: 'Oficina Principal',
        from_business: 'BUS001',
        from_business_name: 'Fideicomiso Origen',
        to_business: 'BUS002',
        to_business_name: 'Fideicomiso Destino',
        payment_request_number: 'REQ001',
        authorization_status: 'Por autorizar',
        payment_details: [],
        payment_instructions: [],
        liquidations: [],
      }

      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Registro obtenido',
          data: mockData,
        },
      })

      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const result = await store._getFirstAuthorizationTaxSettlementShow(1)

      expect(mockGet).toHaveBeenCalledWith(`${url}/1`)
      expect(result.data).toEqual(mockData)
    })

    it('handles error when fetching by ID', async () => {
      const mockGet = jest.fn().mockRejectedValue(new Error('Error al obtener'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const result = await store._getFirstAuthorizationTaxSettlementShow(1)

      expect(result.data).toBeNull()
    })

    it('handles response with null data', async () => {
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'No encontrado',
          data: null,
        },
      })

      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      const result = await store._getFirstAuthorizationTaxSettlementShow(999)

      expect(result.data).toBeNull()
    })
  })

  describe('_authorizeOrRejectFirstAuthorization', () => {
    it('authorizes successfully', async () => {
      const payload = {
        payment_request_id: 1,
        action: 'authorize',
        observations: 'Aprobado',
      }

      const mockPost = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Autorización exitosa',
        },
      })

      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const result = await store._authorizeOrRejectFirstAuthorization(payload)

      expect(mockPost).toHaveBeenCalledWith(url, payload)
      expect(result).toBe(true)
    })

    it('rejects successfully', async () => {
      const payload = {
        payment_request_id: 1,
        action: 'reject',
        observations: 'Rechazado por inconsistencias',
      }

      const mockPost = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Rechazo exitoso',
        },
      })

      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const result = await store._authorizeOrRejectFirstAuthorization(payload)

      expect(result).toBe(true)
    })

    it('handles error when authorizing or rejecting', async () => {
      const mockPost = jest
        .fn()
        .mockRejectedValue(new Error('Error al procesar'))
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const result = await store._authorizeOrRejectFirstAuthorization({})

      expect(result).toBe(false)
    })

    it('returns false when operation is not successful', async () => {
      const payload = {
        payment_request_id: 1,
        action: 'authorize',
      }

      const mockPost = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: 'Error en autorización',
        },
      })

      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      const result = await store._authorizeOrRejectFirstAuthorization(payload)

      expect(result).toBe(false)
    })
  })
})
