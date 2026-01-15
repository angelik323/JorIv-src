<template>
  <div class="q-px-xl" main>
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
    >
      <section
        class="q-my-md"
        aria-label="Sección de visualización de formulario"
      >
        <TabsComponent
          :tabs="tabs"
          :tab-active="tabActive"
          :tab-active-idx="tabActiveIdx"
        />

        <VCard v-if="isLoaded">
          <template #content-card>
            <div class="q-pa-lg">
              <InformationForm
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
import InformationForm from '@/components/Forms/InvestmentPortfolio/RiskRatingAgencie/InformationForm/InformationForm.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

import useRiskRatingAgenciesView from '@/views/investment-portfolio/risk-rating-agencies/v1/view/RiskRatingAgenciesView'

const {
  tabs,
  isLoaded,
  tabActive,
  initialData,
  tabActiveIdx,
  handleGoToList,
  headerProperties,
  informationFormRef,
} = useRiskRatingAgenciesView()
</script>
