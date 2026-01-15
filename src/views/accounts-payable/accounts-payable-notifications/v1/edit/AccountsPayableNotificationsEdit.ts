// Vue - pinia
import { onBeforeUnmount, onMounted, ref } from 'vue'
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
import { useAlert, useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Store
import { useAccountsPayableNotificationsStore } from '@/stores/accounts-payable/accounts-payable-notifications'
import { useResourceManagerStore } from '@/stores/resources-manager'

export const useAccountsPayableNotificationsEdit = () => {
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()
  const { showAlert } = useAlert()
  const route = useRoute()

  const { defaultIconsLucide } = useUtils()

  const {
    _updateAccountsPayableNotification,
    _getAccountsPayableNotificationById,
  } = useAccountsPayableNotificationsStore('v1')

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const basic_data_form = ref<IAccountsPayableNotificationForm | null>(null)

  const basicDataFormRef = ref()

  const preload_business_trust = ref<ITrustBusinessItemList[]>([])

  const accountsPayableNotificationIdId = +route.params.id

  const headerProps = {
    title: 'Editar notificación de cuentas por pagar',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Cuentas por pagar', route: '' },
      {
        label: 'Notificaciones',
        route: 'AccountsPayableNotificationsList',
      },
      {
        label: 'Editar',
        route: 'AccountsPayableNotificationsEdit',
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

  const setEditData = async () => {
    const data = await _getAccountsPayableNotificationById(
      accountsPayableNotificationIdId
    )
    if (!data) return
    basic_data_form.value = {
      ...data,
      notification_number: data.id,
      module: data.module?.value ?? null,
      process: data.process?.value ?? null,
      sub_process: data.sub_process?.value ?? null,
      channels: data.channels.map((channel: IGenericResource) => channel.value),
      business_type_ids: data.business_type_ids.map(
        (type: IAccountsPayableNotificationsBusinessTypesIdsBase) => type.id
      ),
      business_sub_type_ids: data.business_sub_type_ids.map(
        (subtype: IAccountsPayableNotificationsBusinessTypesIdsBase) =>
          subtype.id
      ),
      recipients: data.recipients.map((recipient: IRolesList) => recipient.id),
      selected_business_trust: data.business_trust_ids,
    }
    preload_business_trust.value = [...data.business_trust_ids]
  }

  const handleEdit = async () => {
    const isValid = await basicDataFormRef.value?.validateForm()
    if (!isValid) return
    if (!basic_data_form.value) return
    if (
      basic_data_form.value.channels &&
      basic_data_form.value.channels.length === 0
    ) {
      showAlert('Debe seleccionar al menos un medio de notificación', 'error')
      return
    }
    if (
      basic_data_form.value.has_businesses &&
      basic_data_form.value.selected_business_trust.length === 0
    ) {
      showAlert('Debe seleccionar al menos un negocio', 'error')
      return
    }
    openMainLoader(true)
    const payload = {
      ...basic_data_form.value,
      business_type_ids: basic_data_form.value.business_type_ids ?? [],
      business_trust_ids: basic_data_form.value.selected_business_trust.map(
        (row) => row.id
      ),
    }
    if (
      await _updateAccountsPayableNotification(
        payload,
        accountsPayableNotificationIdId
      )
    ) {
      goToURL('AccountsPayableNotificationsList')
    }
    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  const keys = {
    accounts_payable: ['notification_modules', 'notification_channels'],
    trust_business: ['business_trust_types'],
    user: ['roles'],
  }

  onMounted(async () => {
    openMainLoader(true)
    await _getResources(keys)
    await setEditData()
    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  })

  onBeforeUnmount(() => _resetKeys(keys))

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    basicDataFormRef,
    basic_data_form,
    preload_business_trust,
    handleEdit,
    goToURL,
  }
}

export default useAccountsPayableNotificationsEdit
