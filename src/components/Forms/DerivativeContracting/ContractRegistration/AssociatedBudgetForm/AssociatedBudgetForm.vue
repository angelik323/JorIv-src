divdivdiv
<template>
  <q-form ref="formElementRef" class="q-pa-lg">
    <section>
      <p class="text-black-10 text-weight-bold text-h6 q-mb-md">
        Asignación presupuestal
      </p>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-ml-xs">
        <div class="col-xs-12 col-sm-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold">Valor del contrato</p>
            <p class="text-weight-medium">
              {{ formatCurrencyString(models.contract_value) ?? '-' }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="q-my-xl q-mx-sm">
      <TableList
        :loading="tablePropertiesAssociatedBudget.loading"
        :columns="tablePropertiesAssociatedBudget.columns"
        :rows="tablePropertiesAssociatedBudget.rows"
        :pages="tablePropertiesAssociatedBudget.pages"
        :custom-columns="['actions']"
        selection="single"
        v-model:selected="selectedRowsAssociatedBudget"
        @update:selected="handleSelectAssociatedBudget"
        hide-pagination
        customNoDataMessageTitle="No hay datos registrados"
        customNoDataMessageSubtitle=""
      >
        <template #custom-header>
          <div
            class="q-mt-sm q-mb-sm full-width flex justify-between items-center"
          >
            <span class="text-h5">
              {{ tablePropertiesAssociatedBudget.title }}
            </span>
            <Button
              v-if="['create', 'edit'].includes(action)"
              :outline="false"
              label="Agregar"
              :class-custom="'items-center'"
              :left-icon="defaultIconsLucide.plusCircleOutline"
              color-icon="white"
              @click="handleAddAssociatedBudget"
            />
          </div>
        </template>

        <template #actions="{ row }">
          <Button
            v-if="['create', 'edit'].includes(action)"
            :left-icon="defaultIconsLucide.edit"
            color="primary"
            :class-custom="'custom'"
            :flat="true"
            :outline="false"
            colorIcon="#f45100"
            tooltip="Editar"
            @click="handleEditAssociatedBudget(row.id)"
          />
          <Button
            v-if="['create', 'edit'].includes(action)"
            :left-icon="defaultIconsLucide.trash"
            color="primary"
            :class-custom="'custom'"
            :flat="true"
            :outline="false"
            colorIcon="#f45100"
            tooltip="Eliminar"
            @click="handleDeleteAssociatedBudget(row.id)"
          />
        </template>
      </TableList>
    </section>

    <section class="q-mt-xl">
      <div
        class="row q-col-gutter-x-lg q-col-gutter-y-sm"
        v-if="['create', 'edit'].includes(action)"
      >
        <div class="col-xs-12 col-sm-12 col-md-5 offset-md-1">
          <div class="row">
            <p class="col-4 text-black-10 text-weight-bold text-h6">
              Total saldo disponible presupuestal
            </p>
            <div class="col-8">
              <InputMoneyComponent
                :currency="'USD'"
                hide_symbol
                :model-value="models?.total_available_balance ?? null"
                disabled
                :rules="[]"
                @update:model-value="
                  ({ rawValue }) => (models.total_available_balance = rawValue)
                "
              />
            </div>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-5">
          <div class="row">
            <p class="col-4 text-black-10 text-weight-bold text-h6">
              Total saldo comprometido
            </p>
            <div class="col-8">
              <InputMoneyComponent
                :currency="'USD'"
                hide_symbol
                :model-value="models?.total_committed_balance ?? null"
                disabled
                :rules="[]"
                @update:model-value="
                  ({ rawValue }) => (models.total_committed_balance = rawValue)
                "
              />
            </div>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-5 offset-md-3">
          <div class="row">
            <p class="col-4 text-black-10 text-weight-bold text-h6">
              Total saldo pendiente por comprometer
            </p>
            <div class="col-8">
              <InputMoneyComponent
                :currency="'USD'"
                hide_symbol
                :model-value="models?.total_outstanding_balance ?? null"
                disabled
                :rules="[]"
                @update:model-value="
                  ({ rawValue }) =>
                    (models.total_outstanding_balance = rawValue)
                "
              />
            </div>
          </div>
        </div>
      </div>

      <div
        v-else
        class="row q-col-gutter-x-lg q-col-gutter-y-sm flex justify-center"
      >
        <div class="col-xs-12 col-sm-12 col-md-5 flex justify-center">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin">
              Total saldo disponible presupuestal
            </p>
            <p class="text-weight-medium no-margin">
              {{ formatCurrencyString(models.total_available_balance) }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-5 flex justify-center">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin">Total saldo comprometido</p>
            <p class="text-weight-medium no-margin">
              {{ formatCurrencyString(models.total_committed_balance) }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-5 flex justify-center">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin">
              Total saldo pendiente por comprometer
            </p>
            <p class="text-weight-medium no-margin">
              {{ formatCurrencyString(models.total_outstanding_balance) }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="q-mt-xl q-mx-sm">
      <TableList
        :loading="tablePropertiesResourcesAssociatedBudget.loading"
        :columns="tablePropertiesResourcesAssociatedBudget.columns"
        :rows="tablePropertiesResourcesAssociatedBudget.rows"
        :pages="tablePropertiesResourcesAssociatedBudget.pages"
        :title="tablePropertiesResourcesAssociatedBudget.title"
        :custom-columns="['actions']"
        hide-pagination
        customNoDataMessageTitle="No hay datos registrados"
        customNoDataMessageSubtitle=""
      >
        <template #actions="{ row }">
          <Button
            :left-icon="defaultIconsLucide.copyPlus"
            color="primary"
            :class-custom="'custom'"
            :flat="true"
            :outline="false"
            colorIcon="#f45100"
            tooltip="Asociar hitos"
            @click="handleAddAssociatedMilestone(row)"
          />
        </template>
      </TableList>
    </section>
  </q-form>

  <AlertModalComponent
    :showImgDefault="false"
    styleModal="max-width: 1000px; width: 100%;"
    :title-header="`${modalAddAssociatedConfig.action} documento presupuestal`"
    ref="modalAddAssociatedRef"
    :showBtnCancel="false"
    :textBtnConfirm="
      modalAddAssociatedConfig.action === 'Agregar' ? 'Agregar' : 'Actualizar'
    "
    @confirm="handleConfirmedAssociatedBudget"
  >
    <template #default-body>
      <q-form ref="formAssociatedBudgetRef">
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mx-md">
          <div class="col-xs-12 col-sm-12 col-md-4">
            <GenericDateInputComponent
              :default_value="modalAddAssociatedConfig.validity"
              label="Vigencia"
              mask="YYYY"
              placeholder="YYYY"
              required
              navigation_max_year_month="2999-12"
              navigation_min_year_month="1950-01"
              :rules="[
                (val) =>
                  useRules().is_required(val, 'La vigencia es requerida'),
              ]"
              @update:model-value="
                (val) => (modalAddAssociatedConfig.validity = val)
              "
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-4">
            <GenericSelectorComponent
              label="Tipo de documento presupuestal"
              :default_value="
                modalAddAssociatedConfig?.budget_document_type_name
              "
              :manual_option="[]"
              map_options
              auto_complete
              disabled
              required
              :rules="[(val: string) => useRules().is_required(val,  'El tipo de documento presupuestal es requerido')]"
              @update:modelValue="
                modalAddAssociatedConfig.budget_document_type_name = $event
              "
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-4">
            <InputMoneyComponent
              label="Valor del documento presupuestal"
              required
              hide_symbol
              :model-value="modalAddAssociatedConfig?.value_document ?? null"
              disabled
              :rules="[]"
              @update:model-value="
                ({ rawValue }) =>
                  (modalAddAssociatedConfig.value_document = rawValue)
              "
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-4">
            <GenericDateInputComponent
              label="Fecha del documento"
              :default_value="modalAddAssociatedConfig?.document_date ?? null"
              required
              disabled
              :rules="[]"
              @update:modelValue="
                modalAddAssociatedConfig.document_date = $event
              "
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-4">
            <InputMoneyComponent
              :model-value="modalAddAssociatedConfig.available_balance"
              label="Saldo disponible"
              hide_symbol
              disabled
              :rules="[]"
              @update:model-value="
                ({ rawValue }) =>
                  (modalAddAssociatedConfig.available_balance = rawValue)
              "
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-4">
            <GenericSelectorComponent
              label="Número de documento"
              :default_value="
                modalAddAssociatedConfig?.budget_document_id ?? null
              "
              :manual_option="operation_logs_authorized"
              map_options
              auto_complete
              return_object
              display_label="label_contracts"
              required
              :rules="[(val: string) => useRules().is_required(val,  'El número de documento es requerido')]"
              @update:modelValue="updateValDocumentType"
            />
          </div>
        </div>
      </q-form>
    </template>
  </AlertModalComponent>

  <AlertModalComponent
    :showImgDefault="false"
    styleModal="max-width: 1000px; width: 100%;"
    title-header="Relación hitos programados al registro presupuestal"
    ref="alertModalRef"
    :showBtnCancel="false"
    :show-btn-confirm="action !== 'view'"
    :textBtnConfirm="'Crear'"
    @confirm="handleRelateMilestone"
  >
    <template #default-body>
      <q-form ref="formMilestonesRef">
        <div class="q-mt-xl q-mx-lg">
          <TableList
            :loading="tablePropertiesBudgetRecord.loading"
            :columns="tablePropertiesBudgetRecord.columns"
            :rows="tablePropertiesBudgetRecord.rows"
            :pages="tablePropertiesBudgetRecord.pages"
            :title="tablePropertiesBudgetRecord.title"
            hide-pagination
          />

          <div
            class="row q-col-gutter-x-lg q-col-gutter-y-sm q-my-xl"
            v-if="action !== 'view'"
          >
            <div class="col-xs-12 col-sm-12 col-md-4">
              <GenericSelectorComponent
                label="Hitos de pago programados"
                map_options
                first_filter_option="label"
                second_filter_option="label"
                :default_value="alertModalConfig.scheduled_milestone_id"
                :manual_option="milestones"
                :required="false"
                :rules="[]"
                :disabled="tablePropertiesScheduledMilestones.rows.length > 0"
                @update:model-value="
                  alertModalConfig.scheduled_milestone_id = $event
                "
              />
            </div>

            <div class="col-xs-12 col-sm-12 col-md-8 flex items-center q-mt-md">
              <Button
                :outline="false"
                label="Agregar"
                :left-icon="defaultIconsLucide.plusCircleOutline"
                color="primary"
                color-icon="white"
                :disabled="
                  tablePropertiesScheduledMilestones.rows.length > 0 ||
                  !alertModalConfig.scheduled_milestone_id
                "
                @click="handleAddMilestones"
              />
            </div>
          </div>

          <TableList
            class="q-mt-xl"
            :loading="tablePropertiesScheduledMilestones.loading"
            :columns="tablePropertiesScheduledMilestones.columns"
            :rows="tablePropertiesScheduledMilestones.rows"
            :pages="tablePropertiesScheduledMilestones.pages"
            :title="tablePropertiesScheduledMilestones.title"
            :custom-columns="['assigned_value', 'actions']"
            hide-pagination
            customNoDataMessageTitle="No hay datos registrados"
            customNoDataMessageSubtitle=""
          >
            <template #assigned_value="{ row }">
              <InputMoneyComponent
                v-if="['create', 'edit'].includes(action)"
                :model-value="row.assigned_value"
                hide_symbol
                hide_bottom_space
                :rules="[]"
                @update:model-value="
                  ({ rawValue }) => {
                    row.assigned_value = rawValue
                    handleUpdateAssignedValue(rawValue)
                  }
                "
              />
              <span v-else>
                {{ formatCurrencyString(row.assigned_value) ?? '-' }}
              </span>
            </template>

            <template #actions="{ row }">
              <Button
                v-if="['create', 'edit'].includes(action)"
                :left-icon="defaultIconsLucide.trash"
                color="primary"
                :class-custom="'custom'"
                :flat="true"
                :outline="false"
                colorIcon="#f45100"
                tooltip="Eliminar"
                @click="handleDeleteScheduledMilestone(row.id)"
              />
            </template>
          </TableList>
        </div>
      </q-form>
    </template>
  </AlertModalComponent>
</template>

<script lang="ts" setup>
// Components
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import InputMoneyComponent from '@/components/InputMoney/InputMoneyComponent.vue'

// Composables
import { useRules } from '@/composables'

// Interfaces
import { ActionType } from '@/interfaces/global'
import { IContractRegistrationGeneralDataForm } from '@/interfaces/customs/derivative-contracting/ContractRegistration'

//Logic form
import useAssociatedBudgetForm from '@/components/Forms/DerivativeContracting/ContractRegistration/AssociatedBudgetForm/AssociatedBudgetForm'

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: IContractRegistrationGeneralDataForm | null): void
}>()

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IContractRegistrationGeneralDataForm | null
  }>(),
  {}
)

const {
  models,
  formElementRef,
  tablePropertiesAssociatedBudget,
  tablePropertiesResourcesAssociatedBudget,
  tablePropertiesBudgetRecord,
  tablePropertiesScheduledMilestones,
  defaultIconsLucide,
  alertModalRef,
  formAssociatedBudgetRef,
  formMilestonesRef,
  alertModalConfig,
  modalAddAssociatedRef,
  modalAddAssociatedConfig,
  milestones,
  operation_logs_authorized,
  selectedRowsAssociatedBudget,

  handleRelateMilestone,
  handleConfirmedAssociatedBudget,
  handleAddAssociatedBudget,
  handleEditAssociatedBudget,
  handleDeleteAssociatedBudget,
  handleAddAssociatedMilestone,
  handleDeleteScheduledMilestone,
  formatCurrencyString,
  handleSelectAssociatedBudget,
  handleAddMilestones,
  handleUpdateAssignedValue,
  updateValDocumentType,
} = useAssociatedBudgetForm(props, emits)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
