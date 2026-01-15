<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      show-back-btn
      @on-back="goToURL(routerGroupList as string)"
    >
      <section>
        <TabsComponent :tabs :tabActive :tabActiveIdx />
        <VCard>
          <template #content-card>
            <div class="q-pa-lg">
              <section class="q-mt-xl" aria-label="Documento generado">
                <PdfViewer
                  :title="pdfViewerConfig.title"
                  loading-message="Generando vista previa del certificado..."
                  :pdfUrl="pdfViewerConfig.pdfUrl"
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
                    @click="goToURL(routerGroupList)"
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
import useGenerateCertificateView from '@/views/normative/generation-certificate/view/GenerationCertificateView'

const { goToURL } = useGoToUrl()

const {
  headerProperties,
  tabs,
  tabActive,
  tabActiveIdx,
  pdfViewerConfig,
  routerGroupList,
} = useGenerateCertificateView()
</script>
