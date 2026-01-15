<template>
  <q-form ref="formElementRef" class="q-pa-lg">
    <section class="q-mx-sm">
      <TableList
        :loading="tablePropertiesClauses.loading"
        :columns="tablePropertiesClauses.columns"
        :rows="tablePropertiesClauses.rows"
        :pages="tablePropertiesClauses.pages"
        :custom-columns="['actions']"
        hide-pagination
        :selection="action === 'create' ? 'none' : 'single'"
        v-model:selected="selectedRowsClauses"
        customNoDataMessageTitle="No hay datos registrados"
        customNoDataMessageSubtitle=""
      >
        <template #custom-header>
          <div
            class="q-mt-sm q-mb-sm full-width flex justify-between items-center"
          >
            <span class="text-h5">
              {{ tablePropertiesClauses.title }}
            </span>
            <Button
              v-if="['create', 'edit'].includes(action)"
              :outline="false"
              label="Crear"
              :class-custom="'items-center'"
              :left-icon="defaultIconsLucide.plusCircleOutline"
              color-icon="white"
              :style-content="{ 'align-items': 'center' }"
              @click="handleOpenModal"
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
            @click="openClauseModal(row.id, 'Editar')"
          />
          <Button
            :left-icon="defaultIconsLucide.eye"
            color="primary"
            :class-custom="'custom'"
            :flat="true"
            :outline="false"
            colorIcon="#f45100"
            tooltip="Ver"
            @click="openClauseModal(row.id, 'Ver')"
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
            @click="handleOpenModalDelete(row.id)"
          />
        </template>
      </TableList>
    </section>

    <section class="mx-4 my-4" v-if="action !== 'create'">
      <div class="row justify-end q-gutter-md">
        <Button
          label="Generar PDF de cláusulas"
          size="md"
          unelevated
          no-caps
          :outline="false"
          color="orange"
          class="btn-filter custom"
          :disabled="selectedRowsClauses?.length === 0"
          @click="generateClausesPDF"
        />
      </div>
    </section>
  </q-form>
  <AlertModalComponent
    :showImgDefault="false"
    styleModal="max-width: 1000px; width: 100%;"
    :title-header="`${addClausesModalConfig.action} cláusula`"
    ref="addClausesModalRef"
    :showBtnCancel="false"
    :textBtnConfirm="
      addClausesModalConfig.action === 'Editar'
        ? 'Actualizar'
        : addClausesModalConfig.action === 'Crear'
        ? 'Crear'
        : 'Ver'
    "
    :show-btn-confirm="addClausesModalConfig.action !== 'Ver'"
    @confirm="handleAddClause"
  >
    <template #default-body>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mx-md">
        <div class="col-xs-12 col-sm-12 col-md-4">
          <GenericInputComponent
            v-if="['Crear', 'Editar'].includes(addClausesModalConfig.action)"
            :default_value="addClausesModalConfig.order"
            label="Orden de cláusulas"
            placeholder="Ingrese"
            max_length="2"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'Este campo es requerido'),
              (val: string) => useRules().max_length(val, 2),
            ]"
            @update:model-value="addClausesModalConfig.order = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Orden de cláusula</p>
            <p class="text-weight-medium no-margin">
              {{ addClausesModalConfig.order || 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4">
          <GenericSelectorComponent
            v-if="['Crear', 'Editar'].includes(addClausesModalConfig.action)"
            label="Tipo de cláusula"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :default_value="addClausesModalConfig.clause_type_id"
            :manual_option="clause_types"
            return_object
            required
            :rules="[(val: string) => useRules().is_required(val, 'Este campo es requerido')]"
            @update:model-value="
              (val) => {
                addClausesModalConfig.clause_type_id = val.value
                addClausesModalConfig.clause_type = val.label
              }
            "
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tipo de cláusula</p>
            <p class="text-weight-medium no-margin">
              {{ addClausesModalConfig.clause_type || 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-4">
          <GenericSelectorComponent
            v-if="['Crear', 'Editar'].includes(addClausesModalConfig.action)"
            label="Nombre de la cláusula"
            map_options
            first_filter_option="label"
            second_filter_option="label"
            :default_value="addClausesModalConfig.contract_clause_id"
            :manual_option="contract_clauses_codes"
            display_value="value_id"
            display_label="label_name"
            return_object
            required
            :rules="[(val: string) => useRules().is_required(val, 'Este campo es requerido')]"
            @update:model-value="
              (val) => {
                addClausesModalConfig.contract_clause_id = val.value_id
                addClausesModalConfig.name = val.label_name
                addClausesModalConfig.description = val.description
                addClausesModalConfig.clausule = val.clausule
              }
            "
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Nombre de la cláusula</p>
            <p class="text-weight-medium no-margin">
              {{ addClausesModalConfig.name || 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12">
          <GenericInputComponent
            v-if="['Crear', 'Editar'].includes(addClausesModalConfig.action)"
            :default_value="addClausesModalConfig.description"
            label="Cláusula"
            placeholder="Ingrese"
            type="textarea"
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'Este campo es requerido'),
            ]"
            @update:model-value="addClausesModalConfig.description = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Cláusula</p>
            <p class="text-weight-medium no-margin">
              {{ addClausesModalConfig.description || 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
    </template>
  </AlertModalComponent>

  <AlertModalComponent
    ref="alertModalRef"
    styleModal="min-width: 400px"
    :title="alertModalConfig.title"
    @confirm="handleDeleteClause(alertModalConfig.id as number)"
    :showCloseBtn="alertModalConfig.showCloseBtn"
  >
    <template #default-body>
      <p class="text-center text-grey-6 mx-4 q-px-lg">
        {{ alertModalConfig.description }}
      </p>

      <p class="text-center text-grey-6 mx-4 q-px-lg">
        {{ alertModalConfig.description2 }}
      </p>
    </template>
  </AlertModalComponent>
</template>

<script lang="ts" setup>
// Components
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'

// Composables
import { useRules } from '@/composables'

// Interfaces
import { ActionType } from '@/interfaces/global'
import { IContractRegistrationGeneralDataForm } from '@/interfaces/customs/derivative-contracting/ContractRegistration'

//Logic form
import useClausesForm from '@/components/Forms/DerivativeContracting/ContractRegistration/Clauses/ClausesForm'

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
  formElementRef,
  tablePropertiesClauses,
  defaultIconsLucide,
  alertModalRef,
  alertModalConfig,
  addClausesModalRef,
  addClausesModalConfig,
  clause_types,
  contract_clauses_codes,
  selectedRowsClauses,

  handleOpenModal,
  handleAddClause,
  handleDeleteClause,
  openClauseModal,
  generateClausesPDF,
  handleOpenModalDelete,
} = useClausesForm(props, emits)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
