import { setActivePinia, createPinia } from 'pinia'
import { usePaymentMethodsStoreV1 } from './payment-methods-v1'
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

describe('usePaymentMethodsStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('fetches list of payment methods', async () => {
    // Arrange
    const store = usePaymentMethodsStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Fetched',
        data: {
          data: [
            {
              id: 1,
              code: '001',
              description: 'descripcion ejemplo 3',
              type_mean_of_payments: 'Cheque de gerencia',
              dispersion_type: 'Archivo plano',
              transaction_type: 'Bancaria',
              type_funds_transfer: 'Mismo fondo',
              request_registration_beneficiary: false,
              type_registrations: '',
              payment_instructions: false,
              authorized_payment: false,
              crossed_check: false,
              message_check: '',
              request_bank_withdrawal: true,
              status_id: 1,
            },
          ],
          current_page: 1,
          last_page: 1,
        },
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getListAction('')

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      'treasuries/api/treasuries/means-of-payments?paginate=1'
    )
    expect(store.payment_methods_list).toHaveLength(1)
    expect(store.payment_methods_list[0].id).toBe(1)
  })

  it('handles error when fetching payment methods fails', async () => {
    // Arrange
    const store = usePaymentMethodsStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getListAction('')

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      'treasuries/api/treasuries/means-of-payments?paginate=1'
    )
    expect(store.payment_methods_list).toHaveLength(0)
  })

  it('fetches payment method by ID', async () => {
    // Arrange
    const store = usePaymentMethodsStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        id: 3,
        code: '002',
        description: 'ejemplo 3',
        type_mean_of_payments: 'Cheque de gerencia',
        dispersion_type: 'Archivo plano',
        transaction_type: 'Bancaria',
        type_funds_transfer: 'Mismo fondo',
        request_registration_beneficiary: false,
        type_registrations: null,
        payment_instructions: true,
        authorized_payment: true,
        crossed_check: false,
        message_check: null,
        request_bank_withdrawal: true,
        status_id: 1,
        created_by: 1,
        updated_by: null,
        created_at: '2025-04-12T04:36:25.000000Z',
        updated_at: '2025-04-12T04:36:25.000000Z',
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    // Act
    await store._getByIdPaymentMethod(2)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      'treasuries/api/treasuries/means-of-payments/2'
    )
    expect(store.payment_methods_request?.id).not.toBeNull()
  })

  it('handles error when fetching payment method by ID fails', async () => {
    // Arrange
    const store = usePaymentMethodsStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })
    // Act
    await store._getByIdPaymentMethod(2)
    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      'treasuries/api/treasuries/means-of-payments/2'
    )
    expect(store.payment_methods_request).toBeNull()
  })

  it('creates a payment method and returns true on success', async () => {
    const store = usePaymentMethodsStoreV1()
    const mockPost = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Created',
      },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createPaymentMethod({
      description: 'ejemplo 4',
      type_mean_of_payments: 'Cheque de gerencia',
      dispersion_type: 'Archivo plano',
      transaction_type: 'Bancaria',
      type_funds_transfer: 'Mismo fondo',
      request_registration_beneficiary: false,
      type_registrations: '',
      payment_instructions: false,
      authorized_payment: false,
      crossed_check: false,
      message_check: '',
      request_bank_withdrawal: false,
    })

    expect(mockPost).toHaveBeenCalled()
    expect(result).toBe(true)
  })

  it('handles error when creating a payment method fails', async () => {
    // Arrange
    const store = usePaymentMethodsStoreV1()
    const payload = {
      description: 'ejemplo 4',
      type_mean_of_payments: 'Cheque de gerencia',
      dispersion_type: 'Archivo plano',
      transaction_type: 'Bancaria',
      type_funds_transfer: 'Mismo fondo',
      request_registration_beneficiary: false,
      type_registrations: '',
      payment_instructions: false,
      authorized_payment: false,
      crossed_check: false,
      message_check: '',
      request_bank_withdrawal: false,
    }
    const mockPost = jest.fn().mockResolvedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    // Act
    const result = await store._createPaymentMethod(payload)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(
      'treasuries/api/treasuries/means-of-payments',
      payload
    )
    expect(result).toBe(false)
  })

  it('updates a payment method and returns true on success', async () => {
    const store = usePaymentMethodsStoreV1()
    const mockPut = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Updated',
      },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updatePaymentMethod(
      {
        id: 3,
        code: '005',
        description: 'ejemplo 5',
        type_mean_of_payments: 'Cheque de gerencia',
        dispersion_type: 'Archivo plano',
        transaction_type: 'Bancaria',
        type_funds_transfer: 'Mismo fondo',
        request_registration_beneficiary: false,
        type_registrations: '',
        payment_instructions: false,
        authorized_payment: false,
        crossed_check: false,
        message_check: '',
        request_bank_withdrawal: false,
      },
      3
    )

    expect(mockPut).toHaveBeenCalledWith(
      'treasuries/api/treasuries/means-of-payments/3',
      {
        id: 3,
        code: '005',
        description: 'ejemplo 5',
        type_mean_of_payments: 'Cheque de gerencia',
        dispersion_type: 'Archivo plano',
        transaction_type: 'Bancaria',
        type_funds_transfer: 'Mismo fondo',
        request_registration_beneficiary: false,
        type_registrations: '',
        payment_instructions: false,
        authorized_payment: false,
        crossed_check: false,
        message_check: '',
        request_bank_withdrawal: false,
      }
    )

    expect(result).toBe(true)
  })

  it('handles error when updating a payment method fails', async () => {
    // Arrange
    const store = usePaymentMethodsStoreV1()
    const payload = {
      id: 3,
      code: '005',
      description: 'ejemplo 5',
      type_mean_of_payments: 'Cheque de gerencia',
      dispersion_type: 'Archivo plano',
      transaction_type: 'Bancaria',
      type_funds_transfer: 'Mismo fondo',
      request_registration_beneficiary: false,
      type_registrations: '',
      payment_instructions: false,
      authorized_payment: false,
      crossed_check: false,
      message_check: '',
      request_bank_withdrawal: false,
    }

    const mockPut = jest.fn().mockResolvedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    // Act
    const result = await store._updatePaymentMethod(payload, 3)

    // Assert
    expect(mockPut).toHaveBeenCalledWith(
      'treasuries/api/treasuries/means-of-payments/3',
      payload
    )
    expect(result).toBe(false)
  })

  it('deletes a payment method and refetches the list', async () => {
    const store = usePaymentMethodsStoreV1()
    const mockDelete = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Deleted',
      },
    })

    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Refetched',
        data: { data: [] },
      },
    })

    ;(executeApi as jest.Mock).mockReturnValue({
      delete: mockDelete,
      get: mockGet,
    })

    await store._changeStatusAction(5)

    expect(mockDelete).toHaveBeenCalledWith(
      'treasuries/api/treasuries/means-of-payments/5'
    )
    expect(mockGet).toHaveBeenCalled()
  })

  it('handles error when deleting a payment method fails', async () => {
    // Arrange
    const store = usePaymentMethodsStoreV1()
    const mockDelete = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    // Act
    await store._changeStatusAction(1)

    // Assert
    expect(mockDelete).toHaveBeenCalledWith(
      'treasuries/api/treasuries/means-of-payments/1'
    )
  })
})
