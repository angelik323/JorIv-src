<template>
  <div class="q-pa-lg">
    <section>
      <div v-if="data_information_view?.compliance_type === 'delivery'">
        <div class="row q-px-lg">
          <div class="col-md-3 col-12 q-pb-md">
            <p class="text-bold mb-0 text-black-90">Número de derivada</p>
            <div>
              {{ data_information_view?.forward_operation_id }}
            </div>
          </div>

          <div class="col-md-3 col-12 q-pb-md">
            <p class="text-bold mb-0 text-black-90">Número de título</p>
            <div>
              {{ data_information_view?.title_id || '-' }}
            </div>
          </div>

          <div class="col-md-3 col-12 q-pb-md">
            <p class="text-bold mb-0 text-black-90">Código de portafolio</p>
            <div>
              {{ data_information_view?.code || '-' }}
            </div>
          </div>

          <div class="col-md-3 col-12 q-pb-md">
            <p class="text-bold mb-0 text-black-90">Descripción portafolio</p>
            <div>
              {{ data_information_view?.description || '-' }}
            </div>
          </div>

          <div class="col-md-3 col-12 q-pb-md">
            <p class="text-bold mb-0 text-black-90">Tipo de operación</p>
            <div>
              {{ data_information_view?.operation || '-' }}
            </div>
          </div>

          <div class="col-md-3 col-12 q-pb-md">
            <p class="text-bold mb-0 text-black-90">Contraparte</p>
            <div>
              {{ data_information_view?.counterparty || '-' }}
            </div>
          </div>

          <div class="col-md-3 col-12 q-pb-md">
            <p class="text-bold mb-0 text-black-90">Fecha de vencimiento</p>
            <div>
              {{
                data_information_view?.payment_date
                  ? new Date(data_information_view.payment_date)
                      .toISOString()
                      .split('T')[0]
                  : '-'
              }}
            </div>
          </div>

          <div class="col-md-3 col-12 q-pb-md">
            <p class="text-bold mb-0 text-black-90">Tasa pactada</p>
            <div>$ {{ data_information_view?.agree_rate || '-' }}</div>
          </div>

          <div class="col-md-3 col-12 q-pb-md">
            <p class="text-bold mb-0 text-black-90">Tasa spot</p>
            <div>$ {{ data_information_view?.spot_rate || '-' }}</div>
          </div>

          <div class="col-md-3 col-12 q-pb-md">
            <p class="text-bold mb-0 text-black-90">Valor constitución</p>
            <div>$ {{ data_information_view?.value_currency || '-' }}</div>
          </div>

          <div class="col-md-3 col-12 q-pb-md">
            <p class="text-bold mb-0 text-black-90">Estado</p>

            <div>
              <ShowStatus
                :type="Number(data_information_view?.status ?? 0)"
                status-type="investmentPortfolio"
              />
            </div>
          </div>

          <div class="col-md-3 col-12 q-pb-md">
            <p class="text-bold mb-0 text-black-90">Monto USD</p>
            <div>$ {{ data_information_view?.usd || '-' }}</div>
          </div>

          <div class="col-md-3 col-12 q-pb-md">
            <p class="text-bold mb-0 text-black-90">Monto COP</p>
            <div>$ {{ data_information_view?.cop || '-' }}</div>
          </div>

          <div class="col-md-3 col-12 q-pb-md">
            <p class="text-bold mb-0 text-black-90">Monto a liquidar</p>
            <div>$ {{ data_information_view?.liquidated || '-' }}</div>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="row q-px-lg">
          <div class="col-md-12 col-12 q-pb-md">
            <h6><b>Liquidación operaciones forward non delivery</b></h6>
          </div>

          <div class="col-md-4 col-12 q-pb-md">
            <p class="text-bold mb-0 text-black-90">Tasa spot al vencimiento</p>
            <div>$ {{ data_information_view?.spot_rate || '-' }}</div>
          </div>

          <div class="col-md-4 col-12 q-pb-md">
            <p class="text-bold mb-0 text-black-90">Fecha tasa spot</p>
            <div>
              {{
                data_information_view?.spot_date
                  ? new Date(data_information_view.spot_date)
                      .toISOString()
                      .split('T')[0]
                  : '-'
              }}
            </div>
          </div>

          <div class="col-md-4 col-12 q-pb-md">
            <p class="text-bold mb-0 text-black-90">Diferencial</p>
            <div>$ {{ data_information_view?.differential || '-' }}</div>
          </div>

          <div class="col-md-4 col-12 q-pb-md">
            <p class="text-bold mb-0 text-black-90">Código operación</p>
            <div>{{ data_information_view?.operation || '-' }}</div>
          </div>

          <div class="col-md-4 col-12 q-pb-md">
            <p class="text-bold mb-0 text-black-90">Fecha pago</p>
            <div>
              {{
                data_information_view?.payment_date
                  ? new Date(data_information_view.payment_date)
                      .toISOString()
                      .split('T')[0]
                  : '-'
              }}
            </div>
          </div>

          <div class="col-md-4 col-12 q-pb-md">
            <p class="text-bold mb-0 text-black-90">Monto a liquidar</p>
            <div>$ {{ data_information_view?.liquidated || '-' }}</div>
          </div>
        </div>
      </div>
      <q-separator class="q-ma-lg" />
    </section>
  </div>
</template>
<script setup>
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import { useDerivativeInvestmentOperationDetail } from './DerivativeInvestmentOperationDetail'

const { data_information_view } = useDerivativeInvestmentOperationDetail()
</script>
