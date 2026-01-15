// pinia
import { setActivePinia, createPinia } from 'pinia'

// interfaces
import {
  ITaxMatrixItem,
  ITaxMatrixUpdatePayload,
  TaxTypeEnum,
} from '@/interfaces/customs/accounts-payable/TaxMatrix'

// constants
import { URL_PATH_ACCOUNTS_PAYABLE } from '@/constants/apis'

// store
import { useTaxMatrixStoreV1 } from '@/stores/accounts-payable/tax-matrix/tax-matrix-v1'

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

describe('useTaxMatrixStoreV1', () => {
  let store: ReturnType<typeof useTaxMatrixStoreV1>
  const url = `${URL_PATH_ACCOUNTS_PAYABLE}/tax-matrix`

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useTaxMatrixStoreV1()
    jest.clearAllMocks()
  })

  describe('_getTaxMatrixList', () => {
    it('fetches tax matrix list successfully', async () => {
      const mockList: ITaxMatrixItem[] = [
        {
          id: 1,
          tax_type: TaxTypeEnum.RFT,
          tax_type_label: 'Retención en la fuente',
          rows: [
            {
              third_obligation: 'OBL001',
              columns: { 'NIT001': true, 'NIT002': false },
            },
          ],
          created_at: '2025-01-01',
          updated_at: '2025-01-02',
        },
        {
          id: 2,
          tax_type: TaxTypeEnum.RIV,
          tax_type_label: 'Retención de IVA',
          rows: [
            {
              third_obligation: 'OBL002',
              columns: { 'NIT003': true },
            },
          ],
          created_at: '2025-01-01',
          updated_at: '2025-01-02',
        },
      ]

      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Lista obtenida',
          data: { data: mockList },
        },
      })

      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      await store._getTaxMatrixList()

      expect(mockGet).toHaveBeenCalledWith(url)
      expect(store.tax_matrices_list).toEqual(mockList)
    })

    it('handles error when fetching tax matrix list', async () => {
      const mockGet = jest.fn().mockRejectedValue(new Error('Error de red'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      await store._getTaxMatrixList()

      expect(store.tax_matrices_list).toEqual([])
    })
  })

  describe('_getTaxMatrixByType', () => {
    it('fetches tax matrix by type successfully', async () => {
      const mockMatrix: ITaxMatrixItem = {
        id: 1,
        tax_type: TaxTypeEnum.RFT,
        tax_type_label: 'Retención en la fuente',
        rows: [
          {
            third_obligation: 'OBL001',
            columns: { 'NIT001': true, 'NIT002': false },
          },
        ],
        created_at: '2025-01-01',
        updated_at: '2025-01-02',
      }

      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Registro obtenido',
          data: mockMatrix,
        },
      })

      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      await store._getTaxMatrixByType('RFT')

      expect(mockGet).toHaveBeenCalledWith(`${url}/RFT`)
      expect(store.tax_matrix_response).toEqual(mockMatrix)
    })

    it('handles error when fetching tax matrix by type', async () => {
      const mockGet = jest.fn().mockRejectedValue(new Error('Error al obtener'))
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      await store._getTaxMatrixByType('RFT')

      expect(store.tax_matrix_response).toBeNull()
    })
  })

  describe('_updateTaxMatrix', () => {
    it('updates tax matrix successfully', async () => {
      const payload: ITaxMatrixUpdatePayload = {
        combinations: [
          {
            third_obligation: 'OBL001',
            nit_obligation: 'NIT001',
            applies: 'true',
          },
          {
            third_obligation: 'OBL001',
            nit_obligation: 'NIT002',
            applies: 'false',
          },
        ],
      }

      const mockPut = jest.fn().mockResolvedValue({
        data: { success: true, message: 'Actualizado correctamente' },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      const result = await store._updateTaxMatrix('RFT', payload)

      expect(mockPut).toHaveBeenCalledWith(`${url}/RFT`, payload)
      expect(result).toBe(true)
    })

    it('handles error when updating tax matrix', async () => {
      const mockPut = jest
        .fn()
        .mockRejectedValue(new Error('Error al actualizar'))
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      const result = await store._updateTaxMatrix(
        'RFT',
        {} as ITaxMatrixUpdatePayload
      )

      expect(result).toBe(false)
    })

    it('returns false when update is not successful', async () => {
      const payload: ITaxMatrixUpdatePayload = {
        combinations: [
          {
            third_obligation: 'OBL001',
            nit_obligation: 'NIT001',
            applies: 'true',
          },
        ],
      }

      const mockPut = jest.fn().mockResolvedValue({
        data: { success: false, message: 'Error en actualización' },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

      const result = await store._updateTaxMatrix('RFT', payload)

      expect(result).toBe(false)
    })
  })

  describe('getMatrixByType', () => {
    it('returns matrix when found', () => {
      const mockList: ITaxMatrixItem[] = [
        {
          id: 1,
          tax_type: TaxTypeEnum.RFT,
          tax_type_label: 'Retención en la fuente',
          rows: [
            {
              third_obligation: 'OBL001',
              columns: { 'NIT001': true },
            },
          ],
        },
        {
          id: 2,
          tax_type: TaxTypeEnum.RIV,
          tax_type_label: 'Retención de IVA',
          rows: [
            {
              third_obligation: 'OBL002',
              columns: { 'NIT003': true },
            },
          ],
        },
      ]

      store.tax_matrices_list = mockList

      const result = store.getMatrixByType('RFT')

      expect(result).toEqual(mockList[0])
    })

    it('returns undefined when matrix not found', () => {
      const mockList: ITaxMatrixItem[] = [
        {
          id: 1,
          tax_type: TaxTypeEnum.RFT,
          tax_type_label: 'Retención en la fuente',
          rows: [
            {
              third_obligation: 'OBL001',
              columns: { 'NIT001': true },
            },
          ],
        },
      ]

      store.tax_matrices_list = mockList

      const result = store.getMatrixByType('RIC')

      expect(result).toBeUndefined()
    })

    it('returns undefined when list is empty', () => {
      store.tax_matrices_list = []

      const result = store.getMatrixByType('RFT')

      expect(result).toBeUndefined()
    })
  })
})