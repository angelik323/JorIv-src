// Vue - pinia
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

// Interfaces
import {
  IAccountsPayableNotificationForm,
  IAccountsPayableNotificationsBusinessTypesIdsBase,
} from '@/interfaces/customs/accounts-payable/AccountsPayableNotifications'
import { ITrustBusinessItemList } from '@/interfaces/customs/trust-business/TrustBusinesses'
import { IRolesList } from '@/interfaces/customs/roles'
import { ITabs } from '@/interfaces/global/Tabs'
import { IGenericResource } from '@/interfaces/customs/resources/Common'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useAccountsPayableNotificationsStore } from '@/stores/accounts-payable/accounts-payable-notifications'

export const useAccountsPayableNotificationsView = () => {
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()
  const route = useRoute()

  const { defaultIconsLucide } = useUtils()

  const { _getAccountsPayableNotificationById } =
    useAccountsPayableNotificationsStore('v1')

  const basic_data_form = ref<IAccountsPayableNotificationForm | null>(null)

  const basicDataFormRef = ref()

  const preload_business_trust = ref<ITrustBusinessItemList[]>([])

  const accountsPayableNotificationIdId = +route.params.id

  const headerProps = {
    title: 'Ver notificación de cuentas por pagar',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Cuentas por pagar', route: '' },
      {
        label: 'Notificaciones',
        route: 'AccountsPayableNotificationsList',
      },
      {
        label: 'Ver',
        route: 'AccountsPayableNotificationsView',
      },
      {
        label: `${accountsPayableNotificationIdId}`,
      },
    ],
  }

  const tabs: ITabs[] = [
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ]

  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  const setViewData = async () => {
    const data = await _getAccountsPayableNotificationById(
      accountsPayableNotificationIdId
    )
    if (!data) return
    basic_data_form.value = {
      ...data,
      notification_number: data.id,
      module: data.module?.label ?? null,
      process: data.process?.label ?? null,
      sub_process: data.sub_process?.label ?? null,
      channels: data.channels
        .map((channel: IGenericResource) => channel.label)
        .join(', '),
      business_type_ids: data.business_type_ids.map(
        (type: IAccountsPayableNotificationsBusinessTypesIdsBase) => type.id
      ),
      business_sub_type_ids: data.business_sub_type_ids.map(
        (subtype: IAccountsPayableNotificationsBusinessTypesIdsBase) =>
          subtype.id
      ),
      recipients: data.recipients
        .map((recipient: IRolesList) => recipient.name)
        .join(', '),
      selected_business_trust: data.business_trust_ids,
    }
    preload_business_trust.value = [...data.business_trust_ids]
  }

  onMounted(async () => {
    openMainLoader(true)
    await setViewData()
    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  })

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    basicDataFormRef,
    basic_data_form,
    preload_business_trust,
    goToURL,
  }
}

export default useAccountsPayableNotificationsView
