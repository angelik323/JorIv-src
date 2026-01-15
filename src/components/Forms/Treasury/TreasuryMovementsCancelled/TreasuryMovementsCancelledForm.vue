<template>
  <div>
    <q-form ref="formTreasuryMovementsCancelled" class="q-pa-lg">
      <section>
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
          <div class="col-12 col-md-3">
            <p class="text-weight-bold mb-0">Negocio</p>
            <p class="mb-0">{{ models.business_code }}</p>
          </div>
          <div class="col-12 col-md-3">
            <p class="text-weight-bold mb-0">Nombre de negocio</p>
            <p class="mb-0">{{ models.business_name }}</p>
          </div>
          <div class="col-12 col-md-3">
            <p class="text-weight-bold mb-0">Código de estructura</p>
            <p class="mb-0">{{ models.structure_code }}</p>
          </div>
          <div class="col-12 col-md-3">
            <p class="text-weight-bold mb-0">Estructura</p>
            <p class="mb-0">{{ models.structure }}</p>
          </div>
        </div>

        <q-separator class="q-my-md" />

        <h6 class="text-weight-bold q-mb-sm">
          Comprobante de tesorería original
        </h6>
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
          <div class="col-12 col-md-3">
            <p class="text-weight-bold mb-0">Periodo original</p>
            <p class="mb-0">{{ models.original_period }}</p>
          </div>
          <div class="col-12 col-md-3">
            <p class="text-weight-bold mb-0">Comprobante original</p>
            <p class="mb-0">{{ models.original_voucher_id }}</p>
          </div>
          <div class="col-12 col-md-3">
            <p class="text-weight-bold mb-0">
              Descripción comprobante original
            </p>
            <p class="mb-0">{{ models.original_voucher_description }}</p>
          </div>
          <div class="col-12 col-md-3">
            <p class="text-weight-bold mb-0">Subcomprobante original</p>
            <p class="mb-0">{{ models.original_subvoucher_id }}</p>
          </div>
          <div class="col-12 col-md-3">
            <p class="text-weight-bold mb-0">
              Descripción subcomprobante original
            </p>
            <p class="mb-0">{{ models.original_subvoucher_description }}</p>
          </div>
          <div class="col-12 col-md-3">
            <p class="text-weight-bold mb-0">Consecutivo</p>
            <p class="mb-0">{{ models.original_consecutive }}</p>
          </div>
          <div class="col-12 col-md-3">
            <p class="text-weight-bold mb-0">Registro</p>
            <p class="mb-0">{{ models.original_register }}</p>
          </div>
          <div class="col-12 col-md-3">
            <p class="text-weight-bold mb-0">Fecha</p>
            <p class="mb-0">{{ models.original_date }}</p>
          </div>
          <div class="col-12 col-md-3">
            <p class="text-weight-bold mb-0">Valor</p>
            <p class="mb-0">{{ models.original_value }}</p>
          </div>
          <div class="col-12 col-md-3">
            <p class="text-weight-bold mb-0">Estado</p>
            <p class="mb-0">{{ models.original_status }}</p>
          </div>
          <div class="row q-col-gutter-x-lg q-col-gutter-y-sm justify-end">
            <div class="col-auto flex items-center">
              <Button
                :outline="false"
                label="Comprobante"
                left-icon="PlusCircle"
                color-icon="white"
                :styleContent="{
                  'place-items': 'center',
                  'border-radius': '20px',
                  'font-size': '13px',
                }"
                @click="originalTreasuryVaucher()"
              />
            </div>
          </div>
        </div>

        <q-separator class="q-my-md" />

        <h6 class="text-weight-bold q-mb-sm">
          Comprobante de tesorería de anulación
        </h6>
        <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
          <div class="col-12 col-md-3">
            <p class="text-weight-bold mb-0">Periodo de anulación</p>
            <p class="mb-0">{{ models.annulled_period }}</p>
          </div>
          <div class="col-12 col-md-3">
            <p class="text-weight-bold mb-0">Comprobante de anulación</p>
            <p class="mb-0">{{ models.annulled_voucher_id }}</p>
          </div>
          <div class="col-12 col-md-3">
            <p class="text-weight-bold mb-0">
              Descripción comprobante de anulación
            </p>
            <p class="mb-0">{{ models.annulled_voucher_description }}</p>
          </div>
          <div class="col-12 col-md-3">
            <p class="text-weight-bold mb-0">Subcomprobante de anulación</p>
            <p class="mb-0">{{ models.annulled_subvoucher_id }}</p>
          </div>
          <div class="col-12 col-md-3">
            <p class="text-weight-bold mb-0">
              Descripción subcomprobante de anulación
            </p>
            <p class="mb-0">{{ models.annulled_subvoucher_description }}</p>
          </div>
          <div class="col-12 col-md-3">
            <p class="text-weight-bold mb-0">Consecutivo de anulación</p>
            <p class="mb-0">{{ models.annulled_consecutive }}</p>
          </div>
          <div class="col-12 col-md-3">
            <p class="text-weight-bold mb-0">Registro de anulación</p>
            <p class="mb-0">{{ models.annulled_register }}</p>
          </div>
          <div class="col-12 col-md-3">
            <p class="text-weight-bold mb-0">Fecha</p>
            <p class="mb-0">{{ models.annulled_date }}</p>
          </div>
          <div class="col-12 col-md-3">
            <p class="text-weight-bold mb-0">Valor</p>
            <p class="mb-0">{{ models.annulled_value }}</p>
          </div>
          <div class="col-12 col-md-3">
            <p class="text-weight-bold mb-0">Estado</p>
            <p class="mb-0">{{ models.annulled_status }}</p>
          </div>
          <div class="col-12 col-md-6">
            <p class="text-weight-bold mb-0">Motivo de anulación</p>
            <p class="mb-0">{{ models.annulment_reason }}</p>
          </div>
          <div class="row q-col-gutter-x-lg q-col-gutter-y-sm justify-end">
            <div class="col-auto flex items-center">
              <Button
                :outline="false"
                label="Comprobante"
                left-icon="PlusCircle"
                color-icon="white"
                :styleContent="{
                  'place-items': 'center',
                  'border-radius': '20px',
                  'font-size': '13px',
                }"
                @click="cancelledTreasuryVaucher()"
              />
            </div>
          </div>
        </div>
      </section>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/common/Button/Button.vue'
import useTreasuryMovementsCancelled from './TreasuryMovementsCancelledForm'
import { ICancelledMovementShow } from '@/interfaces/customs'
import { toRef } from 'vue'

const props = defineProps<{
  data: ICancelledMovementShow | null
}>()

const { models, cancelledTreasuryVaucher, originalTreasuryVaucher } =
  useTreasuryMovementsCancelled(toRef(props, 'data'))
</script>
