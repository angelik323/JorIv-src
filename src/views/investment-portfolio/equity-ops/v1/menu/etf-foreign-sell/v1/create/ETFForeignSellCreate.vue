<template>
  <div class="q-px-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      show-back-btn
      @on-back="handleGoToList"
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
                :action="'create'"
              />

              <ComplianceFrom
                v-show="tabActive === 'compliance'"
                ref="complianceFormRef"
                :action="'create'"
              />

              <ValuesForm
                v-show="tabActive === 'values'"
                ref="valuesFormRef"
                :action="'create'"
              />

              <section
                class="row justify-end q-gutter-md"
                aria-label="Controles de navegación entre secciones"
              >
                <Button
                  v-if="
                    filteredTabs.findIndex((tab) => tab.name === tabActive) > 0
                  "
                  :outline="true"
                  label="Atrás"
                  :leftIcon="defaultIconsLucide.chevronLeft"
                  :color-icon="'#762344'"
                  color="orange"
                  class="text-capitalize btn-filter"
                  @click="backTab"
                />

                <Button
                  v-if="
                    filteredTabs.findIndex((tab) => tab.name === tabActive) <
                    filteredTabs.length - 1
                  "
                  :outline="false"
                  label="Continuar"
                  :rightIcon="defaultIconsLucide.chevronRight"
                  :color-icon="'white'"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="nextTab"
                />

                <Button
                  v-if="
                    filteredTabs.findIndex((tab) => tab.name === tabActive) ===
                    filteredTabs.length - 1
                  "
                  :outline="false"
                  label="Crear"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="handleSubmitForm"
                />
              </section>
            </div>
          </template>
        </VCard>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
import InformationForm from '@/components/Forms/InvestmentPortfolio/EquityOps/ETFForeignSell/InformationForm/InformationForm.vue'
import ComplianceFrom from '@/components/Forms/InvestmentPortfolio/EquityOps/ETFForeignSell/ComplianceForm/ComplianceForm.vue'
import ValuesForm from '@/components/Forms/InvestmentPortfolio/EquityOps/ETFForeignSell/ValuesForm/ValuesForm.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

import useETFForeignSellCreate from '@/views/investment-portfolio/equity-ops/v1/menu/etf-foreign-sell/v1/create/ETFForeignSellCreate'

const {
  tabs,
  nextTab,
  backTab,
  isLoaded,
  tabActive,
  filteredTabs,
  tabActiveIdx,
  valuesFormRef,
  handleGoToList,
  headerProperties,
  handleSubmitForm,
  complianceFormRef,
  informationFormRef,
  defaultIconsLucide,
} = useETFForeignSellCreate()
</script>
