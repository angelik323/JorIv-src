<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="goToURL('DerivativeInvestmentOperationsList')"
    >
      <section class="q-my-md">
        <TabsComponent
          :tab-active="tabActive"
          :tabs="filteredTabs"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="tabActive = $event"
        />
        <VCard>
          <template #content-card>
            <DerivativeInvestmentOperationDetails />
            <section class="q-ma-lg">
              <div class="row justify-end q-gutter-md">
                <Button
                  :outline="true"
                  label="Liquidar"
                  :color-icon="'#762344'"
                  color="orange"
                  class="text-capitalize btn-filter"
                  @click="openAlertModal()"
                />

                <Button
                  :outline="false"
                  label="Finalizar"
                  :color-icon="'white'"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="goToURL('DerivativeInvestmentOperationsList')"
                />
              </div>
            </section>
          </template>
        </VCard>
        <AlertModalComponent
          open-dialog="alertModalRef"
          :description_message="'¿Desea liquidar la operación?'"
          v-model="alertModalRef"
          styleModal="min-width: 400px"
          :showImgDefault="true"
          @close="
            () => {
              alertModalRef = false
            }
          "
          @confirm="settlement()"
        >
        </AlertModalComponent>
      </section>
    </ContentComponent>
  </div>
</template>
<script setup>
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

import DerivativeInvestmentOperationDetails from '@/components/Detail/InvestmentPortfolio/DerivativeInvestmentOperation/DerivativeInvestmentOperationDetail.vue'

import { useDerivativeInvestmentOperationView } from '@/views/investment-portfolio/derivative-investment-operation/v1/view/DerivativeInvestmentOperationView'

const {
  headerProps,
  tabActive,
  filteredTabs,
  tabActiveIdx,
  alertModalRef,
  openAlertModal,
  settlement,
  goToURL,
} = useDerivativeInvestmentOperationView()
</script>
