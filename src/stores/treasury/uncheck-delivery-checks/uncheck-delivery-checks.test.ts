import { setActivePinia, createPinia } from 'pinia'
import { useUncheckDeliveryChecksStoreV1 } from '@/stores/treasury/uncheck-delivery-checks/uncheck-delivery-checks'
import { executeApi } from '@/apis'
import { IUncheckDeliveryChecksList } from '@/interfaces/customs'
import { URL_PATH_TREASURIES } from '@/constants/apis'

jest.mock('quasar', () => ({
  Notify: {
    create: jest.fn(),
  },
}))

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
  })),
}))

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useShowError: jest.fn(() => ({ showCatchError: jest.fn(() => 'Error') })),
}))
describe('useUncheckDeliveryChecksStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })
  const URL_PATH = `${URL_PATH_TREASURIES}/check-unmark-delivered`

  it('fetches uncheck-delivery-checks list successfully', async () => {
    const store = useUncheckDeliveryChecksStoreV1()

    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Listado cargado',
        data: {
          data: [{ id: 1, created_by: 'Entrega 1' }] as IUncheckDeliveryChecksList[],
          current_page: 1,
          last_page: 1,
        },
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getApiUncheckDeliveryChecks('&created_by=Entrega')

    expect(mockGet).toHaveBeenCalledWith(
      expect.stringContaining(`${URL_PATH}?paginate=1&created_by=Entrega`)
    )
    expect(store.data_uncheck_delivery_checks_list).toHaveLength(1)
    expect(store.data_uncheck_delivery_checks_pages.currentPage).toBe(1)
  })

  it('handles error when fetching uncheck-delivery-checks list', async () => {
    const store = useUncheckDeliveryChecksStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getApiUncheckDeliveryChecks('')

    expect(mockGet).toHaveBeenCalled()
    expect(store.data_uncheck_delivery_checks_list).toHaveLength(0)
  })


  it('confirms uncheck-delivery-checks successfully', async () => {
    const store = useUncheckDeliveryChecksStoreV1()

    const confirmData = {
      check_ids: [1, 33],
    }

    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Confirmado' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._confirmUncheckDeliveryChecks(confirmData)

    expect(mockPost).toHaveBeenCalledWith(`${URL_PATH}/confirm`, confirmData)
    expect(result).toBe(true)
  })

  it('handles error when confirming uncheck-delivery-checks', async () => {
    const store = useUncheckDeliveryChecksStoreV1()

    const confirmData = {
      check_ids: [1, 33],
    }

    const mockPost = jest.fn().mockRejectedValue(new Error('Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._confirmUncheckDeliveryChecks(confirmData)

    expect(mockPost).toHaveBeenCalled()
    expect(result).toBe(false)
  })

  it('sets data_information_form correctly', () => {
    const store = useUncheckDeliveryChecksStoreV1()
    const data: IUncheckDeliveryChecksList = {
      id: 1,
      created_by: 'Set Manual',
    } as IUncheckDeliveryChecksList

    store._setDataInformationForm(data)
    expect(store.data_information_form?.created_by).toBe('Set Manual')
  })

  it('clears data correctly', () => {
    const store = useUncheckDeliveryChecksStoreV1()

    store.data_uncheck_delivery_checks_list = [
      { id: 1, created_by: 'Item' } as IUncheckDeliveryChecksList,
    ]
    store.data_uncheck_delivery_checks_pages = { currentPage: 5, lastPage: 10 }

    store._clearData()

    expect(store.data_uncheck_delivery_checks_list).toHaveLength(0)
    expect(store.data_uncheck_delivery_checks_pages.currentPage).toBe(0)
    expect(store.data_uncheck_delivery_checks_pages.lastPage).toBe(0)
  })
})
