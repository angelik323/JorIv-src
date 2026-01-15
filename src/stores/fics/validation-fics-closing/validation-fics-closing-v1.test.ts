import { setActivePinia, createPinia } from 'pinia'
import { useValidationFicsClosingStoreV1 } from '@/stores/fics/validation-fics-closing/validation-fics-closing-v1'

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
}))

describe('useValidationFicsClosingStore', () => {
  let store: ReturnType<typeof useValidationFicsClosingStoreV1>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useValidationFicsClosingStoreV1()

    jest.clearAllMocks()
  })

  it('should fetch funds list successfully', async () => {
    const mockResponse = {
      data: {
        data: [
          {
            id: 1,
            fund_code: 'F001',
            fund_name: 'Fondo Test',
            last_closing_date: '2024-01-01',
            has_participation_types: true,
            participation_types: [],
            business_trust: {
              id: 1,
              business_code: 'BT001',
              name: 'Business Trust Test',
            },
          },
        ],
        meta: {
          current_page: 1,
          last_page: 2,
        },
        message: 'Consulta exitosa',
        success: true,
      },
    }

    mockGet.mockResolvedValue(mockResponse)

    await store._getFunds({ page: 1, rows: 20 })

    expect(store.listFunds).toHaveLength(1)
    expect(store.listFunds[0].fund_code).toBe('F001')
  })

  it('should handle error on funds list fetch', async () => {
    mockGet.mockRejectedValue(new Error('Network error'))

    await store._getFunds({ page: 1 })

    expect(store.listFunds).toHaveLength(0)
  })

  it('should validate funds successfully', async () => {
    const mockResponse = {
      data: {
        success: true,
        message: 'Validación exitosa',
      },
    }

    mockPost.mockResolvedValue(mockResponse)

    const payload = {
      funds: [{ id: 1 }, { id: 2 }],
    }

    const result = await store._validation(payload)

    expect(result).toBe(true)
    expect(mockPost).toHaveBeenCalledWith(
      expect.stringContaining('/validate'),
      payload
    )
  })

  it('should return false when validation fails in response', async () => {
    const mockResponse = {
      data: {
        success: false,
        message: 'Validación fallida',
      },
    }

    mockPost.mockResolvedValue(mockResponse)

    const result = await store._validation({ funds: [{ id: 1 }] })

    expect(result).toBe(false)
  })

  it('should handle error when validation request throws', async () => {
    mockPost.mockRejectedValue(new Error('Error en validación'))

    const result = await store._validation({ funds: [{ id: 1 }] })

    expect(result).toBe(false)
  })

  it('should fetch validation details successfully', async () => {
    const mockResponse = {
      data: {
        data: [
          {
            id: 1,
            fund_code: 'F001',
            fund_name: 'Fondo Test',
            last_closing_date: '2024-01-01',
            participation_types: [
              {
                participation_type_id: 1,
                participation_type_description: 'Tipo A',
                validations: [],
              },
            ],
          },
        ],
        success: true,
      },
    }

    mockGet.mockResolvedValue(mockResponse)

    await store._validationDetails({ page: 1 })

    expect(store.listFundsValidation).toHaveLength(1)
    expect(store.listFundsValidation[0].fund_code).toBe('F001')
  })

  it('should handle error on validation details fetch', async () => {
    mockGet.mockRejectedValue(new Error('Error'))

    await store._validationDetails({ page: 1 })

    expect(store.listFundsValidation).toHaveLength(0)
  })

  it('should undo validation successfully', async () => {
    mockPost.mockResolvedValue({
      data: {
        success: true,
        message: 'Validación deshecha correctamente',
      },
    })

    const result = await store._undoValidation({ funds: [{ id: 1 }] })

    expect(result).toBe(true)
  })

  it('should return false when undo validation fails', async () => {
    mockPost.mockResolvedValue({
      data: {
        success: false,
        message: 'Error al deshacer',
      },
    })

    const result = await store._undoValidation({ funds: [{ id: 1 }] })

    expect(result).toBe(false)
  })

  it('should handle error in undo validation (catch block)', async () => {
    mockPost.mockRejectedValue(new Error('Network error'))

    const result = await store._undoValidation({ funds: [{ id: 1 }] })

    expect(result).toBe(false)
  })

  it('should transfer participation type successfully', async () => {
    mockPost.mockResolvedValue({
      data: {
        success: true,
        message: 'Transferencia exitosa',
      },
    })

    const result = await store._transferParticipationType({
      funds: [{ id: 1 }],
    })

    expect(result).toBe(true)
  })

  it('should return false when transfer participation type fails', async () => {
    mockPost.mockResolvedValue({
      data: {
        success: false,
        message: 'Transferencia fallida',
      },
    })

    const result = await store._transferParticipationType({
      funds: [{ id: 1 }],
    })

    expect(result).toBe(false)
  })

  it('should handle error in transfer participation type (catch block)', async () => {
    mockPost.mockRejectedValue(new Error('Transfer error'))

    const result = await store._transferParticipationType({
      funds: [{ id: 1 }],
    })

    expect(result).toBe(false)
  })

  it('should fetch detailed movements successfully', async () => {
    const mockResponse = {
      data: {
        data: [
          {
            id: 1,
            value: 1000,
            movement: {
              code: 'M001',
              movement_group_code: 'MG001',
              movement_group_description: 'Grupo Test',
              user: 'user@test.com',
              origin_module_code: 'MOD001',
              origin_module_description: 'Módulo Test',
            },
          },
        ],
        success: true,
      },
    }

    mockGet.mockResolvedValue(mockResponse)

    const params = {
      'filter[participation_type_id]': 1,
      'filter[closing_date]': '2024-01-01',
      'filter[nature]': 'incomes',
    }

    await store._getDetailedMovements(params)

    expect(store.detailedMovements).toHaveLength(1)
    expect(store.detailedMovements[0].id).toBe(1)
  })

  it('should handle error on detailed movements fetch', async () => {
    mockGet.mockRejectedValue(new Error('Error'))

    await store._getDetailedMovements({
      'filter[participation_type_id]': 1,
      'filter[closing_date]': '2024-01-01',
      'filter[nature]': 'incomes',
    })

    expect(store.detailedMovements).toHaveLength(0)
  })

  it('should fetch detailed movements participation successfully', async () => {
    const mockResponse = {
      data: {
        data: {
          data: [
            {
              id: 1,
              value: 1000,
              user: 'user@test.com',
              movement_code: {
                code: 'MC001',
                process_class_id: 1,
                process_nature_id: 1,
              },
              operationType: {
                description: 'Compra',
              },
              plan: {
                code: 'P001',
              },
            },
          ],
          current_page: 1,
          last_page: 1,
        },
        success: true,
        message: 'Consulta exitosa',
      },
    }

    mockGet.mockResolvedValue(mockResponse)

    const params = {
      'filter[participation_type_id]': 1,
      'filter[closing_date]': '2024-01-01',
    }

    await store._getDetailedMovementsParticipation(params)

    expect(store.detailedMovementsParticipation).toHaveLength(1)
    expect(store.detailedMovementsParticipation[0].user).toBe('user@test.com')
  })

  it('should handle error on detailed movements participation fetch', async () => {
    mockGet.mockRejectedValue(new Error('Error'))

    await store._getDetailedMovementsParticipation({
      'filter[participation_type_id]': 1,
      'filter[closing_date]': '2024-01-01',
    })

    expect(store.detailedMovementsParticipation).toHaveLength(0)
  })

  it('should clear data correctly', () => {
    // Arrange
    store.listFunds = [
      {
        id: 1,
        fund_code: 'F001',
        fund_name: 'Test',
        last_closing_date: '2024-01-01',
        has_participation_types: false,
        participation_types: [],
        business_trust: {
          id: 1,
          business_code: 'BT001',
          name: 'Business Trust Test',
        },
        consolidation_option: undefined,
        status: { id: 76, status: 'Validado', comments: null },
      },
    ]
    store.listFundsValidation = [
      {
        id: 1,
        fund_code: 'F001',
        fund_name: 'Test',
        last_closing_date: '2024-01-01',
        participation_types: [],
      },
    ]
    store.detailedMovements = [
      {
        id: 1,
        value: '100',
        movement: {
          id: 1,
          code: 'M001',
          description: 'Movement Test',
          movement_type_id: 1,
          movement_type_code: 'MT001',
          movement_type_description: 'Type Test',
          movement_class_id: 1,
          movement_class_code: 'MC001',
          movement_class_description: 'Class Test',
          movement_group_id: 1,
          movement_group_code: 'MG001',
          movement_group_description: 'Group Test',
          movement_nature_id: 1,
          movement_nature_code: 'MN001',
          movement_nature_description: 'Nature Test',
          origin_module_id: 1,
          origin_module_code: 'MOD001',
          origin_module_description: 'Module Test',
          annulment_movement: 'No',
          real_estate_movement: 'No',
          generate_accounting: false,
          operation_class: 'Class Test',
          user: 'user@test.com',
          consolidated_code: 'CONS001',
          distribution_code: 'DIST001',
          withholding_base: '0',
          created_at: '2024-01-01T00:00:00.000Z',
          updated_at: '2024-01-01T00:00:00.000Z',
        },
      },
    ]
    store.detailedMovementsParticipation = [
      {
        id: 1,
        code: 'CODE001',
        value: '100',
        user: 'test',
        movement_code: {
          id: 1,
          code: 'MC001',
          description: 'Movement Code Test',
          process_type_id: 1,
          process_nature_id: 1,
          process_class_id: 1,
          movement_code_id: 1,
          created_at: '2024-01-01T00:00:00.000Z',
          updated_at: '2024-01-01T00:00:00.000Z',
        },
        operationType: {
          id: 1,
          description: 'Test',
        },
        plan: {
          id: 1,
          code: 'P001',
        },
        fund: {
          id: 1,
          code: 'F001',
          name: 'Fund Test',
        },
        balance: 100,
        created_at: '2024-01-01T00:00:00.000Z',
      },
    ]

    // Act
    store._clearData()

    // Assert
    expect(store.listFunds).toEqual([])
    expect(store.listFundsValidation).toEqual([])
    expect(store.detailedMovements).toEqual([])
    expect(store.detailedMovementsParticipation).toEqual([])
  })
})
