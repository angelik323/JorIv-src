<template>
  <div>
    <q-form ref="informationForm" class="q-pa-xl">
      <div class="flex justify-between items-center q-mb-md"></div>

      <div class="flex justify-between items-center q-mb-md">
        <p><b>Detalle de operaciones</b></p>
        <Button
          :outline="false"
          label="Agregar"
          size="md"
          colorIcon="white"
          :class-custom="'q-mx-sm'"
          :left-icon="defaultIconsLucide.plusCircleOutline"
          @click="openModal"
        />
      </div>

      <VCard>
        <template
          #content-card
          v-if="nature_operation === NatureOperation.INCOME"
        >
          <section class="q-pt-lg q-px-lg catalog-limit-table">
            <TableList
              :title="tableProps.title"
              :loading="tableProps.loading"
              :rows="visibleRows"
              :columns="tableProps.columns"
              :pages="tableProps.pages"
              :rows-per-page-options="rowsPerPageOptions"
              @update-page="updatePage"
              @update-rows-per-page="updatePerPage"
              :custom-columns="[
                'identifier_id',
                'title_id',
                'operation_type',
                'currency',
                'origin_currency_value',
                'operation_origin_currency_value',
                'local_currency_transaction_value',
                'resource_placement_date',
                'compliance_date',
                'beneficiary',
                'actions',
              ]"
            >
              <template #custom-no-data>
                <div class="text-center text-grey-7 q-pa-md"></div>
              </template>

              <template #currency="{ row }">
                <GenericSelectorComponent
                  map_options
                  :manual_option="[]"
                  required
                  placeholder="Seleccione"
                  :disabled="true"
                  :rules="[]"
                  :default_value="row.currency"
                />
              </template>

              <template #origin_currency_value="{ row }">
                <div class="flex justify-center q-mb-0">
                  <CurrencyInput
                    required
                    placeholder="-"
                    disabled
                    :rules="[]"
                    :modelValue="row.origin_currency_value"
                  />
                </div>
              </template>

              <template #operation_origin_currency_value="{ row }">
                <div class="flex justify-center q-mb-0">
                  <CurrencyInput
                    required
                    placeholder="-"
                    disabled
                    :rules="[]"
                    :modelValue="row.operation_origin_currency_value"
                  />
                </div>
              </template>

              <template #local_currency_transaction_value="{ row }">
                <div class="flex justify-center q-mb-0">
                  <CurrencyInput
                    required
                    placeholder="-"
                    disabled
                    :rules="[]"
                    :modelValue="row.local_currency_transaction_value"
                  />
                </div>
              </template>

              <template #resource_placement_date="{ row }">
                <div class="flex justify-center q-mb-0">
                  <GenericDateInputComponent
                    required
                    placeholder="-"
                    :rules="[]"
                    disabled
                    :default_value="row.resource_placement_date"
                  />
                </div>
              </template>

              <template #compliance_date="{ row }">
                <div class="flex justify-center q-mb-0">
                  <GenericDateInputComponent
                    required
                    placeholder="-"
                    :rules="[]"
                    disabled
                    :default_value="row.compliance_date"
                  />
                </div>
              </template>

              <template #beneficiary="{ row }">
                <GenericInput
                  required
                  placeholder="-"
                  :rules="[]"
                  :default_value="row.beneficiary"
                  :disabled="true"
                />
              </template>

              <template #title_id="{ row }">
                <GenericSelectorComponent
                  map_options
                  :manual_option="investment_portfolio_titles"
                  required
                  placeholder="Seleccione"
                  :disabled="true"
                  :rules="[]"
                  :default_value="row.title_id"
                />
              </template>

              <template #operation_type="{ row }">
                <GenericInput
                  required
                  disabled
                  placeholder="Seleccione tipo de operación"
                  :rules="[]"
                  :default_value="row.operation_type"
                />
              </template>

              <template #operation_value="{ row }">
                <div class="flex justify-center q-mb-0">
                  <CurrencyInput
                    required
                    placeholder="Ingrese valor"
                    disabled
                    :rules="[]"
                    :modelValue="row.operation_value"
                  />
                </div>
              </template>
              <template #actions="{ row }">
                <div
                  class="flex flex-row justify-center items-center q-gutter-sm"
                >
                  <Button
                    :left-icon="defaultIconsLucide.trash"
                    colorIcon="#f45100"
                    flat
                    outline
                    tooltip="Eliminar"
                    @click="removeItem(row._originalIndex)"
                  />
                  <Button
                    :left-icon="defaultIconsLucide.edit"
                    colorIcon="#f45100"
                    flat
                    outline
                    tooltip="Editar"
                    @click="editItem(row._originalIndex)"
                  />
                </div>
              </template>
            </TableList>
          </section>
        </template>
        <template #content-card v-else-if="nature_operation === 'Egreso'">
          <section class="q-pt-lg q-px-lg catalog-limit-table">
            <section class="q-pt-lg q-px-lg catalog-limit-table">
              <TableList
                :title="tablePropsForeign.title"
                :loading="tablePropsForeign.loading"
                :rows="visibleRows"
                :pages="tablePropsForeign.pages"
                :rows-per-page-options="rowsPerPageOptions"
                @update-page="updatePage"
                @update-rows-per-page="updatePerPage"
                :columns="tablePropsForeign.columns"
                hide-bottom
                no-data-label="Sin registros de operaciones"
                :custom-columns="[
                  'identifier_id',
                  'title_id',
                  'operation_type',
                  'currency',
                  'origin_currency_value',
                  'operation_origin_currency_value',
                  'local_currency_transaction_value',
                  'resource_placement_date',
                  'compliance_date',
                  'beneficiary',
                  'actions',
                ]"
              >
                <template #top>
                  <div class="row text-weight-bold text-grey-8 q-pb-sm q-mt-sm">
                    <div class="col text-center">Número de título</div>
                    <div class="col text-center">Tipo de operación</div>
                    <div class="col text-center">Moneda</div>
                    <div class="col text-center">Valor moneda origen</div>
                    <div class="col text-center">
                      Valor operación moneda origen
                    </div>
                    <div class="col text-center">Valor moneda local</div>
                    <div class="col text-center">Fecha colocación</div>
                    <div class="col text-center">Fecha cumplimiento</div>
                    <div class="col text-center">Beneficiario</div>
                    <div class="col text-center">Acciones</div>
                  </div>
                </template>

                <template #custom-no-data>
                  <div class="column items-center q-pa-lg">
                    <img
                      src="@/assets/images/icons/no_data_accounting.svg"
                      alt="Sin datos"
                      width="120"
                      class="q-mb-md"
                    />
                    <p class="text-weight-bold text-h6 text-center">
                      Actualmente no hay detalles de operaciones
                    </p>
                    <p class="text-weight-light text-h6 text-center">
                      Por favor, importe o agregue uno para continuar con el
                      proceso
                    </p>
                  </div>
                </template>

                <template #beneficiary="{ row }">
                  <GenericInput
                    required
                    placeholder="-"
                    :rules="[]"
                    :disabled="true"
                    :default_value="row.beneficiary"
                    @update:model-value="(val) => (row.beneficiary = val)"
                  />
                </template>

                <template #title_id="{ row }">
                  <GenericSelectorComponent
                    map_options
                    :manual_option="investment_portfolio_titles"
                    required
                    placeholder="Seleccione"
                    :disabled="true"
                    :rules="[]"
                    :default_value="row.title_id"
                    @update:model-value="(val: number) => (models.titleOperation = val)"
                  />
                </template>

                <template #operation_type="{ row }">
                  <GenericInput
                    map_options
                    :manual_option="[]"
                    required
                    disabled
                    placeholder="Seleccione tipo de operación"
                    :rules="[]"
                    :default_value="row.operation_type"
                    @update:model-value="(val: number) => (models.typeOperation = val)"
                  />
                </template>

                <template #currency="{ row }">
                  <GenericSelectorComponent
                    map_options
                    :manual_option="[]"
                    required
                    placeholder="Seleccione"
                    :disabled="true"
                    :rules="[]"
                    :default_value="row.currency"
                  />
                </template>

                <template #origin_currency_value="{ row }">
                  <div class="flex justify-center q-mb-0">
                    <CurrencyInput
                      required
                      placeholder="-"
                      :rules="[]"
                      disabled
                      :modelValue="row.origin_currency_value"
                    />
                  </div>
                </template>

                <template #operation_origin_currency_value="{ row }">
                  <div class="flex justify-center q-mb-0">
                    <CurrencyInput
                      required
                      placeholder="-"
                      disabled
                      :rules="[]"
                      :modelValue="row.operation_origin_currency_value"
                    />
                  </div>
                </template>

                <template #local_currency_transaction_value="{ row }">
                  <div class="flex justify-center q-mb-0">
                    <CurrencyInput
                      required
                      placeholder="-"
                      :rules="[]"
                      disabled
                      :modelValue="row.local_currency_transaction_value"
                    />
                  </div>
                </template>

                <template #resource_placement_date="{ row }">
                  <div class="flex justify-center q-mb-0">
                    <GenericDateInputComponent
                      required
                      placeholder="-"
                      :rules="[]"
                      disabled
                      :default_value="row.resource_placement_date"
                    />
                  </div>
                </template>

                <template #compliance_date="{ row }">
                  <div class="flex justify-center q-mb-0">
                    <GenericDateInputComponent
                      required
                      placeholder="-"
                      :rules="[]"
                      disabled
                      :default_value="row.compliance_date"
                    />
                  </div>
                </template>

                <template #actions="{ row }">
                  <div
                    class="flex flex-row justify-center items-center q-gutter-sm"
                  >
                    <Button
                      :left-icon="defaultIconsLucide.trash"
                      colorIcon="#f45100"
                      flat
                      outline
                      tooltip="Eliminar"
                      @click="removeItem(row._originalIndex)"
                    />
                    <Button
                      :left-icon="defaultIconsLucide.edit"
                      colorIcon="#f45100"
                      flat
                      outline
                      tooltip="Editar"
                      @click="editItem(row._originalIndex)"
                    />
                  </div>
                </template>
              </TableList>
            </section>
          </section>
        </template>
      </VCard>
    </q-form>
  </div>
  <q-dialog v-model="isModalOpen" persistent>
    <q-card
      class="q-px-xl q-pt-lg q-pb-md generator-card"
      style="width: 800px; max-width: 90vw"
      flat
      bordered
    >
      <div class="row justify-between items-center q-mb-md">
        <span class="text-h6 text-black-90 text-weight-bold">
          {{
            nature_operation === NatureOperation.INCOME
              ? 'Agregar forma de recaudo'
              : 'Agregar forma de pago'
          }}
        </span>

        <Button
          class-custom="custom absolute-top-right q-ma-md z-top q-pa-sm"
          color="black"
          flat
          :outline="false"
          :left-icon="defaultIconsLucide.close"
          colorIcon="black"
          aria-label="Cerrar modal"
          @click="closeModal"
        />
      </div>

      <q-form @submit.prevent="addPaymentMethod">
        <section class="q-pa-md">
          <div class="row q-col-gutter-lg q-mb-md">
            <div class="col-12 col-md-4">
              <GenericSelectorComponent
                :manual_option="investment_portfolio_titles"
                label="Número de título"
                required
                placeholder="Seleccione"
                :rules="[]"
                :default_value="modalForm.title_id"
                @update:model-value="(val) => (modalForm.title_id = val)"
              />
            </div>

            <div class="col-12 col-md-4">
              <GenericSelectorComponent
                :manual_option="
                  nature_operation === NatureOperation.INCOME
                    ? investment_portfolio_collection_methods
                    : investment_portfolio_payment_methods
                "
                :label="
                  nature_operation === NatureOperation.INCOME
                    ? 'Forma de recaudo'
                    : 'Forma de pago'
                "
                required
                placeholder="Seleccione"
                :rules="[]"
                :default_value="valueTypePayment"
                @update:model-value="(val) => (valueTypePayment = val)"
              />
            </div>

            <div class="col-12 col-md-4">
              <GenericInput
                label="Descripción"
                required
                placeholder="-"
                disabled
                :rules="[]"
                :default_value="refDescription"
                @update:model-value="refDescription = $event"
              />
            </div>
          </div>

          <div class="q-my-md">
            <p class="text-weight-bold q-mb-sm">Instrucciones de tesorería</p>
            <q-separator class="q-mb-md" />

            <div
              v-for="(label, idx) in ['Origen', 'Destino', 'Cumplimiento']"
              :key="idx"
              class="q-mb-sm"
            >
              <div class="row q-col-gutter-lg items-center">
                <div class="col-12 col-md-2">
                  <p class="text-weight-medium">{{ label }}</p>
                </div>

                <div class="col-12 col-md-5">
                  <GenericSelectorComponent
                    :manual_option="investment_portfolio_banks"
                    label="Banco"
                    required
                    placeholder="Seleccione banco"
                    :rules="[
                      (v) =>
                        useRules().is_required(v, 'Debe seleccionar un banco'),
                    ]"
                    :default_value="selectedBanksLabels[label.toLowerCase()]"
                    @update:model-value="
                      (val) => (selectedBanks[label.toLowerCase()] = val)
                    "
                  />
                </div>

                <div class="col-12 col-md-5">
                  <GenericSelectorComponent
                    :manual_option="
                      bankAccountsByBank[label.toLowerCase()] || []
                    "
                    label="Número de cuenta"
                    required
                    placeholder="Seleccione cuenta"
                    :rules="[
                      (v) =>
                        useRules().is_required(
                          v,
                          'Debe seleccionar un número de cuenta'
                        ),
                    ]"
                    :default_value="selectedAccountsLabels[label.toLowerCase()]"
                    @update:model-value="
                      (val) => (selectedAccounts[label.toLowerCase()] = val)
                    "
                  />
                </div>
              </div>

              <q-separator v-if="idx < 2" class="q-my-md" />
            </div>
          </div>

          <div class="row justify-center q-mt-lg">
            <Button
              label="Agregar"
              color="orange"
              outline
              unelevated
              size="md"
              class="text-capitalize btn-filter custom"
              @click="addPaymentMethod"
            />
          </div>
        </section>
      </q-form>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
