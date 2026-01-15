import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { defaultIconsLucide } from '@/utils'
import { ITabs } from '@/interfaces/global'
import { useRemoteAuthorization } from '@/stores'
import {
  IRemoteAuthorizationDetail,
  AuthorizationViewModel,
} from '@/interfaces/customs'

const useRemoteAuthorizationView = () => {
  const route = useRoute()
  const id = Number(route.params.id)

  const raStore = useRemoteAuthorization('v1')
  const { _get } = raStore

  const raw = ref<IRemoteAuthorizationDetail | null>(null)

  const authorization = computed<AuthorizationViewModel>(() => {
    if (!raw.value) {
      return {
        number: '-',
        request_date: '-',
        register: '-',
        process: '-',
        requester_user: '-',
        module: '-',
        status: '-',
        status_id: 0,
        description: '-',
        requester_notes: '-',
        rejection_reason: '-',
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
      status: r.status?.name ?? r.status ?? '-',
      status_id: r.status?.id ?? 0,
      description: r.description ?? '-',
      requester_notes: r.observations ?? '-',
      rejection_reason: r.rejection_reason ?? '-',
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
    const res = (await _get(id)) as IRemoteAuthorizationDetail | null
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
