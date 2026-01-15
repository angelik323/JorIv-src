import { setActivePinia, createPinia } from 'pinia'
import { useAuthorizationTreasuryStoreV1 } from '@/stores/treasury/authorization-treasury/authorization-treasury-v1'
import { executeApi } from '@/apis'
import { URL_PATH_TREASURIES } from '@/constants/apis'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
  })),
}))

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({
    showAlert: jest.fn(),
  })),
  useShowError: jest.fn(() => ({
    showCatchError: jest.fn(() => 'Error inesperado'),
  })),
  useUtils: jest.fn(() => ({
    saveTextFileWithFallback: jest.fn(),
  })),
}))

describe('useAuthorizationTreasuryStoreV1', () => {
  let store: ReturnType<typeof useAuthorizationTreasuryStoreV1>
  const filters = 'filter[search]=ABC123'
  const url = `${URL_PATH_TREASURIES}/treasury-authorizations?paginate=1&${filters}`

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useAuthorizationTreasuryStoreV1()
    jest.clearAllMocks()
  })

  it('fetches authorization treasury list successfully', async () => {
    // Arrange
    const mockList = [{ id: 1, code: 'XYZ', description: 'Registro de prueba' }]

    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Lista obtenida',
        data: {
          data: mockList,
          current_page: 1,
          last_page: 2,
        },
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getAuthorizationTreasuryList(filters)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(url)
    expect(store.authorization_treasury_list).toEqual(mockList)
    expect(store.authorization_treasury_pages).toEqual({
      currentPage: 1,
      lastPage: 2,
    })
  })

  it('handles empty authorization treasury response', async () => {
    // Arrage
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: false,
        message: 'Sin datos',
        data: {
          data: undefined,
          current_page: 0,
          last_page: 0,
        },
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getAuthorizationTreasuryList(filters)

    // Assert
    expect(store.authorization_treasury_list).toEqual([])
    expect(store.authorization_treasury_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
  })

  it('handles API error when fetching authorization treasury', async () => {
    // Arrange
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getAuthorizationTreasuryList(filters)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(url)
    expect(store.authorization_treasury_list).toEqual([])
    expect(store.authorization_treasury_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
  })

  it('fetches authorization treasury by ID successfully', async () => {
    // Arrange
    const mockResponse = {
      id: 11,
      authorization_type: 'expense',
      authorization_type_label: 'Egresos',
      office_id: 1,
      office_name: 'Oficina Principal',
      business_trust_id: 17,
      business_trust_name: 'Negocio Ejemplo',
      bank_id: 1,
      bank_name: 'Bancolombia',
      bank_account_id: 1,
      bank_account_name: 'nombre de cuenta',
      status: {
        id: 30,
        name: 'Errores',
      },
      authorization_date: null,
      rejection_reason: 'prueba documento',
      authorized_by: null,
      created_by: {
        id: 1,
        name: 'Camilo',
      },
      updated_by: {
        id: null,
        name: 'Sin información',
      },
      bank: {
        id: 1,
        code: 'Sin información',
        description: 'Bancolombia',
      },
      bank_account: {
        id: 1,
        account_number: '2387428341235433',
        account_name: 'nombre de cuenta',
      },
      expense_details: {
        date: '2025-06-04',
        voucher: 'VX123',
        sub_voucher: 'SV001',
        movement: {
          id: 1,
          code: '0001',
          description: 'Velit distinctio et illum.',
        },
        business: {
          id: 17,
          name: 'Animi enim quis dolor unde neque.',
        },
        total_amount: 1000.5,
        details_count: 1,
      },
      expense_items: [
        {
          id: 21,
          effective_date: '2025-06-04',
          concept: 'Pago proveedor',
          value: '1000.50',
          foreign_currency_value: '123333.00',
          local_currency_value_total: '3900750.00',
          coin: 'USD',
          trm: '4000.00',
          instructions: 'instrucc',
          payment_method: {
            id: 1,
            description: 'Rerum enim.',
            type: 'Efectivo',
          },
          third_party: {
            id: 1,
            name: 'Sin información',
            document: '498295161',
            person_type: 'Sin información',
          },
          cash_flow: {
            id: 1,
            name: 'flujo caja',
          },
          cost_center: {
            id: 1,
            name: 'Howell PLC',
          },
          bank: {
            id: 1,
            name: 'Bancolombia',
            code: 'Sin información',
          },
          bank_account: {
            id: 1,
            account_number: '2387428341235433',
            account_name: 'nombre de cuenta',
            handles_checkbook: false,
          },
          beneficiary_bank: {
            id: 1,
            name: 'Bancolombia',
          },
          beneficiary_bank_account: 1,
          beneficiary_account_type: 'Sin información',
          bank_branch: {
            id: 1,
            name: 'Caja Principal',
          },
          authorized_document: {
            id: 1,
            type: 'Cédula de ciudadanía',
            identification: 'Sin información',
          },
          status: 'Registrado',
          check_info: null,
        },
      ],
      created_at: '2025-07-15 22:03:07',
      updated_at: '2025-07-15 23:07:23',
    }

    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Movimiento obtenido',
        data: mockResponse,
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getByIdAuthorizationTreasury(1, 'expense')

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/treasury-authorizations/1/expense`
    )
    expect(store.authorization_treasury_response).toEqual(mockResponse)
  })

  it('handles API error when fetching authorization treasury by ID', async () => {
    // Arrange
    const mockGet = jest.fn().mockRejectedValue(new Error('Error de red'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getByIdAuthorizationTreasury(1, 'expense')

    // Assert
    expect(store.authorization_treasury_response).toEqual({})
  })

  it('handles response with success false in _getByIdAuthorizationTreasury', async () => {
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: false,
        message: 'Sin datos',
        data: null,
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdAuthorizationTreasury(999, 'expense')
    expect(store.authorization_treasury_response).toEqual({})
  })

  it('handles response with success true and no data in _getByIdAuthorizationTreasury', async () => {
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Sin datos',
        data: undefined,
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdAuthorizationTreasury(123, 'expense')

    expect(store.authorization_treasury_response).toEqual({})
  })

  it('authorizes request successfully', async () => {
    // Arrange
    const mockPost = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Autorizado correctamente',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._authorizeRequest({
      record_ids: [1],
      record_type: 'expense',
      observations: 'observation',
    })

    // Assert
    expect(result).toBe(true)
    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/treasury-authorizations/bulk-authorize`,
      {
        record_ids: [1],
        record_type: 'expense',
        observations: 'observation',
      }
    )
  })

  it('handles error in _authorizeRequest', async () => {
    // Arrange
    const mockPost = jest.fn().mockRejectedValue(new Error('Error de red'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._authorizeRequest({
      record_ids: [1],
      record_type: 'expense',
      observations: 'observation',
    })

    // Assert
    expect(result).toBe(false)
  })

  it('returns false if _authorizeRequest responds with success=false', async () => {
    // Arrange
    const mockPost = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Error del servidor' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._authorizeRequest({
      record_ids: [1],
      record_type: 'expense',
      observations: 'observation',
    })

    // Assert
    expect(result).toBe(false)
  })

  it('rejects request successfully', async () => {
    // Arrange
    const mockPost = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Rechazado correctamente',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._rejectRequest({
      record_ids: [1],
      record_type: 'expense',
      rejection_reason: 'reject',
    })

    // Assert
    expect(result).toBe(true)
    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/treasury-authorizations/bulk-reject`,
      {
        record_ids: [1],
        record_type: 'expense',
        rejection_reason: 'reject',
      }
    )
  })

  it('handles error in _rejectRequest', async () => {
    // Arrange
    const mockPost = jest.fn().mockRejectedValue(new Error('Falla de red'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._rejectRequest({
      record_ids: [1],
      record_type: 'expense',
      rejection_reason: 'reject',
    })

    // Assert
    expect(result).toBe(false)
  })

  it('returns false if _rejectRequest responds with success=false', async () => {
    // Arrange
    const mockPost = jest.fn().mockResolvedValue({
      data: { success: false, message: 'No se pudo rechazar' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._rejectRequest({
      record_ids: [1],
      record_type: 'expense',
      rejection_reason: 'reject',
    })

    // Assert
    expect(result).toBe(false)
  })

  it('sets selected data correctly', () => {
    // Arrange
    const selection = [
      {
        id: 11,
        type: 'expense',
        record: {
          id: 11,
          authorization_type: 'expense',
          authorization_type_label: 'Egresos',
          office_id: 1,
          office_name: 'Oficina Principal',
          business_trust_id: 4,
          business_trust_name: 'Negocio Ejemplo',
          bank_id: 1,
          bank_name: 'Bancolombia',
          bank_account_id: 1,
          bank_account_name: 'nombre de cuenta',
          status: {
            id: 63,
            name: 'Registrado',
          },
          authorization_date: null,
          rejection_reason: null,
          authorized_by: null,
          created_by: {
            id: 1,
            name: 'Camilo',
          },
          updated_by: {
            id: null,
            name: 'Sin información',
          },
          bank: {
            id: 1,
            code: 'Sin información',
            description: 'Bancolombia',
          },
          bank_account: {
            id: 1,
            account_number: '2387428341235433',
            account_name: 'nombre de cuenta',
          },
          expense_details: {
            date: '2025-06-04',
            voucher: 'VX123',
            sub_voucher: 'SV001',
            movement: {
              id: 2,
              code: '0002',
              description: 'Qui molestiae magni exercitationem.',
            },
            business: {
              id: 4,
              name: 'Hic illo pariatur at.',
              code: 'NEG-004',
            },
            total_amount: 1000.5,
            details_count: 1,
          },
          expense_items: [
            {
              id: 21,
              effective_date: '2025-06-04',
              concept: 'Pago proveedor',
              value: '1000.50',
              foreign_currency_value: '123333.00',
              local_currency_value_total: '3900750.00',
              coin: 'USD',
              trm: '4000.00',
              instructions: 'instrucc',
              payment_method: {
                id: 1,
                description: 'Rerum enim.',
                type: 'Efectivo',
              },
              third_party: {
                id: 1,
                name: 'Sin información',
                document: '498295161',
                person_type: 'Sin información',
              },
              cash_flow: {
                id: 1,
                name: 'flujo caja',
                code: 'FC-001',
              },
              cost_center: {
                id: 1,
                name: 'Howell PLC',
              },
              bank: {
                id: 1,
                name: 'Bancolombia',
                code: 'Sin información',
              },
              bank_account: {
                id: 1,
                account_number: '2387428341235433',
                account_name: 'nombre de cuenta',
                handles_checkbook: false,
              },
              beneficiary_bank: {
                id: 1,
                name: 'Bancolombia',
                code: 'Sin información',
              },
              beneficiary_bank_account: 1,
              beneficiary_account_type: 'Sin información',
              bank_branch: {
                id: 1,
                name: 'Caja Principal',
              },
              authorized_document: {
                id: 1,
                type: 'Cédula de ciudadanía',
                identification: 'Sin información',
              },
              status: 'Registrado',
              check_info: null,
            },
          ],
          created_at: '2025-07-15 22:03:07',
          updated_at: '2025-07-16 12:40:45',
        },
        total_amount: 1000.5,
        office_id: 1,
        office_name: 'Oficina Principal',
        business_id: 4,
        business_name: 'Negocio Ejemplo',
        date: '2025-06-04',
        voucher: 'VX123',
        sub_voucher: 'SV001',
      },
    ]

    // Act
    store._setDataSelection(selection)

    // Assert
    expect(store.data_selection).toEqual(selection)
  })

  it('clears selected data when null is passed', () => {
    // Arrange
    const data = null

    // Act
    store._setDataSelection(data)

    // Assert
    expect(store.data_selection).toEqual([])
  })

  it('downloads error file successfully', async () => {
    // Arrange
    const mockData = 'Archivo de errores'
    const mockGet = jest.fn().mockResolvedValue({ data: mockData })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    store.error = { recordId: [123], recordType: 'expense' }

    // Act
    const result = store._getErrorFileAuthorizationTreasury()

    // Assert
    await expect(result).resolves.not.toThrow()
  })

  it('handles error when downloading error file', async () => {
    // Arrange
    const mockGet = jest.fn().mockRejectedValue(new Error('Error descarga'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    store.error = { recordId: [123], recordType: 'expense' }

    // Act
    await store._getErrorFileAuthorizationTreasury()

    // Assert
    expect(mockGet).toHaveBeenCalled()
  })

  it('fetches bulk uploads authorization successfully', async () => {
    // Arrange
    const mockBulkUploads = [
      { id: 1, load_number: 'LOAD001' },
      { id: 2, load_number: 'LOAD002' },
    ]

    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Cargues obtenidos',
        data: mockBulkUploads,
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getBulkUploadsAuthorization()

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/treasury-bulk-uploads-authorization`
    )
    expect(store.bulk_uploads_authorization_list).toEqual([
      { label: 'LOAD001', value: 1 },
      { label: 'LOAD002', value: 2 },
    ])
  })

  it('handles empty bulk uploads authorization response', async () => {
    // Arrange
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: false,
        message: 'Sin cargues disponibles',
        data: undefined,
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getBulkUploadsAuthorization()

    // Assert
    expect(store.bulk_uploads_authorization_list).toEqual([])
  })

  it('handles API error when fetching bulk uploads authorization', async () => {
    // Arrange
    const mockGet = jest.fn().mockRejectedValue(new Error('Error de conexión'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getBulkUploadsAuthorization()

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/treasury-bulk-uploads-authorization`
    )
    expect(store.bulk_uploads_authorization_list).toEqual([])
  })
})