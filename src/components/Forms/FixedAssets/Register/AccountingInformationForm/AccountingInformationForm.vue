<template>
  <section>
    <section>
      <p class="text-black-90 text-weight-bold text-h6 q-mb-md">
        Información contable
      </p>
      <div class="row q-col-gutter-md q-mb-lg">
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3">
          <div>
            <p class="q-mb-sm text-weight-bold">Costo histórico</p>
            <p>
              {{
                numberToMoneyFormat(
                  Number(data.accounting.transaction_value)
                ) ?? 'Sin información'
              }}
            </p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3">
          <div>
            <p class="q-mb-sm text-weight-bold">Código de placa</p>
            <p>
              {{ data.accounting.license_plate ?? 'Sin información' }}
            </p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3">
          <div>
            <p class="q-mb-sm text-weight-bold">Valor en libros</p>
            <p>
              {{ data.accounting.books_value ?? 'Sin información' }}
            </p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3">
          <div>
            <p class="q-mb-sm text-weight-bold">Alicuota</p>
            <p>
              {{ data.accounting.depreciation_rate ?? 'Sin información' }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section>
      <p class="text-black-10 text-weight-bold text-h6 q-mb-md">Depreciación</p>
      <div class="row q-col-gutter-md q-mb-lg">
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3">
          <div>
            <p class="q-mb-sm text-weight-bold">Vida útil del activo</p>
            <p>
              {{ data.depreciation?.useful_life_in_years ?? 'Sin información' }}
            </p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3">
          <div>
            <p class="q-mb-sm text-weight-bold">Depreciación anual</p>
            <p>
              {{ data.depreciation?.annual_depreciation ?? 'Sin información' }}
            </p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3">
          <div>
            <p class="q-mb-sm text-weight-bold">Vida útil depreciada</p>
            <p>
              {{
                data.depreciation?.useful_life_depreciation ?? 'Sin información'
              }}
            </p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3">
          <div>
            <p class="q-mb-sm text-weight-bold">Depreciación acumulada</p>
            <p>
              {{
                data.depreciation?.accumulated_depreciation ?? 'Sin información'
              }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section>
      <p class="text-black-90 text-weight-bold text-h6 q-mb-md">Deterioro</p>
      <div class="row q-col-gutter-md q-mb-lg">
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3">
          <div>
            <p class="q-mb-sm text-weight-bold">Valor del deterioro</p>
            <p>
              {{ data.impairment?.impairment_value ?? 'Sin información' }}
            </p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3">
          <div>
            <p class="q-mb-sm text-weight-bold">Valor residual</p>
            <p>
              {{ data.impairment?.impairment_value ?? 'Sin información' }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>
<script setup lang="ts">
// interfaces
import { IAccountingInformation } from '@/interfaces/customs/fixed-assets/v1/Register'

// utils
import { numberToMoneyFormat } from '@/utils'

withDefaults(
  defineProps<{
    data: IAccountingInformation
  }>(),
  {}
)
</script>
