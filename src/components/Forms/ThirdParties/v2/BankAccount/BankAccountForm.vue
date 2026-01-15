<script setup lang="ts">
// Components
import TableList from '@/components/table-list/TableList.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import BankAccountGenerator from '@/components/Forms/BankAccountGenerator/BankAccountGenerator.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'

// Utils
import { defaultIcons } from '@/utils'
import { useRules } from '@/composables'
import { useBankAccountForm } from './BankAccountForm'
import { IThirdParty } from '@/interfaces/global'

// Props
const props = withDefaults(
  defineProps<{
    formType: 'create' | 'edit' | 'view'
    data?: IThirdParty | null
  }>(),
  {}
)

// Handle emits to view:
const emit = defineEmits(['onContinue', 'onBack'])

const {
  models,
  isBankGeneratorOpen,
  customColumns,
  tableProperties,
  itemToEdit,
  formElementRef,
  banks,
  bank_branches,
  bank_types,

  // Methods
  addToTable,
  editRecord,
  handleOptions,
  setMainItem,
  setActivePayment,
  handleSave,
} = useBankAccountForm(props, emit)
</script>

<template>
  <div class="q-pa-lg">
    <q-form ref="formElementRef">
      <section>
        <p class="text-black text-weight-medium text-h6 q-mb-md">
          Cuenta bancaria
        </p>

        <div
          class="row q-col-gutter-sm"
          v-if="['create', 'edit'].includes(formType)"
        >
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
            <GenericSelectorComponent
              :default_value="models.bank_id ?? null"
              :manual_option="banks"
              label="Nombre del banco"
              :auto_complete="true"
              :first_filter_option="'label'"
              :second_filter_option="'label'"
              :required="true"
              :map_options="true"
              :rules="[
                (val: string) => useRules().is_required(val, 'El nombre del banco es requerido.') 
                ]"
              @update:modelValue="models.bank_id = $event"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
            <GenericSelectorComponent
              :default_value="models.branch"
              :manual_option="models.bank_id ? bank_branches.filter((branch: any) => branch.bank_id === models.bank_id) : []"
              label="Sucursal"
              :auto_complete="true"
              :first_filter_option="'label'"
              :second_filter_option="'label'"
              :required="false"
              :map_options="true"
              :rules="[]"
              @update:modelValue="models.branch = $event"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
            <GenericInputComponent
              label="Código del banco"
              disabled
              :default_value="models.bank_code"
              @update:model-value="models.bank_code = $event"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
            <GenericInputComponent
              label="Ciudad"
              disabled
              :default_value="models.city"
              @update:model-value="models.city = $event"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
            <GenericSelectorComponent
              :default_value="models.type ?? ''"
              :manual_option="bank_types"
              label="Tipo de cuenta"
              :auto_complete="true"
              :first_filter_option="'label'"
              :second_filter_option="'label'"
              :required="true"
              :map_options="true"
              :rules="[
                (val: string) => useRules().is_required(val, 'El tipo de cuenta es requerida.')
                ]"
              @update:modelValue="models.type = $event"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
            <GenericInputComponent
              label="Número de cuenta"
              required
              :default_value="models.account_number ?? ''"
              type="number"
              :rules="[
                (val: string) => useRules().only_alphanumeric(val),
                (val: string) => useRules().max_length(val, 20),
                (val: string) => useRules().min_length(val, 6),
                (val: string) => /^(?!0+$).*$/.test(val) || 'El valor no puede ser solo ceros',
              ]"
              @update:model-value="models.account_number = $event"
            />
          </div>

          <div
            class="col-xs-12 col-sm-12 col-md-2 col-lg-2 place-content--center"
          >
            <q-btn
              @click="addToTable"
              class="full-width btn-filter"
              size="md"
              rounded
              no-caps
              outline
              dense
              :icon="defaultIcons.plusCircleOutline"
              label="Añadir"
            />
          </div>
        </div>
      </section>

      <section class="q-mt-md" v-if="tableProperties.rows.length > 0">
        <TableList
          :loading="tableProperties.loading"
          :rows="tableProperties.rows"
          :columns="tableProperties.columns"
          :custom-columns="customColumns"
          :rowsPerPageOptions="[20]"
          :hide-header="tableProperties.rows.length === 0"
          :hide-bottom="true"
        >
          <!-- Custom title table -->
          <template #custom-header>
            <p
              v-show="tableProperties.rows.length !== 0"
              class="text-black text-weight-bold text-body1"
            >
              {{ tableProperties.title }}
            </p>
          </template>

          <!-- Custom -->
          <template #is_main="{ row }">
            <div style="box-sizing: border-box">
              <q-checkbox
                :disable="['view'].includes(formType)"
                color="orange"
                :model-value="row.is_main"
                @click="setMainItem(row.id)"
              />
            </div>
          </template>
          <template #has_active_payments="{ row }">
            <div style="box-sizing: border-box">
              <q-radio
                :disable="['view'].includes(formType)"
                left-label
                color="primary_fiduciaria"
                :model-value="row.has_active_payments"
                @update:model-value="setActivePayment(row.id, $event)"
                :val="true"
                label="Si"
              />
              <q-radio
                :disable="['view'].includes(formType)"
                left-label
                color="primary_fiduciaria"
                :model-value="row.has_active_payments"
                @update:model-value="setActivePayment(row.id, $event)"
                :val="false"
                label="No"
              />
            </div>
          </template>

          <!-- Actions -->
          <template #actions="{ row }">
            <q-btn
              flat
              round
              size="md"
              icon="mdi-pencil-outline"
              color="orange"
              class="no-border"
              @click="editRecord(row, row.id)"
            >
              <q-tooltip
                transition-show="flip-right"
                transition-hide="flip-left"
                class="primary"
              >
                <p class="q-ma-none text-body2">Editar</p>
              </q-tooltip>
            </q-btn>

            <q-btn
              flat
              round
              size="md"
              icon="mdi-trash-can-outline"
              color="orange"
              class="no-border"
              @click="handleOptions('delete', row)"
            >
              <q-tooltip
                transition-show="flip-right"
                transition-hide="flip-left"
                class="primary"
              >
                <p class="q-ma-none text-body2">Eliminar</p>
              </q-tooltip>
            </q-btn>
          </template>

          <template #custom-no-data>
            <div
              class="column justify-center items-center q-col-gutter-y-lg q-mt-sm"
            >
              <img
                src="@/assets/images/icons/no_data_2.svg"
                alt="No hay datos para mostrar"
                width="180px"
              />
              <p class="text-weight-bold text-h5 text-center">
                No hay datos para mostrar
              </p>
            </div>
          </template>
        </TableList>
      </section>
      <template v-else>
        <div
          class="column justify-center items-center q-col-gutter-y-lg q-mt-sm"
        >
          <img
            src="@/assets/images/icons/no_data_2.svg"
            alt="No hay datos para mostrar"
            width="180px"
          />
          <p class="text-weight-bold text-h5 text-center">
            No hay datos para mostrar
          </p>
        </div>
      </template>
    </q-form>
  </div>

  <BankAccountGenerator
    v-model:is-open="isBankGeneratorOpen"
    required
    :itemToEdit="itemToEdit"
    @save="handleSave($event)"
  />
</template>
