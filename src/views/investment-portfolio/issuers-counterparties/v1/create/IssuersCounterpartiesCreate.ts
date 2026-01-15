import { useMainLoader, useAlert, useUtils } from '@/composables'
import type { IIssuersCounterpartiesForm } from '@/interfaces/customs'
import { useIssuersCounterpartiesStore } from '@/stores'
import { defaultIconsLucide } from '@/utils'
import { storeToRefs } from 'pinia'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const useIssuersCounterpartiesCreate = () => {
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const { cleanEmptyFields } = useUtils()
  const { showAlert } = useAlert()
  const informationFormRef = ref()

  const { headerPropsDefault, data_issuers_counterparties_form } = storeToRefs(
    useIssuersCounterpartiesStore('v1')
  )

  const { _createAction } = useIssuersCounterpartiesStore('v1')

  const headerProperties = {
    ...headerPropsDefault.value,
    title: 'Crear emisores y contrapartes',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Crear',
      },
    ],
  }

  const tabs = reactive([
    {
      name: 'InformationForm',
      label: 'Datos Básicos',
      icon: defaultIconsLucide.listBulleted,
      outlined: true,
      disable: false,
      show: true,
      required: true,
    },
  ])
  const activeTab = ref(tabs[0].name)
  const tabActiveIdx = ref(
    tabs.findIndex((tab) => tab.name === activeTab.value)
  )

  const handlerGoTo = (goURL: string) => {
    router.push({ name: goURL })
  }

  const validateForms = async () => {
    if (activeTab.value === 'InformationForm') {
      return await informationFormRef.value?.validateForm()
    }

    return true
  }

  const onSubmit = async () => {
    if (!(await validateForms()) || !data_issuers_counterparties_form.value) {
      return
    }
    const payload = cleanEmptyFields(
      data_issuers_counterparties_form.value
    ) as IIssuersCounterpartiesForm

    if (payload.class_ratings?.length === 0) {
      showAlert(
        'Debe seleccionar al menos una clase de calificación',
        'warning'
      )
      return
    }

    openMainLoader(true)

    if (await _createAction(payload)) {
      router.push({ name: 'IssuersCounterpartiesList' })
    }

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  return {
    headerProperties,
    tabs,
    activeTab,
    tabActiveIdx,
    informationFormRef,
    handlerGoTo,
    onSubmit,
  }
}

export default useIssuersCounterpartiesCreate
