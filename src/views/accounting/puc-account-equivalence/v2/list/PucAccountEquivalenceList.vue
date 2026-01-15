<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
    >
      <div class="flex justify-end">
        <Button
          v-if="
            validateRouter(
              'Accounting',
              'PucAccountEquivalenceList',
              'action_import'
            )
          "
          outline
          :label="'Importar'"
          :left-icon="defaultIconsLucide.cloudUpload"
          color="orange"
          color-icon="black"
          :styleContent="{
            'place-items': 'center',
            'border-radius': '20px',
            width: '100px',
            height: '32px',
            'font-size': '13px',
          }"
          @click="
            $router.push({
              name: 'PucAccountEquivalenceImport',
            })
          "
        />
      </div>
      <div class="row q-col-gutter-x-md q-col-gutter-y-sm">
        <p class="col-12 col-md-6">Estructura origen</p>
        <p class="col-12 col-md-4">Estructura destino</p>
      </div>

      <FiltersComponent
        ref="filtersRef"
        :fields="filterConfig"
        @filter="handleFilter"
        @clear-filters="handleClearFilters"
        @update:values="handleUpdateValues"
      />
      <div class="flex justify-end">
        <Button
          v-if="
            validateRouter('Accounting', 'PucAccountEquivalenceList', 'export')
          "
          :outline="true"
          :class="'mx-1'"
          label="Descargar excel"
          :leftImg="excelIcon"
          :disabled="filterSourceExcel === 0"
          tooltip="Descargar excel"
          @click="exportExcelData()"
        />
      </div>

      <div class="q-my-md">
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
          <h6 class="col-12 col-md-6">PUC - Estructura origen</h6>
          <h6 class="col-12 col-md-6">PUC - Estructura destino</h6>
        </div>
        <TableList
          :loading="tableProperties.loading"
          :columns="tableProperties.columns"
          :rows="tableProperties.rows"
          :pages="tableProperties.pages"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
          :custom-columns="customColumns"
        >
          <template #actions="{ row }">
            <Button
              v-if="
                validateRouter(
                  'Accounting',
                  'PucAccountEquivalenceList',
                  'edit'
                )
              "
              :right-icon="defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Asignar"
              @click="handleOptions(row)"
            />
          </template>
        </TableList>
      </div>
      <AlertModalComponent
        :open-dialog="modalRef"
        :title-header="'Seleccione el plan de cuentas para asignar'"
        v-model="modalRef"
        style-modal="min-width: 800px; max-height: 530px; "
        :showImgDefault="false"
        @close="
          () => {
            modalRef = false
            isUploading = false
          }
        "
        @confirm="createDataInformation"
      >
        <template #default-body>
          <section class="q-pa-md" v-if="createModal">
            <div class="row q-col-gutter-sm q-mx-md q-mt-0">
              <div class="col-12">
                <p>Estructura origen</p>
                <div class="row q-col-gutter-x-lg">
                  <div class="col-6">
                    <GenericInputComponent
                      :default_value="modelsData.source_structure_id"
                      :label="'Código estructura *'"
                      disabled
                      :placeholder="''"
                      @update:model-value=""
                    />
                  </div>
                  <div class="col-6">
                    <GenericInputComponent
                      :default_value="modelsData.source_account_id"
                      :label="'Estructura *'"
                      disabled
                      :placeholder="''"
                      @update:model-value="handleFilter"
                    />
                  </div>
                  <div class="col-12 q-mt-md col-md-6">
                    <GenericInputComponent
                      :default_value="modelsData.puc_structure_origin_id"
                      :label="'PUC - Estructura origen'"
                      disabled
                      :placeholder="''"
                      @update:model-value="handleFilter"
                    />
                  </div>
                </div>
              </div>
              <div class="col-12">
                <q-separator class="q-mt-sm q-mb-lg" color="grey-4" />
                <p>Estructura destino</p>
                <div class="row q-col-gutter-x-lg">
                  <div class="col-6">
                    <GenericInputComponent
                      :default_value="modelsData.equivalent_structure_id"
                      :label="'Código estructura *'"
                      :placeholder="''"
                      class="mx-10"
                      disabled
                      @update:model-value="handleFilter"
                    />
                  </div>
                  <div class="col-6">
                    <GenericInputComponent
                      :default_value="equivalentValue"
                      :label="'Estructura *'"
                      disabled
                      :placeholder="''"
                      @update:model-value="handleFilter"
                    />
                  </div>
                </div>
              </div>

              <div class="col-12 q-mt-md col-md-6 q-col-gutter-x-md">
                <GenericSelectorComponent
                  :default_value="accountReference"
                  map_options
                  :manual_option="equivalentStructurePuc"
                  :label="'PUC - Estructura destino'"
                  :placeholder="''"
                  :required="false"
                  :rules="[]"
                  @update:model-value="
                    (val) => (modelsData.equivalent_account_id = val)
                  "
                />
              </div>
            </div>
          </section>
          <section v-else class="q-mx-xl">
            <PucAccountingImport />
          </section>
          <q-separator class="q-mt-lg q-mb-sm mx-3" color="grey-4" />
        </template>
      </AlertModalComponent>
    </ContentComponent>
  </div>
</template>

<script lang="ts" setup>
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import excelIcon from '@/assets/images/excel.svg'
import PucAccountingImport from '../import/PucAccountingImport.vue'
import { defaultIconsLucide } from '@/utils'
import usePucAccountEquivalenceList from './PucAccountEquivalenceList'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'

const {
  filtersRef,
  filterConfig,
  customColumns,
  modelsData,
  tableProperties,
  headerProperties,
  modalRef,
  createModal,
  isUploading,
  filterSourceExcel,
  equivalentStructurePuc,
  accountReference,
  equivalentValue,
  updatePage,
  handleFilter,
  handleOptions,
  handleClearFilters,
  updatePerPage,
  exportExcelData,
  createDataInformation,
  handleUpdateValues,
  validateRouter,
} = usePucAccountEquivalenceList()
</script>
