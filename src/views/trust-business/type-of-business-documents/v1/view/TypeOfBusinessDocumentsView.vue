<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      :show-back-btn="true"
      @on-back="handlerGoTo('TypeOfBusinessDocumentsList')"
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
            <TypeOfBusinessDocumentsForm
              v-if="activeTab === 'InformationForm'"
              action="view"
            />
            <q-separator class="q-ma-lg" />
            <section class="mx-4 mb-2">
              <div class="row justify-end q-gutter-md">
                <Button
                  :outline="false"
                  :class-custom="'custom'"
                  label="Finalizar"
                  size="md"
                  color="orange"
                  @click="handlerGoTo('TypeOfBusinessDocumentsList')"
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
import useTypeOfBusinessDocumentsView from './TypeOfBusinessDocumentsView'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import TypeOfBusinessDocumentsForm from '@/components/Forms/TrustBusiness/TypeOfBusinessDocuments/TypeOfBusinessDocumentsForm.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'
const { headerProperties, tabs, activeTab, tabActiveIdx, handlerGoTo } =
  useTypeOfBusinessDocumentsView()
</script>
