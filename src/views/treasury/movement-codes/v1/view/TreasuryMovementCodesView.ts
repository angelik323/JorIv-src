import { useMainLoader } from '@/composables'
import { onMounted, reactive, ref, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { defaultIconsLucide } from '@/utils'
import { storeToRefs } from 'pinia'
import { useMovementCodeStore, useResourceStore } from '@/stores'
import { watch } from 'vue'
import { IResource } from '@/interfaces/global'

export const useTreasureMovementCodesView = () => {
  const { openMainLoader } = useMainLoader()
  const route = useRoute()
  const { _getResourcesTreasuries } = useResourceStore('v1')
  const { data_information_form } = storeToRefs(useMovementCodeStore('v1'))
  const { _getByIdMovementCodes } = useMovementCodeStore('v1')

  const { receipt_type, sub_receipt_type, movement_code_override } =
    storeToRefs(useResourceStore('v1'))
  const keys = ['receipt_type', 'sub_receipt_type']

  const movementCodeId = +route.params.id
  const fieldRows = computed(() => chunkArray(fields, 4))
  const formInformation = ref(null)

  const models = ref({
    id: movementCodeId,
    description: '',
    nature: '',
    operation: '',
    generate_special_contribution: null,
    handles_accounting_offset: null,
    conciliation_movement: null,
    transfer_investments: null,
    transfer_accounts: null,
    receipt_types_id: null,
    sub_receipt_types_id: null,
    move_override: null,
  })

  //Solamente para fines visuales, que se ubique en la zona superior solo
  const fieldCode = {
    label: 'Código',
    value: () => models.value.id,
    fallback: 'No registrado',
  }

  const getCode = (id: number, list: IResource[]) => {
    return list.find((item) => item.value === id)?.label || 'No registrado'
  }

  const fields = [
    {
      label: 'Descripción',
      value: () => models.value.description.toUpperCase(),
      fallback: 'No registrado',
    },
    {
      label: 'Naturaleza',
      value: () => models.value.nature,
      fallback: 'No registrado',
    },
    {
      label: 'Operación',
      value: () => models.value.operation,
      fallback: 'No registrado',
    },
    {
      label: '¿Maneja contrapartida contable?',
      value: () => models.value.handles_accounting_offset,
      yesNo: true,
    },
    {
      label: '¿Movimiento de conciliación?',
      value: () => models.value.conciliation_movement,
      yesNo: true,
    },
    {
      label: '¿Genera contribución especial?',
      value: () => models.value.generate_special_contribution,
      yesNo: true,
    },
    {
      label: '¿Traslado de inversiones?',
      value: () => models.value.transfer_investments,
      yesNo: true,
    },
    {
      label: '¿Cesión de cuentas?',
      value: () => models.value.transfer_accounts,
      yesNo: true,
    },
    {
      label: 'Comprobante contable',
      value: () =>
        models.value.receipt_types_id != null
          ? getCode(models.value.receipt_types_id, receipt_type.value)
          : 'No registrado',
    },
    {
      label: 'Sub comprobante',
      value: () =>
        models.value.sub_receipt_types_id != null
          ? getCode(models.value.sub_receipt_types_id, sub_receipt_type.value)
          : 'No registrado',
    },
    {
      label: 'Movimiento anulación',
      value: () =>
        models.value.move_override != null
          ? getCode(models.value.move_override, movement_code_override.value)
          : 'No registrado',
    },
  ]

  const chunkArray = <T>(arr: T[], size: number): T[][] => {
    const result: T[][] = []
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size))
    }
    return result
  }

  const headerProps = ref({
    title: 'Ver códigos de movimiento de tesorería',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Tesorería', route: '' },
      {
        label: 'Códigos de movimientos de tesorería',
        route: 'TreasuryMovementCodesList',
      },
      { label: 'Ver ' },
      { label: movementCodeId.toString() },
    ],
  })

  const tabs = reactive([
    {
      name: 'InformationForm',
      label: 'Datos Básicos',
      icon: defaultIconsLucide.listBulleted,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ])
  onMounted(async () => {
    openMainLoader(true)
    await _getResourcesTreasuries(`keys[]=${keys.join('&keys[]=')}`)
    await _getByIdMovementCodes(movementCodeId)
    if (data_information_form.value) {
      Object.assign(models.value, {
        id: data_information_form.value.code,
        description: data_information_form.value.description,
        nature: data_information_form.value.nature,
        operation: data_information_form.value.operation,
        generate_special_contribution:
          data_information_form.value.generate_special_contribution,
        handles_accounting_offset:
          data_information_form.value.handles_accounting_offset,
        conciliation_movement:
          data_information_form.value.conciliation_movement,
        transfer_investments: data_information_form.value.transfer_investments,
        transfer_accounts: data_information_form.value.transfer_accounts,
        receipt_types_id: data_information_form.value.receipt_types_id,
        sub_receipt_types_id: data_information_form.value.sub_receipt_types_id,
        move_override: data_information_form.value.move_override,
      })
    }

    setTimeout(() => openMainLoader(false), 1200)
  })
  onUnmounted(() => {
    data_information_form.value = null
  })

  const formatYesNo = (val: boolean | number | null) =>
    val === true || val === 1 ? 'Sí' : 'No'

  const activeTab = ref(tabs[0].name)
  const tabActiveIdx = ref(
    tabs.findIndex((tab) => tab.name === activeTab.value)
  )

  watch(
    () => models.value.receipt_types_id,
    (newId, oldId) => {
      if (!newId) return
      _getResourcesTreasuries(
        `keys[]=sub_receipt_type&receipt_type_id=${newId}`
      )
      if (oldId && newId !== oldId) {
        models.value.sub_receipt_types_id = null
      }
    }
  )
  return {
    headerProps,
    formInformation,
    models,
    tabs,
    activeTab,
    tabActiveIdx,
    formatYesNo,
    fields,
    fieldCode,
    fieldRows,
  }
}
