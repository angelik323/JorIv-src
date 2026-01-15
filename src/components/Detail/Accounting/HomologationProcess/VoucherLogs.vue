<template>
  <div>
    <section>
      <div class="row">
        <div class="col-md-4 col-12 q-pb-md">
          <p class="text-bold mb-0 text-black-90">Proceso</p>
          <div>{{ homologation_process_history.process?.process_name }}</div>
        </div>
        <div class="col-md-4 col-12 q-pb-md">
          <p class="text-bold mb-0 text-black-90">Fecha del proceso</p>
          <div>
            {{
              useUtils().formatDate(
                homologation_process_history.process?.created_at,
                'YYYY-MM-DD'
              )
            }}
          </div>
        </div>
        <div class="col-md-4 col-12 q-pb-md">
          <p class="text-bold mb-0 text-black-90">Periodo</p>
          <div>{{ homologation_process_history.process?.period }}</div>
        </div>
        <div class="col-md-4 col-12 q-pb-md">
          <p class="text-bold mb-0 text-black-90">Estructura origen</p>
          <div>
            {{
              `${homologation_process_history.process?.source_structure?.code} - ${homologation_process_history.process?.source_structure?.purpose}`
            }}
          </div>
        </div>
        <div class="col-md-4 col-12 q-pb-md">
          <p class="text-bold mb-0 text-black-90">Estructura destino</p>
          <div>
            {{
              `${homologation_process_history.process?.destination_structure?.code} - ${homologation_process_history.process?.destination_structure?.purpose}`
            }}
          </div>
        </div>
      </div>
    </section>
    <q-separator spaced />
    <section>
      <p class="text-bold text-black-90 text-h6 q-my-lg">
        Datos del comprobante
      </p>
      <VCard class="q-px-lg q-pb-lg" style="margin-bottom: 0">
        <template #content-card>
          <TableList
            :loading="tableProps.loading"
            :columns="tableProps.columns"
            hide-bottom
            dense
            :rows="tableProps.rows"
          />
        </template>
      </VCard>
    </section>
  </div>
</template>
<script setup lang="ts">
import VCard from '@/components/common/VCard/VCard.vue'
import TableList from '@/components/table-list/TableList.vue'

import { useUtils } from '@/composables'

import useVoucherLogs from '@/components/Detail/Accounting/HomologationProcess/VoucherLogs'

const { tableProps, homologation_process_history } = useVoucherLogs()
</script>
