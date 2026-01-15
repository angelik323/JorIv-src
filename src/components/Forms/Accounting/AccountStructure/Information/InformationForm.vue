<template>
  <div>
    <q-form ref="accountStructureForm" class="q-pa-lg" greedy>
      <section>
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
          <div class="col-12 col-md-4">
            <GenericInput
              label="Estructura"
              ref="structureRef"
              required
              :default_value="models.structure ?? ''"
              :rules="[(v: string) => useRules().is_required(v, 'El campo Estructura es requerido')]"
              :disabled="isEdit"
              @update:model-value="models.structure = $event"
            />
          </div>
          <div class="col-12 col-md-4">
            <GenericInput
              label="Finalidad"
              ref="purposeRef"
              required
              :default_value="models.purpose ?? ''"
              :rules="[(v: string) => useRules().is_required(v, 'El campo Finalidad es requerido')]"
              max_length="60"
              @update:model-value="models.purpose = $event"
            />
          </div>
          <div class="col-12 col-md-4">
            <GenericSelectorComponent
              label="Tipo"
              :manual_option="account_structure_types"
              map_options
              required
              :default_value="models.type"
              :auto_complete="false"
              :clearable="false"
              :disabled="isEdit"
              @update:modelValue="models.type = $event"
              :rules="[(v: string) => useRules().is_required(v, 'El Tipo es requerido')]"
            />
          </div>
        </div>
      </section>

      <q-separator spaced />

      <section v-if="isAccountingCatalog" class="q-pt-lg catalog-limit-table">
        <TableList
          :title="catalogLimitsTableProps.title"
          :loading="catalogLimitsTableProps.loading"
          :columns="catalogLimitsTableProps.columns"
          :rows="catalogLimitsTableProps.rows"
          :pages="catalogLimitsTableProps.pages"
          :custom-columns="[
            'description',
            'nature',
            'group',
            'type',
            'from_account',
            'to_account',
            'actions',
          ]"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #custom-header-action>
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
              @click="addCatalogLimit"
            />
          </template>

          <template #description="{ row }">
            <GenericInput
              ref="descriptionRef"
              :required="true"
              :default_value="row.description ?? ''"
              :rules="[(v: string) => useRules().is_required(v, '')]"
              @update:model-value="row.description = $event"
            />
          </template>

          <template #nature="{ row }">
            <GenericSelectorComponent
              :manual_option="catalog_limit_natures"
              :map_options="true"
              :required="true"
              :default_value="row.nature"
              :auto_complete="false"
              :clearable="false"
              @update:modelValue="row.nature = $event"
              :rules="[
      (v: string) => useRules().is_required(v, ''),
      validateUniqueLimit(row),
    ]"
            />
          </template>

          <template #type="{ row }">
            <GenericSelectorComponent
              :manual_option="catalog_limit_types"
              :map_options="true"
              :required="true"
              :default_value="row.type"
              :auto_complete="false"
              :clearable="false"
              @update:modelValue="selectType(row, $event)"
              :rules="[
      (v: string) => useRules().is_required(v, ''),
      validateUniqueLimit(row),
    ]"
            />
          </template>

          <template #group="{ row }">
            <GenericSelectorComponent
              :manual_option="catalog_limit_groups[row.type.toLowerCase() as CatalogGroupType]"
              :map_options="true"
              :required="true"
              :default_value="row.group || null"
              :auto_complete="false"
              :clearable="false"
              @update:modelValue="row.group = $event"
              :rules="[
      (v: string) => useRules().is_required(v, ''),
      validateUniqueLimit(row),
    ]"
            />
          </template>

          <template #from_account="{ row }">
            <GenericInput
              ref="fromAccountRef"
              :required="true"
              type="number"
              :default_value="row.from_account ?? ''"
              :rules="[
                (v: string) => useRules().is_required(v, ''),
               (v: string) => useRules().min_length(v, maxAccountInputLenght),
                (v: string) => useRules().max_length(v, maxAccountInputLenght),
                validateFromAccount(row),
                validateUniqueLimit(row),
              ]"
              @update:model-value="row.from_account = $event"
              @update:blur="accountStructureForm?.validate(false)"
            />
          </template>

          <template #to_account="{ row }">
            <GenericInput
              ref="toAccountRef"
              :required="true"
              type="number"
              :default_value="row.to_account ?? ''"
              :rules="[
                (v: string) => useRules().is_required(v, ''),
                (v: string) => useRules().min_length(v, maxAccountInputLenght),
      (v: string) => useRules().max_length(v, maxAccountInputLenght),
                validateToAccount(row),
                validateUniqueLimit(row),
              ]"
              @update:model-value="
                (val) => {
                  row.to_account = val
                }
              "
              @update:blur="accountStructureForm?.validate(false)"
            />
          </template>

          <template #actions="{ row }">
            <Button
              :left-icon="defaultIconsLucide.trash"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Eliminar"
              @click="removeCatalogLimit(row)"
            />
          </template>

          <template #custom-no-data>
            <div class="row justify-center mt-4">
              <div>
                <img src="@/assets/images/icons/no_data_2.svg" alt="Helion" />
              </div>
            </div>

            <p class="text-weight-bold text-h6 text-center">
              Actualmente no hay límites de cuentas
            </p>

            <p class="text-weight-light text-h6 text-center">
              Por favor, agregue uno para continuar el proceso
            </p>
          </template>
        </TableList>
      </section>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/common/Button/Button.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import TableList from '@/components/table-list/TableList.vue'

import { defaultIconsLucide } from '@/utils'

import {
  CatalogGroupType,
  IAccountStructureResponse,
} from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'

import useAccountStructureForm from './InformationForm'
import { useRules } from '@/composables'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IAccountStructureResponse
  }>(),
  {}
)

const emits = defineEmits(['update'])

defineExpose({
  validateForm: (focus = true) => accountStructureForm.value?.validate(focus),
  getFormData: () => models.value,
})

const {
  models,
  account_structure_types,
  catalog_limit_groups,
  catalog_limit_natures,
  catalog_limit_types,
  catalogLimitsTableProps,
  accountStructureForm,
  isEdit,
  isAccountingCatalog,
  maxAccountInputLenght,
  removeCatalogLimit,
  addCatalogLimit,
  updatePage,
  updatePerPage,
  selectType,
  validateFromAccount,
  validateToAccount,
  validateUniqueLimit,
} = useAccountStructureForm(props, emits)
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
