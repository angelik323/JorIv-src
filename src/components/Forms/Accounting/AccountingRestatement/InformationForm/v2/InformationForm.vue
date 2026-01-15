<template>
  <q-form
    ref="informationFormRef"
    aria-label="Formulario de información de la reexpresión por diferencia en cambio"
  >
    <VCard>
      <template #content-card>
        <div
          class="row q-col-gutter-x-lg q-col-gutter-y-sm q-pa-md"
          v-if="action === 'details'"
        >
          <div class="col-12 col-md-4 q-my-sm">
            <div class="text-black-90">
              <p class="text-weight-semibold no-margin">Proceso</p>
              <p class="text-weight-medium">
                {{ models.view_data?.process_info?.name ?? '-' }}
              </p>
            </div>
          </div>
          <div class="col-12 col-md-4 q-my-sm">
            <div class="text-black-90">
              <p class="text-weight-semibold no-margin">Estado del proceso</p>
              <p class="text-weight-medium">
                {{ models.view_data?.process_info?.status ?? '-' }}
              </p>
            </div>
          </div>
          <div class="col-12 col-md-4 q-my-sm">
            <div class="text-black-90">
              <p class="text-weight-semibold no-margin">Fecha del proceso</p>
              <p class="text-weight-medium">
                {{ models.view_data?.process_info?.date ?? '-' }}
              </p>
            </div>
          </div>
          <div class="col-12 col-md-4 q-my-sm">
            <div class="text-black-90">
              <p class="text-weight-semibold no-margin">Estructura contable</p>
              <p class="text-weight-medium">
                {{ models.view_data?.process_info?.structure ?? '-' }}
              </p>
            </div>
          </div>
          <div class="col-12 col-md-4 q-my-sm">
            <div class="text-black-90">
              <p class="text-weight-semibold no-margin">Negocio</p>
              <p class="text-weight-medium">
                {{ models.view_data?.restatement_detail?.negocio ?? '-' }}
              </p>
            </div>
          </div>
          <div class="col-12 col-md-4 q-my-sm">
            <div class="text-black-90">
              <p class="text-weight-semibold no-margin">Periodo</p>
              <p class="text-weight-medium">
                {{ models.view_data?.restatement_detail?.periodo ?? '-' }}
              </p>
            </div>
          </div>
          <div class="col-12 col-md-4 q-my-sm">
            <div class="text-black-90">
              <p class="text-weight-semibold no-margin">Fecha</p>
              <p class="text-weight-medium">
                {{ models.view_data?.restatement_detail?.fecha ?? '-' }}
              </p>
            </div>
          </div>
          <div class="col-12 col-md-4 q-my-sm">
            <div class="text-black-90">
              <p class="text-weight-semibold no-margin">Cuenta contable</p>
              <p class="text-weight-medium">
                {{
                  models.view_data?.restatement_detail?.cuenta_contable ?? '-'
                }}
              </p>
            </div>
          </div>
          <div class="col-12 col-md-4 q-my-sm">
            <div class="text-black-90">
              <p class="text-weight-semibold no-margin">Tercero</p>
              <p class="text-weight-medium">
                {{ models.view_data?.restatement_detail?.tercero ?? '-' }}
              </p>
            </div>
          </div>
          <div class="col-12 col-md-4 q-my-sm">
            <div class="text-black-90">
              <p class="text-weight-semibold no-margin">
                Saldo en moneda extranjera
              </p>
              <p class="text-weight-medium">
                {{
                  models.view_data?.restatement_detail
                    ?.saldo_moneda_extranjera ?? '-'
                }}
              </p>
            </div>
          </div>
          <div class="col-12 col-md-4 q-my-sm">
            <div class="text-black-90">
              <p class="text-weight-semibold no-margin">Moneda</p>
              <p class="text-weight-medium">
                {{ models.view_data?.restatement_detail?.moneda ?? '-' }}
              </p>
            </div>
          </div>
          <div class="col-12 col-md-4 q-my-sm">
            <div class="text-black-90">
              <p class="text-weight-semibold no-margin">
                Saldo en moneda local
              </p>
              <p class="text-weight-medium">
                {{
                  models.view_data?.restatement_detail?.saldo_moneda_local ??
                  '-'
                }}
              </p>
            </div>
          </div>
          <div class="col-12 col-md-4 q-my-sm">
            <div class="text-black-90">
              <p class="text-weight-semibold no-margin">TRM del día</p>
              <p class="text-weight-medium">
                {{ models.view_data?.restatement_detail?.trm_dia ?? '-' }}
              </p>
            </div>
          </div>
          <div class="col-12 col-md-4 q-my-sm">
            <div class="text-black-90">
              <p class="text-weight-semibold no-margin">Saldo reexpresado</p>
              <p class="text-weight-medium">
                {{
                  models.view_data?.restatement_detail?.saldo_reexpresado ?? '-'
                }}
              </p>
            </div>
          </div>
          <div class="col-12 col-md-4 q-my-sm">
            <div class="text-black-90">
              <p class="text-weight-semibold no-margin">Diferencia</p>
              <p class="text-weight-medium">
                {{ models.view_data?.restatement_detail?.diferencia ?? '-' }}
              </p>
            </div>
          </div>
          <div class="col-12 col-md-4 q-my-sm">
            <div class="text-black-90">
              <p class="text-weight-semibold no-margin">Estado</p>
              <p class="text-weight-medium">
                {{ models.view_data?.restatement_detail?.estado ?? '-' }}
              </p>
            </div>
          </div>
        </div>
        <div
          class="row q-col-gutter-x-lg q-col-gutter-y-sm q-pa-md"
          v-if="action === 'view'"
        >
          <div class="col-12 col-md-4 q-my-sm">
            <div class="text-black-90">
              <p class="text-weight-semibold no-margin">Periodo</p>
              <p class="text-weight-medium">
                {{ models.process_data?.periodo ?? '-' }}
              </p>
            </div>
          </div>
          <div class="col-12 col-md-4 q-my-sm">
            <div class="text-black-90">
              <p class="text-weight-semibold no-margin">Estructura contable</p>
              <p class="text-weight-medium">
                {{ models.process_data?.estructura_contable ?? '-' }}
              </p>
            </div>
          </div>
          <div class="col-12 col-md-4 q-my-sm">
            <div class="text-black-90">
              <p class="text-weight-semibold no-margin">Desde negocio</p>
              <p class="text-weight-medium">
                {{ models.process_data?.desde_negocio ?? '-' }}
              </p>
            </div>
          </div>
          <div class="col-12 col-md-4 q-my-sm">
            <div class="text-black-90">
              <p class="text-weight-semibold no-margin">Día a actualizar</p>
              <p class="text-weight-medium">
                {{ models.process_data?.fecha_proceso ?? '-' }}
              </p>
            </div>
          </div>
          <div class="col-12 col-md-4 q-my-sm">
            <div class="text-black-90">
              <p class="text-weight-semibold no-margin">Hasta negocio</p>
              <p class="text-weight-medium">
                {{ models.process_data?.hasta_negocio ?? '-' }}
              </p>
            </div>
          </div>
        </div>
        <q-separator
          class="q-mx-md q-my-lg"
          v-if="action === 'view' || action === 'details'"
        />
        <section
          class="q-pa-md"
          v-if="action === 'process' || action === 'undo'"
        >
          <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
            <div class="col-12 col-md-3">
              <GenericDateInputComponent
                :default_value="modelsFilterVoucher.period"
                label="Periodo"
                auto_complete
                placeholder="YYYY-MM"
                mask="YYYY-MM"
                required
                :rules="[
              (val: string) => useRules().is_required(val, 'El periodo es requerido'),
            ]"
                @update:model-value="
                  (val) => (modelsFilterVoucher.period = val)
                "
              />
            </div>
            <div class="col-12 col-md-3">
              <GenericSelectorComponent
                :default_value="modelsFilterVoucher.accounting_structure_id"
                label="Estructura contable"
                auto_complete
                map_options
                :manual_option="account_structures"
                required
                :rules="[
              (val: string) => useRules().is_required(val, 'La estructura contable es requerida'),
            ]"
                @update:model-value="
                  (val) => (modelsFilterVoucher.accounting_structure_id = val)
                "
              />
            </div>
            <div class="col-12 col-md-3">
              <GenericSelectorComponent
                :default_value="modelsFilterVoucher.from_business_code"
                label="Desde negocio"
                auto_complete
                map_options
                :manual_option="businessTrustsByStructure"
                required
                :rules="[
              (val: string) => useRules().is_required(val, 'El negocio desde es requerido'),
            ]"
                @update:model-value="
                  (val) => (modelsFilterVoucher.from_business_code = val)
                "
              />
            </div>
            <div class="col-12 col-md-3">
              <GenericInputComponent
                :default_value="fromBusinessName"
                label="Nombre del negocio"
                disabled
                placeholder="-"
                :rules="[]"
              />
            </div>
            <div class="col-12 col-md-3">
              <GenericSelectorComponent
                :default_value="modelsFilterVoucher.closing_type"
                label="Tipo de cierre"
                map_options
                :required="action === 'undo' ? true : false"
                :manual_option="consolidation_type_options"
                :rules="[]"
                @update:model-value="
                  (val) => (modelsFilterVoucher.closing_type = val)
                "
              />
            </div>
            <div class="col-12 col-md-3">
              <GenericDateInputComponent
                :default_value="modelsFilterVoucher.generation_date"
                :label="
                  action === 'process' ? 'Fecha a generar' : 'Fecha a deshacer'
                "
                auto_complete
                placeholder="YYYY-MM-DD"
                required
                :disabled="modelsFilterVoucher.closing_type === 'Mensual'"
                :rules="[
              (val: string) => useRules().is_required(val, 'La fecha es requerida'),
            ]"
                @update:model-value="
                  (val) => (modelsFilterVoucher.generation_date = val)
                "
              />
            </div>
            <div class="col-12 col-md-3">
              <GenericSelectorComponent
                :default_value="modelsFilterVoucher.to_business_code"
                label="Hasta negocio"
                auto_complete
                map_options
                :manual_option="businessTrustsToOptions"
                required
                :rules="[
              (val: string) => useRules().is_required(val, 'El negocio destino es requerido'),
            ]"
                @update:model-value="
                  (val) => (modelsFilterVoucher.to_business_code = val)
                "
              />
            </div>
            <div class="col-12 col-md-3">
              <GenericInputComponent
                :default_value="toBusinessName"
                label="Nombre del negocio"
                placeholder="-"
                disabled
              />
            </div>
          </div>

          <q-separator class="q-my-lg" />
          <div class="flex justify-end q-gutter-sm">
            <Button
              label="Limpiar"
              unelevated
              :outline="true"
              color="orange"
              @click="clearFilters"
            />
            <Button
              :label="props.action === 'process' ? 'Reexpresar' : 'Buscar'"
              unelevated
              :disabled="
                !modelsFilterVoucher.period ||
                !modelsFilterVoucher.accounting_structure_id ||
                !modelsFilterVoucher.from_business_code ||
                !modelsFilterVoucher.generation_date ||
                !modelsFilterVoucher.to_business_code ||
                (action === 'undo' && !modelsFilterVoucher.closing_type)
              "
              :outline="false"
              color="orange"
              @click="restatementSubmitProcess()"
            />
          </div>
        </section>
      </template>
    </VCard>
    <section
      v-if="
        ((action === 'process' || action === 'undo') && showFilterAndTable) ||
        action === 'view' ||
        action === 'details'
      "
    >
      <section
        class="q-mt-md"
        v-if="action === 'process' || action === 'undo' || action === 'view'"
      >
        <FiltersComponent
          :fields="filterConfigChildren"
          @clear-filters="handleClear"
          @filter="handleFilterSearch"
        />
      </section>
      <VCard>
        <template #content-card>
          <section class="q-mt-xl q-pa-md">
            <TableList
              v-if="action === 'process' || action === 'view'"
              :title="tablePropertiesCalculation.title"
              :loading="false"
              :columns="tablePropertiesCalculation.columns"
              :rows="tablePropertiesCalculation.rows"
              :pages="tablePropertiesCalculation.pages"
              :selection="
                (action as string) !== 'view' && (action as string) !== 'details' ? 'multiple' : 'none'
              "
              row-key="uniqueKey"
              v-model:selected="selectedRows"
              @update:model-value="(val: string, row: IExchangeDifferenceRestatementListCalculationsItem) => {
                if (val) {
                  if (!selectedRows.some((r) => r.id === row.id)) {
                  selectedRows.push(row)
                  }
                } else {
                  const index = selectedRows.findIndex((r) => r.id === row.id)
                  if (index > -1) {
                  selectedRows.splice(index, 1)
                  }
                }
                }"
              @update:page="updatePage"
              @update:rows-per-page="updateRowsPerPage"
              :custom-columns="['status', 'actions', 'radio']"
            >
              <template #custom-header-action>
                <Button
                  :outline="true"
                  label="Descargar excel"
                  :leftImg="excelIcon"
                  :disabled="tablePropertiesCalculation.rows.length === 0"
                  tooltip="Descargar excel"
                  @click="downloadExcelCalculation()"
                />
              </template>
              <template #status="{ row }">
                <ShowStatus
                  :type="Number(row.estado?.id ?? 0)"
                  statusType="accounting"
                />
              </template>
              <template #actions="{ row }">
                <Button
                  v-if="row.estado?.status !== 'Exitoso'"
                  :right-icon="defaultIconsLucide.eye"
                  color="orange"
                  :class-custom="'custom'"
                  :outline="false"
                  :flat="true"
                  size=""
                  @click="
                    goToURL('ExchangeDifferenceRestatementDetail', {
                      id: row.id,
                    })
                  "
                />
              </template>
            </TableList>
            <TableList
              v-else-if="action === 'undo'"
              :title="tableUndoProcess.title"
              :loading="false"
              :columns="tableUndoProcess.columns"
              :rows="tableUndoProcess.rows"
              :pages="tableUndoProcess.pages"
              :selection="
                (action as string) !== 'view' && (action as string) !== 'details' ? 'multiple' : 'none'
              "
              row-key="uniqueKey"
              v-model:selected="selectedRows"
              @update:model-value="(val: string, row: IExchangeDifferenceRestatementListCalculationsItem) => {
                if (val) {
                  if (!selectedRows.some((r) => r.id === row.id)) {
                  selectedRows.push(row)
                  }
                } else {
                  const index = selectedRows.findIndex((r) => r.id === row.id)
                  if (index > -1) {
                  selectedRows.splice(index, 1)
                  }
                }
                }"
              @update:page="updatePage"
              @update:rows-per-page="updateRowsPerPage"
              :custom-columns="['status', 'actions', 'radio']"
            >
              <template #custom-header-action>
                <Button
                  :outline="true"
                  label="Descargar excel"
                  :leftImg="excelIcon"
                  :disabled="tableUndoProcess.rows.length === 0"
                  tooltip="Descargar excel"
                  @click="downloadExcelCalculation()"
                />
              </template>
            </TableList>
            <TableList
              v-else-if="action === 'details'"
              :loading="false"
              :columns="tableDetails.columns"
              :rows="tableDetails.rows"
              :pages="tableDetails.pages"
            />
            <q-separator class="q-my-lg" />
            <div
              class="flex justify-end q-mt-md"
              v-if="action === 'process' || action === 'undo'"
            >
              <Button
                class="q-mt-md"
                :label="props.action === 'process' ? 'Procesar' : 'Deshacer'"
                unelevated
                :outline="false"
                :disabled="typeStatusRow || selectedRows.length === 0"
                color="orange"
                @click="openModalRef"
              />
            </div>
          </section>
        </template>
      </VCard>
      <VCard v-if="action === 'process' || action === 'view'">
        <template #content-card>
          <section class="q-mt-xl q-pa-md">
            <TableList
              :title="tablePropertiesVoucher.title"
              :loading="false"
              :columns="tablePropertiesVoucher.columns"
              :rows="tablePropertiesVoucher.rows"
              :pages="tablePropertiesVoucher.pages"
              :custom-columns="['actions']"
            >
              <template #actions="{ row }">
                <Button
                  :right-icon="defaultIconsLucide.eye"
                  color="orange"
                  :class-custom="'custom'"
                  :outline="false"
                  :flat="true"
                  size=""
                  @click="
                    goToURL('ExchangeDifferenceRestatementView', {
                      id: row.id,
                    })
                  "
                />
              </template>
              <template #custom-header-action>
                <Button
                  :outline="true"
                  label="Descargar excel"
                  :leftImg="excelIcon"
                  :disabled="tablePropertiesVoucher.rows.length === 0"
                  tooltip="Descargar excel"
                  @click="downloadExcelVoucher()"
                />
              </template>
            </TableList>
          </section>
        </template>
      </VCard>
    </section>
  </q-form>
