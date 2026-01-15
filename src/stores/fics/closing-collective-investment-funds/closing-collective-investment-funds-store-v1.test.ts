import { setActivePinia, createPinia } from 'pinia'
import { useClosingCollectiveInvestmentFundsStoreV1 } from '@/stores/fics/closing-collective-investment-funds/closing-collective-investment-funds-store-v1'
import { IUploadedFile } from '@/interfaces/global'

const mockGet = jest.fn()
const mockPost = jest.fn()

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: mockGet,
    post: mockPost,
  })),
}))

jest.mock('@/composables', () => ({
  useAlert: () => ({
    showAlert: jest.fn(),
  }),
  useShowError: () => ({
    showCatchError: jest.fn().mockReturnValue('Error procesando'),
  }),
  useUtils: () => ({
    downloadBlobXlxx: jest.fn(),
  }),
}))

describe('useClosingCollectiveInvestmentFundsStore', () => {
  let store: ReturnType<typeof useClosingCollectiveInvestmentFundsStoreV1>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useClosingCollectiveInvestmentFundsStoreV1()
    jest.clearAllMocks()
  })

  describe('_listFundsInterval', () => {
    it('should fetch funds interval list successfully', async () => {
      const mockResponse = {
        data: {
          data: [
            {
              id: 1,
              fund_id: 1,
              fund_code: 'F001',
              fund_name: 'Fondo Colectivo Test',
              business_trust: null,
              last_closing_date: '2024-01-01',
              status: {
                id: 76,
                status: 'Validado',
                comments: null,
              },
              has_participation_types: true,
              participation_types: [],
              consolidation_option: {
                id: 1,
                code: 'CO001',
                description: 'Consolidación Test',
                status_id: 1,
                created_at: new Date('2024-01-01'),
                updated_at: new Date('2024-01-01'),
                cancellation_reason: null,
                type: 1,
                deleted_at: null,
              },
              participation_type: null,
            },
          ],
          message: 'Consulta exitosa',
          success: true,
        },
      }

      mockGet.mockResolvedValue(mockResponse)

      const result = await store._listFundsInterval('&filter[test]=value')

      expect(store.collective_investment_funds).toHaveLength(1)
      expect(store.collective_investment_funds[0].fund_code).toBe('F001')
      expect(result).toBe(true)
      expect(mockGet).toHaveBeenCalledWith(
        expect.stringContaining('collective-investment-funds/for-closing')
      )
    })

    it('should return false when response is not successful', async () => {
      const mockResponse = {
        data: {
          data: [],
          message: 'Error en la consulta',
          success: false,
        },
      }

      mockGet.mockResolvedValue(mockResponse)

      const result = await store._listFundsInterval('')

      expect(store.collective_investment_funds).toHaveLength(0)
      expect(result).toBe(false)
    })

    it('should handle error and return false', async () => {
      mockGet.mockRejectedValue(new Error('Network error'))

      const result = await store._listFundsInterval('')

      expect(result).toBe(false)
      expect(store.collective_investment_funds).toHaveLength(0)
    })
  })

  describe('_getMovementCodesCloseList', () => {
    it('should fetch movement codes when forceReload is true', async () => {
      const mockResponse = {
        data: {
          data: [
            {
              id: 1,
              code: 'MC001',
              description: 'Movimiento Test',
              movement_nature_description: 'Naturaleza Test',
            },
            {
              id: 2,
              code: 'MC002',
              description: 'Movimiento Test 2',
              movement_nature_description: 'Naturaleza Test 2',
            },
          ],
          message: 'Consulta exitosa',
          success: true,
        },
      }

      mockGet.mockResolvedValue(mockResponse)

      await store._getMovementCodesCloseList(true)

      expect(store.movement_codes_close_list).toHaveLength(2)
      expect(store.movement_codes_close_list[0].code).toBe('MC001')
    })

    it('should not fetch if list is populated and forceReload is false', async () => {
      store.movement_codes_close_list = [
        {
          id: 1,
          code: 'MC001',
          description: 'Test Movement',
          movement_type: 17,
          movement_type_description: 'Type Test',
          movement_class: 9,
          movement_class_description: 'Class Test',
          movement_natura: 1,
          movement_nature_description: 'Nature Test',
        },
      ]

      await store._getMovementCodesCloseList(false)

      expect(mockGet).not.toHaveBeenCalled()
      expect(store.movement_codes_close_list).toHaveLength(1)
    })

    it('should set empty array when data is null', async () => {
      const mockResponse = {
        data: {
          data: null,
          message: 'No hay datos',
          success: false,
        },
      }

      mockGet.mockResolvedValue(mockResponse)

      await store._getMovementCodesCloseList(true)

      expect(store.movement_codes_close_list).toEqual([])
    })

    it('should handle error in fetch', async () => {
      mockGet.mockRejectedValue(new Error('Error'))

      await store._getMovementCodesCloseList(true)

      expect(mockGet).toHaveBeenCalled()
    })
  })

  describe('_synchronize', () => {
    it('should synchronize successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Sincronización exitosa',
        },
      }

      mockGet.mockResolvedValue(mockResponse)

      const result = await store._synchronize('2024-01-01')

      expect(result).toBe(true)
      expect(mockGet).toHaveBeenCalledWith(
        expect.stringContaining('get-movements-fic/2024-01-01')
      )
    })

    it('should return false when synchronization fails', async () => {
      const mockResponse = {
        data: {
          success: false,
          message: 'Error en sincronización',
        },
      }

      mockGet.mockResolvedValue(mockResponse)

      const result = await store._synchronize('2024-01-01')

      expect(result).toBe(false)
    })

    it('should handle error and return false', async () => {
      mockGet.mockRejectedValue(new Error('Network error'))

      const result = await store._synchronize('2024-01-01')

      expect(result).toBe(false)
    })
  })

  describe('_importBachMovements', () => {
    it('should import batch movements successfully with JSON response', async () => {
      const mockFile: IUploadedFile = {
        __key: 'file-key-123',
        __progress: 0,
        __progressLabel: '0%',
        __sizeLabel: '1 KB',
        __status: 'idle',
        __uploaded: 0,
        lastModified: Date.now(),
        lastModifiedDate: new Date(),
        name: 'test.xlsx',
        size: 1024,
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        webkitRelativePath: '',
      }

      const mockBlob = new Blob(
        [
          JSON.stringify({
            success: true,
            data: { id: 1 },
            message: 'Importación exitosa',
          }),
        ],
        { type: 'application/json' }
      )

      mockBlob.text = jest.fn().mockResolvedValue(
        JSON.stringify({
          success: true,
          data: { id: 1 },
          message: 'Importación exitosa',
        })
      )

      const mockResponse = {
        data: mockBlob,
        headers: {
          'content-type': 'application/json',
        },
      }

      mockPost.mockResolvedValue(mockResponse)

      const result = await store._importBachMovements(mockFile)

      expect(result.success).toBe(true)
      expect(result.data.id).toBe(1)
      expect(mockPost).toHaveBeenCalledWith(
        expect.stringContaining('import-movement-file'),
        { file: mockFile },
        expect.objectContaining({
          responseType: 'blob',
        })
      )
    })

    it('should handle blob response (error file) and return false', async () => {
      const mockFile: IUploadedFile = {
        __key: 'file-key-456',
        __progress: 0,
        __progressLabel: '0%',
        __sizeLabel: '1 KB',
        __status: 'idle',
        __uploaded: 0,
        lastModified: Date.now(),
        lastModifiedDate: new Date(),
        name: 'test.xlsx',
        size: 1024,
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        webkitRelativePath: '',
      }

      const mockBlob = new Blob(['binary data'], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })

      const mockResponse = {
        data: mockBlob,
        headers: {
          'content-type':
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
      }

      mockPost.mockResolvedValue(mockResponse)

      const result = await store._importBachMovements(mockFile)

      expect(result.success).toBe(false)
      expect(result.message).toBe('Error en el archivo')
    })

    it('should handle error and return error object', async () => {
      const mockFile: IUploadedFile = {
        __key: 'file-key-789',
        __progress: 0,
        __progressLabel: '0%',
        __sizeLabel: '1 KB',
        __status: 'idle',
        __uploaded: 0,
        lastModified: Date.now(),
        lastModifiedDate: new Date(),
        name: 'test.xlsx',
        size: 1024,
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        webkitRelativePath: '',
      }

      mockPost.mockRejectedValue(new Error('Upload failed'))

      const result = await store._importBachMovements(mockFile)

      expect(result.success).toBe(false)
      expect(result.message).toBe('Error al importar')
    })
  })

  describe('_getImportedMovements', () => {
    it('should fetch imported movements successfully', async () => {
      const mockResponse = {
        data: {
          data: [
            {
              id: 1,
              file_name: 'import.xlsx',
              closing_date: '2024-01-01',
              status: {
                id: 73,
                status: 'Procesado',
                comments: null,
              },
              total_records: 10,
              successful_records: 8,
              failed_records: 2,
              loaded_records: 8,
            },
          ],
          message: 'Consulta exitosa',
          success: true,
        },
      }

      mockGet.mockResolvedValue(mockResponse)

      const result = await store._getImportedMovements('1')

      expect(result.success).toBe(true)
      expect(result.data).toHaveLength(1)
      expect(result.data[0].file_name).toBe('import.xlsx')
      expect(mockGet).toHaveBeenCalledWith(
        expect.stringContaining('imported-movements')
      )
    })

    it('should return error when request fails', async () => {
      const mockResponse = {
        data: {
          data: [],
          message: 'Error en consulta',
          success: false,
        },
      }

      mockGet.mockResolvedValue(mockResponse)

      const result = await store._getImportedMovements('1')

      expect(result.success).toBe(false)
      expect(result.data).toEqual([])
    })

    it('should handle error and return false with empty data', async () => {
      mockGet.mockRejectedValue(new Error('Network error'))

      const result = await store._getImportedMovements('1')

      expect(result.success).toBe(false)
      expect(result.data).toEqual([])
    })
  })

  describe('_downloadTemplate', () => {
    it('should download template successfully', async () => {
      const mockBlob = new Blob(['file content'], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })

      const mockResponse = {
        data: mockBlob,
        headers: {
          'content-type':
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
      }

      mockGet.mockResolvedValue(mockResponse)

      await store._downloadTemplate('2024-01-01')

      expect(mockGet).toHaveBeenCalledWith(
        expect.stringContaining('export-movement-template'),
        expect.objectContaining({
          responseType: 'blob',
        })
      )
    })

    it('should handle error in download', async () => {
      mockGet.mockRejectedValue(new Error('Download failed'))

      await store._downloadTemplate('2024-01-01')

      expect(mockGet).toHaveBeenCalled()
    })
  })

  describe('_importBachMovementsErrors', () => {
    it('should download error file successfully', async () => {
      const mockBlob = new Blob(['error data'], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })

      const mockResponse = {
        data: mockBlob,
        headers: {
          'content-type':
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
      }

      mockGet.mockResolvedValue(mockResponse)

      await store._importBachMovementsErrors('123')

      expect(mockGet).toHaveBeenCalledWith(
        expect.stringContaining('imported-movements/export/123'),
        expect.objectContaining({
          responseType: 'blob',
        })
      )
    })

    it('should handle error in error file download', async () => {
      mockGet.mockRejectedValue(new Error('Download failed'))

      await store._importBachMovementsErrors('123')

      expect(mockGet).toHaveBeenCalled()
    })
  })

  describe('_processClosure', () => {
    it('should process closure successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Cierre procesado exitosamente',
        },
      }

      mockPost.mockResolvedValue(mockResponse)

      const payload = {
        closing_date: '2024-01-01',
        funds: [
          {
            id: 1,
            participation_types: [
              {
                id: 1,
                movements: [
                  {
                    id: 1,
                    movement_id: 'M001',
                    movement_description: 'Test',
                    income_expense: 'income',
                    movement_value: 1000,
                  },
                ],
              },
            ],
          },
        ],
      }

      const result = await store._processClosure(payload)

      expect(result).toBe(true)
      expect(mockPost).toHaveBeenCalledWith(
        expect.stringContaining('process-closing'),
        payload
      )
    })

    it('should return false when process closure fails', async () => {
      const mockResponse = {
        data: {
          success: false,
          message: 'Error al procesar cierre',
        },
      }

      mockPost.mockResolvedValue(mockResponse)

      const result = await store._processClosure({
        closing_date: '2024-01-01',
        funds: [],
      })

      expect(result).toBe(false)
    })

    it('should handle error and return false', async () => {
      mockPost.mockRejectedValue(new Error('Process error'))

      const result = await store._processClosure({
        closing_date: '2024-01-01',
        funds: [],
      })

      expect(result).toBe(false)
    })
  })

  describe('_undoClosure', () => {
    it('should undo closure successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Cierre deshecho correctamente',
        },
      }

      mockPost.mockResolvedValue(mockResponse)

      const payload = {
        funds: [{ id: 1 }, { id: 2 }],
      }

      const result = await store._undoClosure(payload)

      expect(result).toBe(true)
      expect(mockPost).toHaveBeenCalledWith(
        expect.stringContaining('undo-process-closing'),
        payload
      )
    })

    it('should return false when undo fails', async () => {
      const mockResponse = {
        data: {
          success: false,
          message: 'Error al deshacer cierre',
        },
      }

      mockPost.mockResolvedValue(mockResponse)

      const result = await store._undoClosure({ funds: [{ id: 1 }] })

      expect(result).toBe(false)
    })

    it('should handle error and return false', async () => {
      mockPost.mockRejectedValue(new Error('Undo error'))

      const result = await store._undoClosure({ funds: [{ id: 1 }] })

      expect(result).toBe(false)
    })
  })

  describe('_cleanData', () => {
    it('should clear all data correctly', () => {
      store.collective_investment_funds = [
        {
          id: 1,
          fund_id: 1,
          fund_code: 'F001',
          fund_name: 'Test',
          business_trust: null,
          last_closing_date: '2024-01-01',
          status: {
            id: 76,
            status: 'Validado',
            comments: null,
          },
          has_participation_types: true,
          participation_types: [],
          consolidation_option: {
            id: 1,
            code: 'CO001',
            description: 'Test',
            status_id: 1,
            created_at: new Date(),
            updated_at: new Date(),
            cancellation_reason: null,
            type: 1,
            deleted_at: null,
          },
          participation_type: null,
        },
      ]
      store.collective_funds_participation_type_table = [
        {
          id: 1,
          fund_id: 1,
          fund_code: 'F001',
          participation_id: 1,
          participation_description: 'Test',
          balance_participation_type: 1000,
          participation_type: 'Type A',
        },
      ]
      store.movement_codes_close_list = [
        {
          id: 1,
          code: 'MC001',
          description: 'Test Movement',
          movement_type: 17,
          movement_type_description: 'Type Test',
          movement_class: 9,
          movement_class_description: 'Class Test',
          movement_natura: 1,
          movement_nature_description: 'Nature Test',
        },
      ]

      store._cleanData()

      expect(store.collective_investment_funds).toEqual([])
      expect(store.collective_funds_participation_type_table).toEqual([])
      expect(store.movement_codes_close_list).toEqual([])
    })
  })
})
