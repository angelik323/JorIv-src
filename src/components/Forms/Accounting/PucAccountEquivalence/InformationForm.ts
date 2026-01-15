import { useResourceStore, usePucAccountEquivalenceStore } from '@/stores'
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

import { IPucAccountRow, IAccountEquivalenceData } from '@/interfaces/customs'

const useInformationForm = (props: {
  action: 'create' | 'edit'
  data?: IAccountEquivalenceData
}) => {
  const { puc_account_equivalences_by_type: radioOptions } = storeToRefs(
    useResourceStore('v1')
  )
  const { _listAction } = usePucAccountEquivalenceStore('v1')

  const informationFormRef = ref()

  const formData = ref({
    type_puc: '',
    source_code: '',
    source_name: '',
    equivalent_code: '',
    equivalent_name: '',
    fiscal_code: '',
    fiscal_name: '',
  })

  const customColumns = [
    'puc_type',
    'associate',
    'fiscal_equivalent_account',
    'fiscal_equivalent_structure',
  ]

  const tableProperties = ref({
    title: '',
    loading: false,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'source_estructure',
        required: true,
        label: 'Código de cuenta',
        align: 'left',
        field: 'source_estructure',
        sortable: true,
      },
      {
        name: 'source_account',
        required: true,
        label: 'Nombre de la cuenta',
        align: 'left',
        field: 'source_account',
        sortable: true,
      },
      {
        name: 'type',
        required: true,
        label: 'Tipo',
        align: 'left',
        field: 'type',
        sortable: true,
      },
      {
        name: 'puc_type',
        required: true,
        label: 'PUC',
        align: 'left',
        field: 'puc_type',
        sortable: true,
      },
      {
        name: 'associate',
        required: true,
        label: 'Asociar',
        align: 'left',
        field: 'associate',
        sortable: true,
      },
      {
        name: 'fiscal_equivalent_account',
        required: true,
        label: 'Código de cuenta',
        align: 'left',
        field: 'fiscal_equivalent_account',
        sortable: true,
      },
      {
        name: 'fiscal_equivalent_structure',
        required: true,
        label: 'Nombre de la cuenta',
        align: 'left',
        field: 'fiscal_equivalent_structure',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as IPucAccountRow[],
  })

  const loadDataTable = async () => {
    await _listAction('filter[source_structure_id]=41')
  }

  const loadData = () => {
    if (props.action === 'edit' && props.data) {
      loadDataTable()

      const data = props.data

      formData.value = {
        type_puc: 'equivalente-fiscal',
        source_code: data.structures?.source_structure?.formatted_display ?? '',
        source_name: data.structures?.source_structure?.name ?? '',
        equivalent_code:
          data.structures?.regular_equivalent_structure?.formatted_display ??
          '',
        equivalent_name:
          data.structures?.regular_equivalent_structure?.name ?? '',
        fiscal_code:
          data.structures?.fiscal_equivalent_structure?.formatted_display ?? '',
        fiscal_name: data.structures?.fiscal_equivalent_structure?.name ?? '',
      }
    }
  }

  onMounted(() => {
    loadData()
  })

  return {
    formData,
    radioOptions,
    customColumns,
    tableProperties,
    informationFormRef,
  }
}

export default useInformationForm
