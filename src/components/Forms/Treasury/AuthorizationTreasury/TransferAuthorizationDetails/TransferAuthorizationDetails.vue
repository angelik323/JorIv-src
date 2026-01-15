<template>
  <div class="row q-col-gutter-md">
    <div class="col-12 col-md-6">
      <div class="q-pa-md">
        <p class="text-h6 text-weight-bold">Origen</p>
        <div class="row q-col-gutter-sm">
          <div
            v-for="(field, index) in originFields"
            :key="index"
            class="col-12 col-sm-6"
          >
            <p class="text-bold text-black-90 mb-0">
              {{ field.label }}
            </p>
            <p class="text-grey-90">{{ field.value ?? 'Sin información' }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="col-12 col-md-6">
      <div class="q-pa-md">
        <p class="text-h6 text-weight-bold">Destino</p>
        <div class="row q-col-gutter-sm">
          <div
            v-for="(field, index) in destinationFields"
            :key="index"
            class="col-12 col-sm-6"
          >
            <p class="text-bold text-black-90 mb-0">
              {{ field.label }}
            </p>
            <p class="text-grey-90">{{ field.value ?? 'Sin información' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useTransferAuthorizationDetails from './TransferAuthorizationDetails'

import { IAuthorizationTreasuryDetail } from '@/interfaces/customs/treasury/AuthorizationTreasury'

const props = defineProps<{
  response: IAuthorizationTreasuryDetail
}>()

const { originFields, destinationFields } =
  useTransferAuthorizationDetails(props)
</script>
