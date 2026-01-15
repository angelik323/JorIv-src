<template>
  <div>
    <VCard class="q-pa-lg">
      <template #content-card>
        <section>
          <div class="row">
            <div class="col-md-4 col-12 q-pb-md">
              <p class="text-bold mb-0 text-black-90">Proceso</p>
              <div>{{ selected_homologation_process.process_name }}</div>
            </div>
            <div class="col-md-4 col-12 q-pb-md">
              <p class="text-bold mb-0 text-black-90">Fecha del proceso</p>
              <div>
                {{
                  useUtils().formatDate(
                    selected_homologation_process.created_at,
                    'YYYY-MM-DD'
                  )
                }}
              </div>
            </div>
            <div class="col-md-4 col-12 q-pb-md">
              <p class="text-bold mb-0 text-black-90">Periodo</p>
              <div>{{ selected_homologation_process.period }}</div>
            </div>
            <div class="col-md-4 col-12 q-pb-md">
              <p class="text-bold mb-0 text-black-90">Estructura origen</p>
              <div>
                {{
                  `${selected_homologation_process.source_structure?.code} - ${selected_homologation_process.source_structure?.purpose}`
                }}
              </div>
            </div>
            <div class="col-md-4 col-12 q-pb-md">
              <p class="text-bold mb-0 text-black-90">Estructura destino</p>
              <div>
                {{
                  `${selected_homologation_process.destination_structure?.code} - ${selected_homologation_process.destination_structure?.purpose}`
                }}
              </div>
            </div>
          </div>
        </section>
        <q-separator spaced />
        <section>
          <p class="text-bold mb-0 text-black-90 text-h6 q-mt-lg">
            Listado de proceso de homologación
          </p>
          <section class="q-mt-md">
            <FiltersComponent
              ref="filterComponentRef"
              :fields="filterConfig"
              @filter="handleFilter"
            />
          </section>
          <VCard class="q-px-lg">
            <template #content-card>
              <TableList
                :loading="tableProps.loading"
                :columns="tableProps.columns"
                :pages="tableProps.pages"
                :rows="tableProps.rows"
                :hide-header="!tableProps.rows.length"
                :custom-columns="['status', 'actions']"
                @update-page="updatePage"
                @update-rows-per-page="updatePerPage"
              >
                <template #status="{ row }">
                  <ShowStatus :type="getStatus(row.status)" />
                </template>
                <template #actions="{ row }">
                  <!-- Comprobante origen -->
                  <Button
                    :left-icon="defaultIconsLucide.filePenLine"
                    color="orange"
                    :class-custom="'custom'"
                    :outline="false"
                    :flat="true"
                    colorIcon="#f45100"
                    tooltip="Ver comprobante origen"
                    @click="
                      $router.push({
                        name: 'HomologationProcessViewVoucher',
                        params: {
                          id: props.id,
                          voucherId: row.original_voucher_id,
                        },
                      })
                    "
                  />
                  <!-- Comprobante destino -->
                  <Button
                    v-if="
                      getStatus(row.status) ===
                      homologationProcessLogStatusID.HOMOLOGATION_SUCCEED
                    "
                    :left-icon="defaultIconsLucide.listCheck"
                    color="orange"
                    :class-custom="'custom'"
                    :outline="false"
                    :flat="true"
                    colorIcon="#f45100"
                    tooltip="Ver comprobante destino"
                    @click="
                      $router.push({
                        name: 'HomologationProcessViewVoucher',
                        params: {
                          id: props.id,
                          voucherId: row.new_voucher_id,
                        },
                      })
                    "
                  />
                  <!-- Ver novedades -->
                  <Button
                    :left-icon="defaultIconsLucide.eye"
                    color="orange"
                    :class-custom="'custom'"
                    :outline="false"
                    :flat="true"
                    colorIcon="#f45100"
                    tooltip="Ver novedades"
                    @click="
                      $router.push({
                        name: 'HomologationProcessVoucherLogs',
                        params: {
                          id: props.id,
                          voucherId: row.original_voucher_id,
                        },
                      })
                    "
                  />
                </template>
              </TableList>
            </template>
          </VCard>
        </section>
      </template>
    </VCard>
  </div>
</template>
<script setup lang="ts">
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'

import { defaultIconsLucide } from '@/utils'
import { useUtils } from '@/composables'

import { homologationProcessLogStatusID } from '@/interfaces/global'

import useSimpleViewForm from '@/components/Forms/Accounting/HomologationProcess/SimpleView/SimpleViewForm'

const props = defineProps<{
  id: number
}>()

const {
  selected_homologation_process,
  filterConfig,
  tableProps,
  handleFilter,
  updatePage,
  updatePerPage,
  getStatus,
} = useSimpleViewForm(props)
</script>
