<template>
  <q-form
    ref="formElementRef"
    aria-label="Formulario de datos básicos para centros de costos"
  >
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.account_structure"
            label="Estructura centro de costos"
            auto_complete
            map_options
            :manual_option="available_cost_center_structures_code_label"
            required
            :disabled="action === 'edit'"
            :rules="[
              (val: string) => useRules().is_required(val, 'La estructura es requerida'),
            ]"
            @update:model-value="models.account_structure = $event"
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">
              Estructura centro de costos
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.account_structure || 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.purpose"
            label="Finalidad"
            placeholder="-"
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Finalidad</p>
            <p class="text-weight-medium no-margin">
              {{ models.purpose || 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.structure"
            label="Diseño de la estructura"
            placeholder="-"
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Diseño de la estructura</p>
            <p class="text-weight-medium no-margin">
              {{ models.structure || 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            v-if="['create', 'edit'].includes(action)"
            :default_value="models.status"
            label="Estado de la estructura"
            placeholder="-"
            disabled
          />
          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Estado de la estructura</p>
            <p class="text-weight-medium no-margin">
              {{ models.status || 'No registrado' }}
            </p>
          </div>
        </div>
      </div>
      <q-form v-if="action === 'view'" ref="searchFormElementRef">
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mb-sm q-my-md">
          <div class="col-12 col-md-12 col-lg-12">
            <GenericInputComponent
              :default_value="search"
              label="Buscador"
              placeholder="Buscar por código o nombre de centro de costos"
              :rules="[
                (val: string) => useRules().only_alphanumeric(val),
              ]"
              @update:model-value="search = $event"
            />
          </div>
        </div>
      </q-form>
      <q-separator :class="action === 'create' ? 'q-mt-sm' : 'q-mt-lg'" />
    </section>

    <section class="q-mt-lg">
      <div
        class="row justify-between items-end q-col-gutter-y-sm q-mb-lg"
        style="width: 100%"
      >
        <div class="col-auto">
          <p class="text-black text-weight-bold text-h6 q-mb-none">
            Catálogo de centros de costo
          </p>
        </div>

        <div class="col-auto">
          <Button
            v-if="['create', 'edit'].includes(action)"
            ref="addPlanButtonRef"
            label="Agregar"
            :outline="false"
            :left-icon="defaultIconsLucide.plusCircleOutline"
            color-icon="white"
            @click="addRow"
          />
        </div>
      </div>

      <VCard class="q-px-lg q-pt-xs q-pb-lg">
        <template #content-card>
          <TableList
            :loading="tableProperties.loading"
            :columns="tableProperties.columns"
            :rows="tableProperties.rows"
            :custom-columns="
              ['create', 'edit'].includes(action)
                ? ['id', 'code', 'type', 'name', 'actions']
                : []
            "
            :rows-per-page-options="[0]"
            hide-pagination
          >
            <template #id="{ row }">
              {{ row.id }}
            </template>

            <template v-if="action !== 'view'" #code="{ row }">
              <GenericInputComponent
                :default_value="row.code"
                hide_bottom_space
                required
                :disabled="action === 'edit' && !row.isNew"
                :rules="[
                  (val: string) => useRules().is_required(val, 'El código es requerido'),
                  (val: string) => useRules().max_length(val, 40),
                  (val: string) => useRules().only_number(val),
                ]"
                @update:modelValue="
                  (val) => updateRowField(row.id, 'code', val)
                "
              />
            </template>

            <template v-if="action !== 'view'" #type="{ row }">
              <GenericSelectorComponent
                :default_value="row.type"
                auto_complete
                map_options
                :manual_option="cost_center_types"
                hide_bottom_space
                required
                :rules="[
                  (val: string) => useRules().is_required(val, 'El tipo es requerido'),
                ]"
                @update:modelValue="
                  (val) => updateRowField(row.id, 'type', val)
                "
              />
            </template>

            <template v-if="action !== 'view'" #name="{ row }">
              <GenericInputComponent
                :default_value="row.name"
                hide_bottom_space
                required
                :rules="[
                  (val: string) => useRules().is_required(val, 'El nombre es requerido'),
                  (val: string) => useRules().max_length(val, 250 ),
                  (val: string) => useRules().only_alphanumeric(val),
                ]"
                @update:modelValue="
                  (val) => updateRowField(row.id, 'name', val)
                "
              />
            </template>

            <template v-if="action !== 'view'" #actions="{ row }">
              <Button
                :left-icon="defaultIconsLucide.trash"
                color="orange"
                class-custom="custom"
                :outline="false"
                flat
                colorIcon="#f45100"
                tooltip="Eliminar"
                @click="removeRow(row)"
              />
            </template>

            <template #custom-no-data>
              <div class="column justify-center items-center">
                <img
                  src="@/assets/images/icons/no_data_accounting.svg"
                  alt="Actualmente no hay centros de costos"
                  width="180px"
                />
                <div class="q-mt-lg text-black text-center">
                  <p class="text-weight-bold text-h6 q-mb-xs">
                    Actualmente no hay centros de costos
                  </p>
                  <p class="text-weight-medium">
                    Por favor, agregue uno para continuar con el proceso
                  </p>
                </div>
              </div>
            </template>
          </TableList>
        </template>
      </VCard>
    </section>
  </q-form>
</template>

<script lang="ts" setup>
import { ActionType } from '@/interfaces/global'
import { ICostCenterInformationForm } from '@/interfaces/customs/accounting/CostCenterV2'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import { useRules } from '@/composables'
import useInformationForm from './InformationForm'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data: ICostCenterInformationForm | null
  }>(),
  {}
)

const emits = defineEmits<{
  (e: 'validate:form'): void
  (e: 'update:data', value: ICostCenterInformationForm | null): void
  (e: 'delete:costCenter', value: number): void
  (e: 'search:costCenter', value: string): void
}>()

const {
  available_cost_center_structures_code_label,
  cost_center_types,
  defaultIconsLucide,
  formElementRef,
  models,
  searchFormElementRef,
  search,
  tableProperties,
  addRow,
  updateRowField,
  removeRow,
} = useInformationForm(props, emits)

defineExpose({
  validateForm: () => formElementRef.value?.validate(),
})
</script>
