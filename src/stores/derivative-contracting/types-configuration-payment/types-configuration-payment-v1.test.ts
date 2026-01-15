import { setActivePinia, createPinia } from 'pinia'
import { useTypesConfigurationPaymentStoreV1 } from '@/stores/derivative-contracting/types-configuration-payment/types-configuration-payment-v1'
import { executeApi } from '@/apis'
import { ITypePaymentConfigurationForm } from '@/interfaces/customs/derivative-contracting/TypePaymentsConfiguration'

const URL_PATH_DERIVATIVE_CONTRACTING = 'derivative-contracting/api/derivative-contracting'
const URL_PATH_PAYMENT_TYPE = `${URL_PATH_DERIVATIVE_CONTRACTING}/payment-type`

const mockPaymentTypesList = [
  {
    id: 3,
    code: '002',
    name: 'Abono',
    status: { id: 1, name: 'Activo' },
    payment_type: 'Parcial',
    require_authorization: false,
    referential_information: false,
    created_at: '2025-10-07 21:35:50',
    updated_at: '2025-10-07 21:35:50',
    inactivated_at: null,
    creator: { id: 1, document: '6929658973', name: 'Camilo', last_name: 'Loaiza' },
    updater: null,
    inactivator: null
  },
  {
    id: 2,
    code: '001',
    name: 'Abono',
    status: { id: 1, name: 'Activo' },
    payment_type: 'Parcial',
    require_authorization: false,
    referential_information: false,
    created_at: '2025-10-07 21:33:18',
    updated_at: '2025-10-07 21:33:18',
    inactivated_at: null,
    creator: { id: 1, document: '6929658973', name: 'Camilo', last_name: 'Loaiza' },
    updater: null,
    inactivator: null
  }
]

const mockPaymentTypeResponse = {
  id: 3,
  code: '002',
  name: 'Abono',
  status: { id: 1, name: 'Activo' },
  payment_type: 'Parcial',
  require_authorization: false,
  referential_information: false,
  created_at: '2025-10-07 21:35:50',
  updated_at: '2025-10-07 21:35:50',
  inactivated_at: null,
  creator: { id: 1, document: '6929658973', name: 'Camilo', last_name: 'Loaiza' },
  updater: null,
  inactivator: null
}

// ==== Global mocks ====
jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn()
  }))
}))

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useShowError: jest.fn(() => ({ showCatchError: jest.fn(() => 'Error!') }))
}))

describe('useTypesConfigurationPaymentStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('should fetch list of payment types', async () => {
    const store = useTypesConfigurationPaymentStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: { success: true, data: mockPaymentTypesList, message: 'Listado obtenido exitosamente.' },
      status: 200
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
    const params = 'paginate=true&page=1'

    await store._getPaymentTypes(params)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH_PAYMENT_TYPE}?${params}`)
    expect(store.types_configuration_payment_list).toEqual(mockPaymentTypesList)
    expect(store.type_payment).toEqual([])
  })

  it('should fetch payment type by ID', async () => {
    const store = useTypesConfigurationPaymentStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: { success: true, data: mockPaymentTypeResponse, message: 'Registro encontrado.' },
      status: 200
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdTypeConfigurationPayment(3)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH_PAYMENT_TYPE}/3`)
    expect(store.type_received_request).toEqual(mockPaymentTypeResponse)
  })

  it('should create a payment type configuration', async () => {
    const store = useTypesConfigurationPaymentStoreV1()
    const payload: ITypePaymentConfigurationForm = {
      code: '003',
      name: 'Pago total',
      payment_type: 'Total',
      require_authorization: false,
      referential_information: false,
      status_id: 1
    } as ITypePaymentConfigurationForm
    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Creado correctamente.' }
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createTypeConfigurationPayment(payload)

    expect(mockPost).toHaveBeenCalledWith(`${URL_PATH_PAYMENT_TYPE}`, payload)
    expect(result).toBe(true)
  })

  it('should update a payment type configuration', async () => {
    const store = useTypesConfigurationPaymentStoreV1()
    const payload: ITypePaymentConfigurationForm = {
      code: '002',
      name: 'Abono',
      payment_type: 'Parcial',
      require_authorization: true,
      referential_information: true,
      status_id: 1
    } as ITypePaymentConfigurationForm
    const mockPut = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Actualizado correctamente.' }
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateTypeConfigurationPayment(payload, 3)

    expect(mockPut).toHaveBeenCalledWith(`${URL_PATH_PAYMENT_TYPE}/3`, payload)
    expect(result).toBe(true)
  })

  it('should delete a payment type configuration', async () => {
    const store = useTypesConfigurationPaymentStoreV1()
    const mockDelete = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Eliminado.' }
    })
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    const result = await store._deleteTypeConfigurationPayment(2)

    expect(mockDelete).toHaveBeenCalledWith(`${URL_PATH_PAYMENT_TYPE}/2`)
    expect(result).toBe(true)
  })

  it('should activate a payment type configuration', async () => {
    const store = useTypesConfigurationPaymentStoreV1()
    const mockPatch = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Activado.' }
    })
    ;(executeApi as jest.Mock).mockReturnValue({ patch: mockPatch })

    const result = await store._activateTypeConfigurationPayment(2)

    expect(mockPatch).toHaveBeenCalledWith(`${URL_PATH_PAYMENT_TYPE}/2/activate`)
    expect(result).toBe(true)
  })

  it('should inactivate a payment type configuration', async () => {
    const store = useTypesConfigurationPaymentStoreV1()
    const mockPatch = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Inactivado.' }
    })
    ;(executeApi as jest.Mock).mockReturnValue({ patch: mockPatch })

    const result = await store._inactivateTypeConfigurationPayment(2)

    expect(mockPatch).toHaveBeenCalledWith(`${URL_PATH_PAYMENT_TYPE}/2/inactivate`)
    expect(result).toBe(true)
  })

  it('should clear data_information_form when null is passed', async () => {
    const store = useTypesConfigurationPaymentStoreV1()
    store.data_information_form = { id: 99 } as ITypePaymentConfigurationForm

    await store._setDataBasicTypeConfigurationPayment(null)

    expect(store.data_information_form).toBeNull()
  })
})
