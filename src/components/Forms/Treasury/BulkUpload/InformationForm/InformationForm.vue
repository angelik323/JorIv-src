<template>
  <div class="row q-col-gutter-x-lg q-col-gutter-y-lg">
    <div class="col-12 col-md-3 text-black-90">
      <p class="text-weight-bold no-margin">Negocio</p>
      <p class="text-weight-medium no-margin">
        {{
          props.data.basic_data?.business?.code ||
          formData.basic_data?.business?.code ||
          '-'
        }}
      </p>
    </div>

    <div class="col-12 col-md-3 text-black-90">
      <p class="text-weight-bold no-margin">Nombre negocio</p>
      <p class="text-weight-medium no-margin">
        {{
          props.data.basic_data?.business?.name ||
          formData.basic_data?.business?.name ||
          '-'
        }}
      </p>
    </div>
    <template
      v-if="
        !props.data.basic_data?.origin && !props.data.basic_data?.destination
      "
    >
      <div class="col-12 col-md-3 text-black-90">
        <p class="text-weight-bold no-margin">Banco</p>
        <p class="text-weight-medium no-margin">
          {{
            props.data.basic_data?.bank?.code ||
            formData.basic_data?.bank?.code ||
            '-'
          }}
        </p>
      </div>

      <div class="col-12 col-md-3 text-black-90">
        <p class="text-weight-bold no-margin">Nombre banco</p>
        <p class="text-weight-medium no-margin">
          {{
            props.data.basic_data?.bank?.name ||
            formData.basic_data?.bank?.name ||
            '-'
          }}
        </p>
      </div>

      <div class="col-12 col-md-3 text-black-90">
        <p class="text-weight-bold no-margin">Cuenta bancaria</p>
        <p class="text-weight-medium no-margin">
          {{
            props.data.basic_data?.bank_account?.account_bank ||
            formData.basic_data?.bank_account?.account_bank ||
            '-'
          }}
        </p>
      </div>

      <div class="col-12 col-md-3 text-black-90">
        <p class="text-weight-bold no-margin">Nombre cuenta bancaria</p>
        <p class="text-weight-medium no-margin">
          {{
            props.data.basic_data?.bank_account?.account_name ||
            formData.basic_data?.bank_account?.account_name ||
            '-'
          }}
        </p>
      </div>

      <div class="col-12 col-md-3 text-black-90">
        <p class="text-weight-bold no-margin">Nit beneficiario</p>
        <p class="text-weight-medium no-margin">
          {{
            props.data.basic_data?.beneficiary?.nit ||
            formData.basic_data?.beneficiary?.nit ||
            '-'
          }}
        </p>
      </div>

      <div class="col-12 col-md-3 text-black-90">
        <p class="text-weight-bold no-margin">Nombre beneficiario</p>
        <p class="text-weight-medium no-margin">
          {{
            props.data.basic_data?.beneficiary?.name ||
            formData.basic_data?.beneficiary?.name ||
            '-'
          }}
        </p>
      </div>

      <div class="col-12 col-md-3 text-black-90">
        <p class="text-weight-bold no-margin">Tipo recaudo</p>
        <p class="text-weight-medium no-margin">
          {{
            props.data.basic_data?.type_receive?.name ||
            formData.basic_data?.type_receive?.name ||
            '-'
          }}
        </p>
      </div>

      <div class="col-12 col-md-9 text-black-90">
        <p class="text-weight-bold no-margin">Valor</p>
        <p class="text-weight-medium no-margin">
          {{
            props.data.basic_data?.value?.local_currency ||
            props.data.basic_data?.value?.foreign_currency ||
            formData.basic_data?.value?.local_currency ||
            formData.basic_data?.value?.foreign_currency ||
            '-'
          }}
        </p>
      </div>

      <div class="col-12 col-md-3 text-black-90">
        <p class="text-weight-bold no-margin">Fecha</p>
        <p class="text-weight-medium no-margin">
          {{ props.data.basic_data?.date || formData.basic_data?.date || '-' }}
        </p>
      </div>

      <div class="col-12 col-md-3 text-black-90">
        <p class="text-weight-bold no-margin">Fecha efectiva</p>
        <p class="text-weight-medium no-margin">
          {{
            props.data.basic_data?.effective_date ||
            formData.basic_data?.effective_date ||
            '-'
          }}
        </p>
      </div>

      <div class="col-12 col-md-6 text-black-90">
        <p class="text-weight-bold no-margin">Estado</p>
        <p class="text-weight-medium no-margin">
          {{
            props.data.basic_data?.status?.name ||
            formData.basic_data?.status?.name ||
            '-'
          }}
        </p>
      </div>

      <div class="col-12">
        <p class="text-weight-bold no-margin">Concepto</p>
        <p class="text-weight-medium no-margin">
          {{
            props.data.basic_data?.concept ||
            formData.basic_data?.concept ||
            '-'
          }}
        </p>
      </div>

      <div class="col-12 col-md-3 text-black-90">
        <p class="text-weight-bold no-margin">Flujo de caja</p>
        <p class="text-weight-medium no-margin">
          {{
            props.data.basic_data?.cash_flow?.name ||
            formData.basic_data?.cash_flow?.name ||
            '-'
          }}
        </p>
      </div>

      <div class="col-12 col-md-3 text-black-90">
        <p class="text-weight-bold no-margin">Código de movimiento</p>
        <p class="text-weight-medium no-margin">
          {{
            props.data.basic_data?.movement_code?.code ||
            formData.basic_data?.movement_code?.code ||
            '-'
          }}
        </p>
      </div>

      <div class="col-12 col-md-6 text-black-90">
        <p class="text-weight-bold no-margin">Descripción movimiento</p>
        <p class="text-weight-medium no-margin">
          {{
            props.data.basic_data?.movement_code?.name ||
            formData.basic_data?.movement_code?.name ||
            '-'
          }}
        </p>
      </div>

      <div class="col-12 col-md-6 text-black-90">
        <p class="text-weight-bold no-margin">Naturaleza</p>
        <p class="text-weight-medium no-margin">
          {{
            props.data.basic_data?.nature || formData.basic_data?.nature || '-'
          }}
        </p>
      </div>
    </template>

    <!-- ==================== ORIGIN ==================== -->
    <template v-if="props.data.basic_data?.origin">
      <div class="col-12">
        <h6
          class="col-12 text-black-90 text-weight-bold text-h6 q-mb-sm q-mt-sm"
        >
          Origen
        </h6>
      </div>

      <div class="col-12 col-md-3 text-black-90">
        <p class="text-weight-bold no-margin">Banco</p>
        <p class="text-weight-medium no-margin">
          {{ props.data.basic_data.origin.bank?.code || '-' }}
        </p>
      </div>

      <div class="col-12 col-md-3 text-black-90">
        <p class="text-weight-bold no-margin">Nombre banco</p>
        <p class="text-weight-medium no-margin">
          {{ props.data.basic_data.origin.bank?.name || '-' }}
        </p>
      </div>

      <div class="col-12 col-md-3 text-black-90">
        <p class="text-weight-bold no-margin">Cuenta bancaria</p>
        <p class="text-weight-medium no-margin">
          {{ props.data.basic_data.origin.bank_account?.account_number || '-' }}
        </p>
      </div>

      <div class="col-12 col-md-3 text-black-90">
        <p class="text-weight-bold no-margin">Nombre cuenta bancaria</p>
        <p class="text-weight-medium no-margin">
          {{ props.data.basic_data.origin.bank_account?.account_name || '-' }}
        </p>
      </div>

      <div class="col-12 col-md-3 text-black-90">
        <p class="text-weight-bold no-margin">Nit beneficiario</p>
        <p class="text-weight-medium no-margin">
          {{
            props.data.basic_data.origin.beneficiary?.identification_number ||
            '-'
          }}
        </p>
      </div>

      <div class="col-12 col-md-3 text-black-90">
        <p class="text-weight-bold no-margin">Nombre beneficiario</p>
        <p class="text-weight-medium no-margin">
          {{ props.data.basic_data.origin.beneficiary?.name || '-' }}
        </p>
      </div>

      <div class="col-12 col-md-3 text-black-90">
        <p class="text-weight-bold no-margin">Valor</p>
        <p class="text-weight-medium no-margin">
          {{ props.data.basic_data.origin.values?.value_formatted || '-' }}
        </p>
      </div>

      <div class="col-12 col-md-3 text-black-90">
        <p class="text-weight-bold no-margin">Naturaleza</p>
        <p class="text-weight-medium no-margin">
          {{ props.data.basic_data.origin.movement?.nature || '-' }}
        </p>
      </div>

      <div class="col-12 col-md-3 text-black-90">
        <p class="text-weight-bold no-margin">Código movimiento</p>
        <p class="text-weight-medium no-margin">
          {{ props.data.basic_data.origin.movement?.code || '-' }}
        </p>
      </div>

      <div class="col-12 col-md-3 text-black-90">
        <p class="text-weight-bold no-margin">Descripción movimiento</p>
        <p class="text-weight-medium no-margin">
          {{ props.data.basic_data.origin.movement?.description || '-' }}
        </p>
      </div>

      <div class="col-12 col-md-3 text-black-90">
        <p class="text-weight-bold no-margin">Concepto</p>
        <p class="text-weight-medium no-margin">
          {{
            props.data.basic_data?.concept ||
            formData.basic_data?.concept ||
            '-'
          }}
        </p>
      </div>

      <div class="col-12">
        <q-separator class="q-my-md" />
      </div>
    </template>

    <!-- ==================== DESTINATION ==================== -->
    <template v-if="props.data.basic_data?.destination">
      <div class="col-12">
        <h6
          class="col-12 text-black-90 text-weight-bold text-h6 q-mb-sm q-mt-sm"
        >
          Destino
        </h6>
      </div>

      <div class="col-12 col-md-3 text-black-90">
        <p class="text-weight-bold no-margin">Banco</p>
        <p class="text-weight-medium no-margin">
          {{ props.data.basic_data.destination.bank?.code || '-' }}
        </p>
      </div>

      <div class="col-12 col-md-3 text-black-90">
        <p class="text-weight-bold no-margin">Nombre banco</p>
        <p class="text-weight-medium no-margin">
          {{ props.data.basic_data.destination.bank?.name || '-' }}
        </p>
      </div>

      <div class="col-12 col-md-3 text-black-90">
        <p class="text-weight-bold no-margin">Cuenta bancaria</p>
        <p class="text-weight-medium no-margin">
          {{
            props.data.basic_data.destination.bank_account?.account_number ||
            '-'
          }}
        </p>
      </div>

      <div class="col-12 col-md-3 text-black-90">
        <p class="text-weight-bold no-margin">Nombre cuenta bancaria</p>
        <p class="text-weight-medium no-margin">
          {{
            props.data.basic_data.destination.bank_account?.account_name || '-'
          }}
        </p>
      </div>

      <div class="col-12 col-md-3 text-black-90">
        <p class="text-weight-bold no-margin">Nit beneficiario</p>
        <p class="text-weight-medium no-margin">
          {{
            props.data.basic_data.destination.beneficiary
              ?.identification_number || '-'
          }}
        </p>
      </div>

      <div class="col-12 col-md-3 text-black-90">
        <p class="text-weight-bold no-margin">Nombre beneficiario</p>
        <p class="text-weight-medium no-margin">
          {{ props.data.basic_data.destination.beneficiary?.name || '-' }}
        </p>
      </div>

      <div class="col-12 col-md-3 text-black-90">
        <p class="text-weight-bold no-margin">Valor</p>
        <p class="text-weight-medium no-margin">
          {{ props.data.basic_data.destination.values?.value_formatted || '-' }}
        </p>
      </div>

      <div class="col-12 col-md-3 text-black-90">
        <p class="text-weight-bold no-margin">Naturaleza</p>
        <p class="text-weight-medium no-margin">
          {{ props.data.basic_data.destination.movement?.nature || '-' }}
        </p>
      </div>

      <div class="col-12 col-md-3 text-black-90">
        <p class="text-weight-bold no-margin">Código movimiento</p>
        <p class="text-weight-medium no-margin">
          {{ props.data.basic_data.destination.movement?.code || '-' }}
        </p>
      </div>

      <div class="col-12 col-md-3 text-black-90">
        <p class="text-weight-bold no-margin">Descripción movimiento</p>
        <p class="text-weight-medium no-margin">
          {{ props.data.basic_data.destination.movement?.description || '-' }}
        </p>
      </div>

      <div class="col-12 col-md-3 text-black-90">
        <p class="text-weight-bold no-margin">Concepto</p>
        <p class="text-weight-medium no-margin">
          {{
            props.data.basic_data?.concept ||
            formData.basic_data?.concept ||
            '-'
          }}
        </p>
      </div>
    </template>

    <div class="col-12">
      <q-separator class="q-my-md" />
    </div>

    <p class="col-12 text-black-10 text-weight-bold text-h6">Contabilidad</p>

    <div class="col-12 col-md-3 text-black-90">
      <p class="text-weight-bold no-margin">Comprobante</p>
      <p class="text-weight-medium no-margin">
        {{
          props.data.accounting?.comprobante ||
          formData.accounting?.comprobante ||
          '-'
        }}
      </p>
    </div>

    <div class="col-12 col-md-3 text-black-90">
      <p class="text-weight-bold no-margin">Subcomprobante</p>
      <p class="text-weight-medium no-margin">
        {{
          props.data.accounting?.subcomprobante ||
          formData.accounting?.subcomprobante ||
          '-'
        }}
      </p>
    </div>

    <div class="col-12 col-md-6 text-black-90">
      <p class="text-weight-bold no-margin">Centro de costo</p>
      <p class="text-weight-medium no-margin">
        {{
          props.data.accounting?.cost_center?.name ||
          formData.accounting?.cost_center?.name ||
          '-'
        }}
      </p>
    </div>

    <div class="col-12">
      <q-separator class="q-my-md" />
    </div>

    <p class="col-12 text-black-10 text-weight-bold text-h6">Moneda</p>

    <div class="col-12 col-md-3 text-black-90">
      <p class="text-weight-bold no-margin">Valor moneda extranjera</p>
      <p class="text-weight-medium no-margin">
        {{
          props.data.currency?.foreign_currency_value?.amount ||
          formData.currency?.foreign_currency_value?.amount ||
          '-'
        }}
      </p>
    </div>

    <div class="col-12 col-md-3 text-black-90">
      <p class="text-weight-bold no-margin">TRM</p>
      <p class="text-weight-medium no-margin">
        {{
          props.data.currency?.trm?.value ||
          formData.currency?.trm?.value ||
          '-'
        }}
      </p>
    </div>

    <div class="col-12 col-md-6 text-black-90">
      <p class="text-weight-bold no-margin">Moneda</p>
      <p class="text-weight-medium no-margin">
        {{
          props.data.currency?.currency_type ||
          formData.currency?.currency_type ||
          '-'
        }}
      </p>
    </div>

    <div class="col-12">
      <q-separator class="q-my-md" />
    </div>

    <p class="col-12 text-black-10 text-weight-bold text-h6">Cheque</p>

    <div class="col-12 col-md-6 text-black-90">
      <p class="text-weight-bold no-margin">Cheque</p>
      <p class="text-weight-medium no-margin">
        {{ props.data.check?.number || formData.check?.number || '-' }}
      </p>
    </div>

    <div class="col-12 col-md-6 text-black-90">
      <p class="text-weight-bold no-margin">Banco cheque</p>
      <p class="text-weight-medium no-margin">
        {{ props.data.check?.bank?.name || formData.check?.bank?.name || '-' }}
      </p>
    </div>

    <div class="col-12">
      <q-separator class="q-my-md" />
    </div>

    <p class="col-12 text-black-10 text-weight-bold text-h6">Fondo</p>

    <div class="col-12 col-md-6 text-black-90">
      <p class="text-weight-bold no-margin">Fondo</p>
      <p class="text-weight-medium no-margin">
        {{
          props.data.fund?.code?.display_value ||
          formData.fund?.code?.display_value ||
          '-'
        }}
      </p>
    </div>

    <div class="col-12 col-md-6 text-black-90">
      <p class="text-weight-bold no-margin">Plan de inversión</p>
      <p class="text-weight-medium no-margin">
        {{
          props.data.fund?.investment_plan?.display_value ||
          formData.fund?.investment_plan?.display_value ||
          '-'
        }}
      </p>
    </div>

    <div class="col-12">
      <q-separator class="q-my-md" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { IBulkUploadHistory } from '@/interfaces/customs'

import useInformationForm from './InformationForm'

const props = defineProps<{
  data: IBulkUploadHistory
}>()

const { formData } = useInformationForm(props)
</script>
