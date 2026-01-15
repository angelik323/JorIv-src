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
      <section class="q-my-md" aria-label="Sección de creación simultáneas">
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
                v-show="tabActive === 'basic-data'"
                ref="informationFormRef"
                :action="'create'"
                v-model:position="position"
              />

              <WarrantyForm
                v-show="tabActive === 'warranty'"
                ref="warrantyFormRef"
                :action="'create'"
                :position="position"
              />

              <section
                class="mx-1 mb-2"
                aria-label="Controles de navegación entre secciones"
              >
                <div class="row justify-end q-gutter-md">
                  <Button
                    v-if="tabActiveIdx > 0"
                    :outline="true"
                    label="Atrás"
                    :leftIcon="defaultIconsLucide.chevronLeft"
                    :color-icon="'#762344'"
                    color="orange"
                    class="text-capitalize btn-filter"
                    @click="backTab"
                  />

                  <Button
                    v-if="tabActiveIdx < filteredTabs.length - 1"
                    :outline="false"
                    label="Continuar"
                    :rightIcon="defaultIconsLucide.chevronRight"
                    :color-icon="'white'"
                    color="orange"
                    class="text-capitalize btn-filter custom"
                    @click="nextTab"
                  />

                  <Button
                    v-if="tabActiveIdx === filteredTabs.length - 1"
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
import InformationForm from '@/components/Forms/InvestmentPortfolio/RegisterMonetaryMarket/SimultaneousForm/InformationForm/InformationForm.vue'
import WarrantyForm from '@/components/Forms/InvestmentPortfolio/RegisterMonetaryMarket/SimultaneousForm/WarrantyForm/WarrantyForm.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

import useSimultaneousCreate from './SimultaneosCreate'

const {
  isLoaded,
  tabActive,
  filteredTabs,
  tabActiveIdx,
  headerProperties,
  informationFormRef,
  warrantyFormRef,
  defaultIconsLucide,
  backTab,
  nextTab,
  handleSubmitForm,
  position,
} = useSimultaneousCreate()
</script>
