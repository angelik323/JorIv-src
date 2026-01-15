<template>
  <div>
    <q-form ref="openingRecordForm" class="q-pa-lg">
      <section>
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
          <!-- Período inicial -->
          <div class="col-12 col-md-4">
            <GenericDateInput
              label="Período actual (Período inicial)"
              ref="periodRef"
              placeholder="-"
              mask="YYYY-MM"
              :default_value="models.initial_period"
              required
              :rules="[
                (val: string) =>
                  useRules().is_required(val, 'El período es requerido'),
              ]"
              @update:model-value="models.initial_period = $event"
            />
          </div>

          <!-- Estructura contable -->
          <div class="col-12 col-md-4">
            <GenericSelectorComponent
              label="Estructura contable"
              :manual_option="accounting_account_structures || []"
              :map_options="true"
              required
              :auto_complete="true"
              :clearable="false"
              :disabled="isEdit || readonly"
              :rules="
                readonly
                  ? []
                  : [
                      (val: string) =>
                        useRules().is_required(val, 'La estructura es requerida'),
                    ]
              "
              :default_value="models.accounting_structure_id"
              @update:model-value="models.accounting_structure_id = $event"
            />
          </div>

          <!-- Desde negocio -->
          <div class="col-12 col-md-4">
            <GenericSelectorComponent
              label="Desde negocio"
              :manual_option="business_trusts_for_period_opening || []"
              :map_options="true"
              required
              :auto_complete="true"
              :clearable="false"
              :disabled="isEdit"
              display_value="business_code"
              :rules="[
                (val: string) =>
                  useRules().is_required(val, 'El campo Desde negocio es requerido'),
              ]"
              :default_value="models.from_business"
              @update:model-value="models.from_business = $event"
            />
          </div>

          <!-- Hasta negocio -->
          <div class="col-12 col-md-4">
            <GenericSelectorComponent
              label="Hasta negocio"
              :manual_option="business_trusts_for_period_opening || []"
              :map_options="true"
              required
              :auto_complete="true"
              :clearable="false"
              :disabled="isEdit"
              display_value="business_code"
              :rules="[
                (val: string) =>
                  useRules().is_required(val, 'El campo Hasta negocio es requerido'),
              ]"
              :default_value="models.to_business"
              @update:model-value="models.to_business = $event"
            />
          </div>

          <!-- Período final -->
          <div class="col-12 col-md-4">
            <GenericDateInput
              label="Nuevo período (Período final)"
              ref="currentRef"
              placeholder="-"
              mask="YYYY-MM"
              required
              :default_value="models.final_period"
              :key="models.final_period"
              disabled
              :rules="[]"
            />
          </div>
        </div>
      </section>

      <!-- Buttons Buscar / Limpiar -->
      <div v-if="action === 'create'" class="flex justify-end q-gutter-md mt-2">
        <Button
          label="Limpiar"
          size="md"
          unelevated
          :outline="true"
          color="orange"
          class-custom="custom"
          :left-icon="defaultIconsLucide.reload"
          @click="handleResetForm"
        />

        <Button
          label="Buscar"
          size="md"
          unelevated
          :outline="false"
          color-icon="white"
          color="orange"
          class-custom="custom"
          :left-icon="defaultIconsLucide.search"
          @click="handleSearch"
        />
      </div>

      <!-- Table section -->
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

        <!-- Modal -->
        <AlertModalComponent
          ref="processModalRef"
          :show-img-default="false"
          :show-btn-cancel="false"
          :show-btn-confirm="false"
          style-modal="width: 38%; min-width: 380px; max-width: 500px;"
          title-header="Generar apertura de período"
        >
          <template #default-body>
            <div class="q-pa-md">
              <p class="text-body2 text-grey-7 q-mb-md">
                Por favor digite el motivo de apertura para generar el proceso.
              </p>

              <q-input
                v-model="openingReason"
                type="textarea"
                autogrow
                outlined
                label="Motivo de apertura *"
                :rules="[
                  (val: string) =>
                    useRules().is_required(
                      val,
                      'El motivo de apertura es requerido'
                    ),
                ]"
              />
            </div>
          </template>

          <template #custom-actions>
            <div class="row justify-end q-gutter-sm q-pa-md">
              <Button
                label="Cancelar"
                :outline="true"
                color="orange"
                class-custom="custom"
                @click="closeProcessModal"
              />
              <Button
                label="Aceptar"
                :outline="false"
                color="orange"
                class-custom="custom"
                :disable="!openingReason || isProcessing"
                :loading="isProcessing"
                @click="confirmProcess"
              />
            </div>
          </template>
        </AlertModalComponent>

        <div class="flex justify-end q-gutter-md mt-2">
          <Button
            label="Procesar"
            size="md"
            unelevated
            :outline="false"
            color="orange"
            class-custom="custom"
            :disable="!canProcess"
            @click="openProcessModal"
          />
        </div>
      </section>
    </q-form>
  </div>
</template>

<script setup lang="ts">
// Components
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'
import GenericDateInput from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// Forms
import useOpeningRecordForm from '@/components/Forms/Accounting/OpeningRecord/Information/OpeningRecordForm'

// Interfaces
import { ActionType } from '@/interfaces/global'
import type {
  IOpeningRecordModel,
  IOpeningRecordProcessReportData,
} from '@/interfaces/customs/accounting/OpeningRecord'

// Composables
import { useRules } from '@/composables'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IOpeningRecordModel
    readonly?: boolean
  }>(),
  {
    readonly: false,
  }
)

const emits = defineEmits<{
  (event: 'update'): void
  (event: 'hasSelectedBusiness', value: boolean): void
  (event: 'processCompleted', value: IOpeningRecordProcessReportData): void
}>()

const {
  openingRecordForm,
  models,
  tableProps,
  isEdit,
  selectedRows,
  showTable,
  handleSearch,
  handleResetForm,
  accounting_account_structures,
  business_trusts_for_period_opening,
  defaultIconsLucide,
  openingReason,
  isProcessing,
  processModalRef,
  canProcess,
  openProcessModal,
  closeProcessModal,
  confirmProcess,
} = useOpeningRecordForm(props, emits)

defineExpose({
  getFormData: () => models.value,
  validate: async () => {
    return await openingRecordForm.value?.validate?.()
  },
})
</script>
