<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :show-back-btn="true"
      @on-back="goToURL('SarlaftOwnList')"
    >
      <div>
        <TabsComponent
          :tab-active="'BasicData'"
          :tabs="tabs"
          :tab-active-idx="0"
        />
        <Card>
          <template #content-card>
            <div class="q-my-lg">
              <BasicDataForm
                ref="basicDataFormRef"
                form-type="edit"
                :data="formData"
                :show-file-upload="true"
                :show-third-party-table="true"
                :files-selected="initialFile"
                :file-processing-status="fileProcessingStatus"
                :loaded-third-party-data="loadedListData"
                :show-table-actions="false"
                :show-third-party-actions="true"
                @add-manual-entry="onAddManualEntry"
                @delete-row="onDeleteRow"
              />
            </div>
            <div class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <q-btn
                  size="md"
                  unelevated
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  label="Actualizar"
                  :disable="!formIsValid"
                  @click="onSubmit"
                />
              </div>
            </div>
          </template>
        </Card>
      </div>
    </ContentComponent>
  </div>
  <AlertModalComponent
    ref="alertModalRef"
    title="Agregar tercero a la lista"
    :show-img-default="true"
    text-btn-confirm="Agregar"
    text-btn-cancel="Cancelar"
    :disable-confirm="!addThirdFormRef?.isValid"
    @confirm="onConfirmAddEntry"
    @close="openDialog = false"
  >
    <template #default-body>
      <AddThirdForm ref="addThirdFormRef" />
    </template>
  </AlertModalComponent>
</template>

<script lang="ts" setup>
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import Card from '@/components/common/VCard/VCard.vue'
import AddThirdForm from '@/components/Forms/Sarlaft/OwnList/Forms/v1/AddThirdForm/AddThirdForm.vue'
import BasicDataForm from '@/components/Forms/Sarlaft/OwnList/Forms/v1/BasicDataForm/BasicDataForm.vue'

// Logic
import useOwnListEdit from '@/views/sarlaft/own-list/v1/edit/OwnListEdit'

const {
  headerProps,
  onSubmit,
  goToURL,
  onAddManualEntry,
  onConfirmAddEntry,
  onDeleteRow,
  tabs,
  basicDataFormRef,
  formData,
  initialFile,
  fileProcessingStatus,
  formIsValid,
  loadedListData,
  openDialog,
  addThirdFormRef,
  alertModalRef,
} = useOwnListEdit()
</script>
