import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  ICheckbookDetailResponse,
  ICheckHistoryItem,
  ICheckbookHistoryRaw,
  ICheckbookHeader,
  HistoryUser,
} from '@/interfaces/customs'
import { QTable } from 'quasar'
import { useCheckbookQuery } from '@/stores'

const getUserName = (u: unknown): string => {
  if (u && typeof u === 'object' && 'name' in (u as Record<string, unknown>)) {
    const name = (u as { name?: string | null }).name
    return (name ?? 'Sistema').toString().trim() || '—'
  }
  if (typeof u === 'string') return u || '—'
  return '—'
}

const useCheckbookView = () => {
  const route = useRoute()
  const checkbookId = Number(route.params.id)

  const checkbookRaw = ref<ICheckbookDetailResponse | null>(null)

  const columns: QTable['columns'] = [
    { name: 'id', label: '#', field: 'id', align: 'left', sortable: true },
    {
      name: 'checkbook_code',
      label: 'Chequera',
      field: 'checkbook_code',
      align: 'left',
      sortable: true,
    },
    {
      name: 'check_number',
      label: 'Cheque',
      field: 'check_number',
      align: 'left',
      sortable: true,
    },
    {
      name: 'check_date',
      label: 'Fecha',
      field: 'check_date',
      align: 'left',
      sortable: true,
    },
    {
      name: 'status',
      label: 'Estado',
      field: 'status',
      align: 'left',
      sortable: true,
    },
    {
      name: 'user',
      label: 'Usuario',
      field: 'user',
      align: 'left',
      sortable: true,
    },
    {
      name: 'cancellation_reason',
      label: 'Causales de anulación',
      field: 'cancellation_reason',
      align: 'left',
      sortable: true,
      format: (val: string | null) => val || '—',
    },
  ]

  const headerProps = {
    title: 'Ver libro de cheques',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Tesorería', route: '' },
      { label: 'Libro de cheques', route: 'CheckbookList' },
      {
        label: 'Ver',
        route: 'CheckbookConsultationView',
        params: { id: checkbookId },
      },
    ],
  }

  onMounted(async () => {
    const store = useCheckbookQuery('v1')
    const response = await store._getCheckbookHistory(checkbookId)
    if (!response) return

    const rawHistory = response as unknown as ICheckbookHistoryRaw[]

    const first = rawHistory[0] as ICheckbookHistoryRaw & ICheckbookHeader

    const business_name = first.business

    const bank_name = first.bank

    const bank_account_name = first.bank_account

    const history: ICheckHistoryItem[] = rawHistory.map((item) => {
      return {
        id: item.id,
        checkbook_code: item.checkbook?.code ?? '—',
        check_number: item.consecutive_check ?? '—',
        status:
          item.status && typeof item.status === 'object'
            ? item.status
            : { id: 0, name: '—' },
        check_date: item.date ?? '—',
        user: getUserName(item.user as unknown as HistoryUser),
        cancellation_reason: item.cancellation_reason ?? null,
        amount: 0,
      }
    })

    checkbookRaw.value = {
      id: checkbookId,
      code: '',
      status: '',
      created_at: '',
      created_by: '',
      amount: 0,
      user: '',
      business_name,
      bank_name,
      bank_account_name,
      history,
      business: '',
      bank: '',
      bank_account: '',
    }
  })

  return {
    headerProps,
    checkbookRaw,
    columns,
  }
}

export default useCheckbookView
