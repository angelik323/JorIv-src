import {
  IRetentionForm,
  IRetentionsList,
} from '@/interfaces/global/ThirdParties'
import { useResourcesStore, useThirdPartiesStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { nextTick, onMounted, ref, watch } from 'vue'

export const useRetentionsForm = (props: any, emit: Function) => {
  const { _setRetentions } = useThirdPartiesStore()
  const { getResources } = useResourcesStore()
  const { retentions: storeRetentions, thirdPartiesData } = storeToRefs(
    useThirdPartiesStore()
  )
  const { retentions: retentionsResource, retentions_types } = storeToRefs(
    useResourcesStore()
  )

  const opsRetentions = ref([...retentionsResource.value])
  const listRetentions = ref<IRetentionsList[]>([])
  const findRetention = ref()
  const initialValues = {
    name: null as string | null,
    account: null as string | null,
    type: null as string | null,
    percentage: null as string | null,
    retentions: [] as number[],
  }
  const formValues = ref<IRetentionForm>({ ...initialValues })

  const tableProperties = ref({
    title: 'Listado de retenciones',
    loading: false,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'name',
        required: false,
        label: 'Nombre',
        align: 'left',
        field: 'name',
        sortable: true,
        style: {
          'max-width': '200px',
          'min-width': '100px',
          'word-wrap': 'break-word',
          'white-space': 'break-spaces',
        },
      },
      {
        name: 'code',
        required: false,
        label: 'Código',
        align: 'left',
        field: (row) => `${row.code}`,
        sortable: true,
        style: {
          'max-width': '140px',
          'min-width': '100px',
          'word-wrap': 'break-word',
          'white-space': 'break-spaces',
        },
      },
      {
        name: 'account_chart',
        required: false,
        label: 'Cuenta',
        align: 'left',
        field: (row) => `${row.account_chart.name}`,
        sortable: true,
        style: {
          'max-width': '140px',
          'min-width': '100px',
          'word-wrap': 'break-word',
          'white-space': 'break-spaces',
        },
      },
      {
        name: 'third_party',
        required: false,
        label: 'Tercero',
        align: 'left',
        field: (row) => `${row?.third_party?.name ?? ''}`,
        sortable: true,
        style: {
          'max-width': '140px',
          'min-width': '100px',
          'word-wrap': 'break-word',
          'white-space': 'break-spaces',
        },
      },
      {
        name: 'type',
        required: false,
        label: 'Tipo',
        align: 'left',
        field: 'type',
        sortable: true,
        style: {
          'max-width': '140px',
          'min-width': '100px',
          'word-wrap': 'break-word',
          'white-space': 'break-spaces',
        },
      },
      {
        name: 'percentage',
        required: false,
        label: 'Porcentaje',
        align: 'left',
        field: (row) => `${row?.percentage}%`,
        sortable: true,
        style: {
          'max-width': '140px',
          'min-width': '100px',
          'word-wrap': 'break-word',
          'white-space': 'break-spaces',
        },
      },
      {
        name: 'status',
        required: false,
        label: 'Estado',
        align: 'left',
        field: (row) => `${row.status_id}`,
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
    rows: listRetentions.value,
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const submit = async () => {
    await nextTick()
    emit('onContinue', 'Retentions')
  }

  const setRetentions = () => {
    const retentionsFilter = opsRetentions.value.filter((it) => {
      const storeIncludes =
        Array.isArray(storeRetentions.value) &&
        storeRetentions.value.includes(Number(it.value))

      const thirdPartyIncludes =
        Array.isArray(thirdPartiesData.value?.retentions) &&
        thirdPartiesData.value.retentions.some(
          (retention) => Number(retention.id) === Number(it.value)
        )

      return storeIncludes || thirdPartyIncludes
    })

    // Agregar cada elemento de retentionsFilter a listRetentions
    retentionsFilter.forEach((retention) => {
      const formatType =
        retentions_types.value.find((it) => it.value === retention.type)
          ?.label || ''
      listRetentions.value.push({
        ...retention,
        id: retention.value,
        name:
          props.formType !== 'update'
            ? `${retention.name} ${retention.code}`
            : `${retention.label}`,
        type: formatType,
      })
      // Filtrar opsRetentions.value para cada elemento encontrado en retentionsFilter
      opsRetentions.value = opsRetentions.value.filter(
        (it) => it.value !== retention.value
      )
    })
  }

  const getRetention = (e: string) => {
    formValues.value.name = e
    findRetention.value =
      retentionsResource.value.find((retention: any) => {
        return retention.value === formValues.value.name
      }) || []
    formValues.value.account = findRetention.value.account_chart.name
    formValues.value.type = findRetention.value.type
    formValues.value.percentage = findRetention.value.percentage
  }

  const addRetention = () => {
    if (findRetention.value) {
      const formatType =
        retentions_types.value.find(
          (it) => it.value === findRetention.value.type
        )?.label || ''
      listRetentions.value.push({
        ...findRetention.value,
        id: findRetention.value.value,
        name: findRetention.value.label,
        type: formatType,
      })

      opsRetentions.value = opsRetentions.value.filter(
        (it) => it.value !== findRetention.value.value
      )

      formValues.value = { ...initialValues }
      findRetention.value = null
    }
  }

  const deleteRetention = (id: number) => {
    const itemToDeleteIndex = listRetentions.value.findIndex(
      (it) => it.id === id
    )
    if (itemToDeleteIndex !== -1) {
      listRetentions.value.splice(itemToDeleteIndex, 1)

      const originalItem = retentionsResource.value.find(
        (it) => it.value === id
      )

      if (originalItem) {
        opsRetentions.value.push(originalItem)
      }
    }
  }

  watch(
    listRetentions,
    (newList) => {
      formValues.value.retentions = newList.map((it) => it.id)

      _setRetentions(formValues.value.retentions)
    },
    { deep: true }
  )

  watch(thirdPartiesData, () => {
    if (props.formType === 'update') {
      setRetentions()
    }
  })

  onMounted(async () => {
    await getResources(`keys[]=retentions`)
    if (props.formType === 'create') {
      if (storeRetentions.value && !listRetentions.value.length) {
        setRetentions()
      }
    }
    if (props.formType === 'update') {
      setRetentions()
    }
  })

  return {
    formValues,
    opsRetentions,
    retentions_types,
    tableProperties,

    getRetention,
    addRetention,
    deleteRetention,
    submit,
  }
}
