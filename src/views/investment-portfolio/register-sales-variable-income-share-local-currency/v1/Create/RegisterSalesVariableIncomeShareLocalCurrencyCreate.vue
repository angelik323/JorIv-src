<template>
  <div class="q-px-xl" role="main">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
    >
      <section class="q-my-md" aria-label="Sección de creación de formulario">
        <TabsComponent
          :tabs="filteredTabs"
          :tab-active="tabActive"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="tabActive = $event"
          @update:tab-active-idx="tabActiveIdx = $event"
        />

        <VCard>
          <template #content-card>
            <div class="q-pa-lg">
              <InformationForm
                v-if="isLoaded"
                v-show="tabActive === 'information'"
                ref="informationFormRef"
              />

              <EmitterForm
                v-show="tabActive === 'emitter'"
                ref="emitterFormRef"
              />

              <ComplianceForm
                v-show="tabActive === 'compliance'"
                ref="complianceFormRef"
              />

              <section
                class="mx-1 mb-2"
                aria-label="Controles de navegación entre secciones"
              >
                <div class="row justify-end q-gutter-md">
                  <Button
                    v-if="
                      filteredTabs.findIndex((tab) => tab.name === tabActive) >
                      0
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
                      filteredTabs.findIndex(
                        (tab) => tab.name === tabActive
                      ) ===
                      filteredTabs.length - 1
                    "
                    :outline="false"
                    label="Crear"
                    color="orange"
                    class="text-capitalize btn-filter custom"
                    @click="handleSubmitForm"
                  />
                </div>
              </section>
            </div>
          </template>
        </VCard>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
import InformationForm from '@/components/Forms/InvestmentPortfolio/RegisterSalesVariableIncomeShareLocalCurrency/Information/InformationForm.vue'
import ComplianceForm from '@/components/Forms/InvestmentPortfolio/RegisterSalesVariableIncomeShareLocalCurrency/Compliance/ComplianceForm.vue'
import EmitterForm from '@/components/Forms/InvestmentPortfolio/RegisterSalesVariableIncomeShareLocalCurrency/Emitter/EmitterForm.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

import useRegisterShareSaleLocalCurrencyCreate from './RegisterSalesVariableIncomeShareLocalCurrencyCreate'

const {
  isLoaded,
  tabActive,
  filteredTabs,
  tabActiveIdx,
  emitterFormRef,
  headerProperties,
  complianceFormRef,
  informationFormRef,
  defaultIconsLucide,
  nextTab,
  backTab,
  handleSubmitForm,
} = useRegisterShareSaleLocalCurrencyCreate()
</script>
