<template>
  <div class="q-px-xl" role="main">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      show-back-btn
      @on-back="$router.push({ name: 'RegisterMonetaryMarketList' })"
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
              <BasicDataForm
                v-if="isLoaded"
                v-show="tabActive === 'basic-data'"
                ref="basicDataFormRef"
                :action="'create'"
              />

              <TitlesDeliveredForm
                v-show="tabActive === 'delivered-titles'"
                ref="deliveredFormRef"
                :action="'create'"
                :position="'delivered'"
                :negotiationValue="null"
              />

              <TitlesReceivedForm
                v-show="tabActive === 'received-titles'"
                ref="receivedFormRef"
                :action="'create'"
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
import BasicDataForm from '@/components/Forms/InvestmentPortfolio/RegisterMonetaryMarket/TtvForm/Informationform/InformationForm.vue'
import TitlesDeliveredForm from '@/components/Forms/InvestmentPortfolio/RegisterMonetaryMarket/TtvForm/TitlesDeliveredForm/TitlesDeliveredForm.vue'
import TitlesReceivedForm from '@/components/Forms/InvestmentPortfolio/RegisterMonetaryMarket/TtvForm/TitlesReceivedForm/TitlesReceivedForm.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

import useRegisterMonetaryMarketCreate from './TtvCreate'

const {
  isLoaded,
  tabActive,
  filteredTabs,
  tabActiveIdx,
  headerProperties,
  basicDataFormRef,
  deliveredFormRef,
  receivedFormRef,
  defaultIconsLucide,
  backTab,
  nextTab,
  handleSubmitForm,
} = useRegisterMonetaryMarketCreate()
</script>
