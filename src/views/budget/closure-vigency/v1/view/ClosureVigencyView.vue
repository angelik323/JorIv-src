<template>
  <div class="q-mx-lg">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      btn-label="Volver"
      btn-icon=""
      @to="handleFinish"
    >
      <!-- Sección de Datos Generales del Proceso -->
      <div class="q-pa-md">
        <div class="text-h6 q-mb-md">Datos básicos</div>

        <div class="row q-col-gutter-md">
          <!-- Número de proceso -->
          <div class="col-12 col-md-4">
            <q-input
              :model-value="process_detail?.process_number || '-'"
              label="Número de proceso"
              outlined
              dense
              readonly
              disable
            />
          </div>

          <!-- Tipo de proceso -->
          <div class="col-12 col-md-4">
            <q-input
              :model-value="formatProcessType(process_detail?.action_type)"
              label="Tipo de proceso"
              outlined
              dense
              readonly
              disable
            />
          </div>

          <!-- Usuario de proceso -->
          <div class="col-12 col-md-4">
            <q-input
              :model-value="process_detail?.user_name || '-'"
              label="Usuario de proceso"
              outlined
              dense
              readonly
              disable
            />
          </div>

          <!-- Estado de proceso -->
          <div class="col-12 col-md-4">
            <div class="q-field q-field--outlined q-field--dense">
              <div class="q-field__inner">
                <div class="q-field__control relative-position row no-wrap">
                  <div
                    class="q-field__control-container col relative-position row no-wrap"
                  >
                    <label class="q-field__label">Estado de proceso</label>
                    <div class="q-field__native row items-center q-pt-md">
                      <q-badge
                        :color="getStatusColor(process_detail?.status)"
                        :label="process_detail?.status || '-'"
                        class="q-px-md q-py-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Vigencia procesada -->
          <div class="col-12 col-md-4">
            <q-input
              :model-value="process_detail?.vigency || '-'"
              label="Vigencia procesada"
              outlined
              dense
              readonly
              disable
            />
          </div>

          <!-- Fecha de proceso -->
          <div class="col-12 col-md-4">
            <q-input
              :model-value="process_detail?.process_date || '-'"
              label="Fecha de proceso"
              outlined
              dense
              readonly
              disable
            />
          </div>
        </div>
      </div>

      <q-separator class="q-my-md" />

      <!-- Sección de Filtros -->
      <div class="q-pa-md">
        <div class="text-h6 q-mb-md">Filtros</div>

        <div class="row q-col-gutter-md items-end">
          <!-- Filtro Negocio -->
          <div class="col-12 col-md-4">
            <q-select
              v-model="filterBusiness"
              :options="businessFilterOptions"
              label="Negocio"
              outlined
              dense
              emit-value
              map-options
              clearable
            />
          </div>

          <!-- Filtro Estado -->
          <div class="col-12 col-md-4">
            <q-select
              v-model="filterStatus"
              :options="statusOptions"
              label="Estado"
              outlined
              dense
              emit-value
              map-options
              clearable
            />
          </div>

          <!-- Botones -->
          <div class="col-12 col-md-4">
            <div class="row q-gutter-sm">
              <q-btn
                label="Aplicar filtros"
                color="primary"
                icon="search"
                @click="handleApplyFilters"
              />
              <q-btn
                v-if="hasErrors"
                label="Reporte de errores"
                color="negative"
                icon="download"
                @click="handleDownloadErrorReport"
              />
            </div>
          </div>
        </div>
      </div>

      <q-separator class="q-my-md" />

      <!-- Listado de negocios procesados -->
      <div class="q-pa-md">
        <div class="text-h6 q-mb-md">Listado de negocios procesados</div>

        <q-table
          :rows="tablePropsBusinesses.rows"
          :columns="tablePropsBusinesses.columns"
          :loading="tablePropsBusinesses.loading"
          row-key="id"
          flat
          bordered
          :pagination="{ rowsPerPage: 10 }"
        >
          <!-- Columna de selección (radio button) -->
          <template #body-cell-select="props">
            <q-td :props="props">
              <q-radio
                :model-value="selectedBusinessId"
                :val="props.row.id"
                @update:model-value="handleSelectBusiness(props.row.id)"
              />
            </q-td>
          </template>

          <!-- Columna de estado con badge -->
          <template #body-cell-status="props">
            <q-td :props="props">
              <q-badge
                :color="getStatusColor(props.row.status)"
                :label="props.row.status"
                class="q-px-sm q-py-xs"
              />
            </q-td>
          </template>
        </q-table>

        <!-- Paginador -->
        <div class="row justify-end q-mt-md">
          <q-pagination
            v-if="tablePropsBusinesses.pages.lastPage > 1"
            :model-value="tablePropsBusinesses.pages.currentPage"
            :max="tablePropsBusinesses.pages.lastPage"
            direction-links
            @update:model-value="handleUpdateBusinessPage"
          />
        </div>
      </div>

      <q-separator class="q-my-md" />

      <!-- Listado de documentos del negocio -->
      <div class="q-pa-md">
        <div class="text-h6 q-mb-md">Listado de documentos del negocio</div>

        <div v-if="!selectedBusinessId" class="text-center text-grey q-pa-lg">
          Seleccione un negocio del listado anterior para ver sus documentos.
        </div>

        <q-table
          v-else
          :rows="tablePropsDocuments.rows"
          :columns="tablePropsDocuments.columns"
          :loading="tablePropsDocuments.loading"
          row-key="id"
          flat
          bordered
          :pagination="{ rowsPerPage: 10 }"
        >
          <!-- Columna de estado con badge -->
          <template #body-cell-status="props">
            <q-td :props="props">
              <q-badge
                :color="getStatusColor(props.row.status)"
                :label="props.row.status"
                class="q-px-sm q-py-xs"
              />
            </q-td>
          </template>
        </q-table>

        <!-- Paginador -->
        <div
          v-if="selectedBusinessId && tablePropsDocuments.pages.lastPage > 1"
          class="row justify-end q-mt-md"
        >
          <q-pagination
            :model-value="tablePropsDocuments.pages.currentPage"
            :max="tablePropsDocuments.pages.lastPage"
            direction-links
            @update:model-value="handleUpdateDocumentPage"
          />
        </div>
      </div>

      <!-- Botón Finalizar -->
      <div class="q-pa-md">
        <div class="row justify-end">
          <q-btn
            label="Finalizar"
            color="primary"
            icon="check"
            size="lg"
            @click="handleFinish"
          />
        </div>
      </div>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'

// Logic view
import { useClosureVigencyView } from '@/views/budget/closure-vigency/v1/view/ClosureVigencyView'

const {
  headerProps,
  process_detail,
  tablePropsBusinesses,
  tablePropsDocuments,
  filterBusiness,
  filterStatus,
  statusOptions,
  businessFilterOptions,
  selectedBusinessId,
  hasErrors,
  formatProcessType,
  getStatusColor,
  handleSelectBusiness,
  handleApplyFilters,
  handleDownloadErrorReport,
  handleFinish,
  handleUpdateBusinessPage,
  handleUpdateDocumentPage,
} = useClosureVigencyView()
</script>

<style scoped>
.q-field__label {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
}
</style>
