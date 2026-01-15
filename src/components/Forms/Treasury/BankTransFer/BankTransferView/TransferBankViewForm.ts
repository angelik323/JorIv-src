// vue
import { computed, onMounted, ref, watch } from 'vue'
// copmposables
import { useGoToUrl, useMainLoader } from '@/composables'

import { defaultIconsLucide } from '@/utils'

// interfaces
import { QTable } from 'quasar'

import { useBankTransferStore, useResourceStore } from '@/stores'
import { storeToRefs } from 'pinia'
import {
  IBankTransferDetail,
  IBankTransferFilter,
  IBankTransferTypeAction,
  IBankTranslateList,
  IBankTrasferCreateAndUpdate,
  IConvertedInfo,
  IFormOfficesFilter,
  IOriginInfo,
} from '@/interfaces/customs'

const useTransferBankViewForm = () => {
  const { offices_fics } = storeToRefs(useResourceStore('v1'))
  const {
    _createBankTransfer,
    _createDestinyBankTransfer,
    _updateTransferBankTab,
    _resetAllBankTransfer,
    _updateFormCreateAndUpdateOrigin,
    _updateFormCreateAndUpdateDestiny,
    _updateBankTransferConfirm,
  } = useBankTransferStore('v1')
  const {
    formDestiny,
    formOrigin,
    formCreateAndUpdateOrigin,
    formCreateAndUpdateDestiny,
    filterForm,
    cardDestinyInfo,
    cardOriginInfo,
    formFilterInitial,
    bankTransferId,
  } = storeToRefs(useBankTransferStore('v1'))

  const alertTransferConfirmlRef = ref()

  const { goToURL } = useGoToUrl()

  const infoOrigin = ref<IBankTranslateList[]>([])

  const infoDestiny = ref<IBankTranslateList[]>([])

  const showOrigin = ref<boolean>(false)
  const showDestiny = ref<boolean>(false)

  const getInfoOrigin = computed(() =>
    cardOriginInfo.value ? [cardOriginInfo.value] : []
  )

  const getInfoDestiny = computed(() =>
    cardDestinyInfo.value ? [cardDestinyInfo.value] : []
  )

  const { openMainLoader } = useMainLoader()

  const addColumns = [
    {
      name: 'id',
      required: false,
      label: '#',
      align: 'left',
      field: 'id',
      sortable: true,
    },
    {
      name: 'businessCode',
      required: false,
      label: 'Negocio',
      align: 'left',
      field: 'businessCode',
      sortable: true,
    },
    {
      name: 'movement',
      required: false,
      label: 'Movimiento',
      align: 'left',
      field: 'movement',
      sortable: true,
    },
    {
      name: 'bankName',
      required: true,
      label: 'Banco',
      align: 'left',
      field: 'bankName',
      sortable: true,
    },
    {
      name: 'bankAccount',
      required: true,
      label: 'Cuenta Bancaria',
      align: 'left',
      field: 'bankAccount',
      sortable: true,
    },
    {
      name: 'founderType',
      required: true,
      label: 'Fondo',
      align: 'left',
      field: 'founderType',
      sortable: true,
    },

    {
      name: 'bussinessPlan',
      required: true,
      label: 'Plan de inversión',
      align: 'left',
      field: 'bussinessPlan',
      sortable: true,
    },
    {
      name: 'paymentType',
      required: true,
      label: 'Forma de pago',
      align: 'left',
      field: 'paymentType',
      sortable: true,
    },

    {
      name: 'coinValue',
      required: true,
      label: 'Valor de la moneda',
      align: 'left',
      field: 'coinValue',
      sortable: true,
    },

    {
      name: 'coin',
      required: true,
      label: 'Moneda',
      align: 'left',
      field: 'coin',
      sortable: true,
    },

    {
      name: 'valueTRM',
      required: true,
      label: 'TRM',
      align: 'left',
      field: 'valueTRM',
      sortable: true,
    },

    {
      name: 'natureType',
      required: true,
      label: 'Naturaleza',
      align: 'left',
      field: 'natureType',
      sortable: true,
    },

    {
      name: 'onlyValue',
      required: true,
      label: 'Valor',
      align: 'left',
      field: 'onlyValue',
      sortable: true,
    },

    {
      name: 'costCenter',
      required: true,
      label: 'Centro de costos',
      align: 'left',
      field: 'costCenter',
      sortable: true,
    },

    {
      name: 'cashFlow',
      required: true,
      label: 'Flujo de caja',
      align: 'left',
      field: 'cashFlow',
      sortable: true,
    },

    {
      name: 'balance',
      required: true,
      label: 'Saldo cuenta bancaria',
      align: 'left',
      field: 'balance',
      sortable: true,
    },

    {
      name: 'planInvesment',
      required: true,
      label: 'Saldo plan de inversión',
      align: 'left',
      field: 'planInvesment',
      sortable: true,
    },

    {
      name: 'actions',
      required: true,
      label: 'Acciones',
      align: 'left',
      field: 'actions',
      sortable: true,
    },
  ] as QTable['columns']

  const tableOriginProps = ref({
    title: 'Detalle Origen',
    loading: false,
    columns: [...(addColumns || [])] as QTable['columns'],
    rows: getInfoOrigin,
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })

  const tableDestinyProps = ref({
    title: 'Detalle Destino',
    loading: false,
    columns: [...(addColumns || [])] as QTable['columns'],
    rows: getInfoDestiny,
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })

  const formOfficesFilter = ref<IFormOfficesFilter>({
    date: null,
    fiduciaryOffice: null,
    fiduciaryOfficeName: null,
    instructionsView: null,
  })

  const alertConfirmConfig = ref({
    title: 'Advertencia',
    description: 'Seguro desea confirmar la creación',
    btnLabel: '',
    entityId: null as number | null,
    infoModal: [] as { title: string; description: string }[],
  })

  const getOfficesficsOptions = computed(() => offices_fics.value ?? [])

  const updateFilter = async (infoForm: IBankTransferFilter) => {
    formOfficesFilter.value.date = infoForm.date
    formOfficesFilter.value.fiduciaryOffice = infoForm.office_id
    formOfficesFilter.value.fiduciaryOfficeName = infoForm.name_office
    formOfficesFilter.value.instructionsView = infoForm.observations
  }

  const updateTableOrigin = async (infoForm: IBankTransferDetail) => {
    const originForm = [
      {
        id: Number(infoForm.business_trust_id),
        businessCode: String(infoForm.business_trust_id),
        movement: String(infoForm.movement_id),
        bankName: String(infoForm.bank_id),
        founderType: String(infoForm.found_id),
        bussinessPlan: String(infoForm.investment_plans_id),
        trustInvestmentPlan: String(infoForm.trust_investment_plan),
        valueForeignCurrency: String(infoForm.foreign_currency_value),
      },
    ]
    infoOrigin.value = originForm
  }

  const updateTableDestiny = async (infoForm: IBankTransferDetail) => {
    const destinyForm = [
      {
        id: Number(infoForm.business_trust_id),
        businessCode: String(infoForm.business_trust_id),
        movement: String(infoForm.movement_id),
        bankName: String(infoForm.bank_id),
        founderType: String(infoForm.found_id),
        bussinessPlan: String(infoForm.investment_plans_id),
        trustInvestmentPlan: String(infoForm.trust_investment_plan),
        valueForeignCurrency: String(infoForm.foreign_currency_value),
      },
    ]

    infoDestiny.value = destinyForm
  }

  const openTransferConfirmModal = () => {
    alertTransferConfirmlRef.value.openModal()
  }

  const closeTransferConfirmModal = () => {
    alertTransferConfirmlRef.value.closeModal()
  }

  const createBankBankTransfer = async (
    byOriginForm: IBankTrasferCreateAndUpdate | null,
    byDestinyForm: IBankTrasferCreateAndUpdate | null
  ) => {
    alertTransferConfirmlRef.value.closeModal()

    openMainLoader(true)
    if (byOriginForm && byDestinyForm) {
      await _createBankTransfer(byOriginForm, 'origins')

      if (bankTransferId.value)
        await _createDestinyBankTransfer(
          byDestinyForm,
          bankTransferId.value,
          'destinations'
        )

      if (filterForm.value && bankTransferId.value)
        await _updateBankTransferConfirm(bankTransferId.value, filterForm.value)
    }

    goToURL('BankTransferList')

    openMainLoader(false)
  }

  const showTransferDetail = (openDetail: boolean, type: string) => {
    if (type === 'origin') {
      showOrigin.value = openDetail
    } else {
      showDestiny.value = openDetail
    }
  }

  const updateTransferBankTab = (goToTab: IBankTransferTypeAction) => {
    _updateTransferBankTab(goToTab)
  }

  const showConvertToInfo = (
    columns: QTable['columns'] | undefined,
    descriptions: (IOriginInfo | null)[]
  ): IConvertedInfo[] => {
    if (!columns || !descriptions.length) return []

    const descriptionData = descriptions.find(
      (item): item is IOriginInfo => item !== null
    )
    if (!descriptionData) return []

    const filteredColumns = columns.filter((col) => col.name !== 'actions')

    return filteredColumns.map((col) => ({
      title: col.label,
      description: String(descriptionData[col.name as keyof IOriginInfo] ?? ''),
    }))
  }

  const resetFullBankTraslate = async () => {
    openMainLoader(true)
    await _resetAllBankTransfer()
    goToURL('BankTransferList')
    openMainLoader(false)
  }

  watch(
    () => formOfficesFilter.value.fiduciaryOffice,
    () => {
      const currentOfficeName = getOfficesficsOptions.value.find(
        (item) => item.value === formOfficesFilter.value.fiduciaryOffice
      )?.nameOffice
      formOfficesFilter.value.fiduciaryOfficeName = currentOfficeName ?? null
    }
  )

  onMounted(async () => {
    openMainLoader(true)
    if (filterForm.value) {
      await updateFilter(filterForm.value)
    }
    if (formOrigin.value) {
      await updateTableOrigin(formOrigin.value)

      const setupFilterOrigin = {
        date: filterForm.value?.date ?? null,
        office_id: filterForm.value?.office_id ?? null,
        name_office: filterForm.value?.name_office ?? null,
        observations: filterForm.value?.observations ?? null,
        bank_transfer_id: filterForm.value?.bank_transfer_id ?? null,
      }

      const setupOriginDatail = {
        business_trust_id: formOrigin.value.business_trust_id ?? null,
        movement_id: formOrigin.value.movement_id ?? null,
        bank_id: formOrigin.value.bank_id ?? null,
        bank_account_id: formOrigin.value.bank_account_id ?? null,
        found_id: formOrigin.value.found_id ?? null,
        investment_plans_id: formOrigin.value.investment_plans_id ?? null,
        means_of_payment_id: formOrigin.value.means_of_payment_id ?? null,
        foreign_currency_value: formOrigin.value.foreign_currency_value ?? null,
        coin: formOrigin.value.coin ?? null,
        trm: formOrigin.value.trm ?? null,
        value: formOrigin.value.value ?? null,
        cost_center_id: formOrigin.value.cost_center_id ?? null,
        cash_flow_id: formOrigin.value.cash_flow_id ?? null,
        bank_account_balance: formOrigin.value.bank_account_balance ?? null,
        investment_plan_balance:
          formOrigin.value.investment_plan_balance ?? null,
      }
      const infoOrigin = {
        ...setupFilterOrigin,
        details: [{ ...setupOriginDatail }],
      }

      _updateFormCreateAndUpdateOrigin(infoOrigin)
    }
    if (formDestiny.value) {
      await updateTableDestiny(formDestiny.value)
      const setupFilterDestiny = {
        date: filterForm.value?.date ?? null,
        office_id: filterForm.value?.office_id ?? null,
        name_office: filterForm.value?.name_office ?? null,
        observations: filterForm.value?.observations ?? null,
        bank_transfer_id: filterForm.value?.bank_transfer_id ?? null,
      }

      const setupDestinyDatail = {
        business_trust_id: formDestiny.value.business_trust_id ?? null,
        movement_id: formDestiny.value.movement_id ?? null,
        bank_id: formDestiny.value.bank_id ?? null,
        bank_account_id: formDestiny.value.bank_account_id ?? null,
        found_id: formDestiny.value.found_id ?? null,
        investment_plans_id: formDestiny.value.investment_plans_id ?? null,
        type_receive_id: formDestiny.value.type_receive_id ?? null,
        foreign_currency_value:
          formDestiny.value.foreign_currency_value ?? null,
        coin: formDestiny.value.coin ?? null,
        trm: formDestiny.value.trm ?? null,
        value: formDestiny.value.value ?? null,
        cost_center_id: formDestiny.value.cost_center_id ?? null,
        cash_flow_id: formDestiny.value.cash_flow_id ?? null,
        bank_account_balance: formDestiny.value.bank_account_balance ?? null,
        investment_plan_balance:
          formDestiny.value.investment_plan_balance ?? null,
      }
      const infoDestiny = {
        ...setupFilterDestiny,
        details: [{ ...setupDestinyDatail }],
      }

      _updateFormCreateAndUpdateDestiny(infoDestiny)
    }

    openMainLoader(false)
  })

  return {
    tableOriginProps,
    tableDestinyProps,
    getOfficesficsOptions,
    formOfficesFilter,
    formDestiny,
    formOrigin,
    filterForm,
    defaultIconsLucide,
    alertTransferConfirmlRef,
    alertConfirmConfig,
    formFilterInitial,
    cardDestinyInfo,
    cardOriginInfo,
    getInfoDestiny,
    getInfoOrigin,
    showOrigin,
    showDestiny,
    formCreateAndUpdateOrigin,
    formCreateAndUpdateDestiny,
    showTransferDetail,
    createBankBankTransfer,
    openTransferConfirmModal,
    closeTransferConfirmModal,
    updateTransferBankTab,
    showConvertToInfo,
    resetFullBankTraslate,
  }
}

export default useTransferBankViewForm
