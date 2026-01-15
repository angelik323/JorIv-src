<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="goToURL('TypesCoverageList')"
    >
      <section>
        <TabsComponent :tabActive :tabs :tabActiveIdx />

        <VCard v-if="types_coverage_response">
          <template #content-card>
            <div class="q-pa-lg">
              <InformationForm
                v-if="tabActive === 'information'"
                ref="informationFormRef"
                :data="data_information_form"
                action="edit"
                @update:data="data_information_form = $event"
              />

              <section
                class="q-mt-lg"
                aria-label="Controles de navegación entre secciones"
              >
                <div class="row justify-end q-gutter-md">
                  <Button
                    v-if="
                      tabs.findIndex((tab) => tab.name === tabActive) > -1 &&
                      tabs.findIndex((tab) => tab.name === tabActive) > 0
                    "
                    label="Atrás"
                    size="md"
                    unelevated
                    outline
                    color="orange"
                    class="text-capitalize btn-filter custom"
                    @click="backTab"
                  />

                  <Button
                    v-if="
                      tabs.findIndex((tab) => tab.name === tabActive) > -1 &&
                      tabs.findIndex((tab) => tab.name === tabActive) <
                        tabs.length - 1
                    "
                    label="Continuar"
                    :rightIcon="defaultIconsLucide.next"
                    color-icon="#fff"
                    size="md"
                    unelevated
                    :outline="false"
                    color="orange"
                    class="text-capitalize btn-filter custom"
                    @click="nextTab"
                  />

                  <Button
                    v-if="
                      tabs.findIndex((tab) => tab.name === tabActive) ===
                      tabs.length - 1
                    "
                    label="Actualizar"
                    size="md"
                    unelevated
                    :outline="false"
                    color="orange"
                    class="text-capitalize btn-filter custom"
                    @click="onSubmit"
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
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import InformationForm from '@/components/Forms/InvestmentPortfolio/TypesCoverage/information/InformationForm.vue'

import { useTypesCoverageEdit } from '@/views/investment-portfolio/types-coverage/v1/edit/TypesCoverageEdit'

const {
  types_coverage_response,
  data_information_form,
  informationFormRef,
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  defaultIconsLucide,
  nextTab,
  backTab,
  goToURL,
  onSubmit,
} = useTypesCoverageEdit()
</script>
