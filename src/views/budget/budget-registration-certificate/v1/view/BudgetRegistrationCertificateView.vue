<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      show-back-btn
      @on-back="headerProperties.btn"
    >
      <section>
        <PdfViewer
          :title="pdfViewerConfig.title"
          loading-message="Cargando certificado..."
          :pdf-blob="pdfViewerConfig.pdfBlob"
          :is-loading="pdfViewerConfig.isLoading"
          :has-error="pdfViewerConfig.hasError"
          :error-message="pdfViewerConfig.errorMessage"
        />
      </section>
    </ContentComponent>
  </div>
</template>

<script lang="ts" setup>
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import PdfViewer from '@/components/common/PdfViewer/PdfViewer.vue'

// logic
import useBudgetRegistrationCertificateView from '@/views/budget/budget-registration-certificate/v1/view/BudgetRegistrationCertificateView'

const { headerProperties, pdfViewerConfig } =
  useBudgetRegistrationCertificateView()
</script>
