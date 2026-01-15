<template>
  <div>
    <q-form ref="openingRecordForm" class="q-pa-lg">
      <section>
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
          <div class="col-12 col-md-4">
            <GenericSelectorComponent
              label="Estructura contable"
              :manual_option="opening_record_structures || []"
              :map_options="true"
              required
              :auto_complete="true"
              :clearable="false"
              :disabled="isEdit || readonly"
              :rules="readonly ? [] : [(val: string) => !!val || 'La estructura es requerida']"
              :default_value="models.structure_id"
              @update:modelValue="models.structure_id = $event"
            />
          </div>

          <div class="col-12 col-md-4">
            <GenericSelectorComponent
              label="Desde negocio"
              :manual_option="not_consolidator_business_trust || []"
              :map_options="true"
              required
              :auto_complete="true"
              :clearable="false"
              :disabled="isEdit"
              display_value="business_code"
              :rules="[(v: string) => !!v || 'El campo desde negocio es requerido']"
              :default_value="models.from_business_id"
              @update:modelValue="models.from_business_id = $event"
            />
          </div>

          <div class="col-12 col-md-4">
            <GenericDateInput
              label="Período actual"
              ref="periodRef"
              placeholder="-"
              required
              mask="YYYY-MM"
              :default_value="models.current_period"
              :rules="[(val: string) => useRules().is_required(val, 'El periodo es requerido')]"
              disabled
              @update:modelValue="models.current_period = $event"
            />
          </div>

          <div class="col-12 col-md-4">
            <GenericSelectorComponent
              label="Hasta negocio"
              :manual_option="not_consolidator_business_trust || []"
              :map_options="true"
              required
              :auto_complete="true"
              :clearable="false"
              :disabled="isEdit"
              display_value="business_code"
              :rules="[(v: string) => !!v || 'El campo hasta negocio es requerido']"
              :default_value="models.to_business_id"
              @update:modelValue="models.to_business_id = $event"
            />
          </div>

          <div class="col-12 col-md-4">
            <GenericDateInput
              label="Dejar en periodo"
              ref="currentRef"
              placeholder="-"
              mask="YYYY-MM"
              :rules="[]"
              :error="true"
              :hint="leavePeriodWarning"
              :hideHint="!leavePeriodWarning"
              :default_value="models.leave_in_period"
              @update:modelValue="models.leave_in_period = $event"
            />
          </div>
        </div>
      </section>

      <div class="row justify-end q-mt-md">
        <Button
          :outline="false"
          label="Continuar"
          size="md"
          unelevated
          color="orange"
          class="text-capitalize btn-filter custom"
          @click="handleContinue"
          :styleContent="{
            'place-items': 'center',
            'border-radius': '20px',
            'font-size': '13px',
          }"
        />
      </div>

      <section v-if="showTable" class="q-pt-lg catalog-limit-table">
        <TableList
          v-model:selected="selectedRows"
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows || []"
          :pages="tableProps.pages"
          selection="multiple"
        />
      </section>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/common/Button/Button.vue'

import TableList from '@/components/table-list/TableList.vue'
import useOpeningRecordForm from '@/components/Forms/Accounting/OpeningRecord/OpeningRecordForm'
import type { IOpeningRecordModel } from '@/interfaces/customs'
import { useRules } from '@/composables'
import GenericDateInput from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'

const props = withDefaults(
  defineProps<{
    action: 'create' | 'edit' | 'view'
    data?: IOpeningRecordModel
    readonly?: boolean
  }>(),
  {
    readonly: false,
  }
)

const emits = defineEmits<{
  (event: 'update'): void
}>()

defineExpose({
  getFormData: () => models.value,
  validate: async () => {
    return await openingRecordForm.value?.validate?.()
  },
})

const {
  openingRecordForm,
  not_consolidator_business_trust,
  opening_record_structures,
  models,
  tableProps,
  isEdit,
  selectedRows,
  showTable,
  handleContinue,
  leavePeriodWarning,
} = useOpeningRecordForm(props, emits)
</script>

<style lang="scss" scoped>
:deep(.catalog-limit-table) {
  .q-field {
    padding-bottom: 0 !important;
  }
  .q-select .q-field__native {
    min-height: unset;
  }
}
</style>
