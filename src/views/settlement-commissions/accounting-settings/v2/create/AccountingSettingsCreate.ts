// vue - router - quasar
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'

// Interfaces
import { IAccountingSettingsInformationFormV2 } from '@/interfaces/customs/settlement-commissions/AccountingSettingsV2'
import { ITabs } from '@/interfaces/global'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useAccountingSettingsStore } from '@/stores/settlement-commissions/accounting-settings'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useAccountingSettingsCreate = () => {
  const { _createAccountingSettings } = useAccountingSettingsStore('v2')

  // Data de formularios
  const data_information_form =
    ref<IAccountingSettingsInformationFormV2 | null>(null)

  // Referencias a formularios
  const basicDataFormRef = ref()

  const { openMainLoader } = useMainLoader()
  const { cleanEmptyFields, defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const headerProps = {
    title: 'Crear parámetros contables',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Liquidación de comisiones',
        route: '',
      },
      {
        label: 'Parámetros contables',
        route: 'AccountingSettingsList',
      },
      {
        label: 'Crear',
        route: 'AccountingSettingsCreate',
      },
    ],
  }

  const tabs: ITabs[] = [
    {
      name: 'basic-data',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ]

  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  // Datos básicos form
  const makeBaseInfoRequest = (
    data: IAccountingSettingsInformationFormV2 | null
  ) => {
    if (!data) return {}

    const request: Partial<IAccountingSettingsInformationFormV2> = {
      who_pays: data.who_pays ?? 'fideicomiso',
      accounts: data.accounts === 'si',

      generates_iva: data.generates_iva === 'si',
      has_retefuente: data.has_retefuente === 'si',
      has_reteica: data.has_reteica === 'si',
      has_reteiva: data.has_reteiva === 'si',

      iva: data.iva,
      retefuente: data.retefuente,
      reteica: data.reteica,
      reteiva: data.reteiva,

      business_code_snapshot: data.business_code_snapshot?.toString(),

      business_movement_code_snapshot: data.business_movement_code_snapshot,
      business_movement_name_snapshot: data.business_movement_name_snapshot,
      business_movement_id_snapshot:
        data.business_movement_id_snapshot?.toString(),
      business_movement_nature_snapshot: data.business_movement_nature_snapshot,

      billing_trusts_id: data.billing_trusts_id,
    }
    return cleanEmptyFields(request)
  }

  const makeDataRequest = () => {
    const apiRequestBody: Partial<IAccountingSettingsInformationFormV2> = {
      ...makeBaseInfoRequest(data_information_form.value),
    }

    return apiRequestBody
  }

  const validateForms = async () => {
    let valid: boolean = false
    const forms = [basicDataFormRef]

    if (tabActiveIdx >= 0 && tabActiveIdx < forms.length) {
      try {
        valid = (await forms[tabActiveIdx]?.value?.validateForm()) ?? false
      } catch {
        valid = false
      }
    }
    return valid
  }

  const onSubmit = async () => {
    if (!(await validateForms())) return

    openMainLoader(true)
    const payload = makeDataRequest()
    const success = await _createAccountingSettings(payload)
    if (success) {
      goToURL('AccountingSettingsList')
    }
    openMainLoader(false)
  }

  const keys = {
    settlement_commissions: ['periodicities', 'business_trusts_billing_trusts'],
  }

  const keysToClear = {
    trust_business: ['movement_codes_parameters'],
    settlement_commissions: ['periodicities', 'business_trusts_billing_trusts'],
  }

  onBeforeUnmount(async () => {
    _resetKeys(keysToClear)
  })

  onMounted(async () => {
    openMainLoader(true)
    await _getResources(keys)

    openMainLoader(false)
  })

  const isFormValid = computed(() =>
    Boolean(
      data_information_form.value?.business_code_snapshot &&
        data_information_form.value?.billing_trusts_id &&
        data_information_form.value?.business_movement_id_snapshot
    )
  )

  return {
    data_information_form,
    basicDataFormRef,
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    isFormValid,

    onSubmit,
    goToURL,
  }
}

export default useAccountingSettingsCreate
