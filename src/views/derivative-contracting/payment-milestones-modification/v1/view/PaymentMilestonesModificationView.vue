<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="goToURL('PaymentMilestonesModificationList')"
    >
      <section class="q-mt-md">
        <!-- Tabs or Header for data -->
        <TabsComponent
          :tab-active="tabActive"
          :tabs="tabs"
          :tab-active-idx="tabActiveIdx"
        />

        <VCard>
          <template #content-card>
            <div class="q-pa-lg">
              <ContractInformationView
                v-if="tabActive === 'information'"
                :data="data_information_form"
              />
            </div>

            <section class="q-mt-md">
              <div class="row items-center justify-between q-mb-md q-px-lg">
                <p class="text-bold text-h6 q-mb-none">
                  Nueva distribución de hito de pago
                </p>
              </div>
              <TableList
                :loading="tableProps.loading"
                :columns="tableProps.columns"
                :rows="tableProps.rows"
                :pages="tableProps.pages"
                :show-filter="false"
                :show-top-right-buttons="false"
              />

              <VCard class="q-mt-md q-mb-md">
                <template #content-card>
                  <div class="row items-center justify-end q-px-lg q-pa-md">
                    <div class="col-12 col-md-3 text-weight-bold text-primary">
                      Total programación
                    </div>
                    <div class="col-12 col-md-3 text-right">
                      <div class="text-caption text-grey">
                        Nuevo monto extranjero
                      </div>
                      {{ formatCurrencyString(totalProgramacion.foreign_amount) }}
                    </div>
                    <div class="col-12 col-md-3 text-right">
                      <div class="text-caption text-grey">Nuevo monto COP</div>
                      {{ formatCurrencyString(totalProgramacion.cop_amount) }}
                    </div>
                  </div>
                </template>
              </VCard>

              <div class="row justify-end q-gutter-md q-mt-lg q-px-lg">
                <Button
                  label="Orden de pago"
                  :outline="true"
                  color="orange"
                  class-custom="btn-filter custom"
                  @click="openPaymentOrderModal"
                />
                <Button
                  :outline="true"
                  label="Finalizar"
                  unelevated
                  color="orange"
                  class-custom="btn-filter custom text-white"
                  @click="goToURL('PaymentMilestonesModificationList')"
                />
              </div>

              <!-- Modals -->
              <AlertModalComponent
                ref="alertModalPaymentOrderRef"
                title="Orden de pago"
                :show-btn-confirm="false"
                :show-btn-cancel="false"
                :show-img-default="false"
                style-modal="max-width: 800px"
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
                    :milestone_id="Number(contractId)"
                    @submit="handleAddMilestone"
                    @cancel="closeModal"
                  />
                </template>
              </AlertModalComponent>
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
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

import PaymentOrderList from '@/components/Lists/DerivativeContracting/PaymentMilestonesModification/PaymentOrder/PaymentOrderList.vue'
import ContractInformationView from '@/components/Forms/DerivativeContracting/PaymentMilestonesModificationForm/ContractInformation/ContractInformationView.vue'

// Logic
import usePaymentMilestonesModificationView from '@/views/derivative-contracting/payment-milestones-modification/v1/view/PaymentMilestonesModificationView'

const {
  headerProps,
  data_information_form,
  tableProps,
  goToURL,
  totalProgramacion,
  formatCurrencyString,
  openPaymentOrderModal,
  alertModalPaymentOrderRef,
  paymentOrderListRef,
  contractSubscriptionDate,
  isLocalCurrency,
  contractValue,
  foreignValue,
  trm,
  currentTotalLocal,
  currentTotalForeign,
  nextMilestoneNumber,
  handleAddMilestone,
  closeModal,
  contractId,
  tabs,
  tabActive,
  tabActiveIdx,
} = usePaymentMilestonesModificationView()
</script>
