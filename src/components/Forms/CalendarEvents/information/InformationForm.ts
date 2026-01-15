// Vue - Pinia
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Utils
import { chipsData, getRepeatLabelFromValue } from '@/utils'

// Interfaces
import { IChipsConfig } from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'
import {
  IFormInformation,
  IFormNotification,
  ICalendarEventView,
} from '@/interfaces/customs/agenda/CalendarEvents'

// Composables
import { useGoToUrl, useUtils, useRules } from '@/composables'

// Stores
import { useResourceStore } from '@/stores/resources-selects'

export const useInformationForm = (props: {
  action: ActionType
  data?: ICalendarEventView
}) => {
  const { isDateAllowed, getHolidaysByYear } = useUtils()
  const { goToURL } = useGoToUrl()

  const { repeat_options } = storeToRefs(useResourceStore('v1'))

  const holidays = ref<string[]>([])
  const informationFormRef = ref()
  const endTimeRef = ref()

  const chipsConfig: IChipsConfig<ICalendarEventView['notifications']>[] = [
    { key: 'users', label: 'Usuarios' },
    { key: 'roles', label: 'Roles' },
    { key: 'business', label: 'Negocios' },
    { key: 'emails', label: 'Correos', emailMode: true },
  ]

  const formData = ref<IFormInformation>({
    title: '',
    description: '',
    start_date: '',
    start_time: '',
    end_date: '',
    end_time: '',
    repeat: '',
    required_confirm: false,
  })

  const viewData = ref<
    ICalendarEventView & {
      start_time?: string
      end_time?: string
    }
  >({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    repeat: '',
    required_confirm: false,
    notifications: {
      users: [],
      roles: [],
      business: [],
      emails: [],
    },
    confirmations: {
      users: [],
      roles: [],
      business: [],
      emails: [],
    },
  })

  const handlerHolidays = (year: number) => {
    holidays.value = getHolidaysByYear(year)
  }

  const hasChipsData = (source: keyof ICalendarEventView) =>
    computed(() => {
      const section = viewData.value[source] as IFormNotification
      return (
        !!section?.users?.length ||
        !!section?.roles?.length ||
        !!section?.business?.length ||
        !!section?.emails?.length
      )
    })

  const loadData = () => {
    if (props.action === 'create') {
      const now = new Date()

      const formatDate = (date: Date) => date.toISOString().slice(0, 10)
      const formatTime = (date: Date) => date.toTimeString().slice(0, 5)

      const startDate = formatDate(now)
      const startTime = formatTime(now)

      const endTimeDate = new Date(now.getTime() + 15 * 60000)
      const endTime = formatTime(endTimeDate)

      formData.value = {
        ...formData.value,
        start_date: startDate,
        end_date: startDate,
        start_time: startTime,
        end_time: endTime,
      }
    }
    if (props.action !== 'create' && props.data) {
      const [startDate, startTime] = props.data.start_date.split(' ')
      const [endDate, endTime] = props.data.end_date.split(' ')

      viewData.value = {
        ...props.data,
        repeat: getRepeatLabelFromValue(props.data.repeat),
        start_date: startDate,
        end_date: endDate,
        start_time: startTime?.slice(0, 5) ?? '',
        end_time: endTime?.slice(0, 5) ?? '',
      }

      formData.value = {
        ...props.data,
        start_date: startDate,
        end_date: endDate,
        start_time: startTime?.slice(0, 5) ?? '',
        end_time: endTime?.slice(0, 5) ?? '',
      }
    }
  }

  const handleGoToList = () => goToURL('CalendarEventList')

  const chipsDataViewer = computed(() =>
    props.action === 'view'
      ? chipsData(ref(viewData.value.notifications), chipsConfig)
      : []
  )

  const chipsDataViewerConfirmations = computed(() =>
    props.action === 'view' && viewData.value.confirmations
      ? chipsData(ref(viewData.value.confirmations), chipsConfig)
      : []
  )

  const repeatOptionsWithNone = computed(() => {
    if (!repeat_options.value?.length) return []

    return [{ label: 'No se repite', value: 'none' }, ...repeat_options.value]
  })

  const hasNotificationData = hasChipsData('notifications')
  const hasConfirmationData = hasChipsData('confirmations')

  const isView = computed(() => ['view'].includes(props.action))

  watch(
    () => formData.value.start_date,
    (newStartDate) => {
      if (!newStartDate) return

      const date = new Date(newStartDate)
      date.setDate(date.getDate() + 1)

      const formatted = date.toISOString().split('T')[0]
      formData.value.end_date = formatted
    }
  )

  watch(
    () => [formData.value.start_date, formData.value.end_date],
    () => {
      setTimeout(() => {
        endTimeRef.value?.validate?.()
      }, 100)
    }
  )

  const validateEndTime = (val: string) => {
    if (!val || !formData.value.start_time) return true
    if (formData.value.start_date === formData.value.end_date) {
      return useRules().end_time_after_start_time(
        val,
        formData.value.start_time
      )
    }
    return true
  }

  onMounted(() => loadData())

  return {
    isView,
    formData,
    viewData,
    holidays,
    endTimeRef,
    isDateAllowed,
    handleGoToList,
    chipsDataViewer,
    handlerHolidays,
    validateEndTime,
    informationFormRef,
    hasNotificationData,
    hasConfirmationData,
    chipsDataViewerConfirmations,
    repeat_options: repeatOptionsWithNone,
  }
}

export default useInformationForm
