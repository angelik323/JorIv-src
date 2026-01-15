<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
    >
      <section aria-label="Sección de creación de formulario">
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
              <BasicDataForm
                v-if="isLoaded"
                v-show="tabActive === 'basic-data'"
                ref="basicDataFormRef"
              />

              <TirPurchaseForm
                v-show="tabActive === 'tir-purchase'"
                ref="tirPurchaseFormRef"
              />

              <section
                class="q-mt-lg"
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
                    class="custom"
                    label="Crear"
                    unelevated
                    :outline="false"
                    color="orange"
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
import BasicDataForm from '@/components/Forms/InvestmentPortfolio/RegisterFixedIncomeLocalCurrency/Information/InformationForm.vue'
import TirPurchaseForm from '@/components/Forms/InvestmentPortfolio/RegisterFixedIncomeLocalCurrency/TirPurchase/TirPurchaseForm.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

import useRegisterFixedIncomeLocalCurrencyCreate from './RegisterFixedIncomeLocalCurrencyCreate'

const {
  isLoaded,
  tabActive,
  filteredTabs,
  tabActiveIdx,
  headerProperties,
  basicDataFormRef,
  tirPurchaseFormRef,
  defaultIconsLucide,
  nextTab,
  backTab,
  handleSubmitForm,
} = useRegisterFixedIncomeLocalCurrencyCreate()
</script>
