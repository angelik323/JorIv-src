<template>
  <q-form ref="visitDetailListFormRef">
    <section>
      <div class="flex items-center justify-between q-mb-none q-mb-none">
        <p class="text-black-10 text-weight-bold text-h6 q-mb-none">Detalle</p>
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
      <span class="text-red text-caption" v-show="showVisitDetailError">
        Debes agregar al menos una visita
      </span>

      <TableList
        hide-pagination
        dense
        class="editable-table"
        :columns="tableProps.columns"
        :visible-columns="visibleColumns"
        :loading="tableProps.loading"
        :rows="tableProps.rows"
        :custom-columns="[
          'id',
          'visit_date',
          'responsible',
          'visit_reason',
          'visitor',
          'physical_condition',
          'asset_rating',
          'recommendations',
          'actions',
        ]"
      >
        <template #id="{ row }">
          <p class="q-mb-sm" v-if="row.id">{{ row.id }}</p>
        </template>
        <template #visit_date="{ row, index }">
          <GenericDateInputComponent
            v-if="action !== 'view'"
            required
            class_name="q-py-lg"
            :disabled="row.id != undefined"
            :rules="[
              (val: string) => is_required(val, 'Diligencie campo obligatorio'),
              (val: string) => date_before_or_equal_to_the_current_date(val)
            ]"
            :default_value="row.visit_date"
            @update:modelValue="updateRow(index, 'visit_date', $event)"
          />
          <div v-else>
            <p class="q-mb-sm">
              {{ row.visit_date ?? 'Sin fecha' }}
            </p>
          </div>
        </template>

        <template #responsible="{ row, index }">
          <GenericSelectorComponent
            v-if="action !== 'view'"
            required
            class_name="q-py-lg"
            map_options
            auto_complete
            first_filter_option="label"
            :disabled="row.id != undefined"
            :rules="[(val: string) => is_required(val, 'Diligencie campo obligatorio')]"
            :default_value="row.responsible_id"
            :manual_option="third_parties"
            @update:modelValue="updateRow(index, 'responsible_id', $event)"
          />
          <div v-else>
            <p class="generic-selector q-mb-sm">
              {{ getOptionLabel(third_parties, row.responsible_id) }}
            </p>
          </div>
        </template>

        <template #visit_reason="{ row, index }">
          <GenericSelectorComponent
            v-if="action !== 'view'"
            required
            class_name="q-py-lg"
            map_options
            auto_complete
            first_filter_option="label"
            :disabled="disableAllForm"
            :rules="[(val: string) => is_required(val, 'Diligencie campo obligatorio')]"
            :default_value="row.visit_reason"
            :manual_option="visit_reason"
            @update:modelValue="updateRow(index, 'visit_reason', $event)"
          />
          <div v-else>
            <p class="q-mb-sm">
              {{ getOptionLabel(visit_reason, row.visit_reason) }}
            </p>
          </div>
        </template>

        <template #visitor="{ row, index }">
          <GenericSelectorComponent
            v-if="action !== 'view'"
            required
            class_name="q-py-lg"
            map_options
            auto_complete
            first_filter_option="label"
            :disabled="disableAllForm"
            :rules="[(val: string) => is_required(val, 'Diligencie campo obligatorio')]"
            :default_value="row.visitor_id"
            :manual_option="third_parties"
            @update:modelValue="updateRow(index, 'visitor_id', $event)"
          />
          <div v-else>
            <p class="generic-selector q-mb-sm">
              {{ getOptionLabel(third_parties, row.visitor_id) }}
            </p>
          </div>
        </template>

        <template #physical_condition="{ row, index }">
          <GenericSelectorComponent
            v-if="action !== 'view'"
            required
            class_name="q-py-lg"
            map_options
            auto_complete
            first_filter_option="label"
            :disabled="disableAllForm"
            :rules="[(val: string) => is_required(val, 'Diligencie campo obligatorio')]"
            :default_value="row.physical_condition"
            :manual_option="physical_condition"
            @update:modelValue="updateRow(index, 'physical_condition', $event)"
          />
          <div v-else>
            <p class="q-mb-sm">
              {{ getOptionLabel(physical_condition, row.physical_condition) }}
            </p>
          </div>
        </template>

        <template #asset_rating="{ row, index }">
          <GenericSelectorComponent
            v-if="action !== 'view'"
            required
            class_name="q-py-lg"
            map_options
            auto_complete
            first_filter_option="label"
            :disabled="disableAllForm"
            :rules="[(val: string) => is_required(val, 'Diligencie campo obligatorio')]"
            :default_value="row.asset_rating"
            :manual_option="asset_rating"
            @update:modelValue="updateRow(index, 'asset_rating', $event)"
          />
          <div v-else>
            <p class="q-mb-sm q-py-sm">
              {{ getOptionLabel(asset_rating, row.asset_rating) }}
            </p>
          </div>
        </template>

        <template #recommendations="{ row, index }">
          <GenericInputComponent
            v-if="action !== 'view'"
            required
            class_name="q-py-lg"
            :disabled="disableAllForm"
            :rules="[
              (val: string) => is_required(val, 'Diligencie campo obligatorio'),
              (val: string) => min_length(val, 10),
              (val: string) => max_length(val, 300)
            ]"
            :default_value="row.recommendations"
            @update:modelValue="updateRow(index, 'recommendations', $event)"
          />
          <div v-else>
            <p class="q-mb-sm">
              {{ row.recommendations }}
            </p>
          </div>
        </template>

        <template #actions="{ row, index }">
          <Button
            v-show="
              tableProps.rows.length > 1 &&
              index !== 0 &&
              !disableAllForm &&
              !row.id
            "
            color="orange"
            class-custom="custom"
            flat
            colorIcon="#f45100"
            tooltip="Eliminar"
            :outline="false"
            :left-icon="defaultIconsLucide.trash"
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
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'

// interfaces
import { IVisitRecordDetail } from '@/interfaces/customs/fixed-assets/v1/VisitRecords'
import { IFixedAssetResource } from '@/interfaces/customs/resources/FixedAssets'
import { IThirdPartyResourceGeneric } from '@/interfaces/customs/resources/ThirdParty'
import { ActionType } from '@/interfaces/global/Action'

// logic
import useVisitDetailList from '@/components/Forms/FixedAssets/VisitRecords/VisitDetailList/VisitDetailList'

const props = defineProps<{
  modelValue: IVisitRecordDetail[]
  showVisitDetailError: boolean
  disableAllForm: boolean
  third_parties: IThirdPartyResourceGeneric[]
  visit_reason: IFixedAssetResource[]
  physical_condition: IFixedAssetResource[]
  asset_rating: IFixedAssetResource[]
  action: ActionType
}>()

const emit = defineEmits<{
  'update:modelValue': [value: IVisitRecordDetail[]]
}>()

const {
  visitDetailListFormRef,

  tableProps,
  visibleColumns,
  defaultIconsLucide,

  updateRow,
  removeRow,
  validateAndAddRow,
  getOptionLabel,

  is_required,
  min_length,
  max_length,
  date_before_or_equal_to_the_current_date,
} = useVisitDetailList(props, emit)
</script>
