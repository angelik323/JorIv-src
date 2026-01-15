<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
    >
      <VCard>
        <template #content-card>
          <q-form ref="formRef">
            <div class="q-px-lg q-pb-lg q-pt-lg">
              <div class="row q-col-gutter-md items-end">
                <div class="col-3">
                  <GenericDateInputComponent
                    label="Vigencia"
                    mask="YYYY"
                    placeholder="Inserte"
                    required
                    :default_value="
                      models.fiscal_year ? String(models.fiscal_year) : ''
                    "
                    :rules="[
                    (val: string) => useRules().is_required(val, 'La vigencia es requerida'),
                  ]"
                    @update:model-value="
                      updateModelField(
                        'fiscal_year',
                        $event && $event.trim() ? parseInt($event) : 0
                      )
                    "
                  />
                </div>
                <div class="col-3">
                  <GenericDateInputComponent
                    label="Fecha"
                    placeholder="AAAA/MM/DD"
                    required
                    :default_value="models.date ?? ''"
                    :option_calendar="(date: string) => isBusinessDay(date)"
                    :rules="[(val: string) => useRules().is_required(val, 'La fecha es requerida')]"
                    @update:model-value="updateModelField('date', $event)"
                  />
                </div>
                <div class="col-3">
                  <GenericSelectorComponent
                    return_object
                    label="Tipo de documento"
                    :manual_option="budget_transfer_document_type_selector"
                    map_options
                    required
                    :default_value="models.budget_document_type_id || undefined"
                    custom_selection_label="label_code"
                    auto_complete
                    :clearable="false"
                    placeholder="Seleccione"
                    :rules="[(val: string) => useRules().is_required(val, 'El tipo de documento es requerido')]"
                    @update:model-value="handleBusinessDcoument"
                  />
                </div>
                <div class="col-3">
                  <GenericInputComponent
                    label="Descripción de documento"
                    placeholder="-"
                    :default_value="models.budget_document_type_id_description"
                    disabled
                  />
                </div>

                <div class="col-3">
                  <GenericSelectorComponent
                    return_object
                    label="Código de movimiento"
                    :manual_option="code_movements_for_document_types"
                    display_label="label_description"
                    custom_selection_label="label"
                    first_filter_option="label_description"
                    map_options
                    required
                    :default_value="models.code_movement_id || undefined"
                    auto_complete
                    :clearable="false"
                    placeholder="Seleccione"
                    :rules="[(val: string) => useRules().is_required(val, 'El código de movimiento es requerido')]"
                    @update:model-value="handleCodeMovement"
                  />
                </div>
                <div class="col-3">
                  <GenericInputComponent
                    label="Descripción código de movimiento"
                    placeholder="-"
                    :default_value="models.code_movement_id_description"
                    disabled
                  />
                </div>
                <div class="col-3">
                  <GenericSelectorComponent
                    return_object
                    label="Solicitante"
                    :manual_option="third_parties"
                    custom_selection_label="label"
                    display_label="label_description"
                    :required="false"
                    :default_value="
                      models.third_party_requester_id || undefined
                    "
                    first_filter_option="label_description"
                    auto_complete
                    :clearable="false"
                    map_options
                    placeholder="Seleccione"
                    :rules="[() => true]"
                    @update:model-value="handleThirdPartyRequester"
                  />
                </div>
                <div class="col-3">
                  <GenericInputComponent
                    label="Descripción solicitante"
                    placeholder="-"
                    :default_value="models.third_party_requester_id_description"
                    disabled
                  />
                </div>

                <div class="col-3">
                  <GenericInputComponent
                    label="Descripción traslado"
                    placeholder="Inserte"
                    required
                    max_length="100"
                    :rules="[
                    (val: string) => useRules().is_required(val, 'La descripción es requerida'),
                    (val: string) => useRules().max_length(val, 100)
                  ]"
                    :default_value="models.description ?? ''"
                    @update:model-value="
                      (val) => updateModelField('description', val)
                    "
                  />
                </div>
                <div class="col-3">
                  <GenericInputComponent
                    label="Número de resolución"
                    placeholder="Inserte"
                    required
                    type="number"
                    max_length="20"
                    :min_value="0"
                    :rules="[
                    (val: string) => useRules().is_required(val, 'El número de resolución es requerido'),
                    (val: string) => useRules().only_number_greater_than_zero(val),
                    (val: string) => useRules().max_length(val, 20)
                  ]"
                    :default_value="models.resolution_number ?? ''"
                    @update:model-value="
                      (val) => {
                        const numValue =
                          typeof val === 'string' ? parseFloat(val) : val
                        if (numValue < 0) {
                          updateModelField('resolution_number', '')
                        } else {
                          updateModelField('resolution_number', val)
                        }
                      }
                    "
                  />
                </div>
                <div class="col-3">
                  <InputMoneyComponent
                    :model-value="
                      models.total_amount > 0
                        ? String(models.total_amount)
                        : null
                    "
                    label="Valor total"
                    :max_decimal_digits="2"
                    placeholder="Inserte"
                    required
                    :rules="[
                    (val: string) => useRules().is_required(val, 'El valor total es requerido'),
                    (val: string) => useRules().only_number_with_max_integers_and_decimals_ignore_symbols(val, 15, 2)
                  ]"
                    @update:model-value="
                      ({ rawValue }) => {
                        const num =
                          rawValue === '' || rawValue == null
                            ? 0
                            : Number(rawValue)
                        updateModelField('total_amount', num)
                      }
                    "
                  />
                </div>
              </div>
            </div>
          </q-form>

          <!-- Botón de creación -->
          <section class="mx-3 mb-3">
            <div class="row justify-end q-gutter-md">
              <Button
                :outline="true"
                class-custom="custom"
                label="Limpiar"
                :left-icon="defaultIconsLucide.reload"
                colorIcon="#762344"
                size="md"
                color="primary_fiduciaria"
                @click="handleCleanData"
              />
              <Button
                v-if="!hasTableData"
                :outline="false"
                class-custom="custom"
                label="Continuar"
                size="md"
                color="primary_fiduciaria"
                :disable="!isFormValid"
                @click="createView"
              />
            </div>
          </section>
        </template>
      </VCard>
      <div v-if="tableProps.rows.length > 0">
        <TableList
          :title="tableProps.title"
          :columns="tableProps.columns"
          :rows="tableProps.rows ?? []"
          :pages="tableProps.pages"
          :custom-columns="['id', 'actions']"
          :loading="false"
        >
          <template #id="{ index }">
            <span>{{ index + 1 }}</span>
          </template>
          <template #actions="{ row }">
            <Button
              v-if="validateRouter('Budget', 'BudgetTransferList', 'edit')"
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              flat
              colorIcon="#f45100"
              :tooltip="'Editar'"
              @click="editRow(row.id)"
            />
          </template>
        </TableList>

        <div class="row justify-end">
          <Button
            v-if="validateRouter('Budget', 'BudgetTransferList', 'create')"
            :outline="false"
            label="Confirmar"
            color="orange"
            class="text-capitalize btn-filter custom"
            @click="confirmModal"
          />
        </div>
      </div>
    </ContentComponent>
  </div>
  <AlertModalComponent
    ref="alertModalRef"
    styleModal="min-width: 470px"
    title="¿Desea confirmar el registro de traslados?"
    :show-img-default="false"
    @confirm="() => handleConfirm()"
  >
    <template #default-img>
      <img
        src="@/assets/images/icons/confirmation_icon.svg"
        alt="Confirmación"
        style="max-width: 80px; width: 80px"
      />
    </template>
  </AlertModalComponent>
</template>

<script setup lang="ts">
//Core
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import InputMoneyComponent from '@/components/InputMoney/InputMoneyComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'
//Logic view
import useBudgetTransfer from '@/views/budget/budget-transfers/v1/list/BudgetTransferList'

const {
  headerProps,
  tableProps,
  defaultIconsLucide,
  alertModalRef,
  code_movements_for_document_types,
  budget_transfer_document_type_selector,
  third_parties,
  models,
  hasTableData,
  isFormValid,
  formRef,
  handleBusinessDcoument,
  handleCodeMovement,
  handleThirdPartyRequester,
  handleCleanData,
  updateModelField,
  useRules,
  isBusinessDay,
  createView,
  editRow,
  confirmModal,
  handleConfirm,
  validateRouter,
} = useBudgetTransfer()
</script>
