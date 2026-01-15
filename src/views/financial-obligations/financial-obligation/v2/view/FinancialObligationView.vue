<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerPropsView.title"
      :breadcrumbs="headerPropsView.breadcrumbs"
      show-back-btn
      @on-back="goToList"
    >
      <section v-if="!isLoading">
        <TabsComponent
          :tabActive="tabActive"
          :tabs="tabs"
          :tabActiveIdx="tabActiveIdx"
          @update:tab-active="tabActive = $event"
        />

        <VCard>
          <template #content-card>
            <div class="q-px-xl q-pb-xl q-pt-lg">
              <!-- Tab Datos básicos -->
              <section v-show="tabActive === 'basic_data'">
                <!-- Información de auditoría -->
                <div class="q-mb-lg">
                  <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
                    Información de auditoría
                  </p>
                </div>

                <div class="row q-col-gutter-x-lg q-col-gutter-y-sm q-mb-lg">
                  <div class="col-12 col-md-3">
                    <div class="text-black-90 mb-4">
                      <p class="mb-0 text-weight-bold">Estado del registro</p>
                      <p class="text-weight-medium">
                        {{ auditInfo.status_name || '-' }}
                      </p>
                    </div>
                  </div>
                  <div class="col-12 col-md-3">
                    <div class="text-black-90 mb-4">
                      <p class="mb-0 text-weight-bold">Fecha de creación</p>
                      <p class="text-weight-medium">
                        {{ auditInfo.created_at?.slice(0, 10) || '-' }}
                      </p>
                    </div>
                  </div>
                  <div class="col-12 col-md-3">
                    <div class="text-black-90 mb-4">
                      <p class="mb-0 text-weight-bold">Creado por</p>
                      <p class="text-weight-medium">
                        {{ auditInfo.created_by || '-' }}
                      </p>
                    </div>
                  </div>
                  <div v-if="auditInfo.updated_at" class="col-12 col-md-3">
                    <div class="text-black-90 mb-4">
                      <p class="mb-0 text-weight-bold">
                        Fecha de actualización
                      </p>
                      <p class="text-weight-medium">
                        {{ auditInfo.updated_at?.slice(0, 10) || '-' }}
                      </p>
                    </div>
                  </div>
                  <div v-if="auditInfo.updated_by" class="col-12 col-md-3">
                    <div class="text-black-90 mb-4">
                      <p class="mb-0 text-weight-bold">Actualizado por</p>
                      <p class="text-weight-medium">
                        {{ auditInfo.updated_by || '-' }}
                      </p>
                    </div>
                  </div>
                </div>

                <q-separator class="q-my-lg" />

                <!-- Datos básicos -->
                <div class="q-mb-lg">
                  <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
                    Datos básicos
                  </p>
                </div>

                <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
                  <div class="col-12 col-md-3">
                    <div class="text-black-90 mb-4">
                      <p class="mb-0 text-weight-bold">Nombre del negocio</p>
                      <p class="text-weight-medium">
                        {{ basicData?.business_trust_name || '-' }}
                      </p>
                    </div>
                  </div>
                  <div class="col-12 col-md-3">
                    <div class="text-black-90 mb-4">
                      <p class="mb-0 text-weight-bold">
                        Número de obligación financiera
                      </p>
                      <p class="text-weight-medium">
                        {{ basicData?.obligation_number || '-' }}
                      </p>
                    </div>
                  </div>
                  <div class="col-12 col-md-3">
                    <div class="text-black-90 mb-4">
                      <p class="mb-0 text-weight-bold">Titular</p>
                      <p class="text-weight-medium">
                        {{ basicData?.holder_name || '-' }}
                      </p>
                    </div>
                  </div>
                  <div class="col-12 col-md-3">
                    <div class="text-black-90 mb-4">
                      <p class="mb-0 text-weight-bold">NIT del titular</p>
                      <p class="text-weight-medium">
                        {{ basicData?.holder_identification || '-' }}
                      </p>
                    </div>
                  </div>
                  <div class="col-12 col-md-3">
                    <div class="text-black-90 mb-4">
                      <p class="mb-0 text-weight-bold">Banco</p>
                      <p class="text-weight-medium">
                        {{ basicData?.bank_name || '-' }}
                      </p>
                    </div>
                  </div>
                  <div class="col-12 col-md-3">
                    <div class="text-black-90 mb-4">
                      <p class="mb-0 text-weight-bold">Tipo de crédito</p>
                      <p class="text-weight-medium">
                        {{ basicData?.credit_type_name || '-' }}
                      </p>
                    </div>
                  </div>
                  <div class="col-12 col-md-3">
                    <div class="text-black-90 mb-4">
                      <p class="mb-0 text-weight-bold">Valor del crédito</p>
                      <p class="text-weight-medium">
                        {{ basicData?.credit_value || '-' }}
                      </p>
                    </div>
                  </div>
                  <div class="col-12 col-md-3">
                    <div class="text-black-90 mb-4">
                      <p class="mb-0 text-weight-bold">Tasa (%)</p>
                      <p class="text-weight-medium">
                        {{ basicData?.rate || '-' }}
                      </p>
                    </div>
                  </div>
                  <div class="col-12 col-md-3">
                    <div class="text-black-90 mb-4">
                      <p class="mb-0 text-weight-bold">Periodicidad del pago</p>
                      <p class="text-weight-medium">
                        {{ basicData?.payment_periodicity || '-' }}
                      </p>
                    </div>
                  </div>
                  <div class="col-12 col-md-3">
                    <div class="text-black-90 mb-4">
                      <p class="mb-0 text-weight-bold">Factor</p>
                      <p class="text-weight-medium">
                        {{ basicData?.rate_factor || '-' }}
                      </p>
                    </div>
                  </div>
                  <div class="col-12 col-md-3">
                    <div class="text-black-90 mb-4">
                      <p class="mb-0 text-weight-bold">Plazo (cuotas)</p>
                      <p class="text-weight-medium">
                        {{ basicData?.term || '-' }}
                      </p>
                    </div>
                  </div>
                  <div class="col-12 col-md-3">
                    <div class="text-black-90 mb-4">
                      <p class="mb-0 text-weight-bold">Día de pago</p>
                      <p class="text-weight-medium">
                        {{ basicData?.payment_day || '-' }}
                      </p>
                    </div>
                  </div>
                  <div class="col-12 col-md-3">
                    <div class="text-black-90 mb-4">
                      <p class="mb-0 text-weight-bold">Días de alerta</p>
                      <p class="text-weight-medium">
                        {{ basicData?.alert_days || '-' }}
                      </p>
                    </div>
                  </div>
                </div>

                <q-separator class="q-my-lg" />

                <!-- Configuración del plan de pagos -->
                <div class="q-mb-lg">
                  <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
                    Cálculos de la obligación
                  </p>
                </div>

                <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
                  <div class="col-12 col-md-3">
                    <div class="text-black-90 mb-4">
                      <p class="mb-0 text-weight-bold">
                        Método de cálculo de interés
                      </p>
                      <p class="text-weight-medium">
                        {{
                          calculationsData?.interest_calculation_method || '-'
                        }}
                      </p>
                    </div>
                  </div>
                  <div class="col-12 col-md-3">
                    <div class="text-black-90 mb-4">
                      <p class="mb-0 text-weight-bold">Base de cálculo</p>
                      <p class="text-weight-medium">
                        {{ calculationsData?.calculation_base || '-' }}
                      </p>
                    </div>
                  </div>
                  <div class="col-12 col-md-3">
                    <div class="text-black-90 mb-4">
                      <p class="mb-0 text-weight-bold">Tipo de cuota</p>
                      <p class="text-weight-medium">
                        {{ calculationsData?.quota_type || '-' }}
                      </p>
                    </div>
                  </div>
                  <div class="col-12 col-md-3">
                    <div class="text-black-90 mb-4">
                      <p class="mb-0 text-weight-bold">Tipo de amortización</p>
                      <p class="text-weight-medium">
                        {{ calculationsData?.amortization_type || '-' }}
                      </p>
                    </div>
                  </div>
                </div>

                <q-separator class="q-my-lg" />

                <!-- Plan de pagos -->
                <div class="q-mb-lg">
                  <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
                    Plan de pagos
                  </p>
                </div>

                <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
                  <div class="col-12 col-md-3">
                    <div class="text-black-90 mb-4">
                      <p class="mb-0 text-weight-bold">Número de cuotas</p>
                      <p class="text-weight-medium">
                        {{ paymentPlanSummary?.number_of_quotas || '-' }}
                      </p>
                    </div>
                  </div>
                  <div class="col-12 col-md-3">
                    <div class="text-black-90 mb-4">
                      <p class="mb-0 text-weight-bold">
                        Fecha de inicio plan de pagos
                      </p>
                      <p class="text-weight-medium">
                        {{ paymentPlanSummary?.start_date || '-' }}
                      </p>
                    </div>
                  </div>
                  <div class="col-12 col-md-3">
                    <div class="text-black-90 mb-4">
                      <p class="mb-0 text-weight-bold">
                        Fecha final plan de pagos
                      </p>
                      <p class="text-weight-medium">
                        {{ paymentPlanSummary?.end_date || '-' }}
                      </p>
                    </div>
                  </div>
                  <div class="col-12 col-md-3">
                    <div class="text-black-90 mb-4">
                      <p class="mb-0 text-weight-bold">Saldo inicial</p>
                      <p class="text-weight-medium">
                        {{ paymentPlanSummary?.initial_balance || '-' }}
                      </p>
                    </div>
                  </div>
                  <div class="col-12 col-md-3">
                    <div class="text-black-90 mb-4">
                      <p class="mb-0 text-weight-bold">Cuota capital</p>
                      <p class="text-weight-medium">
                        {{ paymentPlanSummary?.capital_quota || '-' }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Botón ver documentos soporte -->
                <div class="q-mt-lg">
                  <Button
                    outline
                    label="Ver documentos soporte"
                    :left-icon="defaultIconsLucide.file"
                    @click="goToDocuments"
                  />
                </div>

                <q-separator class="q-my-lg" />

                <!-- Listado de plan de pagos -->
                <TableList
                  :loading="paymentPlanTableProperties.loading"
                  :columns="paymentPlanTableProperties.columns"
                  :rows="paymentPlanTableProperties.rows"
                  :pages="paymentPlanTableProperties.pages"
                  :custom-columns="['status_quota']"
                  @update-page="updatePaymentPlanPage"
                >
                  <template #custom-header>
                    <div class="row q-col-gutter-sm" style="width: 100%">
                      <div
                        class="col-xs-12 col-sm-12 col-md-9 col-lg-10 self-center"
                      >
                        <p class="q-my-none text-weight-medium text-h5">
                          {{ paymentPlanTableProperties.title }}
                        </p>
                      </div>
                      <div class="col-xs-12 col-sm-12 col-md-3 col-lg-2">
                        <Button
                          :outline="true"
                          label="Descargar excel"
                          :leftImg="excelIcon"
                          :disabled="
                            paymentPlanTableProperties.rows.length === 0
                          "
                          tooltip="Descargar excel"
                          @click="downloadPaymentPlanExcel"
                        />
                      </div>
                    </div>
                  </template>

                  <template #status_quota="{ row }">
                    <ShowStatusV2
                      :type="row.status_quota_id"
                      status-type="financialObligations"
                    />
                  </template>
                </TableList>
              </section>

              <!-- Tab Observaciones -->
              <section v-show="tabActive === 'observations'">
                <TableList
                  :loading="observationsTableProperties.loading"
                  :columns="observationsTableProperties.columns"
                  :rows="observationsTableProperties.rows"
                  :pages="observationsTableProperties.pages"
                  @update-page="updateObservationsPage"
                >
                  <template #custom-header>
                    <div class="row q-col-gutter-sm" style="width: 100%">
                      <div class="col-12 self-center">
                        <p class="q-my-none text-weight-medium text-h5">
                          {{ observationsTableProperties.title }}
                        </p>
                      </div>
                    </div>
                  </template>
                </TableList>
              </section>
            </div>
          </template>
        </VCard>
      </section>

      <!-- Botón Finalizar -->
      <section class="q-mt-lg row justify-end">
        <Button
          label="Finalizar"
          :outline="false"
          color="orange"
          class="text-capitalize btn-filter custom"
          @click="goToList"
        />
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// components
import Button from '@/components/common/Button/Button.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import TableList from '@/components/table-list/TableList.vue'
import ShowStatusV2 from '@/components/showStatus/v2/ShowStatus.vue'

// logic
import useFinancialObligationView from '@/views/financial-obligations/financial-obligation/v2/view/FinancialObligationView'

const {
  headerPropsView,
  isLoading,
  tabs,
  tabActive,
  tabActiveIdx,
  auditInfo,
  basicData,
  calculationsData,
  paymentPlanSummary,
  paymentPlanTableProperties,
  observationsTableProperties,
  defaultIconsLucide,
  excelIcon,
  goToDocuments,
  goToList,
  downloadPaymentPlanExcel,
  updatePaymentPlanPage,
  updateObservationsPage,
} = useFinancialObligationView()
</script>
