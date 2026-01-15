<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="$router.push({ name: 'DefinitionAccountingParametersList' })"
    >
      <section class="q-my-md">
        <TabsComponent
          :tabs="tabsBasic"
          :tab-active="tabActiveBasic"
          :tab-active-idx="tabActiveIdxBasic"
        />

        <VCard>
          <template #content-card>
            <BasicDataForm
              ref="basicDataFormRef"
              :action="'view'"
              :data="definition_accounting_parameters_view"
            />
          </template>
        </VCard>

        <TabsComponent
          :tabs="tabs"
          :tab-active="tabActive"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="tabActive = $event"
          @update:tab-active-idx="tabActiveIdx = $event"
        />

        <VCard>
          <template #content-card>
            <DetailForm
              v-if="tabActive === 'details'"
              ref="detailFormRef"
              :action="'view'"
              :data="
                definition_accounting_parameters_view?.details?.[0] ?? null
              "
            />

            <PositionForm
              v-if="tabActive === 'positions'"
              ref="positionFormRef"
              :action="'view'"
              :data="
                definition_accounting_parameters_view?.positions?.[0] ?? null
              "
            />

            <DerivateForm
              v-if="tabActive === 'derivates'"
              ref="derivateFormRef"
              :action="'view'"
              :data="
                definition_accounting_parameters_view?.derivatives?.[0] ?? null
              "
            />

            <section class="mx-2 mb-2">
              <div class="row justify-end q-gutter-md">
                <Button
                  v-if="
                    tabs.findIndex((tab) => tab.name === tabActive) > -1 &&
                    tabs.findIndex((tab) => tab.name === tabActive) > 0
                  "
                  label="Atrás"
                  size="md"
                  unelevated
                  :outline="false"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="backTab()"
                />

                <Button
                  v-if="
                    tabs.findIndex((tab) => tab.name === tabActive) > -1 &&
                    tabs.findIndex((tab) => tab.name === tabActive) <
                      tabs.length - 1
                  "
                  label="Continuar"
                  size="md"
                  unelevated
                  :outline="false"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="nextTab()"
                />

                <Button
                  v-if="
                    tabs.findIndex((tab) => tab.name === tabActive) ===
                    tabs.length - 1
                  "
                  label="Finalizar"
                  size="md"
                  unelevated
                  :outline="false"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="
                    $router.push({ name: 'DefinitionAccountingParametersList' })
                  "
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
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import BasicDataForm from '@/components/Forms/InvestmentPortfolio/DefinitionAccountingParameters/BasicData/BasicDataForm.vue'
import DetailForm from '@/components/Forms/InvestmentPortfolio/DefinitionAccountingParameters/Detail/DetailForm.vue'
import PositionForm from '@/components/Forms/InvestmentPortfolio/DefinitionAccountingParameters/Position/PositionForm.vue'
import DerivateForm from '@/components/Forms/InvestmentPortfolio/DefinitionAccountingParameters/Derivate/DerivateForm.vue'
import useDefinitionAccountingParametersView from './DefinitionAccountingParametersView'

const {
  headerProps,
  tabsBasic,
  tabActiveBasic,
  tabActiveIdxBasic,
  tabs,
  tabActive,
  tabActiveIdx,
  basicDataFormRef,
  detailFormRef,
  positionFormRef,
  derivateFormRef,
  backTab,
  nextTab,
  definition_accounting_parameters_view,
} = useDefinitionAccountingParametersView()
</script>
