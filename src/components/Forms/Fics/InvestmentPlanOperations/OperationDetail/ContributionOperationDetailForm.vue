<template>
  <div>
    <q-form ref="operationDetailForm">
      <section>
        <div class="row justify-between items-center q-pb-lg">
          <p class="mb-0 text-black-10 text-weight-bold text-h6">
            Detalle operación de aportes
          </p>
          <div>
            <Button
              :outline="false"
              :label="'Agregar'"
              :color-icon="'white'"
              :left-icon="useUtils().defaultIconsLucide.plusCircleOutline"
              :class-custom="'btn-header full-width'"
              :styleContent="{ 'place-items': 'center', color: 'white' }"
              @click="addDetail"
            />
          </div>
        </div>
        <VCard class="q-px-lg" style="margin-bottom: 0">
          <template #content-card>
            <section class="detail-table q-pb-lg">
              <TableList
                :loading="false"
                :columns="tableProps.columns"
                :rows="tableProps.rows"
                :hide-pagination="true"
                :hide-header="!tableProps.rows.length"
                :custom-columns="[
                  'radio',
                  'collection_type',
                  'description',
                  'value',
                  'check',
                  'check_bank_id',
                  'actions',
                ]"
              >
                <template #radio="{ row }">
                  <RadioYesNo
                    v-model="row.selected"
                    :options="[{ label: '', value: true }]"
                    @update:model-value="selectDetail(row)"
                  />
                </template>
                <template #collection_type="{ row }">
                  <GenericSelectorComponent
                    :manual_option="type_receive"
                    map_options
                    required
                    :default_value="''"
                    auto_complete
                    clearable
                    :placeholder="'Seleccione'"
                    :rules="[(val: string) => useRules().is_required(val, '')]"
                    @update:modelValue="selectCollectionType(row, $event)"
                  />
                </template>
                <template #description="{ row }">
                  <GenericInputComponent
                    placeholder="-"
                    required
                    disabled
                    :default_value="row.collection_type_description"
                    :rules="[]"
                  />
                </template>
                <template #value="{ row }">
                  <CurrencyInput
                    v-model="row.value"
                    :currency="'COP'"
                    :placeholder="''"
                    :rules="[
                      (val: string) => useRules().is_required(val, ''),
                      (val: string) =>
                        useRules().only_number_greater_than_zero_with_decimal(
                          val
                        ),
                    ]"
                  />
                </template>
                <template #check="{ row }">
                  <GenericInputComponent
                    placeholder="-"
                    required
                    :disabled="!row.is_check"
                    :default_value="row.check"
                    :rules="[
                      (val: string) => useRules().is_required(val, ''),
                      (val: string) => useRules().max_length(val, 20),
                    ]"
                    @update:modelValue="row.check = $event"
                  />
                </template>
                <template #check_bank_id="{ row }">
                  <GenericSelectorComponent
                    :manual_option="banks"
                    map_options
                    required
                    :disabled="!row.is_check"
                    :default_value="''"
                    auto_complete
                    clearable
                    :placeholder="'Seleccione'"
                    :rules="[(val: string) => useRules().is_required(val, '')]"
                    @update:modelValue="row.check_bank_id = $event"
                  />
                </template>
                <template #actions="{ row }">
                  <Button
                    :left-icon="useUtils().defaultIconsLucide.trash"
                    color="orange"
                    :class-custom="'custom'"
                    :outline="false"
                    :flat="true"
                    colorIcon="#f45100"
                    tooltip="Eliminar"
                    @click="openDeleteModal(row)"
                  />
                </template>
                <template v-if="tableProps.rows.length" #custom-bottom-row>
                  <q-tr>
                    <q-td colspan="9" style="height: 1.75rem">
                      <section class="row justify-center q-gutter-md">
                        <div class="row q-gutter-sm">
                          <strong class="text-primary_fiduciaria"
                            >Valor aporte</strong
                          >
                          <span>{{
                            useUtils().formatCurrency(props.contributionValue)
                          }}</span>
                        </div>
                        <div class="row q-gutter-sm">
                          <strong class="text-primary_fiduciaria"
                            >Total operación</strong
                          >
                          <span>{{
                            useUtils().formatCurrency(totalValue)
                          }}</span>
                        </div>
                      </section>
                    </q-td>
                  </q-tr>
                </template>
              </TableList>
            </section>

            <section v-if="selectedRow?.id">
              <div class="row q-col-gutter-x-lg q-col-gutter-y-sm items-end">
                <div class="col-12 col-md-3">
                  <GenericSelectorComponent
                    label="Banco de recaudo"
                    :manual_option="banks"
                    map_options
                    required
                    :default_value="models.treasury_collection_bank_id"
                    auto_complete
                    clearable
                    :placeholder="'Seleccione'"
                    :rules="[
                      (val: string) =>
                        useRules().is_required(
                          val,
                          'El banco de recaudo es requerido'
                        ),
                    ]"
                    @update:modelValue="selectBank($event)"
                  />
                </div>
                <div class="col-12 col-md-3">
                  <GenericInputComponent
                    label="Descripción banco"
                    placeholder="-"
                    required
                    disabled
                    :default_value="models.treasury_collection_bank_description"
                    :rules="[]"
                  />
                </div>
                <div class="col-12 col-md-3">
                  <GenericSelectorComponent
                    label="Cuenta de recaudo"
                    :manual_option="flatBankAccounts"
                    map_options
                    required
                    :default_value="models.account_bank_id"
                    auto_complete
                    clearable
                    :placeholder="'Seleccione'"
                    :rules="[
                      (val: string) =>
                        useRules().is_required(
                          val,
                          'El banco de recaudo es requerido'
                        ),
                    ]"
                    @update:modelValue="selectBankAccount($event)"
                  />
                </div>
                <div class="col-12 col-md-3">
                  <GenericInputComponent
                    label="Descripción cuenta de recaudo"
                    placeholder="-"
                    required
                    disabled
                    :default_value="models.account_bank_description"
                    :rules="[]"
                  />
                </div>
                <div class="col-12">
                  <GenericInputComponent
                    label="Observaciones"
                    type="textarea"
                    placeholder="Inserte"
                    required
                    :default_value="models.observations"
                    :rules="[
                      (val: string) =>
                        useRules().is_required(
                          val,
                          'La observación es requerida'
                        ),
                    ]"
                    @update:modelValue="models.observations = $event"
                  />
                </div>
              </div>
            </section>
          </template>
        </VCard>

        <AlertModalComponent
          ref="deleteModalRef"
          styleModal="min-width: 400px"
          :title="`¿Está seguro que desea eliminar el aporte?`"
          @confirm="removeDetail"
        />
      </section>
    </q-form>
  </div>
</template>
<script setup lang="ts">
// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Composables
import { useRules, useUtils } from '@/composables'

// Logic view
import useContributionOperationDetailForm from '@/components/Forms/Fics/InvestmentPlanOperations/OperationDetail/ContributionOperationDetailForm'

const props = withDefaults(
  defineProps<{
    contributionValue?: number
    fundId: number | null
  }>(),
  {
    contributionValue: 0,
  }
)

const {
  banks,
  models,
  addDetail,
  selectBank,
  tableProps,
  totalValue,
  getFormData,
  selectedRow,
  type_receive,
  removeDetail,
  selectDetail,
  flatBankAccounts,
  openDeleteModal,
  selectBankAccount,
  operationDetailForm,
  selectCollectionType,
} = useContributionOperationDetailForm(props)

defineExpose({
  validateForm: () => operationDetailForm.value?.validate(),
  getFormData: () => getFormData(),
  models,
})
</script>
<style lang="scss" scoped>
:deep(.detail-table) {
  .q-field {
    padding-bottom: 0 !important;
  }
  .q-select .q-field__native {
    min-height: unset;
  }
}
</style>
