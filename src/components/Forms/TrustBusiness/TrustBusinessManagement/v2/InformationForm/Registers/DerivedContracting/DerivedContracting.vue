<template>
  <section>
    <q-form ref="derived_contracting_trut_business_form_ref">
      <p class="font-size-1 text-weight-bold">Parámetros</p>
      <div class="row q-col-gutter-md q-mb-md">
        <div class="col-12 col-md-4">
          <div class="column">
            <label class="text-subtitle2 text-bold q-mb-sm">
              ¿Maneja presupuesto?*
            </label>
            <RadioYesNo
              v-if="['create', 'edit'].includes(action)"
              v-model="models.has_budget"
              :options="default_yes_no"
              :default_value="models.has_budget"
              @update:model-value="models.has_budget = $event"
            />
            <div v-else>
              <p class="text-weight-medium no-margin">
                {{ models.has_budget ? 'Sí' : 'No' }}
              </p>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <div class="column">
            <label class="text-subtitle2 text-bold q-mb-sm">
              ¿Maneja proyectos?*
            </label>
            <RadioYesNo
              v-if="['create', 'edit'].includes(action)"
              v-model="models.has_project"
              :options="default_yes_no"
              :default_value="models.has_project"
              @update:model-value="models.has_project = $event"
            />
            <div v-else>
              <p class="text-weight-medium no-margin">
                {{ models.has_project ? 'Sí' : 'No' }}
              </p>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <div class="column">
            <label class="text-subtitle2 text-bold q-mb-sm">
              ¿Maneja estructura de obras?*
            </label>
            <RadioYesNo
              v-if="['create', 'edit'].includes(action)"
              v-model="models.has_structure_work"
              :options="default_yes_no"
              :default_value="models.has_structure_work"
              @update:model-value="models.has_structure_work = $event"
            />
            <div v-else>
              <p class="text-weight-medium no-margin">
                {{ models.has_structure_work ? 'Sí' : 'No' }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <!-- Tabla -->
      <div
        v-if="models.has_structure_work"
        class="q-mt-sm justify-center q-gutter-md ml-2 mr-4 mt-0 editable-table"
      >
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :rows="paginatedRows"
          :columns="tableProps.columns"
          :custom-columns="['id', 'actions', 'uid']"
          :pages="tableProps.pages"
          :rows-per-page="perPage"
          :rows-per-page-options="pageList"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #custom-header-action>
            <Button
              v-if="['create', 'edit'].includes(action)"
              label="Agregar"
              size="md"
              unelevated
              outline
              :disabled="models.has_structure_work != true"
              @click="addRegister"
            />
          </template>

          <template #id="{ row }">
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              :placeholder="`Seleccione una opción`"
              :required="true"
              :manual_option="work_plan"
              :map_options="true"
              auto_complete
              :default_value="row.work_plan_id"
              @update:model-value="row.work_plan_id = $event"
              :rules="[
                     (v: string) => useRules().is_required(v, 'El campo es requerido'),
                     (v: number) => useRules().not_exist_in_array(v, idsInArray as number[])
                    ]"
            />

            <p v-else class="text-weight-medium no-margin">
              {{ `${row.code} - ${row.name}` }}
            </p>
          </template>

          <template #actions="{ index }">
            <Button
              v-if="['create', 'edit'].includes(action)"
              :left-icon="defaultIconsLucide.trash"
              color="orange"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Eliminar"
              @click="removeRegister(index)"
            />
          </template>
          <template #uid="{ row }">
            <p class="text-grey-6 mb-0">
              {{ row.id }}
            </p>
          </template>
        </TableList>
      </div>
    </q-form>
  </section>
</template>

<script setup lang="ts">
// Components
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import TableList from '@/components/table-list/TableList.vue'

// Interfaces - Constans
import { ActionType } from '@/interfaces/global'
import { IBusinessDerivedContracting } from '@/interfaces/customs/trust-business/TrustBusinesses'
import { default_yes_no } from '@/constants/resources'

// Composables
import { useRules, useUtils } from '@/composables'

// Logic
import useDerivedContracting from '@/components/Forms/TrustBusiness/TrustBusinessManagement/v2/InformationForm/Registers/DerivedContracting/DerivedContracting'

const { defaultIconsLucide } = useUtils()

const props = defineProps<{
  action: ActionType
  data?: IBusinessDerivedContracting | null
}>()

const emits =
  defineEmits<
    (e: 'update:models', value: IBusinessDerivedContracting) => void
  >()

const {
  models,
  tableProps,
  derived_contracting_trut_business_form_ref,
  paginatedRows,
  work_plan,
  idsInArray,

  perPage,
  pageList,
  updatePage,
  updatePerPage,
  addRegister,
  removeRegister,
} = useDerivedContracting(props, emits)

defineExpose({
  validateForm: () =>
    derived_contracting_trut_business_form_ref.value?.validate(),
})
</script>