//Components
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'

//Composables
import { useRules } from '@/composables'

//Logic
import { useInformationForeign } from './InformationForeign'

//Utils
import { defaultIconsLucide } from '@/utils'

//Enums & Interfaces
import { NatureOperation } from '@/interfaces/customs/investment-portfolio/GenerateBallot'
import { IGenerateBallotSubmit } from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'

const props = defineProps<{
  action: ActionType
  data?: boolean
}>()

const emit = defineEmits<{
  (event: 'submit', payload: IGenerateBallotSubmit): void
}>()

const {
  tableProps,
  models,
  visibleRows,
  isModalOpen,
  investment_portfolio_banks,
  investment_portfolio_titles,
  bankAccountsByBank,
  selectedBanks,
  valueTypePayment,
  nature_operation,
  selectedBanksLabels,
  selectedAccountsLabels,
  selectedAccounts,
  modalForm,
  refDescription,
  tablePropsForeign,
  investment_portfolio_collection_methods,
  investment_portfolio_payment_methods,
  rowsPerPageOptions,
  updatePage,
  updatePerPage,
  onSubmit,
  editItem,
  closeModal,
  openModal,
  removeItem,
  addPaymentMethod,
} = useInformationForeign(props, emit)

defineExpose({
  models,
  onSubmit,
})
</script>
