<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="handleBack"
    >
      <section class="q-mt-md">
        <TabsComponent
          :tab-active="tabActive"
          :tabs="tabs"
          :tab-active-idx="tabActiveIdx"
        />

        <VCard>
          <template #content-card>
            <div class="q-pa-lg">
              <InformationForm
                v-if="tabActive === 'information'"
                :data="data_information_form"
                ref="informationFormRef"
                action="view"
                @update:data="data_information_form = $event"
              />
            </div>

            <section class="q-mt-md">
              <TableList
                :title="'Nueva distribución de hito de pago'"
                :loading="tableProps.loading"
                :columns="tableProps.columns"
                :rows="tableProps.rows"
                :pages="tableProps.pages"
                :custom-columns="['actions', 'applies_budget']"
                @update-page="updatePage"
                @update-rows-per-page="updatePerPage"
              >
                <template #custom-header-action>
                  <Button
                    :outline="false"
                    label="Agregar"
                    :left-icon="defaultIconsLucide.plusCircle"
                    class-custom="bg-new-primary text-white btn-filter custom"
                    @click="openNewMilestoneModal"
                  />
                </template>

                <template #applies_budget="{ row }">
                  <RadioYesNo
                    :model-value="row.applies_budget == 1"
                    :isRadioButton="false"
                    :isDisabled="true"
                    :customClass="'flex justify-center'"
                  />
                </template>

                <template #actions="{ row }">
                  <template v-if="row.applies_budget">
                    <Button
                      :left-icon="defaultIconsLucide.bankNote"
                      color="orange"
                      :class-custom="'custom'"
                      :outline="false"
                      :flat="true"
                      colorIcon="#f45100"
                      :tooltip="'Asociar presupuesto'"
                      @click="openAllocatedBudgetModal(row.milestone_number)"
                    />
                    <Button
                      :left-icon="defaultIconsLucide.calendar"
                      color="orange"
                      class-custom="custom"
                      :outline="false"
                      flat
                      colorIcon="#f45100"
                      :tooltip="'Vigencias futuras'"
                      @click="openFutureTermsModal(row.milestone_number)"
                    />
                  </template>
                  <Button
                    :left-icon="defaultIconsLucide.trash"
                    color="negative"
                    :class-custom="'custom'"
                    :outline="false"
                    :flat="true"
                    colorIcon="#f45100"
                    :tooltip="'Eliminar'"
                    @click="deleteMilestone(row.id)"
                  />
                </template>
              </TableList>

              <VCard class="q-mt-md q-mb-md">
                <template #content-card>
                  <div class="row items-center justify-end q-px-lg q-pa-md">
                    <div class="col-12 col-md-3 text-weight-bold text-primary">
                      Total programación
                    </div>
                    <div class="col-12 col-md-2 text-right">
                      <div class="text-caption text-grey">Monto extranjero</div>
                      {{
                        formatCurrencyString(totalProgramacion.foreign_amount)
                      }}
                    </div>
                    <div class="col-12 col-md-2 text-right">
                      <div class="text-caption text-grey">Monto local</div>
                      {{ formatCurrencyString(totalProgramacion.cop_amount) }}
                    </div>
                    <div class="col-12 col-md-2 text-right">
                      <div class="text-caption text-grey">
                        Pendiente extranjero
                      </div>
                      {{
                        formatCurrencyString(totalProgramacion.pending_foreign)
                      }}
                    </div>
                    <div class="col-12 col-md-2 text-right">
                      <div class="text-caption text-grey">Pendiente local</div>
                      {{
                        formatCurrencyString(totalProgramacion.pending_local)
                      }}
                    </div>
                  </div>
                </template>
              </VCard>

              <div class="row justify-start q-gutter-md q-mt-lg q-px-lg">
                <Button
                  label="Orden de pago"
                  outline
                  color="orange"
                  class-custom="btn-filter custom"
                  @click="openPaymentOrderModal"
                />
                <Button
                  label="Documento presupuestal"
                  outline
                  color="orange"
                  class-custom="btn-filter custom"
                  @click="openBudgetDocumentModal"
                />
              </div>

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
                    @submit="handleAddMilestone"
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
                    @submit="handleAddMilestone"
                    @cancel="closeModal"
                  />
                </template>
              </AlertModalComponent>

              <AlertModalComponent
                ref="alertModalAllocatedBudgetRef"
                :show-btn-confirm="false"
                :show-btn-cancel="false"
                :show-img-default="false"
                style-modal="max-width: 1200px"
                @confirm="changeStatusAction"
              >
                <template #default-body>
                  <AllocatedBudget
                    ref="allocatedBudgetFormRef"
                    :contract-subscription-date="contractSubscriptionDate"
                    :is-local-currency="isLocalCurrency"
                    :contract-value="contractValue"
                    :foreign-value="foreignValue"
                    :trm="trm"
                    :current-total-local="currentTotalLocal"
                    :current-total-foreign="currentTotalForeign"
                    :milestone-number="nextMilestoneNumber"
                    :milestones_id="selectedMilestoneId"
                    @submit="handleAddMilestone"
                    @cancel="closeModal"
                  />
                </template>
              </AlertModalComponent>

              <AlertModalComponent
                ref="alertModalStatusRef"
                :title="alertModalConfig.title"
                @confirm="changeStatusAction"
              >
              </AlertModalComponent>

              <AlertModalComponent
                ref="alertModalPaymentOrderRef"
                title="Orden de pago"
                :show-btn-confirm="false"
                :show-btn-cancel="false"
                :show-img-default="false"
                style-modal="max-width: 800px"
                @confirm="changeStatusAction"
              >
                <template #default-body>
                  <PaymentOrderList
                    ref="paymentOrderListRef"
                    :contract-subscription-date="contractSubscriptionDate"
                    :is-local-currency="isLocalCurrency"
                    :contract-value="contractValue"
                    :foreign-value="foreignValue"
                    :trm="trm"
                    :current-total-local="currentTotalLocal"
                    :current-total-foreign="currentTotalForeign"
                    :milestone-number="nextMilestoneNumber"
                    @submit="handleAddMilestone"
                    @cancel="closeModal"
                  />
                </template>
              </AlertModalComponent>

              <AlertModalComponent
                ref="alertModalBudgetDocumentRef"
                title="Documento presupuestal"
                :show-btn-confirm="false"
                :show-btn-cancel="false"
                :show-img-default="false"
                style-modal="max-width: 900px"
              >
                <template #default-body>
                  <BudgetDocumentList
                    ref="budgetDocumentListRef"
                    :contract-subscription-date="contractSubscriptionDate"
                    :is-local-currency="isLocalCurrency"
                    :contract-value="contractValue"
                    :foreign-value="foreignValue"
                    :trm="trm"
                    :current-total-local="currentTotalLocal"
                    :current-total-foreign="currentTotalForeign"
                    :milestone-number="nextMilestoneNumber"
                    :milestone_id="Number(contractId)"
                    @submit="handleAddMilestone"
                    @cancel="closeModal"
                  />
                </template>
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
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'
import InformationForm from '@/components/Forms/DerivativeContracting/PaymentMilestonesModificationForm/InformationForm.vue'
import NewMilestoneForm from '@/components/Forms/DerivativeContracting/PaymentMilestonesModificationForm/NewMilestone/NewMilestoneForm.vue'
import PaymentOrderList from '@/components/Lists/DerivativeContracting/PaymentMilestonesModification/PaymentOrder/PaymentOrderList.vue'
import BudgetDocumentList from '@/components/Lists/DerivativeContracting/PaymentMilestonesModification/BudgetDocument/BudgetDocumentList.vue'
import FutureTermsList from '@/components/Lists/DerivativeContracting/PaymentMilestonesModification/FutureTerms/FutureTermsList.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import AllocatedBudget from '@/components/Forms/DerivativeContracting/PaymentMilestonesModificationForm/AllocatedBudget/AllocatedBudget.vue'

