<template>
  <q-form ref="formInformation">
    <section>
      <section class="row">
        <div
          class="col row q-col-gutter-lg"
          :class="props.action === 'view' ? 'items-start' : 'items-end'"
        >
          <div class="col-12 col-sm-6 col-md-3">
            <template v-if="props.action === 'view'">
              <p class="text-weight-medium mb-0 text-black-90">
                Estructura contable
              </p>
              <p class="text-grey-7">
                {{ props.data?.structure?.code ?? 'No registrado' }}
              </p>
            </template>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              label="Estructura contable"
              map_options
              auto_complete
              :required="false"
              :disabled="!['create'].includes(action)"
              :default_value="models.account_structure_id"
              :manual_option="accounting_account_structures"
              @update:modelValue="selectStructure($event)"
              :rules="[(val: string) => useRules().is_required(val)]"
            />
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <template v-if="props.action === 'view'">
              <p class="text-weight-medium mb-0 text-black-90">Finalidad</p>
              <p class="text-grey-7">
                {{ props.data?.structure?.purpose ?? 'No registrado' }}
              </p>
            </template>
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              label="Finalidad"
              disabled
              :required="false"
              :default_value="selectedStructure?.purpose"
              :rules="[(val: string) => useRules().is_required(val)]"
            />
          </div>
          <div v-if="props.action === 'view'" class="col-12 col-sm-6 col-md-3">
            <p class="text-weight-medium mb-0 text-black-90">
              Diseño de la estructura
            </p>
            <p class="text-grey-7">
              {{ props.data?.structure?.structure ?? 'No registrado' }}
            </p>
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <template v-if="props.action === 'view'">
              <p class="text-weight-medium mb-0 text-black-90">Estado</p>
              <p class="text-grey-7">
                <ShowStatus :type="Number(selectedStructure?.status_id || 0)" />
              </p>
            </template>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              label="Estado"
              disabled
              map_options
              auto_complete
              :required="false"
              :default_value="selectedStructure?.status_id"
              :manual_option="default_statuses"
              :rules="[(val: string) => useRules().is_required(val)]"
            />
          </div>
          <div v-if="props.action !== 'view'" class="col-12 col-sm-6 col-md-3">
            <GenericInput
              label="Buscador"
              :required="false"
              placeholder="Buscar por código o nombre"
              :default_value="listParams.search"
              @update:model-value="searchFilter($event)"
              :rules="[]"
            />
          </div>
        </div>
        <Button
          v-if="props.action !== 'view'"
          :icon="defaultIconsLucide.filter"
          :outline="false"
          color="white"
          :color-icon="'#762344'"
          :class="'q-pa-none custom items-center q-pl-md col-auto'"
          @click="openAdvancedFilters"
        />
      </section>
      <q-separator class="q-mb-lg" />
      <section v-if="props.action === 'view'" class="row">
        <div class="col-12 col-sm-6 col-md-6">
          <GenericInput
            label="Buscador"
            :required="false"
            placeholder="Buscar por código o nombre"
            :default_value="listParams.search"
            @update:model-value="searchFilter($event)"
            :rules="[]"
          />
        </div>
        <Button
          :icon="defaultIconsLucide.filter"
          :outline="false"
          color="white"
          :color-icon="'#762344'"
          :class="'q-pa-none custom items-center q-pl-md col-auto'"
          @click="openAdvancedFilters"
        />
      </section>
    </section>
    <q-separator class="q-mb-lg" v-if="props.action === 'view'" />
    <section v-if="selectedStructure">
      <section class="" :class="'amounts-table'">
        <TableList
          dense
          rowKey="id"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :columns="tableProps.columns"
          :loading="tableProps.loading"
          :filter-method="customFilter"
          :custom-columns="[
            'actions',
            'status_id',
            'difference',
            'accounting_account',
            'aux',
            'movements',
          ]"
          @update-page="updatePage"
          @update-rows-per-page="updateRows"
        >
          <template #custom-header>
            <div>
              <p class="q-my-none text-weight-bold text-h6">
                {{ tableProps.title }}
              </p>
            </div>
            <q-space />

            <Button
              v-if="['create'].includes(props.action) && !isDataImport"
              no-caps
              unelevated
              :label="'Agregar'"
              :leftIcon="defaultIconsLucide.plusCircle"
              :color-icon="'white'"
              :text-color="'white'"
              :outline="false"
              :color="'primary'"
              :tooltip="'Agregar cuenta contable'"
              @click="openAddAccountModal"
            />
            <Button
              v-if="['view'].includes(props.action)"
              :outline="true"
              label="Descargar excel"
              :leftImg="excelIcon"
              :disabled="tableProps.rows.length === 0"
              tooltip="Descargar excel"
              @click="exportAccountCharts"
            />
          </template>

          <template #status_id="{ row }">
            <ShowStatus :type="Number(row?.status_id ?? 1)" />
          </template>

          <template #actions="{ row }">
            <!-- Editar -->
            <Button
              v-if="!row.id || props.action === 'edit'"
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Editar'"
              :disabled="isDataImport"
              @click="editItem(row)"
            />
            <!-- Eliminar -->
            <Button
              v-if="
                (!row.id || props.action === 'edit') &&
                validateRouter('Accounting', 'ChartAccountsList', 'delete')
              "
              :left-icon="defaultIconsLucide.trash"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Eliminar'"
              :disabled="isDataImport"
              @click="handleDeleteList(row)"
            />
          </template>
          <template #difference>
            <div class="q-py-sm">
              <p class="mb-0">Positivo</p>
              <q-separator spaced></q-separator>
              <p class="mb-0">Negativo</p>
            </div>
          </template>
          <template #accounting_account="{ row }">
            <div class="q-py-sm">
              <p class="mb-0">
                {{
                  row.reexpression_settings?.positive?.account_code?.label ||
                  '-'
                }}
              </p>
              <q-separator spaced></q-separator>
              <p class="mb-0">
                {{
                  row.reexpression_settings?.negative?.account_code?.label ||
                  '-'
                }}
              </p>
            </div>
          </template>
          <template #aux="{ row }">
            <div class="q-py-sm">
              <p class="mb-0">
                {{
                  row.reexpression_settings?.positive?.third_party?.label || '-'
                }}
              </p>
              <q-separator spaced></q-separator>
              <p class="mb-0">
                {{
                  row.reexpression_settings?.negative?.third_party?.label || '-'
                }}
              </p>
            </div>
          </template>
          <template #movements="{ row }">
            <div class="q-py-sm">
              <p class="mb-0">
                {{
                  row.reexpression_settings?.positive?.third_party?.label || '-'
                }}
              </p>
              <q-separator spaced></q-separator>
              <p class="mb-0">
                {{
                  row.reexpression_settings?.negative?.third_party?.label || '-'
                }}
              </p>
            </div>
          </template>
        </TableList>
      </section>
    </section>
  </q-form>

  <AlertModalComponent
    ref="addAccountChartModalRef"
    styleModal="min-width: 70%"
    title-header="Agregar cuenta contable"
    margin-top-body="mb-0"
    :show-img-default="false"
    :text-btn-confirm="itemEdit ? 'Actualizar' : 'Agregar'"
    @confirm="handleSave"
  >
    <template #default-body>
      <AccountingAccountForm
        ref="accountingAccountFormRef"
        :action="itemEdit ? 'edit' : 'create'"
        :data="itemEdit"
      />
    </template>
  </AlertModalComponent>
  <AlertModalComponent
    ref="advancedFiltersModalRef"
    styleModal="min-width: 70%"
    title-header="Busqueda avanzada"
    margin-top-body="mb-0"
    text-btn-confirm="Buscar"
    :show-img-default="false"
    @confirm="handleAdvancedFilters"
  >
    <template #default-body>
      <AdvancedFilters ref="advancedFiltersRef" />
    </template>
  </AlertModalComponent>

  <AlertModalComponent
    ref="alertModalRef"
    styleModal="min-width: 470px"
    title="Confirmación"
    description_message="¿Está seguro que desea eliminar esta cuenta contable?"
    @confirm="deleteItem"
  />
