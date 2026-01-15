<template>
  <q-form ref="basicDataFormRef" class="q-pa-lg">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            label="Ciudad"
            :default_value="models.city_id"
            :manual_option="cities"
            :auto_complete="true"
            :required="true"
            :map_options="true"
            :disabled="action == 'edit'"
            :rules="[(val: string) => is_required(val, 'La ciudad es requerida')]"
            @update:model-value="changeCity($event)"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            label="NIT tercero"
            type="text"
            :default_value="models.third_party_nit"
            :required="true"
            :disabled="true"
            :rules="[(val: string) => is_required(val, 'El NIT tercero es requerido')]"
            @update:model-value="models.third_party_nit = $event"
          />
        </div>

        <div class="col-12 col-md-4">
          <GenericInputComponent
            label="Periodicidad"
            type="text"
            :default_value="models.periodicity"
            :required="true"
            :disabled="true"
            :rules="[(val: string) => is_required(val, 'La periodicidad es requerida')]"
            @update:model-value="models.periodicity = $event"
          />
        </div>
      </div>
    </section>

    <q-separator class="my-1" />

    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            label="Actividad económica"
            :default_value="models.economic_activity_id"
            :manual_option="ciius"
            :auto_complete="true"
            :required="true"
            :map_options="true"
            :disabled="action == 'edit'"
            :rules="[(val: string) => is_required(val, 'La actividad económica es requerida')]"
            @update:model-value="changeEconomicActivity($event)"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            label="Tipo de actividad"
            :default_value="models.activity_type"
            :manual_option="ica_activity_types"
            :auto_complete="true"
            :required="true"
            :map_options="true"
            :rules="[(val: string) => is_required(val, 'El tipo de actividad es requerido')]"
            @update:model-value="models.activity_type = $event"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            label="Cargo fiscal"
            :default_value="models.fiscal_charge_id"
            :manual_option="fiscal_charges"
            :auto_complete="true"
            :required="true"
            :map_options="true"
            :rules="[(val: string) => is_required(val, 'El cargo fiscal es requerido')]"
            @update:model-value="changeFiscalCharge($event)"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            label="Tipo de tercero"
            :default_value="models.third_party_type"
            :manual_option="third_party_types"
            :auto_complete="true"
            :required="true"
            :map_options="true"
            :rules="[(val: string) => is_required(val, 'El tipo de tercero es requerido')]"
            @update:model-value="models.third_party_type = $event"
          />
        </div>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            label="Estructura contable"
            :default_value="models.account_structure_id"
            :manual_option="account_structures_payment_concepts"
            :auto_complete="true"
            :required="true"
            :map_options="true"
            :disabled="action == 'edit'"
            :rules="[(val: string) => is_required(val, 'La estructura contable es requerida')]"
            @update:model-value="changeAccountStructure($event)"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            label="Cuenta contable"
            :default_value="models.account_chart_id"
            :manual_option="accounts_chart"
            :auto_complete="true"
            :required="true"
            :map_options="true"
            :disabled="action == 'edit'"
            :rules="[(val: string) => is_required(val, 'La cuenta contable es requerida')]"
            @update:model-value="changeAccountChart($event)"
          />
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            label="Concepto de liquidación"
            :default_value="models.settlement_concept_id"
            :manual_option="settlement_concept"
            :auto_complete="true"
            :required="false"
            :map_options="true"
            :rules="[]"
            @update:model-value="changeSettlementConcept($event)"
          />
        </div>

        <div class="col-12 col-md-3">
          <div style="height: 1.5em" class="flex items-center no-wrap">
            <RadioYesNo
              v-model="isPesosBased"
              :options="[{ label: '', value: true }]"
              :isRadioButton="true"
              custom-class="q-pa-none q-ma-none"
              class-radio="q-pa-none q-ma-none row items-center"
              @update:model-value="changePesosBased"
            />
            <span
              style="margin-left: -0.5em"
              class="text-weight-medium break-word q-ml-sm text-grey-7"
            >
              Base mínima en pesos*
            </span>
          </div>

          <CurrencyInput
            v-model="models.minimum_base_pesos"
            label=""
            placeholder="Inserte"
            :currency="'COP'"
            :required="isPesosBased"
            :disabled="!isPesosBased"
            :rules="[
              (val: string) => is_required(val, 'La base mínima en pesos es requerida'),
              (val: string) => only_number_with_max_integers_and_decimals_ignore_symbols(val, 15, 2)
            ]"
          />
        </div>
      </div>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3">
          <div style="height: 1.5em" class="flex items-center no-wrap">
            <RadioYesNo
              v-model="isUvtBased"
              :options="[{ label: '', value: true }]"
              :isRadioButton="true"
              custom-class="q-pa-none q-ma-none"
              class-radio="q-pa-none q-ma-none row items-center"
              @update:model-value="changeUvtBased"
            />
            <span
              style="margin-left: -0.5em"
              class="text-weight-medium break-word q-ml-sm text-grey-7"
            >
              Base mínima en UVT*
            </span>
          </div>

          <CurrencyInput
            v-model="models.minimum_base_uvt"
            label=""
            placeholder="Inserte"
            :currency="'COP'"
            :required="isUvtBased"
            :disabled="!isUvtBased"
            :rules="[
              (val: string) => is_required(val, 'La base mínima en UVT es requerida'),
              (val: string) => only_number_with_max_integers_and_decimals_ignore_symbols(val, 15, 2)
            ]"
          />
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            v-model="models.percentage"
            label="Porcentaje"
            placeholder="Inserte"
            required
            :disabled="action == 'edit'"
            :rules="[
              (val: string) => is_required(val, 'El porcentaje es requerido'),
              (val: string) => only_number_with_max_integers_and_decimals_ignore_symbols(val, 3, 2)
            ]"
            :hide-icon="true"
          />
        </div>

        <div v-if="action == 'edit'" class="col-12 col-md-3">
          <GenericSelectorComponent
            label="Estado"
            :default_value="models.status_id"
            :manual_option="ica_activity_statuses"
            :auto_complete="true"
            :required="true"
            :disabled="true"
            :map_options="true"
            :rules="[]"
          />
        </div>
      </div>

      <div class="row mt-1">
        <div class="col-12 flex justify-between">
          <div class="col-auto self-center">
            <p class="q-my-none">
              ¿Aplica terceros registrados en cámara y comercio?
            </p>
          </div>

          <div class="col-auto">
            <RadioYesNo
              v-model="models.applies_to_third_party"
              :isRadioButton="true"
              :hasTitle="false"
              :hasSubtitle="false"
              :required="true"
            />
          </div>
        </div>
      </div>
    </section>

    <q-separator class="my-1" />

    <div v-if="action == 'create'" class="flex justify-end q-gutter-md mb-2">
      <Button
        label="Limpiar"
        size="md"
        unelevated
        :outline="true"
        color="orange"
        class-custom="custom"
        :left-icon="defaultIconsLucide.reload"
        @click="handleResetForm"
      />

      <Button
        label="Agregar"
        size="md"
        unelevated
        :outline="false"
        color-icon="white"
        :left-icon="defaultIconsLucide.plusCircleOutline"
        @click="handleAddRow"
      />
    </div>

    <VCard v-if="action == 'create'">
      <template #content-card>
        <section class="mx-3">
          <div v-if="tableProps.rows.length === 0">
            <div class="row justify-center my-4">
              <img
                src="@/assets/images/icons/empty.svg"
                alt="Sin centros de costo"
                style="max-width: 150px"
              />
            </div>
            <p class="text-h6 text-center text-weight-bold mb-1">
              Actualmente no hay registros
            </p>
            <p class="text-center text-weight-light mb-4">
              Por favor, agregue uno para continuar con el proceso
            </p>
          </div>

          <TableList
            v-else
            :loading="tableProps.loading"
            :columns="tableProps.columns"
            :rows="tableProps.rows"
            :pages="tableProps.pages"
            :hide-bottom="false"
            :custom-columns="['applies_to_third_party', 'actions']"
          >
            <template #applies_to_third_party="{ row }">
              <Icon
                v-if="row.applies_to_third_party"
                name="CheckCircle2"
                :size="20"
                color="orange"
              />
              <Icon v-else name="XCircle" :size="20" color="grey" />
            </template>

            <template #actions="{ row }">
              <!-- Eliminar -->
              <Button
                :outline="false"
                :left-icon="defaultIconsLucide.trash"
                color="orange"
                :flat="true"
                :class-custom="'custom'"
                tooltip="Eliminar"
                @click="openAlertModal(row)"
              />
            </template>
          </TableList>
        </section>
      </template>
    </VCard>

    <AlertModalComponent
      ref="alertModalRef"
      styleModal="min-width: 470px"
      :showImgDefault="false"
      :title="alertModalConfig.title"
      :textBtnConfirm="alertModalConfig.textBtnConfirm"
      :textBtnCancel="alertModalConfig.textBtnCancel"
      @confirm="handleDelete()"
    >
      <template #default-img>
        <q-img
          src="@/assets/images/icons/alert_popup_delete.svg"
          max-width="80px"
          width="80px"
          fit="contain"
          alt="Imagen de alerta"
        />
      </template>
    </AlertModalComponent>
  </q-form>
