<template>
  <q-form ref="formElementRef" class="q-pa-lg">
    <section>
      <p class="text-black-10 text-weight-bold text-h6 q-mb-md">
        Relación de aprobaciones presupuestales futuras
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

        <div class="col-xs-12 col-sm-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold">Monto con cobertura presupuestal</p>
            <p class="text-weight-medium">
              {{ formatCurrencyString(models.total_committed_balance) ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold">Monto con cobertura futura</p>
            <p class="text-weight-medium">
              {{ formatCurrencyString(models.total_future_coverage) ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold">
              Monto pendiente de asignación presupuestal
            </p>
            <p class="text-weight-medium">
              {{
                formatCurrencyString(models.pending_budget_allocation) ?? '-'
              }}
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
        hide-pagination
        v-model:selected="selectedRows"
        @update:selected="handleSelectedRows"
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
              :style-content="{ 'align-items': 'center' }"
              @click="handleAddFutureValidity"
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
            @click="handleEditFutureValidity(row.id)"
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

    <section class="q-mt-xl q-mx-sm">
      <template v-if="['create', 'edit'].includes(action)">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-md">
          Asociación hitos programados
        </p>

        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-my-lg">
          <div class="col-xs-12 col-sm-12 col-md-4">
            <GenericSelectorComponent
              label="Hitos de pago programado"
              map_options
              first_filter_option="label"
              second_filter_option="label"
              :default_value="models.scheduled_milestone_id"
              :manual_option="milestones"
              :required="false"
              :disabled="selectedRows.length === 0"
              :rules="[]"
              @update:model-value="models.scheduled_milestone_id = $event"
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
                selectedRows.length === 0 || !models.scheduled_milestone_id
              "
              @click="handleAddMilestones"
            />
          </div>
        </div>
      </template>

      <TableList
        :loading="tablePropertiesScheduledMilestones.loading"
        :columns="tablePropertiesScheduledMilestones.columns"
        :rows="tablePropertiesScheduledMilestones.rows"
        :pages="tablePropertiesScheduledMilestones.pages"
        :custom-columns="['actions']"
        hide-pagination
        customNoDataMessageTitle="No hay datos registrados"
        customNoDataMessageSubtitle=""
      >
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
            @click="handleDeleteAssociatedMilestone(row.id)"
          />
        </template>
      </TableList>
    </section>
  </q-form>

  <AlertModalComponent
    :showImgDefault="false"
    styleModal="max-width: 1000px; width: 100%;"
    :title-header="`${modalAddFutureValiditiesConfig.action} proyección presupuestal`"
    ref="modalAddFutureValiditiesRef"
    :showBtnCancel="false"
    :textBtnConfirm="
      modalAddFutureValiditiesConfig.action === 'Editar'
        ? 'Actualizar'
        : 'Agregar'
    "
    @confirm="handleConfirmedFutureValidity"
  >
    <template #default-body>
      <q-form ref="futureValiditiesFormRef">
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mx-md">
          <div class="col-xs-12 col-sm-12 col-md-4">
            <GenericDateInputComponent
              :default_value="
                modalAddFutureValiditiesConfig.fiscal_year?.toString() ?? null
              "
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
                (val) => (modalAddFutureValiditiesConfig.fiscal_year = val)
              "
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-4">
            <GenericSelectorComponent
              label="Recursos"
              :default_value="
                modalAddFutureValiditiesConfig?.budget_resource_id ?? null
              "
              :manual_option="budget_resources_types"
              map_options
              auto_complete
              required
              return_object
              :rules="[(val: string) => useRules().is_required(val,  'Los recursos son requeridos')]"
              @update:modelValue="
                (val) => {
                  modalAddFutureValiditiesConfig.budget_resource_id = val.value
                  modalAddFutureValiditiesConfig.budget_resource = val.label
                }
              "
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-4">
            <GenericSelectorComponent
              label="Área"
              :default_value="
                modalAddFutureValiditiesConfig?.budget_area_id ?? null
              "
              :manual_option="areas_resposabilities_codes"
              map_options
              auto_complete
              return_object
              required
              :rules="[(val: string) => useRules().is_required(val,  'El área es requerida')]"
              @update:modelValue="
                (val) => {
                  modalAddFutureValiditiesConfig.budget_area_id = val.value
                  modalAddFutureValiditiesConfig.budget_area = val.label
                }
              "
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-4">
            <GenericSelectorComponent
              label="Rubro"
              :default_value="
                modalAddFutureValiditiesConfig?.budget_item_id ?? null
              "
              :manual_option="budget_item_codes"
              map_options
              auto_complete
              return_object
              required
              :rules="[(val: string) => useRules().is_required(val,  'El rubro es requerido')]"
              @update:modelValue="
                (val) => {
                  modalAddFutureValiditiesConfig.budget_item_id = val.value
                  modalAddFutureValiditiesConfig.budget_item = val.label
                }
              "
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-4">
            <InputMoneyComponent
              :model-value="modalAddFutureValiditiesConfig.projected_value"
              label="Valor proyectado"
              hide_symbol
              disabled
              :rules="[]"
              @update:model-value="
                ({ rawValue }) =>
                  (modalAddFutureValiditiesConfig.projected_value = rawValue)
              "
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-4">
            <InputMoneyComponent
              :model-value="
                modalAddFutureValiditiesConfig.committed_future_value
              "
              label="Compromiso con vigencia futura"
              hide_symbol
              :rules="[]"
              disabled
              @update:model-value="
                ({ rawValue }) =>
                  (modalAddFutureValiditiesConfig.committed_future_value =
                    rawValue)
              "
            />
          </div>
        </div>
      </q-form>
    </template>
  </AlertModalComponent>
</template>

<script lang="ts" setup>
// Components
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'

// Composables
import { useRules } from '@/composables'

// Interfaces
import { ActionType } from '@/interfaces/global'
import { IContractRegistrationGeneralDataForm } from '@/interfaces/customs/derivative-contracting/ContractRegistration'

//Logic form
import useFutureValiditiesForm from '@/components/Forms/DerivativeContracting/ContractRegistration/FutureValidities/FutureValiditiesForm'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import InputMoneyComponent from '@/components/InputMoney/InputMoneyComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'

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
  tablePropertiesScheduledMilestones,
  defaultIconsLucide,
  selectedRows,
  milestones,
  modalAddFutureValiditiesConfig,
  modalAddFutureValiditiesRef,
  futureValiditiesFormRef,
  areas_resposabilities_codes,
  budget_item_codes,
  budget_resources_types,

  handleAddFutureValidity,
  handleConfirmedFutureValidity,
  handleDeleteAssociatedBudget,
  handleEditFutureValidity,
  handleDeleteAssociatedMilestone,
  handleAddMilestones,
  formatCurrencyString,
  handleSelectedRows,
} = useFutureValiditiesForm(props, emits)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
