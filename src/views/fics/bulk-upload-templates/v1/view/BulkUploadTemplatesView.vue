<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      show-back-btn
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      @on-back="handleGoToBack"
    >
      <section class="q-my-md">
        <TabsComponent
          :tabs="tabs"
          :tab-active="tabActive"
          :tab-active-idx="tabActiveIdx"
        />

        <VCard>
          <template #content-card>
            <InformationForm
              v-show="tabActive === 'information'"
              ref="informationFormRef"
              :action="'view'"
            />

            <section class="q-pa-lg">
              <TableList
                :title="tableProps.title"
                :loading="tableProps.loading"
                :rows="tableProps.rows"
                :columns="tableProps.columns"
                hidePagination
                :customColumns="['index']"
                customNoDataMessageTitle="Actualmente no hay columnas"
                customNoDataMessageSubtitle="Por favor, agregue una para continuar con el proceso"
              >
                <template #index="{ index }">
                  {{ index + 1 }}
                </template>
              </TableList>
            </section>

            <section class="mx-1 mb-2">
              <div class="row justify-end q-gutter-md">
                <Button
                  :outline="false"
                  label="Finalizar"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="handleGoToBack"
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
import InformationForm from '@/components/Forms/Fics/BulkUploadTemplates/Information/InformationForm.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Logic view
import useBulkUploadTemplatesView from '@/views/fics/bulk-upload-templates/v1/view/BulkUploadTemplatesView'

const {
  tabs,
  tabActive,
  tableProps,
  headerProps,
  tabActiveIdx,
  handleGoToBack,
  informationFormRef,
} = useBulkUploadTemplatesView()
</script>