//logic
import usePaymentMilestonesModificationEdit from '@/views/derivative-contracting/payment-milestones-modification/v1/edit/PaymentMilestonesModificationEdit'

const {
  headerProps,
  tabActive,
  tabActiveIdx,
  tabs,
  onSubmit,
  data_information_form,

  tableProps,
  updatePage,
  updatePerPage,
  defaultIconsLucide,

  alertModalConfig,
  changeStatusAction,
  totalProgramacion,
  openNewMilestoneModal,
  openFutureTermsModal,
  openAllocatedBudgetModal,
  closeModal,

  handleAddMilestone,
  alertModalNewMilestoneRef,
  contractSubscriptionDate,
  isLocalCurrency,
  contractValue,
  foreignValue,
  trm,
  currentTotalLocal,
  currentTotalForeign,
  nextMilestoneNumber,
  formatCurrencyString,
  milestoneFormRef,
  alertModalPaymentOrderRef,
  paymentOrderListRef,
  alertModalBudgetDocumentRef,
  budgetDocumentListRef,
  openPaymentOrderModal,
  openBudgetDocumentModal,
  alertModalFutureTermsRef,
  alertModalAllocatedBudgetRef,
  futureTermsFormRef,
  selectedMilestoneId,
  contractId,
  deleteMilestone,
  handleBack,
} = usePaymentMilestonesModificationEdit()
</script>
