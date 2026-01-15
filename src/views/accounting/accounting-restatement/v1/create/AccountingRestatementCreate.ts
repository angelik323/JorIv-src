import { useMainLoader } from '@/composables'
import { ITabs } from '@/interfaces/global'
import { useAccountingRestatementStore, useResourceStore } from '@/stores'
import { defaultIconsLucide } from '@/utils'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const useAccountingRestatementCreate = () => {
  const router = useRouter()
  const { openMainLoader } = useMainLoader()

  const accountingRestatementForm = ref()
  const { accounting_validate_statement } = storeToRefs(
    useAccountingRestatementStore('v1')
  )

  const { _getAccountingResources } = useResourceStore('v1')
  const keys = ['account_structures_with_purpose']

  const headerProps = {
    title: 'Crear reexpresión de moneda extranjera',
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
        label: 'Reexpresión de moneda extranjera',
        route: 'AccountingRestatementList',
      },
      {
        label: 'Crear',
        route: 'AccountingRestatementCreate',
      },
    ],
  }
  const tabs = ref<ITabs[]>([
    {
      name: 'terminos',
      label: 'Términos',
      icon: defaultIconsLucide.listBulleted,
      outlined: true,
      disable: accounting_validate_statement.value.terms,
      show: true,
      required: false,
    },
    {
      name: 'ejecutar',
      label: 'Ejecutar',
      icon: defaultIconsLucide.cached,
      outlined: true,
      disable: accounting_validate_statement.value.execute,
      show: true,
      required: false,
    },
    {
      name: 'Informe de procesos',
      label: 'Informe de procesos',
      icon: defaultIconsLucide.fileOutline,
      outlined: true,
      disable: accounting_validate_statement.value.processInformation,
      show: accounting_validate_statement.value.processInformation,
      required: false,
    },
  ])

  watch(accounting_validate_statement, (newVal) => {
    tabs.value[0].disable = newVal.terms
    tabs.value[1].disable = newVal.execute
    tabs.value[2].disable = newVal.processInformation
  })

  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))

  const tabActive = ref(filteredTabs.value[0].name)

  const tabActiveIdx = ref(
    filteredTabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const validateForms = async () => {
    return accountingRestatementForm?.value?.validateForm()
  }

  onMounted(async () => {
    await _getAccountingResources(`keys[]=${keys.join('&keys[]=')}`)
  })

  const onSubmit = async () => {
    if (await validateForms()) {
      openMainLoader(true)
      setTimeout(() => {
        router.push({ name: 'AccountingRestatementList' })
      }, 5000)
      setTimeout(() => {
        openMainLoader(false)
      }, 1000)
    }
  }

  return {
    headerProps,
    filteredTabs,
    tabActive,
    tabActiveIdx,
    accountingRestatementForm,
    onSubmit,
  }
}
export default useAccountingRestatementCreate
