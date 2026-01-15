<template>
  <q-form ref="formFinance" class="q-pa-lg">
    <section>
      <div class="q-mb-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Información financiera
        </p>
        <p
          v-if="['create', 'edit'].includes(action)"
          class="text-grey-6 text-weight-medium q-mb-none"
        >
          Proporcione los datos sobre la información financiera de su nuevo
          cliente como persona natural.
        </p>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mt-lg">
        <!-- Total ingresos operacionales -->
        <div class="col-12 col-md-4">
          <p
            class="text-weight-medium mb-0"
            :class="['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'"
          >
            Total ingresos operacionales mensuales{{ ['create','edit'].includes(action) ? '*' : '' }}
          </p>

          <CurrencyInput
            v-if="['create', 'edit'].includes(action)"
            v-model="models.financial_info.total_operational_income"
            :currency="'COP'"
            currencyLabel=""
            :rules="[
              (v) => useRules().is_required(v),
              (v) => useRules().max_length(v, 20),
              (v) => useRules().only_number_greater_than_zero(v),
            ]"
            :disabled="['view'].includes(action)"
          />

          <p v-else class="text-grey-6 mb-0">
            {{ formatCurrencyString(models.financial_info.total_operational_income) ?? 'No registrado' }}
          </p>
        </div>

        <!-- Total egresos -->
        <div class="col-12 col-md-4">
          <p
            class="text-weight-medium mb-0"
            :class="['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'"
          >
            Total egresos operacionales mensuales{{ ['create','edit'].includes(action) ? '*' : '' }}
          </p>

          <CurrencyInput
            v-if="['create','edit'].includes(action)"
            v-model="models.financial_info.total_expenses"
            :currency="'COP'"
            currencyLabel=""
            :rules="[
              (v) => useRules().is_required(v),
              (v) => useRules().max_length(v, 20),
              (v) => useRules().only_number_greater_than_zero(v),
            ]"
            :disabled="['view'].includes(action)"
          />

          <p v-else class="text-grey-6 mb-0">
            {{ formatCurrencyString(models.financial_info.total_expenses) ?? 'No registrado' }}
          </p>
        </div>

        <!-- Total ingresos no operacionales -->
        <div class="col-12 col-md-4">
          <p
            class="text-weight-medium mb-0"
            :class="['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'"
          >
            Total ingresos no operacionales mensuales{{ ['create','edit'].includes(action) ? '*' : '' }}
          </p>

          <CurrencyInput
            v-if="['create','edit'].includes(action)"
            v-model="models.financial_info.total_non_operational_income"
            :currency="'COP'"
            currencyLabel=""
            :rules="[
              (v) => useRules().is_required(v),
              (v) => useRules().max_length(v, 20),
              (v) => useRules().only_number_greater_than_zero(v),
            ]"
            :disabled="['view'].includes(action)"
          />

          <p v-else class="text-grey-6 mb-0">
            {{ formatCurrencyString(models.financial_info.total_non_operational_income) ?? 'No registrado' }}
          </p>
        </div>

        <!-- Concepto otros ingresos -->
        <div class="col-12 col-md-4">
          <p
            class="text-weight-medium mb-0 ellipsis"
            :class="['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'"
          >
            Concepto otros ingresos no operacionales mensuales
          </p>

          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.financial_info.other_non_operational_income_concept"
            :required="Number(models.financial_info.total_non_operational_income) > 0"
            :rules="
              Number(models.financial_info.total_non_operational_income) > 0
                ? [
                    (v) => useRules().is_required(v),
                    (v) => useRules().only_letters(v),
                    (v) => useRules().max_length(v, 30),
                  ]
                : []
            "
            @update:model-value="models.financial_info.other_non_operational_income_concept = $event"
            :disabled="['view'].includes(action)"
          />

          <p v-else class="text-grey-6 mb-0">
            {{ models.financial_info.other_non_operational_income_concept ?? 'No registrado' }}
          </p>
        </div>

        <!-- Total activos -->
        <div class="col-12 col-md-4">
          <p
            class="text-weight-medium mb-0"
            :class="['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'"
          >
            Total activos{{ ['create','edit'].includes(action) ? '*' : '' }}
          </p>

          <CurrencyInput
            v-if="['create','edit'].includes(action)"
            v-model="models.financial_info.assets"
            :currency="'COP'"
            currencyLabel=""
            :rules="[
              (v) => useRules().is_required(v),
              (v) => useRules().max_length(v, 20),
              (v) => useRules().only_number_greater_than_zero(v),
              (v) => {
                const clean = v.replace(/\\./g,'').replace(/,/g,'')
                return !models.financial_info.report_income || Number(clean) > 1000 || 'El total de activos debe ser mayor a 1000'
              }
            ]"
            :disabled="['view'].includes(action)"
          />

          <p v-else class="text-grey-6 mb-0">
            {{ formatCurrencyString(models.financial_info.assets) ?? 'No registrado' }}
          </p>
        </div>

        <!-- Total pasivos -->
        <div class="col-12 col-md-4">
          <p
            class="text-weight-medium mb-0"
            :class="['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'"
          >
            Total pasivos{{ ['create','edit'].includes(action) ? '*' : '' }}
          </p>

          <CurrencyInput
            v-if="['create','edit'].includes(action)"
            v-model="models.financial_info.liabilities"
            :currency="'COP'"
            currencyLabel=""
            :rules="[
              (v) => useRules().is_required(v),
              (v) => useRules().max_length(v, 20),
              (v) => useRules().only_number_greater_than_zero(v),
              (v) => {
                const clean = v.replace(/\\./g,'').replace(/,/g,'')
                return !models.financial_info.report_income || Number(clean) > 1000 || 'El total de pasivos debe ser mayor a 1000'
              }
            ]"
            :disabled="['view'].includes(action)"
          />

          <p v-else class="text-grey-6 mb-0">
            {{ formatCurrencyString(models.financial_info.liabilities) ?? 'No registrado' }}
          </p>
        </div>

        <!-- Fecha de corte -->
        <div class="col-12 col-md-4">
          <p
            class="text-weight-medium mb-0 ellipsis"
            :class="['view'].includes(action) ? 'text-black-10 ' : 'text-grey-6'"
          >
            Fecha de corte información financiera{{ ['create','edit'].includes(action) ? '*' : '' }}
          </p>

          <GenericDateInputComponent
            v-if="['create','edit'].includes(action)"
            :default_value="models.financial_info.cutoff_date"
            :required="true"
            :option_calendar="optionsCalendar"
            @update:model-value="models.financial_info.cutoff_date = $event"
            :rules="[(v) => useRules().is_required(v)]"
            :disabled="['view'].includes(action)"
          />

          <p v-else class="text-grey-6 mb-0">
            {{ models.financial_info.cutoff_date ?? 'No registrado' }}
          </p>
        </div>
      </div>

      <q-separator class="q-mt-sm" />
    </section>

    <!-- ===========================
      CUENTAS BANCARIAS
    =========================== -->
    <section class="q-mt-lg">
      <div class="q-mb-lg flex justify-between">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">Cuentas bancarias</p>

        <Button
          v-if="['create'].includes(action)"
          :label="'Crear'"
          :left-icon="defaultIconsLucide.plusCircle"
          color-icon="white"
          :outline="false"
          color="orange"
          @click="handleOpenCreateModal"
        />
      </div>

      <VCard>
        <template #content-card>
          <div class="q-pa-lg">
            <div
              v-if="tableProperties.rows.length === 0"
              class="flex column justify-center items-center q-py-xl"
            >
              <img src="@/assets/images/icons/no_data_accounting.svg" class="q-mb-lg" />
              <p class="text-weight-bold text-h6 text-center">
                Actualmente no hay cuentas bancarias asociadas
              </p>
            </div>

            <TableList
              v-else
              hidePagination
              :title="tableProperties.title"
              :loading="tableProperties.loading"
              :rows="tableProperties.rows"
              :columns="tableProperties.columns"
              :custom-columns="['actions', 'principal', 'status']"
            >
              <template #status="{ row }">
                <ShowStatus :type="row.status" class-custom="q-px-sm q-py-xs" />
              </template>

              <template #principal="{ row }">
                <q-radio
                  v-model="principalSelected"
                  :val="row.account_number"
                  color="orange"
                  class="cursor-pointer"
                  disabled
                />
              </template>

              <template #actions="{ row }">
                <!-- Editar (abre modal) -->
                <Button
                  v-if="['create', 'edit'].includes(action)"
                  :left-icon="defaultIconsLucide.edit"
                  color="orange"
                  :class-custom="'custom'"
                  :outline="false"
                  :flat="true"
                  colorIcon="#f45100"
                  tooltip="Editar"
                  @click="handleOpenEditModal(row)"
                />

                <!-- Eliminar -->
                <Button
                  v-if="['create', 'edit'].includes(action)"
                  :left-icon="defaultIconsLucide.delete"
                  color="orange"
                  :class-custom="'custom'"
                  :outline="false"
                  :flat="true"
                  colorIcon="#f45100"
                  tooltip="Eliminar"
                  @click="handleOptions('delete', row.account_number)"
                />
              </template>
            </TableList>
          </div>
        </template>
      </VCard>
    </section>

    <!-- ===========================
         ORIGEN DE LOS FONDOS
         =========================== -->
    <section class="q-mt-lg">
      <div class="q-mb-lg">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Origen de los fondos
        </p>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <div v-if="['edit', 'create'].includes(action)">
            <p class="text-weight-medium mb-0">Origen de los fondos*</p>

            <GenericSelectorComponent
              :manual_option="legal_people_fund_sources"
              :map_options="true"
              :required="true"
              :default_value="models.financial_info.legal_people_found_source_id"
              :auto_complete="true"
              :rules="[(v) => useRules().is_required(v)]"
              @update:modelValue="models.financial_info.legal_people_found_source_id = $event"
            />
          </div>

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Origen de los fondos</p>
            <p class="text-weight-medium no-margin">
              {{ models.financial_info.funding_source ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <div v-if="['edit', 'create'].includes(action)">
            <GenericInputComponent
              :default_value="models.financial_info.other_legal_people_found_source"
              label="Otro"
              type="text"
              placeholder="Otro"
              @update:model-value="models.financial_info.other_legal_people_found_source = $event"
            />
          </div>

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Otro</p>
            <p class="text-weight-medium no-margin">
              {{ models.financial_info.other_legal_people_found_source ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-12">
          <div class="row items-center no-wrap" v-if="['edit', 'create'].includes(action)">
            <RadioYesNo
              v-model="models.financial_info.report_income"
              class="q-pt-md q-pl-sm"
              hasTitle
              title="¿La persona jurídica está inscrita en el registro nacional de emisores y además están sujetos a requisitos de revelación de información?*"
              :hasSubtitle="false"
            />
          </div>

          <div v-else class="text-black-90 mt-2">
            <p class="text-weight-bold no-margin">
              ¿La persona jurídica está inscrita en el registro nacional de emisores y además están sujetos a requisitos de revelación de información?
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.financial_info.report_income ? 'SI' : 'NO' }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===========================
      MODAL CREATE/EDIT
    =========================== -->
    <ModalComponent v-model:openDialog="openBankAccountModal" minWidth="60%">
      <template #content-modal>
        <div class="q-mx-lg q-col-gutter-md">
          <p class="text-h5 text-weight-bold">
            {{ bankAccountModalMode === 'create' ? 'Asociar cuenta bancaria' : 'Editar cuenta bancaria' }}
          </p>

          <div class="row q-col-gutter-x-lg q-col-gutter-y-sm items-center">
            <!-- Banco -->
            <div class="col-12 col-md-4">
              <p class="text-weight-medium mb-0" :class="['view'].includes(action)?'text-black-90':'text-grey-6'">
                Banco*
              </p>

              <GenericSelectorComponent
                v-if="['create','edit'].includes(action)"
                :manual_option="banks"
                :map_options="true"
                :default_value="bankAccountModels.bank_id"
                @update:modelValue="bankAccountModels.bank_id = $event"
                :required="true"
                :rules="[(v)=>useRules().is_required(v)]"
              />
            </div>

            <!-- Tipo de cuenta -->
            <div class="col-12 col-md-4">
              <p class="text-weight-medium mb-0" :class="['view'].includes(action)?'text-black-90':'text-grey-6'">
                Tipo de cuenta*
              </p>

              <GenericSelectorComponent
                v-if="['create','edit'].includes(action)"
                :manual_option="bank_types"
                :map_options="true"
                :default_value="bankAccountModels.account_type_id"
                :required="true"
                @update:modelValue="bankAccountModels.account_type_id = $event"
                :rules="[(v)=>useRules().is_required(v)]"
              />
            </div>

            <!-- Número de cuenta -->
            <div class="col-12 col-md-4">
              <p class="text-weight-medium mb-0 ellipsis" :class="['view'].includes(action)?'text-black-90':'text-grey-6'">
                Número de cuenta*
              </p>

              <GenericInput
                v-if="['create','edit'].includes(action)"
                required
                :default_value="bankAccountModels.account_number"
                type="number"
                :rules="[
                  (v)=>useRules().is_required(v),
                  (v)=>useRules().only_number_greater_than_zero(v),
                  (v)=>useRules().max_length(v,20),
                ]"
                @update:model-value="bankAccountModels.account_number = String($event ?? '')"
              />
            </div>

            <!-- Sucursal -->
            <div class="col-12 col-md-6">
              <GenericSelectorComponent
                v-if="['create','edit'].includes(action)"
                label="Sucursal"
                :manual_option="bank_branches"
                :map_options="true"
                :default_value="bankAccountModels.bank_branch_id"
                @update:modelValue="bankAccountModels.bank_branch_id = $event"
                :required="true"
                :rules="[(v)=>useRules().is_required(v)]"
              />
            </div>

            <!-- Estado -->
            <div class="col-12 col-md-6">
              <GenericSelectorComponent
                v-if="['create','edit'].includes(action)"
                label="Estado"
                :manual_option="default_statuses"
                :map_options="true"
                :default_value="bankAccountModels.status_id"
                @update:modelValue="bankAccountModels.status_id = $event"
                :rules="[(v)=>useRules().is_required(v)]"
                :required="true"
              />
            </div>

            <div class="row flex">
              <q-checkbox
                v-model="bankAccountModels.is_main"
                color="orange"
                dense
                class="cde-checkbox"
              />
              <p class="q-ml-sm q-mt-md">Cuenta principal</p>
            </div>
          </div>

          <div class="row q-mt-lg flex justify-center">
            <Button
              :outline="false"
              :label="bankAccountModalMode === 'create' ? 'Crear' : 'Guardar'"
              color="orange"
              class="text-capitalize btn-filter custom"
              @click="saveBankAccount"
            />
          </div>
        </div>
      </template>
    </ModalComponent>

    <!-- ===========================
      ALERT DELETE
     =========================== -->
    <AlertModalComponent
      ref="alertModalDelete"
      styleModal="min-width: 480px"
      title="¿Desea eliminar la cuenta bancaria seleccionada?"
      @confirm="deleteBankAccount(String(alertModalDeleteConfig.account_number))"
    />
  </q-form>
</template>

<script setup lang="ts">
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'
import useFinanceForm from '@/components/Forms/Clients/v2/NaturalPerson/Indirect/Finance/FinanceForm'
import ModalComponent from '@/components/common/Modal/ModalComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'

import { useRules } from '@/composables'
import { useUtils } from '@/composables'
import type { INaturalClientFinanceForm } from '@/interfaces/customs'
import { default_statuses } from '@/constants'
import { ActionType } from '@/interfaces/global'

const { defaultIconsLucide } = useUtils()

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: INaturalClientFinanceForm | null
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: INaturalClientFinanceForm | null): void
}>()

const {
  models,
  formFinance,

  banks,
  bank_types,
  bank_branches,
  legal_people_fund_sources,

  formatCurrencyString,
  optionsCalendar,

  tableProperties,
  principalSelected,

  handleOptions,
  deleteBankAccount,
  alertModalDeleteConfig,

  openBankAccountModal,
  bankAccountModalMode,
  bankAccountModels,
  handleOpenCreateModal,
  handleOpenEditModal,
  saveBankAccount,
} = useFinanceForm(props, (event, value) =>
  event === 'update:data' ? emits('update:data', value as INaturalClientFinanceForm | null) : undefined
)

defineExpose({
  validateForm: () => formFinance.value?.validate(),
})
</script>
