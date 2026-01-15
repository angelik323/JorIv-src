<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="goToURL('TypesContractingDocumentsList')"
    >
      <section class="q-my-md">
        <TabsComponent
          :tab-active="tabActive"
          :tabs="tabs"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="tabActive = $event"
          @update:tab-active-idx="tabActiveIdx = $event"
        />

        <VCard>
          <template #content-card>
            <BasicDataForm
              v-if="tabActive === 'basic_data'"
              ref="basicDataFormRef"
              :action="'view'"
              :basic-data-form="basicDataForm"
              @update:basic-data-form="basicDataForm = $event ?? null"
            />

            <FlowStatesForm
              v-if="tabActive === 'flow_states'"
              ref="flowStatesFormRef"
              :action="'view'"
              :flow-states-form="flowStatesForm"
              @update:flow-states-form="
                flowStatesForm && (flowStatesForm.flow = $event || [])
              "
              @update:flow-states-type="
                flowStatesForm && (flowStatesForm.type = $event ?? null)
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
                  @click="backTab"
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
                  @click="goToURL('TypesContractingDocumentsList')"
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
// Components
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'

// Forms
import BasicDataForm from '@/components/Forms/DerivativeContracting/TypesContractingDocuments/BasicData/BasicDataForm.vue'
import FlowStatesForm from '@/components/Forms/DerivativeContracting/TypesContractingDocuments/FlowStates/FlowStatesForm.vue'

// Logic view
import useTypesContractingDocumentsView from '@/views/derivative-contracting/types-contracting-documents/v1/view/TypesContractingDocumentsView'

const {
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  basicDataFormRef,
  flowStatesFormRef,
  basicDataForm,
  flowStatesForm,

  nextTab,
  backTab,
  goToURL,
} = useTypesContractingDocumentsView()
</script>
