<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="$router.push({ name: 'AmortizationAdvanceCommissionList' })"
    >
      <section>
        <TabsComponent
          :tab-active="tabActive"
          :tabs="tabs"
          :tab-active-idx="tabActiveIdx"
        />

        <VCard>
          <template #content-card>
            <InformationForm
              v-if="tabActive === 'information'"
              ref="formInformationRef"
              action="create"
              :data="amortization_advance_commission_response"
            />

            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  v-if="
                    tabs.findIndex((tab) => tab.name === tabActive) ===
                    tabs.length - 1
                  "
                  label="Crear"
                  size="md"
                  unelevated
                  :outline="false"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="onSubmit()"
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
import InformationForm from '@/components/Forms/BillingPortfolio/AmortizationAdvanceCommission/InformationForm.vue'

// Logic
import useAmortizationAdvanceCommissionCreate from './AmortizationAdvanceCommissionCreate'

const {
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  formInformationRef,
  amortization_advance_commission_response,
  onSubmit,
} = useAmortizationAdvanceCommissionCreate()
</script>
