import { setActivePinia, createPinia } from 'pinia'
import { executeApi } from '@/apis'
import { useBankContacts } from './bank-contacts-v1'
import { useAlert } from '@/composables'
const URL_PATH_TREASURIES = 'treasuries/api/treasuries'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    put: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  })),
}))
jest.mock('@/composables', () => {
  const showAlertMock = jest.fn()
  const showCatchErrorMock = jest.fn()

  const useAlert = jest.fn(() => ({ showAlert: showAlertMock }))
  const useShowError = jest.fn(() => ({ showCatchError: showCatchErrorMock }))

  return { useAlert, useShowError, showAlertMock, showCatchErrorMock }
})

describe('useBankContacts', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('should fetch the list of bank contacts and update the state correctly', async () => {
    const store = useBankContacts()
    const mockResponse = {
      data: {
        success: true,
        data: {
          data: [{ id: 1, name: 'Contacts 1' }],
          current_page: 1,
          last_page: 2,
        },
        message: 'Data retrieved successfully',
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const params = '&filter[status]=1'
    const id = 114
    // Act
    await store._getBankContactsList(params, id)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/banking-entities/bank/contacts/by-bank/${id}?paginate=1${params}`
    )
    expect(store.bank_contacts_list).toEqual(mockResponse.data.data.data)
  })

  it('should create a bank contact and update the state correctly', async () => {
    const store = useBankContacts()
    const mockResponse = {
      data: {
        success: true,
        data: [{ id: 1, name: 'Contact created' }],
        message: 'Contact created successfully',
      },
    }
    const mockPost = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const params = { name: 'Contact created' }
    // Act
    const result = await store._createBankContacts(params)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/banking-entities/bank/contacts`,
      params
    )
    expect(store.bank_contacts_list).toEqual(mockResponse.data.data)
    expect(result).toBe(true)
  })

  it('should delete a bank contact correctly', async () => {
    const store = useBankContacts()
    const mockDelete = jest.fn().mockResolvedValue({})
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    const id = 1
    // Act
    await store._deleteBankContacts(id)

    // Assert
    expect(mockDelete).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/banking-entities/bank/contacts/${id}`
    )
  })

  it('should update a bank contact and return success status', async () => {
    const store = useBankContacts()
    const mockResponse = {
      data: {
        success: true,
        message: 'Contact updated successfully',
      },
    }
    const mockPut = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const id = 1
    const payload = { name: 'Contact updated' }
    // Act
    const result = await store._updateBankContacts(id, payload)

    // Assert
    expect(mockPut).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/banking-entities/bank/contacts/${id}`,
      payload
    )
    expect(result).toBe(true)
  })

  it('should fetch a bank contact by ID and update the state correctly', async () => {
    const store = useBankContacts()
    const mockResponse = {
      data: {
        success: true,
        data: { id: 1, name: 'Contact 1' },
        message: 'Contact retrieved successfully',
      },
    }
    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const id = 1
    // Act
    await store._getByIdBankContacts(id)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/banking-entities/bank/contacts/${id}`
    )
    expect(store.bank_contacts_request).toEqual(mockResponse.data.data)
  })

  it('should handle errors when fetching a bank contact by ID', async () => {
    const store = useBankContacts()
    const error = new Error('Error fetching the contact')
    const mockGet = jest.fn().mockRejectedValue(error)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const id = 1
    // Act
    await store._getByIdBankContacts(id)

    // Assert
    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/banking-entities/bank/contacts/${id}`
    )
    const { showCatchErrorMock } = require('@/composables')
    expect(useAlert().showAlert).toHaveBeenCalledWith(
      showCatchErrorMock(error),
      'error',
      undefined,
      3000
    )
  })

  it('should handle errors when updating a bank contact', async () => {
    const store = useBankContacts()
    const error = new Error('Error updating the contact')
    const mockPut = jest.fn().mockRejectedValue(error)
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const id = 1
    const payload = { name: 'Contact updated' }
    // Act
    const result = await store._updateBankContacts(id, payload)

    // Assert
    expect(mockPut).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/banking-entities/bank/contacts/${id}`,
      payload
    )
    const { showCatchErrorMock } = require('@/composables')

    expect(useAlert().showAlert).toHaveBeenCalledWith(
      showCatchErrorMock(error),
      'error',
      undefined,
      3000
    )
    expect(result).toBe(false)
  })

  it('should handle errors when deleting a bank contact', async () => {
    const store = useBankContacts()
    const error = new Error('Error deleting the contact')
    const mockDelete = jest.fn().mockRejectedValue(error)
    ;(executeApi as jest.Mock).mockReturnValue({ delete: mockDelete })

    const id = 1
    // Act
    await store._deleteBankContacts(id)

    // Assert
    expect(mockDelete).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/banking-entities/bank/contacts/${id}`
    )
    const { showCatchErrorMock } = require('@/composables')

    expect(useAlert().showAlert).toHaveBeenCalledWith(
      showCatchErrorMock(error),
      'error',
      undefined,
      3000
    )
  })

  it('should set data_information_form_contacts with provided data', () => {
    // Arrange
    const store = useBankContacts()
    const mockData = {
      id: 99, // Puedes ajustar esto según el contexto
      bank_id: 114,
      bank_branch_id: 1,
      full_name: 'John Doe',
      job_title: 'Gerente de Operaciones',
      description: 'Encargado de supervisar las transacciones bancarias.',
      area: 'Finanzas',
      landline_phone: '(+57)601 212',
      mobile_phone: '(+57)322 245 4545',
      email: 'johndoe@email.com',
      preferred_contact_channel: 'WhatsApp',
      products: 'Créditos hipotecarios',
      working_days: ['Lunes', 'Martes', 'Miércoles'],
      available_from: '08:00 AM',
      available_to: '05:00 PM',
      status_id: 1,
    }

    store._setDataBasicBankContacts(mockData)

    // Assert
    expect(store.data_information_form_contacts).toEqual(mockData)
  })

  it('should set data_information_form to null when no data is provided', () => {
    // Arrange
    const store = useBankContacts()

    // Act
    store._setDataBasicBankContacts(null)

    // Assert
    expect(store.data_information_form_contacts).toBeNull()
  })

  it('should handle errors when creating a bank contact', async () => {
    const store = useBankContacts()
    const error = new Error('Error creating the contact')
    const mockPost = jest.fn().mockRejectedValue(error)
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const params = { name: 'New Contact' }

    // Act
    const result = await store._createBankContacts(params)

    // Assert
    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_TREASURIES}/banking-entities/bank/contacts`,
      params
    )
    const { showCatchErrorMock } = require('@/composables')

    expect(useAlert().showAlert).toHaveBeenCalledWith(
      showCatchErrorMock(error),
      'error',
      undefined,
      3000
    )
    expect(result).toBe(false)
  })

  it('should empty the bank contacts list and reset pagination', () => {
    // Arrange
    const store = useBankContacts()
    store.bank_contacts_list = [
      {
        id: 1,
        bank_id: 101,
        bank_branch_id: 202,
        full_name: 'Contact 1',
        job_title: 'Manager',
        area: 'Finance',
        landline_phone: '123456789',
        mobile_phone: '987654321',
        email: 'contact1@example.com',
        preferred_contact_channel: 'email',
        status: { id: 1, name: 'Active' },
        products: 'holis',
        working_days: [],
        available_from: null,
        available_to: null,
      },
    ]
    store.bank_contacts_pages.currentPage = 2
    store.bank_contacts_pages.lastPage = 5

    // Act
    store._emptyBankContactsList()

    // Assert
    expect(store.bank_contacts_list).toEqual([])
    expect(store.bank_contacts_pages.currentPage).toBe(0)
    expect(store.bank_contacts_pages.lastPage).toBe(0)
  })
})
