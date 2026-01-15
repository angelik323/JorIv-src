<template>
  <div>
    <q-form class="q-pa-md">
      <div class="q-pa-lg">
        <TableList
          :title="tableProps.title"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :loading="tableProps.loading"
          :pages="tableProps.pages"
          custom-no-data-message-title="Actualmente no hay subtipo comprobantes"
          custom-no-data-message-subtitle="Por favor, agregue uno para continuar con el proceso"
          :custom-columns="[
            'index',
            'subtype_receipt_origin',
            'equivalent_voucher_subtype',
            'tax_receipt_subtype',
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
              @click="addRow"
            />
          </template>
          <template #subtype_receipt_origin="{ row }">
            <GenericSelectorComponent
              :manual_option="sub_receipt_types_voucher"
              :map_options="true"
              :default_value="row.subtype_receipt_origin"
              :auto_complete="true"
              :clearable="true"
              :required="true"
              placeholder="Seleccione"
              :rules="[
              (val:string) => useRules().is_required(val, 'Este campo es requerido'),
            ]"
              @update:model-value="(val) => (row.subtype_receipt_origin = val)"
            />
          </template>

          <template #equivalent_voucher_subtype="{ row }">
            <GenericSelectorComponent
              :manual_option="sub_receipt_types_voucher"
              :map_options="true"
              :default_value="row.equivalent_voucher_subtype"
              :auto_complete="true"
              :rules="[
              (val:string) => useRules().is_required(val, 'Este campo es requerido'),
            ]"
              :clearable="true"
              :required="true"
              placeholder="Seleccione"
              @update:model-value="
                (val) => (row.equivalent_voucher_subtype = val)
              "
            />
          </template>

          <template #tax_receipt_subtype="{ row }">
            <GenericSelectorComponent
              :manual_option="sub_receipt_types_voucher"
              :map_options="true"
              :default_value="row.tax_receipt_subtype"
              :auto_complete="true"
              :clearable="true"
              :rules="[
              (val:string) => useRules().is_required(val, 'Este campo es requerido'),
            ]"
              :required="true"
              placeholder="Seleccione"
              @update:model-value="(val) => (row.tax_receipt_subtype = val)"
            />
          </template>

          <template #actions="{ index }">
            <Button
              :left-icon="defaultIconsLucide.trash"
              colorIcon="#f45100"
              flat
              outline
              tooltip="Eliminar"
              @click="removeRow(index)"
            />
          </template>
          <template #index="{ index }">
            <div class="text-center">
              {{
                tableData.length -
                ((tableProps.pages.currentPage - 1) * perPage + index)
              }}
            </div>
          </template>
        </TableList>
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import { defaultIconsLucide } from '@/utils'
import { useRules } from '@/composables'
import { useEquivalentVoucherForm } from './EquivalentVaucherForm'

const {
  tableProps,
  sub_receipt_types_voucher,
  perPage,
  tableData,
  removeRow,
  addRow,
  validate,
  getSelectedSubtypeRows,
  updatePage,
  updatePerPage,
} = useEquivalentVoucherForm()

defineExpose({
  validate,
  getSelectedSubtypeRows,
})
</script>
