<template>
  <div class="q-pa-md">
    <template v-if="changeViewCreate">
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-6">
          <p class="text-weight-medium mb-0" :class="'text-grey-6'">
            Desde fecha {{ '*' }}
          </p>
          <GenericDateInputComponent
            :map_options="true"
            :auto_complete="true"
            :clearable="true"
            :placeholder="'Seleccione'"
            :required="true"
            :default_value="models.date_from"
            :rules="[]"
            @update:modelValue="(val) => (models.date_from = val)"
          />
        </div>
        <div class="col-12 col-md-6">
          <p class="text-weight-medium mb-0" :class="'text-grey-6'">
            Hasta fecha {{ '*' }}
          </p>
          <GenericDateInputComponent
            :map_options="true"
            :auto_complete="true"
            :clearable="true"
            :placeholder="'Seleccione'"
            :required="true"
            :default_value="models.date_to"
            :rules="[]"
            @update:modelValue="(val) => (models.date_to = val)"
          />
        </div>
        <div class="col-12 col-md-3">
          <p class="text-weight-medium mb-0" :class="'text-grey-6'">
            Desde negocio {{ '*' }}
          </p>
          <GenericSelectorComponent
            :manual_option="business_trusts_by_date_range"
            :map_options="true"
            :auto_complete="true"
            :clearable="true"
            :placeholder="'Seleccione'"
            :required="true"
            :default_value="models.from_business_id"
            :rules="[]"
            @update:modelValue="(val) => (models.from_business_id = val)"
          />
        </div>
        <div class="col-12 col-md-3">
          <p class="text-weight-medium mb-0" :class="'text-grey-6'">
            Último proceso de reexpresión
          </p>
          <GenericInputComponent
            :map_options="true"
            :auto_complete="true"
            :clearable="true"
            :disabled="true"
            :placeholder="'Seleccione'"
            :required="true"
            :default_value="''"
            :rules="[]"
            @update:modelValue="(val) => (models.to_business_id = val)"
          />
        </div>
        <div class="col-12 col-md-3">
          <p class="text-weight-medium mb-0" :class="'text-grey-6'">
            Hasta negocio {{ '*' }}
          </p>
          <GenericSelectorComponent
            :manual_option="business_trusts_by_date_range"
            :map_options="true"
            :auto_complete="true"
            :clearable="true"
            :placeholder="'Seleccione'"
            :required="true"
            :default_value="models.to_business_id"
            :rules="[]"
            @update:modelValue="(val) => (models.to_business_id = val)"
          />
        </div>
        <div class="col-12 col-md-3">
          <p class="text-weight-medium mb-0" :class="'text-grey-6'">
            último proceso de reexpresión
          </p>
          <GenericInputComponent
            :map_options="true"
            :auto_complete="true"
            :clearable="true"
            :placeholder="'Seleccione'"
            :required="true"
            :disabled="true"
            :default_value="null"
            :rules="[]"
            @update:modelValue="selectStructure($event)"
          />
        </div>
      </div>
      <q-separator class="q-my-xl" />
      <div class="row justify-end q-gutter-md">
        <Button
          :outline="true"
          label="Atrás"
          size="md"
          color="orange"
          class="text-capitalize btn-filter custom"
          @click="changeViewCreate = false"
        />
        <Button
          :outline="false"
          label="Continuar"
          size="md"
          color="orange"
          class="text-capitalize btn-filter custom"
          @click="onSubmitPayload"
        />
      </div>
    </template>
    <template v-else-if="changeStateProcess">
      <VCard>
        <template #content-card>
          <div class="q-pa-xl">
            <TableList
              :title="processPendingTable.title"
              :loading="processPendingTable.loading"
              :columns="processPendingTable.columns"
              :rows="processPendingTable.rows"
              :custom-columns="['status', 'actions']"
              hide-bottom
            />
          </div>
          <div class="row justify-end q-gutter-md q-pa-md">
            <Button
              color="orange"
              :outline="false"
              :label="'Atrás'"
              :flat="true"
              :class-custom="'custom'"
              @click="afterStateView"
            />
          </div>
        </template>
      </VCard>
    </template>
    <template v-else>
      <section>
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
          <div class="col-12 col-md-4">
            <p class="text-weight-medium mb-0" :class="'text-grey-6'">
              Estructura {{ '*' }}
            </p>
            <GenericSelectorComponent
              :manual_option="account_structures_with_purpose"
              :map_options="true"
              :auto_complete="true"
              :clearable="true"
              :placeholder="'Seleccione'"
              :required="true"
              :default_value="null"
              :rules="[]"
              @update:modelValue="selectStructure($event)"
            />
          </div>
          <div class="col-12 col-md-4">
            <p class="text-weight-medium mb-0" :class="'text-grey-6'">
              Código de comprobante
            </p>
            <GenericSelectorComponent
              :manual_option="receipt_types_by_structure"
              :map_options="true"
              :auto_complete="true"
              :clearable="true"
              :placeholder="'Seleccione'"
              :required="true"
              :default_value="selectedReceipt"
              :rules="[]"
              @update:modelValue="selectReceipt($event)"
            />
          </div>
          <div class="col-12 col-md-4">
            <p class="text-weight-medium mb-0" :class="'text-grey-6'">
              Código subtipo de comprobante
            </p>
            <GenericSelectorComponent
              :manual_option="sub_receipt_types_by_type"
              :map_options="true"
              :auto_complete="true"
              :clearable="true"
              :placeholder="'Seleccione'"
              :required="true"
              :default_value="selectedSubReceiptType"
              :rules="[]"
              @update:modelValue="selectSubReceiptType($event)"
            />
          </div>
        </div>
      </section>
      <q-separator spaced />
      <section class="q-pt-lg catalog-limit-table">
        <TableList
          :title="operatingAccountsTableProps.title"
          :loading="operatingAccountsTableProps.loading"
          :columns="operatingAccountsTableProps.columns"
          :rows="operatingAccountsTableProps.rows"
          :custom-columns="['status', 'actions']"
          hide-bottom
        >
          <template #status="{ row }">
            <ShowStatus :type="Number(row?.status.id ?? 1)" clickable />
          </template>
          <template #actions="{ row }">
            <Button
              :left-icon="defaultIconsLucide.plusCircle"
              color="primary"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Agregar cuenta"
              @click="openModal(row.id)"
            />
          </template>
        </TableList>
      </section>
      <q-separator spaced />

      <AlertModalComponent
        v-model="showModal"
        :openDialog="showModal"
        :title-header="'Agregar cuenta'"
        styleModal="max-width: 100vw; width: 60%"
        :showBtnConfirm="true"
        :showBtnCancel="true"
        :showImgDefault="false"
        :showCloseBtn="true"
        @confirm="changeReferenceStatus"
        :disable-confirm="
          !models.cost_structure_by_chart_id ||
          !models.const_center_id ||
          !models.aux_type_id ||
          (selectedDifference === 'Negativa' && !models.expense_fund_tpmv) ||
          (selectedDifference === 'Ambas' &&
            (!models.income_fund_tpmv || !models.expense_fund_tpmv)) ||
          (selectedDifference === 'Positiva' && !models.income_fund_tpmv)
        "
        @close="handleCloseModal"
      >
        <template #default-body>
          <div class="q-mx-xl">
            <VCard>
              <template #content-card>
                <div class="q-pa-md">
                  <p class="text-h6">Agregar configuración</p>

                  <div class="row">
                    <div class="col-12 col-md-7 q-px-sm mb-2">
                      <GenericSelectorComponent
                        label="Diferencia"
                        :manual_option="menuDifference"
                        :map_options="true"
                        :auto_complete="true"
                        :clearable="true"
                        :placeholder="'Seleccione una diferencia'"
                        :required="true"
                        :default_value="selectedDifference"
                        :rules="[]"
                        @update:modelValue="(val) => (selectedDifference = val)"
                      />
                    </div>
                  </div>
                  <q-separator class="q-mt-md q-mb-lg" color="grey-4" />
                  <div
                    v-if="
                      menuReferenceWatch.some(
                        (item) =>
                          item.value === 'Positiva' || item.value === 'Ambas'
                      )
                    "
                  >
                    <p class="text-h6">Diferencia positiva</p>
                    <div class="row">
                      <div class="col-12 col-md-6 q-px-sm mb-2">
                        <GenericSelectorComponent
                          label="Cuenta"
                          :manual_option="[]"
                          :map_options="true"
                          :auto_complete="true"
                          :clearable="true"
                          :disabled="true"
                          :placeholder="'Seleccione una cuenta'"
                          :required="true"
                          :default_value="
                            operating_accounts.find((item) => item)?.name ?? ''
                          "
                          :rules="[]"
                        />
                      </div>
                      <div class="col-12 col-md-6 q-px-sm mb-2">
                        <GenericSelectorComponent
                          label="Estructura centro de costo"
                          :manual_option="cost_structures_by_chart_account"
                          :map_options="true"
                          :auto_complete="true"
                          :clearable="true"
                          :placeholder="'Seleccione una cuenta'"
                          :required="true"
                          :default_value="models.cost_structure_by_chart_id"
                          :rules="[]"
                          @update:modelValue="
                            (val) => (models.cost_structure_by_chart_id = val)
                          "
                        />
                      </div>
                      <div class="col-12 col-md-6 q-px-sm mb-2">
                        <GenericSelectorComponent
                          label="Código centro de costo"
                          :manual_option="cost_center_codes_by_structure"
                          :map_options="true"
                          :auto_complete="true"
                          :clearable="true"
                          :placeholder="'Seleccione una cuenta'"
                          :required="true"
                          :default_value="models.const_center_id"
                          :rules="[]"
                          @update:modelValue="
                            (val) => (models.const_center_id = val)
                          "
                        />
                      </div>
                      <div class="col-12 col-md-6 q-px-sm mb-2">
                        <GenericSelectorComponent
                          label="Auxiliar"
                          :manual_option="thirdMenu"
                          :map_options="true"
                          :auto_complete="true"
                          :clearable="true"
                          :placeholder="'Seleccione una cuenta'"
                          :required="true"
                          :default_value="models.aux_type_id"
                          :rules="[]"
                          @update:modelValue="
                            (val) => (models.aux_type_id = val)
                          "
                        />
                      </div>
                      <div class="col-12 col-md-6 q-px-sm mb-2">
                        <GenericSelectorComponent
                          label="TpMv Fondos ingresos"
                          :manual_option="movement_types"
                          :map_options="true"
                          :auto_complete="true"
                          :clearable="true"
                          :placeholder="'Seleccione una cuenta'"
                          :required="true"
                          :default_value="models.income_fund_tpmv"
                          :rules="[
                          (val: string) => useRules().is_required(val, 'El TpMv Fondos ingresos es requerido')
                        ]"
                          @update:modelValue="
                            (val) => (models.income_fund_tpmv = val)
                          "
                        />
                      </div>
                    </div>
                    <q-separator class="q-mt-md q-mb-lg" color="grey-4" />
                  </div>
                  <div
                    v-if="
                      menuReferenceWatch.some(
                        (item) =>
                          item.value === 'Negativa' || item.value === 'Ambas'
                      )
                    "
                  >
                    <q-separator class="q-mt-md q-mb-lg" color="grey-4" />
                    <p class="text-h6">Diferencia negativa</p>
                    <div class="row">
                      <div class="col-12 col-md-6 q-px-sm mb-2">
                        <GenericSelectorComponent
                          label="Cuenta"
                          :manual_option="[]"
                          :map_options="true"
                          :auto_complete="true"
                          :clearable="true"
                          :disabled="true"
                          :placeholder="'Seleccione una cuenta'"
                          :required="true"
                          :default_value="
                            operating_accounts.find((item) => item)?.name ?? ''
                          "
                          :rules="[]"
                          @update:modelValue="selectedAccountId = $event"
                        />
                      </div>
                      <div class="col-12 col-md-6 q-px-sm mb-2">
                        <GenericSelectorComponent
                          label="Estructura centro de costo"
                          :manual_option="cost_structures_by_chart_account"
                          :map_options="true"
                          :auto_complete="true"
                          :clearable="true"
                          :placeholder="'Seleccione una cuenta'"
                          :required="true"
                          :default_value="models.cost_structure_by_chart_id"
                          :rules="[]"
                          @update:modelValue="
                            (val) => (models.cost_structure_by_chart_id = val)
                          "
                        />
                      </div>
                      <div class="col-12 col-md-6 q-px-sm mb-2">
                        <GenericSelectorComponent
                          label="Código centro de costo"
                          :manual_option="cost_center_codes_by_structure"
                          :map_options="true"
                          :auto_complete="true"
                          :clearable="true"
                          :placeholder="'Seleccione una cuenta'"
                          :required="true"
                          :default_value="models.const_center_id"
                          :rules="[]"
                          @update:modelValue="
                            (val) => (models.const_center_id = val)
                          "
                        />
                      </div>
                      <div class="col-12 col-md-6 q-px-sm mb-2">
                        <GenericSelectorComponent
                          label="Auxiliar"
                          :manual_option="thirdMenu"
                          :map_options="true"
                          :auto_complete="true"
                          :clearable="true"
                          :placeholder="'Seleccione una cuenta'"
                          :required="true"
                          :default_value="models.aux_type_id"
                          :rules="[]"
                          @update:modelValue="
                            (val) => (models.aux_type_id = val)
                          "
                        />
                      </div>
                      <div class="col-12 col-md-6 q-px-sm mb-2">
                        <GenericSelectorComponent
                          label="TpMv Fondos ingresos"
                          :manual_option="movement_types"
                          :map_options="true"
                          :auto_complete="true"
                          :clearable="true"
                          :placeholder="'Seleccione una cuenta'"
                          :required="true"
                          :default_value="models.expense_fund_tpmv"
                          :rules="[]"
                          @update:modelValue="
                            (val) => (models.expense_fund_tpmv = val)
                          "
                        />
                      </div>
                    </div>
                    <q-separator class="q-mt-md q-mb-md" color="grey-4" />
                  </div>
                </div>
              </template>
            </VCard>
          </div>
        </template>
      </AlertModalComponent>
    </template>
  </div>
</template>

<script setup lang="ts">
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import ShowStatus from '@/components/showStatus/ShowStatus.vue'
import Button from '@/components/common/Button/Button.vue'
import { defaultIconsLucide } from '@/utils'
import VCard from '@/components/common/VCard/VCard.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import useTermsForm from './TermsForm'
import { useRules } from '@/composables'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
const {
  account_structures_with_purpose,
  receipt_types_by_structure,
  operatingAccountsTableProps,
  sub_receipt_types_by_type,
  menuDifference,
  operating_accounts,
  models,
  thirdMenu,
  cost_structures_by_chart_account,
  selectedDifference,
  processPendingTable,
  changeStateProcess,
  changeViewCreate,
  showModal,
  movement_types,
  selectedReceipt,
  selectedSubReceiptType,
  cost_center_codes_by_structure,
  menuReferenceWatch,
  selectedAccountId,
  openModal,
  afterStateView,
  selectStructure,
  selectReceipt,
  selectSubReceiptType,
  changeReferenceStatus,
  onSubmitPayload,
  handleCloseModal,
  business_trusts_by_date_range,
} = useTermsForm()
</script>
