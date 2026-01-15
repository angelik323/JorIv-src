// Vue
import { onBeforeUnmount, onMounted, ref } from 'vue'

// Interfaces
import { IAccountsPayableNotificationForm } from '@/interfaces/customs/accounts-payable/AccountsPayableNotifications'
import { ITabs } from '@/interfaces/global/Tabs'

// Composables
import { useAlert, useGoToUrl, useMainLoader, useUtils } from '@/composables'

//Store
import { useAccountsPayableNotificationsStore } from '@/stores/accounts-payable/accounts-payable-notifications'
import { useResourceManagerStore } from '@/stores/resources-manager'

export const useAccountsPayableNotificationsCreate = () => {
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()
  const { showAlert } = useAlert()

  const { defaultIconsLucide } = useUtils()

  const { _createAccountsPayableNotification } =
    useAccountsPayableNotificationsStore('v1')

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const basic_data_form = ref<IAccountsPayableNotificationForm | null>(null)

  const basicDataFormRef = ref()

  const headerProps = {
    title: 'Crear notificación de cuentas por pagar',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Cuentas por pagar', route: '' },
      {
        label: 'Notificaciones',
        route: 'AccountsPayableNotificationsList',
      },
      {
        label: 'Crear',
        route: 'AccountsPayableNotificationsCreate',
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

  const handleCreate = async () => {
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
    if (await _createAccountsPayableNotification(payload)) {
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

  onMounted(() => _getResources(keys))

  onBeforeUnmount(() => _resetKeys(keys))

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    basicDataFormRef,
    basic_data_form,
    handleCreate,
    goToURL,
  }
}

export default useAccountsPayableNotificationsCreate
