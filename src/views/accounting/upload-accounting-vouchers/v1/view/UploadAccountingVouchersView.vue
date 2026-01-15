<template>
  <div class="q-px-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      show-back-btn
      @on-back="handlerGoToList()"
    >
      <section class="q-my-md">
        <TabsComponent
          :tab-active="activeTab"
          :tabs="tabs"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="activeTab = $event"
          @update:tab-active-idx="tabActiveIdx = $event"
        />
        <Card>
          <template #content-card class="mx-4 mb-4">
            <div class="row q-col-gutter-lg mt-1 q-pa-md">
              <div class="col-xs-12 col-sm-12 col-md-4 mb-2">
                <p class="text-weight-medium mb-0"><b>Código de negocio:</b></p>
                <p class="text-weight-medium mb-0">
                  {{ uploadAccountingVoucherView.business_trust.business_code }}
                </p>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 mb-2">
                <p class="text-weight-medium mb-0"><b>Nombre de negocio:</b></p>
                <p class="text-weight-medium mb-0">
                  {{ uploadAccountingVoucherView.business_trust.name }}
                </p>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 mb-2">
                <p class="text-weight-medium mb-0">
                  <b>Estructura contable:</b>
                </p>
                <p class="text-weight-medium mb-0">
                  {{
                    uploadAccountingVoucherView.business_trust.account
                      .account_structure.code +
                    ' - ' +
                    uploadAccountingVoucherView.business_trust.account
                      .account_structure.purpose
                  }}
                </p>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 mb-2">
                <p class="text-weight-medium mb-0">
                  <b>Periodo:</b>
                </p>
                <p class="text-weight-medium mb-0">
                  {{
                    new Date(
                      uploadAccountingVoucherView.registration_date
                    ).toLocaleString('default', {
                      year: 'numeric',
                      month: '2-digit',
                    })
                  }}
                </p>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 mb-2">
                <p class="text-weight-medium mb-0">
                  <b>Dia de registro:</b>
                </p>
                <p class="text-weight-medium mb-0">
                  {{ uploadAccountingVoucherView.registration_day }}
                </p>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 mb-2">
                <p class="text-weight-medium mb-0">
                  <b>Fecha de registro:</b>
                </p>
                <p class="text-weight-medium mb-0">
                  {{
                    new Date(uploadAccountingVoucherView.registration_date)
                      .toISOString()
                      .slice(0, 10)
                  }}
                </p>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 mb-2">
                <p class="text-weight-medium mb-0">
                  <b>Tipo de comprobante:</b>
                </p>
                <p class="text-weight-medium mb-0">
                  {{
                    uploadAccountingVoucherView.receipt_type.code +
                    ' - ' +
                    uploadAccountingVoucherView.receipt_type.name
                  }}
                </p>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 mb-2">
                <p class="text-weight-medium mb-0">
                  <b>Subtipo de comprobante:</b>
                </p>
                <p class="text-weight-medium mb-0">
                  {{
                    uploadAccountingVoucherView.sub_receipt_type.code +
                    ' - ' +
                    uploadAccountingVoucherView.sub_receipt_type.name
                  }}
                </p>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 mb-2">
                <p class="text-weight-medium mb-0">
                  <b>Consecutivo comprobante:</b>
                </p>
                <p class="text-weight-medium mb-0">
                  {{ uploadAccountingVoucherView.code }}
                </p>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 mb-2">
                <p class="text-weight-medium mb-0"><b>Estado</b></p>
                <ShowStatus
                  :type="Number(uploadAccountingVoucherView.status.id ?? 20)"
                  class="q-mt-sm"
                />
              </div>
            </div>
            <q-separator class="q-my-md" />
            <div class="flex justify-between q-px-xl items-center">
              <h6><b>Catálogo de centros de costo</b></h6>
              <Button
                no-caps
                outline
                class-custom="custom"
                label="Descargar excel"
                color="orange"
                :styleContent="{
                  'place-items': 'center',
                  color: 'black',
                }"
                :text-color="'orange'"
                :left-img="imgButtonHeaderTable"
                @click="downloadTemplateExcel()"
              >
                <img
                  class="image-excel"
                  src="@/assets/images/excel.svg"
                  alt="Excel Icon"
                />
                Descargar plantilla
              </Button>
            </div>
            <section class="mx-4 q-my-lg">
              <TableList
                :loading="tableProps.loading"
                :columns="tableProps.columns"
                :rows="tableProps.rows"
                :pages="tableProps.pages"
                :hide-bottom="true"
              />
              <div class="row justify-end q-gutter-md q-mt-md">
                <Button
                  :label="'Finalizar'"
                  :size="'md'"
                  :unelevated="true"
                  :outline="false"
                  :color="'orange'"
                  :class="'text-capitalize btn-filter custom'"
                  @click="handlerGoToList()"
                />
              </div>
            </section>
          </template>
        </Card>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import Card from '@/components/common/VCard/VCard.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ShowStatus from '@/components/showStatus/ShowStatus.vue'
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'

import imgButtonHeaderTable from '@/assets/images/excel.svg'

import useUploadAccountingVouchersView from './UploadAccountingVouchersView'

const {
  uploadAccountingVoucherView,
  tableProps,
  headerProperties,
  tabs,
  activeTab,
  tabActiveIdx,
  handlerGoToList,
  downloadTemplateExcel,
} = useUploadAccountingVouchersView()
</script>
