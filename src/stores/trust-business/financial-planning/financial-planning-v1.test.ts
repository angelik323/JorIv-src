import { setActivePinia, createPinia } from 'pinia'
import { useFinancialPlanningStoreV1 } from '@/stores/trust-business/financial-planning/financial-planning-v1'
import { executeApi } from '@/apis'
import { IFinancialPlanning } from '@/interfaces/customs/financial-obligations/AmortizationTables'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(),
}))

jest.mock('@/composables', () => ({
  useUtils: () => ({
    formatCurrencyString: jest.fn((val) => `COP ${val}`),
    getNameBlob: jest.fn().mockReturnValue('file.xlsx'),
    downloadBlobXlxx: jest.fn(),
  }),
  useShowError: jest.fn(() => ({
    showCatchError: jest.fn(() => 'Mocked error'),
  })),
  useAlert: jest.fn(() => ({
    showAlert: jest.fn(),
  })),
}))

describe('useFinancialObligationStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('testing _resetFinancialPlanning', async () => {
    const store = useFinancialPlanningStoreV1()

    store.paymentPlanList = [
      { financialObligationId: 1, numberQuota: 1 },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ] as any
    store.paymentPlanPages = { currentPage: 2, lastPage: 5 }

    await store._resetFinancialPlanning()

    expect(store.paymentPlanList).toEqual([])
    expect(store.paymentPlanPages).toEqual({
      currentPage: 1,
      lastPage: 1,
    })
  })

  it('testing _loadFinancialPlanningList', async () => {
    const store = useFinancialPlanningStoreV1()
    const urlId = 'page=1&id=123'

    const mockResponse = {
      data: {
        data: {
          data: [
            {
              financial_obligation_id: 123,
              number_quota: 1,
              initial_balance: 10000.0,
              interest_quota: 500.0,
              capital_quota: 9500.0,
              total_quota: 10000.0,
              final_balance: 9000.0,
              payment_date: '2025-01-31',
              status_quota_id: 1,
            },
            {
              financial_obligation_id: 123,
              number_quota: 2,
              initial_balance: 9000.0,
              interest_quota: 450.0,
              capital_quota: 8550.0,
              total_quota: 9000.0,
              final_balance: 0.0,
              payment_date: '2025-02-28',
              status_quota_id: 2,
            },
          ],
          route_export: '/export/planning.xlsx',
          current_page: 1,
          last_page: 2,
        },
        message: 'Lista cargada exitosamente',
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._loadFinancialPlanningList(urlId)

    expect(mockGet).toHaveBeenCalledWith(
      `financial-obligations/api/financial-obligations/payment-plan/get-quotas-by-obligation?paginate=true&${urlId}`
    )

    expect(store.paymentPlanList).toEqual([
      {
        financialObligationId: 123,
        numberQuota: 1,
        initialBalance: 'COP 10000',
        interestQuota: 'COP 500',
        capitalQuota: 'COP 9500',
        totalQuota: 'COP 10000',
        finalBalance: 'COP 9000',
        paymentDate: '2025-01-31',
        statusQuotaId: 1,
      },
      {
        financialObligationId: 123,
        numberQuota: 2,
        initialBalance: 'COP 9000',
        interestQuota: 'COP 450',
        capitalQuota: 'COP 8550',
        totalQuota: 'COP 9000',
        finalBalance: 'COP 0',
        paymentDate: '2025-02-28',
        statusQuotaId: 2,
      },
    ])

    expect(store.urlFinancialPlanListXLS).toBe('/export/planning.xlsx')
    expect(store.paymentPlanPages).toEqual({
      currentPage: 1,
      lastPage: 2,
    })
  })

  it('testing _updateAddFinancialPlaningById', async () => {
    const store = useFinancialPlanningStoreV1()

    const financialObligationIdForBody = 123

    const mockBody: IFinancialPlanning = {
      financialObligationId: financialObligationIdForBody,
      numberQuota: 2,
      initialBalance: '1000.00',
      interestQuota: '50.00',
      capitalQuota: '950.00',
      totalQuota: '1000.00',
      finalBalance: '0.00',
      paymentDate: '2025-12-31',
      statusQuotaId: 1,
    }

    const mockResponse = {
      status: 200,
      data: {
        success: true,
        data: mockBody,
        message: 'Planificación financiera actualizada correctamente',
      },
    }

    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    await store._updateAddFinancialPlaningById(mockBody)

    expect(mockPost).toHaveBeenCalledWith(
      'financial-obligations/api/financial-obligations/payment-plan/store-quota',
      expect.any(Object)
    )
  })

  it('testing _updateFinancialPlaningById', async () => {
    const store = useFinancialPlanningStoreV1()

    const mockUpdateBody: IFinancialPlanning = {
      financialObligationId: 123,
      numberQuota: 3,
      initialBalance: '1100.00',
      interestQuota: '60.00',
      capitalQuota: '1040.00',
      totalQuota: '1100.00',
      finalBalance: '100.00',
      paymentDate: '2026-01-15',
      statusQuotaId: 2,
    }

    const expectedApiBody = {
      financial_obligation_id: 123,
      number_quota: 3,
      initial_balance: '1100.00',
      interest_quota: '60.00',
      capital_quota: '1040.00',
      total_quota: '1100.00',
      final_balance: '100.00',
      payment_date: '2026-01-15',
      status_quota_id: 2,
    }

    const mockUpdateResponse = {
      status: 200,
      data: {
        success: true,
        data: mockUpdateBody,
        message: 'Planificación financiera actualizada exitosamente',
      },
    }

    const mockPut = jest.fn().mockResolvedValue(mockUpdateResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    await store._updateFinancialPlaningById(mockUpdateBody)

    expect(mockPut).toHaveBeenCalledWith(
      'financial-obligations/api/financial-obligations/payment-plan/update-quota',
      expectedApiBody
    )
  })

  it('testing _createObligationStatus', async () => {
    const store = useFinancialPlanningStoreV1()
    const mockStatusName = 'Nuevo Estado'

    const mockResponse = {
      status: 200,
      data: {
        success: true,
        message: 'Estado de obligación creado exitosamente',
      },
    }

    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    await store._createObligationStatus(mockStatusName)

    expect(mockPost).toHaveBeenCalledWith(
      'financial-obligations/api/financial-obligations/obligation-statuses/store-obligation-status',
      { name: mockStatusName }
    )
  })

  it('testing _exportFinancialPlanListXLS', async () => {
    const store = useFinancialPlanningStoreV1()
    const mockGotUrl = 'param1=value1'

    const mockBlobData = new Blob(['mock data'], {
      type: 'application/vnd.ms-excel',
    })
    const mockResponse = {
      status: 200,
      data: mockBlobData,
      headers: {
        'content-type': 'application/vnd.ms-excel',
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._exportFinancialPlanListXLS(mockGotUrl)

    expect(mockGet).toHaveBeenCalledWith(
      'financial-obligations/api/financial-obligations/payment-plan/export?param1=value1',
      { responseType: 'blob' }
    )
  })

  it('testing _loadFinancialPlanningById', async () => {
    const store = useFinancialPlanningStoreV1()
    const planningId = 123

    const mockResponse = {
      status: 200,
      data: {
        data: {
          financial_obligation_id: 123,
          number_quota: 2,
          initial_balance: '1000.00',
          interest_quota: '50.00',
          capital_quota: '950.00',
          total_quota: '1000.00',
          final_balance: '0.00',
          payment_date: '2025-12-31',
          status_quota_id: 1,
        },
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._loadFinancialPlanningById(planningId)

    expect(mockGet).toHaveBeenCalledWith(
      'financial-obligations/api/financial-obligations/payment-plan/get-data-next-quota?financial_obligation_id=123'
    )

    expect(store.createAmortizationInfo).toEqual({
      financialObligationId: 123,
      numberQuota: 2,
      initialBalance: '1000.00',
      interestQuota: '50.00',
      capitalQuota: '950.00',
      totalQuota: '1000.00',
      finalBalance: '0.00',
      paymentDate: '2025-12-31',
      statusQuotaId: 1,
    })
  })

  it('should not throw when API fails in _loadFinancialPlanningList', async () => {
    const store = useFinancialPlanningStoreV1()
    const urlId = 'page=1&id=123'

    const mockGet = jest.fn().mockRejectedValue(new Error('API failed'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await expect(store._loadFinancialPlanningList(urlId)).resolves.not.toThrow()
  })

  it('should not throw when API fails in _updateAddFinancialPlaningById', async () => {
    const store = useFinancialPlanningStoreV1()

    const mockBody = {
      financialObligationId: 123,
      numberQuota: 2,
      initialBalance: '1000.00',
      interestQuota: '50.00',
      capitalQuota: '950.00',
      totalQuota: '1000.00',
      finalBalance: '0.00',
      paymentDate: '2025-12-31',
      statusQuotaId: 1,
    }

    const mockPost = jest.fn().mockRejectedValue(new Error('API failed'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    await expect(
      store._updateAddFinancialPlaningById(mockBody)
    ).resolves.not.toThrow()
  })

  it('should not throw when API fails in _updateFinancialPlaningById', async () => {
    const store = useFinancialPlanningStoreV1()

    const mockUpdateBody = {
      financialObligationId: 123,
      numberQuota: 3,
      initialBalance: '1100.00',
      interestQuota: '60.00',
      capitalQuota: '1040.00',
      totalQuota: '1100.00',
      finalBalance: '100.00',
      paymentDate: '2026-01-15',
      statusQuotaId: 2,
    }

    const mockPut = jest.fn().mockRejectedValue(new Error('API failed'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    await expect(
      store._updateFinancialPlaningById(mockUpdateBody)
    ).resolves.not.toThrow()
  })

  it('should not throw when API fails in _updateAddFinancialPlaningById', async () => {
    const store = useFinancialPlanningStoreV1()

    const mockBody = {
      financialObligationId: 123,
      numberQuota: 2,
      initialBalance: '1000.00',
      interestQuota: '50.00',
      capitalQuota: '950.00',
      totalQuota: '1000.00',
      finalBalance: '0.00',
      paymentDate: '2025-12-31',
      statusQuotaId: 1,
    }

    const mockPost = jest.fn().mockRejectedValue(new Error('API failed'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    await expect(
      store._updateAddFinancialPlaningById(mockBody)
    ).resolves.not.toThrow()
  })

  it('should not throw when API fails in _updateFinancialPlaningById', async () => {
    const store = useFinancialPlanningStoreV1()

    const mockBody = {
      financialObligationId: 123,
      numberQuota: 3,
      initialBalance: '1100.00',
      interestQuota: '60.00',
      capitalQuota: '1040.00',
      totalQuota: '1100.00',
      finalBalance: '100.00',
      paymentDate: '2026-01-15',
      statusQuotaId: 2,
    }

    const mockPut = jest.fn().mockRejectedValue(new Error('API failed'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    await expect(
      store._updateFinancialPlaningById(mockBody)
    ).resolves.not.toThrow()
  })

  it('should not throw when API fails in _createObligationStatus', async () => {
    const store = useFinancialPlanningStoreV1()
    const mockPost = jest.fn().mockRejectedValue(new Error('API failed'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    await expect(
      store._createObligationStatus('Estado X')
    ).resolves.not.toThrow()
  })
  it('should not throw when API fails in _exportFinancialPlanListXLS', async () => {
    const store = useFinancialPlanningStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('API failed'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await expect(
      store._exportFinancialPlanListXLS('param=value')
    ).resolves.not.toThrow()
  })

  it('should set statusQuotaId to 1 if status_quota_id is null', async () => {
    const store = useFinancialPlanningStoreV1()

    ;(executeApi as jest.Mock).mockReturnValue({
      get: jest.fn().mockResolvedValue({
        status: true,
        data: {
          data: {
            financial_obligation_id: 1,
            number_quota: 1,
            initial_balance: 1000,
            interest_quota: 10,
            capital_quota: 100,
            total_quota: 110,
            final_balance: 890,
            payment_date: '2025-06-18',
            status_quota_id: null,
          },
        },
      }),
    })

    await store._loadFinancialPlanningById(1)

    expect(store.createAmortizationInfo?.statusQuotaId).toBe(1)
  })

  it('should set statusQuotaId to the value when status_quota_id is not null', async () => {
    const store = useFinancialPlanningStoreV1()

    ;(executeApi as jest.Mock).mockReturnValue({
      get: () =>
        Promise.resolve({
          status: 200,
          data: {
            data: {
              financial_obligation_id: 1,
              number_quota: 1,
              initial_balance: 1000,
              interest_quota: 10,
              capital_quota: 100,
              total_quota: 110,
              final_balance: 890,
              payment_date: '2025-06-18',
              status_quota_id: 2,
            },
          },
        }),
    })

    await store._loadFinancialPlanningById(1)

    expect(store.createAmortizationInfo?.statusQuotaId).toBe(2)
  })
})
