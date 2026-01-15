import { useMainLoader } from '@/composables'
import { IAnnualPeriodClosingModel } from '@/interfaces/customs'
import { ITabs } from '@/interfaces/global'
import router from '@/router'
import { useAnnualPeriodClosingStore, useResourceManagerStore } from '@/stores'
import { defaultIconsLucide } from '@/utils'
import { computed, onBeforeMount, onMounted, ref } from 'vue'

const useAnnualPeriodClosingCreate = () => {
  const { openMainLoader } = useMainLoader()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _executeAnnualClosure, _createAnnualClosing } =
    useAnnualPeriodClosingStore('v1')

  const annualPeriodClosingForm = ref()
  const executeForm = ref()

  const keys = [
    'accounting_chart_operative_by_structure',
    'account_structures_accounting_accounts',
    'not_consolidator_business_trust',
    'third_parties',
  ]

  const headerProps = {
    title: 'Crear cierre de periodo anual',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Contabilidad',
        route: '',
      },
      {
        label: 'Cierre de período anual',
        route: 'AnnualPeriodClosingList',
      },
      {
        label: 'Crear',
        route: 'AnnualPeriodClosingsCreate',
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
    {
      name: 'Execute',
      label: 'Ejecutar',
      icon: defaultIconsLucide.information,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))

  const tabActive = ref(filteredTabs.value[0].name)

  const tabActiveIdx = ref(
    filteredTabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const nextTab = async () => {
    tabActiveIdx.value = tabActiveIdx.value + 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const models = ref<IAnnualPeriodClosingModel>({
    accounting_structure_id: 0,
    to_account_code: '',
    from_business_trust_id: '',
    to_business_trust_id: '',
    from_third_party_id: 0,
  })

  const modelsExecute = ref<IAnnualPeriodClosingModel>({
    from_business_trust_id: '',
    to_business_trust_id: '',
  })

  const alertModalRef = ref()

  const arrayBusiness = ref<any[]>([])

  const validateForms = async () => {
    return annualPeriodClosingForm?.value?.validateForm()
  }

  const validateFormsExecute = async () => {
    return executeForm?.value?.validateForm()
  }

  const handleFormUpdate = () => {
    models.value = annualPeriodClosingForm.value.getFormData()
    onSubmit()
  }
  const handleExecuteFormpdate = () => {
    modelsExecute.value = executeForm.value.getFormData()
    onSubmitExecute()
  }

  const onSubmit = async () => {
    if (await validateForms()) {
      openMainLoader(true)
      const payload = JSON.parse(JSON.stringify(models.value))
      const result = await _executeAnnualClosure(payload)
      if (result.success) {
        arrayBusiness.value = result.data
        nextTab()
      }
      setTimeout(() => {
        openMainLoader(false)
      }, 1000)
    }
  }

  const onSubmitExecute = async () => {
    if (await validateFormsExecute()) {
      openMainLoader(true)
      const payload = JSON.parse(JSON.stringify(models.value))
      payload.from_business_trust_id =
        typeof modelsExecute.value.from_business_trust_id === 'object'
          ? modelsExecute.value.from_business_trust_id?.id
          : modelsExecute.value.from_business_trust_id

      payload.to_business_trust_id =
        typeof modelsExecute.value.to_business_trust_id === 'object'
          ? modelsExecute.value.to_business_trust_id?.id
          : modelsExecute.value.to_business_trust_id

      if (await _createAnnualClosing(payload)) {
        router.push({
          name: 'AnnualPeriodClosingList',
        })
      }
      setTimeout(() => {
        openMainLoader(false)
      }, 1000)
    }
  }

  onMounted(
    async () =>
      await _getResources(
        {
          accounting: ['account_structures_accounting_accounts'],
        },
        '',
        'v2'
      )
  )

  onBeforeMount(async () => _resetKeys({ accounting: keys }))

  return {
    headerProps,
    filteredTabs,
    tabActive,
    tabActiveIdx,
    models,
    alertModalRef,
    arrayBusiness,
    executeForm,
    annualPeriodClosingForm,
    nextTab,
    backTab,
    onSubmit,
    handleExecuteFormpdate,
    handleFormUpdate,
    onSubmitExecute,
  }
}

export default useAnnualPeriodClosingCreate
