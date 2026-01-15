import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router'

import { useMainLoader, useUtils } from '@/composables'

import { IFieldConfig, ITreasureCancellations } from '@/interfaces/customs'
import { ITabs } from '@/interfaces/global'

import { useTreasuryCancellationsStore } from '@/stores'
import { treasury_cancellation_fields } from '@/constants'

const useTreasuryCancellationsView = () => {
  const { defaultIconsLucide, formatParamsCustom } = useUtils()
  const { openMainLoader } = useMainLoader()
  const route = useRoute()

  const { _showAction } = useTreasuryCancellationsStore('v1')

  const authorizationType = route.query.authorization_type as string | null
  const documentType = route.query.document_query as string | null
  const consecutive = route.query.consecutive as string | null
  const id = route.params.id as string

  const isLoaded = ref(false)

  const initialData = ref<ITreasureCancellations>({})

  let title: string

  if (documentType === 'Movimiento de tesorería') {
    title =
      authorizationType === 'income'
        ? 'Ver detalles de anulación de ingresos'
        : 'Ver detalles de anulación de egresos'
  } else if (documentType === 'Traslados')
    title = 'Ver detalles de anulación de traslado'
  else title = 'Ver detalles de anulación de cheque'

  const headerProperties = {
    title,
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Tesorería',
      },
      {
        label: 'Anulación de tesorería',
        route: 'TreasuryCancellationsList',
      },
      {
        label: 'Ver',
        route: 'TreasuryCancellationView',
      },
      {
        label: id,
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ])

  const getFieldValue = (
    obj: Record<string, unknown>,
    field: IFieldConfig
  ): string => {
    const { key, format } = field
    if (!key) return '-'

    const value = key.includes(' - ')
      ? key
          .split(' - ')
          .map((k) => getFieldValue(obj, { key: k.trim() }))
          .join(' - ')
      : ((key.split('.').reduce((o: unknown, k) => {
          if (o && typeof o === 'object' && k in o) {
            return (o as Record<string, unknown>)[k]
          }
          return undefined
        }, obj) ?? '-') as unknown)

    if (typeof format === 'function') {
      return format(value)
    }

    return typeof value === 'string' ? value : String(value ?? '-')
  }

  const loadData = async () => {
    openMainLoader(true)

    const params = formatParamsCustom({
      document_query: documentType,
      authorization_type: authorizationType,
      consecutive: consecutive,
    })

    const success = await _showAction(id, params)

    if (success) {
      const data = success
      initialData.value = data
      isLoaded.value = true
    }

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  const tabActive = ref(tabs.value[0].name)

  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const filteredSections = computed(() =>
    treasury_cancellation_fields.filter(
      (section) => section.showIfType === documentType
    )
  )

  const handleGoToList = () =>
    router.push({
      name: 'TreasuryCancellationsList',
      query: { reload: 'true' },
    })

  onMounted(() => loadData())

  return {
    tabs,
    isLoaded,
    tabActive,
    treasury_cancellation_fields,
    initialData,
    tabActiveIdx,
    getFieldValue,
    handleGoToList,
    headerProperties,
    filteredSections,
  }
}

export default useTreasuryCancellationsView
