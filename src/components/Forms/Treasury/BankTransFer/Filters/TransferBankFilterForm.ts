// vue
import { computed, ref, watch } from 'vue'
// copmposables
import { useGoToUrl } from '@/composables'

// utils
import { defaultIconsLucide, hollyDays } from '@/utils'

// interfaces
import { ITabs } from '@/interfaces/global'
import { useBankTransferStore, useFicResourceStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { IFormOfficesFilter, ISelectorResources } from '@/interfaces/customs'

const useTransferBankFilterForm = () => {
  const { offices } = storeToRefs(useFicResourceStore('v1'))

  const { _updateFilterForm } = useBankTransferStore('v1')
  const { goToURL } = useGoToUrl()

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const formOfficesFilter = ref<IFormOfficesFilter>({
    date: null,
    fiduciaryOffice: null,
    fiduciaryOfficeName: null,
    instructionsView: null,
  })

  const getOfficesficsOptions = computed<ISelectorResources[]>(
    () => offices.value ?? []
  )

  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))

  const tabActive = ref(filteredTabs.value[0].name)

  const tabActiveIdx = ref(
    filteredTabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const optionsMaxCalendar = (date: string | null) => {
    if (!date) return false

    const today = new Date()
    const current = new Date(date)

    const isPastOrToday = current <= today

    const day = current.getDay()
    const isWeekday = day !== 0 && day !== 6

    const colombiaHolidays2025 = hollyDays

    const dateISO = current.toISOString().split('T')[0]
    const isHoliday = colombiaHolidays2025.includes(dateISO)

    return isPastOrToday && isWeekday && !isHoliday
  }
  const searchFilterBusinesName = (
    options: ISelectorResources[],
    id: number | null
  ): string => {
    const result = id
      ? options.find((item) => item.value === id)?.label ?? 'Sin definir'
      : 'Sin definir'
    return String(result)
  }

  const handlerNextOriginInfo = async (
    info: IFormOfficesFilter,
    goURL: string
  ) => {
    await _updateFilterForm(
      info,
      searchFilterBusinesName(
        getOfficesficsOptions.value,
        formOfficesFilter.value.fiduciaryOffice
      )
    )
    goToURL(goURL)
  }

  watch(
    () => formOfficesFilter.value.fiduciaryOffice,
    () => {
      const currentOfficeName = getOfficesficsOptions.value.find(
        (item) => item.value === formOfficesFilter.value.fiduciaryOffice
      )?.office_description
      formOfficesFilter.value.fiduciaryOfficeName = currentOfficeName ?? null
    }
  )

  return {
    tabActive,
    filteredTabs,
    tabActiveIdx,
    getOfficesficsOptions,
    formOfficesFilter,
    optionsMaxCalendar,
    handlerNextOriginInfo,
  }
}

export default useTransferBankFilterForm
