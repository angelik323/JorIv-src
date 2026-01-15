import { ref, computed, type Ref } from 'vue'
import { QTable } from 'quasar'
import {
  ILetterFormatVariable,
  UseListLetterFormatModalOptions,
  ILetterFormatTablePayload,
  VariablesResource,
  FlatVariables,
  WrappedVariablesResource,
  SectionKey,
  BackendSectionKey,
  ModalType,
  VarOption,
  ILetterFormatModalRow,
} from '@/interfaces/customs'
import { useTreasuryResourceStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { useAlert } from '@/composables'
import { TIMEOUT_ALERT } from '@/constants/alerts'

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

const backendToUi: Record<BackendSectionKey, SectionKey> = {
  general: 'generales',
  source_payer: 'fuente_pagadora',
  destination: 'destino',
}

const sectionTitles: Record<SectionKey, string> = {
  generales: 'Sección variables generales',
  fuente_pagadora: 'Sección variables fuente pagadora',
  destino: 'Sección variables para el destino',
}

const GENERAL_ALLOWLIST: ReadonlySet<string> = new Set([
  'current_date',
  'total_value',
  'total_value_letters',
  'business',
  'business_name',
  'authorized_signature',
])

const MAX_TABLE_COLS = 8

const useListLetterFormatModal = ({
  onAddVariable,
  onAddTable,
  emit,
}: UseListLetterFormatModalOptions) => {
  const variableFormRef = ref<{
    formElementRef: { validate: () => Promise<boolean> }
  } | null>(null)
  const tableFormRef = ref<{
    formElementRef: { validate: () => Promise<boolean> }
  } | null>(null)

  const currentSection = ref<SectionKey>('generales')

  const resourceStore = useTreasuryResourceStore('v1')
  const { letter_format_variables } = storeToRefs(resourceStore) as {
    letter_format_variables: Ref<
      VariablesResource | FlatVariables | WrappedVariablesResource | null
    >
  }

  const { showAlert } = useAlert()

  const variableFormDataGeneral = ref<ILetterFormatVariable>({
    key: '',
    description: '',
    section: 'generales',
  })
  const variableFormDataSourcePayer = ref<ILetterFormatVariable>({
    key: '',
    description: '',
    section: 'fuente_pagadora',
  })
  const variableFormDataDestination = ref<ILetterFormatVariable>({
    key: '',
    description: '',
    section: 'destino',
  })

  const sourcePayerSingles = new Set(['bank_branch', 'branch_city', 'bank_nit'])
  const destinationSingles = new Set([
    'beneficiary_document_type',
    'beneficiary_name',
    'beneficiary_nit',
    'payment_concept',
    'payment_method',
    'transfer_branch',
    'value',
  ])

  const classify = (key: string): SectionKey => {
    if (
      key.startsWith('destination_') ||
      key.startsWith('beneficiary_') ||
      destinationSingles.has(key)
    ) {
      return 'destino'
    }
    if (key.startsWith('payer_') || sourcePayerSingles.has(key)) {
      return 'fuente_pagadora'
    }
    return 'generales'
  }

  const optionsBySection = computed<
    Record<SectionKey, Array<{ label: string; value: string }>>
  >(() => {
    const res: Record<SectionKey, Array<{ label: string; value: string }>> = {
      generales: [],
      fuente_pagadora: [],
      destino: [],
    }

    const raw = letter_format_variables.value
    const unpacked = isWrapped(raw) ? raw.letter_format_variables : raw ?? null

    if (isFlatArray(unpacked)) {
      unpacked.forEach(({ key, label }) => {
        const sec = classify(key)
        if (sec === 'generales' && !GENERAL_ALLOWLIST.has(key)) return
        res[sec].push({ value: key, label })
      })
      return res
    }
    if (unpacked) {
      ;(
        ['general', 'source_payer', 'destination'] as BackendSectionKey[]
      ).forEach((bk) => {
        const uiKey = backendToUi[bk]
        const sectionObj = (unpacked as VariablesResource)[bk] ?? {}
        const entries = Object.entries(sectionObj)

        const filtered =
          uiKey === 'generales'
            ? entries.filter(([code]) => GENERAL_ALLOWLIST.has(code))
            : entries

        res[uiKey] = filtered.map(([code, label]) => ({ label, value: code }))
      })
    }

    return res
  })

  const pickFromList = (section: SectionKey, value: string) => {
    const opt = optionsBySection.value[section].find((o) => o.value === value)
    if (!opt) return

    onAddVariable?.({ code: value, name: opt.label, type: 'Variable', section })

    if (section === 'generales') {
      variableFormDataGeneral.value.key = ''
      variableFormDataGeneral.value.description = ''
    } else if (section === 'fuente_pagadora') {
      variableFormDataSourcePayer.value.key = ''
      variableFormDataSourcePayer.value.description = ''
    } else {
      variableFormDataDestination.value.key = ''
      variableFormDataDestination.value.description = ''
    }

    emit('update:openVariableModal', false)
  }

  let autoInc = 1
  const tableProps = ref<{
    loading: boolean
    columns: QTable['columns']
    rows: ILetterFormatModalRow[]
    pages: { currentPage: number; lastPage: number }
  }>({
    loading: false,
    columns: [
      { name: 'id', label: '#', field: 'id', align: 'left' },
      { name: 'variable', label: 'Variable', field: 'variable', align: 'left' },
      { name: 'alias', label: 'Alias', field: 'alias', align: 'left' },
      { name: 'actions', label: 'Acciones', field: 'actions', align: 'left' },
    ],
    rows: [],
    pages: { currentPage: 1, lastPage: 1 },
  })

  const allVariableOptions = computed<VarOption[]>(() => {
    const raw = letter_format_variables.value
    const unpacked = isWrapped(raw) ? raw.letter_format_variables : raw ?? null

    const seen = new Set<string>()
    const out: VarOption[] = []

    if (isFlatArray(unpacked)) {
      unpacked.forEach(({ key, label }) => {
        if (seen.has(key)) return
        seen.add(key)
        out.push({ value: key, label })
      })
      return out
    }

    if (unpacked) {
      ;(
        ['general', 'source_payer', 'destination'] as BackendSectionKey[]
      ).forEach((bk) => {
        const obj = (unpacked as VariablesResource)[bk] ?? {}
        Object.entries(obj).forEach(([code, label]) => {
          if (seen.has(code)) return
          seen.add(code)
          out.push({ value: code, label })
        })
      })
    }
    return out
  })

  const variableLabelMap = computed<Record<string, string>>(() => {
    const map: Record<string, string> = {}
    allVariableOptions.value.forEach(({ value, label }) => {
      map[value] = label
    })
    return map
  })

  const beautify = (code: string): string =>
    code
      .replace(/_/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\b\w/g, (c) => c.toUpperCase())

  const getVariableLabel = (code: string): string => {
    return variableLabelMap.value[code] ?? beautify(code)
  }

  const variableToSection = computed<Record<string, SectionKey>>(() => {
    const raw = letter_format_variables.value
    const unpacked = isWrapped(raw) ? raw.letter_format_variables : raw ?? null

    const map: Record<string, SectionKey> = {}

    if (isFlatArray(unpacked)) {
      unpacked.forEach(({ key }) => {
        map[key] = classify(key)
      })
      return map
    }

    if (unpacked) {
      ;(
        ['general', 'source_payer', 'destination'] as BackendSectionKey[]
      ).forEach((bk) => {
        const ui = backendToUi[bk]
        const obj = (unpacked as VariablesResource)[bk] ?? {}
        Object.keys(obj).forEach((code) => {
          map[code] = ui
        })
      })
    }
    return map
  })

  const selectedVariables = ref<string[]>([])

  const handleSelectVariables = (val: string | string[] | null) => {
    const incoming = Array.isArray(val) ? val : val ? [val] : []

    const merged = new Set(selectedVariables.value)
    incoming.forEach((v) => merged.add(v))

    if (merged.size > MAX_TABLE_COLS) {
      const room = Math.max(0, MAX_TABLE_COLS - selectedVariables.value.length)
      const extras = incoming
        .filter((v) => !selectedVariables.value.includes(v))
        .slice(0, room)

      selectedVariables.value = [...selectedVariables.value, ...extras]

      showAlert(
        `Máximo ${MAX_TABLE_COLS} columnas.`,
        'warning',
        undefined,
        TIMEOUT_ALERT
      )
    } else {
      selectedVariables.value = Array.from(merged)
    }

    const existing = new Set(tableProps.value.rows.map((r) => r.variable))

    selectedVariables.value.forEach((v) => {
      if (existing.has(v)) return
      const sec = variableToSection.value[v]
      if (!sec) return
      tableProps.value.rows.push({
        id: autoInc++,
        variable: v,
        alias: '',
        section: sec,
      })
    })

    tableProps.value.rows = tableProps.value.rows.filter((r) =>
      selectedVariables.value.includes(r.variable)
    )
  }

  const handleLoadPreset = (
    items: Array<{ variable: string; alias?: string }>
  ) => {
    const uniques: string[] = []
    const seen = new Set<string>()
    items.forEach(({ variable }) => {
      if (!seen.has(variable)) {
        seen.add(variable)
        uniques.push(variable)
      }
    })

    if (uniques.length > MAX_TABLE_COLS) {
      showAlert(
        `Máximo ${MAX_TABLE_COLS} columnas.`,
        'warning',
        undefined,
        TIMEOUT_ALERT
      )
    }

    const limited = uniques.slice(0, MAX_TABLE_COLS)

    selectedVariables.value = limited
    tableProps.value.rows = limited.map((variable, idx) => {
      const found = items.find((it) => it.variable === variable)
      const sec = variableToSection.value[variable] || 'generales'
      return {
        id: idx + 1,
        variable,
        alias: found?.alias ?? '',
        section: sec,
      }
    })
    autoInc = tableProps.value.rows.length + 1
  }

  const handleRemoveRow = (id: number) => {
    const row = tableProps.value.rows.find((r) => r.id === id)
    tableProps.value.rows = tableProps.value.rows.filter((r) => r.id !== id)
    if (row) {
      selectedVariables.value = selectedVariables.value.filter(
        (v) => v !== row.variable
      )
    }
  }

  const isValid = computed(() => true)

  const handleAddTable = async () => {
    const isOk = await tableFormRef.value?.formElementRef?.validate?.()
    if (isOk === false) return

    const items = tableProps.value.rows.map((r) => ({
      variable: r.variable,
      alias: r.alias?.trim() || getVariableLabel(r.variable),
    }))

    onAddTable?.({ section: 'generales', items } as ILetterFormatTablePayload)

    emit('update:openTableModal', false)
    tableProps.value.rows = []
    selectedVariables.value = []
    autoInc = 1
  }

  const handleCancel = (type: ModalType) => {
    if (type === 'variable') emit('update:openVariableModal', false)
    else emit('update:openTableModal', false)
  }

  return {
    variableFormRef,
    tableFormRef,
    optionsBySection,
    sectionTitles,
    currentSection,
    allVariableOptions,
    selectedVariables,
    variableFormDataGeneral,
    variableFormDataSourcePayer,
    variableFormDataDestination,
    tableProps,
    isValid,
    getVariableLabel,
    pickFromList,
    handleSelectVariables,
    handleRemoveRow,
    handleAddTable,
    handleLoadPreset,
    handleCancel,
  }
}

export default useListLetterFormatModal
