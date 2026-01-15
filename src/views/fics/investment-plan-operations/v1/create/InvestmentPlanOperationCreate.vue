<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="goToURL('InvestmentPlanOperationList')"
    >
      <section class="q-my-md">
        <TabsComponent
          :tabs="filteredTabs"
          :tab-active="tabActive"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="tabActive = $event"
        />

        <div v-show="tabActive === 'basic_data'">
          <VCard class="q-pa-lg">
            <template #content-card>
              <BasicDataForm
                ref="investmentPlanOperationForm"
                action="create"
                @update-models="basicDataInformation = $event"
              />
              <q-separator />
              <div class="row justify-end q-gutter-md q-pt-lg">
                <Button
                  :outline="false"
                  :class-custom="'custom'"
                  label="Continuar"
                  size="md"
                  color="orange"
                  @click="storeOperation"
                />
              </div>
            </template>
          </VCard>
        </div>

        <div v-show="tabActive === 'details'">
          <VCard class="q-pa-lg">
            <template #content-card>
              <ContributionOperationDetailForm
                v-if="operationType === 'aporte'"
                ref="investmentPlanOperationDetailForm"
                :contribution-value="basicDataInformation?.value ?? 0"
                :fund-id="fundId"
              />
              <WithdrawalOperationDetailForm
                v-if="operationType === 'retiro'"
                ref="investmentPlanOperationDetailForm"
                :fiduciary-investment-plan-id="fiduciaryInvestmentPlanId"
                :subtype="operationSubType"
                :withdrawal-value="basicDataInformation?.value ?? 0"
                :fund-id="fundId"
              />
              <div class="row justify-end q-pt-lg">
                <Button
                  :outline="false"
                  :class-custom="'custom'"
                  label="Crear"
                  size="md"
                  color="orange"
                  @click="storeOperationDetail"
                />
              </div>
            </template>
          </VCard>
        </div>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import ContributionOperationDetailForm from '@/components/Forms/Fics/InvestmentPlanOperations/OperationDetail/ContributionOperationDetailForm.vue'
import WithdrawalOperationDetailForm from '@/components/Forms/Fics/InvestmentPlanOperations/OperationDetail/WithdrawalOperationDetailForm.vue'
import BasicDataForm from '@/components/Forms/Fics/InvestmentPlanOperations/BasicData/BasicDataForm.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Logic view
import useInvestmentPlanOperationCreate from '@/views/fics/investment-plan-operations/v1/create/InvestmentPlanOperationCreate'

const {
  fundId,
  goToURL,
  tabActive,
  headerProps,
  filteredTabs,
  tabActiveIdx,
  operationType,
  storeOperation,
  operationSubType,
  storeOperationDetail,
  basicDataInformation,
  fiduciaryInvestmentPlanId,
  investmentPlanOperationForm,
  investmentPlanOperationDetailForm,
} = useInvestmentPlanOperationCreate()
</script>
