<template>
  <q-form ref="mainInformationFormRef" class="q-pa-md">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm mb-3">
        <div class="col-12 col-md-4">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Tipo de documento</p>
            <p class="text-weight-medium no-margin">
              {{ data?.detail?.document_type.code }} -
              {{ data?.detail?.document_type?.name }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Negocio</p>
            <p class="text-weight-medium no-margin">
              {{ data?.detail?.business_label }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Estructura de pago
            </p>
            <p class="text-weight-medium no-margin">
              {{ data?.detail?.payment_structure_label }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <q-separator class="mb-2" />

    <section>
      <p class="text-h6">Datos principales</p>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm mb-3">
        <div v-if="data?.detail?.internal_code" class="col-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Consecutivo interno
            </p>
            <p class="text-weight-medium no-margin">
              {{ data?.detail?.internal_code }}
            </p>
          </div>
        </div>

        <div v-if="data?.detail?.client_code" class="col-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Consecutivo cliente
            </p>
            <p class="text-weight-medium no-margin">
              {{ data?.detail?.client_code }}
            </p>
          </div>
        </div>

        <div v-if="data?.detail?.order_number" class="col-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Orden de pedido</p>
            <p class="text-weight-medium no-margin">
              {{ data?.detail?.order_number }}
            </p>
          </div>
        </div>

        <div v-if="data?.detail?.other_reference" class="col-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Otra referencia</p>
            <p class="text-weight-medium no-margin">
              {{ data?.detail?.other_reference }}
            </p>
          </div>
        </div>

        <div v-if="data?.detail?.legalization_date" class="col-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Fecha legalización
            </p>
            <p class="text-weight-medium no-margin">
              {{ data?.detail?.legalization_date }}
            </p>
          </div>
        </div>

        <div v-if="data?.detail?.due_date" class="col-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Fecha de vencimiento
            </p>
            <p class="text-weight-medium no-margin">
              {{ data?.detail?.due_date }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Código de movimiento
            </p>
            <p class="text-weight-medium no-margin">
              {{ data?.detail?.movement_code?.code }} -
              {{ data?.detail?.movement_code?.name }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Fecha de movimiento
            </p>
            <p class="text-weight-medium no-margin">
              {{ data?.detail?.movement_date }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">ciudad</p>
            <p class="text-weight-medium no-margin">
              {{ data?.detail?.city_label }}
            </p>
          </div>
        </div>

        <div v-if="data?.detail?.contract_id" class="col-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Documento contractual
            </p>
            <p class="text-weight-medium no-margin">
              {{ data?.detail?.contract_label }}
            </p>
          </div>
        </div>

        <div v-if="data?.detail?.milestone_id" class="col-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Hito</p>
            <p class="text-weight-medium no-margin">
              {{ data?.detail?.milestone_label }}
            </p>
          </div>
        </div>

        <div v-if="data?.detail?.validity_year" class="col-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Vigencia</p>
            <p class="text-weight-medium no-margin">
              {{ data?.detail?.validity_year }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <q-separator class="mb-2" />

    <section v-if="data?.detail?.budget_document_number_id">
      <p class="text-h6">Presupuesto</p>

      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm mb-3">
        <div class="col-12 col-md-4">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Documento presupuestal
            </p>
            <p class="text-weight-medium no-margin">
              {{ data?.detail?.budget_document_type_label }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Número de documento
            </p>
            <p class="text-weight-medium no-margin">
              {{ data?.detail?.budget_document_number_label }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Vigencia</p>
            <p class="text-weight-medium no-margin">
              {{ data?.detail?.budget_validity_year }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
        <div class="col-12">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Observación</p>
            <p class="text-weight-medium no-margin">
              {{ data?.detail?.observation }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <q-separator class="mt-1" />
  </q-form>
</template>

<script setup lang="ts">
defineProps({
  data: Object,
})
</script>
