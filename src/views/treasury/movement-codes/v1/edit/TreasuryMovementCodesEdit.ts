import { reactive, ref, onUnmounted, onBeforeMount } from 'vue'
import { defaultIconsLucide } from '@/utils'
import { useRoute, useRouter } from 'vue-router'
import { useMainLoader } from '@/composables'
import { useMovementCodeStore } from '@/stores'
import { storeToRefs } from 'pinia'

export const useTreasuryMovementCodesEdit = () => {
  const { openMainLoader } = useMainLoader()
  const router = useRouter()
  const route = useRoute()
  const movementCodeId = +route.params.id
  const { data_information_form, movement_codes_request } = storeToRefs(
    useMovementCodeStore('v1')
  )
  const {
    _setDataInformationForm,
    _updateMovementCodes,
    _getByIdMovementCodes,
  } = useMovementCodeStore('v1')

  const headerProps = ref({
    title: 'Editar códigos de movimiento de tesorería',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Tesorería', route: '' },
      { label: 'Códigos de movimiento', route: 'TreasuryMovementCodesList' },
      { label: 'Editar', route: 'TreasuryMovementCodesEdit' },
      { label: String(movementCodeId) },
    ],
  })

  const tabs = reactive([
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
  const tabActiveIdx = ref(
    tabs.findIndex((tab) => tab.name === activeTab.value)
  )
  const informationFormRef = ref()

  onUnmounted(() => {
    _setDataInformationForm(null)
  })

  const handlerGoTo = (goURL: string) => {
    router.push({ name: goURL })
  }

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

  const formInformation = ref()

  const validateForm = async () => {
    return (await formInformation.value?.validateForm()) ?? false
  }

  const onSubmit = async () => {
    if (await validateForm()) {
      openMainLoader(true)
      const payload = makeDataRequest()
      if (await _updateMovementCodes(payload, movementCodeId)) {
        router.push({ name: 'TreasuryMovementCodesList' })
      }
      setTimeout(() => {
        openMainLoader(false)
      }, 1000)
    }
  }

  onBeforeMount(async () => {
    openMainLoader(true)
    await _getByIdMovementCodes(movementCodeId)
    openMainLoader(false)
  })

  return {
    //STATES
    headerProps,
    tabs,
    activeTab,
    tabActiveIdx,
    informationFormRef,
    data_information_form,
    movement_codes_request,
    formInformation,

    //METHODS
    handlerGoTo,
    onSubmit,
  }
}

export default useTreasuryMovementCodesEdit
