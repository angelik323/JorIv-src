// Vue - Pinia - Quasar
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

// Interfaces
import { collective_investment_funds_options as select_options } from '@/constants/resources'
import { ActionType } from '@/interfaces/global'
import {
  IParticipationType,
  IBusinessLinesTable,
  IRawParticipationType,
  IBusinessParticipationType,
} from '@/interfaces/customs/fics/CollectiveInvestmentFunds'

// Composables
import { useAlert, useUtils } from '@/composables'

// Stores
import { useCollectiveInvestmentFundsStore } from '@/stores/fics/collective-investment-funds'
import { useFicResourceStore } from '@/stores/resources-manager/fics'

const useParticipationTypesForm = (props: {
  action: ActionType
  data?: IBusinessParticipationType[]
}) => {
  const {
    business_lines_active,
    fiduciary_commissions_fixed,
    pt_not_consolidated_without_fund,
  } = storeToRefs(useFicResourceStore('v1'))
  const { participation_types_term_days_active } = storeToRefs(
    useCollectiveInvestmentFundsStore('v1')
  )
  const { defaultIconsLucide, formatCurrencyString } = useUtils()
  const businessTypesMap = ref(new Map<number, IParticipationType[]>())
  const modalType = ref<'business' | 'types'>('business')
  const selectedRowIdBusiness = ref<number | null>(null)
  const editRowIndex = ref<number | null>(null)
  const participationTypesFormRef = ref()
  const { showAlert } = useAlert()
  const isEditing = ref(false)
  const modalFormRef = ref()
  const addModalRef = ref()

  const modalData = ref<IBusinessParticipationType>({
    business_line_id: null,
    participation_types: [
      {
        participation_type_id: null,
        minimun_balance: 0,
        maximun_balance: 0,
        term_days: 0,
        commission_id: null,
      },
    ],
  })

  const tablePropsBusiness = ref({
    title: 'Líneas de negocio',
    loading: false,
    columns: [
      {
        name: 'checkbox',
        required: true,
        label: '',
        align: 'center',
        field: 'checkbox',
      },
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'code',
        required: true,
        label: 'Código',
        align: 'left',
        field: 'code',
        sortable: true,
      },
      {
        name: 'description',
        required: true,
        label: 'Descripción',
        align: 'left',
        field: 'description',
        sortable: true,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ] as QTable['columns'],
    rows: [] as IBusinessLinesTable[],
  })

  const tablePropsTypes = ref({
    title: 'Tipos de participación',
    loading: false,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'code',
        required: true,
        label: 'Código',
        align: 'left',
        field: 'code',
        sortable: true,
      },
      {
        name: 'description',
        required: true,
        label: 'Descripción',
        align: 'left',
        field: 'description',
        sortable: true,
      },
      {
        name: 'minimun_balance',
        required: true,
        label: 'Saldo mínimo',
        align: 'left',
        field: (row) => formatCurrencyString(row.minimun_balance) || '-',
        sortable: true,
      },
      {
        name: 'maximun_balance',
        required: true,
        label: 'Saldo máximo',
        align: 'left',
        field: (row) => formatCurrencyString(row.maximun_balance) || '-',
        sortable: true,
      },
      {
        name: 'term_days',
        required: true,
        label: 'Días de plazo',
        align: 'left',
        field: 'term_days',
        sortable: true,
      },
      {
        name: 'commission_id',
        required: true,
        label: 'Comisión',
        align: 'left',
        field: 'commission_id',
        sortable: true,
      },
      ...(props.action !== 'view'
        ? [
            {
              name: 'actions',
              required: true,
              label: 'Acciones',
              align: 'center',
              field: 'actions',
            },
          ]
        : []),
    ] as QTable['columns'],
    rows: [] as IParticipationType[],
  })

  const getBusinessById = (id: number) =>
    business_lines_active.value.find((item) => item.id === id)

  const getParticipationTypeById = (id: number) =>
    pt_not_consolidated_without_fund.value.find((pt) => pt.id === id)

  const getCommissionRate = (id: number | string) =>
    parseFloat(
      fiduciary_commissions_fixed.value.find((c) => c.id === id)
        ?.fixed_rate_percentage ?? '0'
    )

  const showAlertFunction = (msg: string, type: string) =>
    showAlert(msg, type, undefined, 1000)

  const loadData = () => {
    if (!props.data) return

    const businessRows: IBusinessLinesTable[] = []
    let globalTypeId = 1

    props.data.forEach((item) => {
      const businessLineId = item.business_line?.id ?? 0
      businessRows.push({
        id: tablePropsBusiness.value.rows.length + 1,
        backend_id: item.id ?? null,
        business_line_id: businessLineId,
        code: item.business_line?.code ?? '',
        description: item.business_line?.description ?? '',
      })

      const typesForBusinessLine: IParticipationType[] = []
      item.participation_types?.forEach((pt: IRawParticipationType) => {
        const participationType: IParticipationType = {
          id: globalTypeId++,
          backend_id: pt.id ?? null,
          participation_type_id: pt.participation_type?.id ?? null,
          code: pt.participation_type?.code ?? '-',
          description: pt.participation_type?.description ?? '-',
          minimun_balance: pt.minimun_balance ?? 0,
          maximun_balance: pt.maximun_balance ?? 0,
          term_days: pt.term_days ?? 0,
          commission_id: pt.commission?.code ?? null,
          commission_value: getCommissionRate(pt.commission?.id!) ?? 0,
        }
        typesForBusinessLine.push(participationType)
      })

      businessTypesMap.value.set(businessLineId, typesForBusinessLine)
    })

    tablePropsBusiness.value.rows = businessRows
    tablePropsTypes.value.rows =
      businessRows.length > 0
        ? businessTypesMap.value.get(businessRows[0].business_line_id) || []
        : []

    if (businessRows.length > 0)
      selectedRowIdBusiness.value = businessRows[0].business_line_id
  }

  const fillModalDataFromRow = (row: IParticipationType) => {
    const commissionId =
      fiduciary_commissions_fixed.value.find(
        (c) => c.code === row.commission_id
      )?.id ?? row.commission_id

    modalData.value = {
      business_line_id: null,
      participation_types: [
        {
          id: row.backend_id,
          participation_type_id: row.participation_type_id,
          minimun_balance: row.minimun_balance,
          maximun_balance: row.maximun_balance,
          term_days: row.term_days,
          commission_id: commissionId,
        },
      ],
    }
  }

  const handleOpenModal = (
    type: 'business' | 'types',
    action: 'create' | 'edit' = 'create',
    id?: number
  ) => {
    modalType.value = type
    isEditing.value = action === 'edit'
    editRowIndex.value = id ?? null

    if (type === 'types' && action === 'edit' && id !== undefined) {
      const rowToEdit = tablePropsTypes.value.rows.find((r) => r.id === id)
      if (rowToEdit) {
        fillModalDataFromRow(rowToEdit)
        addModalRef.value?.openModal?.()
        return
      }
    }

    let minimun_ammount = 0
    const lastRow = tablePropsTypes.value.rows.at(-1)
    if (lastRow) minimun_ammount = Number(lastRow.maximun_balance) + 0.01

    modalData.value = {
      business_line_id: null,
      participation_types: [
        {
          id: null,
          participation_type_id: null,
          minimun_balance: minimun_ammount,
          maximun_balance: 0,
          term_days: 0,
          commission_id: null,
        },
      ],
    }

    addModalRef.value?.openModal?.()
  }

  const handleCloseModal = () => addModalRef.value?.closeModal?.()

  const createBusinessRow = () => {
    const id = modalData.value.business_line_id
    if (id == null) return null

    const business = getBusinessById(id)
    return {
      id: tablePropsBusiness.value.rows.length + 1,
      backend_id: null,
      business_line_id: id,
      code: business?.code ?? '-',
      description: business?.description ?? '-',
    }
  }

  const createTypeRow = () => {
    const typeData = modalData.value.participation_types[0]
    const typeInfo = getParticipationTypeById(typeData.participation_type_id!)
    const businessId = selectedRowIdBusiness.value
    if (!businessId) return null

    const existingRows = businessTypesMap.value.get(businessId) || []
    const maxId = Math.max(
      0,
      ...existingRows.map((r) => r.id).filter((id): id is number => id != null)
    )

    let existingRow = null
    if (isEditing.value && editRowIndex.value !== null) {
      existingRow = existingRows.find((r) => r.id === editRowIndex.value)
    }

    const commissionCode =
      fiduciary_commissions_fixed.value.find(
        (c) => c.id === typeData.commission_id
      )?.code ?? typeData.commission_id

    return {
      id:
        isEditing.value && editRowIndex.value !== null
          ? editRowIndex.value
          : maxId + 1,
      backend_id: existingRow?.backend_id ?? null,
      participation_type_id: typeData.participation_type_id,
      code: typeInfo?.code ?? existingRow?.code ?? '-',
      description: typeInfo?.description ?? existingRow?.description ?? '-',
      minimun_balance: typeData.minimun_balance,
      maximun_balance: typeData.maximun_balance,
      term_days: typeData.term_days,
      commission_id: commissionCode,
      commission_value: getCommissionRate(typeData.commission_id!),
      business_line_id: businessId,
    }
  }

  const handleAddRow = () => {
    if (!modalFormRef.value?.validate()) return

    if (modalType.value === 'business') {
      const newRow = createBusinessRow()
      if (!newRow)
        return showAlertFunction(
          '¡Debe seleccionar una línea válida!',
          'warning'
        )
      if (
        tablePropsBusiness.value.rows.some(
          (r) => r.business_line_id === newRow.business_line_id
        )
      )
        return showAlertFunction('¡Esta línea de negocio ya existe!', 'warning')

      tablePropsBusiness.value.rows.push(newRow)
      showAlertFunction('¡Línea de negocio registrada exitosamente!', 'success')
      handleCloseModal()
      return
    }

    if (modalType.value === 'types') {
      const newRow = createTypeRow()
      if (!newRow) return

      const businessId = selectedRowIdBusiness.value!
      const existingRows = businessTypesMap.value.get(businessId) || []

      const duplicateCheck = (excludeIndex?: number) =>
        existingRows.some(
          (r, idx) =>
            r.participation_type_id === newRow.participation_type_id &&
            idx !== excludeIndex
        )

      if (isEditing.value && editRowIndex.value !== null) {
        const indexToUpdate = existingRows.findIndex(
          (r) => r.id === editRowIndex.value
        )

        if (indexToUpdate === -1) {
          return showAlert('¡No se encontró el registro a editar!', 'warning')
        }

        if (duplicateCheck(indexToUpdate)) {
          return showAlert('¡Este tipo de participación ya existe!', 'warning')
        }

        existingRows.splice(indexToUpdate, 1, newRow)

        const nextItem = existingRows[indexToUpdate + 1]

        if (nextItem) {
          const finalBalance = +(newRow.maximun_balance ?? 0)
          nextItem.minimun_balance = finalBalance > 0 ? finalBalance + 0.01 : 0
        }

        showAlert('¡Tipo de participación actualizado exitosamente!', 'success')
      } else {
        if (duplicateCheck())
          return showAlert('¡Este tipo de participación ya existe!', 'warning')
        existingRows.push(newRow)
        showAlert('¡Tipo de participación registrado exitosamente!', 'success')
      }

      businessTypesMap.value.set(businessId, existingRows)
      tablePropsTypes.value.rows = [...existingRows]
      handleCloseModal()
    }
  }

  const handleDeleteRow = (index: number) => {
    const businessId = selectedRowIdBusiness.value
    if (!businessId) return

    const arr = businessTypesMap.value.get(businessId)
    if (!arr || index < 0 || index >= arr.length) return

    arr.splice(index, 1)
    tablePropsTypes.value.rows = [...arr]
    businessTypesMap.value.set(businessId, arr)
  }

  const getValues = () =>
    tablePropsBusiness.value.rows.map((row) => ({
      id: row.backend_id ?? null,
      business_line_id: row.business_line_id,
      participation_types: (
        businessTypesMap.value.get(row.business_line_id) || []
      ).map((type) => {
        const commissionId =
          fiduciary_commissions_fixed.value.find(
            (c) => c.code === type.commission_id
          )?.id ?? type.commission_id

        return {
          id: type.backend_id ?? null,
          participation_type_id: type.participation_type_id,
          minimun_balance: type.minimun_balance,
          maximun_balance: type.maximun_balance,
          term_days: type.term_days,
          commission_id: commissionId,
        }
      }),
    }))

  const validateForm = () => {
    if (!tablePropsBusiness.value.rows.length)
      return (
        showAlertFunction(
          'Debe agregar al menos una línea de negocio.',
          'warning'
        ),
        false
      )
    if (!tablePropsTypes.value.rows.length)
      return (
        showAlertFunction(
          'Debe agregar al menos un tipo de participación.',
          'warning'
        ),
        false
      )

    for (const [_, types] of businessTypesMap.value) {
      const lastRow = types.at(-1)
      if (!lastRow) continue

      const lastMaxInt = parseInt(String(lastRow.maximun_balance ?? 0), 10)

      if (lastMaxInt !== 999_999_999_999_999) {
        showAlert(
          'El último tipo de participación de cada línea de negocio debe contener el valor de 999,999,999,999,999.99',
          'warning',
          undefined,
          3000
        )
        return false
      }
    }

    return true
  }

  const isView = computed(() => ['view'].includes(props.action))
  const isEdit = computed(() => ['edit'].includes(props.action))

  const isFormValid = computed(() => {
    if (modalType.value === 'business') {
      return !!modalData.value.business_line_id
    }

    const type = modalData.value.participation_types[0]
    if (type.minimun_balance && type.maximun_balance) {
      if (type.maximun_balance <= type.minimun_balance) {
        return false
      }
    }

    if (participation_types_term_days_active.value && !type.term_days) {
      return false
    }

    return (
      !!type.participation_type_id &&
      !!type.maximun_balance &&
      !!type.commission_id
    )
  })

  const deleteBusinessLinesTable = (row: IBusinessLinesTable) => {
    const index = tablePropsBusiness.value.rows.findIndex(
      (r) => r.business_line_id === row.business_line_id
    )
    if (index !== -1) {
      tablePropsBusiness.value.rows.splice(index, 1)

      businessTypesMap.value.delete(row.business_line_id)

      if (selectedRowIdBusiness.value === row.business_line_id) {
        selectedRowIdBusiness.value = null
      }
    }
  }

  watch(
    () => props.data,
    (newVal) => {
      if (newVal) loadData()
    },
    { immediate: true }
  )

  watch(selectedRowIdBusiness, (newId) => {
    const types = businessTypesMap.value.get(newId ?? 0) || []
    tablePropsTypes.value.rows = [...types]
  })

  return {
    isView,
    isEdit,
    modalData,
    isEditing,
    modalType,
    getValues,
    addModalRef,
    isFormValid,
    handleAddRow,
    modalFormRef,
    validateForm,
    select_options,
    tablePropsTypes,
    handleOpenModal,
    handleCloseModal,
    handleDeleteRow,
    defaultIconsLucide,
    tablePropsBusiness,
    selectedRowIdBusiness,
    business_lines_active,
    participationTypesFormRef,
    fiduciary_commissions_fixed,
    pt_not_consolidated_without_fund,
    participation_types_term_days_active,
    deleteBusinessLinesTable,
  }
}

export default useParticipationTypesForm
