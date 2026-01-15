<template>
  <q-form ref="formInformation">
    <section>
      <div class="mx-3 mt-0 mb-3">
        <div class="row q-col-gutter-lg mt-1">
          <div class="col-xs-12 col-sm-3" v-if="['view'].includes(action)">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-90 ' : 'text-grey-7'
              "
            >
              Código estructura
            </p>

            <p class="text-grey-7">
              {{ models.code ?? 'No registrado' }}
            </p>
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-90 ' : 'text-grey-7'
              "
            >
              Estructura contable{{
                ['create', 'edit'].includes(action) ? '*' : ''
              }}
            </p>
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :manual_option="account_structures_available_for_store"
              :map_options="true"
              :required="true"
              :default_value="models.account_structure_id"
              :auto_complete="true"
              @update:modelValue="models.account_structure_id = $event"
              :rules="[(val: string) => !!val || 'La estructura es requerida']"
              :disabled="!['create'].includes(action)"
            />
            <p v-else class="text-grey-7 mb-0">
              {{ models.account_structure_id ?? 'No registrado' }}
            </p>
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-90 ' : 'text-grey-7'
              "
            >
              Finalidad{{ ['create', 'edit'].includes(action) ? '*' : '' }}
            </p>
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              :required="false"
              :default_value="infoFilters.purpose"
              :placeholder="''"
              disabled
            />
            <p v-else class="text-grey-7 mb-0">
              {{ infoFilters.purpose ?? 'No registrado' }}
            </p>
          </div>

          <div
            class="col-12 col-sm-6 col-md-3"
            v-show="!['edit'].includes(action)"
          >
            <p
              class="text-weight-medium mb-0"
              :class="
                ['view'].includes(action) ? 'text-black-90 ' : 'text-grey-7'
              "
            >
              Estado{{ ['create', 'edit'].includes(action) ? '*' : '' }}
            </p>
            <ShowStatus
              :type="infoFilters.status === StatusID.ACTIVE ? 1 : 2"
            />
          </div>
        </div>
        <q-separator class="mt-1" />

        <div class="row q-col-gutter-lg mt-1">
          <div class="col-12 col-sm-6 col-md-3">
            <div class="row items-center no-wrap">
              <div class="col">
                <GenericSelectorComponent
                  label="Buscador"
                  :manual_option="opsSearch"
                  :map_options="true"
                  :first_filter_option="'code'"
                  :second_filter_option="'code'"
                  :required="false"
                  :default_value="infoFilters.row_id"
                  :auto_complete="true"
                  :rules="[]"
                  @update:model-value="infoFilters.row_id = $event"
                  match_mode="exact"
                />
              </div>
            </div>
          </div>
        </div>
        <q-separator class="mt-1" />
      </div>
    </section>

    <section v-if="models.account_structure_id" class="q-mt-xl">
      <section class="mx-4 mb-4 h-full" :class="'q-pt-lg amounts-table'">
        <TableList
          rowKey="id"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :custom-columns="[
            'actions',
            'status_id',
            'has_cost_center',
            'applies_ica_withholding_income',
            'applies_withholding_profits',
            'is_currency_reexpressed',
          ]"
          :rows-per-page-options="[500]"
          :filter="infoFilters.row_id"
          :filter-method="customFilter"
          hide-bottom
        >
          <template #custom-header>
            <div>
              <p class="q-my-none text-weight-medium text-h5">
                {{ tableProps.title }}
              </p>
            </div>
            <q-space />

            <Button
              v-if="!['view'].includes(props.action)"
              no-caps
              unelevated
              :label="'Agregar'"
              :leftIcon="defaultIconsLucide.plusCircle"
              :color-icon="'white'"
              :text-color="'white'"
              :outline="false"
              :color="'primary'"
              :tooltip="'Agregar cuenta contable'"
              @click=";(isModalOpen = true), (itemEdit = undefined)"
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
            <div class="q-pa-md">
              <ShowStatus :type="Number(row?.status_id ?? 1)" />
            </div>
          </template>

          <template #actions="{ row }">
            <!-- Editar -->
            <Button
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

          <template #has_cost_center="{ row }">
            <div class="q-pa-md">
              <q-checkbox
                v-if="['create', 'edit'].includes(action)"
                dense
                :model-value="row.has_cost_center"
                color="orange"
              />
              <p v-else>
                {{ row.has_cost_center ? 'Si' : 'No' }}
              </p>
            </div>
          </template>

          <template #applies_ica_withholding_income="{ row }">
            <div class="q-pa-md">
              <q-checkbox
                v-if="['create', 'edit'].includes(action)"
                dense
                :model-value="row.applies_ica_withholding_income"
                color="orange"
              />
              <p v-else>
                {{ row.applies_ica_withholding_income ? 'Si' : 'No' }}
              </p>
            </div>
          </template>

          <template #applies_withholding_profits="{ row }">
            <div class="q-pa-md">
              <q-checkbox
                v-if="['create', 'edit'].includes(action)"
                dense
                :model-value="row.applies_withholding_profits"
                color="orange"
              />
              <p v-else>
                {{ row.applies_withholding_profits ? 'Si' : 'No' }}
              </p>
            </div>
          </template>

          <template #is_currency_reexpressed="{ row }">
            <div class="q-pa-md">
              <q-checkbox
                v-if="['create', 'edit'].includes(action)"
                dense
                :model-value="row.is_currency_reexpressed"
                color="orange"
              />
              <p v-else>
                {{ row.is_currency_reexpressed ? 'Si' : 'No' }}
              </p>
            </div>
          </template>
        </TableList>
      </section>
    </section>
  </q-form>

  <AccountingAccount
    :is-open="isModalOpen"
    :is-editing="itemEdit ? true : false"
    :action="action"
    :item-edit="itemEdit"
    @save="handleSave"
    @update:is-open="isModalOpen = $event"
  />

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
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'
import AccountingAccount from './AccountingAccount/AccountingAccount.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// Logic
import useInformationForm from './InformationForm'

// Interfaces
import { IChartAccountCreate } from '@/interfaces/customs'
import { ActionType, StatusID } from '@/interfaces/global'

// Utils
import { defaultIconsLucide } from '@/utils'
import excelIcon from '@/assets/images/excel.svg'

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
  alertModalRef,
  formInformation,
  account_structures_available_for_store,
  tableProps,
  isModalOpen,
  itemEdit,
  infoFilters,
  opsSearch,

  isDataImport,
  handleSave,
  editItem,
  handleDeleteList,
  deleteItem,
  exportAccountCharts,
  customFilter,
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
