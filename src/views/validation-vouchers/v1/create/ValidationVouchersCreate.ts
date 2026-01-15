import { useMainLoader } from '@/composables'
import {
  IVouncherValidationModel,
  IVoucherErrorItem,
} from '@/interfaces/customs'
import { storeToRefs } from 'pinia'
import { ITabs } from '@/interfaces/global'
import { useValidationVouchersStore } from '@/stores'
import { defaultIconsLucide } from '@/utils'
import { QTable } from 'quasar'
import { computed, ref, toRaw, watch } from 'vue'
import { useRouter } from 'vue-router'

const useValidationVouchersCreate = () => {
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const {
    _validateVouchers,
    _dowloadTrustBusinessList,
    __createValidationVouchers,
  } = useValidationVouchersStore('v1')
  const { validation_vouchers_list } = storeToRefs(
    useValidationVouchersStore('v1')
  )

  const validationVouchersForm = ref()

  const headerProps = {
    title: 'Crear validación de comprobantes',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Contabilidad',
        route: '',
      },
      {
        label: 'Validación de comprobantes',
        route: 'ValidationVoucherList',
      },
      {
        label: 'Crear',
        route: 'ValidationVouchersCreate',
      },
    ],
  }
  const handleGoTo = (goURL: string) => {
    router.push({ name: goURL })
  }
  const tablePropsErrors = ref({
    title: 'Validación de comprobantes',
    loading: false,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'Code',
        required: true,
        label: 'Código de negocio de la estructura fuente',
        align: 'left',
        field: (row: IVoucherErrorItem) => `${row.business_code}`,
        sortable: true,
      },
      {
        name: 'business_name',
        required: true,
        label: 'Nombre del negocio',
        align: 'left',
        field: (row: IVoucherErrorItem) => `${row.business_name}`,
        sortable: true,
      },
      {
        name: 'voucher_code',
        required: true,
        label: 'Número de comprobante',
        align: 'left',
        field: (row: IVoucherErrorItem) => `${row.voucher_code}`,
        sortable: true,
      },
      {
        name: 'voucher_type',
        required: true,
        label: 'Número de sub comprobante',
        align: 'left',
        field: (row: IVoucherErrorItem) => `${row.voucher_type}`,
        sortable: true,
      },
      {
        name: 'voucher_type',
        required: true,
        label: 'Número consecutivo',
        align: 'left',
        field: (row: IVoucherErrorItem) => `${row.voucher_type}`,
        sortable: true,
      },
      {
        name: 'errors',
        required: true,
        label: 'Razón del error',
        align: 'left',
        field: (row: IVoucherErrorItem) => `${row.errors[0]}`,
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as IVouncherValidationModel[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })
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
  const downloadAction = async () => {
    _dowloadTrustBusinessList({
      with_errors: 1,
      errors: toRaw(validation_vouchers_list.value),
    })
  }

  watch(
    () => validation_vouchers_list.value,
    () => {
      tablePropsErrors.value.rows = validation_vouchers_list.value
    }
  )

  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))
  const tabActive = ref(filteredTabs.value[0].name)

  const tabActiveIdx = ref(
    filteredTabs.value.findIndex((tab) => tab.name === tabActive.value)
  )
  const viewTable = ref(false)
  const validateButton = ref(true)
  const models = ref<IVouncherValidationModel>({
    period_date: '',
    structure: '',
    status: '',
  })

  const modelsCreate = ref<IVouncherValidationModel>({
    period_date: '',
    structure: '',
    status: '',
    vouchers_ids: [],
  })

  const alertModalRef = ref()

  const validateForms = async () => {
    return validationVouchersForm?.value?.validateForm()
  }

  const handleFormUpdate = () => {
    models.value = validationVouchersForm.value.getFormData()
    modelsCreate.value = validationVouchersForm.value.getFormData()

    onSubmit()
  }

  const onSubmit = async () => {
    if (await validateForms()) {
      const payload = JSON.parse(JSON.stringify(modelsCreate.value))
      payload.from_business_trust_id = String(
        payload.from_business_trust_id.business_code
      )
      payload.to_business_trust_id = String(
        payload.to_business_trust_id.business_code
      )
      payload.structure = String(payload.structure.code)
      openMainLoader(true)

      const result = await _validateVouchers(payload)
      setTimeout(() => {
        modelsCreate.value.vouchers_ids = result.data
        if (result.success) {
          models.value.status = 'Validado'
          viewTable.value = false
          validateButton.value = false
        } else if (!result.success && result.data.length === 0) {
          viewTable.value = false
          validateButton.value = true
        } else {
          models.value.status = 'Con errores'
          viewTable.value = true
          validateButton.value = true
        }

        openMainLoader(false)
      }, 1000)
    }
  }

  const createValidation = async () => {
    openMainLoader(true)
    const payload = JSON.parse(JSON.stringify(modelsCreate.value))
    payload.from_business_trust_id = String(payload.from_business_trust_id.id)
    payload.to_business_trust_id = String(payload.to_business_trust_id.id)
    payload.structure = String(modelsCreate.value.structure.code)
    if (await __createValidationVouchers(payload)) {
      router.push({ name: 'ValidationVoucherList' })
    }

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  const openStructuresModal = () => {
    alertModalRef.value.openModal()
  }

  return {
    headerProps,
    filteredTabs,
    tabActive,
    tabActiveIdx,
    tablePropsErrors,
    models,
    validateButton,
    viewTable,
    alertModalRef,
    validationVouchersForm,
    createValidation,
    onSubmit,
    handleGoTo,
    downloadAction,
    openStructuresModal,
    handleFormUpdate,
  }
}

export default useValidationVouchersCreate
