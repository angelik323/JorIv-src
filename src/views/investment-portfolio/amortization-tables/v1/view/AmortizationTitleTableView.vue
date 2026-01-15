<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :show-back-btn="true"
      @on-back="$router.push({ name: 'AmortizationTitleTableList' })"
    />
    <section>
      <TabsComponent
        :tab-active="activeTab"
        :tabs="tabs"
        :tab-active-idx="tabActiveIdx"
        @update:tab-active="activeTab = $event"
        @update:tab-active-idx="tabActiveIdx = $event"
      />
      <VCard>
        <template #content-card>
          <section class="mx-4 mb-4">
            <div class="row q-col-gutter-lg mt-1">
              <div class="col-xs-12 col-sm-12 col-md-4 mb-2">
                <p class="text-weight-medium mb-0"><b>Nemotécnico</b></p>
                <p class="text-grey-8 mb-0">
                  {{ data_information_form?.mnemonic ?? 'N/A' }}
                </p>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 mb-2">
                <p class="text-weight-medium mb-0">
                  <b>Periodicidad de pago</b>
                </p>
                <p class="text-grey-8 mb-0">
                  {{ data_information_form?.payment_frequency ?? 'N/A' }}
                </p>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 mb-2">
                <p class="text-weight-medium mb-0">
                  <b>Modalidad</b>
                </p>
                <p class="text-grey-8 mb-0">
                  {{ data_information_form?.modality ?? 'N/A' }}
                </p>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 mb-2">
                <p class="text-weight-medium mb-0">
                  <b>Tipo de flujo</b>
                </p>
                <p class="text-grey-8 mb-0">
                  {{ data_information_form?.flow_type ?? 'N/A' }}
                </p>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 mb-2">
                <p class="text-weight-medium mb-0">
                  <b>Fecha de emisión</b>
                </p>
                <p class="text-grey-8 mb-0">
                  {{ data_information_form?.issue_date ?? 'N/A' }}
                </p>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 mb-2">
                <p class="text-weight-medium mb-0">
                  <b>Fecha de vencimiento</b>
                </p>
                <p class="text-grey-8 mb-0">
                  {{ data_information_form?.maturity_date ?? 'N/A' }}
                </p>
              </div>
            </div>
            <q-separator class="q-my-md" />
            <TableList
              :title="tableProps.title"
              :loading="tableProps.loading"
              :columns="tableProps.columns"
              :rows="tableProps.rows"
              :hide-bottom="true"
            />
            <q-separator class="q-my-md" />
            <div class="row q-col-gutter-lg mt-1">
              <h6>
                <b>Historial de títulos amortizables</b>
              </h6>
            </div>
            <div class="row q-col-gutter-lg mt-1">
              <div class="col-xs-12 col-sm-12 col-md-3 mb-2">
                <p class="text-weight-medium mb-0">
                  <b>Fecha de creación</b>
                </p>
                <p class="text-grey-8 mb-0">
                  {{
                    data_information_form?.history_amortizable_titles
                      ?.created_at ?? 'N/A'
                  }}
                </p>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 mb-2">
                <p class="text-weight-medium mb-0"><b>Creado por</b></p>
                <p class="text-grey-8 mb-0">
                  {{
                    data_information_form?.history_amortizable_titles
                      ?.created_by_user ?? 'N/A'
                  }}
                </p>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 mb-2">
                <p class="text-weight-medium mb-0"><b>Modificación</b></p>
                <p class="text-grey-8 mb-0">
                  {{
                    data_information_form?.history_amortizable_titles
                      ?.updated_at ?? 'N/A'
                  }}
                </p>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 mb-2">
                <p class="text-weight-medium mb-0"><b>Modificado por</b></p>
                <p class="text-grey-8 mb-0">
                  {{
                    data_information_form?.history_amortizable_titles
                      ?.updated_by_user ?? 'N/A'
                  }}
                </p>
              </div>
            </div>
            <div class="row justify-end q-gutter-md q-mt-md">
              <Button
                :label="'Finalizar'"
                :size="'md'"
                :unelevated="true"
                :outline="false"
                :color="'orange'"
                :class="'text-capitalize btn-filter custom'"
                @click="$router.push({ name: 'AmortizationTitleTableList' })"
              />
            </div>
          </section>
        </template>
      </VCard>
    </section>
  </div>
</template>

<script setup lang="ts">
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

import { useAmortizationTitleTableView } from './AmortizationTitleTableView'

const {
  headerProps,
  tabs,
  activeTab,
  tabActiveIdx,
  data_information_form,
  tableProps,
} = useAmortizationTitleTableView()
</script>
