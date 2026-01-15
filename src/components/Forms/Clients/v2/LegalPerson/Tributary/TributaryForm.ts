// Vue - Pinia - Router - Quasar
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { ActionType } from '@/interfaces/global'
import {
  IClientIndirectBasicForm,
  IClientLegalPersonIndirectTributaryForm,
} from '@/interfaces/customs/clients/ClientIndirectLegalPerson'
import { ISettlementFormula } from '@/interfaces/customs/clients/Clients'

// Composables
import { useUtils } from '@/composables'

// Stores
import { useAssetResourceStore } from '@/stores/resources-manager'
import { useClientsStore } from '@/stores/clients'
import { useResourceStore } from '@/stores/resources-selects'

const useTributaryForm = (
  props: {
    action: ActionType
    basicInformationDataForm: IClientIndirectBasicForm | null
    tributaryDataForm: IClientLegalPersonIndirectTributaryForm | null
  },
  emit: Function
) => {
  const { isEmptyOrZero } = useUtils()

  const { isLegalPersonIndirect } = storeToRefs(useClientsStore('v2'))
  const { countries } = storeToRefs(useResourceStore('v1'))
  const { fiscal_responsability } = storeToRefs(useAssetResourceStore('v1'))

  const formTributaryRef = ref()
  const isAddressGeneratorOpen = ref(false)
  const showModalAssign = ref(false)

  const models = ref<IClientLegalPersonIndirectTributaryForm>({
    fiscal_responsibility: null, // Obligaciones tributarias
    vat_responsibility: false, // Responsable de IVA
    files_tax_return: false, // ¿Declara renta?
    files_foreign_taxes: false, // ¿Declara impuestos en otro país?
    country_id: null, // País donde declara impuestos
    giin_code: null, // Código CIIU / GIIN
    is_branches: false, // ¿Tiene sucursales en otros países?
    description_economic_activity: null, // Descripción actividad económica
    branch_address: null, // Dirección sucursal
    branch_country_id: null, // País sucursal
    settlement_formulas: [],
  })

  const settlementFormulas = ref<ISettlementFormula[]>([])

  const assignDataForm = computed(() => {
    return {
      third_party: `${
        props.basicInformationDataForm?.document_number ?? ''
      } - ${props.basicInformationDataForm?.name ?? ''}`,
      fiscal_responsibility: models.value?.fiscal_responsibility ?? null,
      vat_responsibility: models.value?.vat_responsibility ?? false,
      reteiva_concept: null,
      reteiva_concept_tax_rate: null,
      iva_concept: null,
      iva_concept_tax_rate: null,
    }
  })

  const setValueModel = (
    data: IClientLegalPersonIndirectTributaryForm | null
  ) => {
    if (data) {
      Object.assign(models.value, data)
      settlementFormulas.value = data.settlement_formulas || []
    }
  }

  const handleShowModalAssign = (value: boolean = false) => {
    showModalAssign.value = value
  }

  const onUpdateSelectedSettlementFormulasList = (
    value: ISettlementFormula[]
  ) => {
    models.value.settlement_formulas = value
    settlementFormulas.value = value
  }

  watch(
    () => props.tributaryDataForm,
    (val) => {
      if (!val) return
      setValueModel(val)
    },
    { deep: true, immediate: true }
  )

  watch(
    () => models.value,
    (val) => {
      if (JSON.stringify(val) === JSON.stringify(props.tributaryDataForm))
        return
      emit('update:tributary-data-form', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  return {
    models,
    formTributaryRef,
    isAddressGeneratorOpen,
    isLegalPersonIndirect,
    showModalAssign,
    assignDataForm,
    settlementFormulas,

    countries,
    fiscal_responsability,

    handleShowModalAssign,
    onUpdateSelectedSettlementFormulasList,
  }
}

export default useTributaryForm
