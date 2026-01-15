import { setActivePinia, createPinia } from 'pinia'
import { useValidationVouchersV1 } from './validation-vouchers-v1'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'
import { IValidateVouchersResponseItem } from '@/interfaces/customs'

const URL_PATH = `${URL_PATH_ACCOUNTING}/vouchers`

jest.mock('@/apis', () => ({
  executeApi: jest.fn(),
}))

jest.mock('@/composables', () => {
  const showAlert = jest.fn()
  const showCatchError = jest.fn().mockReturnValue('Ups')
  const downloadBlobXlxx = jest.fn()
  const getNameBlob = jest.fn().mockReturnValue('export.xlsx')

  return {
    useAlert: () => ({ showAlert }),
    useShowError: () => ({ showCatchError }),
    useUtils: () => ({ downloadBlobXlxx, getNameBlob }),
  }
})

import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { IVouncherValidationModel } from '@/interfaces/customs'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

describe('useValidationVouchersV1 store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('_getListAction → carga lista correctamente cuando params está vacío', async () => {
    const mockResponse = {
      data: {
        success: true,
        message: 'Lista cargada',
        data: {
          data: [{ id: 1 }, { id: 2 }],
          current_page: 1,
          last_page: 3,
        },
      },
    }

    ;(executeApi as jest.Mock).mockReturnValue({
      get: jest.fn().mockResolvedValue(mockResponse),
    })

    const store = useValidationVouchersV1()

    await store._getListAction('')

    expect(executeApi().get).toHaveBeenCalledWith(
      expect.stringContaining('/accounting/vouchers?paginate=1')
    )

    expect(store.validation_vouchers_list).toEqual([{ id: 1 }, { id: 2 }])
    expect(store.validation_vouchers_pages.currentPage).toBe(1)
    expect(store.validation_vouchers_pages.lastPage).toBe(3)

    expect(showAlert).toHaveBeenCalledWith(
      'Lista cargada',
      'success',
      undefined,
      3000
    )
  })

  it('_validateVouchers → retorna success & data y actualiza listado', async () => {
    const mockPayload = {
      period_date: '2024-01-01',
      structure: { code: 'STR01' },
      from_business_trust_id: {
        id: 1,
        business_code: 'BT01',
        business_name: 'Business Trust 1',
      },
      to_business_trust_id: {
        id: 2,
        business_code: 'BT02',
        business_name: 'Business Trust 2',
      },
      vouchers_ids: [],
      status: '',
    } as any

    const apiResponse = {
      data: {
        success: true,
        message: 'Validado',
        data: [[{ id: 777 }]],
      },
    }

    ;(executeApi as jest.Mock).mockReturnValue({
      post: jest.fn().mockResolvedValue(apiResponse),
    })

    const store = useValidationVouchersV1()
    const result = await store._validateVouchers(mockPayload)

    expect(result).toEqual({ success: true, data: [{ id: 777 }] })
    expect(store.validation_vouchers_list).toEqual([[{ id: 777 }]])
    expect(executeApi().post).toHaveBeenCalledWith(
      'accounting/api/accounting/vouchers/validate',
      mockPayload
    )
    expect(showAlert).toHaveBeenCalledWith(
      'Validado',
      'success',
      undefined,
      3000
    )
  })

  it('__createValidationVouchers → retorna success true y muestra alerta', async () => {
    const mockPayload = {
      from_business_trust_id: {
        id: 1,
        business_code: 'CODE1',
        business_name: 'Trust One',
      },
      to_business_trust_id: {
        id: 2,
        business_code: 'CODE2',
        business_name: 'Trust Two',
      },
      period_date: '2024-01-01',
      vouchers_ids: [10, 20],
      status: 'active',
    } as IVouncherValidationModel

    const apiResponse = {
      data: {
        success: true,
        message: 'Creado correctamente',
      },
    }

    ;(executeApi as jest.Mock).mockReturnValue({
      post: jest.fn().mockResolvedValue(apiResponse),
    })

    const store = useValidationVouchersV1()
    const result = await store.__createValidationVouchers(mockPayload)

    expect(result).toBe(true)
    expect(executeApi().post).toHaveBeenCalledWith(
      'accounting/api/accounting/vouchers',
      mockPayload
    )
    expect(showAlert).toHaveBeenCalledWith(
      'Creado correctamente',
      'success',
      undefined,
      3000
    )
  })

  it('__createValidationVouchers → maneja error y retorna false', async () => {
    const error = new Error('Server error')
    ;(executeApi as jest.Mock).mockReturnValue({
      post: jest.fn().mockRejectedValue(error),
    })

    const store = useValidationVouchersV1()

    const result = await store.__createValidationVouchers({
      from_business_trust_id: {
        id: 1,
        business_code: 'CODE1',
        business_name: 'Trust One',
      },
      to_business_trust_id: {
        id: 2,
        business_code: 'CODE2',
        business_name: 'Trust Two',
      },
      period_date: '2024-01-01',
      vouchers_ids: [10],
      status: 'active',
    })

    expect(result).toBe(false)
    expect(showCatchError).toHaveBeenCalledWith(error)
    expect(showAlert).toHaveBeenCalledWith('Ups', 'error', undefined, 3000)
  })

  it('_cleanValidationVouchersData reinicia lista y páginas', () => {
    const store = useValidationVouchersV1()
    store.validation_vouchers_list = [{ id: 1 }] as any
    store.validation_vouchers_pages.currentPage = 9
    store._cleanValidationVouchersData()

    expect(store.validation_vouchers_list).toEqual([])
    expect(store.validation_vouchers_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
  })

  describe('useValidationVouchersV1 - _dowloadTrustBusinessList', () => {
    it('descarga archivo correctamente cuando with_errors = 0', async () => {
      const store = useValidationVouchersV1()

      // Simulamos el blob de respuesta
      const blobData = new Uint8Array([1, 2, 3])
      const getMock = jest.fn().mockResolvedValue({
        data: blobData,
        headers: {
          'content-type':
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'content-disposition': 'attachment; filename="export.xlsx"',
        },
      })

      // Simulamos el cliente API
      ;(executeApi as jest.Mock).mockReturnValue({
        get: getMock,
      })

      // Espiamos y reemplazamos useUtils con mocks
      const downloadMock = jest.fn()
      const getNameBlobMock = jest.fn().mockReturnValue('export.xlsx')

      jest.spyOn(require('@/composables'), 'useUtils').mockReturnValue({
        downloadBlobXlxx: downloadMock,
        getNameBlob: getNameBlobMock,
      })

      // Ejecutamos el método
      await store._dowloadTrustBusinessList({ with_errors: 0 })

      // ✅ Validamos la llamada al API (ruta sin `/` inicial)
      expect(getMock).toHaveBeenCalledWith(
        'accounting/api/accounting/vouchers/export',
        {
          params: { with_errors: 0, errors: undefined },
          responseType: 'blob',
        }
      )

      // ✅ Validamos la descarga
      expect(downloadMock).toHaveBeenCalled()
      const [blobArg, fileArg] = downloadMock.mock.calls[0]
      expect(blobArg).toBeDefined()
      expect(fileArg).toBe('export.xlsx')
    })
  })

  describe('_getByIdValidationVouchers', () => {
    const mockId = 1
    const mockResponseData = {
      id: 1,
      period_date: '2023-01-01',
      structure: '0001',
      structure_name: 'nombre estructura',
      from_business_trust_id: {
        id: 1,
        business_code: 'CODE1',
        business_name: 'nombre1',
      },
      to_business_trust_id: {
        id: 2,
        business_code: 'CODE2',
        business_name: 'nombre2',
      },
      daily_closing: false,
      update: 'Mes',
      day_to_update: '',
      needs_voucher: true,
      receipt_type_id: null,
      sub_receipt_type_id: null,
      status: {
        id: 1,
        status: 'Actualizados',
      },
    }

    it('should load the data correctly when the request is successful', async () => {
      // Arrange
      const store = useValidationVouchersV1()
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Success',
          data: mockResponseData,
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getByIdValidationVouchers(mockId)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/${mockId}`)
      expect(store.validation_vouchers_view).toEqual(mockResponseData)
      expect(showAlert).toHaveBeenCalledWith(
        'Success',
        'success',
        undefined,
        3000
      )
    })

    it('should not update the state when success is false', async () => {
      // Arrange
      const store = useValidationVouchersV1()
      const errorMessage = 'Error al cargar los datos'
      const mockGet = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: errorMessage,
          data: null,
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getByIdValidationVouchers(mockId)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/${mockId}`)
      expect(store.validation_vouchers_view).not.toEqual(mockResponseData)
      expect(showAlert).toHaveBeenCalledWith(
        errorMessage,
        'error',
        undefined,
        3000
      )
    })

    it('should correctly handle request errors', async () => {
      // Arrange
      const store = useValidationVouchersV1()
      const error = new Error('Error de red')
      const mockGet = jest.fn().mockRejectedValue(error)
      ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

      // Act
      await store._getByIdValidationVouchers(mockId)

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/${mockId}`)
      expect(showCatchError).toHaveBeenCalledWith(error)
      expect(showAlert).toHaveBeenCalledWith('Ups', 'error', undefined, 3000)
    })
  })

  describe('_updateVouchers', () => {
    const mockData = {
      period_date: '2025-06',
      structure: '0001',
      from_business_trust_id: '1',
      to_business_trust_id: '2',
      from_update: true,
      daily_closing: false,
      update: 'Mes',
      day_to_update: '2025-06-17',
      needs_voucher: true,
      receipt_type_id: 1,
      sub_receipt_type_id: 2,
      status: 'Actualizados',
      businesses: [
        { id: 1, vouchers: [101, 102] },
        { id: 2, vouchers: [201, 202] },
      ],
    }

    it('should return true when the update is successful', async () => {
      // Arrange
      const store = useValidationVouchersV1()
      const successMessage = 'Comprobantes actualizados exitosamente'
      const mockPost = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: successMessage,
          data: null,
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._updateVouchers(mockData)

      // Assert
      expect(mockPost).toHaveBeenCalledWith(`${URL_PATH}/updated`, mockData)
      expect(showAlert).toHaveBeenCalledWith(
        successMessage,
        'success',
        undefined,
        3000
      )
      expect(result).toBe(true)
    })

    it('should return false when the update fails', async () => {
      // Arrange
      const store = useValidationVouchersV1()
      const errorMessage = 'No se actualizaron los comprobantes'
      const mockPost = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: errorMessage,
          data: null,
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._updateVouchers(mockData)

      // Assert
      expect(mockPost).toHaveBeenCalledWith(`${URL_PATH}/updated`, mockData)
      expect(showAlert).toHaveBeenCalledWith(
        errorMessage,
        'error',
        undefined,
        3000
      )
      expect(result).toBe(false)
    })

    it('should correctly handle request errors', async () => {
      // Arrange
      const store = useValidationVouchersV1()
      const error = new Error('Error de red')
      const mockPost = jest.fn().mockRejectedValue(error)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._updateVouchers(mockData)

      // Assert
      expect(mockPost).toHaveBeenCalledWith(`${URL_PATH}/updated`, mockData)
      expect(showCatchError).toHaveBeenCalledWith(error)
      expect(showAlert).toHaveBeenCalledWith('Ups', 'error', undefined, 3000)
      expect(result).toBe(false)
    })
  })

  describe('_validateVouchersUpdate', () => {
    const mockPayload = {
      period_date: '2025-06',
      structure: '0001',
      from_business_trust_id: '1',
      to_business_trust_id: '2',
      from_update: true,
      daily_closing: false,
      update: 'Mes',
      day_to_update: '2025-06-17',
      needs_voucher: true,
    }

    const mockValidResponseData = [
      [
        { id: 1, vouchers: [101, 102] },
        { id: 2, vouchers: [201, 202] },
      ],
    ]

    it('should return success true and update the status with validated receipts', async () => {
      // Arrange
      const store = useValidationVouchersV1()
      const successMessage = 'Validación exitosa'
      const mockPost = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: successMessage,
          data: mockValidResponseData,
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._validateVouchersUpdate(mockPayload)

      // Assert
      expect(mockPost).toHaveBeenCalledWith(`${URL_PATH}/validate`, mockPayload)
      expect(store.validate_vouchers_response).toEqual(mockValidResponseData[0])
      expect(showAlert).toHaveBeenCalledWith(
        successMessage,
        'success',
        undefined,
        3000
      )
      expect(result).toEqual({ success: true })
    })

    it('should handle successful response without validated receipts', async () => {
      // Arrange
      const store = useValidationVouchersV1()
      const successMessage =
        'Validación exitosa pero sin comprobantes válidados'
      const invalidData: IValidateVouchersResponseItem[] = [
        { id: 1, vouchers: [201, 202] },
      ]
      const mockPost = jest.fn().mockResolvedValue({
        data: {
          success: true,
          message: successMessage,
          data: invalidData,
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._validateVouchersUpdate(mockPayload)

      // Assert
      expect(mockPost).toHaveBeenCalledWith(`${URL_PATH}/validate`, mockPayload)
      expect(store.validate_vouchers_response).toEqual([])
      expect(showAlert).toHaveBeenCalledWith(
        successMessage,
        'success',
        undefined,
        3000
      )
      expect(result).toEqual({ success: true })
    })

    it('should return success false when validation fails', async () => {
      // Arrange
      const store = useValidationVouchersV1()
      const errorMessage = 'No se encontraron resultados para la validación.'
      const mockPost = jest.fn().mockResolvedValue({
        data: {
          success: false,
          message: errorMessage,
          data: null,
        },
      })
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._validateVouchersUpdate(mockPayload)

      // Assert
      expect(mockPost).toHaveBeenCalledWith(`${URL_PATH}/validate`, mockPayload)
      expect(store.validate_vouchers_response).toEqual([])
      expect(showAlert).toHaveBeenCalledWith(
        errorMessage,
        'error',
        undefined,
        3000
      )
      expect(result).toEqual({ success: false })
    })

    it('should correctly handle request errors', async () => {
      // Arrange
      const store = useValidationVouchersV1()
      const error = new Error('Error de red')
      const mockPost = jest.fn().mockRejectedValue(error)
      ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

      // Act
      const result = await store._validateVouchersUpdate(mockPayload)

      // Assert
      expect(mockPost).toHaveBeenCalledWith(`${URL_PATH}/validate`, mockPayload)
      expect(showCatchError).toHaveBeenCalledWith(error)
      expect(showAlert).toHaveBeenCalledWith('Ups', 'error', undefined, 3000)
      expect(result).toEqual({ success: false })
    })
  })
})
