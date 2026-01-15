Basic data vue nuevo

<template>
  <q-form
    ref="formElementRef"
    aria-label="Formulario de datos básicos para englobe de títulos"
    class="q-pa-md"
  >
    <VCard>
      <template #content-card>
        <div
          class="row q-col-gutter-x-lg q-col-gutter-y-sm q-pa-lg"
          v-if="action === 'view'"
        >
          <div class="col-12 col-md-4 q-my-sm">
            <div class="text-black-90">
              <p class="text-weight-bold no-margin">Proceso</p>
              <p class="text-weight-medium no-margin">
                {{ models?.process_code }}
              </p>
            </div>
          </div>
          <div class="col-12 col-md-4 q-my-sm">
            <div class="text-black-90">
              <p class="text-weight-bold no-margin">
                Fecha de última consolidación
              </p>
              <p class="text-weight-medium">
                {{ models?.date_last_consolidation }}
              </p>
            </div>
          </div>
          <div class="col-12 col-md-4 q-my-sm">
            <div class="text-black-90">
              <p class="text-weight-bold no-margin">Periodo actual</p>
              <p class="text-weight-medium">
                {{ models?.current_period }}
              </p>
            </div>
          </div>
          <div class="col-12 col-md-4 q-my-sm">
            <div class="text-black-90">
              <p class="text-weight-bold no-margin">Estructura contable</p>
              <p class="text-weight-medium">
                {{
                  models?.account_structure.description +
                  ' - ' +
                  models?.account_structure.code
                }}
              </p>
            </div>
          </div>
          <div class="col-12 col-md-4 q-my-sm">
            <div class="text-black-90">
              <p class="text-weight-bold no-margin">
                Desde negocio consolidador
              </p>
              <p class="text-weight-medium">
                {{
                  models?.from_business.description +
                  ' - ' +
                  models?.from_business.code
                }}
              </p>
            </div>
          </div>

          <div class="col-12 col-md-4 q-my-sm">
            <div class="text-black-90">
              <p class="text-weight-bold no-margin">
                Hasta negocio consolidador
              </p>
              <p class="text-weight-medium">
                {{
                  models?.to_business.description +
                  ' - ' +
                  models?.to_business.code
                }}
              </p>
            </div>
          </div>
          <div class="col-12 col-md-4 q-my-sm">
            <div class="text-black-90">
              <p class="text-weight-bold no-margin">Estado del proceso</p>
              <p class="text-weight-medium">
                {{ models?.status.status }}
              </p>
            </div>
          </div>
        </div>

        <div
          class="row q-col-gutter-x-lg q-col-gutter-y-sm q-pa-md"
          v-if="action === 'details'"
        >
          <div class="col-12 col-md-3 q-my-sm">
            <div class="text-black-90">
              <p class="text-weight-bold no-margin">Proceso</p>
              <p class="text-weight-medium">
                {{ modelsDetail?.consolidation_header.process_code }}
              </p>
            </div>
          </div>
          <div class="col-12 col-md-3 q-my-sm">
            <div class="text-black-90">
              <p class="text-weight-bold no-margin">Estado del proceso</p>
              <p class="text-weight-medium no-margin">
                {{ modelsDetail?.consolidation_header.status.status }}
              </p>
            </div>
          </div>
          <div class="col-12 col-md-3 q-my-sm">
            <div class="text-black-90">
              <p class="text-weight-bold no-margin">
                Fecha de última consolidación
              </p>
              <p class="text-weight-medium no-margin">{{}}</p>
            </div>
          </div>
          <div class="col-12 col-md-3 q-my-sm">
            <div class="text-black-90">
              <p class="text-weight-bold no-margin">Estructura contable</p>
              <p class="text-weight-medium">
                {{
                  modelsDetail.consolidation_header.account_structure
                    .description
                }}
              </p>
            </div>
          </div>
          <section class="col-12 col-md-12 q-mt-lg">
            <TableList
              :title="tableDetailAccounting.title"
              :loading="tableDetailAccounting.loading"
              :columns="tableDetailAccounting.columns"
              :rows="tableDetailAccounting.rows"
              :pages="tableDetailAccounting.pages"
              :custom-columns="['status', 'actions']"
            >
              <template #status="{ row }">
                <ShowStatus
                  :type="Number(row.business_trust.status?.id ?? 0)"
                  statusType="accounting"
                /> </template
            ></TableList>
          </section>
        </div>
        <q-separator class="q-my-md" v-if="action === 'view'" />
        <div v-if="action === 'view'">
          <section class="q-pa-md">
            <FiltersComponent
              :ref="filterComponentRef"
              :fields="filterBasicDataViewConfig"
              @filter="handleFilterSearchView"
              @show-more="handleShowMoreFilters"
              :buttons="['more_filters']"
              @clear-filters="handleClearView"
            />
          </section>
          <section class="col-12 col-md-12 q-mt-lg q-pa-lg">
            <TableList
              :title="tableViewConsolidatedAccounting.title"
              :loading="tableViewConsolidatedAccounting.loading"
              :columns="tableViewConsolidatedAccounting.columns"
              :rows="tableViewConsolidatedAccounting.rows"
              :pages="tableViewConsolidatedAccounting.pages"
              :custom-columns="['status', 'actions']"
              selection="single"
              @selected="consolidationIdReferenceView = $event.selected[0]?.id"
            >
              >
              <template #status="{ row }">
                <ShowStatus
                  :type="Number(row.status?.id ?? 0)"
                  statusType="accounting"
                /> </template
            ></TableList>
          </section>
          <section class="col-12 col-md-12 q-mt-lg q-pa-lg">
            <TableList
              :title="tableViewDataChildren.title"
              :loading="tableViewDataChildren.loading"
              :columns="tableViewDataChildren.columns"
              :rows="tableViewDataChildren.rows"
              :pages="tableViewDataChildren.pages"
              :custom-columns="['status', 'actions']"
              selection="single"
              @selected="consolidationId = $event.selected[0]?.id"
            >
              >
              <template #status="{ row }">
                <ShowStatus
                  :type="Number(row.status?.id ?? 0)"
                  statusType="accounting"
                /> </template
            ></TableList>
          </section>
        </div>
        <div
          class="row q-col-gutter-x-lg q-col-gutter-y-sm q-pa-md"
          v-if="action === 'process'"
        >
          <div class="col-12 col-md-4">
            <GenericDateInputComponent
              :default_value="modelsFilterAccounting.current_period"
              :label="'Periodo actual'"
              map_options
              :manual_option="[]"
              :mask="'YYYY-MM'"
              :placeholder="'AAAA-MM'"
              :required="false"
              :rules="[
                (val) =>
                  useRules().is_required(val, 'Periodo actual es requerido'),
              ]"
              @update:model-value="
                (val) => (modelsFilterAccounting.current_period = val)
              "
            />
          </div>
          <div class="col-12 col-md-4">
            <GenericSelectorComponent
              :default_value="modelsFilterAccounting.accounting_structure_id"
              :label="'Estructura contable'"
              map_options
              :manual_option="account_chart_structure_accounting"
              :placeholder="'Seleccione'"
              :required="false"
              :rules="[
                (val) =>
                  useRules().is_required(
                    val,
                    'Estructura contable es requerida'
                  ),
              ]"
              @update:model-value="
                (val) => (modelsFilterAccounting.accounting_structure_id = val)
              "
            />
          </div>
          <div class="col-12 col-md-4">
            <GenericSelectorComponent
              :default_value="
                modelsFilterAccounting.from_consolidation_business_code
              "
              :label="'Desde negocio consolidador'"
              map_options
              :manual_option="business_trusts_to_consolidate"
              :placeholder="'Seleccione'"
              :required="false"
              :rules="[
                (val) =>
                  useRules().is_required(
                    val,
                    'Desde negocio consolidador es requerido'
                  ),
              ]"
              @update:model-value="
                (val) =>
                  (modelsFilterAccounting.from_consolidation_business_code =
                    val)
              "
            />
          </div>
          <div class="col-12 col-md-4">
            <GenericInputComponent
              :default_value="fromBusinessName"
              label="Nombre del negocio"
              disabled
              placeholder="-"
              :rules="[]"
            />
          </div>
          <div class="col-12 col-md-4">
            <GenericSelectorComponent
              :default_value="modelsFilterAccounting.daily_closing"
              :label="'Tipo cierre'"
              :placeholder="'Seleccione'"
              :required="false"
              map_options
              :disabled="modelsFilterAccounting.daily_closing === 'Mensual'"
              :manual_option="modifyManualOptions"
              :rules="[
                (val) =>
                  useRules().is_required(val, 'Tipo cierre es requerido'),
              ]"
              @update:model-value="
                (val) => (modelsFilterAccounting.daily_closing = val)
              "
            />
          </div>
          <div class="col-12 col-md-4">
            <GenericDateInputComponent
              :default_value="modelsFilterAccounting.date_to_consolidate"
              :label="'Consolidar a fecha'"
              map_options
              :manual_option="[]"
              :placeholder="'AAAA-MM-DD'"
              :required="false"
              :rules="[
                (val) =>
                  useRules().is_required(
                    val,
                    'Consolidar a fecha es requerido'
                  ),
              ]"
              @update:model-value="
                (val) => (modelsFilterAccounting.date_to_consolidate = val)
              "
            />
          </div>
          <div class="col-12 col-md-4">
            <GenericSelectorComponent
              :default_value="
                modelsFilterAccounting.to_consolidation_business_code
              "
              :label="'Hasta negocio consolidador'"
              map_options
              :manual_option="business_trusts_to_consolidate"
              :placeholder="'Seleccione'"
              :required="false"
              :rules="[
                (val) =>
                  useRules().is_required(
                    val,
                    'Hasta negocio consolidador es requerido'
                  ),
              ]"
              @update:model-value="
                (val) =>
                  (modelsFilterAccounting.to_consolidation_business_code = val)
              "
            />
          </div>
          <div class="col-12 col-md-4">
            <GenericInputComponent
              :default_value="toBusinessName"
              label="Nombre del negocio"
              disabled
              placeholder="-"
              :rules="[]"
            />
          </div>
          <div class="col-12">
            <div class="row q-gutter-x-md justify-end">
              <div class="col-auto">
                <Button
                  :outline="true"
                  label="Limpiar"
                  size="md"
                  unelevated
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="handleClearPrimaryFilter"
                />
              </div>
              <div class="col-auto">
                <Button
                  :outline="false"
                  label="Buscar"
                  size="md"
                  unelevated
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="initialSearchAction"
                />
              </div>
            </div>
          </div>
        </div>
      </template>
    </VCard>
    <VCard v-if="action === 'details'">
      <template #content-card>
        <section class="q-mt-lg q-pa-lg">
          <TableList
            :title="tableDetailAccountingShort.title"
            :loading="tableDetailAccountingShort.loading"
            :columns="tableDetailAccountingShort.columns"
            :rows="tableDetailAccountingShort.rows"
            :pages="tableDetailAccountingShort.pages"
            :custom-columns="['status', 'actions']"
          />
        </section>
      </template>
    </VCard>
    <section v-if="action === 'process' && filterAndTableRef">
      <FiltersComponent
        v-if="!visibleBtn"
        :ref="filterComponentRef"
        :fields="filterBasicDataConfig"
        @filter="handleFilterSearch"
        @clear-filters="handleClear"
      />
    </section>
    <section class="q-mt-xl">
      <TableList
        v-if="action === 'process' && filterAndTableRef"
        :title="tableBusinessesConsolidating.title"
        :loading="tableBusinessesConsolidating.loading"
        :columns="tableBusinessesConsolidating.columns"
        :rows="tableBusinessesConsolidating.rows"
        :pages="tableBusinessesConsolidating.pages"
        selection="multiple"
        @selected="selectRows"
        :custom-columns="['status', 'actions']"
      >
        <template #custom-header-action v-if="!visibleBtn">
          <Button
            v-if="disabledBtn && !disabledBtnDownload"
            :outline="true"
            label="Descargar excel"
            :leftImg="excelIcon"
            :disabled="(selectedRows?.length ?? 0) === 0"
            tooltip="Descargar excel"
            @click="downloadExcelFile"
          />
          <Button
            v-if="disabledBtnDownload"
            :outline="true"
            label="Descargar excel novedades"
            :leftImg="excelIcon"
            :disabled="(selectedRows?.length ?? 0) === 0"
            tooltip="Descargar excel novedades"
            @click="downloadDetailsExcelFile"
          />
        </template>
        <template #status="{ row }">
          <ShowStatus
            :type="Number(row.last_consolidation?.status?.id ?? 0)"
            statusType="accounting"
          />
        </template>
        <template #actions="{ row }">
          <Button
            v-if="row.last_consolidation?.status?.status === 'Exitoso'"
            :right-icon="defaultIconsLucide.eye"
            color="orange"
            :class-custom="'custom'"
            :outline="true"
            :tooltip="'Ver balance'"
            :flat="true"
            size=""
            @click="
              goToURL('AccountingConsolidationView', consolidationId ?? 0)
            "
          />
          <Button
            v-if="row.last_consolidation?.status?.status === 'Con novedades'"
            :right-icon="defaultIconsLucide.listCheck"
            color="orange"
            :class-custom="'custom'"
            :outline="true"
            :flat="true"
            :tooltip="'Ver novedades'"
            @click="
              goToURL('AccountingConsolidationDetail', consolidationId ?? 0)
            "
          />
        </template>
      </TableList>
      <div class="col-12">
        <div class="row q-gutter-x-md justify-end">
          <div class="col-auto">
            <Button
              :outline="false"
              label="Consolidar"
              size="md"
              v-if="filterAndTableRef"
              unelevated
              color="orange"
              :disabled="selectedRows.length === 0"
              class="text-capitalize btn-filter custom"
              @click="obSubmitConsolidate"
            />
          </div>
        </div>
      </div>
    </section>
    <section class="q-mt-xl" v-if="filterAndTableRef">
      <TableList
        :title="tableConsolidationAccounting.title"
        :loading="tableConsolidationAccounting.loading"
        :columns="tableConsolidationAccounting.columns"
        :rows="tableConsolidationAccounting.rows"
        :pages="tableConsolidationAccounting.pages"
        :custom-columns="['status', 'actions', 'radio']"
      />
    </section>
  </q-form>
