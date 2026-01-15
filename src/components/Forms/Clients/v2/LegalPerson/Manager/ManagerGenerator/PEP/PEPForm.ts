// Vue - Pinia - Router - Quasar
import { onMounted, computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IManagerPEPForm, IManager } from '@/interfaces/customs/clients/Clients'
import { ClientPersonType } from '@/interfaces/global/Clients'
import { ActionType } from '@/interfaces/global'

// Stores
import { useClientsStore } from '@/stores'

// TODO: Falta refactor de composable
export const usePEPForm = (props: {
  data: IManager | null
  formType: ActionType
}) => {
  const { client_person_type, data_manager_pep_form } = storeToRefs(
    useClientsStore('v2')
  )
  const { _setDataManagerPEPForm } = useClientsStore('v2')

  const formValues = ref<IManagerPEPForm>({
    is_pep: false, // ¿Es una persona expuesta políticamente (PEP)?
    position: null, // Cargo
    entity: null, // Entidad
    date_exit: null, // Fecha de retiro del cargo
    is_politician: false, // Político  (Según decreto 830 de 2021)
    pep_type_id: null, // Representante Legal de una organización internacional
    is_international_pep: false, // Representante Legal de una organización internacional
    is_pep_international: false, // PEP Internacional
    date_entry: null, // Fecha de ingreso al cargo
    has_pep_relatives: false, // ¿Tiene parentesco con persona expuesta políticamente (PEP)?

    relatives: {
      full_name: null, // Nombre completo
      relationship: null, // Parentesco
      position: null, // Cargo que desempeña
      entity: null, // Entidad
      id: null,
    },
  })

  const formElementRef = ref()

  const isLegalPersonIndirect = computed(() => {
    return client_person_type.value === ClientPersonType.LEGAL_INDIRECT
  })

  const setInitData = () => {
    if (!data_manager_pep_form.value) return
    formValues.value = { ...data_manager_pep_form.value }
  }

  const setForm = () => {
    const data = props.data
    if (data) {
      Object.assign(formValues.value, data)
    }
  }

  const handlerActionForm = (formType: 'create' | 'edit' | 'view') => {
    const actionHandlers: Record<typeof formType, () => void> = {
      create: setInitData,
      edit: data_manager_pep_form.value ? setInitData : setForm,
      view: setForm,
    }
    actionHandlers[formType]?.()
  }

  onMounted(() => {
    handlerActionForm(props.formType)
  })

  watch(
    () => [formValues.value.is_pep],
    () => {
      if (!formValues.value.is_pep) {
        formValues.value.is_politician = false
        formValues.value.is_international_pep = false
        formValues.value.is_pep_international = false
      }
    }
  )

  watch(
    () => [formValues.value.has_pep_relatives],
    () => {
      if (!formValues.value.has_pep_relatives) {
        formValues.value.relatives = {
          full_name: null,
          relationship: null,
          position: null,
          entity: null,
          id: null,
        }
      }
    }
  )

  watch(
    formValues,
    (newValue: IManagerPEPForm) => {
      _setDataManagerPEPForm(newValue)
    },
    { deep: true }
  )

  watch(
    () => props.data,
    (val) => {
      if (val) {
        handlerActionForm(props.formType)
      }
    }
  )

  return {
    formValues,
    formElementRef,
    isLegalPersonIndirect,
    onlyLetters: /^(?! )[A-Za-zÁÉÍÓÚÜÑñáéíóúü]+(?: [A-Za-zÁÉÍÓÚÜÑñáéíóúü]+)*$/,
  }
}
