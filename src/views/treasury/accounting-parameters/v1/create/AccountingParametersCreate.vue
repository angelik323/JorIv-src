<template>
  <div class="q-mx-xl">
    <ContentComponent
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :show-back-btn="true"
      @on-back="$router.push({ name: 'CollectionAccountingBlocksList' })"
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
            <InformationForm
              v-if="activeTab === 'InformationForm'"
              ref="informationFormRef"
              action="create"
            />

            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  :outline="false"
                  label="Crear"
                  size="md"
                  unelevated
                  color="orange"
                  @click="onSubmit"
                  class="text-capitalize btn-filter custom"
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
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import InformationForm from '@/components/Forms/Treasury/AccountingParameters/Information/InformationForm.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import { useAccountingParametersCreate } from './AccountingParametersCreate'

const { activeTab, headerProps, tabs, tabActiveIdx, onSubmit } =
  useAccountingParametersCreate()
</script>
