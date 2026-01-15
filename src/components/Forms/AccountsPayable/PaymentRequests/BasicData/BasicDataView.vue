<template>
  <section class="q-pa-lg q-col-gutter-sm">
    <div class="row">
      <div class="col-12 col-md-6">
        <div class="text-black-90">
          <p class="text-weight-bold no-margin ellipsis">Oficina</p>
          <p class="text-weight-medium no-margin">
            {{ data?.office_label ?? 'No registrado' }}
          </p>
        </div>
      </div>

      <div class="col-12 col-md-6">
        <div class="text-black-90">
          <p class="text-weight-bold no-margin ellipsis">Consulta de proceso</p>
          <p class="text-weight-medium no-margin">
            {{ data?.process_source_label ?? 'No registrado' }}
          </p>
        </div>
      </div>
    </div>
  </section>

  <q-separator class="mx-3" />

  <section class="q-pa-lg" v-if="data?.process_source == 'solicitud_pago'">
    <p class="text-h6">Pago a realizar</p>

    <div class="row q-col-gutter-sm mb-3">
      <div class="col-12 col-md-3">
        <p class="text-weight-bold no-margin ellipsis">Radicado</p>
        <p class="text-weight-medium no-margin">
          {{ data?.radicated_code ?? 'No registrado' }}
        </p>
      </div>

      <div class="col-12 col-md-3">
        <p class="text-weight-bold no-margin ellipsis">Fecha de recepción</p>
        <p class="text-weight-medium no-margin">
          {{ data?.reception_date ?? 'No registrado' }}
        </p>
      </div>

      <div class="col-12 col-md-3">
        <p class="text-weight-bold no-margin ellipsis">Prefijo</p>
        <p class="text-weight-medium no-margin">
          {{ data?.prefix ?? 'No registrado' }}
        </p>
      </div>

      <div class="col-12 col-md-3">
        <p class="text-weight-bold no-margin ellipsis">Proveedor / Emisor</p>
        <p class="text-weight-medium no-margin">
          {{ data?.supplier_label ?? 'No registrado' }}
        </p>
      </div>
    </div>

    <div class="row q-col-gutter-sm mb-3">
      <div class="col-12 col-md-3">
        <p class="text-weight-bold no-margin ellipsis">Factura número</p>
        <p class="text-weight-medium no-margin">
          {{ data?.invoice_number ?? 'No registrado' }}
        </p>
      </div>

      <div class="col-12 col-md-3">
        <p class="text-weight-bold no-margin ellipsis">Fecha de emisión</p>
        <p class="text-weight-medium no-margin">
          {{ data?.invoice_issue_date ?? 'No registrado' }}
        </p>
      </div>

      <div class="col-12 col-md-3">
        <p class="text-weight-bold no-margin ellipsis">Fecha de vencimiento</p>
        <p class="text-weight-medium no-margin">
          {{ data?.invoice_due_date ?? 'No registrado' }}
        </p>
      </div>

      <div class="col-12 col-md-3">
        <p class="text-weight-bold no-margin ellipsis">Valor total</p>
        <p class="text-weight-medium no-margin">
          {{
            useUtils().formatCurrency(String(data?.total_value)) ??
            'No registrado'
          }}
        </p>
      </div>
    </div>

    <div class="row q-col-gutter-sm">
      <div class="col-12 col-md-3">
        <p class="text-weight-bold no-margin ellipsis">Valor IVA</p>
        <p class="text-weight-medium no-margin">
          {{
            useUtils().formatCurrency(String(data?.iva_value)) ??
            'No registrado'
          }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useUtils } from '@/composables'

defineProps({
  data: Object,
})
</script>
