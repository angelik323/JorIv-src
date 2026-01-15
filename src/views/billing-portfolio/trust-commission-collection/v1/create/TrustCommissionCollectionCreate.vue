<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="goToURL('CollectionTrustCommissionList')"
    >
      <section>
        <TabsComponent :tabActive :tabs :tabActiveIdx />

        <VCard>
          <template #content-card>
            <div class="q-pa-lg">
              <BasicDataForm
                v-if="tabActive === 'basic_data'"
                ref="basicDataFormRef"
                action="create"
                :tableProps="tableProps"
                :handlePaymentNumberChange="handlePaymentNumberChange"
                :numberOfPayments="ops_number_of_pay"
              />
            </div>

            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  label="Generar recaudo"
                  size="md"
                  :no-caps="true"
                  unelevated
                  :outline="false"
                  color="orange"
                  class="btn-filter custom"
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
import BasicDataForm from '@/components/Forms/BillingPortfolio/TrustCommisionCollection/BasicDataForm.vue'

// Logic view
import useTrustCommissionCollectionCreate from '@/views/billing-portfolio/trust-commission-collection/v1/create/TrustCommissionCollectionCreate'

const {
  basicDataFormRef,
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  tableProps,
  ops_number_of_pay,

  onSubmit,
  handlePaymentNumberChange,
  goToURL,
} = useTrustCommissionCollectionCreate()
</script>
