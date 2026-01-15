<template>
  <div>
    <section>
      <div class="row q-px-lg">
        <div class="col-md-4 col-12 q-pb-md">
          <p class="text-bold mb-0 text-black-90">Fecha de registro</p>
          <div>
            {{ selected_deferred_voucher.registration_date }}
          </div>
        </div>
        <div class="col-md-4 col-12 q-pb-md">
          <p class="text-bold mb-0 text-black-90">Tipo de comprobante</p>
          <div>
            {{
              `${selected_deferred_voucher.receipt_type?.code} - ${selected_deferred_voucher.receipt_type?.name}`
            }}
          </div>
        </div>
        <div class="col-md-4 col-12 q-pb-md">
          <p class="text-bold mb-0 text-black-90">Sub tipo de comprobante</p>
          <div>
            {{
              `${selected_deferred_voucher.sub_receipt_type?.code} - ${selected_deferred_voucher.sub_receipt_type?.name}`
            }}
          </div>
        </div>
        <div class="col-md-4 col-12 q-pb-md">
          <p class="text-bold mb-0 text-black-90">Negocio</p>
          <div>
            {{ selected_deferred_voucher.business_trust }}
          </div>
        </div>
        <div class="col-md-4 col-12 q-pb-md">
          <p class="text-bold mb-0 text-black-90">Detalle</p>
          <div>
            {{ selected_deferred_voucher.detail }}
          </div>
        </div>
      </div>
    </section>
    <q-separator class="q-mx-lg" />
    <TableList
      :title="undefined"
      :loading="false"
      :columns="tableProps.columns"
      :rows="tableProps.rows"
      :custom-columns="['actions']"
      :hide-pagination="true"
      class="q-mx-lg"
    >
      <template #custom-bottom-row>
        <q-tr>
          <q-td colspan="4" align="right">
            <strong class="text-primary_fiduciaria">Totales</strong>
          </q-td>
          <q-td colspan="1">
            <span>${{ selected_deferred_voucher.total_debit }}</span>
          </q-td>
          <q-td colspan="2">
            <span>- ${{ selected_deferred_voucher.total_credit }}</span>
          </q-td>
        </q-tr>
      </template>
    </TableList>
  </div>
</template>
<script setup lang="ts">
// Components:
import TableList from '@/components/table-list/TableList.vue'

// Logic view
import useVoucherDetail from '@/components/Detail/Accounting/ProcessDeferred/VoucherDetail'

const {
  // Props
  tableProps,
  selected_deferred_voucher,
} = useVoucherDetail()
</script>
