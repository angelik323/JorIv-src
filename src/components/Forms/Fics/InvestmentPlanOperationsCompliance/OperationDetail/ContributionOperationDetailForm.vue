<template>
  <div>
    <q-form ref="operationDetailForm">
      <section>
        <VCard class="q-px-lg" style="margin-bottom: 0">
          <template #content-card>
            <section class="detail-table q-pb-lg">
              <TableList
                :loading="false"
                :columns="tableProps.columns"
                :rows="tableProps.rows"
                :hide-pagination="true"
                :hide-header="!tableProps.rows.length"
                :custom-columns="['radio']"
              >
                <template #radio="{ row }">
                  <RadioYesNo
                    v-model="row.selected"
                    :options="[{ label: '', value: true }]"
                    @update:model-value="selectDetail(row)"
                  />
                </template>

                <template v-if="tableProps.rows.length" #custom-bottom-row>
                  <q-tr>
                    <q-td colspan="4" style="height: 1.75rem" align="right">
                      <strong class="text-primary_fiduciaria"
                        >Total operación</strong
                      >
                    </q-td>
                    <q-td colspan="5" style="height: 1.75rem">
                      <span>{{
                        `${useUtils().formatCurrencyString(totalValue)}`
                      }}</span>
                    </q-td>
                  </q-tr>
                </template>
              </TableList>
            </section>
            <section v-if="selectedRow?.id">
              <div class="row q-col-gutter-x-lg q-col-gutter-y-sm items-start">
                <div class="col-12 col-md-4 col-lg-3">
                  <GenericSelectorComponent
                    label="Banco de recaudo"
                    :manual_option="banks"
                    :required="false"
                    map_options
                    :default_value="selectedRow.treasury_collection_bank_id"
                    auto_complete
                    clearable
                    disabled
                    :placeholder="'Seleccione'"
                    :rules="[]"
                    @update:modelValue="selectBank($event)"
                  />
                </div>
                <div class="col-12 col-md-4 col-lg-3">
                  <GenericInputComponent
                    label="Descripción banco"
                    placeholder="-"
                    disabled
                    :default_value="
                      selectedRow.treasury_collection_bank_description
                    "
                    :rules="[]"
                  />
                </div>
                <div class="col-12 col-md-4 col-lg-3">
                  <GenericSelectorComponent
                    label="Cuenta de recaudo"
                    :manual_option="bank_account"
                    map_options
                    :required="false"
                    :default_value="selectedRow.fic_account_bank_id"
                    auto_complete
                    clearable
                    disabled
                    :placeholder="'Seleccione'"
                    :rules="[]"
                    @update:modelValue="selectBankAccount($event)"
                  />
                </div>
                <div class="col-12 col-md-4 col-lg-3">
                  <GenericInputComponent
                    label="Descripción cuenta de recaudo"
                    placeholder="-"
                    disabled
                    :default_value="selectedRow.fic_account_bank_description"
                    :rules="[]"
                  />
                </div>
                <div class="col-12">
                  <GenericInputComponent
                    label="Observaciones"
                    type="textarea"
                    placeholder="Inserte"
                    disabled
                    :default_value="selectedRow.observations"
                    :rules="[]"
                    @update:modelValue="selectedRow.observation = $event"
                  />
                </div>
              </div>
            </section>
          </template>
        </VCard>
      </section>
    </q-form>
  </div>
</template>
<script setup lang="ts">
// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import TableList from '@/components/table-list/TableList.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Interfaces
import { IInvestmentPlanOperationResponseDetailItem } from '@/interfaces/customs/fics/InvestmentPlanOperationCompliance'

// Composables
import { useUtils } from '@/composables'

// logic view
import useContributionOperationDetailForm from '@/components/Forms/Fics/InvestmentPlanOperationsCompliance/OperationDetail/ContributionOperationDetailForm'

defineExpose({
  validateForm: () => validateInvestmentPlanOperation(),
  getFormData: () => getFormData(),
})

const props = withDefaults(
  defineProps<{
    data?: IInvestmentPlanOperationResponseDetailItem[]
  }>(),
  {}
)

const {
  tableProps,
  selectedRow,
  operationDetailForm,
  banks,
  bank_account,
  totalValue,
  getFormData,
  selectDetail,
  selectBank,
  selectBankAccount,
  validateInvestmentPlanOperation,
} = useContributionOperationDetailForm(props)
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
