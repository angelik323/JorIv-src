<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      :show-back-btn="true"
      @on-back="handlerGoTo('TrustBusinessDocumentStructureList')"
    >
      <FiltersComponent
        :fields="filterConfig"
        :trigger_event_by_field="true"
        @filter="handleFilterSearch"
        @clear-filters="handleClearFilters"
      />
      <section class="q-my-md">
        <TabsComponent
          :tab-active="activeTab"
          :tabs="tabs"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="activeTab = $event"
          @update:tab-active-idx="tabActiveIdx = $event"
        />

        <VCard>
          <template #content-card>
            <TrustBusinessDocumentStructureForm
              v-if="activeTab === 'InformationForm'"
              ref="formTrustBusinessDocumentStructure"
              action="create"
            />
            <section class="mx-4 mb-2">
              <div class="row justify-end q-gutter-md">
                <Button
                  :outline="false"
                  :class-custom="'custom'"
                  label="Crear"
                  size="md"
                  color="orange"
                  @click="onSubmit"
                />
              </div>
            </section>
          </template>
        </VCard>
      </section>
    </ContentComponent>
  </div>
</template>
<script lang="ts" setup>
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import useTrustBusinessDocumentStructureCreate from './TrustBusinessDocumentStructureCreate'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import TrustBusinessDocumentStructureForm from '@/components/Forms/TrustBusiness/TrustBusinessDocumentStructure/TrustBusinessDocumentStructureForm.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'

const {
  headerProperties,
  tabs,
  activeTab,
  tabActiveIdx,
  filterConfig,
  formTrustBusinessDocumentStructure,
  handlerGoTo,
  onSubmit,
  handleFilterSearch,
  handleClearFilters,
} = useTrustBusinessDocumentStructureCreate()
</script>
