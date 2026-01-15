<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="goToURL('RegisterAdditionsList')"
    >
      <section>
        <TabsComponent :tabActive :tabs :tabActiveIdx />

        <VCard>
          <template #content-card>
            <div class="q-pa-lg">
              <BasicDataForm
                v-if="tabActive === 'basic_data'"
                v-model:data="basic_data_form"
                ref="basicDataFormRef"
                action="edit"
              />

              <PaymentForm
                v-if="tabActive === 'schedule_payments'"
                v-model:data="schedule_payments_form"
                v-model:basic_data="basic_data_form"
                ref="paymentFormRef"
                action="edit"
              />

              <BudgetForm
                v-if="tabActive === 'budget'"
                v-model:data="budget_form"
                v-model:basic_data="basic_data_form"
                v-model:payments="schedule_payments_form"
                ref="budgetFormRef"
                action="edit"
              />

              <ValidityForm
                v-if="tabActive === 'validity'"
                v-model:data="validity_form"
                v-model:basic_data="basic_data_form"
                v-model:payments="schedule_payments_form"
                ref="validityFormRef"
                action="edit"
              />

              <DocumentForm
                v-if="tabActive === 'documents'"
                v-model:data="documents_form"
                v-model:basic_data="basic_data_form"
                ref="documentFormRef"
                action="edit"
              />

              <PolicesForm
                v-if="tabActive === 'polices'"
                v-model:data="policies_form"
                ref="policesFormRef"
                action="edit"
              />

              <ClausesForm
                v-if="tabActive === 'clauses'"
                v-model:data="clauses_form"
                ref="clausesFormRef"
                action="edit"
              />
            </div>

            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  v-if="
                    tabs.findIndex((tab) => tab.name === tabActive) > -1 &&
                    tabs.findIndex((tab) => tab.name === tabActive) > 0
                  "
                  flat
                  outline
                  label="Atrás"
                  :left-icon="defaultIconsLucide.back"
                  size="md"
                  unelevated
                  color="orange"
                  class="text-capitalize btn-filter"
                  @click="backTab()"
                />

                <Button
                  v-if="
                    tabs.findIndex((tab) => tab.name === tabActive) > -1 &&
                    tabs.findIndex((tab) => tab.name === tabActive) <
                      tabs.length - 1
                  "
                  label="Continuar"
                  :right-icon="defaultIconsLucide.next"
                  size="md"
                  :outline="false"
                  unelevated
                  color="orange"
                  color-icon="white"
                  class="custom"
                  @click="nextTab()"
                />

                <Button
                  v-if="
                    tabs.findIndex((tab) => tab.name === tabActive) ===
                    tabs.length - 1
                  "
                  label="Actualizar"
                  size="md"
                  unelevated
                  :outline="false"
                  color="orange"
                  class="custom"
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

import BasicDataForm from '@/components/Forms/DerivativeContracting/RegisterAdditions/BasicData/BasicData.vue'
import PaymentForm from '@/components/Forms/DerivativeContracting/RegisterAdditions/Payments/Payments.vue'
import BudgetForm from '@/components/Forms/DerivativeContracting/RegisterAdditions/Budget/Budget.vue'
import ValidityForm from '@/components/Forms/DerivativeContracting/RegisterAdditions/Validity/Validity.vue'
import DocumentForm from '@/components/Forms/DerivativeContracting/RegisterAdditions/Documents/DocumentForm.vue'
import PolicesForm from '@/components/Forms/DerivativeContracting/RegisterAdditions/Policies/Policies.vue'
import ClausesForm from '@/components/Forms/DerivativeContracting/RegisterAdditions/Clauses/Clauses.vue'

// Logic view
import useRegisterAdditionEdit from '@/views/derivative-contracting/register-additions/v1/edit/RegisterAdditionsEdit'

const {
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  defaultIconsLucide,

  basicDataFormRef,
  basic_data_form,

  paymentFormRef,
  schedule_payments_form,

  budgetFormRef,
  budget_form,

  validityFormRef,
  validity_form,

  documentFormRef,
  documents_form,

  policesFormRef,
  policies_form,

  clausesFormRef,
  clauses_form,

  goToURL,
  onSubmit,
  backTab,
  nextTab,
} = useRegisterAdditionEdit()
</script>
