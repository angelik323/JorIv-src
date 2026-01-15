<template>
  <div class="q-px-xl" role="main">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      :show-back-btn="headerProperties.showBackBtn"
      @on-back="goToURL('AccoutingReportList')"
    >
      <q-card flat bordered class="report-card">
        <q-card-section
          class="row items-center justify-between q-px-lg q-pt-md q-pb-sm"
        >
          <p class="text-subtitle1 text-bold q-mb-none">Reporte</p>

          <div class="row q-gutter-sm">
            <Button
              v-if="hasPdf"
              :outline="true"
              label="Descargar PDF"
              :leftImg="pdfIcon"
              tooltip="Descargar PDF"
              @click="downloadPdf"
            />
            <Button
              v-if="hasExcel"
              :outline="true"
              label="Descargar Excel"
              :leftImg="excelIcon"
              tooltip="Descargar Excel"
              @click="downloadExcel"
            />
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="report-body">
          <div class="report-container">
            <iframe v-if="hasPdf" :src="pdfSrc" class="report-frame"></iframe>

            <div v-else class="excel-placeholder">
              <img :src="excelIcon" alt="Excel" width="36" height="36" />
              <div>Este reporte está en Excel. Usa “Descargar Excel”.</div>
            </div>
          </div>
        </q-card-section>

        <section class="mx-2 mt-2 mb-4">
          <div class="row justify-end">
            <Button
              :outline="false"
              class-custom="custom"
              color="orange"
              label="Finalizar"
              size="md"
              @click="goToURL('AccoutingReportList')"
            />
          </div>
        </section>
      </q-card>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import excelIcon from '@/assets/images/excel.svg'
import pdfIcon from '@/assets/images/pdf.svg'
import router from '@/router'
import useAccoutingReportView from './AccoutingReportView'

const {
  headerProperties,
  hasPdf,
  hasExcel,
  pdfSrc,
  downloadPdf,
  downloadExcel,
} = useAccoutingReportView()

const goToURL = (name: string) => router.push({ name })
</script>

<style scoped>
.report-card {
  border-radius: 16px;
  overflow: hidden;
  background: #fff;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 140px);
}

.report-body {
  padding: 16px;
  flex: 1;
  display: flex;
}

.report-container {
  width: 100%;
  background: #f3f3f3;
  border-radius: 12px;
  padding: 16px;
}

.report-frame {
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
}

.excel-placeholder {
  height: 100%;
  display: grid;
  place-items: center;
  text-align: center;
  color: #616161;
  background: #fff;
  border-radius: 8px;
}
</style>
