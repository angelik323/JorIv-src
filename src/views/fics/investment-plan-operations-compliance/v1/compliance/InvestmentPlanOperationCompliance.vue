<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="handleOpenExitOperationComplianceDetailModal"
    >
      <section class="q-my-md">
        <TabsComponent
          :tabs="filteredTabs"
          :tab-active="tabActive"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="tabActive = $event"
        />

        <div v-if="tabActive === 'basic_data'">
          <VCard class="q-pa-lg">
            <template #content-card>
              <BasicDataForm
                ref="investmentPlanOperationForm"
                :data="investment_plan_operation_response"
              />
              <q-separator class="q-mt-lg" />
              <div class="row justify-end q-gutter-md q-pt-lg">
                <Button
                  :outline="false"
                  :class-custom="'custom'"
                  label="Continuar"
                  size="md"
                  color="orange"
                  @click="nextTab"
                />
              </div>
            </template>
          </VCard>
        </div>
        <div v-if="tabActive === 'details'">
          <VCard class="q-pa-lg">
            <template #content-card>
              <ContributionOperationDetailForm
                v-if="operationType === 'aporte'"
                ref="investmentPlanOperationDetailForm"
                :data="investment_plan_operation_details_response"
              />
              <WithdrawalOperationDetailForm
                v-if="
                  operationType === 'retiro' || operationType === 'cancelacion'
                "
                ref="investmentPlanOperationDetailForm"
                :subtype="
                  operationType === 'retiro' ? 'parcial' : 'cancelacion'
                "
                :data="investment_plan_operation_details_response"
              />
              <div class="row justify-end q-gutter-md q-pt-lg">
                <Button
                  v-if="operationType !== 'cancelacion'"
                  :disabled="authorizationButtonsDisabled"
                  :outline="true"
                  label="Rechazar"
                  size="md"
                  :style-text="{ color: '#333', fontWeight: 'bold' }"
                  class="btn-filter custom"
                  color="orange"
                  @click="handleOpenRejectOperationComplianceDetailModal"
                />

                <Button
                  :outline="false"
                  :disabled="authorizationButtonsDisabled"
                  :class-custom="'btn-filter custom'"
                  label="Autorizar"
                  size="md"
                  color="orange"
                  @click="handleOpenAuthOperationComplianceDetailModal"
                />
              </div>
            </template>
          </VCard>

          <AlertModalComponent
            ref="authOperationComplianceDetailModalRef"
            title="¿Está seguro de autorizar esta solicitud? ¿Desea continuar?"
            @confirm="handleConfirmAuthOperationComplianceDetailModal"
          />

          <AlertModalComponent
            ref="rejectOperationComplianceDetailModalRef"
            title="¿Está seguro de rechazar esta solicitud? ¿Desea continuar?"
            @confirm="handleConfirmRejectOperationComplianceDetailModal"
          />
        </div>

        <AlertModalComponent
          ref="exitOperationComplianceDetailModalRef"
          title="¿Desea salir sin autorizar los cambios?"
          @confirm="handleConfirmExitOperationComplianceDetailModal"
        />
      </section>
    </ContentComponent>
  </div>
</template>
<script setup lang="ts">
// Components
import ContributionOperationDetailForm from '@/components/Forms/Fics/InvestmentPlanOperationsCompliance/OperationDetail/ContributionOperationDetailForm.vue'
import WithdrawalOperationDetailForm from '@/components/Forms/Fics/InvestmentPlanOperationsCompliance/OperationDetail/WithdrawalOperationDetailForm.vue'
import BasicDataForm from '@/components/Forms/Fics/InvestmentPlanOperationsCompliance/BasicData/BasicDataForm.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Logic view
import useCompliance from '@/views/fics/investment-plan-operations-compliance/v1/compliance/InvestmentPlanOperationCompliance'

const {
  nextTab,
  tabActive,
  headerProps,
  filteredTabs,
  tabActiveIdx,
  operationType,
  investmentPlanOperationForm,
  authorizationButtonsDisabled,
  investmentPlanOperationDetailForm,
  investment_plan_operation_response,
  exitOperationComplianceDetailModalRef,
  authOperationComplianceDetailModalRef,
  rejectOperationComplianceDetailModalRef,
  investment_plan_operation_details_response,
  handleOpenExitOperationComplianceDetailModal,
  handleOpenAuthOperationComplianceDetailModal,
  handleOpenRejectOperationComplianceDetailModal,
  handleConfirmExitOperationComplianceDetailModal,
  handleConfirmAuthOperationComplianceDetailModal,
  handleConfirmRejectOperationComplianceDetailModal,
} = useCompliance()
</script>
