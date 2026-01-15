import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'
import { useResourceManagerStore } from '@/stores'
import { useBankingEntitiesAccountingParametersCommissionsStore } from '@/stores/treasury/banking-entities'

import { ITabs } from '@/interfaces/global'
import { ICreateBankingEntitiesAccountingParametersCommissions } from '@/interfaces/customs/treasury/BankingEntitesAccountingParametersComissions'
import { IBankingEntitiesAccountingParametersCommissions } from '@/interfaces/customs/treasury/BankingEntitesAccountingParametersComissions'
import { useCollectionAccountingBlocksStore } from '@/stores/treasury/collection-accounting-blocks'

const useBankingEntityParametersEdit = () => {
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { defaultIconsLucide, cleanEmptyFields } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()

  const { type_banking_entities_request } = storeToRefs(useBankingEntitiesAccountingParametersCommissionsStore('v1'))

  const {
    _getByIdBankingEntitiesAccountingParametersCommissions,
    _updateBankingEntitiesAccountingParametersCommissions,
  } = useBankingEntitiesAccountingParametersCommissionsStore('v1')

  const {
    collectionAccountingBlockSelected,
  } = storeToRefs(useCollectionAccountingBlocksStore('v1'))

  const route = useRoute()

  const accountingBlockCollectionsId = collectionAccountingBlockSelected.value
  const bankingEntityId = +route.params.id

  const data_information_form = ref<ICreateBankingEntitiesAccountingParametersCommissions | null>(null)
  const informationFormRef = ref()

  const keys = [
    'banks',
    'treasury_movement_codes',
    'commission_rate'
  ]

  const headerProps = {
    title: 'Editar parámetro entidades bancarias',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Tesorería',
        route: '',
      },
      {
        label: 'Bloques contables de recaudo',
        route: 'CollectionAccountingBlocksList',
      },
      {
        label: 'Parámetros entidades bancarias',
        route: '',
      },
       {
        label: 'Editar',
        route: '',
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos*',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const tabActive = ref(tabs.value[0].name)
  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const makeBaseInfoRequest = (data: ICreateBankingEntitiesAccountingParametersCommissions | null) => {
    if (!data) return {}

    const request: Partial<ICreateBankingEntitiesAccountingParametersCommissions> = {
      bank_id: data.bank_id ?? 0,
      description: data.description ?? "",
      accounting_blocks_collection_id: accountingBlockCollectionsId ?? 0,
      treasury_movement_code_id: data.treasury_movement_code_id ?? 0,
      validates_collection_method: data.validates_collection_method ?? false,
      commission_rate: data.commission_rate ?? "",
      commission_percentage: data.commission_percentage ?? 0,
      fixed_value: data.fixed_value ?? 0,
      observations: data.observations ?? ""
    }
    return cleanEmptyFields(request)
  }

  const makeDataRequest = () => {
    const apiRequestBody: Partial<ICreateBankingEntitiesAccountingParametersCommissions> = {
      ...makeBaseInfoRequest(data_information_form.value),
    }

    return apiRequestBody
  }

  const validateForms = async () => {
    let valid: boolean = false
    const forms = [informationFormRef]

    if (tabActiveIdx.value >= 0 && tabActiveIdx.value < forms.length) {
      try {
        valid =
          (await forms[tabActiveIdx.value]?.value?.validateForm()) ?? false
      } catch {
        valid = false
      }
    }
    return valid
  }

  const nextTab = async () => {
    if (!(await validateForms())) return
    tabActiveIdx.value = tabActiveIdx.value + 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const onSubmit = async () => {
    if (!(await validateForms())) return

    openMainLoader(true)
    const payload = makeDataRequest()
    const success = await _updateBankingEntitiesAccountingParametersCommissions(payload as ICreateBankingEntitiesAccountingParametersCommissions, bankingEntityId)
    if (success) {
      goToURL('CollectionAccountingBlocksList')
    }
    openMainLoader(false)
  }

  const setFormEdit = (data: IBankingEntitiesAccountingParametersCommissions) => {
    data_information_form.value = {
      bank_id: data.bank?.id ?? 0,
      description: data.description ?? "",
      accounting_blocks_collection_id: accountingBlockCollectionsId ?? 0,
      treasury_movement_code_id: data.treasury_movement_code_id?.id ?? 0,
      validates_collection_method: data.validates_collection_method ?? false,
      commission_rate: data.commission_rate ?? "",
      commission_percentage: Number(data.commission_percentage) ?? 0,
      fixed_value: data.fixed_value ?? 0,
      observations: data.observations ?? ""
    }
  }
  
  onMounted(async () => {
    await _getByIdBankingEntitiesAccountingParametersCommissions(bankingEntityId)
    await _getResources({
      treasury: keys,
    })
  })

  onBeforeUnmount(() => {
    _resetKeys({
      treasury: keys,
    })
  })

  watch(
    () => type_banking_entities_request.value,
    (val) => {
      if (!val) return
      setFormEdit(val)
    }
  )

  return {
    data_information_form,
    informationFormRef,
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,

    defaultIconsLucide,

    nextTab,
    backTab,
    onSubmit,
    goToURL,
  }
}

export default useBankingEntityParametersEdit