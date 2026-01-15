<template>
  <div>
    <q-form ref="costCenterForm" class="q-pa-lg">
      <section>
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
          <div class="col-12 col-md-4">
            <GenericSelectorComponent
              label="Estructura centro de costo"
              :manual_option="
                isEdit
                  ? cost_center_structure_options
                  : available_cost_center_structures
              "
              :map_options="true"
              required
              :default_value="models.account_structure_id"
              option_label="label"
              option_value="value"
              :auto_complete="false"
              :clearable="false"
              :disabled="isEdit || readonly"
              @update:modelValue="models.account_structure_id = $event"
              :rules="readonly ? [] : [(val: string) => !!val || 'La estructura es requerida']"
            />
          </div>

          <div class="col-12 col-md-4">
            <GenericInput
              v-if="['create', 'view'].includes(action)"
              label="Finalidad"
              :default_value="selectedStructure.purpose"
              disabled
              placeholder="Finalidad"
              :rules="[]"
            />
            <GenericInput
              v-else
              label="Finalidad"
              :default_value="models.purpose"
              disabled
              placeholder="Finalidad"
              :rules="[]"
            />
          </div>

          <div class="col-12 col-md-4">
            <GenericInput
              v-if="['create', 'view'].includes(action)"
              label="Tipo de estructura"
              :default_value="selectedStructure.type"
              disabled
              placeholder="Tipo de estructura"
              :rules="[]"
            />
            <GenericInput
              v-else
              label="Tipo de estructura"
              :default_value="models.type"
              disabled
              placeholder="Tipo de estructura"
              :rules="[]"
            />
          </div>

          <div class="col-12 col-md-4">
            <GenericSelectorComponent
              v-if="['create', 'view'].includes(action)"
              label="Estructura cuenta contable"
              :manual_option="
                isEdit ? account_chart_options : available_account_charts
              "
              :map_options="true"
              required
              option_label="code"
              option_value="code"
              :default_value="models.account_chart_id"
              :disabled="isEdit || readonly"
              @update:modelValue="models.account_chart_id = $event"
              :rules="readonly ? [] : [(val: string) => !!val || 'La estructura contable es requerida']"
            />
            <GenericSelectorComponent
              v-else
              label="Estructura cuenta contable"
              :manual_option="
                isEdit ? account_chart_options : available_account_charts
              "
              :map_options="true"
              required
              option_label="code"
              option_value="code"
              :default_value="models.account_chart"
              :disabled="isEdit || readonly"
              @update:modelValue="models.account_chart = $event"
              :rules="readonly ? [] : [(val: string) => !!val || 'La estructura contable es requerida']"
            />
          </div>

          <div class="col-12 col-md-4">
            <GenericInput
              label="Finalidad"
              :default_value="selectedStructureChart.purpose"
              disabled
              placeholder="Finalidad"
            />
          </div>

          <div class="col-12 col-md-4">
            <GenericInput
              label="Tipo de estructura"
              :default_value="selectedStructureChart.type"
              disabled
              placeholder="Tipo de estructura"
            />
          </div>
        </div>
      </section>

      <q-separator spaced />

      <section v-if="!readonly" class="q-pt-lg catalog-limit-table">
        <div class="row items-center justify-between q-mb-md">
          <div class="text-subtitle1 text-weight-bold">
            Catálogo de centros de costo
          </div>
          <Button
            :outline="false"
            label="Agregar"
            left-icon="PlusCircle"
            color-icon="white"
            :styleContent="{
              'place-items': 'center',
              'border-radius': '20px',
              'font-size': '13px',
            }"
            @click="addCatalogRow"
          />
        </div>

        <TableList
          v-if="visibleCostCenters.length"
          :rows="visibleCostCenters"
          :columns="[
            { name: 'index', label: '#', field: 'index', align: 'center' },
            { name: 'code', label: 'Código', field: 'code', align: 'center' },
            { name: 'type', label: 'Tipo', field: 'type', align: 'center' },
            { name: 'name', label: 'Nombre', field: 'name', align: 'center' },
            {
              name: 'actions',
              label: 'Acciones',
              field: 'actions',
              align: 'center',
            },
          ]"
          :loading="false"
          :pages="{
            currentPage: pagination.page,
            lastPage: Math.max(
              1,
              Math.ceil(models.costCenters.length / pagination.rowsPerPage)
            ),
          }"
          :custom-columns="['index', 'code', 'type', 'name', 'actions']"
          :rows-per-page-options="[5, 10, 15]"
          @update-page="(val) => (pagination.page = val)"
          @update-rows-per-page="(val) => (pagination.rowsPerPage = val)"
        >
          <template #index="{ row }">
            {{ row.index }}
          </template>

          <template #code="{ row }">
            <GenericInput
              required
              :default_value="row.code"
              :disabled="!!row.id"
              @update:modelValue="onCodeInput($event, row)"
              :rules="[
                (v: string) => !!v || 'Código requerido',
                (v: string) => /^\d+$/.test(v) || 'Solo se permiten números'
               ]"
              placeholder="Inserte"
            />
          </template>

          <template #type="{ row }">
            <GenericSelectorComponent
              :manual_option="cost_center_types"
              required
              placeholder="Seleccione"
              :default_value="row.type"
              :rules="[]"
              @update:model-value="row.type = $event"
            />
          </template>

          <template #name="{ row }">
            <GenericInput
              required
              :default_value="row.name"
              @update:modelValue="row.name = $event"
              :rules="[(v: string) => !!v || 'Nombre requerido']"
            />
          </template>

          <template>
            <GenericInput
              :default_value="valor"
              @update:modelValue="valor = $event"
            />
            <div>Valor: {{ valor }}</div>
          </template>

          <template #actions="{ row }">
            <Button
              :left-icon="defaultIconsLucide.trash"
              colorIcon="#f45100"
              flat
              outline
              tooltip="Eliminar"
              @click="removeCatalogRow(row._originalIndex)"
            />
          </template>
        </TableList>

        <VCard v-else>
          <template #content-card
            ><div class="row justify-center mt-4">
              <img
                src="@/assets/images/icons/empty.svg"
                alt="Sin centros de costo"
                style="max-width: 200px"
              />
            </div>
            <p class="text-h6 text-center text-weight-bold">
              Actualmente no hay centros de costo creados
            </p>
            <p class="text-h6 text-center text-weight-light">
              Por favor, agrega uno usando el botón "Agregar"
            </p></template
          >
        </VCard>
      </section>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/common/Button/Button.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import useCostCenterForm from '@/components/Forms/Accounting/CostCenter/CostCenterForm'
import { defaultIconsLucide } from '@/utils'
import VCard from '@/components/common/VCard/VCard.vue'
import { ICostCenterModel } from '@/interfaces/customs'
const valor = ref('')

const props = withDefaults(
  defineProps<{
    action: 'create' | 'edit' | 'view'
    data?: ICostCenterModel
    readonly?: boolean
  }>(),
  {
    readonly: false,
  }
)

const emits = defineEmits(['update'])

defineExpose({
  validate: () => costCenterForm.value?.validate(),
  getFormData: () => models.value,
})

const {
  costCenterForm,
  available_account_charts,
  available_cost_center_structures,
  cost_center_types,
  cost_center_structure_options,
  account_chart_options,
  models,
  pagination,
  visibleCostCenters,
  isEdit,
  selectedStructure,
  selectedStructureChart,
  addCatalogRow,
  removeCatalogRow,
} = useCostCenterForm(props, emits)

function onCodeInput(value: string, row: any) {
  const sanitized = value.replace(/\D/g, '')
  row.code = sanitized
}
</script>

<style lang="scss" scoped>
:deep(.catalog-limit-table) {
  .q-field {
    padding-bottom: 0 !important;
  }
  .q-select .q-field__native {
    min-height: unset;
  }
}
</style>
