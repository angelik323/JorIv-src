<template>
  <div class="q-px-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      :show-back-btn="true"
      @on-back="handlerGoTo('TypesCollectionList')"
    >
      <section class="q-my-md">
        <TabsComponent
          :tab-active="activeTab"
          :tabs="tabs"
          :tab-active-idx="tabActiveIdx"
        />

        <!-- Tabs content -->
        <VCard>
          <template #content-card>
            <!-- Information -->
            <InformationForm
              v-if="activeTab === 'InformationForm'"
              ref="formInformation"
              :action="'edit'"
              :data="type_received_request ?? undefined"
            />

            <!-- Actions -->
            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <q-btn
                  label="Actualizar "
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

<script setup lang="ts">
// Components:
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'

import useTypesCollectionEdit from '@/views/treasury/types-collection/v1/edit/TypesCollectionEdit'
import InformationForm from '@/components/Forms/Treasury/TypesCollection/information/InformationForm.vue'

const {
  headerProperties,
  tabs,
  activeTab,
  tabActiveIdx,
  type_received_request,
  formInformation,

  handlerGoTo,
  onSubmit,
} = useTypesCollectionEdit()
</script>
