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
      <section>
        <TabsComponent :tabActive :tabs :tabActiveIdx />
        <VCard>
          <template #content-card>
            <div class="q-pa-lg">
              <InformationForm
                v-if="tabActive === 'information'"
                v-model:data="data_information_form"
                ref="informationFormRef"
                action="create"
              />
            </div>
            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  label="Crear"
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
<script lang="ts" setup>
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'

import InformationForm from '@/components/Forms/InvestmentPortfolio/DerivativeInvestmentOperation/InformationForm.vue'

import { useCurrencySaleCreate } from '@/views/investment-portfolio/derivative-investment-operation/v1/create/sale/CurrencySaleCreate'

const {
  headerProps,
  tabActive,
  tabs,
  tabActiveIdx,
  data_information_form,
  informationFormRef,
  onSubmit,
  goToURL,
} = useCurrencySaleCreate()
</script>
