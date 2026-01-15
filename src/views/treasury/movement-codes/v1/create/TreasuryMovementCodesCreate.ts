import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMainLoader } from '@/composables'
import { defaultIconsLucide } from '@/utils'
import { useMovementCodeStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { ITabs } from '@/interfaces/global'

export const useTreasuryMovementCodesCreate = () => {
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const { data_information_form } = storeToRefs(useMovementCodeStore('v1'))
  const { _setDataInformationForm, _createMovementCodes, _getMovementCodes } =
    useMovementCodeStore('v1')

  const headerProps = {
    title: 'Crear códigos de movimiento de tesorería',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Tesorería', route: '' },
      {
        label: 'Códigos de movimientos de tesorería',
        route: 'TreasuryMovementCodesList',
      },
      {
        label: 'Crear',
        route: 'TreasuryMovementCodesCreate',
      },
    ],
  }

  const tabs = reactive<ITabs[]>([
    {
      name: 'InformationForm',
      label: 'Datos Básicos',
      icon: defaultIconsLucide.listBulleted,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ])

  const activeTab = ref(tabs[0].name)

  const makeDataRequest = () => {
    return {
      description: data_information_form.value?.description,
      nature: data_information_form.value?.nature,
      operation: data_information_form.value?.operation,
      generate_special_contribution:
        data_information_form.value?.generate_special_contribution ?? false,
      handles_accounting_offset:
        data_information_form.value?.handles_accounting_offset ?? false,
      conciliation_movement:
        data_information_form.value?.conciliation_movement ?? false,
      transfer_investments:
        data_information_form.value?.transfer_investments ?? false,
      transfer_accounts:
        data_information_form.value?.transfer_accounts ?? false,
      receipt_types_id: data_information_form.value?.receipt_types_id ?? null,
      sub_receipt_types_id:
        data_information_form.value?.sub_receipt_types_id ?? null,
      move_override: data_information_form.value?.move_override ?? null,
    }
  }

  const tabActiveIdx = ref(
    tabs.findIndex((tab) => tab.name === activeTab.value)
  )

  const handlerGoTo = (goURL: string) => {
    router.push({ name: goURL })
  }

  const informationFormRef = ref()

  const validateForm = async () => {
    return (await informationFormRef.value?.validateForm()) ?? false
  }

  const onSubmit = async () => {
    if (await validateForm()) {
      openMainLoader(true)
      const payload = makeDataRequest()
      if (await _createMovementCodes(payload)) {
        router.push({ name: 'TreasuryMovementCodesList' })
      }
      setTimeout(() => {
        openMainLoader(false)
      }, 1000)
    }
  }

  onMounted(async () => {
    await _getMovementCodes('')
  })

  onUnmounted(() => {
    _setDataInformationForm(null)
  })
  return {
    headerProps,
    tabs,
    activeTab,
    tabActiveIdx,
    informationFormRef,
    handlerGoTo,
    onSubmit,
  }
}

export default useTreasuryMovementCodesCreate
