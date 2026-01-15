<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerConfig.title"
      :breadcrumbs="headerConfig.breadcrumbs"
    >
      <section>
        <PdfViewer
          :title="pdfViewerConfig.title"
          :is-loading="pdfViewerConfig.isLoading"
          :pdf-blob="pdfViewerConfig.pdfBlob"
          :has-error="pdfViewerConfig.hasError"
          :error-message="pdfViewerConfig.errorMessage"
        />
      </section>

      <section class="q-mt-sm row q-gutter-md justify-end">
        <Button
          class-custom="custom"
          color="orange"
          outline
          label="Descargar"
          :disabled="!canDownloadCertificate"
          @click="handleDownloadCertificate"
        />

        <Button
          label="Finalizar"
          class-custom="custom"
          color="orange"
          :outline="false"
          @click="handleGoToListView"
        />
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import Button from '@/components/common/Button/Button.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import PdfViewer from '@/components/common/PdfViewer/PdfViewer.vue'

// View logic
import useBudgetAvailabilityCertificateView from '@/views/budget/budget-availability-certificate/v1/view/BudgetAvailabilityCertificateView'

const {
  headerConfig,
  pdfViewerConfig,
  canDownloadCertificate,
  handleGoToListView,
  handleDownloadCertificate,
} = useBudgetAvailabilityCertificateView()
</script>
