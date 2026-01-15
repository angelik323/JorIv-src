<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="$router.push({ name: 'InvestmentPortfolioList' })"
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
              <InvestmentPortfolioForm
                ref="investmentPortfolioForm"
                :action="'edit'"
                :id="investmentPortfolioId"
                :has-loaded-data="hasLoadedData"
              />
            </div>
            <!-- Buttons -->
            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  v-if="
                    filteredTabs.findIndex((tab) => tab.name === tabActive) ===
                    filteredTabs.length - 1
                  "
                  :outline="false"
                  :class-custom="'custom'"
                  label="Actualizar"
                  size="md"
                  color="orange"
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
import Button from '@/components/common/Button/Button.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import InvestmentPortfolioForm from '@/components/Forms/InvestmentPortfolio/InvestmentPortfolio/Information/InformationForm.vue'

import useInvestmentPortfolioEdit from '@/views/investment-portfolio/investment-portfolio/v1/edit/InvestmentPortfolioEdit'

const {
  headerProps,
  filteredTabs,
  tabActive,
  tabActiveIdx,
  investmentPortfolioForm,
  investmentPortfolioId,
  hasLoadedData,
  onSubmit,
} = useInvestmentPortfolioEdit()
</script>
