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

        <Card>
          <template #content-card>
            <!-- Information -->
            <InformationForm
              v-if="activeTab === 'InformationForm'"
              ref="informationFormRef"
              :action="'create'"
            />

            <!-- Actions -->
            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  :outline="false"
                  label="Crear"
                  size="md"
                  unelevated
                  color="orange"
                  class="custom"
                  @click="onSubmit"
                />
              </div>
            </section>
          </template>
        </Card>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import Card from '@/components/common/VCard/VCard.vue'

import InformationForm from '@/components/Forms/Treasury/CollectionConcepts/information/InformationForm.vue'
import useCollectionsConceptsCreate from '@/views/treasury/collections-concepts/v1/create/CollectionsConceptsCreate'
import Button from '@/components/common/Button/Button.vue'

const {
  headerProperties,
  informationFormRef,
  tabs,
  activeTab,
  tabActiveIdx,
  onSubmit,
} = useCollectionsConceptsCreate()
</script>
