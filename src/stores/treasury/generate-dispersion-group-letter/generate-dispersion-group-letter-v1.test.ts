import { setActivePinia, createPinia } from 'pinia'
import { useDispersionLetterStoreV1 } from './generate-dispersion-group-letter-v1'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { executeApi } from '@/apis'
import { IDispersionLetter } from '@/interfaces/customs'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
  })),
}))

jest.mock('@/composables', () => {
  const showAlertMock = jest.fn()
  const showCatchErrorMock = jest.fn((err) => `Mocked Error: ${err.message}`)
  const useAlert = jest.fn(() => ({ showAlert: showAlertMock }))
  const useShowError = jest.fn(() => ({ showCatchError: showCatchErrorMock }))

  return {
    useAlert,
    useShowError,
    showAlertMock,
    showCatchErrorMock,
  }
})

describe('useDispersionLetterStoreV1', () => {
  let store: ReturnType<typeof useDispersionLetterStoreV1>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useDispersionLetterStoreV1()
    jest.clearAllMocks()
  })

  it('should set letter_list and letter_pages on successful _getListGroupAction', async () => {
    const mockLetter = {
      id: 1,
      business_code: '001',
      business_name: 'Empresa A',
      bank_code: '001',
      bank_name: 'Banco A',
      bank_account: '123456',
      group_code: 'GRP001',
      giro_quantity: 5,
      date: '2025-07-29',
      status: 'Agrupado',
      group_value: '100000.00',
      gmf: 'SI',
      format: 'PDF',
    }

    const mockResponse = {
      data: {
        success: true,
        data: {
          data: [mockLetter],
          current_page: 2,
          last_page: 5,
        },
        message: 'Cartas obtenidas correctamente',
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const showAlertMock = require('@/composables').showAlertMock

    await store._getListGroupAction('page=2')

    expect(store.dispersion_group_letter_list).toEqual([mockLetter])
    expect(store.dispersion_group_letter_pages).toEqual({
      currentPage: 2,
      lastPage: 5,
    })
    expect(showAlertMock).toHaveBeenCalledWith(
      'Cartas obtenidas correctamente',
      'success',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('should not update letter_list or pages if response.data.success is false', async () => {
    const mockResponse = {
      data: {
        success: false,
        data: {
          data: [{ id: 1 }],
          current_page: 2,
          last_page: 5,
        },
        message: 'No se pudo obtener grupos',
      },
    }

    const mockGet = jest.fn().mockResolvedValue(mockResponse)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const showAlertMock = require('@/composables').showAlertMock

    await store._getListGroupAction('filter[validity]=2025')

    expect(store.dispersion_group_letter_list).toEqual([])
    expect(store.dispersion_group_letter_pages).toEqual({
      currentPage: 1,
      lastPage: 1,
    })
    expect(showAlertMock).toHaveBeenCalledWith(
      'No se pudo obtener grupos',
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('should call showAlert with error message on failed _getListGroupAction', async () => {
    const error = new Error('Fallo al obtener grupos')
    const mockGet = jest.fn().mockRejectedValue(error)
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    const showAlertMock = require('@/composables').showAlertMock
    const showCatchErrorMock = require('@/composables').showCatchErrorMock

    await store._getListGroupAction('filter[validity]=as')

    expect(showAlertMock).toHaveBeenCalledWith(
      showCatchErrorMock(error),
      'error',
      undefined,
      TIMEOUT_ALERT
    )
  })

  it('should clear letter_list and letter_pages on _cleanLetterData', () => {
    store.letter_list = [
      {
        id: 99,
        business_code: '001',
        business_name: 'Empresa Demo',
        bank_code: '001',
        bank_name: 'Banco Demo',
        bank_account: '123456',
        group_code: 'GRP001',
        giro_quantity: 5,
        date: '2025-07-29',
        status: 'Agrupado',
        group_value: '500000.00',
        gmf: 'SI',
        format: 'PDF',
      },
    ]
    store.letter_pages = { currentPage: 3, lastPage: 10 }

    store._cleanLetterData()

    expect(store.letter_list).toEqual([])
    expect(store.letter_pages).toEqual({ currentPage: 0, lastPage: 0 })
  })

  it('should set selected_letter on _selectLetter', () => {
    const mockLetter: IDispersionLetter = {
      id: 77,
      business_code: 'BC001',
      business_name: 'Empresa Test',
      bank_code: 'BK001',
      bank_name: 'Banco Test',
      bank_account: '1234567890',
      group_code: 'GRP001',
      giro_quantity: 5,
      date: '2025-07-29',
      status: 'Generado',
      group_value: '10000',
      gmf: 'SI',
      format: 'PDF',
    }

    store._selectLetter(mockLetter)

    expect(store.selected_letter).toEqual(mockLetter)
  })
})
