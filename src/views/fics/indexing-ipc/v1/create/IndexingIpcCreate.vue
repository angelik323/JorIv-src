<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="handleGoToList"
    >
      <section class="q-my-md">
        <TabsComponent
          :tabs="tabs"
          :tab-active="tabActive"
          :tab-active-idx="tabActiveIdx"
        />
        <VCard>
          <template #content-card>
            <section class="q-pa-lg">
              <IndexingIpcForm
                v-show="tabActive === 'information'"
                ref="indexingIpcForm"
                :action="'create'"
              />

              <div class="row justify-end q-gutter-md">
                <Button
                  :outline="false"
                  :class-custom="'custom'"
                  label="Procesar"
                  size="md"
                  color="orange"
                  @click="onProcess"
                />
              </div>

              <section class="q-mt-xl">
                <TableList
                  :title="tableProps.title"
                  :loading="tableProps.loading"
                  :columns="tableProps.columns"
                  :rows="tableProps.rows"
                  :pages="tableProps.pages"
                  @update-page="updatePage"
                  @update-rows-per-page="updatePerPage"
                >
                  <template #custom-header-action>
                    <Button
                      :outline="true"
                      label="Descargar excel"
                      :leftImg="excelIcon"
                      tooltip="Descargar excel"
                      :disabled="indexing_ipc_process_list?.length == 0"
                      @click="onDownload()"
                    />
                  </template>
                </TableList>
              </section>

              <div class="row justify-end q-gutter-md">
                <Button
                  :outline="false"
                  :class-custom="'custom'"
                  label="Crear"
                  size="md"
                  color="orange"
                  :disabled="indexing_ipc_process_list?.length == 0"
                  @click="onCreate"
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
import IndexingIpcForm from '@/components/Forms/Fics/IndexingIpc/information/InformationForm.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Assets
import excelIcon from '@/assets/images/excel.svg'

// Logic view
import useCreate from '@/views/fics/indexing-ipc/v1/create/IndexingIpcCreate'

const {
  tabs,
  onCreate,
  tabActive,
  onProcess,
  tableProps,
  updatePage,
  onDownload,
  headerProps,
  tabActiveIdx,
  updatePerPage,
  handleGoToList,
  indexingIpcForm,
  indexing_ipc_process_list,
} = useCreate()
</script>
