import {
  Field,
  ILocation,
  INomenclature,
  ILastElement,
} from '@/interfaces/customs/AddressGenerator'
import { IResource } from '@/interfaces/global'
import { ref, toRefs, computed, reactive, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useResourceStore } from '@/stores'
import { inputRulesRequired } from './constants'

export const useAddressGenerator = (props: any, emit: Function) => {
  const { getResources } = useResourceStore('v1')
  const {
    countries: storeCountries,
    departments: storeDepartments,
    cities: storeCities,
  } = storeToRefs(useResourceStore('v1'))

  const formValues = reactive<ILocation>({
    country: { id: null, name: '' as string },
    department: { id: 0 as number, name: '' as string },
    city: { id: 0 as number, name: '' as string },
    address: '' as string,
  })
  const { address } = toRefs(formValues)
  const isRequiresCustomName = ref(false)
  const lastElements = ref<ILastElement[]>([])

  const isEditing = computed(() => !!props.locationToEdit?.address)
  const countries = computed(() => props.countries ?? storeCountries.value)
  const departments = computed(
    () => props.departments ?? storeDepartments.value
  )
  const cities = computed(() => storeCities.value)
  const filteredCities = ref<IResource[]>([])
  const loadingCities = ref(false)

  // Desestructuracion props (toRefs mantiene reactividad)
  const { rules } = toRefs(props)
  const combinedRules = computed(() => [
    ...inputRulesRequired,
    ...(rules.value ?? []),
  ])

  // Visualización de campos: país, departamento y ciudad
  const isFieldVisible = (field: Field): boolean => {
    let isEnabled: boolean = props.enabledFields.includes(field)

    const requiresColombia = ['department', 'city'].includes(field)
    if (requiresColombia && showCountry.value)
      isEnabled = formValues.country?.id === 41

    return isEnabled
  }

  const showCountry = computed(() => isFieldVisible('country'))
  const showDepartment = computed(() => isFieldVisible('department'))
  const showCity = computed(() => isFieldVisible('city'))

  // Variables reactivas
  const isModalOpen = ref(props.isOpen)
  const nomenclatureSelect = ref<INomenclature>()
  const generatedAddressForm = ref()

  watch(isModalOpen, async (isOpen) => {
    if (isOpen && props.locationToEdit) {
      formValues.country = props.locationToEdit.country
      formValues.department = props.locationToEdit.department
      formValues.city = props.locationToEdit.city
      formValues.address = props.locationToEdit.address
    }
    if (!isOpen) await getResources(`keys[]=cities`)
  })

  watch(
    () => props.locationToEdit,
    (newLocation) => {
      if (!isModalOpen.value || !newLocation) return

      formValues.country = newLocation.country
      formValues.department = newLocation.department
      formValues.city = newLocation.city
      formValues.address = newLocation.address
    },
    { immediate: true }
  )

  watch(
    () => formValues.department,
    async (newDepartment) => {
      if (!isModalOpen.value || !newDepartment?.id) return

      loadingCities.value = true
      filteredCities.value = []
      try {
        await getResources(
          `keys[]=cities&filter[department_id]=${newDepartment.id}`
        )
        filteredCities.value = storeCities.value
      } finally {
        loadingCities.value = false
      }
    },
    { deep: true }
  )

  watch(
    () => props.isOpen,
    (newVal) => {
      isModalOpen.value = newVal
    }
  )

  const isValidSelection = (
    type: 'nomenclature' | 'letter' | 'digit' | 'bis',
    value: string
  ): boolean => {
    if (lastElements.value.length === 0) return true

    if (type === 'nomenclature') {
      const lastNomenclature = lastElements.value.findLast(
        (el) => el.type === 'nomenclature'
      )
      if (lastNomenclature && lastNomenclature.value === value) {
        return false
      }
    }

    if (type === 'letter') {
      const consecutiveLettersCount = lastElements.value
        .slice(-2)
        .filter((el) => el.type === 'letter').length
      if (consecutiveLettersCount >= 2) {
        return false
      }
    }

    return true
  }

  const joinConsecutiveNumbers = (address: string): string => {
    return address.replace(/(\d)\s+(?=\d)/g, '$1')
  }

  const addToLastElements = (
    type: 'nomenclature' | 'letter' | 'digit' | 'bis',
    value: string
  ) => {
    lastElements.value = [...lastElements.value, { type, value }]
  }

  // Nomenclaturas
  const addNomenclature = (nomenclature: string) => {
    if (isValidSelection('nomenclature', nomenclature)) {
      address.value =
        address.value === '' ? nomenclature : `${address.value} ${nomenclature}`
      addToLastElements('nomenclature', nomenclature)
    }
  }

  const handleNomenclatureClick = (item: string | Record<string, any>) => {
    const nomenclatureObj = item as INomenclature
    const { abbreviation: nomenclatureAbrev, requiresCustomName } =
      nomenclatureObj
    addNomenclature(nomenclatureAbrev)
    isRequiresCustomName.value = requiresCustomName
  }

  const handleNomenclatureSelectChange = (nomenclatureObj: INomenclature) => {
    if (!nomenclatureObj) return
    const { abbreviation: nomenclatureAbrev, requiresCustomName } =
      nomenclatureObj
    addNomenclature(nomenclatureAbrev)
    isRequiresCustomName.value = requiresCustomName
  }

  const handleAddCustomName = (customNomenclatureName: string) => {
    if (!customNomenclatureName || typeof customNomenclatureName !== 'string')
      return
    const name = customNomenclatureName.trim()
    addNomenclature(name.toUpperCase())
    isRequiresCustomName.value = false
  }

  // Digitos
  const handleDigitClick = (item: Record<string, any> | string) => {
    const digit = item as string
    if (!digit) return
    if (isValidSelection('digit', digit)) {
      let newAddress =
        address.value === '' ? digit : `${address.value} ${digit}`
      newAddress = joinConsecutiveNumbers(newAddress)
      address.value = newAddress
      addToLastElements('digit', digit)
    }
  }

  // Letras
  const handleLetterClick = (item: Record<string, any> | string) => {
    const letter = item as string
    if (!letter) return
    if (letter.toLowerCase() === 'bis') {
      handleBisClick()
      return
    }
    if (isValidSelection('letter', letter)) {
      address.value =
        address.value === '' ? letter : `${address.value} ${letter}`
      addToLastElements('letter', letter)
    }
  }

  // BIS
  const handleBisClick = () => {
    const bisType = 'bis'
    const bisValue = 'Bis'
    const isBisPresent = address.value.includes(` ${bisValue}`)

    if (isValidSelection(bisType, bisValue) && !isBisPresent) {
      address.value = `${address.value} ${bisValue}`.trim()
      addToLastElements(bisType, bisValue)
    } else if (isBisPresent) {
      address.value = address.value.replace(` ${bisValue}`, '').trim()
      lastElements.value = lastElements.value.filter(
        (el) => el.type !== bisType
      )
    }
  }

  const handleRemoveLastElement = () => {
    if (!lastElements.value.length) address.value = ''

    const lastElement = lastElements.value.pop()
    if (!lastElement) return

    // Elimina el ultimo elemento de la direccion.
    const { value } = lastElement
    address.value = address.value
      .replace(new RegExp(`\\s?${value}$`), '')
      .trim()
  }

  const clearAll = () => {
    formValues.country = undefined
    formValues.department = undefined
    formValues.city = undefined
    formValues.address = ''
    lastElements.value = []
  }

  const onSubmit = async () => {
    generatedAddressForm.value.validate().then((success: boolean) => {
      if (!success) return

      if (isEditing.value) {
        // Actualizar la locación
        emit(
          'save',
          { ...formValues, id: props.locationToEdit?.id },
          lastElements
        )
      } else {
        // Crear una nueva locación
        emit(
          'save',
          {
            ...formValues,
            id: `temp-${Math.random().toString(36).substr(2, 9)}`,
          },
          lastElements
        )
      }
      closeModal()
    })
  }

  const closeModal = () => {
    clearAll()
    isModalOpen.value = false
    emit('update:isOpen', false)
  }

  return {
    formValues,
    isRequiresCustomName,
    lastElements,
    isEditing,
    countries,
    departments,
    cities,
    filteredCities,
    loadingCities,
    combinedRules,
    showCountry,
    showDepartment,
    showCity,
    handleNomenclatureClick,
    handleNomenclatureSelectChange,
    handleAddCustomName,
    handleDigitClick,
    handleLetterClick,
    handleRemoveLastElement,
    clearAll,
    isModalOpen,
    generatedAddressForm,
    nomenclatureSelect,
    onSubmit,
    closeModal,
  }
}
