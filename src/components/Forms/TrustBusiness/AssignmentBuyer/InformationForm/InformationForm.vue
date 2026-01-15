<template>
  <q-form ref="formInformation">
    <div class="q-mb-lg mt-2">
      <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
        Información general
      </p>
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-xs-3 col-md-3">
        <GenericSelectorComponent
          v-if="!isViewOrAuthorize"
          :default_value="models.business_trust_id"
          :label="'Nombre del negocio'"
          map_options
          :manual_option="business_trusts"
          :required="true"
          :rules="[
              (v:string) => useRules().is_required(v, 'El negocio es requerido')
            ]"
          :readonly="!isCreate"
          @update:modelValue="models.business_trust_id = $event"
        />
        <div v-else class="text-black-90">
          <p class="text-weight-bold no-margin">Nombre del negocio</p>
          <p class="text-weight-medium no-margin">
            {{ models.business_trust_name }}
          </p>
        </div>
      </div>

      <div class="col-12 col-xs-3 col-md-3">
        <GenericSelectorComponent
          v-if="!isViewOrAuthorize"
          :default_value="models.real_estate_project_id"
          :label="'Proyecto inmobiliario'"
          map_options
          :manual_option="business_trust_real_estate_project"
          :readonly="!models.business_trust_id || !isCreate"
          :required="true"
          :rules="[
              (v:string) => useRules().is_required(v, 'El proyecto inmobiliario es requerido')
            ]"
          @update:modelValue="models.real_estate_project_id = $event"
        />
        <div v-else class="text-black-90">
          <p class="text-weight-bold no-margin">Proyecto inmobiliario</p>
          <p class="text-weight-medium no-margin">
            {{ models.real_estate_project_name }}
          </p>
        </div>
      </div>

      <div class="col-12 col-xs-3 col-md-3">
        <GenericSelectorComponent
          v-if="!isViewOrAuthorize"
          :default_value="models.project_stage_id"
          :label="'Etapa'"
          map_options
          :manual_option="project_stage"
          :readonly="!models.real_estate_project_id || !isCreate"
          :rules="[(v:string) =>useRules().is_required(v, 'El número de etapa es requerido')]"
          required
          @update:modelValue="models.project_stage_id = $event"
        />
        <div v-else class="text-black-90">
          <p class="text-weight-bold no-margin">Etapa</p>
          <p class="text-weight-medium no-margin">
            {{ models.project_stage_name }}
          </p>
        </div>
      </div>

      <div class="col-12 col-xs-3 col-md-3">
        <GenericSelectorComponent
          v-if="!isViewOrAuthorize"
          :default_value="models.business_trust_property_id"
          :label="'Apartamento / Casa'"
          map_options
          :manual_option="business_trust_properties"
          :readonly="!models.project_stage_id || !isCreate"
          :rules="[(v:string) =>useRules().is_required(v, 'El apartamento / casa es requerida')]"
          required
          @update:modelValue="models.business_trust_property_id = $event"
        />
        <div v-else class="text-black-90">
          <p class="text-weight-bold no-margin">Apartamento / Casa</p>
          <p class="text-weight-medium no-margin">
            {{ models.business_trust_property_name }}
          </p>
        </div>
      </div>

      <div class="col-12 col-xs-3 col-md-3">
        <GenericDateInputComponent
          v-if="!isViewOrAuthorize"
          :default_value="models.date_register"
          label="Fecha de registro"
          :rules="[]"
          disabled
          @update:modelValue="models.date_register = $event"
        />

        <div v-else class="text-black-90">
          <p class="text-weight-bold no-margin">Fecha de registro</p>
          <p class="text-weight-medium no-margin">
            {{ models.date_register }}
          </p>
        </div>
      </div>

      <div class="col-12 col-xs-3 col-md-3">
        <GenericDateInputComponent
          v-if="!isViewOrAuthorize"
          :default_value="models.date_vinculation"
          label="Fecha de vinculación"
          :rules="[]"
          disabled
          @update:modelValue="models.date_vinculation = $event"
        />

        <div v-else class="text-black-90">
          <p class="text-weight-bold no-margin">Fecha de vinculación</p>
          <p class="text-weight-medium no-margin">
            {{ models.date_vinculation }}
          </p>
        </div>
      </div>

      <div class="col-12 col-xs-3 col-md-3">
        <CurrencyInput
          v-if="!isViewOrAuthorize"
          v-model="models.property_value!"
          label="Valor del inmueble"
          :currency="'COP'"
          :placeholder="''"
          :rules="[]"
          disabled
          @update:modelValue="models.property_value = $event"
        />
        <div v-else class="text-black-90">
          <p class="text-weight-bold no-margin">Valor del inmueble</p>
          <p class="text-weight-medium no-margin">
            {{ formatCurrency(`${models.property_value}`) }}
          </p>
        </div>
      </div>

      <div class="col-12 col-xs-3 col-md-3">
        <CurrencyInput
          v-if="!isViewOrAuthorize"
          v-model="models.total_paid!"
          label="Total abonado"
          :currency="'COP'"
          :placeholder="''"
          :rules="[]"
          disabled
          @update:modelValue="models.total_paid = $event"
        />
        <div v-else class="text-black-90">
          <p class="text-weight-bold no-margin">Total abonado</p>
          <p class="text-weight-medium no-margin">
            {{ formatCurrency(`${models.total_paid}`) }}
          </p>
        </div>
      </div>

      <div class="col-12 col-xs-3 col-md-3">
        <CurrencyInput
          v-if="!isViewOrAuthorize"
          v-model="models.balance_due!"
          label="Saldo por pagar"
          :currency="'COP'"
          :placeholder="''"
          :rules="[]"
          disabled
          @update:modelValue="models.balance_due = $event"
        />
        <div v-else class="text-black-90">
          <p class="text-weight-bold no-margin">Saldo por pagar</p>
          <p class="text-weight-medium no-margin">
            {{ formatCurrency(`${models.balance_due}`) }}
          </p>
        </div>
      </div>

      <div class="col-12 col-xs-3 col-md-3">
        <GenericInputComponent
          v-if="!isViewOrAuthorize"
          :default_value="models.order_number"
          label="Número de encargo"
          :type="'text'"
          placeholder=""
          disabled
        />

        <div v-else class="text-black-90">
          <p class="text-weight-bold no-margin">Número de encargo</p>
          <p class="text-weight-medium no-margin">{{ models.order_number }}</p>
        </div>
      </div>

      <div class="col-12 col-xs-3 col-md-3" v-if="props.action !== 'create'">
        <div class="text-black-90">
          <p class="text-weight-bold no-margin">Estado</p>
          <ShowStatus :type="Number(models.status_id)" />
        </div>
      </div>
    </div>

    <section class="q-mt-xl">
      <TableList
        :title="tableProps.title"
        :loading="tableProps.loading"
        :columns="tableProps.columns"
        :rows="tableProps.rows"
        :pages="tableProps.pages"
        :custom-columns="[
          'status_id',
          'opening_balance',
          'total_balance',
          'interest',
          'quota_capital',
          'final_balance',
        ]"
        :hideBottom="true"
        :class="'q-pt-lg amounts-table'"
      >
        <template #status_id="{ row }">
          <ShowStatus :type="Number(row.status_id)" />
        </template>

        <template #opening_balance="{ row }">
          {{ formatCurrency(`${row.initial_balance}`) }}
        </template>

        <template #total_balance="{ row }">
          {{ formatCurrency(`${row.total_fee}`) }}
        </template>

        <template #interest="{ row }">
          {{ formatCurrency(`${row.late_interest}`) }}
        </template>

        <template #quota_capital="{ row }">
          {{ formatCurrency(`${row.capital_fee}`) }}
        </template>

        <template #final_balance="{ row }">
          {{ formatCurrency(`${row.final_balance}`) }}
        </template>
      </TableList>
    </section>

    <section class="q-mt-xl">
      <TableList
        :title="tablePropsTransfer.title"
        :loading="tablePropsTransfer.loading"
        :columns="tablePropsTransfer.columns"
        :rows="tablePropsTransfer.rows"
        :pages="tablePropsTransfer.pages"
        :hideBottom="true"
        :class="'q-pt-lg amounts-table'"
        :custom-columns="['checked']"
      >
        <template #checked="{ row }">
          <div class="px-1 flex justify-center">
            <q-radio
              :val="row.id"
              v-model="selectedThirdId"
              dense
              size="sm"
              color="orange"
              :disable="!['create', 'edit'].includes(action)"
            />
          </div>
        </template>
      </TableList>
    </section>

    <section class="q-mt-xl amounts-table">
      <TableList
        :title="tablePropsAssignees.title"
        :loading="tablePropsAssignees.loading"
        :columns="tablePropsAssignees.columns"
        :rows="tablePropsAssignees.rows"
        :pages="tablePropsAssignees.pages"
        :hideBottom="true"
        :custom-columns="['id', 'actions']"
      >
        <template
          #custom-header-action
          v-if="['create', 'edit'].includes(props.action)"
        >
          <div class="row q-gutter-sm">
            <Button
              :label="'Agregar'"
              :size="'md'"
              :unelevated="true"
              :outline="false"
              :left-icon="defaultIconsLucide.plusCircle"
              :color-icon="'white'"
              :class="'text-capitalize btn-filter custom'"
              @click="addRow"
            />
          </div>
        </template>
        <template #id="{ row }">
          <div v-if="['create', 'edit'].includes(action)" class="selector-col">
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :default_value="row.id"
              map_options
              :class_name="'full-width selector-col'"
              class_custom_popup="custom"
              first_filter_option="label"
              second_filter_option="value"
              :manual_option="business_trust_third_parties"
              :rules="[
                (v: string) => useRules().is_required(v),
                (v: string) => useRules().validate_not_same(`${v}`, `${selectedThirdId}`, 'El cesionario no puede ser el mismo cedente') ,
                (v: number) => useRules().not_exist_in_array(
                  v,
                  idsAssigns as number[],
                  'El cesionario ya ha sido agregado'
                )
              ]"
              required
              @update:model-value="
                (val) => ((row.id = val), changeDataTable(val))
              "
            />
          </div>

          <div class="flex justify-center items-center" v-else>
            <p class="q-my-none">
              {{ row.id }}
            </p>
          </div>
        </template>
        <template #actions="{ row }">
          <!-- Eliminar -->
          <Button
            :left-icon="defaultIconsLucide.trash"
            color="orange"
            :class-custom="'custom'"
            :outline="false"
            :flat="true"
            colorIcon="#f45100"
            :tooltip="'Eliminar'"
            @click="openDeleteModal(row.id)"
          />
        </template>
      </TableList>
    </section>

    <section class="mt-5">
      <TableList
        :title="tablePropsFinalBuyers.title"
        :loading="tablePropsFinalBuyers.loading"
        :columns="tablePropsFinalBuyers.columns"
        :rows="tablePropsFinalBuyers.rows"
        :hideBottom="true"
        :class="'q-pt-lg amounts-table'"
        :custom-columns="['status_id']"
      >
      </TableList>
    </section>

    <AlertModalComponent
      ref="alertModalRef"
      styleModal="min-width: 480px"
      title="¿Desea eliminar el cesionario?"
      :show-img-default="false"
      @confirm="confirmDeleteRow"
    >
      <template #default-img>
        <q-img
          src="@/assets/images/icons/alert_popup_delete.svg"
          max-width="80px"
          width="80px"
          fit="contain"
        />
      </template>
    </AlertModalComponent>
  </q-form>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    action: ActionType | 'authorize'
    data?: IAssignmentBuyer
  }>(),
  {}
)