</template>

<script setup lang="ts">
//Components
import Button from '@/components/common/Button/Button.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import TableList from '@/components/table-list/TableList.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'

//Composables
import { useRules } from '@/composables'

//assets
import excelIcon from '@/assets/images/excel.svg'

//Interfaces for emits and data
import {
  IExchangedDifferenceRestatementDataForm,
  IExchangeDifferenceRestatementListCalculationsItem,
} from '@/interfaces/customs/accounting/AccountingRestatement'
import { ActionTypeProcess } from '@/interfaces/global'

//Logic
import useInformationForm from '@/components/Forms/Accounting/AccountingRestatement/InformationForm/v2/InformationForm'

const props = withDefaults(
  defineProps<{
    action: ActionTypeProcess
    data?: IExchangedDifferenceRestatementDataForm | null
  }>(),
  {}
)

const emit = defineEmits<{
  (e: 'validate:form'): void
  (
    e: 'update:data',
    value: IExchangedDifferenceRestatementDataForm | null
  ): void
  (e: 'modal:process', value: boolean): void
  (e: 'changeUndo:process', value: number): void
}>()

const {
  //Header properties and filter methods
  filterConfigChildren,
  handleClear,
  handleFilterSearch,
  updatePage,
  updateRowsPerPage,
  clearFilters,

  //Tables properties
  tablePropertiesCalculation,
  tablePropertiesVoucher,
  tableDetails,
  tableUndoProcess,

  //Selectors
  account_structures,
  consolidation_type_options,
  businessTrustsByStructure,
  businessTrustsToOptions,
  toBusinessName,
  fromBusinessName,
  typeStatusRow,

  //States
  modelsFilterVoucher,
  showFilterAndTable,
  models,
  selectedRows,

  //Refs
  informationFormRef,

  //Icons
  defaultIconsLucide,

  //Functions
  restatementSubmitProcess,
  openModalRef,
  goToURL,
  downloadExcelVoucher,
  downloadExcelCalculation,
} = useInformationForm(props, emit)

defineExpose({
  validateForm: () => informationFormRef.value?.validate(),
})
</script>
