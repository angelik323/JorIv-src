<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      :show-back-btn="true"
      @on-back="handlerGoTo('DocumentCharacteristicsList')"
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
            <DocumentCharacteristicsForm
              v-if="activeTab === 'InformationForm'"
              ref="formDocumentCharacteristics"
              action="edit"
            />
            <section class="mx-4 mb-2">
              <div class="row justify-end q-gutter-md">
                <Button
                  :outline="false"
                  :class-custom="'custom'"
                  label="Actualizar"
                  size="md"
                  color="orange"
                  @click="onSubmit"
                  :disabled="!isValidForm"
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
import useDocumentCharacteristicsEdit from './DocumentCharacteristicsEdit'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import DocumentCharacteristicsForm from '@/components/Forms/TrustBusiness/DocumentCharacteristics/DocumentCharacteristicsForm.vue'

const {
  headerProperties,
  tabs,
  activeTab,
  tabActiveIdx,
  formDocumentCharacteristics,
  isValidForm,
  handlerGoTo,
  onSubmit,
} = useDocumentCharacteristicsEdit()
</script>
