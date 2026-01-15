<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :show-back-btn="true"
      @on-back="goToURL('TypeOfDocumentsList')"
    >
      <TabsComponent
        :tab-active="tabActive"
        :tabs="tabs"
        :tab-active-idx="tabActiveIdx"
      />

      <VCard>
        <template #content-card>
          <BasicDataForm
            v-if="tabActive === 'information'"
            action="create"
            ref="basicDataFormRef"
            :data="type_of_document_form"
            @update:data="type_of_document_form = $event"
          />

          <section class="mx-2 mb-2">
            <div class="row justify-end">
              <Button
                label="Crear"
                size="md"
                unelevated
                :outline="false"
                color="orange"
                class="text-capitalize btn-filter custom"
                @click="handleCreate"
              />
            </div>
          </section>
        </template>
      </VCard>
    </ContentComponent>
  </div>
</template>

<script lang="ts" setup>
// components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import BasicDataForm from '@/components/Forms/AccountsPayable/TypeOfDocuments/BasicDataForm.vue'

// logic
import useTypeOfDocumentsCreate from '@/views/accounts-payable/type-of-documents/v1/create/TypeOfDocumentsCreate'

const {
  // configs
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,

  // refs
  basicDataFormRef,
  type_of_document_form,

  // methods
  handleCreate,
  goToURL,
  
} = useTypeOfDocumentsCreate()
</script>
