<template>
  <q-form ref="assetsContributorsRef">
    <section>
      <div class="flex items-center justify-between q-mb-none q-mb-none">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
          Aportantes de bien
        </p>
        <Button
          v-if="action !== 'view'"
          class="text-capitalize btn-filter custom q-mb-none"
          label="Agregar"
          color-icon="white"
          size="md"
          left-icon="PlusCircle"
          :outline="false"
          @click="validateAndAddRow"
        />
      </div>

      <TableList
        v-if="tableProps.rows.length > 0"
        hide-pagination
        dense
        class="editable-table"
        :columns="tableProps.columns"
        :visible-columns="visibleColumns"
        :loading="tableProps.loading"
        :rows="tableProps.rows"
        :custom-columns="[
          'nit',
          'description',
          'guarantee_percentage',
          'distribution_type',
          'actions',
        ]"
      >
        <template #id="{ row }">
          <p class="q-mb-sm" v-if="row.id">{{ row.id }}</p>
        </template>
        <template #nit="{ row, index }">
          <GenericInputComponent
            v-if="action !== 'view'"
            required
            class_name="q-py-lg"
            :default_value="row.nit"
            :rules="[(val:string)=> is_required(val, 'Diligencie campo obligatorio'),
              (val:string) => min_length(val, 7), 
              (val:string) => max_length(val, 10)
            ]"
            @update:modelValue="updateRow(index, 'nit', $event)"
          />
          <div v-else>
            <p class="q-mb-sm">
              {{ row.nit }}
            </p>
          </div>
        </template>
        <template #description="{ row, index }">
          <GenericInputComponent
            v-if="action !== 'view'"
            required
            class_name="q-py-lg"
            :default_value="row.description"
            :rules="[(val:string)=> is_required(val, 'Diligencie campo obligatorio'),
              (val:string) => min_length(val, 10), 
              (val:string) => max_length(val, 300)
            ]"
            @update:modelValue="updateRow(index, 'description', $event)"
          />
          <div v-else>
            <p class="q-mb-sm">
              {{ row.description }}
            </p>
          </div>
        </template>
        <template #guarantee_percentage="{ row, index }">
          <GenericInputComponent
            v-if="action !== 'view'"
            required
            class_name="q-py-lg"
            :default_value="row.guarantee_percentage"
            :rules="[(val:string)=> is_required(val, 'Diligencie campo obligatorio'),
              (val:string) => max_integer_decimal(val, 3, 2)
            ]"
            @update:modelValue="
              updateRow(index, 'guarantee_percentage', $event)
            "
          />
          <div v-else>
            <p class="q-mb-sm">
              {{ row.guarantee_percentage }}
            </p>
          </div>
        </template>
        <template #distribution_type="{ row, index }">
          <GenericSelectorComponent
            v-if="action !== 'view'"
            required
            class_name="q-py-lg"
            map_options
            auto_complete
            first_filter_option="label"
            :rules="[(val:string)=> is_required(val, 'Diligencie campo obligatorio')]"
            :default_value="row.distribution_type"
            :manual_option="fixed_asset_distribution_type"
            @update:modelValue="updateRow(index, 'distribution_type', $event)"
          />
          <div v-else>
            <p class="q-mb-sm">
              {{ getOptionLabel([], row.distribution_type) }}
            </p>
          </div>
        </template>
        <template #actions="{ index }">
          <Button
            color="orange"
            class-custom="custom"
            tooltip="Eliminar"
            flat
            :outline="false"
            :left-icon="defaultIconsLucide.trash"
            colorIcon="#f45100"
            @click="removeRow(index)"
          />
        </template>
      </TableList>
    </section>
  </q-form>
</template>
<script setup lang="ts">
// components
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'

// interfaces
import { ActionType } from '@/interfaces/global/Action'
import { IAssetContributor } from '@/interfaces/customs/fixed-assets/v1/Register'

// logic
import useAssetContributors from '@/components/Forms/FixedAssets/Register/InformationForm/AssetContributors/AssetContributors'

const props = defineProps<{
  modelValue: IAssetContributor[]
  action: ActionType
}>()

const emit = defineEmits<{
  'update:modelValue': [value: IAssetContributor[]]
}>()

const {
  assetsContributorsRef,
  defaultIconsLucide,

  fixed_asset_distribution_type,
  tableProps,
  visibleColumns,

  validateAndAddRow,
  updateRow,
  removeRow,
  validateForm,

  getOptionLabel,

  is_required,
  min_length,
  max_length,
  max_integer_decimal,
} = useAssetContributors(props, emit)

defineExpose({
  validateForm,
})
</script>
