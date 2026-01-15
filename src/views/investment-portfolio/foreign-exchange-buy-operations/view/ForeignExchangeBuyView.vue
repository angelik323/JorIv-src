<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="goToURL('ForeignExchangeSalesList')"
    >
      <section class="q-my-md">
        <TabsComponent
          :tab-active="tabActive"
          :tabs="filteredTabs"
          :tab-active-idx="tabActiveIdx"
        />
        <VCard>
          <template #content-card>
            <div v-if="tabActive === 'information'">
              <ForeignExchangeForm
                ref="foreignExchangeForm"
                :action="'view'"
                :id="foreignExchangeBuyId"
                :has-loaded-data="hasLoadedData"
              />
            </div>
            <q-separator class="q-ma-lg" />
            <section class="q-ma-lg">
              <div class="row justify-end q-gutter-md">
                <Button
                  :outline="false"
                  :class-custom="'custom q-mt-md'"
                  label="Finalizar"
                  size="md"
                  color="orange"
                  @click="goToURL('ForeignExchangeSalesList')"
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
import Button from '@/components/common/Button/Button.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import ForeignExchangeForm from '@/components/Forms/InvestmentPortfolio/ForeignExchangeSalesOperations/Information/InformationForm.vue'
import useForeignExchangeBuyView from '@/views/investment-portfolio/foreign-exchange-buy-operations/view/ForeignExchangeBuyView'

const {
  headerProps,
  filteredTabs,
  tabActive,
  tabActiveIdx,
  foreignExchangeForm,
  foreignExchangeBuyId,
  hasLoadedData,
  goToURL,
} = useForeignExchangeBuyView()
</script>
