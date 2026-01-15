// vue - router - quasar
import { ref, onMounted } from 'vue'
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
import { useAccountingSettingsStore } from '@/stores/settlement-commissions/accounting-settings'

const AccountingSettingsView = () => {
  const { _getByIdAccountingSettings } = useAccountingSettingsStore('v2')

  // Data de formularios
  const basic_data_form = ref<IAccountingSettingsInformationFormV2 | null>(null)

  // Referencias a formularios
  const basicDataFormRef = ref()

  const route = useRoute()
  const searchId = +route.params.id

  const headerProperties = {
    title: 'Ver parámetros contables',
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
        label: 'Ver',
        route: 'AccountingSettingsView',
      },
      {
        label: `${searchId}`,
      },
    ],
  }

  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()

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

  const setFormView = (data: IAccountingSettingsResponseV2) => {
    basic_data_form.value = {
      who_pays: data.who_pays,
      accounts: data.accounts ? 'Si' : 'No',

      business_code_snapshot: data.business_code_snapshot,
      billing_trusts_id: data.billing_trusts_id,

      start_date: data?.billing_trust?.start_date,
      end_date: data?.billing_trust?.end_date,

      generates_iva: data.generates_iva ? 'Si' : 'No',
      has_retefuente: data.has_retefuente ? 'Si' : 'No',
      has_reteica: data.has_reteica ? 'Si' : 'No',
      has_reteiva: data.has_reteiva ? 'Si' : 'No',

      iva: data.iva,
      retefuente: data.retefuente,
      reteica: data.reteica,
      reteiva: data.reteiva,

      business_movement_code_snapshot: data.business_movement_code_snapshot,
      business_movement_name_snapshot: data.business_movement_name_snapshot,
      business_movement_id_snapshot: data.business_movement_id_snapshot,
      business_movement_nature_snapshot: data.business_movement_nature_snapshot,

      periodicity: data?.billing_trust?.periodicity,
      business_name:
        (data.business_code_snapshot ?? '') +
        ' - ' +
        (data.business_name_snapshot ?? ''),
      billing_trusts_name:
        (data?.billing_trust?.code ?? '') +
        ' - ' +
        (data?.billing_trust?.periodicity ?? ''),
    }
  }

  const onSubmit = async () => {
    goToURL('AccountingSettingsList')
  }

  onMounted(async () => {
    openMainLoader(true)
    const response = await _getByIdAccountingSettings(searchId)
    if (response) setFormView(response)
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

export default AccountingSettingsView
