// Vue - Pinia - Router - Quasar
import { ref, onMounted, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { ValidationRule } from 'quasar'
import { defaultIcons } from '@/utils'

// Composables
import { useUtils } from '@/composables/useUtils'

// Interfaces
import { IManager } from '@/interfaces/customs/clients/Clients'
import { ITabs, ActionType } from '@/interfaces/global'
import { PersonType } from '@/interfaces/global/Clients'

// Stores
import { useClientsStore, useResourceStore } from '@/stores'

// TODO: Falta refactor de composable
export const useManagerGenerator = (
  props: {
    isOpen: boolean
    rules?: ValidationRule[]
    itemToEdit: IManager | null
    required?: boolean
    personType: PersonType
    formType: ActionType
  },
  emit: Function
) => {
  const { getResources } = useResourceStore('v1')
  const { data_manager_info_form, data_manager_pep_form } = storeToRefs(
    useClientsStore('v2')
  )
  const { _clearDataManager } = useClientsStore('v2')
  const { normalizeText } = useUtils()

  const isModalOpen = ref(props.isOpen)
  const isEditing = computed(() => !!props.itemToEdit)

  const isNaturalPerson = computed(
    () => (props.personType as string)?.toLowerCase() === 'natural'
  )
  const isLegalPerson = computed(() =>
    ['legal', 'juridica'].includes(normalizeText(String(props.personType)))
  )

  const keys = [
    'banks',
    'fiscal_responsability',
    'occupations',
    'third_party_type',
    'document_types_third_party_natural',
    'document_types_third_legal',
    'bank_branches',
    'third_party_identity_types',
    'countries',
    'departments',
    'cities',
    'ciius',
    'Manager_types',
    'beneficiary_ownerships',
    'beneficiary_benefits',
  ]

  const tabs = computed(() => {
    const baseTabs = ref<ITabs[]>([
      {
        name: 'basic_data',
        label: 'Perfil',
        icon: defaultIcons.accountBoxOutline,
        outlined: true,
        disable: true,
        show: true,
        required: false,
      },
      {
        name: 'pep',
        label: 'PEP',
        icon: defaultIcons.accountBoxOutline,
        outlined: true,
        disable: true,
        show: true,
        required: false,
      },
    ])

    return baseTabs.value
  })

  const tabActive = ref(tabs.value[0].name)
  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  // Forms
  const basicDataFormRef = ref()
  const pepFormRef = ref()

  const makeManagerData = async () => {
    const item: IManager = {
      ...data_manager_info_form.value,
      ...data_manager_pep_form.value,
      person_type: props.personType ?? null,
    }

    return item
  }

  const nextTab = async () => {
    let valid = true

    if (tabActiveIdx.value == 0) {
      await basicDataFormRef.value
        ?.validateForm()
        .then((success: boolean) => {
          valid = success
        })
        .catch(() => {
          valid = false
        })
    }

    if (tabActiveIdx.value == 1) {
      await pepFormRef.value
        ?.validateForm()
        .then((success: boolean) => {
          valid = success
        })
        .catch(() => {
          valid = false
        })
    }

    if (valid) {
      tabActiveIdx.value = tabActiveIdx.value + 1
      tabActive.value = tabs.value[tabActiveIdx.value].name
    }
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const onSubmit = async () => {
    let valid = true

    if (tabActiveIdx.value == 1) {
      await pepFormRef.value
        ?.validateForm()
        .then((success: boolean) => {
          valid = success
        })
        .catch(() => {
          valid = false
        })
    }

    if (valid) {
      const item = await makeManagerData()

      if (isEditing.value) {
        // Actualizar
        emit('save', { ...item, id: props.itemToEdit?.id })
      } else {
        emit('save', { ...item })
      }

      closeModal()
    }
  }

  const closeModal = () => {
    isModalOpen.value = false
    emit('update:isOpen', false)
  }

  watch(
    () => props.isOpen,
    (newVal) => {
      isModalOpen.value = newVal
      _clearDataManager()
      tabActiveIdx.value = 0
      tabActive.value = tabs.value[0].name
    }
  )

  onMounted(async () => {
    await getResources(`keys[]=${keys.join('&keys[]=')}`)
  })

  return {
    isModalOpen,
    isEditing,
    isNaturalPerson,
    isLegalPerson,
    tabs,
    tabActive,
    tabActiveIdx,
    basicDataFormRef,
    pepFormRef,
    onSubmit,
    nextTab,
    backTab,
    closeModal,
  }
}
