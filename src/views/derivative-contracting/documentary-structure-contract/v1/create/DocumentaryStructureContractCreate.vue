<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="goToURL('DocumentaryStructureContractList')"
    >
      <section class="q-my-md">
        <TabsComponent
          :tab-active="tabActive"
          :tabs="tabs"
          :tab-active-idx="tabActiveIdx"
        />

        <VCard>
          <template #content-card>
            <InformationForm
              v-if="tabActive === 'basic_data'"
              ref="informationFormRef"
              :action="'create'"
              :basic-data-form="basicDataForm"
              @update:basic-data-form="basicDataForm = $event"
            />

            <AnnexedDocumentList
              :action="'create'"
              :annexed-document-list="annexedDocumentList"
              @update:annexed-document-list="annexedDocumentList = $event"
            />

            <section class="mx-2 mb-2">
              <div class="row justify-end q-gutter-md">
                <Button
                  label="Crear"
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
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'

// Forms
import InformationForm from '@/components/Forms/DerivativeContracting/DocumentaryStructureContract/Information/InformationForm.vue'
import AnnexedDocumentList from '@/components/Lists/DerivativeContracting/DocumentaryStructureContract/AnnexedDocument/AnnexedDocumentList.vue'

// Logic view
import useDocumentaryStructureContractCreate from '@/views/derivative-contracting/documentary-structure-contract/v1/create/DocumentaryStructureContractCreate'

const {
  headerProps,
  tabs,
  tabActive,
  tabActiveIdx,
  informationFormRef,
  basicDataForm,
  annexedDocumentList,

  goToURL,
  onSubmit,
} = useDocumentaryStructureContractCreate()
</script>
