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
                form-type="create"
                :show-file-upload="true"
                :show-third-party-table="true"
                :files-selected="filesSelected"
                :file-processing-status="fileProcessingStatus"
                :loaded-third-party-data="loadedThirdPartyData"
                :show-table-actions="true"
                :show-third-party-actions="false"
                @file-added="onFileAdded"
                @remove-file="onRemoveFile"
              />
            </div>
            <div class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <q-btn
                  size="md"
                  unelevated
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  label="Crear"
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
</template>

<script lang="ts" setup>
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import Card from '@/components/common/VCard/VCard.vue'
import BasicDataForm from '@/components/Forms/Sarlaft/OwnList/Forms/v1/BasicDataForm/BasicDataForm.vue'

// Logic
import useOwnListCreate from '@/views/sarlaft/own-list/v1/create/OwnListCreate'

const {
  headerProps,
  tabs,
  basicDataFormRef,
  formIsValid,
  loadedThirdPartyData,
  fileProcessingStatus,
  filesSelected,
  onSubmit,
  onFileAdded,
  onRemoveFile,
  goToURL,
} = useOwnListCreate()
</script>
