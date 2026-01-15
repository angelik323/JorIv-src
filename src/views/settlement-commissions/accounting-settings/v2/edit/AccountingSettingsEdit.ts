// vue - router - quasar
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'

// Interfaces
import {
  IAccountingSettingsInformationFormV2,
  IAccountingSettingsResponseV2,
} from '@/interfaces/customs/settlement-commissions/AccountingSettingsV2'
import { ITabs } from '@/interfaces/global'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useAccountingSettingsStore } from '@/stores/settlement-commissions/accounting-settings'

const useAccountingSettingsEdit = () => {
  const { _updateAccountingSettings, _getByIdAccountingSettings } =
    useAccountingSettingsStore('v2')

  // Data de formularios
  const basic_data_form = ref<IAccountingSettingsInformationFormV2 | null>(null)

  // Referencias a formularios
  const basicDataFormRef = ref()

  const route = useRoute()
  const searchId = +route.params.id
  const { openMainLoader } = useMainLoader()
  const { cleanEmptyFields, defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const headerProperties = {
    title: 'Editar parámetros contables',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Liquidación de comisiones',
      },
      {
        label: 'Parámetros contables',
        route: 'AccountingSettingsList',
      },
      {
        label: 'Editar',
        route: 'AccountingSettingsEdit',
      },
      {
        label: `${searchId}`,
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

  const setFormEdit = (data: IAccountingSettingsResponseV2) => {
    basic_data_form.value = {
      who_pays: data.who_pays ?? null,
      accounts: data.accounts ? 'si' : 'no',

      business_code_snapshot: Number(data.business_code_snapshot),
      billing_trusts_id: data.billing_trusts_id ?? null,
      periodicity: data.billing_trust?.periodicity ?? null,

      start_date: data.billing_trust?.start_date ?? null,
      end_date: data.billing_trust?.end_date ?? null,

      generates_iva: data.generates_iva ? 'si' : 'no',
      has_retefuente: data.has_retefuente ? 'si' : 'no',
      has_reteica: data.has_reteica ? 'si' : 'no',
      has_reteiva: data.has_reteiva ? 'si' : 'no',

      iva: data.iva ?? null,
      retefuente: data.retefuente ?? null,
      reteica: data.reteica ?? null,
      reteiva: data.reteiva ?? null,

      business_movement_code_snapshot:
        data.business_movement_code_snapshot ?? null,
      business_movement_name_snapshot:
        data.business_movement_name_snapshot ?? null,
      business_movement_id_snapshot: Number(data.business_movement_id_snapshot),
      business_movement_nature_snapshot:
        data.business_movement_nature_snapshot ?? null,
    }
  }

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
      ...makeBaseInfoRequest(basic_data_form.value),
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
    const success = await _updateAccountingSettings(payload, searchId)
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
    const reponse = await _getByIdAccountingSettings(searchId)
    if (reponse) {
      setFormEdit(reponse)
    }
    await _getResources(keys)

    openMainLoader(false)
  })

  return {
    basic_data_form,
    basicDataFormRef,
    headerProperties,
    tabs,
    tabActive,
    tabActiveIdx,

    onSubmit,
    goToURL,
  }
}

export default useAccountingSettingsEdit
