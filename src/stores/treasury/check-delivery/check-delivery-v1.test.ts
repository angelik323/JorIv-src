import { setActivePinia, createPinia } from 'pinia'
import { useCheckDeliveryStoreV1 } from '@/stores/treasury/check-delivery/check-delivery-v1'
import { executeApi } from '@/apis'
import { ICheckDeliveryList } from '@/interfaces/customs'
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
describe('useCheckDeliveryStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })
  const URL_PATH = `${URL_PATH_TREASURIES}/check-delivery`

  it('fetches check delivery list successfully', async () => {
    const store = useCheckDeliveryStoreV1()

    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Listado cargado',
        data: {
          data: [{ id: 1, created_by: 'Entrega 1' }] as ICheckDeliveryList[],
          current_page: 1,
          last_page: 1,
        },
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getApiCheckDelivery('&created_by=Entrega')

    expect(mockGet).toHaveBeenCalledWith(
      expect.stringContaining(`${URL_PATH}?paginate=1&created_by=Entrega`)
    )
    expect(store.data_check_delivery_list).toHaveLength(1)
    expect(store.data_check_delivery_pages.currentPage).toBe(1)
  })

  it('handles error when fetching check delivery list', async () => {
    const store = useCheckDeliveryStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getApiCheckDelivery('')

    expect(mockGet).toHaveBeenCalled()
    expect(store.data_check_delivery_list).toHaveLength(0)
  })

  it('fetches check delivery by ID successfully', async () => {
    const store = useCheckDeliveryStoreV1()

    const mockData: ICheckDeliveryList = {
      id: 1,
      created_by: 'Entrega 1',
      // agrega los demás campos requeridos por la interfaz si existen
    } as ICheckDeliveryList

    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Detalle cargado',
        data: mockData,
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdCheckDelivery(1)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/1/view`)
    expect(store.data_information_form?.id).toBe(1)
  })

  it('handles error when fetching check delivery by ID', async () => {
    const store = useCheckDeliveryStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdCheckDelivery(1)

    expect(mockGet).toHaveBeenCalled()
    expect(store.data_information_form).toBeNull()
  })

  it('fetches check delivery to edit', async () => {
    const store = useCheckDeliveryStoreV1()

    const mockData: ICheckDeliveryList = {
      id: 1,
      created_by: 'Editable 1',
      // agrega los demás campos requeridos
    } as ICheckDeliveryList

    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Editable cargado',
        data: mockData,
      },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdCheckDeliveryToEdit(1)

    expect(mockGet).toHaveBeenCalledWith(`${URL_PATH}/1`)
    expect(store.data_information_form?.created_by).toBe('Editable 1')
  })

  it('updates check delivery successfully', async () => {
    const store = useCheckDeliveryStoreV1()

    const updateData: ICheckDeliveryList = {
      id: 1,
      created_by: 'Editado',
      // agrega los demás campos requeridos
    } as ICheckDeliveryList

    const mockPut = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Actualizado' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateCheckDelivery(updateData, 1)

    expect(mockPut).toHaveBeenCalledWith(`${URL_PATH}/1`, updateData)
    expect(result).toBe(true)
  })

  it('handles error when updating check delivery', async () => {
    const store = useCheckDeliveryStoreV1()

    const updateData: ICheckDeliveryList = {
      id: 1,
      created_by: 'Fallido',
      // completa si es necesario
    } as ICheckDeliveryList

    const mockPut = jest.fn().mockRejectedValue(new Error('Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._updateCheckDelivery(updateData, 1)

    expect(mockPut).toHaveBeenCalled()
    expect(result).toBe(false)
  })

  it('confirms check delivery successfully', async () => {
    const store = useCheckDeliveryStoreV1()

    const confirmData = {
      check_ids: [1, 33],
    }

    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Confirmado' },
    })
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._confirmCheckDelivery(confirmData)

    expect(mockPost).toHaveBeenCalledWith(`${URL_PATH}/confirm`, confirmData)
    expect(result).toBe(true)
  })

  it('handles error when confirming check delivery', async () => {
    const store = useCheckDeliveryStoreV1()

    const confirmData = {
      check_ids: [1, 33],
    }

    const mockPost = jest.fn().mockRejectedValue(new Error('Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._confirmCheckDelivery(confirmData)

    expect(mockPost).toHaveBeenCalled()
    expect(result).toBe(false)
  })

  it('sets data_information_form correctly', () => {
    const store = useCheckDeliveryStoreV1()
    const data: ICheckDeliveryList = {
      id: 1,
      created_by: 'Set Manual',
    } as ICheckDeliveryList

    store._setDataInformationForm(data)
    expect(store.data_information_form?.created_by).toBe('Set Manual')
  })

  it('clears data correctly', () => {
    const store = useCheckDeliveryStoreV1()

    store.data_check_delivery_list = [
      { id: 1, created_by: 'Item' } as ICheckDeliveryList,
    ]
    store.data_check_delivery_pages = { currentPage: 5, lastPage: 10 }

    store._clearData()

    expect(store.data_check_delivery_list).toHaveLength(0)
    expect(store.data_check_delivery_pages.currentPage).toBe(0)
    expect(store.data_check_delivery_pages.lastPage).toBe(0)
  })
})
