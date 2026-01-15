import { ref, computed, watch } from 'vue'
import { useRules } from '@/composables'
import {
  ILetterFormat,
  ILetterFormatTablePayload,
  TableRow,
  ITableItem,
  ITablesSnapshot,
  VariablesResource,
  FlatVariables,
  WrappedVariablesResource,
} from '@/interfaces/customs'
import { QTableProps } from 'quasar'
import { ITabs, ActionType } from '@/interfaces/global'
import { defaultIconsLucide } from '@/utils'
import { useTreasuryResourceStore } from '@/stores'
import { storeToRefs } from 'pinia'

const useLetterFormatForm = (props: {
  action: ActionType
  data?: ILetterFormat | null
}) => {
  const formRef = ref()
  const isViewMode = computed(() => props.action === 'view')
  const isEdit = computed(() => props.action === 'edit')

  const { banks, letter_format_statuses, letter_format_variables } =
    storeToRefs(useTreasuryResourceStore('v1'))

  const { is_required, only_number, max_length } = useRules()
  const baseTemplate = `Bogotá {Fecha del día}

Señores

{Banco pagador}

Nos permitimos solicitar el desembolso de los siguientes valores desde la {Cuenta pagadora}`

  const inputKey = ref(0)

  const models = ref<ILetterFormat>({
    name: '',
    format_code: '',
    bank_id: props.data?.bank_id,
    bank_code: '',
    bank_name: '',
    format: '',
    format_name: '',
    status: {
      id: 0,
      status: '',
    },
    format_definition: props.data?.format_definition || baseTemplate,
    format_definition_bottom:
      props.data?.format_definition_bottom || baseTemplate,
  })

  const tabs = ref<ITabs[]>([
    {
      name: 'basic_data',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: true,
    },
  ])
  const filteredTabs = computed(() => tabs.value.filter((t) => t.show))
  const tabActive = ref(filteredTabs.value[0]?.name ?? '')
  const tabActiveIdx = ref(
    filteredTabs.value.findIndex((t) => t.name === tabActive.value)
  )
  watch(tabActive, (val) => {
    tabActiveIdx.value = filteredTabs.value.findIndex((t) => t.name === val)
  })

  const codeRules = [
    (v: string) => is_required(v, 'El campo Código formato es requerido'),
    (v: string) => only_number(v),
    (v: string) => max_length(v, 3),
  ]
  const nameRules = [
    (v: string) => is_required(v, 'El campo Nombre formato es requerido'),
    (v: string) => max_length(v, 60),
  ]
  const bankRules = [
    (v: string) => is_required(v, 'El campo Banco es requerido'),
  ]
  const formatRules = [
    (v: string) =>
      is_required(v, 'El campo Definición del formato es requerido'),
    (v: string) => max_length(v, 1500),
  ]

  const validateForm = async () => {
    const result = await formRef.value?.validate?.()
    return !!result
  }

  const resetForm = () => {
    models.value = {
      name: '',
      format_code: '',
      bank_code: '',
      bank_name: '',
      format: '',
      format_name: '',
      status: {
        id: 0,
        status: '',
      },
      format_definition: baseTemplate,
    }
    inputKey.value++
  }

  const tableProps = ref<{
    title: string
    loading: boolean
    columns: QTableProps['columns']
    rows: Array<{ [x: string]: string | number; id: number }>
    pages: { currentPage: number; lastPage: number }
  }>({
    title: '',
    loading: false,
    columns: [
      {
        name: 'actions',
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ],
    rows: [],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })

  const currentTableItems = ref<ITableItem[]>([])

  const isWrapped = (
    v:
      | VariablesResource
      | FlatVariables
      | WrappedVariablesResource
      | null
      | undefined
  ): v is WrappedVariablesResource => {
    return !!v && typeof v === 'object' && 'letter_format_variables' in v
  }

  const isFlatArray = (v: unknown): v is FlatVariables => {
    return (
      Array.isArray(v) &&
      v.every(
        (it) => !!it && typeof it === 'object' && 'key' in it && 'label' in it
      )
    )
  }

  const variableLabelMap = computed<Record<string, string>>(() => {
    const raw = letter_format_variables.value as
      | VariablesResource
      | FlatVariables
      | WrappedVariablesResource
      | null

    const unpacked = isWrapped(raw) ? raw.letter_format_variables : raw ?? null
    const map: Record<string, string> = {}

    if (isFlatArray(unpacked)) {
      unpacked.forEach(({ key, label }) => {
        map[key] = label
      })
      return map
    }

    if (unpacked) {
      ;(
        ['general', 'source_payer', 'destination'] as Array<
          'general' | 'source_payer' | 'destination'
        >
      ).forEach((bk) => {
        const obj = (unpacked as VariablesResource)[bk] ?? {}
        Object.entries(obj).forEach(([code, label]) => {
          map[code] = label
        })
      })
    }
    return map
  })

  const beautify = (code: string): string =>
    code
      .replace(/_/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\b\w/g, (c) => c.toUpperCase())

  const labelFor = (code: string, alias?: string): string =>
    alias?.trim() || variableLabelMap.value[code] || beautify(code)

  const catalogPages = ref({ currentPage: 1, lastPage: 1 })
  const currentRowsPerPage = ref(20)

  const addCatalogRow = (row: {
    id: number
    bank: string
    business: string
    date: string
    payment_method: string
    value: string
  }) => {
    tableProps.value.rows.push(row)
  }

  const addCatalogRowVariable = (row: {
    code: string
    name: string
    type: string
  }) => {
    const token = `{${row.name}}`
    const current = models.value.format_definition || ''

    const textarea = document.querySelector(
      '.format-editor textarea'
    ) as HTMLTextAreaElement | null

    if (!textarea) {
      const needsSpaceLeft = current !== '' && !/\s|\n$/.test(current)
      models.value.format_definition = current
        ? `${current}${needsSpaceLeft ? ' ' : ''}${token}`
        : token
      return
    }

    const start = textarea.selectionStart ?? current.length
    const end = textarea.selectionEnd ?? start

    const before = current.slice(0, start)
    const after = current.slice(end)

    const leftChar = before.slice(-1)
    const rightChar = after.slice(0, 1)

    const needsSpaceLeft = !!leftChar && !/[\s\n([<{]/.test(leftChar)
    const needsSpaceRight = !!rightChar && !/[\s\n,.;:!?)}>\]]/.test(rightChar)

    const tokenWithPadding = `${needsSpaceLeft ? ' ' : ''}${token}${
      needsSpaceRight ? ' ' : ''
    }`

    models.value.format_definition = before + tokenWithPadding + after
  }
  const addCatalogRowVariableBottom = (row: {
    code: string
    name: string
    type: string
  }) => {
    const token = `{${row.name}}`
    const current = models.value.format_definition_bottom || ''

    const textarea = document.querySelector(
      '.format-editor-bottom textarea'
    ) as HTMLTextAreaElement | null

    if (!textarea) {
      models.value.format_definition_bottom = current
        ? `${current} ${token}`
        : token
      return
    }

    const start = textarea.selectionStart ?? current.length
    const end = textarea.selectionEnd ?? start

    const before = current.slice(0, start)
    const after = current.slice(end)

    models.value.format_definition_bottom = before + token + after
  }

  const onAddVariable = ref(addCatalogRowVariable)

  const addCatalogRowTable = (payload: ILetterFormatTablePayload) => {
    const dynamicCols = payload.items.map((it) => {
      const colName = it.variable
      const colLabel = labelFor(it.variable, it.alias)

      return {
        name: colName,
        label: colLabel,
        align: 'center' as const,
        field: (row: TableRow) => {
          const val = row[colName]
          const str = val == null ? '' : String(val)
          return str.trim() === '' ? '-' : str
        },
        sortable: true,
      }
    })

    const actionsCol = {
      name: 'actions',
      label: 'Acciones',
      align: 'center' as const,
      field: 'actions',
    }

    tableProps.value.columns = [...dynamicCols, actionsCol]
    tableProps.value.title = ''

    const blankRow: TableRow = { id: 1 }
    payload.items.forEach((it) => {
      blankRow[it.variable] = '-'
    })
    tableProps.value.rows = [blankRow]
    tableProps.value.pages.currentPage = 1

    currentTableItems.value = payload.items.map((it) => ({
      variable: it.variable,
      alias: it.alias ?? '',
    }))
  }

  const removeCatalogRow = (index: number) => {
    tableProps.value.rows.splice(index, 1)
  }

  const updatePage = (page: number) => {
    tableProps.value.pages.currentPage = page
  }

  const updatePerPage = (rowsPerPage: number) => {
    currentRowsPerPage.value = rowsPerPage
    tableProps.value.pages.currentPage = 1
  }

  const openVariableModal = ref(false)
  const openTableModal = ref(false)

  const handleOpenVariable = () => {
    onAddVariable.value = addCatalogRowVariable
    openVariableModal.value = true
  }

  const handleOpenVariableBottom = () => {
    onAddVariable.value = addCatalogRowVariableBottom
    openVariableModal.value = true
  }

  const handleOpenTable = () => {
    openTableModal.value = true
  }

  const editingCatalogRow = ref<TableRow | null>(null)

  const handleEditCatalogRow = (_index: number) => {
    editingCatalogRow.value = tableProps.value.rows[0] ?? null
    openTableModal.value = true
  }

  const looksLikeJson = (s: string) => /^\s*[{[]/.test(s)

  const htmlTableToSnapshot = (html: string): ITablesSnapshot | null => {
    const div = document.createElement('div')
    div.innerHTML = html

    const table = div.querySelector('table')
    if (!table) return null

    const ths = Array.from(table.querySelectorAll('thead th'))
    if (!ths.length) return null

    const toVar = (txt: string) =>
      txt.toLowerCase().trim().replace(/\s+/g, '_').replace(/[^\w]/g, '')

    const items = ths.map((th) => {
      const label = (th.textContent ?? '').trim()
      const variable = (th.getAttribute('id') ?? toVar(label)).trim()
      return { variable, alias: label }
    })

    const rowEl = table.querySelector('tbody tr')
    const tds = rowEl ? Array.from(rowEl.querySelectorAll('td')) : []
    const row: Record<string, string> = {}
    items.forEach((it, i) => {
      row[it.variable] = (tds[i]?.textContent ?? '-').trim() || '-'
    })

    return { items, rows: [{ id: 1, ...row }] }
  }

  const setFormData = () => {
    if (!props.data) return

    models.value = {
      ...models.value,
      ...props.data,
    }

    models.value.format_definition =
      props.data.format_definition || baseTemplate

    inputKey.value++

    const raw = props.data.table || props.data.table_html
    if (!raw || typeof raw !== 'string') return

    if (looksLikeJson(raw)) {
      const parsed = JSON.parse(raw) as ITablesSnapshot
      if (Array.isArray(parsed.items) && Array.isArray(parsed.rows)) {
        const payload: ILetterFormatTablePayload = {
          section: 'general',
          items: parsed.items,
        }
        addCatalogRowTable(payload)
        tableProps.value.rows = parsed.rows
        tableProps.value.pages.currentPage = 1
        currentTableItems.value = parsed.items
      }
    } else if (raw.includes('<table')) {
      const snap = htmlTableToSnapshot(raw)
      if (snap) {
        const payload: ILetterFormatTablePayload = {
          section: 'general',
          items: snap.items,
        }
        addCatalogRowTable(payload)
        tableProps.value.rows = snap.rows
        tableProps.value.pages.currentPage = 1
        currentTableItems.value = snap.items
      }
    }

    if (isViewMode.value && Array.isArray(tableProps.value.columns)) {
      tableProps.value.columns = tableProps.value.columns.filter(
        (col) => col.name !== 'actions'
      )
    }
  }

  watch(
    () => [props.action, props.data],
    () => {
      if (props.action === 'edit' || props.action === 'view') {
        setFormData()
      }
    },
    { immediate: true }
  )

  const escapeHtml = (s: unknown): string =>
    String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')

  const parseHtmlTableToData = (tableSnapshotJson: string): string => {
    const tableData = JSON.parse(tableSnapshotJson) as {
      items: Array<{ variable: string; alias?: string }>
      rows: Array<Record<string, string | number>>
    }

    const cols = tableData.items.map((it) => it.variable)

    const headerHtml = tableData.items
      .map(
        (it) =>
          `<th id="${escapeHtml(it.variable)}" align="left">${escapeHtml(
            it.alias || it.variable
          )}</th>`
      )
      .join('')

    const rowsHtml = tableData.rows
      .map(
        (row) =>
          `<tr>${cols
            .map((c) => `<td>${escapeHtml(row[c] ?? '-')}</td>`)
            .join('')}</tr>`
      )
      .join('')

    return `
<table border="1" cellpadding="6" cellspacing="0" width="100%">
  <thead><tr>${headerHtml}</tr></thead>
  <tbody>${rowsHtml}</tbody>
</table>`
  }

  const getFormData = () => {
    const snapshot: ITablesSnapshot = {
      items: currentTableItems.value.map((it) => ({
        variable: it.variable,
        alias: it.alias,
      })),
      rows: tableProps.value.rows,
    }

    const tableHtml = parseHtmlTableToData(JSON.stringify(snapshot))

    const convertTextToHtml = (text: string): string =>
      text
        .split('\n')
        .filter((line) => line.trim() !== '')
        .map((line) => `<p>${line.trim()}</p>`)
        .join('')

    return {
      ...models.value,

      table: tableHtml,
      table_html: tableHtml,

      format_definition_html: convertTextToHtml(
        models.value.format_definition ?? ''
      ),
      format_definition_bottom_html: convertTextToHtml(
        models.value.format_definition_bottom ?? ''
      ),
    }
  }

  return {
    formRef,
    models,
    inputKey,
    isEdit,
    isViewMode,
    codeRules,
    nameRules,
    bankRules,
    formatRules,
    tableProps,
    openVariableModal,
    openTableModal,
    tabActive,
    tabActiveIdx,
    filteredTabs,
    catalogPages,
    currentRowsPerPage,
    banks,
    letter_format_statuses,
    currentTableItems,
    onAddVariable,
    useLetterFormatForm,
    handleEditCatalogRow,
    validateForm,
    resetForm,
    addCatalogRowTable,
    addCatalogRowVariable,
    addCatalogRowVariableBottom,
    addCatalogRow,
    removeCatalogRow,
    updatePage,
    updatePerPage,
    handleOpenVariable,
    handleOpenVariableBottom,
    handleOpenTable,
    getFormData,
  }
}

export default useLetterFormatForm
