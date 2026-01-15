<template>
  <div class="q-mx-xl">
      <section class="q-mt-md">
        <p class="text-h6 text-left text-weight-bold q-mt-md">
          Presupuesto a asignar
        </p>

        <VCard>
          <template #content-card>
            <div class="q-pa-lg">
              <InformationFormAllocatedBudget
                v-if="tabActive === 'information'"
                :data="data_information_form"
                ref="informationFormRef"
                action="view"
                @update:data="data_information_form = $event"
              />
            </div>

            <section class="q-mt-md">
              <TableList
                :loading="tableProps.loading"
                :columns="tableProps.columns"
                :rows="tableProps.rows"
                :pages="tableProps.pages"
                :custom-columns="['actions', 'assigned_amount']"
                @update-page="updatePage"
                @update-rows-per-page="updatePerPage"
              >
                <template #custom-header>
                  <div class="q-pa-md">
                    <div class="text-h6 text-weight-bold q-mb-md">
                      Nueva distribución presupuestal
                    </div>
                    <div class="row items-end q-gutter-x-md">
                      <div class="col-12 col-md-4">
                        <GenericSelector
                          label="Documento presupuestal"
                          placeholder="Documento presupuestal"
                          :manual_option="budgetDocumentOptions"
                          :default_value="selectedBudgetDocument"
                          :required="false"
                          :rules="[]"
                          @update:model-value="selectedBudgetDocument = $event"
                        />
                      </div>
                      <div class="col-auto">
                        <Button
                          :outline="false"
                          label="Agregar hito"
                          :left-icon="defaultIconsLucide.plusCircle"
                          class-custom="bg-new-primary text-white btn-filter custom"
                          @click="openNewMilestoneModal"
                        />
                      </div>
                    </div>
                  </div>
                </template>

                <template #assigned_amount="{ row }">
                  <div class="row justify-center">
                    <GenericInput
                      v-model="row.assigned_amount"
                      :default_value="row.assigned_amount"
                      dense
                      outlined
                      required
                      type="number"
                      :rules="[
                        (val: string) => useRules().is_required(val, 'Requerido'),
                        (val: string) => useRules().max_integer_decimal(val, 12, 2),
                        (val: number) =>
                          useRules().max_value_field(
                            val,
                            Number(row.futureValidity?.projected_value || 0),
                            'el valor asignado inicialmente al registro presupuestal'
                          ),
                      ]"
                    />
                  </div>
                </template>

                <template #actions="{ row }">
                  <Button
                    :left-icon="defaultIconsLucide.trash"
                    color="negative"
                    :class-custom="'custom'"
                    :outline="false"
                    :flat="true"
                    colorIcon="#f45100"
                    :tooltip="'Eliminar'"
                    @click="openAlertModalDeleteMilestone(row.id)"
                  />
                </template>
              </TableList>


              <AlertModalComponent
                ref="alertModalNewMilestoneRef"
                title="Hitos de pago"
                :show-btn-confirm="false"
                :show-btn-cancel="false"
                :show-img-default="false"
                style-modal="max-width: 800px"
              >
                <template #default-body>
                  <NewMilestoneForm
                    ref="milestoneFormRef"
                    :contract-subscription-date="contractSubscriptionDate"
                    :is-local-currency="isLocalCurrency"
                    :contract-value="contractValue"
                    :foreign-value="foreignValue"
                    :trm="trm"
                    :current-total-local="currentTotalLocal"
                    :current-total-foreign="currentTotalForeign"
                    :milestone-number="nextMilestoneNumber"
                    @submit="closeModal"
                    @cancel="closeModal"
                  />
                </template>
              </AlertModalComponent>

              <AlertModalComponent
                ref="alertModalFutureTermsRef"
                :show-btn-confirm="false"
                :show-btn-cancel="false"
                :show-img-default="false"
                style-modal="max-width: 900px"
                @confirm="changeStatusAction"
              >
                <template #default-body>
                  <FutureTermsList
                    ref="futureTermsFormRef"
                    :contract-subscription-date="contractSubscriptionDate"
                    :is-local-currency="isLocalCurrency"
                    :contract-value="contractValue"
                    :foreign-value="foreignValue"
                    :trm="trm"
                    :current-total-local="currentTotalLocal"
                    :current-total-foreign="currentTotalForeign"
                    :milestone-number="nextMilestoneNumber"
                    :milestones_id="selectedMilestoneId"
                    @submit="closeModal"
                    @cancel="closeModal"
                  />
                </template>
              </AlertModalComponent>



              <AlertModalComponent
                ref="alertModalDeleteRef"
                :title="alertModalConfig.title"
                @confirm="deleteAction"
              >
              </AlertModalComponent>

              <AlertModalComponent
                ref="alertModalStatusRef"
                :title="alertModalConfig.title"
                @confirm="changeStatusAction"
              >
              </AlertModalComponent>
            </section>

            <section class="mx-2 mb-2">
              <div class="row justify-end q-gutter-md">
                <Button
                  label="Actualizar"
                  size="md"
                  unelevated
                  :outline="false"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="onSubmit"
                />
              </div>
            </section>
          </template>
        </VCard>
      </section>
  </div>
</template>

<script setup lang="ts">
// Components
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'
import InformationFormAllocatedBudget from '@/components/Forms/DerivativeContracting/PaymentMilestonesModificationForm/AllocatedBudget/InformationFormAllocatedBudget/InformationFormAllocatedBudget.vue'
import NewMilestoneForm from '@/components/Forms/DerivativeContracting/PaymentMilestonesModificationForm/NewMilestone/NewMilestoneForm.vue'
import FutureTermsList from '@/components/Lists/DerivativeContracting/PaymentMilestonesModification/FutureTerms/FutureTermsList.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelector from '@/components/common/GenericSelector/GenericSelectorComponent.vue'

// Composables
import { useRules } from '@/composables'

//logic
import useAllocatedBudget from '@/components/Forms/DerivativeContracting/PaymentMilestonesModificationForm/AllocatedBudget/AllocatedBudget'
import { IAllocatedBudgetProps } from '@/interfaces/customs/derivative-contracting/PaymentMilestonesModification'

const props = defineProps<IAllocatedBudgetProps>()

const emits = defineEmits(['submit', 'cancel'])

const {
  tabActive,
  onSubmit,
  data_information_form,

  tableProps,
  updatePage,
  updatePerPage,
  defaultIconsLucide,
  openAlertModalDeleteMilestone,

  alertModalConfig,
  deleteAction,
  changeStatusAction,
  openNewMilestoneModal,
  closeModal,

  alertModalNewMilestoneRef,
  contractSubscriptionDate,
  isLocalCurrency,
  contractValue,
  foreignValue,
  trm,
  currentTotalLocal,
  currentTotalForeign,
  nextMilestoneNumber,
  milestoneFormRef,
  selectedMilestoneId,
  selectedBudgetDocument,
  budgetDocumentOptions,
} = useAllocatedBudget(props, emits)
</script>
