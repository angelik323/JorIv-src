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
              <InformationForm
                v-if="isLoaded"
                v-show="tabActive === 'information'"
                ref="informationFormRef"
              />

              <ComplianceForm
                v-if="isLoaded"
                v-show="tabActive === 'compliance'"
                ref="complianceFormRef"
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
                    class="custom"
                    unelevated
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
                    class="custom"
                    unelevated
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
import InformationForm from '@/components/Forms/InvestmentPortfolio/RegisterFixedIncomeForeignCurrencySales/InformationForm/InformationForm.vue'
import ComplianceForm from '@/components/Forms/InvestmentPortfolio/RegisterFixedIncomeForeignCurrencySales/ComplianceForm/ComplianceForm.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

import useRegisterFixedIncomeForeignCurrencySaleCreate from './RegisterFixedIncomeForeignCurrencySaleCreate'

const {
  isLoaded,
  tabActive,
  filteredTabs,
  tabActiveIdx,
  headerProperties,
  informationFormRef,
  complianceFormRef,
  defaultIconsLucide,
  nextTab,
  backTab,
  handleSubmitForm,
} = useRegisterFixedIncomeForeignCurrencySaleCreate()
</script>
