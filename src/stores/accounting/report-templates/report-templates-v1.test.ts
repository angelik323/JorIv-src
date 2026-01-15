import { useReportTemplatesStoreV1 } from './report-templates-v1'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'
import { setActivePinia, createPinia } from 'pinia'
import { executeApi } from '@/apis'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
  })),
}))

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useShowError: jest.fn(() => ({ showCatchError: jest.fn(() => 'Error') })),
}))

describe('useReportTemplatesStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('fetches report templates successfully', async () => {
    const store = useReportTemplatesStoreV1()

    const mockData = {
      data: {
        success: true,
        message: 'List fetched',
        data: {
          data: [
            { id: 1, code: 'INF000001', name: 'Informe A' },
            { id: 2, code: 'INF000002', name: 'Informe B' },
          ],
          current_page: 1,
          last_page: 1,
        },
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockData)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._listAction({ param: 'test' })

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/report-templates/index`,
      {
        params: { param: 'test', paginate: 1 },
      }
    )
    expect(store.report_templates_list).toHaveLength(2)
    expect(store.report_templates_pages).toEqual({
      currentPage: 1,
      lastPage: 1,
    })
  })

  it('handles error when fetching report templates', async () => {
    const store = useReportTemplatesStoreV1()

    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._listAction({ param: 'test' })

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/report-templates/index`,
      {
        params: { param: 'test', paginate: 1 },
      }
    )
    expect(store.report_templates_list).toEqual([])
  })

  it('creates report template with logo and signatures successfully', async () => {
    const store = useReportTemplatesStoreV1()

    const mockResponse = {
      data: {
        success: true,
        message: 'Creado correctamente',
      },
    }

    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload = {
      name: 'Informe consolidado de cuentas',
      logo: {
        id: 1,
        image_path: 'logos/12/logo.png',
        app_name: 'Contabilidad Fiduprevisora',
        entity: 'Fiduprevisora S.A.',
      },
      signatures: [
        {
          id: 5,
          image_path: 'signatures/12/7/firma_nueva.png',
          is_active: true,
        },
        {
          image_path: 'signatures/12/8/nueva_firma.png',
          is_active: false,
        },
      ],
    }

    const success = await store._createAction(payload)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/report-templates/store`,
      payload
    )
    expect(success).toBe(true)
  })

  it('updates report template with logo and signatures successfully', async () => {
    const store = useReportTemplatesStoreV1()

    const mockResponse = {
      data: {
        success: true,
        message: 'Actualizado correctamente',
      },
    }

    const mockPut = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const payload = {
      report_template_id: 5,
      name: 'Informe actualizado',
      logo: {
        id: 1,
        image_path: 'logos/12/logo.png',
        app_name: 'Contabilidad Fiduprevisora',
        entity: 'Fiduprevisora S.A.',
      },
      signatures: [
        {
          id: 5,
          image_path: 'signatures/12/7/firma_nueva.png',
          is_active: true,
        },
      ],
    }

    const success = await store._updateAction(payload)

    expect(mockPut).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/report-templates/update/5`,
      payload
    )
    expect(success).toBe(true)
  })

  it('fetches report template by ID successfully', async () => {
    const store = useReportTemplatesStoreV1()

    const mockResponse = {
      data: {
        success: true,
        data: {
          id: 1,
          name: 'Plantilla Uno',
          logo: {
            id: 1,
            image_path: 'logos/12/logo.png',
            app_name: 'Contabilidad Fiduprevisora',
            entity: 'Fiduprevisora S.A.',
          },
          signatures: [
            {
              id: 1,
              image_path: 'signatures/12/1/firma.png',
              is_active: true,
            },
          ],
        },
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getByIdAction('1')

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/report-templates/show/1`
    )
    expect(result).toEqual(mockResponse.data.data)
  })

  it('handles error when fetching report template by ID', async () => {
    const store = useReportTemplatesStoreV1()

    const mockResponse = {
      data: {
        success: false,
        message: 'No encontrado',
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._getByIdAction('1')

    expect(result).toBeNull()
  })

  it('generates code successfully', async () => {
    const store = useReportTemplatesStoreV1()

    const mockResponse = {
      data: {
        success: true,
        data: 'INF000010',
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._generateCodeAction('INF')

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/report-templates/generate-code/INF`
    )
    expect(result).toBe('INF000010')
  })

  it('handles error when generating code', async () => {
    const store = useReportTemplatesStoreV1()

    const mockResponse = {
      data: {
        success: false,
        message: 'No se pudo generar el código',
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._generateCodeAction('INF')

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/report-templates/generate-code/INF`
    )
    expect(result).toBeNull()
  })

  it('catches error when generating code', async () => {
    const store = useReportTemplatesStoreV1()

    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._generateCodeAction('INF')

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/report-templates/generate-code/INF`
    )
    expect(result).toBeNull()
  })

  it('returns data when presigned URL is generated successfully', async () => {
    const store = useReportTemplatesStoreV1()

    const mockData = {
      url: 'https://example.com/presigned-url',
      fields: {},
    }

    const mockResponse = {
      data: {
        success: true,
        message: 'Presigned URL generated successfully',
        data: mockData,
      },
    }

    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload = {
      document_type: 'png',
      file_type: 'logo',
      app_name: 'My app',
      name: 'My logo',
      entity: 'My entity',
    }

    const result = await store._generatePresignedUrl(payload)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/report-templates/generate-presigned-url`,
      payload
    )
    expect(result).toEqual(mockData)
  })

  it('returns null when API responds with success = false', async () => {
    const store = useReportTemplatesStoreV1()

    const mockResponse = {
      data: {
        success: false,
        message: 'Failed to generate URL',
      },
    }

    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const payload = {
      document_type: 'png',
      file_type: 'logo',
      app_name: 'My app',
      name: 'My logo',
      entity: 'My entity',
    }

    const result = await store._generatePresignedUrl(payload)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/report-templates/generate-presigned-url`,
      payload
    )
    expect(result).toBeNull()
  })

  it('updates logo successfully', async () => {
    const store = useReportTemplatesStoreV1()

    const mockResponse = {
      data: {
        success: true,
        message: 'Logo actualizado correctamente',
      },
    }

    const mockPut = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const payload = {
      id: 10,
      image_path: 'logos/12/new_logo.png',
    }

    const success = await store._updateLogoAction(payload)

    expect(mockPut).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/report-templates/update-logo/`,
      payload
    )
    expect(success).toBe(true)
  })

  it('updates signature successfully', async () => {
    const store = useReportTemplatesStoreV1()

    const mockResponse = {
      data: {
        success: true,
        message: 'Firma actualizada correctamente',
      },
    }

    const mockPut = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const payload = {
      id: 7,
      image_path: 'signatures/12/7/firma.png',
      is_active: true,
    }

    const success = await store._updateSignatureAction(payload)

    expect(mockPut).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/report-templates/update-signature/`,
      payload
    )
    expect(success).toBe(true)
  })

  it('deletes logo successfully', async () => {
    const store = useReportTemplatesStoreV1()

    const mockResponse = {
      data: {
        success: true,
        message: 'Logo eliminado correctamente',
      },
    }

    const mockDelete = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    await store._deleteLogoAction(15)

    expect(mockDelete).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/report-templates/delete-logo/15`
    )
  })

  it('deletes signature successfully', async () => {
    const store = useReportTemplatesStoreV1()

    const mockResponse = {
      data: {
        success: true,
        message: 'Firma eliminada correctamente',
      },
    }

    const mockDelete = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    await store._deleteSignatureAction(20)

    expect(mockDelete).toHaveBeenCalledWith(
      `${URL_PATH_ACCOUNTING}/report-templates/delete-signature/20`
    )
  })
})
