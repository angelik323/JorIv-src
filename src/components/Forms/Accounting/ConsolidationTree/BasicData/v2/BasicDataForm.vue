<template>
  <q-form
    ref="consolidationTreeFormRef"
    aria-label="Formulario de datos básicos para árbol de consolidación"
  >
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create'].includes(action)"
            label="Código de negocio"
            :manual_option="bussines_parent"
            :default_value="''"
            :clearable="false"
            map_options
            auto_complete
            required
            :rules="[
              (val: string) => useRules().is_required(val, 'El código de negocio es requerido'),
            ]"
            @update:modelValue="onChangeSelectorParent($event)"
          />
          <GenericInput
            v-else-if="['edit'].includes(action)"
            label="Código de negocio"
            :default_value="models.code ?? ''"
            type="text"
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Código de negocio</p>
            <p class="text-weight-medium no-margin">
              {{ models.code || 'No registrado' }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Nombre de negocio"
            :default_value="models.name ?? ''"
            placeholder="-"
            type="text"
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Nombre de negocio</p>
            <p class="text-weight-medium no-margin">
              {{ models.name || 'No registrado' }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <GenericInput
            v-if="['create', 'edit'].includes(action)"
            label="Estructura contable"
            :default_value="`${models.accounting_structure.code} - ${models.accounting_structure.purpose}`"
            type="text"
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Estructura contable</p>
            <p class="text-weight-medium no-margin">
              {{
                `${models.accounting_structure.code} - ${models.accounting_structure.purpose}`
              }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            label="Estado"
            :manual_option="business_trust_statuses"
            :default_value="models.status_id"
            map_options
            required
            :rules="[]"
            disabled
            placeholder="-"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Estado</p>
            <p class="text-weight-medium no-margin">
              <ShowStatus :type="Number(models?.status_id ?? 1)" />
            </p>
          </div>
        </div>
      </div>
    </section>
    <q-separator class="q-my-xl" />
    <section class="mx-2">
      <TableList
        :loading="tableProps.loading"
        :columns="tableProps.columns"
        :rows="tableProps.rows"
        :pages="tableProps.pages"
        :custom-columns="['code', 'status_id', 'actions']"
        @update-page="updatePage"
        @update-rows-per-page="updatePerPage"
      >
        <template #custom-header>
          <div>
            <p class="q-my-none text-weight-medium text-h5">
              {{ tableProps.title }}
            </p>
          </div>
          <q-space />

          <Button
            v-if="!['view'].includes(props.action)"
            no-caps
            unelevated
            :label="'Agregar'"
            :leftIcon="defaultIconsLucide.plusCircle"
            :color-icon="'white'"
            :text-color="'white'"
            :outline="false"
            :color="'primary'"
            :tooltip="'Agregar'"
            @click="addRowTable"
          />
        </template>

        <template #status_id="{ row }">
          <div class="q-pa-md">
            <ShowStatus v-if="row.id" :type="Number(row?.status_id ?? '')" />
          </div>
        </template>

        <template #code="{ row, index }">
          <GenericInput
            v-if="
              ['create', 'edit'].includes(action) && disabledRowOnCreate(row.id)
            "
            :default_value="`${row.code} - ${row.name}`"
            type="text"
            disabled
            required
            hide_bottom_space
          />
          <GenericSelectorComponent
            v-else-if="['create', 'edit'].includes(action)"
            :manual_option="bussines_child"
            :default_value="row.id ?? ''"
            :clearable="false"
            map_options
            auto_complete
            required
            display_label="label_code_name"
            :rules="[
              (val: string) => useRules().is_required(val, 'El código de negocio es requerido'),
            ]"
            @update:modelValue="updateChild($event, index)"
            :disabled="disabledRowOnCreate(row.id)"
            hide_bottom_space
          />
          <p v-else class="mb-0">
            {{ row.code ?? 'No registrado' }}
          </p>
        </template>

        <template #custom-no-data>
          <div
            class="column justify-center items-center q-col-gutter-y-lg q-mt-sm"
          >
            <img
              src="@/assets/images/icons/no_data_accounting.svg"
              alt="No hay datos para mostrar"
              width="180px"
            />
            <p class="text-weight-bold text-h5 text-center mb-1">
              Actualmente no hay negocios consolidados
            </p>
            <p class="text-weight-medium text-subtitle1 text-center q-pt-none">
              Por favor, agregue uno para continuar con el proceso
            </p>
          </div>
        </template>

        <template #actions="{ row, index }">
          <Button
            :left-icon="defaultIconsLucide.trash"
            color="orange"
            :class-custom="'custom'"
            :outline="false"
            :flat="true"
            colorIcon="#f45100"
            :tooltip="'Eliminar'"
            @click="removeChild(row.id, index)"
          />
        </template>
      </TableList>
    </section>
    <q-separator class="q-my-xl" />
  </q-form>
</template>

<script lang="ts" setup>
// Interfaces
import { ActionType } from '@/interfaces/global'
import { IConsolidationTree } from '@/interfaces/customs/accounting/ConsolidationTree'

// Composables
import useBasicDataForm from '@/components/Forms/Accounting/ConsolidationTree/BasicData/v2/BasicDataForm'

// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'
import ShowStatus from '@/components/showStatus/ShowStatus.vue'
import { useRules } from '@/composables'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IConsolidationTree | null
  }>(),
  {}
)

defineExpose({
  validateForm: () => consolidationTreeFormRef.value?.validate(),
  getFormData: () => models.value,
})

const {
  models,
  tableProps,
  bussines_parent,
  bussines_child,
  business_trust_statuses,
  consolidationTreeFormRef,
  defaultIconsLucide,
  addRowTable,
  updateChild,
  removeChild,
  onChangeSelectorParent,
  updatePage,
  updatePerPage,
  disabledRowOnCreate,
} = useBasicDataForm(props)
</script>