</template>

<script setup lang="ts">
// components
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import TableList from '@/components/table-list/TableList.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import Icon from '@/components/common/Icon/Icon.vue'

// interfaces
import { ActionType } from '@/interfaces/global'
import { IIcaActivitiesForm } from '@/interfaces/customs/accounts-payable/IcaActivities'

// logic view
import useBasicDataForm from '@/components/Forms/AccountsPayable/IcaActivities/BasicData/BasicDataForm'

const emit = defineEmits(['update:data'])

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IIcaActivitiesForm | null
  }>(),
  {}
)

const {
  basicDataFormRef,
  models,
  tableProps,
  alertModalRef,
  alertModalConfig,

  // refs
  isPesosBased,
  isUvtBased,

  // selects
  cities,
  ciius,
  ica_activity_types,
  fiscal_charges,
  third_party_types,
  account_structures_payment_concepts,
  accounts_chart,
  settlement_concept,
  ica_activity_statuses,

  // utils
  defaultIconsLucide,

  // methods
  changeCity,
  changeUvtBased,
  changePesosBased,
  openAlertModal,
  handleDelete,
  handleAddRow,
  handleResetForm,
  changeEconomicActivity,
  changeFiscalCharge,
  changeAccountStructure,
  changeAccountChart,
  changeSettlementConcept,

  // rules
  is_required,
  only_number_with_max_integers_and_decimals_ignore_symbols,
} = useBasicDataForm(props, emit)

defineExpose({
  validateForm: () => basicDataFormRef.value?.validate(),
  getFormData: () => {
    return tableProps.value.rows
  },
})
</script>
