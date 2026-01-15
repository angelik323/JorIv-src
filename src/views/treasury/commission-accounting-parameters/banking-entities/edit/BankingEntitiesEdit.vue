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
              action="edit"
              :data="data_information_form"
            />

            <section class="mx-4 mb-4">
              <div class="flex justify-end gap-4">
                <Button
                  :outline="false"
                  label="Actualizar"
                  size="md"
                  unelevated
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
<script lang="ts" setup>
import Button from '@/components/common/Button/Button.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import InformationForm from '@/components/Forms/Treasury/BankingEntitiesAccountingParametersCommissions/InformationForm.vue'
import useCollectionAccountingBlocksEdit from './BankingEntitiesEdit'
const props = defineProps<{ selectID: string }>()
const {
  headerProps,
  activeTab,
  informationFormRef,
  tabActiveIdx,
  tabs,
  data_information_form,
  onSubmit,
} = useCollectionAccountingBlocksEdit(Number(props.selectID))
</script>
