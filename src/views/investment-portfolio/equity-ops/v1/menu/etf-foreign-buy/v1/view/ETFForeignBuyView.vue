<template>
  <div class="q-px-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
    >
      <section class="q-my-md">
        <TabsComponent
          :tabs="tabs"
          :tab-active="tabActive"
          :tab-active-idx="tabActiveIdx"
        />

        <VCard>
          <template #content-card>
            <div class="q-pa-lg">
              <InformationForm
                v-if="isLoaded"
                v-show="tabActive === 'information'"
                ref="informationFormRef"
                :data="initialData"
                :action="'view'"
              />

              <div class="row justify-end q-gutter-md">
                <Button
                  :outline="false"
                  label="Finalizar"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="handleGoToList"
                />
              </div>
            </div>
          </template>
        </VCard>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
import InformationForm from '@/components/Forms/InvestmentPortfolio/EquityOps/ETFForeignBuy/InformationForm/InformationForm.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

import useEtfForeignBuyView from '@/views/investment-portfolio/equity-ops/v1/menu/etf-foreign-buy/v1/view/ETFForeignBuyView'

const {
  tabs,
  isLoaded,
  tabActive,
  initialData,
  tabActiveIdx,
  handleGoToList,
  headerProperties,
  informationFormRef,
} = useEtfForeignBuyView()
</script>
