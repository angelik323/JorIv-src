<template>
  <q-form ref="formElementRef">
    <section class="q-mt-md">
      <p class="text-black-10 text-weight-bold text-h6">Emisor</p>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create'].includes(action)"
            label="Emisor de factura"
            :default_value="models.transmitter"
            :manual_option="business_trusts"
            map_options
            auto_complete
            required
            :rules="[(val: string) => useRules().is_required(val,  'El emisor de factura es requerido')]"
            @update:model-value="models.transmitter = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Emisor de factura</p>
            <p class="text-weight-medium no-margin">
              {{ models.transmitter ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="q-mt-md">
      <p class="text-black-10 text-weight-bold text-h6">
        Datos básicos de facturación
      </p>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create'].includes(action)"
            label="Forma de pago"
            :default_value="models.method"
            :manual_option="pay_methods"
            map_options
            auto_complete
            required
            :rules="[(val: string) => useRules().is_required(val,  'La forma de pago es requerida')]"
            @update:model-value="models.method = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Forma de pago</p>
            <p class="text-weight-medium no-margin">
              {{ models.method ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create'].includes(action)"
            label="Días de pago"
            :default_value="models.payday"
            :manual_option="[]"
            map_options
            auto_complete
            required
            disabled
            :rules="[(val: string) => useRules().is_required(val,  'Los días de pago son requeridos')]"
            @update:model-value="models.payday = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Días de pago</p>
            <p class="text-weight-medium no-margin">
              {{ models.payday ?? 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="q-mt-xl">
      <TableList
        :title="tableProps.title"
        :loading="tableProps.loading"
        :columns="tableProps.columns"
        :rows="tableProps.rows"
        :pages="tableProps.pages"
        :custom-columns="['actions', 'status']"
        @update-page="updatePage"
        @update-rows-per-page="updatePerPage"
        v-model:selected="models.rows"
        selection="multiple"
      >
        <template #status="{ row }">
          <ShowStatus :type="row.status_id" status-type="billingPortfolio" />
        </template>
      </TableList>
    </section>
  </q-form>
</template>

<script setup lang="ts">
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import TableList from '@/components/table-list/TableList.vue'

import { ActionType } from '@/interfaces/global'
import { IInvoiceGenerationForm, IPages } from '@/interfaces/customs'
import { useRules } from '@/composables'
import { pay_methods } from '@/constants'

import useBasicDataForm from '@/components/Forms/BillingPortfolio/InvoiceGeneration/BasicDataForm'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import { QTableColumn } from 'quasar'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data: IInvoiceGenerationForm | null
    updatePage: (page: number) => void
    updatePerPage: (perPage: number) => void
    tableProps: {
      title: string
      loading: boolean
      columns: QTableColumn[]
      rows: IInvoiceGenerationForm[]
      pages: IPages
    }
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: IInvoiceGenerationForm | null): void
}>()

const { formElementRef, models, business_trusts } = useBasicDataForm(
  props,
  emits
)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
