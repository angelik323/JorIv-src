<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
    >
      <TabsComponent
        :tab-active="tabActive"
        :tabs="tabs"
        :tab-active-idx="tabActiveIdx"
      />

      <VCard>
        <template #content-card>
          <BasicDataView
            v-if="tabActive === 'basic_data'"
            action="view"
            ref="basicDataFormRef"
            :data="basicData"
            :payment-details="paymentDetails"
            :payment-instructions="paymentInstructions"
            :payment-liquidations="paymentLiquidations"
            @reload="handleReload"
          />

          <section class="q-pa-md">
            <div class="row justify-end">
              <Button
                label="Finalizar"
                size="md"
                unelevated
                :outline="false"
                color="orange"
                class="text-capitalize btn-filter custom"
                @click="handleFinish"
              />
            </div>
          </section>
        </template>
      </VCard>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import BasicDataView from '@/components/Forms/AccountsPayable/FirstAuthorizationTaxSettlement/BasicDataView.vue'

// logic view
import useFirstAuthorizationTaxSettlementView from '@/views/accounts-payable/first-authorization-tax-settlement/v1/view/FirstAuthorizationTaxSettlementView'

const {
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  basicData,
  paymentDetails,
  paymentInstructions,
  paymentLiquidations,
  handleFinish,
  handleReload,
} = useFirstAuthorizationTaxSettlementView()
</script>