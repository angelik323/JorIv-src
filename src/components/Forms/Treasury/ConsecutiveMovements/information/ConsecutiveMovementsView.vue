<template>
  <div>
    <q-form ref="formConsecutiveMovements" class="q-pa-lg">
      <section>
        <h6 class="text-weight-bold q-mb-sm">Información general</h6>
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
          <div class="col-12 col-md-4">
            <p class="text-weight-bold">Estado</p>
            <p class="mb-0">{{ models.status }}</p>
          </div>
          <div class="col-12 col-md-4">
            <p class="text-weight-bold">Negocio</p>
            <p class="mb-0">{{ models.business_id }}</p>
          </div>
          <div class="col-12 col-md-4">
            <p class="text-weight-bold">Nombre negocio</p>
            <p class="mb-0">{{ models.business_name }}</p>
          </div>
          <div class="col-12 col-md-4">
            <p class="text-weight-bold">Tipo de comprobante</p>
            <p class="mb-0">{{ models.voucher_type }}</p>
          </div>
          <div class="col-12 col-md-4">
            <p class="text-weight-bold">Número</p>
            <p class="mb-0">{{ models.voucher_number }}</p>
          </div>
          <div class="col-12 col-md-4">
            <p class="text-weight-bold">Valor</p>
            <p class="mb-0">{{ models.amount }}</p>
          </div>
          <div class="col-12 col-md-4">
            <p class="text-weight-bold">Moneda</p>
            <p class="mb-0">{{ models.currency }}</p>
          </div>
          <div class="col-12 col-md-4">
            <p class="text-weight-bold">Fecha comprobante</p>
            <p class="mb-0">{{ models.movement_date }}</p>
          </div>
          <div class="col-12 col-md-4">
            <p class="text-weight-bold">Fecha creación</p>
            <p class="mb-0">{{ models.created_at }}</p>
          </div>
          <div class="col-12 col-md-4">
            <p class="text-weight-bold">Creado por</p>
            <p class="mb-0">{{ models.created_by }}</p>
          </div>
        </div>
      </section>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import useConsecutiveMovementsShowForm from '@/components/Forms/Treasury/ConsecutiveMovements/information/ConsecutiveMovementsView'
import { IConsecutiveDetailResponse } from '@/interfaces/customs/treasury/ConsecutiveVoucher'
import { toRef } from 'vue'

const props = defineProps<{
  data: IConsecutiveDetailResponse | null
}>()

const { models } = useConsecutiveMovementsShowForm(toRef(props, 'data'))
</script>
