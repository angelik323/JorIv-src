import { setActivePinia, createPinia } from 'pinia'
import { useAmortizationTablesStoreV1 } from '@/stores/financial-obligations/amortization-tables/amortization-tables-v1'
import { executeApi } from '@/apis'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(),
}))

jest.mock('@/composables', () => ({
  useShowError: jest.fn(() => ({
    showCatchError: jest.fn(() => 'Mocked error'),
  })),
  useAlert: jest.fn(() => ({
    showAlert: jest.fn(),
  })),
}))

jest.mock('@/components/ShowEmptyScreen/ShowEmptyScreen', () => ({
  useShowEmptyScreen: jest.fn(() => ({
    // eslint-disable-next-line no-empty-function
    openComponentLoader: () => {},
    // eslint-disable-next-line no-empty-function
    resetSetLoaderComponent: () => {},
    title: { value: '' },
    description: { value: '' },
    loader: { value: false },
    image: { value: '' },
  })),
}))

describe('useAmortizationTablesStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
    global.fetch = jest.fn()
  })

  it('testing _loadAmortizationList', async () => {
    const store = useAmortizationTablesStoreV1()
    const mockParams = 'businessId=123'

    const URL_PATH_FINANCIAL_OBLIGATION =
      'financial-obligations/api/financial-obligations'

    const mockApiResponseData = {
      data: [
        {
          obligation_number: 'OBL-001',
          id: 1,
          amount: '10000.00',
          quotas: 12,
          interest_rate: '0.05',
          amortization_table_url: '/docs/amortization-001.pdf',
          has_payment_plan: true,
          business_trust: {
            name: 'Empresa A',
            id: 123,
            business_code: 'EMP-A',
          },
        },
        {
          obligation_number: 'OBL-002',
          id: 2,
          amount: '5000.00',
          quotas: 6,
          interest_rate: '0.03',
          amortization_table_url: '/docs/amortization-002.pdf',
          has_payment_plan: false,
          business_trust: {
            name: 'Empresa A',
            id: 123,
            business_code: 'EMP-A',
          },
        },
      ],
      message: 'Lista de amortización cargada exitosamente',
    }

    const mockResponse = {
      status: 200,
      data: mockApiResponseData,
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._loadAmortizationList(mockParams)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_FINANCIAL_OBLIGATION}/get-financial-obligations?${mockParams}`
    )

    expect(store.showAmortizationData).toBe(true)

    expect(store.amortizationData).toEqual({
      businessName: 'Empresa A',
      businessId: 123,
      businessCode: 'EMP-A',
      options: [
        {
          label: 'OBL-001',
          value: 1,
          payload: {
            financialObligationNumber: 'OBL-001',
            creditAmount: '10000.00',
            paymentQuotas: 12,
            loanRate: '0.05',
            documentFile: '/docs/amortization-001.pdf',
            financialPlanning: true,
          },
        },
        {
          label: 'OBL-002',
          value: 2,
          payload: {
            financialObligationNumber: 'OBL-002',
            creditAmount: '5000.00',
            paymentQuotas: 6,
            loanRate: '0.03',
            documentFile: '/docs/amortization-002.pdf',
            financialPlanning: false,
          },
        },
      ],
    })
  })

  it('handles _loadAmortizationList when API returns successful status but empty data array (state only)', async () => {
    const store = useAmortizationTablesStoreV1()
    const mockParams = 'businessId=456'
    const URL_PATH_FINANCIAL_OBLIGATION =
      'financial-obligations/api/financial-obligations'

    const mockApiResponseEmptyData = {
      status: true,
      data: {
        data: [],
        message: 'Lista de amortización vacía',
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockApiResponseEmptyData)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._loadAmortizationList(mockParams)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_FINANCIAL_OBLIGATION}/get-financial-obligations?${mockParams}`
    )

    expect(store.showAmortizationData).toBe(false)
    expect(store.amortizationData).toBeNull()
    expect(store.obligationsOptions).toEqual([])
  })
  it('loads amortization list and obligation options fail', async () => {
    const store = useAmortizationTablesStoreV1()

    const mockErrorResponseControlled = {
      status: false,
      data: {
        message: 'Error al cargar la lista de amortización desde el backend',
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockErrorResponseControlled)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._loadAmortizationList('business_id=10')

    expect(mockGet).toHaveBeenCalledWith(
      'financial-obligations/api/financial-obligations/get-financial-obligations?business_id=10'
    )

    expect(store.amortizationData).toBeNull()
    expect(store.obligationsOptions).toEqual([])
    expect(store.showAmortizationData).toBe(false)
  })

  it('returns null when PDF URL is not found in successful API response for _loadDocumentURLPDF', async () => {
    const store = useAmortizationTablesStoreV1()
    const mockDocumentId = 456

    const mockApiResponseNoUrl = {
      data: {
        data: {
          amortization_table_url: undefined,
        },
        message: 'Documento no encontrado',
      },
      status: true,
    }

    const mockGet = jest.fn().mockResolvedValue(mockApiResponseNoUrl)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._loadDocumentURLPDF(mockDocumentId)

    expect(mockGet).toHaveBeenCalledWith(
      `financial-obligations/api/financial-obligations/get-financial-obligation-by-id/${mockDocumentId}`
    )

    expect(result).toBeNull()
  })

  it('returns null when amortization_table_url is missing from API response for _loadDocumentPDF', async () => {
    const store = useAmortizationTablesStoreV1()
    const mockDocumentId = 123

    const mockApiResponseNoUrl = {
      data: {
        data: {
          amortization_table_url: undefined,
        },
        message: 'Detalle de obligación cargado',
      },
      status: true,
    }

    const mockGet = jest.fn().mockResolvedValue(mockApiResponseNoUrl)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._loadDocumentPDF(mockDocumentId)

    expect(mockGet).toHaveBeenCalledWith(
      `financial-obligations/api/financial-obligations/get-financial-obligation-by-id/${mockDocumentId}`
    )

    expect(result).toBeNull()
  })

  it('returns null when fetched document is not a valid PDF for _loadDocumentPDF', async () => {
    const store = useAmortizationTablesStoreV1()
    const mockDocumentId = 789
    const mockPdfUrl = 'http://example.com/not-a-pdf.txt'

    const mockApiResponseWithUrl = {
      data: {
        data: {
          amortization_table_url: mockPdfUrl,
        },
        message: 'Detalle de obligación cargado',
      },
      status: true,
    }

    const mockGet = jest.fn().mockResolvedValue(mockApiResponseWithUrl)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._loadDocumentPDF(mockDocumentId)

    expect(mockGet).toHaveBeenCalledWith(
      `financial-obligations/api/financial-obligations/get-financial-obligation-by-id/${mockDocumentId}`
    )
    expect(global.fetch).toHaveBeenCalledWith(mockPdfUrl)
    expect(result).toBeNull()
  })

  it('loads and returns PDF file successfully', async () => {
    const store = useAmortizationTablesStoreV1()

    const mockApiResponse = {
      status: true,
      data: {
        data: {
          amortization_table_url: 'http://example.com/document.pdf',
        },
      },
    }

    const mockBlob = new Blob(['dummy content'], { type: 'application/pdf' })

    const mockGet = jest.fn().mockResolvedValue(mockApiResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
    ;(global.fetch as jest.Mock) = jest.fn().mockResolvedValue({
      blob: () => Promise.resolve(mockBlob),
    })

    const file = await store._loadDocumentPDF(123)

    expect(mockGet).toHaveBeenCalledWith(
      'financial-obligations/api/financial-obligations/get-financial-obligation-by-id/123'
    )
    expect(global.fetch).toHaveBeenCalledWith('http://example.com/document.pdf')
    expect(file).not.toBeNull()
    if (file) {
      expect(file).toBeInstanceOf(File)
    }
  })

  it('returns PDF URL successfully', async () => {
    const store = useAmortizationTablesStoreV1()

    const mockResponse = {
      data: {
        data: {
          amortization_table_url: 'http://example.com/amortization.pdf',
        },
        message: 'Documento encontrado correctamente',
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const result = await store._loadDocumentURLPDF(123)

    expect(mockGet).toHaveBeenCalledWith(
      'financial-obligations/api/financial-obligations/get-financial-obligation-by-id/123'
    )
    expect(result).toBe('http://example.com/amortization.pdf')
  })

  it('handles error when loading PDF fails', async () => {
    const store = useAmortizationTablesStoreV1()

    const mockError = new Error('Network error')

    const mockGet = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const file = await store._loadDocumentPDF(123)

    expect(mockGet).toHaveBeenCalledWith(
      'financial-obligations/api/financial-obligations/get-financial-obligation-by-id/123'
    )
    expect(file).toBeNull()
  })
  it('handles error when fetching PDF URL fails', async () => {
    const store = useAmortizationTablesStoreV1()

    const mockError = new Error('Request failed')

    const mockGet = jest.fn().mockRejectedValue(mockError)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const fileURL = await store._loadDocumentURLPDF(321)

    expect(mockGet).toHaveBeenCalled()
    expect(fileURL).toBeNull()
  })
  it('creates amortization file successfully', async () => {
    const store = useAmortizationTablesStoreV1()

    const mockResponse = {
      data: {
        message: 'Archivo cargado correctamente',
        success: true,
      },
    }

    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const mockFile = new File(['dummy content'], 'file.pdf', {
      type: 'application/pdf',
    })

    const result = await store._createAmortization(1, mockFile)

    expect(mockPost).toHaveBeenCalled()
    expect(result).toBe(true)
  })
  it('returns false when upload fails', async () => {
    const store = useAmortizationTablesStoreV1()

    const mockPost = jest.fn().mockRejectedValue(new Error('Upload failed'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const mockFile = new File(['dummy content'], 'file.pdf', {
      type: 'application/pdf',
    })

    const result = await store._createAmortization(2, mockFile)

    expect(mockPost).toHaveBeenCalled()
    expect(result).toBe(false)
  })
  it('returns false when response success is false', async () => {
    const store = useAmortizationTablesStoreV1()

    const mockResponse = {
      data: {
        message: 'Error en el servidor',
        success: false,
      },
    }

    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const mockFile = new File(['dummy content'], 'file.pdf', {
      type: 'application/pdf',
    })

    const result = await store._createAmortization(3, mockFile)

    expect(mockPost).toHaveBeenCalled()
    expect(result).toBe(false)
  })

  it('resets amortization data correctly', () => {
    const store = useAmortizationTablesStoreV1()

    store.showAmortizationData = true
    store.amortizationTableLoader = true
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    store.amortizationTableList = [{ id: 1 }, { id: 2 }] as any
    store.amortizationTablePages = {
      currentPage: 3,
      lastPage: 5,
    }
    store.obligationsOptions = [
      {
        label: 'Test',
        value: 1,
        payload: {
          financialObligationNumber: 'OBL-TEST',
          creditAmount: 1234,
          paymentQuotas: 12,
          loanRate: '5%',
          documentFile: false,
          financialPlanning: false,
        },
      },
    ]
    store.amortizationData = {
      businessName: 'Empresa X',
      businessId: 99,
      businessCode: 'RE450',
      options: [
        {
          label: 'Test',
          value: 1,
          payload: {
            financialObligationNumber: 'OBL-TEST',
            creditAmount: 1234,
            paymentQuotas: 12,
            loanRate: '5%',
            documentFile: false,
            financialPlanning: false,
          },
        },
      ],
    }

    store._resetSetAmortizationData()

    expect(store.showAmortizationData).toBe(false)
    expect(store.amortizationTableLoader).toBe(false)
    expect(store.amortizationTableList).toEqual([])
    expect(store.amortizationTablePages).toEqual({
      currentPage: 1,
      lastPage: 1,
    })
    expect(store.obligationsOptions).toEqual([])
    expect(store.amortizationData).toBeNull()
  })
})
