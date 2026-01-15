// vue - pinia
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// interfaces
import {
  INomenclatureRealStateProject,
  IRealStateProjectStages,
} from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'

// stores
import {
  useAssetResourceStore,
  useResourceManagerStore,
  useTrustBusinessResourceStore,
} from '@/stores'
import { QTable } from 'quasar'

const usePropertyFeaturesForm = (
  props: {
    action: ActionType
    data?: IRealStateProjectStages
    business_trust_id: number
    stage_number?: number
  },
  emit: Function
) => {
  // imports
  const {
    business_trust_third_parties,
    development_type,
    base_calculation_property,
    associated_financing,
    business_trust_guarantee,
    business_trust_policy,
    block_nomeclatures,
  } = storeToRefs(useTrustBusinessResourceStore('v1'))

  const { _getResources } = useResourceManagerStore('v1')
  const { departments, cities, banks } = storeToRefs(
    useAssetResourceStore('v1')
  )

  const isCreate = computed(() => props.action === 'create')
  const isEditing = computed(() => props.action === 'edit')

  const models = ref<IRealStateProjectStages>({
    id: undefined,
    stage_number: undefined,
    address: null,
    land_area: null,
    builder_id: null,
    technical_supervision_id: null,
    property_registration: null,
    start_date: null,
    start_end: null,
    total_value: null,
    financed_value: null,
    associated_financing: null,
    observations: null,
    development_type: null,
    block_nomenclature: null,
    number_of_groups: null,
    initial_group: null,
    final_group: null,
    total_units_stage: null,
    property_area_m2: null,
    property_value_calculation: null,
    property_value: null,
    department_id: null,
    number_of_unit_per_group: null,
    city_id: null,
    policies_id: null,
    guarantee_id: null,
    financing_bank_id: null,
    business_trust_project_id: null,
    business_trust_id: null,
    base_calculation_property: null,
    nomenclatures: [],
    documents: [],
  })

  const getInfoGuarantee = async () => {
    await _getResources(
      { trust_business: ['business_trust_guarantee'] },
      `filter[business_trust_id]=${props.business_trust_id}`
    )
    await _getResources(
      { trust_business: ['business_trust_policy'] },
      `filter[business_trust_id]=${props.business_trust_id}`
    )
  }

  // forms
  const characteristicsForm = ref()

  const characteristicsFormisValid = async (): Promise<boolean> => {
    const requiredFields: {
      field: string | number | null | undefined
      label: string
    }[] = [
      {
        field: models.value.number_of_groups,
        label: houseDepartmentProps.value.number_of_groups,
      },
      {
        field: models.value.block_nomenclature,
        label: houseDepartmentProps.value.block_nomenclature,
      },
      {
        field: models.value.number_of_unit_per_group,
        label: houseDepartmentProps.value.number_of_unit_per_group,
      },
      {
        field: models.value.initial_group,
        label: houseDepartmentProps.value.initial_group,
      },
      {
        field: models.value.final_group,
        label: houseDepartmentProps.value.final_group,
      },
      { field: models.value.property_area_m2, label: 'Área del inmueble (m2)' },
    ]

    const hasEmptyFields = requiredFields.some(({ field }) => {
      if (field === null || field === undefined || field === '') {
        return true
      }

      if (typeof field === 'number' && field === 0) {
        return true
      }

      if (typeof field === 'string' && field.trim() === '') {
        return true
      }
      return false
    })

    if (hasEmptyFields) {
      return false
    }

    models.value.nomenclatures = []

    await getInfoGuarantee()

    let index = 1
    if (isTower.value) {
      const initialTower = Number(models.value.initial_group ?? 0)
      const finalTower = Number(models.value.final_group ?? 0)
      const totalTowers = Number(models.value.number_of_groups ?? 0)
      const totalFloors = Number(models.value.block_nomenclature ?? 0)
      const unitsPerFloor = Number(models.value.number_of_unit_per_group ?? 0)

      models.value.nomenclatures = []

      for (
        let tower = initialTower;
        tower <= finalTower && tower <= totalTowers;
        tower++
      ) {
        for (let floor = 1; floor <= totalFloors; floor++) {
          for (let unit = 1; unit <= unitsPerFloor; unit++) {
            const unitNumber = `${floor}${unit.toString().padStart(2, '0')}`
            models.value.nomenclatures.push({
              id: index,
              index_number: index,
              nomenclature: `Torre ${tower} - ${unitNumber}`,
              area: models.value.property_area_m2 ?? 0,
              value: models.value.property_value ?? null,
              status_id: 83,
            })
            index++
          }
        }
      }
    } else {
      if (isNumber.value) {
        const start = Number(models.value.initial_group)
        const end = Number(models.value.final_group)

        for (let m = start; m <= end; m++) {
          for (
            let c = 1;
            c <= Number(models.value.number_of_unit_per_group);
            c++
          ) {
            models.value.nomenclatures?.push({
              id: index,
              index_number: index,
              nomenclature: `Mz ${m} - Casa ${c}`,
              area: models.value.property_area_m2 ?? 0,
              value: models.value.property_value ?? null,
              status_id: 83,
            })
            index++
          }
        }
      } else {
        const start = (models.value.initial_group as string)
          .toLowerCase()
          .charCodeAt(0)
        const end = (models.value.final_group as string)
          .toLowerCase()
          .charCodeAt(0)

        for (let m = start; m <= end; m++) {
          const letter = String.fromCharCode(m)
          for (
            let c = 1;
            c <= Number(models.value.number_of_unit_per_group);
            c++
          ) {
            models.value.nomenclatures?.push({
              id: index,
              index_number: index,
              nomenclature: `Mz ${letter} - Casa ${c}`,
              area: models.value.property_area_m2 ?? 0,
              value: models.value.property_value ?? 0,
              status_id: 83,
            })
            index++
          }
        }
      }
    }

    return true
  }

  // tables props
  const tableProps = ref({
    loading: false,
    columns: [
      {
        name: 'index_number',
        field: 'index_number',
        required: false,
        label: '#',
        align: 'center',
        sortable: true,
      },
      {
        name: 'nomenclature',
        field: 'nomenclature',
        required: false,
        label: 'Nomenclatura',
        align: 'center',
        sortable: true,
      },
      {
        name: 'area',
        field: 'area',
        required: false,
        label: 'Área',
        align: 'center',
        sortable: true,
      },
      {
        name: 'value',
        field: 'value',
        required: false,
        label: 'Valor',
        align: 'center',
        sortable: true,
      },
      {
        name: 'status_id',
        field: 'status_id',
        required: false,
        label: 'Estado',
        align: 'center',
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
    rows: [] as INomenclatureRealStateProject[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  // computed properties
  const isTower = computed(() => {
    return models.value.development_type === 2
  })

  const isSsmlv = computed(() => {
    return Number(models.value.property_value_calculation) === 2
  })

  const isNumber = computed(() => {
    return models.value.block_nomenclature === 'Númerico'
  })

  const isLyrics = computed(() => {
    return models.value.block_nomenclature === 'Letras'
  })

  const houseDepartmentProps = computed(() => {
    return {
      number_of_groups: isTower.value ? 'N° de torres' : 'N° de manzanas',
      block_nomenclature: isTower.value
        ? 'Número de pisos por torre'
        : 'Nomenclatura de manzanas',
      number_of_unit_per_group: isTower.value
        ? 'Apartamentos por piso'
        : 'Casas por manzanas',
      initial_group: isTower.value ? 'Torre inicial' : 'Manzana inicial',
      final_group: isTower.value ? 'Torre final' : 'Manzana final',
      total_units_stage: isTower.value
        ? 'Total apartamento de etapa'
        : 'Total casas de etapa',
    }
  })

  // methods
  const handlerActionForm = (action: ActionType) => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setModelValue,
      edit: _setModelValue,
      view: _setModelValue,
    }
    actionHandlers[action]?.()
  }

  const _setModelValue = () => {
    clearForm()
    const data = props.data
    if (data) {
      models.value = {
        ...data,
        property_value: data.property_value ?? null,
      }
      nextTick(() => {
        propertyValue.value = data.property_value ?? null
      })
      const docsMap = new Map(
        models.value.documents?.map((doc) => [doc.name, doc])
      )

      dataUpload.value = dataUpload.value.map((element) => {
        const doc = docsMap.get(element.title)
        if (doc) {
          return { ...element, file: doc.file }
        }
        return element
      })
    }
  }

  const clearForm = async () => {
    models.value.id = undefined
    models.value.stage_number = undefined
    models.value.address = null
    models.value.land_area = null
    models.value.builder_id = null
    models.value.technical_supervision_id = null
    models.value.property_registration = null
    models.value.start_date = null
    models.value.start_end = null
    models.value.total_value = null
    models.value.financed_value = null
    models.value.associated_financing = null
    models.value.observations = null
    models.value.development_type = null
    models.value.block_nomenclature = null
    models.value.number_of_groups = null
    models.value.initial_group = null
    models.value.final_group = null
    models.value.total_units_stage = null
    models.value.property_area_m2 = null
    models.value.property_value_calculation = null
    models.value.property_value = null
    models.value.department_id = null
    models.value.number_of_unit_per_group = null
    models.value.city_id = null
    models.value.policies_id = null
    models.value.guarantee_id = null
    models.value.financing_bank_id = null
    models.value.business_trust_project_id = null
    models.value.business_trust_id = null
    models.value.nomenclatures = []
    models.value.documents = []
  }

  // documents upload
  const dataUpload = ref<
    {
      position: number
      class: string
      title: string
      subtitle: string
      required: boolean
      file: File | null
      id: number | null | string
    }[]
  >([
    {
      position: 0,
      class: 'mt-1',
      title: 'Licencias de Construcción',
      subtitle: '',
      required: false,
      file: null,
      id: null,
    },
    {
      position: 1,
      class: 'mt-1',
      title: 'Permiso de Enajenación',
      subtitle: '',
      required: false,
      file: null,
      id: null,
    },
    {
      position: 2,
      class: 'mt-1',
      title: 'Crédito Constructor',
      subtitle: '',
      required: false,
      file: null,
      id: null,
    },
  ])

  const handleFileChange = async (file: File | null, name: string) => {
    if (file) {
      const existingFileIndex = dataUpload.value.findIndex(
        (doc) => doc.title === name
      )

      if (existingFileIndex !== -1) {
        dataUpload.value[existingFileIndex].file = file
      }
    }
  }

  onMounted(async () => {
    handlerActionForm(props.action)
  })
  const propertyValue = ref()

  watch(
    () => props.data,
    (val) => {
      if (val) {
        handlerActionForm(props.action)
        propertyValue.value = val.property_value ?? null
      }
    },
    { immediate: true, deep: true }
  )

  watch(
    () => models.value.department_id,
    (val) => {
      if (val) {
        const keys_filter = {
          assets: [`cities&filter[department_id]=${val}`],
        }
        _getResources(keys_filter)
      }
    },
    { immediate: true, deep: true }
  )

  watch(
    () => isSsmlv.value,
    () => {
      models.value.amount_smmlv = null
      models.value.year_base_smmlv = null
      models.value.estimated_smmlv = null
      models.value.property_value = null
    },
    { immediate: true, deep: true }
  )

  watch(
    () => models.value,
    () => {
      if (
        models.value.initial_group &&
        models.value.final_group &&
        models.value.number_of_groups &&
        models.value.block_nomenclature &&
        models.value.number_of_unit_per_group
      ) {
        const groups =
          Number(models.value.final_group) -
          Number(models.value.initial_group) +
          1

        if (isTower.value) {
          // Cálculo actual
          models.value.total_units_stage =
            groups *
            Number(models.value.block_nomenclature) *
            Number(models.value.number_of_unit_per_group)
        } else {
          // Caso casas
          if (isNumber.value) {
            models.value.total_units_stage =
              groups * Number(models.value.number_of_unit_per_group)
          }
          if (isLyrics.value) {
            models.value.total_units_stage =
              Number(models.value.number_of_groups) *
              Number(models.value.number_of_unit_per_group)
          }
        }
      }
    },
    { deep: true }
  )

  watch(
    () => [models.value.initial_group, models.value.number_of_groups],
    ([initial, groups]) => {
      if (initial && groups) {
        if (isNumber.value || isTower.value) {
          models.value.final_group = `${Number(initial) + Number(groups) - 1}`
        } else {
          models.value.initial_group = `${initial}`.toLowerCase()
          const startCode = (initial as string).toLowerCase().charCodeAt(0)
          const endCode = startCode + Number(groups) - 1
          models.value.final_group = String.fromCharCode(endCode)
        }
      }
    },
    { deep: true }
  )

  watch(
    () => models.value.nomenclatures,
    (val) => {
      if (val) {
        tableProps.value.rows = [...(models.value.nomenclatures ?? [])]
      }
    },
    { deep: true }
  )

  watch(
    () => dataUpload.value,
    () => {
      models.value.documents = dataUpload.value
        .filter((item) => !!item.file)
        .map((item) => ({
          file: item.file as File,
          name: item.title,
          required: item.required,
          id: item.id ?? null,
          type: item.file?.type,
        }))
    },
    { deep: true }
  )

  watch(
    () => [models.value.amount_smmlv, models.value.estimated_smmlv],
    ([amount, estimated]) => {
      if (!isCreate.value && !isEditing.value) return

      const smmlvAmount = parseFloat(amount ?? '') || 0
      const smmlvEstimated = parseFloat(estimated ?? '') || 0
      propertyValue.value = smmlvAmount * smmlvEstimated
      models.value.property_value = propertyValue.value
    },
    { immediate: true, deep: true }
  )

  watch(
    () => models.value.property_value_calculation,
    () => {
      tableProps.value.rows = []
    }
  )

  watch(
    () => propertyValue.value,
    (value) => {
      if (!value) {
        tableProps.value.rows = []
      }
    }
  )

  watch(
    () => models.value.development_type,
    (value) => {
      if (value !== null && value !== undefined) {
        models.value.number_of_groups = null
        models.value.block_nomenclature = null
        models.value.number_of_unit_per_group = null
        models.value.initial_group = null
        models.value.final_group = null
        models.value.total_units_stage = null
        models.value.property_area_m2 = null
        models.value.property_value_calculation = null
        models.value.property_value = null
        propertyValue.value = null
      }
    }
  )

  watch(
    () => models.value.block_nomenclature,
    () => {
      models.value.initial_group = null
      models.value.final_group = null
    }
  )

  const isDisabledNomenclatureAddBtn = computed(
    () =>
      !(
        models.value?.property_value != null &&
        models.value.property_value > 0 &&
        models.value.property_value_calculation != null
      )
  )
  const processedPerPage = ref(20)

  const setNumberOfPages = () => {
    const numberOfPages = [...(models.value.nomenclatures ?? [])].length
      ? Math.ceil(
          [...(models.value.nomenclatures ?? [])].length /
            processedPerPage.value
        )
      : 1

    tableProps.value.pages.currentPage = 1
    tableProps.value.pages.lastPage = numberOfPages
  }

  const updateProcessedPage = (page: number) => {
    tableProps.value.pages.currentPage = page
    tableProps.value.rows = [...(models.value.nomenclatures ?? [])].slice(
      (page - 1) * processedPerPage.value,
      page * processedPerPage.value
    )
  }

  const updateProcessedPerPage = (newPerPage: number) => {
    processedPerPage.value = newPerPage
    setNumberOfPages()
    tableProps.value.rows = [...(models.value.nomenclatures ?? [])].slice(
      0,
      newPerPage
    )
  }

  watch(
    () => [...(models.value.nomenclatures ?? [])],
    () => {
      setNumberOfPages()

      tableProps.value.rows = [...(models.value.nomenclatures ?? [])].slice(
        (tableProps.value.pages.currentPage - 1) * processedPerPage.value,
        tableProps.value.pages.currentPage * processedPerPage.value
      )
    }
  )

  watch(
    () => models.value.department_id,
    (val) => {
      if (val) {
        models.value.city_id = null
      }
    }
  )

  return {
    models,
    props,
    emit,
    business_trust_third_parties,
    characteristicsForm,
    tableProps,
    dataUpload,
    departments,
    cities,
    development_type,
    base_calculation_property,
    houseDepartmentProps,
    isTower,
    isSsmlv,
    associated_financing,
    business_trust_guarantee,
    business_trust_policy,
    banks,
    block_nomeclatures,
    isNumber,
    propertyValue,
    isDisabledNomenclatureAddBtn,
    isCreate,
    characteristicsFormisValid,
    handleFileChange,
    updateProcessedPage,
    updateProcessedPerPage,
  }
}

export default usePropertyFeaturesForm
