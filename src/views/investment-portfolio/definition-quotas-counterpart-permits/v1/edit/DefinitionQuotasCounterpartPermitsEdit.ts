import { ref, onBeforeMount, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import { useMainLoader, useUtils } from '@/composables'
import { IDefinitionQuotaCounterpartPermitRequest } from '@/interfaces/customs'
import { ITabs } from '@/interfaces/global'
import {
  useDefinitionQuotaCounterpartPermitStore,
  useResourceManagerStore,
} from '@/stores'

const useDefinitionQuotaCounterpartPermitEdit = () => {
  const route = useRoute()
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()

  const { _updateAction, _setDataForm, _getByIdAction, _clearData } =
    useDefinitionQuotaCounterpartPermitStore('v1')
  const { data_view, data_form } = storeToRefs(
    useDefinitionQuotaCounterpartPermitStore('v1')
  )
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const keys = {
    investment_portfolio: [
      'third_party_issuers_selector',
      'selectable_portfolios_with_code_and_name',
      'inversion_types',
    ],
  }
  const keyPaperType = { investment_portfolio: ['paper_type'] }

  const informationFormRef = ref()
  const definitionQuotaCounterpartPermitId = +route.params.id

  const headerProps = {
    title: 'Editar cupos y permisos contraparte',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Tesorería',
      },
      {
        label: 'Definición cupos y permisos contraparte',
        route: 'DefinitionQuotasCounterpartPermitsList',
      },
      {
        label: 'Editar',
      },
      {
        label: `${definitionQuotaCounterpartPermitId}`,
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

  const makeDataRequest = (): IDefinitionQuotaCounterpartPermitRequest => {
    const form = data_form.value

    return {
      counterpart_id: form?.counterpart_id ?? null,
      investment_portfolio_id: form?.investment_portfolio_id ?? null,
      general_quota: form?.general_quota ?? null,
      paper_type_id: form?.paper_type_id ?? null,
    }
  }

  const validateForm = async () => {
    return (await informationFormRef.value?.validateForm()) ?? false
  }

  const onSubmit = async () => {
    if (!(await validateForm())) return
    openMainLoader(true)

    const payload = makeDataRequest()
    const success = await _updateAction(
      payload,
      definitionQuotaCounterpartPermitId
    )

    if (success) {
      await _setDataForm(null)
      router.push({ name: 'DefinitionQuotasCounterpartPermitsList' })
    }
    openMainLoader(false)
  }

  onBeforeMount(() => {
    openMainLoader(true)
    _getByIdAction(definitionQuotaCounterpartPermitId).finally(() => {
      _getResources(keys)
      _resetKeys(keyPaperType)
      openMainLoader(false)
    })
  })

  onBeforeUnmount(() => {
    _clearData()
    _resetKeys(keys)
    _resetKeys(keyPaperType)
  })

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    informationFormRef,
    onSubmit,
    data_view,
  }
}

export default useDefinitionQuotaCounterpartPermitEdit
