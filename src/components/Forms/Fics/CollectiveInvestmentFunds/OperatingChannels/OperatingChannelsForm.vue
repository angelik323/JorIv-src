<template>
  <q-form
    ref="operatingChannelsFormRef"
    class="q-pa-lg"
    aria-label="Formulario de canales de operación"
  >
    <section>
      <div
        class="flex justify-between items-start q-mb-md"
        aria-label="Tabla de canales de operación"
      >
        <p class="text-weight-bold text-h6">
          {{ tablePropsChannels.title }}
        </p>

        <Button
          v-if="!isView"
          no-caps
          unelevated
          label="Agregar"
          :leftIcon="defaultIconsLucide.plusCircleOutline"
          :color-icon="'white'"
          :text-color="'white'"
          :outline="false"
          :color="'primary'"
          :tooltip="'Agregar'"
          @click="handleOpenModal('channels')"
        />
      </div>

      <VCard>
        <template #content-card>
          <div class="q-pa-lg">
            <TableList
              hidePagination
              :loading="tablePropsChannels.loading"
              :columns="tablePropsChannels.columns"
              :rows="tablePropsChannels.rows"
              :custom-columns="['checkbox']"
            >
              <template #checkbox="{ row }">
                <q-radio
                  v-model="selectedRowIdChannels"
                  :val="row.operation_channel_id"
                  dense
                  color="orange"
                />
              </template>
            </TableList>
          </div>
        </template>
      </VCard>

      <NoDataState
        v-if="!selectedRowIdChannels && tablePropsAccounts.rows.length === 0"
        type="empty"
      />

      <div v-else>
        <div class="flex justify-between items-start q-mb-md">
          <p class="text-weight-bold text-h6">
            {{ tablePropsAccounts.title }}
          </p>

          <Button
            v-if="!isView"
            no-caps
            unelevated
            label="Agregar"
            :leftIcon="defaultIconsLucide.plusCircleOutline"
            :color-icon="'white'"
            :text-color="'white'"
            :outline="false"
            :color="'primary'"
            :tooltip="'Agregar'"
            @click="handleOpenModal('accounts')"
          />
        </div>

        <VCard>
          <template #content-card>
            <div class="q-pa-lg">
              <TableList
                hidePagination
                :loading="tablePropsAccounts.loading"
                :columns="tablePropsAccounts.columns"
                :rows="tablePropsAccounts.rows"
              />
            </div>
          </template>
        </VCard>
      </div>

      <AlertModalComponent
        ref="addModalRef"
        styleModal="max-width: 500px; width: 100%;"
        :showBtnConfirm="false"
        :showBtnCancel="false"
        :showImgDefault="false"
        :showCloseBtn="true"
      >
        <template #default-body>
          <q-form ref="modalFormRef">
            <div class="q-mx-lg q-col-gutter-md">
              <p class="text-h5 text-weight-bold">
                {{
                  modalType === 'channels'
                    ? 'Agregar canal de operación'
                    : 'Agregar cuenta bancaria'
                }}
              </p>

              <div class="col q-col-gutter-sm">
                <GenericSelectorComponent
                  label="Canal"
                  :default_value="modalData.operation_channel_id"
                  placeholder="Seleccione"
                  required
                  :manual_option="system_operation_channels"
                  map_options
                  :rules="[
                    (val: string) => useRules().is_required(val, 'El canal es requerido'),
                  ]"
                  :disabled="modalType === 'accounts'"
                  @update:model-value="modalData.operation_channel_id = $event"
                />

                <div v-if="modalType === 'channels'">
                  <GenericInputComponent
                    label="Cantidad de operaciones por día"
                    :default_value="modalData.operation_per_day"
                    placeholder="Inserte"
                    class_name="q-pt-none"
                    type="text"
                    required
                    :rules="[
                      (val: string) => useRules().is_required(val, 'La cantidad de operaciones por día es requerida'),
                      (val: string) => useRules().max_length(val, 3),
                      (val: string) => useRules().min_length(val, 1),
                      (val: string) => useRules().only_number(val),
                    ]"
                    @update:model-value="modalData.operation_per_day = $event"
                  />

                  <GenericInputComponent
                    label="Cantidad de operaciones por mes"
                    :default_value="modalData.operation_per_month"
                    placeholder="Inserte"
                    class_name="q-pt-none"
                    type="text"
                    required
                    :rules="[
                      (val: string) => useRules().is_required(val, 'La cantidad de operaciones por mes es requerida'),
                      (val: string) => useRules().max_length(val, 3),
                      (val: string) => useRules().min_length(val, 1),
                      (val: string) => useRules().only_number(val),
                    ]"
                    @update:model-value="modalData.operation_per_month = $event"
                  />
                  <CurrencyInput
                    v-model="modalData.minimun_ammount"
                    label="Monto mínimo"
                    placeholder="0"
                    class_name="q-pt-none"
                    type="text"
                    :required="true"
                    :disabled="true"
                    :rules="[
                      (val: string) => useRules().is_required(val, 'El monto mínimo es requerido'),
                      (val: string) => useRules().only_number(val),
                    ]"
                    :hide-icon="true"
                  />
                  <CurrencyInput
                    v-model="modalData.maximun_ammount"
                    label="Monto máximo"
                    placeholder="0"
                    class_name="q-pt-none"
                    type="text"
                    :required="true"
                    :rules="[
                      (val: string) => useRules().is_required(val, 'El monto máximo es requerido'),
                    ]"
                    :hide-icon="true"
                  />
                </div>

                <div v-else>
                  <GenericSelectorComponent
                    label="Banco"
                    :default_value="modalData.bank_accounts[0].bank_id"
                    placeholder="Seleccione"
                    required
                    :manual_option="banks"
                    map_options
                    :rules="[
                      (val: string) => useRules().is_required(val, 'El banco es requerido'),
                    ]"
                    @update:model-value="onBankChange"
                  />

                  <div class="row col-12 items-center justify-between q-px-md">
                    <p class="q-mb-none mt-1 text-weight-medium">Maneja GMF</p>

                    <RadioYesNo
                      v-model="modalData.bank_accounts[0].has_gmf"
                      class="q-mt-none"
                      :titleRadioTrue="'Si'"
                      :titleRadioFalse="'No'"
                      required
                      @update:model-value="
                        modalData.bank_accounts[0].has_gmf = $event
                      "
                    />
                  </div>

                  <q-separator class="q-my-lg" />

                  <GenericSelectorComponent
                    label="Cuenta"
                    :default_value="modalData.bank_accounts[0].bank_account_id"
                    placeholder="Seleccione"
                    required
                    :manual_option="bank_accounts_balances"
                    map_options
                    :rules="[
                      (val: string) => useRules().is_required(val, 'La cuenta es requerida'),
                    ]"
                    @update:model-value="
                      modalData.bank_accounts[0].bank_account_id = $event
                    "
                  />

                  <div class="row col-12 items-center justify-between q-px-md">
                    <p class="q-mb-none mt-1 text-weight-medium">
                      Preferencial
                    </p>

                    <RadioYesNo
                      v-model="modalData.bank_accounts[0].is_preferred_account"
                      class="q-mt-none"
                      :titleRadioTrue="'Si'"
                      :titleRadioFalse="'No'"
                      required
                      @update:model-value="
                        modalData.bank_accounts[0].is_preferred_account = $event
                      "
                    />
                  </div>

                  <q-separator class="q-my-lg" />
                </div>
              </div>

              <div class="row q-mt-lg flex justify-center">
                <Button
                  label="Cancelar"
                  color="orange"
                  class="text-capitalize btn-filter custom q-mr-md"
                  :outline="true"
                  @click="handleCloseModal"
                />

                <Button
                  :outline="false"
                  label="Agregar"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="handleAddRow"
                  :disabled="!isFormValid"
                />
              </div>
            </div>
          </q-form>
        </template>
      </AlertModalComponent>
    </section>
  </q-form>
</template>

<script setup lang="ts">
// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Interfaces
import { IOperationChannel } from '@/interfaces/customs/fics/CollectiveInvestmentFunds'
import { ActionType } from '@/interfaces/global'

// Composables
import { useRules } from '@/composables'

// Logic view
import useOperatingChannelsForm from '@/components/Forms/Fics/CollectiveInvestmentFunds/OperatingChannels/OperatingChannelsForm'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IOperationChannel[]
  }>(),
  {}
)

const {
  banks,
  isView,
  modalData,
  modalType,
  getValues,
  isFormValid,
  addModalRef,
  modalFormRef,
  validateForm,
  handleAddRow,
  onBankChange,
  handleOpenModal,
  handleCloseModal,
  tablePropsAccounts,
  defaultIconsLucide,
  tablePropsChannels,
  selectedRowIdChannels,
  bank_accounts_balances,
  operatingChannelsFormRef,
  system_operation_channels,
} = useOperatingChannelsForm(props)

defineExpose({ getValues, validateForm })
</script>
