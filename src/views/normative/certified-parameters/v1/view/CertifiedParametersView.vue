<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      show-back-btn
      @on-back="goToURL('CertifiedParametersList')"
    >
      <section>
        <TabsComponent :tabs :tabActive :tabActiveIdx />
        <VCard>
          <template #content-card>
            <div class="q-pa-lg">
              <section
                class="row q-mb-lg q-col-gutter-lg"
                aria-label="Información del certificado"
              >
                <div class="col-12 col-sm-6">
                  <p class="text-subtitle2 text-bold q-mb-xs">
                    Tipo de certificado
                  </p>
                  <div>{{ information_form?.certificate_type || '-' }}</div>
                </div>
                <div class="col-12 col-sm-6">
                  <p class="text-subtitle2 text-bold q-mb-xs">
                    Fecha de registro
                  </p>
                  <div>{{ information_form?.generation_date || '-' }}</div>
                </div>
              </section>

              <q-separator class="q-mt-sm" />

              <section class="q-mt-xl" aria-label="Documento generado">
                <PdfViewer
                  :title="pdfViewerConfig.title"
                  loading-message="Generando vista previa del certificado..."
                  :pdf-blob="pdfViewerConfig.pdfBlob"
                  :is-loading="pdfViewerConfig.isLoading"
                  :has-error="pdfViewerConfig.hasError"
                  :error-message="pdfViewerConfig.errorMessage"
                />
              </section>
              <section
                class="q-mt-lg"
                aria-label="Controles de navegación entre secciones"
              >
                <div class="row justify-end q-gutter-md">
                  <Button
                    class="custom"
                    label="Finalizar"
                    unelevated
                    :outline="false"
                    color="orange"
                    @click="goToURL('CertifiedParametersList')"
                  />
                </div>
              </section>
            </div>
          </template>
        </VCard>
      </section>
    </ContentComponent>
  </div>
</template>

<script lang="ts" setup>
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import { useGoToUrl } from '@/composables'
import PdfViewer from '@/components/common/PdfViewer/PdfViewer.vue'
// logic
import useCertifiedParametersView from '@/views/normative/certified-parameters/v1/view/CertifiedParametersView'

const { goToURL } = useGoToUrl()

const {
  information_form,
  headerProperties,
  tabs,
  tabActive,
  tabActiveIdx,
  pdfViewerConfig,
} = useCertifiedParametersView()
</script>
