<template>
  <q-form ref="formElementRef" class="q-pa-lg">
    <section>
      <div class="flex justify-between items-start q-mb-md q-mt-lg">
        <p class="text-weight-bold text-h6">
          {{ unidentifiedContributionsTableProps.title }}
        </p>
      </div>

      <VCard>
        <template #content-card>
          <div class="q-pa-lg">
            <TableList
              :loading="unidentifiedContributionsTableProps.loading"
              :columns="unidentifiedContributionsTableProps.columns"
              :rows="unidentifiedContributionsTableProps.rows"
              :pages="unidentifiedContributionsTableProps.pages"
              selection="single"
              ref="unidentifiedContributionsTableRef"
              @selected="handleSelectUnidentifiedContribution($event.selected)"
            />
          </div>
        </template>
      </VCard>

      <NoDataState
        v-if="!selectedUnidentifiedContribution"
        type="empty"
        title="Selecciona un aporte sin identificar"
        subtitle="Aquí visualizará los planes de inversión destino del aporte seleccionado"
      />

      <div v-else>
        <div class="flex justify-between items-start q-mb-md">
          <p class="text-weight-bold text-h6">
            {{ investmentPlanDestinationsTableProps.title }}
          </p>

          <Button
            v-if="!isView"
            no-caps
            unelevated
            label="Agregar"
            :leftIcon="defaultIconsLucide.plusCircleOutline"
            :color-icon="'white'"
            :text-color="'white'"
            :outline="false"
            :color="'primary'"
            :tooltip="'Agregar'"
            @click="handleAddInvestmentPlanDestinationRow"
          />
        </div>

        <VCard>
          <template #content-card>
            <div class="q-pa-lg amounts-table">
              <TableList
                :loading="investmentPlanDestinationsTableProps.loading"
                :columns="investmentPlanDestinationsTableProps.columns"
                :rows="investmentPlanDestinationsTableProps.rows"
                :custom-columns="[
                  'collective_investment_fund_id',
                  'fiduciary_investment_plan_id',
                  'value',
                  'actions',
                ]"
                custom-no-data-message-title="Añade un plan de inversión destino"
                custom-no-data-message-subtitle="Aquí visualizará los planes de inversión destino del aporte seleccionado"
                hide-pagination
              >
                <template #collective_investment_fund_id="{ row }">
                  <GenericSelectorComponent
                    :manual_option="funts_to_investment_plans"
                    :default_value="row.collective_investment_fund_id"
                    :rules="[(val: string) => is_required(val)]"
                    map_options
                    required
                    :disabled="true"
                    auto_complete
                    clearable
                    @update:model-value="
                      handleCollectiveInvestmentFundIdChange(row.id, $event)
                    "
                  />
                </template>

                <template #fiduciary_investment_plan_id="{ row }">
                  <GenericSelectorComponent
                    :manual_option="row.fiduciary_investment_plan_options"
                    :default_value="row.fiduciary_investment_plan_id"
                    :rules="[(val: string) => is_required(val)]"
                    map_options
                    required
                    auto_complete
                    clearable
                    @update:model-value="
                      (val) => {
                        row.fiduciary_investment_plan_id = val
                        handleSelectFiduciaryInvestmentPlanIdChange(row.id, val)
                      }
                    "
                  />
                </template>

                <template #value="{ row }">
                  <CurrencyInput
                    required
                    :model-value="row.value"
                    placeholder="Inserte"
                    @update:model-value="row.value = $event"
                  />
                </template>

                <template #actions="{ row }">
                  <Button
                    :left-icon="defaultIconsLucide.delete"
                    color="orange"
                    :outline="false"
                    :flat="true"
                    colorIcon="#f45100"
                    tooltip="Legalizar"
                    @click="handleRemoveInvestmentPlanDestinationRow(row.id)"
                  />
                </template>

                <template #custom-bottom-row>
                  <q-tr>
                    <q-td
                      :colspan="
                        investmentPlanDestinationsTableProps.columns?.length
                      "
                    >
                      <div class="row justify-center items-center q-gutter-sm">
                        <strong class="text-primary_fiduciaria"
                          >Total operación:
                        </strong>
                        <span>{{ totalOperationCost }}</span>
                      </div>
                    </q-td>
                  </q-tr>
                </template>
              </TableList>
            </div>
          </template>
        </VCard>
      </div>
    </section>
  </q-form>
</template>

<script setup lang="ts">
// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Interfaces
import { ActionType } from '@/interfaces/global'
import { IPages } from '@/interfaces/customs'
import {
  IGenericInvestmentPlansLegalizeResponse,
  IGenericInvestmentPlansLegalizeContribution,
} from '@/interfaces/customs/fics/GenericInvestmentPlans'

// Logic view
import useLegalizationResourcesForm from '@/components/Forms/Fics/GenericInvestmentPlans/LegalizationResources/LegalizationResourcesForm'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: {
      genericInvestmentPlan: IGenericInvestmentPlansLegalizeResponse | null
      unidentifiedContributions: {
        data: IGenericInvestmentPlansLegalizeContribution[]
        loading: boolean
        pages: IPages
      }
    }
  }>(),
  {}
)

const {
  isView,
  is_required,
  formElementRef,
  defaultIconsLucide,
  totalOperationCost,
  handleGetFormValues,
  funts_to_investment_plans,
  handleValidateTotalOperationCost,
  selectedUnidentifiedContribution,
  unidentifiedContributionsTableRef,
  unidentifiedContributionsTableProps,
  handleSelectUnidentifiedContribution,
  investmentPlanDestinationsTableProps,
  handleAddInvestmentPlanDestinationRow,
  handleCollectiveInvestmentFundIdChange,
  handleRemoveInvestmentPlanDestinationRow,
  handleSelectFiduciaryInvestmentPlanIdChange,
} = useLegalizationResourcesForm(props)

defineExpose({
  validateOperationCost: () => handleValidateTotalOperationCost(),
  validateForm: async () => formElementRef.value?.validate(),
  getFormValues: () => handleGetFormValues(),
})
</script>

<style lang="scss" src="./LegalizationResourcesForm.scss" scoped></style>
