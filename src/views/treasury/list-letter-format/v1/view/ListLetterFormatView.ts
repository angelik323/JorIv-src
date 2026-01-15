import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ITabs } from '@/interfaces/global'
import { defaultIconsLucide } from '@/utils'
import { useLetterFormatStore } from '@/stores'
import {
  ILetterFormatResponse,
  ILetterFormatViewModel,
  ILetterFormat,
  ITablesSnapshot,
  ITableItem,
  TableRow,
} from '@/interfaces/customs'
import { QTable } from 'quasar'
import { useUtils } from '@/composables'

const useLetterFormatView = () => {
  const route = useRoute()
  const letterFormatId = Number(route.params.id)

  const { _getLetterFormat } = useLetterFormatStore('v1')
  const letterFormatRaw = ref<ILetterFormatResponse | null>(null)

  const tableView = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rows: TableRow[]
  }>({
    title: 'Tabla del formato',
    loading: false,
    columns: [],
    rows: [],
  })

  const isTablesSnapshot = (v: unknown): v is ITablesSnapshot => {
    if (!v || typeof v !== 'object') return false
    const obj = v as ITablesSnapshot
    return Array.isArray(obj.items) && Array.isArray(obj.rows)
  }

  const decodeHtml = (html: string): string => {
    const div = document.createElement('div')
    div.innerHTML = html
    return div.textContent?.trim() || ''
  }

  const looksLikeJson = (text: string): boolean => {
    const t = text.trim()
    return (
      (t.startsWith('{') && t.endsWith('}')) ||
      (t.startsWith('[') && t.endsWith(']'))
    )
  }

  const isStrictJson = (text: string): boolean => {
    const t = text
      .replace(/\\["\\\/bfnrtu]/g, '@')
      .replace(
        /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
        ']'
      )
      .replace(/(?:^|:|,)(?:\s*\[)+/g, '')
      .trim()
    return /^[\],:{}\s]*$/.test(t)
  }

  const parseTablesSnapshot = (clean: string): ITablesSnapshot | null => {
    if (!looksLikeJson(clean)) return null
    if (!isStrictJson(clean)) return null
    const parsed = JSON.parse(clean) as unknown
    return isTablesSnapshot(parsed) ? (parsed as ITablesSnapshot) : null
  }

  const hydrateReadOnlyTable = () => {
    const rawHtml = (letterFormatRaw.value as ILetterFormat)?.table
    if (!rawHtml) return

    const clean = decodeHtml(rawHtml)
    const parsed = parseTablesSnapshot(clean)
    if (!parsed) return

    const items: ITableItem[] = parsed.items
    const rows: TableRow[] = parsed.rows

    const dynamicCols: QTable['columns'] = items
      .filter(
        (it) =>
          it.variable?.toLowerCase() !== 'acciones' &&
          it.alias?.toLowerCase() !== 'acciones'
      )
      .map((it) => ({
        name: it.variable,
        label: it.alias || it.variable,
        align: 'center',
        field: it.variable,
        sortable: true,
      }))

    tableView.value.columns = dynamicCols
    tableView.value.rows = rows

    const lf = letterFormatRaw.value as ILetterFormat
    lf.table_columns = dynamicCols.map(({ name, label, field }) => ({
      name,
      label,
      field: typeof field === 'string' ? field : name,
    }))
    lf.table_rows = rows
  }

  const letterFormat = computed<
    ILetterFormatViewModel &
      Pick<ILetterFormat, 'bank_id' | 'format_definition'>
  >(() => {
    if (!letterFormatRaw.value) {
      return {
        id: 0,
        name: '',
        format_code: '',
        format_name: '',
        bank_id: 0,
        format_definition: '',
        bank_code: '',
        bank_name: '',
        format: '',
        status: { id: 0, status: '' },
        created_at: '',
        updated_at: '',
        creator_data: '',
        update_data: '',
        variables: [],
        tables: [],
      }
    }

    const item = letterFormatRaw.value
    const rawStatus =
      typeof item.status === 'object' && item.status !== null
        ? item.status.status
        : item.status ?? ''
    const normalized =
      typeof rawStatus === 'string'
        ? rawStatus.trim().toUpperCase()
        : rawStatus === 1 || rawStatus === true
        ? 'ACTIVO'
        : 'INACTIVO'

    const mapped = {
      id: item.id ?? 0,
      name: item.name ?? item.format_name ?? '',
      format_code: item.code ?? item.format_code ?? '',
      format_name: item.name ?? item.format_name ?? '',
      bank_id: Number(item.bank?.id ?? item.bank_id ?? 0),
      bank_code: item.bank?.bank_code ?? item.bank_code ?? '',
      bank_name: item.bank?.description ?? item.bank_name ?? '',
      format: item.format_definition ?? item.definition ?? '',
      format_definition:
        useUtils().htmlToPlain(item.format_definition ?? '') ?? '',
      format_definition_bottom:
        useUtils().htmlToPlain(item.format_definition_bottom ?? '') ?? '',
      status: {
        id: normalized === 'ACTIVO' ? 1 : 0,
        status: normalized,
      },
      created_at: item.created_at ?? item.history?.created_at ?? '',
      updated_at: item.updated_at ?? item.history?.updated_at ?? '',
      creator_data: item.history?.creator_data ?? '',
      update_data: item.history?.update_data ?? '',
      variables: item.variables ?? [],
      tables: item.tables ?? [],
      table: item.table ?? '',
    }

    return mapped
  })

  const headerProps = {
    title: 'Ver formato de carta',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Tesorería', route: '' },
      { label: 'Formatos de carta', route: '' },
      { label: 'Ver', route: '' },
      {
        label: `${letterFormatId}`,
        route: 'LetterFormatView',
        params: { id: letterFormatId },
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'basic_data',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])
  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))
  const tabActive = ref(filteredTabs.value[0].name)
  const tabActiveIdx = ref(
    filteredTabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  onMounted(async () => {
    const response = await _getLetterFormat(letterFormatId)
    letterFormatRaw.value = response ?? null
    hydrateReadOnlyTable()
  })

  return {
    headerProps,
    filteredTabs,
    tabActive,
    tabActiveIdx,
    letterFormat,
    tableView,
  }
}

export default useLetterFormatView
