import { setActivePinia, createPinia } from 'pinia'
import { useBankingEntitiesAccountingParametersCommissionsStoreV1 } from './banking-entities-v1'
import { executeApi } from '@/apis'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  })),
}))

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useShowError: jest.fn(() => ({ showCatchError: jest.fn() })),
}))

jest.mock('quasar', () => ({
  Notify: {
    create: jest.fn(),
  },
}))

describe('useBankingEntitiesAccountingParametersCommissionsStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('fetches list of banking entities', async () => {
    const store = useBankingEntitiesAccountingParametersCommissionsStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: {
          current_page: 1,
          data: [
            {
              id: 13,
              bank: {
                id: 29,
                description: 'BANCO DE CARTAGENA',
                type: 'Banco',
                accounting_account: null,
                status: {
                  id: 1,
                  name: 'Activo',
                },
                code: '004',
                bank_code: '0024',
                nit: {
                  id: 148,
                  nit: '609023911',
                },
                has_movements: false,
              },
              accounting_blocks_collection: {
                id: 24,
                code: '011',
                description: 'Breve descripcion',
                collection_structure: {
                  id: 9,
                  code: '009',
                  structure: '0.0.00.00.00.00.00',
                },
                accounting_structure: {
                  id: 1,
                  code: '001',
                  structure: 'PUC-2024',
                },
                cost_center_structure: {
                  id: 35,
                  code: '035',
                  structure: 'struc1',
                },
                budget_structure: {
                  id: 3,
                  code: '003',
                  structure: '0.0',
                },
                business: [
                  {
                    id: 25,
                    business_code: '445',
                    name: 'Proyecto vial del norte',
                  },
                  {
                    id: 35,
                    business_code: '446',
                    name: 'Proyecto vial del norte',
                  },
                  {
                    id: 36,
                    business_code: '447',
                    name: 'Proyecto vial del norte',
                  },
                  {
                    id: 55,
                    business_code: 'code12',
                    name: 'Proyecto vial del norte',
                  },
                  {
                    id: 56,
                    business_code: 'code123',
                    name: 'Proyecto vial del norte',
                  },
                ],
              },
              description: 'Description',
              treasury_movement_code: {
                id: 12,
                code: '0001',
                description: 'Prueba de ingreso',
                nature: 'Ingresos',
                operation: 'Movimiento',
                generate_special_contribution: true,
                handles_accounting_offset: true,
                conciliation_movement: true,
                transfer_investments: false,
                transfer_accounts: false,
                receipt_types_id: 7,
                sub_receipt_types_id: 4,
                move_override: null,
              },
              validates_collection_method: true,
              commission_rate: '% Comisión',
              commission_percentage: '12.00000',
              fixed_value: '12.00000',
              observations: 'observaciones',
              created_by: 14051,
              updated_by: 14051,
            },
          ],
          first_page_url:
            'http://internal-microservices-alb-629888295.us-east-1.elb.amazonaws.com/dev/api/treasuries/accounting_parameters_commissions/bank_entities?accounting_blocks_collection_id=24&paginate=1&page=1',
          from: 1,
          last_page: 1,
          last_page_url:
            'http://internal-microservices-alb-629888295.us-east-1.elb.amazonaws.com/dev/api/treasuries/accounting_parameters_commissions/bank_entities?accounting_blocks_collection_id=24&paginate=1&page=1',
          links: [
            {
              url: null,
              label: '&laquo; Anterior',
              active: false,
            },
            {
              url: 'http://internal-microservices-alb-629888295.us-east-1.elb.amazonaws.com/dev/api/treasuries/accounting_parameters_commissions/bank_entities?accounting_blocks_collection_id=24&paginate=1&page=1',
              label: '1',
              active: true,
            },
            {
              url: null,
              label: 'Siguiente &raquo;',
              active: false,
            },
          ],
          next_page_url: null,
          path: 'http://internal-microservices-alb-629888295.us-east-1.elb.amazonaws.com/dev/api/treasuries/accounting_parameters_commissions/bank_entities',
          per_page: 20,
          prev_page_url: null,
          to: 1,
          total: 1,
        },
        message: 'Listado obtenido exitosamente.',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getListAction()

    expect(mockGet).toHaveBeenCalled()
    expect(store.banking_entities_list).toHaveLength(1)
  })

  it('fetches banking entity by ID', async () => {
    const store = useBankingEntitiesAccountingParametersCommissionsStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: {
          id: 10,
          accounting_blocks_collection: {
            id: 23,
            code: '010',
            description: '0009',
            collection_structure: {
              id: 2,
              code: '002',
              structure: '0',
            },
            accounting_structure: {
              id: 12,
              code: '012',
              structure: '0.0.00.00.00.00.00.00.00.00',
            },
            cost_center_structure: {
              id: 39,
              code: '039',
              structure: 'final1',
            },
            budget_structure: {
              id: 3,
              code: '003',
              structure: '0.0',
            },
            business: [],
          },
          bank: {
            id: 29,
            description: 'BANCO DE CARTAGENA',
            type: 'Banco',
            accounting_account: null,
            status: {
              id: 1,
              name: 'Activo',
            },
            code: '004',
            bank_code: '0024',
            nit: {
              id: 148,
              nit: '609023911',
            },
            has_movements: false,
          },
          description: 'Prueba',
          treasury_movement_code_id: {
            id: 12,
            code: '0001',
            description: 'Prueba de ingreso',
            nature: 'Ingresos',
            operation: 'Movimiento',
            generate_special_contribution: true,
            handles_accounting_offset: true,
            conciliation_movement: true,
            transfer_investments: false,
            transfer_accounts: false,
            receipt_types_id: 7,
            sub_receipt_types_id: 4,
            move_override: null,
          },
          validates_collection_method: false,
          commission_rate: 'Valor Fijo',
          commission_percentage: '15.00000',
          fixed_value: '99.00000',
          observations: 'hola 15',
          created_by: 14051,
          updated_by: 14051,
        },
        message: 'Registro obtenido exitosamente.',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdBankingEntitiesAccountingParametersCommissions(1)

    expect(mockGet).toHaveBeenCalledWith(
      'treasuries/api/treasuries/accounting_parameters_commissions/bank_entities/1'
    )
    expect(store.type_banking_entities_request).toBeDefined()
  })

  it('creates a banking entity', async () => {
    const store = useBankingEntitiesAccountingParametersCommissionsStoreV1()
    const payload = {
      bank_id: 121,
      description: 'Comisión por recaudo en banco X',
      accounting_blocks_collection_id: 23,
      treasury_movement_code_id: 18,
      validates_collection_method: true,
      commission_rate: 'Valor Fijo',
      commission_percentage: 5.75,
      fixed_value: 15,
      observations: 'Aplica solo a recaudos mayores a $1,000,000',
    }

    const mockPost = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: [],
        message: 'Registro creado exitosamente.',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const success =
      await store._createBankingEntitiesAccountingParametersCommissions(payload)

    expect(mockPost).toHaveBeenCalledWith(
      'treasuries/api/treasuries/accounting_parameters_commissions/bank_entities',
      payload
    )
    expect(success).toBe(true)
  })

  it('updates a banking entity', async () => {
    const store = useBankingEntitiesAccountingParametersCommissionsStoreV1()
    const payload = {
      bank_id: 11,
      description: 'Comisión por recaudo en banco X',
      accounting_blocks_collection_id: 23,
      treasury_movement_code_id: 1,
      validates_collection_method: true,
      commission_rate: '% Comisión',
      commission_percentage: 5.75,
      fixed_value: null,
      observations: 'Aplica solo a recaudos mayores a $1,000,000.00',
    }

    const mockPut = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: [],
        message: 'Registro actualizado exitosamente.',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const success =
      await store._updateBankingEntitiesAccountingParametersCommissions(
        payload,
        1
      )

    expect(mockPut).toHaveBeenCalledWith(
      'treasuries/api/treasuries/accounting_parameters_commissions/bank_entities/1',
      payload
    )
    expect(success).toBe(true)
  })

  it('deletes a banking entity', async () => {
    const store = useBankingEntitiesAccountingParametersCommissionsStoreV1()
    const mockDelete = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: [],
        message: 'Registro eliminado exitosamente.',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    await store._deleteBankingEntitiesAccountingParametersCommissions(1)

    expect(mockDelete).toHaveBeenCalledWith(
      'treasuries/api/treasuries/accounting_parameters_commissions/bank_entities/1'
    )
  })

  it('handles error when fetching list fails', async () => {
    const store = useBankingEntitiesAccountingParametersCommissionsStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getListAction()
    expect(mockGet).toHaveBeenCalled()
    expect(store.banking_entities_list).toHaveLength(0)
  })

  it('handles error when fetching by ID fails', async () => {
    const store = useBankingEntitiesAccountingParametersCommissionsStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdBankingEntitiesAccountingParametersCommissions(1)
    expect(mockGet).toHaveBeenCalled()
    expect(store.type_banking_entities_request).toBeNull()
  })

  it('handles error when creating fails', async () => {
    const store = useBankingEntitiesAccountingParametersCommissionsStoreV1()
    const payload = {
      bank_id: 11,
      description: 'Comisión por recaudo en banco X',
      accounting_blocks_collection_id: 23,
      treasury_movement_code_id: 1,
      validates_collection_method: true,
      commission_rate: '% Comisión',
      commission_percentage: 5.75,
      fixed_value: null,
      observations: 'Aplica solo a recaudos mayores a $1,000,000.00',
    }
    const mockPost = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const success =
      await store._createBankingEntitiesAccountingParametersCommissions(payload)
    expect(mockPost).toHaveBeenCalled()
    expect(success).toBe(false)
  })

  it('handles error when updating fails', async () => {
    const store = useBankingEntitiesAccountingParametersCommissionsStoreV1()
    const payload = {
      bank_id: 11,
      description: 'Comisión por recaudo en banco X',
      accounting_blocks_collection_id: 23,
      treasury_movement_code_id: 1,
      validates_collection_method: true,
      commission_rate: '% Comisión',
      commission_percentage: 5.75,
      fixed_value: null,
      observations: 'Aplica solo a recaudos mayores a $1,000,000.00',
    }
    const mockPut = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const success =
      await store._updateBankingEntitiesAccountingParametersCommissions(
        payload,
        1
      )
    expect(mockPut).toHaveBeenCalled()
    expect(success).toBe(false)
  })

  it('handles error when deleting fails', async () => {
    const store = useBankingEntitiesAccountingParametersCommissionsStoreV1()
    const mockDelete = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    await store._deleteBankingEntitiesAccountingParametersCommissions(1)
    expect(mockDelete).toHaveBeenCalled()
  })

  it('handles unsuccessful response in _getListAction', async () => {
    const store = useBankingEntitiesAccountingParametersCommissionsStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: false,
        data: {},
        message: 'Error',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
    await store._getListAction()
    expect(store.banking_entities_list).toEqual([])
  })

  it('handles unsuccessful response in _getByIdBankingEntitiesAccountingParametersCommissions', async () => {
    const store = useBankingEntitiesAccountingParametersCommissionsStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: false,
        data: {},
        message: 'Error',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
    await store._getByIdBankingEntitiesAccountingParametersCommissions(1)
    expect(store.type_banking_entities_request).toBeNull()
  })

  it('should set error_information_form when _createBankingEntitiesAccountingParametersCommissions receives error with valid message', async () => {
    const store = useBankingEntitiesAccountingParametersCommissionsStoreV1()
    const payload = {
      bank_id: 1,
      description: 'desc',
      accounting_blocks_collection_id: 1,
      treasury_movement_code_id: 1,
      validates_collection_method: true,
      commission_rate: 'Valor Fijo',
      commission_percentage: 1,
      fixed_value: 1,
      observations: 'obs',
    }
    const error = {
      response: { data: { message: 'Mensaje válido' } },
    }
    const mockPost = jest.fn().mockRejectedValue(error)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })
    const result =
      await store._createBankingEntitiesAccountingParametersCommissions(payload)
    expect(store.error_information_form).toBe('Mensaje válido')
    expect(result).toBe(false)
  })

  it('should set error_information_form to null when _createBankingEntitiesAccountingParametersCommissions receives error with invalid message', async () => {
    const store = useBankingEntitiesAccountingParametersCommissionsStoreV1()
    const payload = {
      bank_id: 1,
      description: 'desc',
      accounting_blocks_collection_id: 1,
      treasury_movement_code_id: 1,
      validates_collection_method: true,
      commission_rate: 'Valor Fijo',
      commission_percentage: 1,
      fixed_value: 1,
      observations: 'obs',
    }
    const error = {
      response: { data: { message: 123 } },
    }
    const mockPost = jest.fn().mockRejectedValue(error)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })
    const result =
      await store._createBankingEntitiesAccountingParametersCommissions(payload)
    expect(store.error_information_form).toBeNull()
    expect(result).toBe(false)
  })

  it('should set error_information_form when _updateBankingEntitiesAccountingParametersCommissions receives error with valid message', async () => {
    const store = useBankingEntitiesAccountingParametersCommissionsStoreV1()
    const payload = {
      bank_id: 1,
      description: 'desc',
      accounting_blocks_collection_id: 1,
      treasury_movement_code_id: 1,
      validates_collection_method: true,
      commission_rate: 'Valor Fijo',
      commission_percentage: 1,
      fixed_value: 1,
      observations: 'obs',
    }
    const error = {
      response: { data: { message: 'Mensaje válido' } },
    }
    const mockPut = jest.fn().mockRejectedValue(error)
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })
    const result =
      await store._updateBankingEntitiesAccountingParametersCommissions(
        payload,
        1
      )
    expect(store.error_information_form).toBe('Mensaje válido')
    expect(result).toBe(false)
  })

  it('should set error_information_form to null when _updateBankingEntitiesAccountingParametersCommissions receives error with invalid message', async () => {
    const store = useBankingEntitiesAccountingParametersCommissionsStoreV1()
    const payload = {
      bank_id: 1,
      description: 'desc',
      accounting_blocks_collection_id: 1,
      treasury_movement_code_id: 1,
      validates_collection_method: true,
      commission_rate: 'Valor Fijo',
      commission_percentage: 1,
      fixed_value: 1,
      observations: 'obs',
    }
    const error = {
      response: { data: { message: 123 } },
    }
    const mockPut = jest.fn().mockRejectedValue(error)
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })
    const result =
      await store._updateBankingEntitiesAccountingParametersCommissions(
        payload,
        1
      )
    expect(store.error_information_form).toBeNull()
    expect(result).toBe(false)
  })

  it('should set data_information_form with _setDataInformationForm', () => {
    const store = useBankingEntitiesAccountingParametersCommissionsStoreV1()
    const data = {
      bank_id: 1,
      description: 'desc',
      accounting_blocks_collection_id: 1,
      treasury_movement_code_id: 1,
      validates_collection_method: true,
      commission_rate: 'Valor Fijo',
      commission_percentage: 1,
      fixed_value: 1,
      observations: 'obs',
    }
    store._setDataInformationForm(data)
    expect(store.data_information_form).toEqual(data)
    store._setDataInformationForm(null)
    expect(store.data_information_form).toBeNull()
  })

  it('isValidMessageLike returns true for string', () => {
    const store = useBankingEntitiesAccountingParametersCommissionsStoreV1()
    expect(store._isValidMessageLike('mensaje')).toBe(true)
  })

  it('isValidMessageLike returns false for non-string', () => {
    const store = useBankingEntitiesAccountingParametersCommissionsStoreV1()
    expect(store._isValidMessageLike(123 as unknown as string)).toBe(false)
  })

  it('fetches banking entities by collection id (success)', async () => {
    const store = useBankingEntitiesAccountingParametersCommissionsStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: [{ id: 1 }],
        message: 'ok',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
    await store._getBankingEntitiesAccountingParametersCommissionsList('',1)
    expect(store.banking_entities_list).toEqual([])
  })

  it('fetches banking entities by collection id (fail)', async () => {
    const store = useBankingEntitiesAccountingParametersCommissionsStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: false,
        data: [],
        message: 'fail',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
    await store._getBankingEntitiesAccountingParametersCommissionsList('',1)
    expect(store.banking_entities_list).toEqual([])
  })

  it('handles error in _getBankingEntitiesAccountingParametersCommissionsList', async () => {
    const store = useBankingEntitiesAccountingParametersCommissionsStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
    await store._getBankingEntitiesAccountingParametersCommissionsList('',1)
    expect(store.banking_entities_list).toEqual([])
  })
})
