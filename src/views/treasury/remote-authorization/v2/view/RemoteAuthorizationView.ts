// Vue & Vue Router
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

// Utils & Stores
import { defaultIconsLucide } from '@/utils'
import { useRemoteAuthorization } from '@/stores'

// Interfaces
import {
  AuthorizationViewModelV2,
  IRemoteAuthorizationDetailV2,
} from '@/interfaces/customs/treasury/RemotoAuthorizationV2'
import { ITabs } from '@/interfaces/global'

const useRemoteAuthorizationView = () => {
  const route = useRoute()
  const id = Number(route.params.id)

  const raStore = useRemoteAuthorization('v2')
  const { _get } = raStore

  const raw = ref<IRemoteAuthorizationDetailV2 | null>(null)

  const authorization = computed<AuthorizationViewModelV2>(() => {
    if (!raw.value) {
      return {
        number: '-',
        request_date: '-',
        register: '-',
        process: '-',
        requester_user: '-',
        module: '-',
        status_id: 0,
        description: '-',
        requester_notes: '-',
        rejection_reason: '-',
        authorized_by: { id: '-', name: '-' },
        bank_data: { bank_code: '-', nit: '-' },
        status: { id: 0, name: '-' },
        old_entity: '-',
      }
    }

    const r = raw.value
    const requesterUser =
      r.created_by?.name ||
      r.request_user?.display ||
      [r.request_user?.first_name, r.request_user?.last_name]
        .filter(Boolean)
        .join(' ')
        .trim() ||
      r.request_user?.username ||
      '-'

    return {
      number: r.authorization_code ?? '-',
      request_date: r.authorization_request_date ?? r.requested_at ?? '-',
      register: String(r.record_number ?? r.id ?? '-'),
      process: r.process ?? '-',
      requester_user: requesterUser,
      module: r.module_label ?? r.module ?? '-',
      status_id: r.status?.id ?? 0,
      description: r.description ?? '-',
      requester_notes: r.observations ?? '-',
      rejection_reason: r.rejection_reason ?? '-',
      authorized_by: r.authorized_by ?? { id: '-', name: '-' },
      bank_data: r.bank_data ?? { bank_code: '-', nit: '-' },
      status: r.status ?? { id: 0, name: '-' },
      old_entity: r.old_entity ?? '-',
    }
  })

  const headerProps = {
    title: 'Ver autorización remota de tesorería',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Tesorería' },
      {
        label: 'Solicitudes de autorización',
        route: 'RemoteAuthorizationList',
      },
      { label: 'Ver', route: 'RemoteAuthorizationView', params: { id } },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'basic_data',
      label: 'Datos básicos*',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])
  const filteredTabs = computed(() => tabs.value.filter((t) => t.show))
  const tabActive = ref(filteredTabs.value[0]?.name ?? 'basic_data')
  const tabActiveIdx = ref(
    Math.max(
      0,
      filteredTabs.value.findIndex((t) => t.name === tabActive.value)
    )
  )

  onMounted(async () => {
    const res = (await _get(id)) as IRemoteAuthorizationDetailV2 | null
    raw.value = res
  })

  return {
    headerProps,
    filteredTabs,
    tabActive,
    tabActiveIdx,
    authorization,
  }
}

export default useRemoteAuthorizationView
