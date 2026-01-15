import { setActivePinia, createPinia } from 'pinia'
import { useAssignmentBankAccountsStoreV1 } from '@/stores/treasury/assignment-bank-accounts/assignment-bank-accounts-v1'
import {
  IAssignmentBankAccountsItem,
  IMovementCode,
} from '@/interfaces/customs'

const mockGet = jest.fn()
const mockPost = jest.fn()

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: mockGet,
    post: mockPost,
  })),
}))

const mockShowAlert = jest.fn()
const mockShowCatchError = jest.fn().mockReturnValue('Error procesando')

jest.mock('@/composables', () => ({
  useAlert: () => ({ showAlert: mockShowAlert }),
  useShowError: () => ({ showCatchError: mockShowCatchError }),
}))

describe('useAssignmentBankAccountsStoreV1', () => {
  let store: ReturnType<typeof useAssignmentBankAccountsStoreV1>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useAssignmentBankAccountsStoreV1()
    jest.clearAllMocks()
  })

  it('debe obtener lista de cuentas bancarias con paginación', async () => {
    const mockResponse = {
      data: {
        data: {
          data: [
            { id: 1, account_number: '123' },
          ] as IAssignmentBankAccountsItem[],
          current_page: 1,
          last_page: 2,
        },
        message: 'Consulta exitosa',
        success: true,
      },
    }
    mockGet.mockResolvedValue(mockResponse)

    await store._getAssignmentBankAccountsList(
      'BUS',
      '2025-08-08',
      '&search=test'
    )

    expect(store.assignment_bank_accounts_list).toHaveLength(1)
    expect(store.assignment_bank_accounts.currentPage).toBe(1)
    expect(store.assignment_bank_accounts.lastPage).toBe(2)
  })

  it('debe manejar error al obtener lista de cuentas bancarias', async () => {
    mockGet.mockRejectedValue(new Error('Error'))
    await store._getAssignmentBankAccountsList('BUS', '2025-08-08', '')

    expect(store.assignment_bank_accounts_list).toHaveLength(0)
    expect(mockShowCatchError).toHaveBeenCalled()
  })

  it('debe obtener lista de códigos de movimiento', async () => {
    const mockResponse = {
      data: {
        success: true,
        data: {
          data: [{ description: 'M001' }] as IMovementCode[],
        },
        message: 'Códigos obtenidos',
      },
    }
    mockGet.mockResolvedValue(mockResponse)

    await store._getMovementCodeList('&page=1')

    expect(store.assignment_bank_accounts_movement_codes_list).toHaveLength(1)
  })

  it('debe manejar error al obtener lista de códigos de movimiento', async () => {
    mockGet.mockRejectedValue(new Error('Error'))
    await store._getMovementCodeList('')

    expect(store.assignment_bank_accounts_movement_codes_list).toHaveLength(0)
  })

  it('debe crear lista de asignación de cuentas bancarias correctamente', async () => {
    mockPost.mockResolvedValue({
      data: {
        success: true,
        message: 'Creado correctamente',
      },
    })

    const result = await store._createAssignmentBankAccountsList({
      key: 'value',
    })

    expect(result).toBe(true)
  })

  it('debe manejar error al crear lista de asignación de cuentas bancarias', async () => {
    mockPost.mockRejectedValue(new Error('Error'))
    const result = await store._createAssignmentBankAccountsList({})

    expect(result).toBe(false)
  })
})
