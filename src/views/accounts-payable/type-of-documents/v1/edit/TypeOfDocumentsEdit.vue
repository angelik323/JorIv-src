<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="goToURL('TypeOfDocumentsList')"
    >
      <section class="q-my-md">
        <TabsComponent
          :tab-active="tabActive"
          :tabs="tabs"
          :tab-active-idx="tabActiveIdx"
        />

        <VCard>
          <template #content-card>
            <BasicDataForm
              v-if="tabActive === 'information'"
              action="edit"
              ref="basicDataFormRef"
              :data="dataForForm"
              @update:data="_setFormData"
            />

            <section class="mx-2 mb-2">
              <q-separator />
              <div class="row justify-end">
                <Button
                  label="Actualizar"
                  size="md"
                  :left-icon="defaultIconsLucide.save"
                  color="orange"
                  :outline="false"
                  :flat="false"
                  class="text-capitalize btn-filter custom mt-2"
                  @click="handleEdit"
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
import BasicDataForm from '@/components/Forms/AccountsPayable/TypeOfDocuments/BasicDataForm.vue'

// Logic
import useTypeOfDocumentsEdit from '@/views/accounts-payable/type-of-documents/v1/edit/TypeOfDocumentsEdit'

const {
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  basicDataFormRef,
  dataForForm,
  handleEdit,
  goToURL,
  defaultIconsLucide,
  _setFormData,
} = useTypeOfDocumentsEdit()
</script>
