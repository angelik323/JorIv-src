import { setActivePinia, createPinia } from 'pinia'
import { useRecordIndividualExpensesStoreV1 } from './record-individual-expenses-v1'
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

describe('useRecordIndividualExpensesStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })
  it('validates record individual expenses successfully', async () => {
    const store = useRecordIndividualExpensesStoreV1()
    const mockPost = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Validation successful',
        data: true,
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const params = {
      business_id: 1,
      date: '2025-06-04',
      movement_id: 222,
      name_business: '222',
      name_office: '22222',
      office_id: 2,
      sub_voucher: '2222',
      voucher: 'asdas',
    }
    const result = await store._postRecordIndividualExpensesValidate(params)

    expect(mockPost).toHaveBeenCalledWith(
      'treasuries/api/treasuries/record-expenses/validate',
      params
    )
    expect(result).toBe(true)
    expect(store.successValidateCreate).toBe(true)
  })

  it('handles error when validating record individual expenses', async () => {
    const store = useRecordIndividualExpensesStoreV1()
    const mockPost = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const params = {
      business_id: 1,
      date: '2023-10-01',
      movement_id: 222,
      name_business: '222',
      name_office: '22222',
      office_id: 2,
      sub_voucher: '2222',
      voucher: 'asdas',
    }
    const result = await store._postRecordIndividualExpensesValidate(params)

    expect(mockPost).toHaveBeenCalledWith(
      'treasuries/api/treasuries/record-expenses/validate',
      params
    )
    expect(result).toBe(false)
    expect(store.successValidateCreate).toBe(false)
  })

  it('sends the data correctly to register individual expenses', async () => {
    const store = useRecordIndividualExpensesStoreV1()
    const mockPost = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Registro exitoso',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const params = {
      business_id: 1,
      date: '2025-06-04',
      movement_id: '12345',
      name_business: 'Empresa XYZ',
      name_office: 'Oficina Central',
      office_id: 2,
      sub_voucher: '1234',
      voucher: '5678',
    }

    await store._postRecordIndividualExpenses(params)

    expect(mockPost).toHaveBeenCalledWith(
      'treasuries/api/treasuries/record-expenses',
      params
    )
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  it('handles errors when registering individual expenses', async () => {
    const store = useRecordIndividualExpensesStoreV1()
    const mockPost = jest.fn().mockRejectedValue(new Error('Error de red'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const params = {
      business_id: 1,
      date: '2025-06-04',
      movement_id: '12345',
      name_business: 'Empresa XYZ',
      name_office: 'Oficina Central',
      office_id: 2,
      sub_voucher: '1234',
      voucher: '5678',
    }

    await store._postRecordIndividualExpenses(params)

    expect(mockPost).toHaveBeenCalledWith(
      'treasuries/api/treasuries/record-expenses',
      params
    )
    expect(mockPost).toHaveBeenCalledTimes(1)
    expect(store.is_creating).toBe(false)
  })

  it('sets the basic data for individual expense registration correctly', () => {
    const store = useRecordIndividualExpensesStoreV1()

    const mockData = {
      business_id: 1,
      date: '2025-06-04',
      movement_id: 222,
      name_business: 'Empresa XYZ',
      name_office: 'Oficina Central',
      office_id: 2,
      sub_voucher: '1234',
      voucher: '5678',
    }

    store._setDataBasicRecodIndividualExpenses(mockData)

    expect(store.data_information_form).toEqual(mockData)
  })

  it('clears the basic data for individual expense registration', () => {
    const store = useRecordIndividualExpensesStoreV1()

    store._setDataBasicRecodIndividualExpenses(null)

    expect(store.data_information_form).toBeNull()
  })

  it('clears the store data correctly', () => {
    const store = useRecordIndividualExpensesStoreV1()

    // Establecer valores iniciales
    store.data_list = [
      {
        id: 1,
        effective_date: 'asdas',
        method_payment_id: 2,
        cost_center_id: 2,
        cash_flow_id: 2,
        bank_id: 2,
        bank_account_id: 2,
        concept: 'asdas',
        foreign_currency_value: 2,
        coin: 'asd',
        trm: 2,
        value: 2,
        instructions: 'asdas',
        local_currency_value_total: 2,
        local_currency_value: 2,
        nit_third_party_id: 2,
        beneficiary_bank_id: 2,
        beneficiary_bank_account: 'asdas',
        authorized_document_type_id: 2,
        identification_authorized: 'asdas',
        bank_branch_id: 2,
        name_authorized: 'asdas',
        beneficiary_bank_account_name: 'asdas',
        cash_flow_name: 'asdas',
        bank_branch_name: 'asdas',
        bank_account_name: 'asdas',
        nit_third_party_name: 'asdas',
        method_payment_name: 'asdas',
        cost_center_name: 'asdas',
        bank_name: 'asdas',
        authorized_document_type_name: 'asdas',
      },
    ]
    store.data_pages = { currentPage: 2, lastPage: 5 }
    store.is_creating = true

    // Llamar al método _clearData
    store._clearData()

    // Verificar que los valores se han restablecido
    expect(store.data_list).toEqual([])
    expect(store.data_pages).toEqual({ currentPage: 0, lastPage: 0 })
    expect(store.is_creating).toBe(false)
  })

  it('validates individual expense details correctly', async () => {
    const store = useRecordIndividualExpensesStoreV1()
    const mockPost = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Validación de detalles exitosa',
        data: true,
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const params = {
      business_id: 1,
      date: '2025-06-04',
      movement_id: 222,
      name_business: 'Empresa XYZ',
      name_office: 'Oficina Central',
      office_id: 2,
      sub_voucher: '1234',
      voucher: '5678',
    }

    const result = await store._postRecordIndividualExpensesValidateDetail(
      params
    )

    expect(mockPost).toHaveBeenCalledWith(
      'treasuries/api/treasuries/record-expenses/validate-detail',
      params
    )
    expect(result).toBe(true)
    expect(store.successValidateDetail).toBe(true)
  })

  it('handles errors when validating individual expense details', async () => {
    const store = useRecordIndividualExpensesStoreV1()
    const mockPost = jest.fn().mockRejectedValue(new Error('Error de red'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const params = {
      business_id: 1,
      date: '2025-06-04',
      movement_id: 222,
      name_business: 'Empresa XYZ',
      name_office: 'Oficina Central',
      office_id: 2,
      sub_voucher: '1234',
      voucher: '5678',
    }

    const result = await store._postRecordIndividualExpensesValidateDetail(
      params
    )

    expect(mockPost).toHaveBeenCalledWith(
      'treasuries/api/treasuries/record-expenses/validate-detail',
      params
    )
    expect(result).toBe(false)
    expect(store.successValidateDetail).toBe(false)
  })
})
