<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="goToURL('AttachedDocumentsList')"
    >
      <section class="q-mt-md">
        <TabsComponent
          :tab-active="tabActive"
          :tabs="tabs"
          :tab-active-idx="tabActiveIdx"
        />

        <VCard>
          <template #content-card>
            <div class="q-pa-lg">
              <InformationForm
                v-if="tabActive === 'information'"
                :data="data_information_form"
                ref="informationFormRef"
                action="create"
                @update:data="data_information_form = $event"
              />
            </div>
            <section class="mx-2 mb-2">
              <div class="row justify-end q-gutter-md">
                <Button
                  v-if="
                    tabs.findIndex((tab) => tab.name === tabActive) ===
                    tabs.length - 1
                  "
                  label="Actualizar"
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
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import InformationForm from '@/components/Forms/DerivativeContracting/AttachedDocumentsForm/AttachedDocumentsFormEdit/InformationForm.vue'

//logic
import useAttachedDocumentsEdit from '@/views/derivative-contracting/attached-documents-list/v1/edit/AttachedDocumentsEdit'

const {
  headerProps,
  tabActive,
  tabActiveIdx,
  tabs,
  onSubmit,
  data_information_form,
  informationFormRef,
  goToURL,
} = useAttachedDocumentsEdit()
</script>
