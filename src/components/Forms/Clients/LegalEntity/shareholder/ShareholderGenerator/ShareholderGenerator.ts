import { IShareholder } from '@/interfaces/customs/Clients'
import { ITabs } from '@/interfaces/global'
import { ref, onMounted, computed, watch } from 'vue'
import { useClientsStore, useResourceStore } from '@/stores'
import { defaultIcons } from '@/utils'
import { storeToRefs } from 'pinia'

export const useShareholderGenerator = (props: any, emit: any) => {
  const { getResources } = useResourceStore('v1')
  const {
    data_shareholder_info_form,
    data_shareholder_profile_form,
    data_shareholder_pep_form,
    data_shareholder_tributary_form,
  } = storeToRefs(useClientsStore('v1'))
  const { _clearDataShareholder } = useClientsStore('v1')

  const isModalOpen = ref(props.isOpen)
  const isEditing = computed(() => !!props.itemToEdit)

  const isNaturalPerson = computed(
    () => (props.personType as string)?.toLowerCase() === 'natural'
  )
  const isLegalPerson = computed(() =>
    ['legal', 'juridica'].includes(String(props.personType).toLowerCase())
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
    'shareholder_types',
    'beneficiary_ownerships',
    'beneficiary_benefits',
  ]

  const tabs = computed(() => {
    const baseTabs = ref<ITabs[]>([
      {
        name: 'basic_data',
        label: 'Accionistas',
        icon: defaultIcons.accountBoxOutline,
        outlined: true,
        disable: true,
        show: true,
        required: false,
      },
      {
        name: 'profile',
        label: 'Perfil',
        icon: defaultIcons.accountBoxOutline,
        outlined: true,
        disable: true,
        show: true,
        required: false,
      },
    ])

    if (isNaturalPerson.value) {
      baseTabs.value.push({
        name: 'pep',
        label: 'PEP',
        icon: defaultIcons.accountBoxOutline,
        outlined: true,
        disable: true,
        show: true,
        required: false,
      })
    } else if (isLegalPerson.value) {
      baseTabs.value.push({
        name: 'tributary',
        label: 'Tributario',
        icon: defaultIcons.accountBoxOutline,
        outlined: true,
        disable: true,
        show: true,
        required: false,
      })
    }

    return baseTabs.value
  })

  const tabActive = ref(tabs.value[0].name)
  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  // Forms
  const basicDataFormRef = ref()
  const profileFormRef = ref()
  const pepFormRef = ref()
  const tributaryFormRef = ref()

  const makeShareholderData = () => {
    const item: IShareholder = {
      ...data_shareholder_info_form.value,
      ...data_shareholder_profile_form.value,
      ...data_shareholder_pep_form.value,
      ...data_shareholder_tributary_form.value,
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
      await profileFormRef.value
        ?.validateForm()
        .then((success: boolean) => {
          valid = success
        })
        .catch(() => {
          valid = false
        })
    }

    if (tabActiveIdx.value == 2 && isNaturalPerson.value) {
      await pepFormRef.value
        ?.validateForm()
        .then((success: boolean) => {
          valid = success
        })
        .catch(() => {
          valid = false
        })
    }

    if (tabActiveIdx.value == 2 && isLegalPerson.value) {
      await tributaryFormRef.value
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

    if (tabActiveIdx.value == 2 && isNaturalPerson.value) {
      await pepFormRef.value
        ?.validateForm()
        .then((success: boolean) => {
          valid = success
        })
        .catch(() => {
          valid = false
        })
    }

    if (tabActiveIdx.value == 2 && isLegalPerson.value) {
      await tributaryFormRef.value
        ?.validateForm()
        .then((success: boolean) => {
          valid = success
        })
        .catch(() => {
          valid = false
        })
    }

    if (valid) {
      const item = makeShareholderData()

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
      _clearDataShareholder()
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
    profileFormRef,
    pepFormRef,
    tributaryFormRef,
    onSubmit,
    nextTab,
    backTab,
    closeModal,
  }
}
