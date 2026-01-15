//Vue
import { watch, ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

//Stores
import { useClientsStore } from '@/stores/clients'

//Interfaces
import { ClientPersonType } from '@/interfaces/global/Clients'
import { ActionType } from '@/interfaces/global'
import { IClientIndirectNaturalPepForm } from '@/interfaces/customs/clients/ClientIndirectNaturalPerson'

//Composables
import { useRules } from '@/composables'

const usePepForm = (props: {
  action: ActionType
  data?: IClientIndirectNaturalPepForm | null
}, emit: Function) => {
  const { client_person_type } = storeToRefs(useClientsStore('v2'))

  const {
    date_before_or_equal_to_the_current_date,
    date_after_or_equal_to_specific_date,
  } = useRules()

  const formPep = ref()

  const models = ref<IClientIndirectNaturalPepForm>({
    pep_info: {
      is_pep: false,
      is_politician: false,
      legal_representative: false,
      is_pep_international: false,
      position: '',
      date_entry: '',
      date_exit: '',
      entity: '',
      has_pep_relatives: false
    },
    pep_info_relative: null
  })


  const clientNaturalTypeDirect = computed(() => client_person_type.value === ClientPersonType.NATURAL_DIRECT);
  const pepLabel = computed(() => clientNaturalTypeDirect.value ?
    '¿Es o ha sido durante los últimos años persona expuesta políticamente (PEP) nacional o extranjero?' :
    '¿Es una persona expuesta políticamente (PEP)?')
  const pepPositionAndEntityLabel = computed(() => clientNaturalTypeDirect.value ?
    'Cargo y entidad' : 'Cargo')
  const pepDateEntryLabel = computed(() => clientNaturalTypeDirect.value ?
    'Fecha de ingreso al cargo' : 'Fecha de ingreso')
  const pepDateExitLabel = computed(() => clientNaturalTypeDirect.value ?
    'Fecha de retiro del cargo (Cuando aplique)' : 'Fecha de retiro')

  const _setValueModel = () => {
    Object.assign(models.value, props.data)
  }

  onMounted(() => {
    _setValueModel()

    if (!props.data || Object.keys(props.data).length === 0) {
      emit('update:data', models.value)
    }
  })

  watch(
    () => props.data,
    (val) => {
      if (!val) return
      _setValueModel()
    },
    { deep: true, immediate: true }
  )

  watch(
    () => models.value.pep_info_relative?.familiar_politician,
    (val) => {
      if (val === true && models.value.pep_info_relative === null) {
        models.value.pep_info_relative = {
          familiar_politician: true,
          full_name: '',
          relationship: '',
          position: '',
          entity: ''
        }
      }

      if (val === false) {
        models.value.pep_info_relative = null
      }
    }
  )

  watch(
    () => models.value,
    (val) => {
      emit("update:data", val)
    },
    { deep: true }
  )

  watch(
    () => models.value.pep_info_relative,
    (val) => {
      models.value.pep_info.has_pep_relatives = val !== null
    },
    { deep: true }
  )


  const handleFamiliarPoliticianUpdate = (val: boolean) => {
    if (!models.value.pep_info_relative) {
      models.value.pep_info_relative = {
        familiar_politician: val,
        full_name: null,
        relationship: null,
        position: null,
        entity: null
      }
    } else {
      models.value.pep_info_relative.familiar_politician = val
    }
  }

  return {
    models,
    formPep,
    date_before_or_equal_to_the_current_date,
    date_after_or_equal_to_specific_date,
    useRules,

    clientNaturalTypeDirect,
    pepLabel,
    pepPositionAndEntityLabel,
    pepDateEntryLabel,
    pepDateExitLabel,
    handleFamiliarPoliticianUpdate
  }
}

export default usePepForm
