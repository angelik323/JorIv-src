//Vue - Pinia
import { ref, watch, computed, onMounted } from "vue";
import { storeToRefs } from 'pinia'

//Stores
import { useClientsStore } from '@/stores/clients'

//Interfaces
import { ActionType } from '@/interfaces/global'
import { ClientPersonType } from '@/interfaces/global/Clients'
import { IClientIndirectNaturalInvestorForm } from '@/interfaces/customs/clients/ClientIndirectNaturalPerson'

//Composables
import { useRules, useUtils } from '@/composables'

const useInvestorForm = (props: {
  action: ActionType;
  data?: IClientIndirectNaturalInvestorForm | null
}, emit: Function) => {
  const { client_person_type } = storeToRefs(useClientsStore('v2'))

  const { isEmptyOrZero } = useUtils()

  const formInvestor = ref()
  const models = ref<IClientIndirectNaturalInvestorForm>({
    investor: {
      investor_rating: '',
      quantitative_risk_rating: '',
      qualitative_risk_rating: '',
    }
  })

  const clientNaturalTypeDirect = computed(() => client_person_type.value === ClientPersonType.NATURAL_DIRECT);
  const investorTitle = computed(() => clientNaturalTypeDirect.value ? 'Inversionista' : 'Clasificación del inversionista y calificación del perfil de riesgo')


  const _setValueModel = () => {
    Object.assign(models.value, props.data)
  }

  onMounted(() => {
    _setValueModel()
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
    () => models.value,
    (val) => {
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  return {
    models,
    formInvestor,
    useRules,

    investorTitle,
    clientNaturalTypeDirect
  }
}

export default useInvestorForm
