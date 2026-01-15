import {
  IBalancePointDocumentRow,
  IBalancePointStageMandateList,
} from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'
import { useBalancePointStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { ref, watch } from 'vue'

const useSummaryBalancePointForm = (_props: { action: ActionType }) => {
  const {
    data_balance_point_basic_data_form,
    data_balance_point_mandate_form,
    balance_point_response,
    characteristic_document_details,
  } = storeToRefs(useBalancePointStore('v1'))

  // Computed para formatear las características
  const formattedCharacteristics = ref<string[]>([])

  const formatCharacteristics = () => {
    if (balance_point_response.value?.characteristic_document) {
      // Si estamos en modo view/edit, usar los datos de balance_point_response
      formattedCharacteristics.value =
        balance_point_response.value.characteristic_document.map(
          (char) =>
            `- ${char.characteristic_code} - ${char.characteristic_type}: ${char.information_detail}`
        )
    } else if (
      data_balance_point_basic_data_form.value?.characteristics &&
      characteristic_document_details.value.length > 0
    ) {
      formattedCharacteristics.value =
        data_balance_point_basic_data_form.value.characteristics
          .filter((char) => char.information_detail?.trim())
          .map((char) => {
            // Encontrar el detalle correspondiente en characteristic_document_details
            const detail = characteristic_document_details.value.find(
              (detail) => detail.id === char.characteristic_document_detail_id
            )

            if (detail) {
              const code =
                detail.business_trust_document_structure.characteristic_code
              const description =
                detail.business_trust_document_structure.description
              return `Característica ${code} - ${description}: ${char.information_detail}`
            } else {
              return `Característica: ${char.information_detail}`
            }
          })
    } else {
      formattedCharacteristics.value = []
    }
  }

  const tableStageMandateSummaryProperties = ref({
    title: 'Listado de encargos de la etapa',
    loading: false,
    columns: [
      {
        name: 'number_mandate',
        required: true,
        label: 'Número de encargo',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'fund_name',
        required: true,
        label: 'Fondo de inversión',
        align: 'left',
        field: 'fund_name',
        sortable: true,
      },
      {
        name: 'total_investment_balance',
        required: true,
        label: 'Saldo total de plan de inversión',
        align: 'left',
        field: 'total_investment_balance',
        sortable: true,
      },
      {
        name: 'yields',
        required: true,
        label: 'Rendimientos',
        align: 'left',
        field: 'yields',
        sortable: true,
      },
      {
        name: 'net_with_tax',
        required: true,
        label: 'Neto con impuesto',
        align: 'left',
        field: 'net_with_tax',
        sortable: true,
      },
      {
        name: 'net_without_tax',
        required: true,
        label: 'Neto sin impuesto',
        align: 'left',
        field: 'net_without_tax',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as IBalancePointStageMandateList[],
    wrapCells: true,
  })

  const tableDocumentsSummaryProperties = ref({
    title: 'Documentos anexos',
    loading: false,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'center',
        field: 'id',
        sortable: true,
      },
      {
        name: 'name',
        required: true,
        label: 'Nombre',
        align: 'left',
        field: 'name',
        sortable: true,
      },
      {
        name: 'upload_date',
        required: true,
        label: 'Fecha de carga',
        align: 'left',
        field: 'upload_date',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as IBalancePointDocumentRow[],
    wrapCells: true,
  })

  watch(
    () => data_balance_point_mandate_form.value,
    () => {
      tableStageMandateSummaryProperties.value.rows =
        data_balance_point_mandate_form.value?.mandates || []
    }
  )

  watch(
    () => data_balance_point_basic_data_form.value,
    () => {
      tableDocumentsSummaryProperties.value.rows =
        data_balance_point_basic_data_form.value?.documents || []
      formatCharacteristics()
    }
  )

  watch(
    () => balance_point_response.value,
    () => {
      formatCharacteristics()
    }
  )

  watch(
    () => characteristic_document_details.value,
    () => {
      formatCharacteristics()
    }
  )

  // Inicializar las características al montar el componente
  formatCharacteristics()

  return {
    tableStageMandateSummaryProperties,
    tableDocumentsSummaryProperties,
    data_balance_point_mandate_form,
    formattedCharacteristics,
  }
}

export default useSummaryBalancePointForm
