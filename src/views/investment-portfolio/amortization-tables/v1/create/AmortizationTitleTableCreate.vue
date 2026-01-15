<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :show-back-btn="true"
      @on-back="$router.push({ name: 'AmortizationTitleTableList' })"
    >
      <section>
        <TabsComponent
          :tabActive="activeTab"
          :tabs="tabs"
          :tabActiveIdx="tabActiveIdx"
          @update:tab-active="activeTab = $event"
          @update:tab-active-idx="tabActiveIdx = $event"
        />
      </section>
      <VCard>
        <template #content-card>
          <InformationForm action="create" />
        </template>
      </VCard>
      <div class="row justify-end q-gutter-md mb-2">
        <Button
          :outline="false"
          label="Crear"
          size="md"
          unelevated
          color="orange"
          class="text-capitalize btn-filter custom"
          @click="onSubmit"
        />
      </div>
    </ContentComponent>
  </div>
</template>
<script setup lang="ts">
import Button from '@/components/common/Button/Button.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import InformationForm from '@/components/Forms/InvestmentPortfolio/AmortizableTitleTable/information/InformationForm.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import { useAmortizationTitleTableCreate } from './AmortizationTitleTableCreate'

const { headerProps, tabs, activeTab, tabActiveIdx, onSubmit } =
  useAmortizationTitleTableCreate()
</script>
