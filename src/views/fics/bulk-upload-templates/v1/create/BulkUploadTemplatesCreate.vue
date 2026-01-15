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
              :action="'create'"
            />

            <section class="q-mt-xl">
              <TableList
                :title="tableProps.title"
                :loading="tableProps.loading"
                :rows="tableProps.rows"
                :columns="tableProps.columns"
                :custom-columns="['actions']"
                hidePagination
                customNoDataMessageTitle="Actualmente no hay columnas"
                customNoDataMessageSubtitle="Por favor, agregue una para continuar con el proceso"
              >
                <template #custom-header-action>
                  <Button
                    :outline="false"
                    label="Agregar"
                    left-icon="PlusCircle"
                    color-icon="white"
                    :styleContent="{
                      'place-items': 'center',
                      'border-radius': '20px',
                      'font-size': '13px',
                    }"
                    @click="openAlertModal()"
                  />
                </template>

                <template #actions="{ row }">
                  <Button
                    v-if="row.id"
                    :left-icon="defaultIconsLucide.trash"
                    color="orange"
                    :class-custom="'custom'"
                    :outline="false"
                    :flat="true"
                    colorIcon="#f45100"
                    :tooltip="'Eliminar'"
                    @click="deleteColumns(row.id)"
                  />
                </template>
              </TableList>
            </section>

            <section class="mx-1 mb-2">
              <div class="row justify-end q-gutter-md">
                <Button
                  :outline="false"
                  label="Crear"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="handleSubmitForm"
                  :disabled="tableProps.rows.length === 0"
                />
              </div>
            </section>
          </template>
        </VCard>
      </section>

      <AlertModalComponent
        ref="alertModalRef"
        styleModal="min-width: 480px"
        :show-img-default="false"
        :showCloseBtn="false"
        :showBtnConfirm="false"
        :showBtnCancel="false"
      >
        <template #default-body>
          <q-form ref="modalFormRef">
            <div class="q-ma-lg">
              <div class="flex content-center full-width q-mb-md">
                <p class="text-weight-bold no-margin text-black-90 text-h6">
                  {{ alertModalConfig.description }}
                </p>
                <Button
                  size="md"
                  color-icon="#B3B3B3"
                  class-custom="p"
                  flat
                  :outline="false"
                  :left-icon="defaultIconsLucide.close"
                  @click="handleCloseModal"
                />
              </div>

              <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
                <div class="col-12 col-md-12">
                  <GenericSelectorComponent
                    v-if="['create', 'edit'].includes('create')"
                    label="Columna opcional"
                    :default_value="informationFormRef.models.selector_modal"
                    required
                    placeholder="Seleccione"
                    :rules="[]"
                    @update:model-value="
                      informationFormRef.models.selector_modal = $event
                    "
                    :manual_option="monetary_operation_columns"
                    map_options
                  />
                  <div v-else class="text-black-90">
                    <p class="text-weight-bold no-margin">Columna opcional</p>
                    <p class="text-weight-medium no-margin">
                      {{ 'No registrado' }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="row q-mt-lg flex justify-center">
                <Button
                  label="Cancelar"
                  color="orange"
                  class="text-capitalize btn-filter custom q-mr-md"
                  :outline="true"
                  @click="handleCloseModal"
                />

                <Button
                  :outline="false"
                  label="Agregar"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="addColumns"
                  :disabled="!informationFormRef.models.selector_modal"
                />
              </div>
            </div>
          </q-form>
        </template>
      </AlertModalComponent>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import InformationForm from '@/components/Forms/Fics/BulkUploadTemplates/Information/InformationForm.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Logic view
import useBulkUploadTemplatesCreate from '@/views/fics/bulk-upload-templates/v1/create/BulkUploadTemplatesCreate'

const {
  tabs,
  tabActive,
  addColumns,
  tableProps,
  headerProps,
  tabActiveIdx,
  alertModalRef,
  deleteColumns,
  openAlertModal,
  handleGoToBack,
  alertModalConfig,
  handleCloseModal,
  handleSubmitForm,
  informationFormRef,
  defaultIconsLucide,
  monetary_operation_columns,
} = useBulkUploadTemplatesCreate()
</script>
