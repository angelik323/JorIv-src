import { onMounted, ref, watch, computed, onBeforeMount } from 'vue'
import { storeToRefs } from 'pinia'
import moment from 'moment'

import {
  IBankResponseFilterForm,
  IBankResponseFilterEmits,
} from '@/interfaces/customs/treasury/BankResponse'

import { useUtils, useRules } from '@/composables'

import {
  useBankResponseStore,
  useTreasuryResourceStore,
  useResourceManagerStore,
} from '@/stores'

const useBankResponseFilterForm = (
  props: {
    processType: string
  },
  emits: IBankResponseFilterEmits
) => {
  const { isEmptyOrZero, defaultIconsLucide, isDateAllowed } = useUtils()

  const {
    banks_label_code,
    response_bank_file_types,
    response_bank_formats,
    response_bank_dispersion_groups,
  } = storeToRefs(useTreasuryResourceStore('v1'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { _validateBankResponseUploadFile, _setBankResponseFilterForm } =
    useBankResponseStore('v1')
  const { bank_response_document } = storeToRefs(useBankResponseStore('v1'))

  const keyFormats = {
    treasury: ['response_bank_formats'],
  }

  const keyDispersionGroups = {
    treasury: ['response_bank_dispersion_groups'],
  }

  const filterFormElementRef = ref()
  const uploadFileListRef = ref()
  const successValidate = ref(false)
  const holidays = ref<string[]>([])

  const models = ref<IBankResponseFilterForm>({
    bank_id: null,
    bank_name: '',
    file_type: null,
    bank_structure_id: null,
    description_format: '',
    dispersal_date: '',
    dispersion_group_id: null,
  })

  const selectedProcessType = computed({
    get: () => props.processType,
    set: (value) => {
      emits('update:processType', value)
      models.value.file_type = value
      if (value === 'Manual' || value === null) {
        models.value.bank_structure_id = null
        models.value.description_format = ''
      }
    },
  })

  const handlerHolidays = async ({ year }: { year: number }) => {
    holidays.value = await useUtils().getHolidaysByYear(year)
  }

  const handleSelectedBank = async (value: number) => {
    if (!value) {
      models.value.bank_id = null
      models.value.bank_name = ''
      models.value.bank_structure_id = null
      models.value.description_format = ''
      return
    }
    models.value.bank_id = value
    models.value.bank_structure_id = null

    const bankSelected = banks_label_code.value.find(
      (bank) => bank.id === value
    )
    models.value.bank_name = bankSelected?.description || ''

    await _getResources(
      keyFormats,
      `filter[bank_id]=${value}&filter[format_type]=Entrada`,
      'v2'
    )
    fetchUpdatedBankDispersionGroups()
  }

  const handleSelectedFormat = async (value: number) => {
    if (!value) {
      models.value.bank_structure_id = null
      models.value.description_format = ''
      return
    }
    models.value.bank_structure_id = value
    const formatSelected = response_bank_formats.value.find(
      (format) => format.id === value
    )
    models.value.description_format = formatSelected?.description || ''
  }

  const handleSelectedDispersionDate = async (value: string) => {
    if (!value) {
      models.value.dispersal_date = null
      models.value.dispersion_group_id = null
      return
    }
    models.value.dispersal_date = value
    models.value.dispersion_group_id = null

    fetchUpdatedBankDispersionGroups()
  }

  const fetchUpdatedBankDispersionGroups = async () => {
    if (models.value.dispersal_date && models.value.bank_id) {
      await _getResources(
        keyDispersionGroups,
        `filter[dispersal_date]=${models.value.dispersal_date}&filter[bank_id]=${models.value.bank_id}`,
        'v2'
      )
      models.value.dispersion_group_id = null
    }
  }

  const makeDataRequestValidateUploadFile = (): FormData => {
    const formFilter = models.value as IBankResponseFilterForm
    const formData = new FormData()

    const formattedDate = formFilter?.dispersal_date
      ? moment(formFilter.dispersal_date).format('YYYY-MM-DD')
      : null

    formFilter?.bank_id &&
      formData.append('bank_id', String(formFilter?.bank_id))

    formFilter?.file_type &&
      formData.append('file_type', String(formFilter?.file_type))

    formFilter?.bank_structure_id &&
      formData.append(
        'bank_structure_id',
        String(formFilter?.bank_structure_id)
      )

    formattedDate && formData.append('dispersal_date', formattedDate)

    formFilter?.dispersion_group_id &&
      formData.append(
        'dispersion_group_id',
        String(formFilter?.dispersion_group_id)
      )

    bank_response_document.value?.file &&
      formData.append('file', bank_response_document.value.file)

    return formData
  }

  const validateForm = async () => {
    return (await filterFormElementRef.value?.validate()) ?? false
  }

  const handleValidateBankResponseUploadFile = async () => {
    if (!(await validateForm())) {
      return
    }

    const formData = makeDataRequestValidateUploadFile()
    successValidate.value = await _validateBankResponseUploadFile(formData)

    uploadFileListRef.value?.updatedBankResponseUploadFileProcess(
      successValidate.value
    )
  }

  const handleClear = () => {
    models.value = {
      bank_id: null,
      bank_name: '',
      file_type: null,
      bank_structure_id: null,
      description_format: '',
      dispersal_date: '',
      dispersion_group_id: null,
    }
    filterFormElementRef.value?.resetValidation()
  }

  const handleSearch = async () => {
    if (!(await validateForm())) {
      return
    }

    emits('search')
  }

  onMounted(async () => {
    await _resetKeys(keyFormats)
    await _resetKeys(keyDispersionGroups)
  })

  onBeforeMount(async () => {
    handlerHolidays({ year: new Date().getFullYear() })
  })

  watch(
    () => models.value,
    () => {
      if (isEmptyOrZero(models.value)) {
        _setBankResponseFilterForm(null)
      } else {
        _setBankResponseFilterForm({ ...models.value })
      }
    },
    { deep: true }
  )

  return {
    defaultIconsLucide,
    models,
    filterFormElementRef,
    uploadFileListRef,
    successValidate,
    selectedProcessType,
    banks_label_code,
    response_bank_file_types,
    response_bank_formats,
    response_bank_dispersion_groups,
    bank_response_document,
    holidays,

    handleSelectedBank,
    handleSelectedFormat,
    handleSelectedDispersionDate,
    handleValidateBankResponseUploadFile,
    handleClear,
    handleSearch,
    useRules,
    isDateAllowed,
    handlerHolidays,
  }
}

export default useBankResponseFilterForm
