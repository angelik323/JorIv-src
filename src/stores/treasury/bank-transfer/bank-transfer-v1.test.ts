 

let apiPostMock: jest.Mock

const mockShowAlert = jest.fn()
const mockShowCatchError = jest.fn()

jest.mock('@/composables', () => ({
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  useShowError: jest.fn(() => ({ showCatchError: jest.fn() })),
}))

import { setActivePinia, createPinia } from 'pinia'
import { useBankTransferStoreV1 } from './bank-transfer-v1'
import { ITypeCoin } from '@/interfaces/customs'

jest.mock('@/apis', () => ({
  executeApi: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  })),
}))

describe('useBankTransferStoreV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())

    jest.clearAllMocks()

    apiPostMock = jest.fn()
    ;(
      jest.mocked(jest.requireMock('@/apis').executeApi) as jest.Mock
    ).mockReturnValue({
      get: jest.fn(),
      post: apiPostMock,
      put: jest.fn(),
      delete: jest.fn(),
    })
  })

  it('should reset all bank transfer data correctly', () => {
    const store = useBankTransferStoreV1()

    store.currentTRM = 123.45
    store.filterForm = {
      date: '2025-07-15',
      office_id: 1,
      name_office: 'Oficina Central',
      observations: 'Observaciones de prueba',
    }
    store.formOrigin = {
      business_trust_id: 1,
      movement_id: 1,
      bank_id: 1,
      bank_account_id: 1,
      found_id: 1,
      investment_plans_id: 1,
      means_of_payment_id: 1,
      trust_investment_plan: 100,
      foreign_currency_value: 100,
      coin: 'Local' as ITypeCoin,
      trm: 4000,
      value: 400000,
      cost_center_id: 1,
      cash_flow_id: 1,
      bank_account_balance: 0,
      investment_plan_balance: 0,
    }
    store.formDestiny = {
      business_trust_id: 2,
      movement_id: 2,
      bank_id: 2,
      bank_account_id: 2,
      found_id: 2,
      investment_plans_id: 2,
      type_receive_id: 2,
      trust_investment_plan: 100,
      foreign_currency_value: 50,
      coin: 'Local' as ITypeCoin,
      trm: 4500,
      value: 225000,
      cost_center_id: 2,
      cash_flow_id: 2,
      bank_account_balance: 0,
      investment_plan_balance: 0,
    }
    store.cardOriginInfo = {
      id: '1965',
      businessCode: '4916547 Voluptate et exercitationem quidem.',
      movement: '22',
      bankName: 'Caja Menor',
      bankAccount: '238742834',
      founderType: 'cod1 - Fondo de Ahorro',
      bussinessPlan: '1',
      paymentType: 'Cheque de gerencia',
      coinValue: '300000',
      coin: 'Local',
      valueTRM: '4567.12',
      natureType: 'Egreso',
      onlyValue: '150000',
      costCenter: '23 - fwe',
      cashFlow: '4 - Flujo de caja 1',
      balance: '100000000',
      planInvesment: '35500000',
    }
    store.cardDestinyInfo = {
      id: '1965',
      businessCode: '4916547 Voluptate et exercitationem quidem.',
      movement: '22',
      bankName: 'Caja Menor',
      bankAccount: '238742834',
      founderType: 'cod1 - Fondo de Ahorro',
      bussinessPlan: '1',
      paymentType: 'Cheque de gerencia',
      coinValue: '300000',
      coin: 'Local' as ITypeCoin,
      valueTRM: '4567.12',
      natureType: 'Egreso',
      onlyValue: '150000',
      costCenter: '23 - fwe',
      cashFlow: '4 - Flujo de caja 1',
      balance: '100000000',
      planInvesment: '35500000',
    }

    store._resetAllBankTransfer()

    expect(store.currentTRM).toBeNull()
    expect(store.filterForm).toBeNull()
    expect(store.formOrigin).toBeNull()
    expect(store.formDestiny).toBeNull()
    expect(store.cardOriginInfo).toBeNull()
    expect(store.cardDestinyInfo).toBeNull()

    expect(mockShowAlert).not.toHaveBeenCalled()
    expect(mockShowCatchError).not.toHaveBeenCalled()
  })

  describe('useBankTransferStoreV1', () => {
    beforeEach(() => {
      setActivePinia(createPinia())
      jest.clearAllMocks()
    })

    it('should update the current bank transfer tab', async () => {
      const store = useBankTransferStoreV1()

      store.currentBankTransferTab = 'destiny-data'

      const newTab = 'origin-data'
      await store._updateTransferBankTab(newTab)

      expect(store.currentBankTransferTab).toBe(newTab)

      expect(mockShowAlert).not.toHaveBeenCalled()
      expect(mockShowCatchError).not.toHaveBeenCalled()
    })
  })

  it('should update the origin card info', async () => {
    const store = useBankTransferStoreV1()

    const newCardInfo = {
      id: 'mock-id-1',
      businessCode: 'mock-business-code-1',
      movement: 'mock-movement-1',
      bankName: 'Mock Bank A',
      bankAccount: '111222333',
      founderType: 'Mock Fund Type A',
      bussinessPlan: 'Mock Business Plan A',
      paymentType: 'Mock Payment Type A',
      coinValue: '1000',
      coin: 'Local' as ITypeCoin,
      valueTRM: '3800',
      natureType: 'Income',
      onlyValue: '500',
      costCenter: 'Mock Cost Center A',
      cashFlow: 'Mock Cash Flow A',
      balance: '10000',
      planInvesment: '5000',
    }

    await store._updateOriginCard(newCardInfo)

    expect(store.cardOriginInfo).toEqual(newCardInfo)

    expect(mockShowAlert).not.toHaveBeenCalled()
    expect(mockShowCatchError).not.toHaveBeenCalled()
  })

  it('should update the destiny card info', async () => {
    const store = useBankTransferStoreV1()

    const newCardInfo = {
      id: 'mock-id-2',
      businessCode: 'mock-business-code-2',
      movement: 'mock-movement-2',
      bankName: 'Mock Bank B',
      bankAccount: '444555666',
      founderType: 'Mock Fund Type B',
      bussinessPlan: 'Mock Business Plan B',
      paymentType: 'Mock Payment Type B',
      coinValue: '2000',
      coin: 'Local' as ITypeCoin,
      valueTRM: '4200',
      natureType: 'Expense',
      onlyValue: '1000',
      costCenter: 'Mock Cost Center B',
      cashFlow: 'Mock Cash Flow B',
      balance: '20000',
      planInvesment: '7000',
    }

    await store._updateDestinyCard(newCardInfo)

    expect(store.cardDestinyInfo).toEqual(newCardInfo)

    expect(mockShowAlert).not.toHaveBeenCalled()
    expect(mockShowCatchError).not.toHaveBeenCalled()
  })

  it('should update the origin form data correctly', async () => {
    const store = useBankTransferStoreV1()

    const mockFormInfo = {
      businessId: 101,
      businessType: 1,
      movementValue: 202,
      bankValue: 1,
      bankDescription: 1,
      bankAccountValue: 404,
      fundValue: 505,
      paymentMethod: 7,
      trustInvestmentPlan: null,
      inversionPlan: 1,
      collectionTypeValue: 90,
      amountInForeignCurrency: 150.75,
      foreignCurrencyValue: 100.5,
      currencyValue: null,
      trmValue: 3850.5,
      natureValue: 'Income',
      costValue: 580000,
      costCenter: 808,
      cashFlow: 909,
      bankAccountBalance: 500000,
      investmentPlanBalance: 750000,
    }

    await store._updateOriginForm(mockFormInfo)

    expect(store.formOrigin).toEqual({
      business_trust_id: mockFormInfo.businessId,
      movement_id: mockFormInfo.movementValue,
      bank_id: mockFormInfo.bankValue,
      bank_account_id: mockFormInfo.bankAccountValue,
      found_id: mockFormInfo.fundValue,
      investment_plans_id: mockFormInfo.inversionPlan,
      means_of_payment_id: mockFormInfo.paymentMethod,
      trust_investment_plan: mockFormInfo.inversionPlan,
      foreign_currency_value: mockFormInfo.amountInForeignCurrency,
      coin: mockFormInfo.currencyValue,
      trm: mockFormInfo.trmValue,
      value: mockFormInfo.costValue,
      cost_center_id: mockFormInfo.costCenter,
      cash_flow_id: mockFormInfo.cashFlow,
      bank_account_balance: mockFormInfo.bankAccountBalance,
      investment_plan_balance: mockFormInfo.investmentPlanBalance,
    })

    expect(mockShowAlert).not.toHaveBeenCalled()
    expect(mockShowCatchError).not.toHaveBeenCalled()
  })

  it('should update the destiny form data correctly', async () => {
    const store = useBankTransferStoreV1()

    const mockFormInfo = {
      businessId: 102,
      businessType: 1,
      movementValue: 203,
      bankValue: 1,
      bankDescription: 1,
      bankAccountValue: 405,
      fundValue: 506,
      paymentMethod: 708,
      trustInvestmentPlan: null,
      inversionPlan: 607,
      collectionTypeValue: 91,
      amountInForeignCurrency: 160.85,
      foreignCurrencyValue: 101.6,
      currencyValue: null,
      trmValue: 3950.6,
      trust_investment_plan: 9,
      natureValue: 'Expense',
      costValue: 600000,
      costCenter: 809,
      cashFlow: 910,
      bankAccountBalance: 1200000,
      investmentPlanBalance: 800000,
    }

    await store._updateDestinyForm(mockFormInfo)

    expect(store.formDestiny).toEqual({
      business_trust_id: mockFormInfo.businessId,
      movement_id: mockFormInfo.movementValue,
      bank_id: mockFormInfo.bankValue,
      bank_account_id: mockFormInfo.bankAccountValue,
      found_id: mockFormInfo.fundValue,
      investment_plans_id: mockFormInfo.inversionPlan,
      type_receive_id: mockFormInfo.paymentMethod,
      trust_investment_plan: mockFormInfo.inversionPlan,
      foreign_currency_value: mockFormInfo.amountInForeignCurrency,
      coin: mockFormInfo.currencyValue,
      trm: mockFormInfo.trmValue,
      value: mockFormInfo.costValue,
      cost_center_id: mockFormInfo.costCenter,
      cash_flow_id: mockFormInfo.cashFlow,
      bank_account_balance: mockFormInfo.bankAccountBalance,
      investment_plan_balance: mockFormInfo.investmentPlanBalance,
    })

    expect(mockShowAlert).not.toHaveBeenCalled()
    expect(mockShowCatchError).not.toHaveBeenCalled()
  })

  it('should update the filter form data correctly', async () => {
    const store = useBankTransferStoreV1()

    const mockFilterInfo = {
      date: '2025-07-20',
      fiduciaryOffice: 123,
      fiduciaryOfficeName: 'Oficina Principal Mock',
      instructionsView: 'Instrucciones de prueba',
    }

    const mockFilterId = 'Nombre de oficina'

    await store._updateFilterForm(mockFilterInfo, mockFilterId)

    expect(store.filterForm).toEqual({
      date: '2025-07-20',
      office_id: 123,
      name_office: 'Oficina Principal Mock',
      observations: 'Instrucciones de prueba',
    })

    expect(store.formFilterInitial).toEqual({
      date: '2025-07-20',
      office_id: 123,
      name_office: 'Oficina Principal Mock',
      observations: 'Instrucciones de prueba',
      office_label: 'Nombre de oficina',
    })

    expect(mockShowAlert).not.toHaveBeenCalled()
    expect(mockShowCatchError).not.toHaveBeenCalled()
  })

  it('should update the destiny form data correctly', async () => {
    const store = useBankTransferStoreV1()

    const mockFormInfo = {
      businessId: 101,
      businessType: 2,
      movementValue: 500000,
      bankValue: 1,
      bankDescription: 1,
      bankAccountValue: 67890,
      fundValue: 250000,
      paymentMethod: 1,
      trustInvestmentPlan: 202,
      inversionPlan: 303,
      collectionTypeValue: 404,
      amountInForeignCurrency: 1000,
      foreignCurrencyValue: 987,
      currencyValue: 'Local' as ITypeCoin,
      trmValue: 4200,
      natureValue: 'Ingreso',
      costValue: 150000,
      costCenter: 505,
      cashFlow: 606,
      bankAccountBalance: 1200000,
      investmentPlanBalance: 800000,
    }

    await store._updateDestinyForm(mockFormInfo)

    expect(store.formDestiny).toEqual({
      business_trust_id: 101,
      movement_id: 500000,
      bank_id: 1,
      bank_account_id: 67890,
      found_id: 250000,
      investment_plans_id: 303,
      type_receive_id: 1,
      trust_investment_plan: 303,
      foreign_currency_value: 1000,
      coin: 'Local' as ITypeCoin,
      trm: 4200,
      value: 150000,
      cost_center_id: 505,
      cash_flow_id: 606,
      bank_account_balance: 1200000,
      investment_plan_balance: 800000,
    })
  })
})