</template>

<script setup lang="ts">
//Components
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'

//Interfaces
import { ActionTypeProcess } from '@/interfaces/global'
import { IAccountingConsolidationBasicData } from '@/interfaces/customs/accounting/AccountingConsolidationV2'

//Comoposables
import { useRules } from '@/composables/useRules'

//Utils and icons
import { defaultIconsLucide } from '@/utils'

//Assets
import excelIcon from '@/assets/images/excel.svg'

//logicView
import useBasicDataForm from '@/components/Forms/Accounting/AccountingConsolidation/v2/BasicDataform'

//Props with logicForm
const props = withDefaults(
  defineProps<{
    action: ActionTypeProcess
    data?: IAccountingConsolidationBasicData | null
  }>(),
  {}
)
const {
  //Filter props
  filterBasicDataConfig,
  filterComponentRef,
  filterBasicDataViewConfig,
  //Table properties and references
  tableBusinessesConsolidating,
  tableConsolidationAccounting,
  models,
  account_chart_structure_accounting,
  business_trusts_to_consolidate,
  modelsFilterAccounting,
  filterAndTableRef,
  selectedRows,
  toBusinessName,
  fromBusinessName,
  tableDetailAccounting,
  consolidationId,
  modelsDetail,
  disabledBtnDownload,
  disabledBtn,
  tableDetailAccountingShort,
  visibleBtn,
  tableViewConsolidatedAccounting,
  tableViewDataChildren,
  consolidationIdReferenceView,
  modifyManualOptions,
  //Excel export functions
  handleFilterSearchView,
  downloadDetailsExcelFile,
  obSubmitConsolidate,
  downloadExcelFile,
  initialSearchAction,
  goToURL,
  handleClearView,
  handleClear,
  selectRows,
  handleFilterSearch,
  handleShowMoreFilters,
  handleClearPrimaryFilter,
} = useBasicDataForm(props)
</script>
