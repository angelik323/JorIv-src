<template>
  <div class="mx-8">
    <ContentComponent
      indentation
      content-indentation
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
              :action="'create'"
            />

            <section class="mx-4 mb-4">
              <div class="flex justify-end gap-4">
                <Button
                  label="Crear "
                  rightIcon="mdi-chevron-right"
                  size="md"
                  unelevated
                  :outline="false"
                  color="orange"
                  class="text-capitalize btn-filter custom"
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
<script setup lang="ts">
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import InformationForm from '@/components/Forms/Treasury/BankingEntitiesAccountingParametersCommissions/InformationForm.vue'
import useBankingEntitiesCreate from './BankingEntitiesCreate'
const props = defineProps<{ selectID: string }>()
const {
  headerProps,
  tabs,
  activeTab,
  tabActiveIdx,
  onSubmit,
  informationFormRef,
} = useBankingEntitiesCreate(Number(props.selectID))
</script>
