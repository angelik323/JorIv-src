<template>
  <section>
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3">
        <div>
          <p class="q-mb-sm text-weight-bold">Tipo de registro</p>
          <p>
            {{ data.record_type ?? 'Sin información' }}
          </p>
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3">
        <div>
          <p class="q-mb-sm text-weight-bold">Tercero</p>
          <p>
            {{ data.third_party_name ?? 'Sin información' }}
          </p>
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3">
        <div>
          <p class="q-mb-sm text-weight-bold">Valor de compra</p>
          <p>
            {{
              numberToMoneyFormat(Number(data.transaction_value)) ??
              'Sin información'
            }}
          </p>
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3">
        <div>
          <p class="q-mb-sm text-weight-bold">Código de compra/venta</p>
          <p>
            {{ data.purchase_order_number ?? 'Sin información' }}
          </p>
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3">
        <div>
          <p class="q-mb-sm text-weight-bold">Tipo de activo fijo o bien</p>
          <p>
            {{ data.asset_type ?? 'Sin información' }}
          </p>
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3">
        <div>
          <p class="q-mb-sm text-weight-bold">Subtipo de activo fijo o bien</p>
          <p>
            {{ data.asset_subtype ?? 'Sin información' }}
          </p>
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3">
        <div>
          <p class="q-mb-sm text-weight-bold">Fecha de compra/venta</p>
          <p>
            {{
              formatDate(data.transaction_date as string, 'DD/MM/YYYY') ??
              'Sin información'
            }}
          </p>
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3">
        <div>
          <p class="q-mb-sm text-weight-bold">Código placa</p>
          <p>
            {{ data.license_plate ?? 'Sin información' }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
// interfaces
import { IEntryInfomation } from '@/interfaces/customs/fixed-assets/v1/Register'

// utils
import { numberToMoneyFormat } from '@/utils'
import { useUtils } from '@/composables/useUtils'

const { formatDate } = useUtils()

withDefaults(
  defineProps<{
    data: IEntryInfomation
  }>(),
  {}
)
</script>
