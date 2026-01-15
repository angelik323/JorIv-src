<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="$router.push({ name: 'DividendLocalList' })"
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
            <div v-if="tabActive === 'information'">
              <InformationForm
                ref="investmentPortfolioForm"
                :action="'view'"
                :id="investmentPortfolioId"
                :has-loaded-data="hasLoadedData"
              />
            </div>
            <q-separator class="q-ma-lg" />
            <section class="q-ma-lg">
              <div class="row justify-end q-gutter-md">
                <Button
                  v-if="
                    filteredTabs.findIndex((tab : any) => tab.name === tabActive) ===
                    filteredTabs.length - 1
                  "
                  :outline="false"
                  :class-custom="'custom q-mt-md'"
                  label="Finalizar"
                  size="md"
                  color="orange"
                  @click="goToList"
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
import InformationForm from '@/components/Forms/InvestmentPortfolio/DividendForeignExchange/InformationForm.vue'

import useDividendForeignView from './DividendForeignView'

const {
  headerProps,
  filteredTabs,
  tabActive,
  tabActiveIdx,
  investmentPortfolioForm,
  investmentPortfolioId,
  hasLoadedData,
  goToList,
} = useDividendForeignView()
</script>
