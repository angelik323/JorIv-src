<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :show-back-btn="true"
      @on-back="handleBack"
    >
      <section>
        <TabsComponent
          :tabActive="activeTab"
          :tabs="tabs"
          :tabActiveIdx="tabActiveIdx"
          @update:tab-active="activeTab = $event"
          @update:tab-active-idx="tabActiveIdx = $event"
        />

        <VCard>
          <template #content-card>
            <component
              :is="isForeign ? InformationForeign : InformationForm"
              ref="infoFormRef"
              action="create"
              @submit="handleSubmit"
            />
          </template>
        </VCard>

        <section class="mx-4 mb-4">
          <div class="row justify-end q-gutter-md">
            <Button
              label="Crear"
              size="md"
              :outline="false"
              unelevated
              color="orange"
              class="custom"
              @click="triggerFormSubmit"
            />
          </div>
        </section>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/common/Button/Button.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import InformationForm from '@/components/Forms/InvestmentPortfolio/GenerateBallot/Information/InformationForm.vue'
import InformationForeign from '@/components/Forms/InvestmentPortfolio/GenerateBallot/InformationForeign/InformatonForeign.vue'
import { useGenerateBallotCreate } from './GenerateBallotCreate'

const {
  headerProps,
  tabs,
  activeTab,
  tabActiveIdx,
  handleSubmit,
  handleBack,
  triggerFormSubmit,
  isForeign,
} = useGenerateBallotCreate()
</script>
