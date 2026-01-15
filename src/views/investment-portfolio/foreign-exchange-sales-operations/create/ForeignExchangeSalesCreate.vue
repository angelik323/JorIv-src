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
                :action="'create'"
                opType="SELL"
              />
            </div>
            <!-- Buttons -->
            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  :outline="false"
                  :class-custom="'custom'"
                  label="Crear"
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
import ForeignExchangeForm from '@/components/Forms/InvestmentPortfolio/ForeignExchangeSalesOperations/Information/InformationForm.vue'
import useForeignExchangeSaleCreate from '@/views/investment-portfolio/foreign-exchange-sales-operations/create/ForeignExchangeSalesCreate'

const {
  headerProps,
  filteredTabs,
  tabActive,
  tabActiveIdx,
  foreignExchangeForm,
  onSubmit,
  goToURL,
} = useForeignExchangeSaleCreate()
</script>
