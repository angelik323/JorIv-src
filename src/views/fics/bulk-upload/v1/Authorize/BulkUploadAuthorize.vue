<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerBreadcrumbs.title"
      :breadcrumbs="headerBreadcrumbs.breadcrumbs"
      show-back-btn
      @on-back="handleGoToBack"
    >
      <section class="q-mt-md">
        <AuthorizeForm
          ref="authorizeFormRef"
          :bulkUploadId="bulkUploadId"
          action="authorize"
        />
      </section>

      <section class="mx-4 mb-4">
        <div class="row justify-end q-gutter-md">
          <Button
            :outline="true"
            label="Rechazar"
            class="mr-1"
            color="orange"
            class-custom="custom"
            @click="onSubmitReject"
          />
          <Button
            :outline="false"
            class-custom="custom"
            label="Autorizar"
            size="md"
            @click="onSubmitAuthorize"
            :color="'orange'"
          />
        </div>
      </section>
    </ContentComponent>

    <AlertModalComponent
      ref="actionModalRef"
      styleModal="min-width: 500px"
      :showImgDefault="false"
      :title="modalConfig.title"
      :showBtnConfirm="true"
      :showBtnCancel="true"
      textBtnConfirm="Aceptar"
      textBtnCancel="Cancelar"
      :disableConfirm="
        !actionReason || actionReason.length < 3 || actionReason.length > 200
      "
      @confirm="executeAction"
    >
      <template #default-body>
        <div class="q-px-md">
          <GenericInput
            :default_value="actionReason"
            @update:modelValue="actionReason = $event"
            :label="modalConfig.label"
            type="textarea"
            :required="true"
            :rules="[
              (val: string) => !!val || 'El motivo es requerido',
              (val: string) => val.length >= 3 || 'Mínimo 3 caracteres',
              (val: string) => val.length <= 200 || 'Máximo 200 caracteres'
            ]"
            :max_length="'200'"
            :placeholder="modalConfig.placeholder"
          />
        </div>
      </template>
    </AlertModalComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import AuthorizeForm from '@/components/Forms/Fics/BulkUpload/Authorize/AuthorizeForm.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import Button from '@/components/common/Button/Button.vue'

// Logic view
import BulkUploadAuthorize from '@/views/fics/bulk-upload/v1/Authorize/BulkUploadAuthorize'

const {
  modalConfig,
  bulkUploadId,
  actionReason,
  executeAction,
  handleGoToBack,
  onSubmitReject,
  actionModalRef,
  authorizeFormRef,
  onSubmitAuthorize,
  headerBreadcrumbs,
} = BulkUploadAuthorize()
</script>