</template>

<script setup lang="ts">
// Components
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import AdvancedFilters from '@/components/Forms/Accounting/ChartAccounts/information/v2/AdvancedFilters.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import AccountingAccountForm from '@/components/Forms/Accounting/ChartAccounts/information/v2/AccountingAccountForm.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'

// Logic
import useInformationForm from '@/components/Forms/Accounting/ChartAccounts/information/v2/InformationForm'

// Interfaces
import { IChartAccountCreate } from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'

// Utils
import excelIcon from '@/assets/images/excel.svg'
import { useRules } from '@/composables'
import { default_statuses } from '@/constants'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IChartAccountCreate | null
  }>(),
  {}
)

const emits = defineEmits(['validate:form', 'isImport'])

const {
  models,
  itemEdit,
  listParams,
  tableProps,
  isDataImport,
  alertModalRef,
  formInformation,
  selectedStructure,
  defaultIconsLucide,
  advancedFiltersRef,
  advancedFiltersModalRef,
  addAccountChartModalRef,
  accountingAccountFormRef,
  accounting_account_structures,
  editItem,
  updatePage,
  updateRows,
  handleSave,
  deleteItem,
  customFilter,
  searchFilter,
  selectStructure,
  handleDeleteList,
  exportAccountCharts,
  openAddAccountModal,
  openAdvancedFilters,
  handleAdvancedFilters,
  validateRouter,
} = useInformationForm(props)

defineExpose({
  validateForm: () => formInformation.value?.validate(),
  isImport: () => isDataImport.value,
})
</script>

<style lang="scss" scoped>
:deep(.amounts-table) {
  .q-field {
    padding-bottom: 0 !important;
  }
  .q-select .q-field__native {
    min-height: unset;
  }
}
</style>
