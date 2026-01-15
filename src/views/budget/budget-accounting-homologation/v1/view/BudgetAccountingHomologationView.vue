<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="goToURL('BudgetAccountingHomologationList')"
    >
      <section class="q-mt-xl">
        <VCard class="q-pa-lg">
          <template #content-card>
            <p class="text-black-90 text-weight-bold text-h6 q-mb-none q-mb-md">
              Datos básicos
            </p>
            <div class="row">
              <div class="col-12 col-md-3">
                <p class="text-weight-bold no-margin text-black-90">
                  Código/Negocio
                </p>
                <p class="text-weight-medium q-mb-lg">
                  {{
                    `${
                      homologationProcessData?.business?.business_code ?? ''
                    } - ${homologationProcessData?.business?.name ?? ''}`
                  }}
                </p>
              </div>
              <div class="col-12 col-md-3">
                <p class="text-weight-bold no-margin text-black-90">Vigencia</p>
                <p class="text-weight-medium q-mb-lg">
                  {{ homologationProcessData?.validity ?? '-' }}
                </p>
              </div>
              <div class="col-12 col-md-3">
                <p class="text-weight-bold no-margin text-black-90">
                  Tipo de documento
                </p>
                <p class="text-weight-medium q-mb-lg">
                  {{
                    `${homologationProcessData?.document_type?.code ?? ''} - ${
                      homologationProcessData?.document_type?.description ?? ''
                    }`
                  }}
                </p>
              </div>
              <div class="col-12 col-md-3">
                <p class="text-weight-bold no-margin text-black-90">
                  Número de documento
                </p>
                <p class="text-weight-medium q-mb-lg">
                  {{ homologationProcessData?.document_number ?? '-' }}
                </p>
              </div>
              <div class="col-12 col-md-3">
                <p class="text-weight-bold no-margin text-black-90">Rubro</p>
                <p class="text-weight-medium q-mb-lg">
                  {{
                    `${homologationProcessData?.budget_item?.code ?? ''} - ${
                      homologationProcessData?.budget_item?.description ?? ''
                    }`
                  }}
                </p>
              </div>
              <div class="col-12 col-md-3">
                <p class="text-weight-bold no-margin text-black-90">Área</p>
                <p class="text-weight-medium q-mb-lg">
                  {{
                    `${homologationProcessData?.area?.code ?? ''} - ${
                      homologationProcessData?.area?.description ?? ''
                    }`
                  }}
                </p>
              </div>
              <div class="col-12 col-md-3">
                <p class="text-weight-bold no-margin text-black-90">Recurso</p>
                <p class="text-weight-medium q-mb-lg">
                  {{
                    `${homologationProcessData?.resource?.code ?? ''} - ${
                      homologationProcessData?.resource?.description ?? ''
                    }`
                  }}
                </p>
              </div>
              <div class="col-12 col-md-3">
                <p class="text-weight-bold no-margin text-black-90">
                  Código de movimiento
                </p>
                <p class="text-weight-medium q-mb-lg">
                  {{
                    `${
                      homologationProcessData?.code_movement?.movement_code ??
                      ''
                    } - ${
                      homologationProcessData?.code_movement
                        ?.movement_description
                    }`
                  }}
                </p>
              </div>
              <div class="col-12 col-md-3">
                <p class="text-weight-bold no-margin text-black-90">Valor</p>
                <p class="text-weight-medium q-mb-lg">
                  {{ homologationProcessData?.value ?? '-' }}
                </p>
              </div>
              <div class="col-12 col-md-3">
                <p class="text-weight-bold no-margin text-black-90">
                  Tipo de comprobante
                </p>
                <p class="text-weight-medium q-mb-lg">
                  {{
                    `${
                      homologationProcessData?.voucher_data?.receipt_type
                        .code ?? ''
                    } - ${
                      homologationProcessData?.voucher_data?.receipt_type
                        .name ?? ''
                    }`
                  }}
                </p>
              </div>
              <div class="col-12 col-md-3">
                <p class="text-weight-bold no-margin text-black-90">
                  Tipo subcomprobante
                </p>
                <p class="text-weight-medium q-mb-lg">
                  {{
                    `${
                      homologationProcessData?.voucher_data?.sub_receipt_type
                        .code ?? ''
                    } - ${
                      homologationProcessData?.voucher_data?.sub_receipt_type
                        .name ?? ''
                    }`
                  }}
                </p>
              </div>
              <div class="col-12 col-md-3">
                <p class="text-weight-bold no-margin text-black-90">
                  Número comprobante
                </p>
                <p class="text-weight-medium q-mb-lg">
                  {{ `${homologationProcessData?.voucher_data?.id ?? ''}` }}
                </p>
              </div>
              <div class="col-12 col-md-3">
                <p class="text-weight-bold no-margin text-black-90">Periodo</p>
                <p class="text-weight-medium q-mb-lg">
                  {{ homologationProcessData?.period ?? '-' }}
                </p>
              </div>
              <div class="col-12 col-md-3">
                <p class="text-weight-bold no-margin text-black-90">
                  Fecha de homologación
                </p>
                <p class="text-weight-medium q-mb-lg">
                  {{ homologationProcessData?.homologation_date ?? '-' }}
                </p>
              </div>
            </div>
            <q-separator spaced />
            <p class="text-black-90 text-weight-bold text-h6 q-mb-none q-my-md">
              Partida
            </p>
            <div class="row">
              <div class="col-12 col-md-3">
                <p class="text-weight-bold no-margin text-black-90">
                  Cuenta contable
                </p>
                <p class="text-weight-medium q-mb-lg">
                  {{
                    `${
                      homologationProcessData?.source_accounting_account_id
                        ?.code ?? ''
                    } - ${
                      homologationProcessData?.source_accounting_account_id
                        ?.description ?? ''
                    }`
                  }}
                </p>
              </div>
              <div class="col-12 col-md-3">
                <p class="text-weight-bold no-margin text-black-90">Auxiliar</p>
                <p class="text-weight-medium q-mb-lg">
                  {{
                    homologationProcessData?.source_auxiliary_id
                      ?.full_name_code ?? '-'
                  }}
                </p>
              </div>
              <div class="col-12 col-md-3">
                <p class="text-weight-bold no-margin text-black-90">
                  Centro de costos
                </p>
                <p class="text-weight-medium q-mb-lg">
                  {{
                    `${
                      homologationProcessData?.source_cost_center_id?.code ?? ''
                    } - ${
                      homologationProcessData?.source_cost_center_id?.name ?? ''
                    }`
                  }}
                </p>
              </div>
            </div>
            <p class="text-black-90 text-weight-bold text-h6 q-mb-none q-mb-md">
              Contrapartida
            </p>
            <div class="row">
              <div class="col-12 col-md-3">
                <p class="text-weight-bold no-margin text-black-90">
                  Cuenta contable
                </p>
                <p class="text-weight-medium q-mb-lg">
                  {{
                    `${
                      homologationProcessData?.source_accounting_account_id
                        ?.code ?? ''
                    } - ${
                      homologationProcessData?.source_accounting_account_id
                        ?.description ?? ''
                    }`
                  }}
                </p>
              </div>
              <div class="col-12 col-md-3">
                <p class="text-weight-bold no-margin text-black-90">Auxiliar</p>
                <p class="text-weight-medium q-mb-lg">
                  {{
                    homologationProcessData?.source_auxiliary_id
                      ?.full_name_code ?? '-'
                  }}
                </p>
              </div>
              <div class="col-12 col-md-3">
                <p class="text-weight-bold no-margin text-black-90">
                  Centro de costos
                </p>
                <p class="text-weight-medium q-mb-lg">
                  {{
                    `${
                      homologationProcessData?.source_cost_center_id?.code ?? ''
                    } - ${
                      homologationProcessData?.source_cost_center_id?.name ?? ''
                    }`
                  }}
                </p>
              </div>
            </div>
          </template>
        </VCard>
      </section>
      <section
        class="q-my-lg"
        aria-label="Controles de navegación entre secciones"
      >
        <div class="row justify-end q-gutter-md">
          <Button
            class="custom"
            label="Finalizar"
            unelevated
            :outline="false"
            color="orange"
            @click="goToURL('BudgetAccountingHomologationList')"
          />
        </div>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Logic view
import useBudgetAccountingHomologationView from '@/views/budget/budget-accounting-homologation/v1/view/BudgetAccountingHomologationView'

const { homologationProcessData, headerProps, goToURL } =
  useBudgetAccountingHomologationView()
</script>
