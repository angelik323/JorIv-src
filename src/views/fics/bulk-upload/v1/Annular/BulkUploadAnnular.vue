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
          action="annular"
        />
      </section>

      <section class="mx-4 mb-4">
        <div class="row justify-end q-gutter-md">
          <Button
            :outline="false"
            class-custom="custom"
            label="Anular"
            size="md"
            @click="onSubmitAnnular"
            :color="'orange'"
          />
        </div>
      </section>
    </ContentComponent>

    <AlertModalComponent
      ref="actionModalRef"
      :showImgDefault="false"
      :title="modalConfig.title"
      :showBtnConfirm="true"
      :showBtnCancel="true"
      textBtnConfirm="Aceptar"
      textBtnCancel="Cancelar"
      @confirm="executeAction"
    >
      <template #default-img>
        <q-img
          src="@/assets/images/icons/alert_popup_delete.svg"
          max-width="80px"
          width="80px"
          fit="contain"
        />
      </template>
    </AlertModalComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import AuthorizeForm from '@/components/Forms/Fics/BulkUpload/Authorize/AuthorizeForm.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import Button from '@/components/common/Button/Button.vue'

// Logic view
import BulkUploadAnnular from '@/views/fics/bulk-upload/v1/Annular/BulkUploadAnnular'

const {
  modalConfig,
  bulkUploadId,
  executeAction,
  actionModalRef,
  handleGoToBack,
  onSubmitAnnular,
  authorizeFormRef,
  headerBreadcrumbs,
} = BulkUploadAnnular()
</script>