// Emits
const emits = defineEmits(['update:models'])

import { IAssignmentBuyer } from '@/interfaces/customs'

// Components
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// Types
import { ActionType } from '@/interfaces/global'

// Logic
import useInformationForm from './InformationForm'

// composables
import { useRules, useAlert, useUtils } from '@/composables'
const formatCurrency = useUtils().formatCurrency
const { defaultIconsLucide } = useUtils()

const { showAlert } = useAlert()

const {
  models,
  formInformation,
  business_trust_real_estate_project,
  project_stage,
  business_trusts,
  business_trust_properties,
  tableProps,
  isViewOrAuthorize,
  isCreate,
  tablePropsTransfer,
  tablePropsAssignees,
  business_trust_third_parties,
  selectedThirdId,
  tablePropsFinalBuyers,
  idsAssigns,
  alertModalRef,

  addRow,
  changeDataTable,
  openDeleteModal,
  confirmDeleteRow,
} = useInformationForm(props, emits)

defineExpose({
  validateForm: async () => {
    if (
      (await formInformation.value?.validate()) &&
      tablePropsAssignees.value.rows.length > 0
    ) {
      return true
    }

    if (tablePropsAssignees.value.rows.length === 0) {
      return showAlert(
        'Debe seleccionar a un cesionario.',
        'error',
        undefined,
        3000
      )
    }

    return showAlert(
      'Formulario incompleto. ¡Rellene todos los campos y tablas!',
      'error',
      undefined,
      3000
    )
  },
})
</script>

<style lang="scss" scoped>
:deep(.amounts-table) {
  .q-select .q-field__native {
    min-height: unset;
  }
}

.selector-col {
  min-width: 250px;
}
</style>
