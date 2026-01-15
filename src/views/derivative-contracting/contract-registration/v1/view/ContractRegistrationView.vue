<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="goToURL('ContractRegistrationList')"
    >
      <section>
        <TabsComponent :tabActive :tabs :tabActiveIdx />

        <VCard>
          <template #content-card>
            <div class="q-pa-lg">
              <GeneralDataForm
                v-if="tabActive === 'basic_data'"
                :data="generalDataForm"
                ref="generalDataFormRef"
                action="view"
                @update:data="generalDataForm = $event"
              />

              <ScheduledPaymentMilestonesForm
                v-if="tabActive === 'scheduled_payment_milestones'"
                :data="generalDataForm"
                ref="scheduledPaymentMilestonesFormRef"
                action="view"
                @update:data="generalDataForm = $event"
              />

              <AssociatedBudgetForm
                v-if="tabActive === 'associated_budget'"
                :data="generalDataForm"
                ref="associatedBudgetFormRef"
                action="view"
                @update:data="generalDataForm = $event"
              />

              <FutureValiditiesForm
                v-if="tabActive === 'future_validities'"
                :data="generalDataForm"
                ref="futureValiditiesFormRef"
                action="view"
                @update:data="generalDataForm = $event"
              />

              <DocumentaryStructureForm
                v-if="tabActive === 'documentary_structure'"
                :data="generalDataForm"
                ref="documentaryStructureFormRef"
                action="view"
                @update:data="generalDataForm = $event"
              />

              <PoliciesForm
                v-if="tabActive === 'policies'"
                :data="generalDataForm"
                ref="policiesFormRef"
                action="view"
                @update:data="generalDataForm = $event"
              />

              <ClausesForm
                v-if="tabActive === 'clauses'"
                :data="generalDataForm"
                ref="clausesFormRef"
                action="view"
                @update:data="generalDataForm = $event"
              />
            </div>

            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  v-if="
                    tabs.findIndex((tab) => tab.name === tabActive) > -1 &&
                    tabs.findIndex((tab) => tab.name === tabActive) > 0
                  "
                  label="Atrás"
                  size="md"
                  unelevated
                  outline
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="backTab"
                />

                <Button
                  v-if="
                    tabs.findIndex((tab) => tab.name === tabActive) > -1 &&
                    tabs.findIndex((tab) => tab.name === tabActive) <
                      tabs.length - 1
                  "
                  label="Continuar"
                  :rightIcon="defaultIconsLucide.next"
                  color-icon="#fff"
                  size="md"
                  unelevated
                  :outline="false"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="nextTab"
                />

                <Button
                  v-if="
                    tabs.findIndex((tab) => tab.name === tabActive) ===
                    tabs.length - 1
                  "
                  label="Finalizar"
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
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'

// Forms
import GeneralDataForm from '@/components/Forms/DerivativeContracting/ContractRegistration/GeneralData/GeneralDataForm.vue'
import ScheduledPaymentMilestonesForm from '@/components/Forms/DerivativeContracting/ContractRegistration/ScheduledPaymentMilestones/ScheduledPaymentMilestonesForm.vue'
import AssociatedBudgetForm from '@/components/Forms/DerivativeContracting/ContractRegistration/AssociatedBudgetForm/AssociatedBudgetForm.vue'
import FutureValiditiesForm from '@/components/Forms/DerivativeContracting/ContractRegistration/FutureValidities/FutureValiditiesForm.vue'
import DocumentaryStructureForm from '@/components/Forms/DerivativeContracting/ContractRegistration/DocumentaryStructure/DocumentaryStructureForm.vue'
import PoliciesForm from '@/components/Forms/DerivativeContracting/ContractRegistration/Policies/PoliciesForm.vue'
import ClausesForm from '@/components/Forms/DerivativeContracting/ContractRegistration/Clauses/ClausesForm.vue'

// Logic view
import useContractRegistrationView from '@/views/derivative-contracting/contract-registration/v1/view/ContractRegistrationView'

const {
  generalDataForm,
  generalDataFormRef,
  scheduledPaymentMilestonesFormRef,
  associatedBudgetFormRef,
  futureValiditiesFormRef,
  documentaryStructureFormRef,
  clausesFormRef,
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  defaultIconsLucide,

  nextTab,
  backTab,
  goToURL,
  onSubmit,
} = useContractRegistrationView()
</script>
