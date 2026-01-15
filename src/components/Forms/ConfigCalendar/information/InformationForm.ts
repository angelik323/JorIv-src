// Vue
import { onMounted, ref, watch } from 'vue'

// Interfaces
import { IConfigCalendarRequest } from '@/interfaces/customs/agenda/ConfigCalendar'
import { ActionType } from '@/interfaces/global'

// Composables
import { useUtils } from '@/composables'

// Stores
import { useConfigCalendarStore } from '@/stores/agenda/config-calendar'

const useInformationForm = (props: {
  action: ActionType
  data?: IConfigCalendarRequest | null
  disabledDates?: string[]
}) => {
  const { isDateAllowed, getHolidaysByYear } = useUtils()

  const { _setCalendarDataForm } = useConfigCalendarStore('v1')

  const disabledDates = ref<string[]>([])
  const holidays = ref<string[]>([])
  const informationFormRef = ref()

  const models = ref<{
    id: number | null
    marked_day: string | null
    marking_reason: string | null
  }>({
    id: null,
    marked_day: '',
    marking_reason: '',
  })

  const handlerHolidays = (year: number) => {
    holidays.value = getHolidaysByYear(year)
  }

  const handlerActionForm = (action: ActionType) => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setValueModel,
      edit: setFormEdit,
      view: _setValueModel,
    }

    actionHandlers[action]?.()
  }

  const setFormEdit = () => {
    const data = props.data
    if (data) {
      const [year, month, day] = data.marked_day.split(/\D/)
      models.value.id = data.id ?? null
      models.value.marked_day = `${year}-${month}-${day}`
      models.value.marking_reason = data.marking_reason
    }
  }

  const _setValueModel = () => {
    clearForm()

    const data = props.data
    if (data) {
      models.value.marked_day = data?.marked_day
      models.value.marking_reason = data?.marking_reason
    }
  }

  const clearForm = () => {
    models.value.marked_day = ''
    models.value.marking_reason = ''
  }

  watch(
    () => models.value,
    () =>
      _setCalendarDataForm({
        id: models.value?.id ?? undefined,
        marked_day: models.value?.marked_day ?? '',
        marking_reason: models.value?.marking_reason ?? '',
      }),
    { deep: true }
  )

  watch(
    () => props.data,
    (val) => {
      if (val) {
        handlerActionForm(props.action)
      }
    }
  )

  watch(
    () => props.disabledDates,
    () => {
      disabledDates.value = props.disabledDates ?? []
    }
  )

  onMounted(() => handlerActionForm(props.action))

  return {
    models,
    holidays,
    isDateAllowed,
    handlerHolidays,
    informationFormRef,
  }
}

export default useInformationForm
