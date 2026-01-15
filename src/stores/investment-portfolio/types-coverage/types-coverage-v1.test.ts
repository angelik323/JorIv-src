import { setActivePinia, createPinia } from 'pinia'
import { useTypesCoverageStoreV1 } from './types-coverage-v1'
import { executeApi } from '@/apis'
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import {
  ITypesCoverageList,
  ITypesCoverageResponse,
  ITypesCoverageToCreate,
} from '@/interfaces/customs/investment-portfolio/TypesCoverage'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
  })),
}))

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useShowError: jest.fn(() => ({ showCatchError: jest.fn(() => 'Error!') })),
  useUtils: jest.fn(() => ({
    defaultIconsLucide: { plusCircleOutline: 'mocked-icon' },
  })),
}))

describe('useTypesCoverageStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('should fetch list of coverage types', async () => {
    const store = useTypesCoverageStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: {
          data: [
            {
              id: 1,
              date: '2025-01-01',
              code: 'COV01',
              description: 'Cobertura 1',
              coverage_type: 'Tipo A',
              coverage_type_element: 'Elemento 1',
            },
          ] as ITypesCoverageList[],
          current_page: 1,
          last_page: 2,
        },
        message: 'List fetched successfully',
      },
    })

    const params = { page: 1 }
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getCoverageTypeList(params)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/coverage-type`,
      { params: { ...params, paginate: 1 } }
    )
    expect(store.types_coverage_list).toEqual([
      {
        id: 1,
        date: '2025-01-01',
        code: 'COV01',
        description: 'Cobertura 1',
        coverage_type: 'Tipo A',
        coverage_type_element: 'Elemento 1',
      },
    ])
    expect(store.types_coverage_pages.currentPage).toBe(1)
    expect(store.types_coverage_pages.lastPage).toBe(2)
  })

  it('should handle error when fetching list', async () => {
    const store = useTypesCoverageStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Network Error'))
    const params = { page: 1 }

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getCoverageTypeList(params)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/coverage-type`,
      { params: { ...params, paginate: 1 } }
    )
    expect(store.types_coverage_list).toEqual([])
  })

  it('should create a new coverage type successfully', async () => {
    const store = useTypesCoverageStoreV1()
    const mockPost = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Created successfully' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const formData: ITypesCoverageToCreate = {
      code: 'COV01',
      description: 'Cobertura nueva',
      operation_coverage_type_id: 1,
      operation_coverage_type_element_id: 2,
    }

    const result = await store._createCoverageType(formData)

    expect(mockPost).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/coverage-type`,
      formData
    )
    expect(result).toBe(true)
  })

  it('should return false if creation fails', async () => {
    const store = useTypesCoverageStoreV1()
    const mockPost = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Error' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createCoverageType({
      code: 'X',
      description: 'Error test',
      operation_coverage_type_id: 0,
      operation_coverage_type_element_id: 0,
    })

    expect(result).toBe(false)
  })

  it('should handle API error during creation', async () => {
    const store = useTypesCoverageStoreV1()
    const mockPost = jest.fn().mockRejectedValue(new Error('API Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ post: mockPost })

    const result = await store._createCoverageType({
      code: 'Y',
      description: 'Test Error',
      operation_coverage_type_id: 0,
      operation_coverage_type_element_id: 0,
    })

    expect(result).toBe(false)
  })

  it('should edit a coverage type successfully', async () => {
    const store = useTypesCoverageStoreV1()
    const mockPut = jest.fn().mockResolvedValue({
      data: { success: true, message: 'Edited successfully' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._editTypeCoverage({ description: 'Mod' }, 5)

    expect(mockPut).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/coverage-type/5`,
      { description: 'Mod' }
    )
    expect(result).toBe(true)
  })

  it('should return false if edit fails', async () => {
    const store = useTypesCoverageStoreV1()
    const mockPut = jest.fn().mockResolvedValue({
      data: { success: false, message: 'Error' },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._editTypeCoverage({ description: 'Mod' }, 6)

    expect(result).toBe(false)
  })

  it('should handle API error during edit', async () => {
    const store = useTypesCoverageStoreV1()
    const mockPut = jest.fn().mockRejectedValue(new Error('API Error'))
    ;(executeApi as jest.Mock).mockReturnValue({ put: mockPut })

    const result = await store._editTypeCoverage({ description: 'Mod' }, 7)

    expect(result).toBe(false)
  })

  it('should fetch coverage type by ID', async () => {
    const store = useTypesCoverageStoreV1()
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Found',
        data: {
          id: 10,
          code: 'COV10',
          description: 'Coverage 10',
          operation_coverage_type_id: 1,
          operation_coverage_type_element_id: 1,
          coverage_type: 'Tipo B',
          coverage_type_element: 'Elemento Y',
          created_at: '2025-01-10',
          creator_data: 'Tester - 000',
        } as ITypesCoverageResponse,
      },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdTypesCoverage(10)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/coverage-type/10`
    )
    expect(store.types_coverage_response).toEqual({
      id: 10,
      code: 'COV10',
      description: 'Coverage 10',
      operation_coverage_type_id: 1,
      operation_coverage_type_element_id: 1,
      coverage_type: 'Tipo B',
      coverage_type_element: 'Elemento Y',
      created_at: '2025-01-10',
      creator_data: 'Tester - 000',
    } as ITypesCoverageResponse)
  })

  it('should handle error when fetching coverage type by ID', async () => {
    const store = useTypesCoverageStoreV1()
    const mockGet = jest.fn().mockRejectedValue(new Error('Not Found'))
    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdTypesCoverage(99)

    expect(mockGet).toHaveBeenCalledWith(
      `${URL_PATH_INVESTMENT_PORTFOLIO}/coverage-type/99`
    )
    expect(store.types_coverage_response).toBeNull()
  })

  it('should assign ITypesCoverageResponse correctly', async () => {
    const store = useTypesCoverageStoreV1()

    const mockResponse: ITypesCoverageResponse = {
      id: 63,
      code: 'CovRef63',
      description: 'desc cobertura',
      operation_coverage_type_id: 1,
      operation_coverage_type_element_id: 2,
      coverage_type: 'Tipo A',
      coverage_type_element: 'Elemento X',
      created_at: '2025-10-21',
      creator_data: 'Nelson - 611014',
    } as unknown as ITypesCoverageResponse

    const mockGet = jest.fn().mockResolvedValue({
      data: {
        success: true,
        message: 'Found',
        data: mockResponse,
      },
    })

    ;(executeApi as jest.Mock).mockReturnValue({ get: mockGet })

    await store._getByIdTypesCoverage(63)

    expect(store.types_coverage_response).toEqual(mockResponse)
    expect(store.types_coverage_response?.code).toBe('CovRef63')
    expect(store.types_coverage_response?.description).toContain('cobertura')
  })

  it('should clear all store data', () => {
    const store = useTypesCoverageStoreV1()

    store.types_coverage_list = [
      {
        id: 1,
        date: '2025-01-01',
        code: 'T1',
        description: 'T1',
        coverage_type: 'A',
        coverage_type_element: 'E1',
      },
    ]
    store.types_coverage_response = {
      id: 1,
      code: 'C1',
      description: 'C',
      operation_coverage_type_id: 1,
      operation_coverage_type_element_id: 1,
      coverage_type: 'Tipo',
      coverage_type_element: 'Elemento',
    } as ITypesCoverageResponse
    store.types_coverage_pages = { currentPage: 2, lastPage: 3 }

    store._clearData()

    expect(store.types_coverage_list).toEqual([])
    expect(store.types_coverage_response).toBeNull()
    expect(store.types_coverage_pages).toEqual({
      currentPage: 0,
      lastPage: 0,
    })
  })
})
