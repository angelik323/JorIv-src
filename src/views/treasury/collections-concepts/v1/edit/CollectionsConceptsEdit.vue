<template>
  <div class="q-px-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      show-back-btn
      @on-back="$router.push({ name: 'CollectionConceptsList' })"
    >
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
            <!-- Information -->
            <InformationForm
              v-if="activeTab === 'InformationForm'"
              ref="informationFormRef"
              :action="'edit'"
              :data="collections_concepts_request"
            />

            <!-- Actions -->
            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  :outline="false"
                  label="Actualizar"
                  size="md"
                  unelevated
                  color="orange"
                  class="custom"
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
import InformationForm from '@/components/Forms/Treasury/CollectionConcepts/information/InformationForm.vue'
import useCollectionsConceptsEdit from './CollectionsConceptsEdit'
import Button from '@/components/common/Button/Button.vue'

const {
  headerProperties,
  informationFormRef,
  tabs,
  activeTab,
  tabActiveIdx,
  collections_concepts_request,
  onSubmit,
} = useCollectionsConceptsEdit()
</script>
