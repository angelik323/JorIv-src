<template>
  <div class="q-px-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      show-back-btn
      @on-back="$router.push({ name: 'CheckTreasuryReceiptList' })"
    >
      <section class="q-my-md">
        <TabsComponent
          :tab-active="activeTab"
          :tabs="tabs"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="activeTab = $event"
          @update:tab-active-idx="tabActiveIdx = $event"
        />
        <Card>
          <template #content-card class="mx-4 mb-4">
            <div class="row q-col-gutter-lg mt-1 q-pa-md">
              <div class="col-12 col-md-12">
                <h6 class="text-weight-medium mb-0 text-black-10">
                  <b>Información general</b>
                </h6>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 mb-2">
                <p class="text-weight-medium mb-0">
                  <b>Número:</b>
                </p>
                <p class="text-weight-medium mb-0">
                  {{ data_information_form?.id }}
                </p>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 mb-2">
                <p class="text-weight-medium mb-0">
                  <b>Registro:</b>
                </p>
                <p class="text-weight-medium mb-0">
                  {{ data_information_form?.general_information.registry }}
                </p>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 mb-2">
                <p class="text-weight-medium mb-0">
                  <b>Movimiento:</b>
                </p>
                <p class="text-weight-medium mb-0">
                  {{
                    data_information_form?.general_information?.movement
                      ?.description || '-'
                  }}
                </p>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 mb-2">
                <p class="text-weight-medium mb-0">
                  <b>Banco:</b>
                </p>
                <p class="text-weight-medium mb-0">
                  {{
                    data_information_form?.general_information?.bank
                      ?.description || '-'
                  }}
                </p>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 mb-2">
                <p class="text-weight-medium mb-0">
                  <b>Cuenta:</b>
                </p>
                <p class="text-weight-medium mb-0">
                  {{
                    data_information_form?.general_information.account
                      .account_number
                  }}
                  -
                  {{
                    data_information_form?.general_information.account
                      .account_name
                  }}
                </p>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 mb-2">
                <p class="text-weight-medium mb-0">
                  <b>Fecha:</b>
                </p>
                <p class="text-weight-medium mb-0">
                  {{ data_information_form?.general_information.date }}
                </p>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 mb-2">
                <p class="text-weight-medium mb-0">
                  <b>Naturaleza:</b>
                </p>
                <p class="text-weight-medium mb-0">
                  {{ data_information_form?.general_information.nature }}
                </p>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 mb-2">
                <p class="text-weight-medium mb-0">
                  <b>Valor:</b>
                </p>
                <p class="text-weight-medium mb-0">
                  $
                  {{
                    data_information_form?.general_information.amount.formatted
                  }}
                </p>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 mb-2">
                <p class="text-weight-medium mb-0">
                  <b>Forma:</b>
                </p>
                <p class="text-weight-medium mb-0">
                  {{ data_information_form?.general_information.form }}
                </p>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 mb-2">
                <p class="text-weight-medium mb-0">
                  <b>Concepto:</b>
                </p>
                <p class="text-weight-medium mb-0">
                  {{ data_information_form?.general_information.concept }}
                </p>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 mb-2">
                <p class="text-weight-medium mb-0">
                  <b>Estado:</b>
                </p>
                <ShowStatus
                  :type="
                    Number(
                      data_information_form?.general_information?.status?.id ??
                        0
                    )
                  "
                  class="q-mt-sm"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 mb-2">
                <p class="text-weight-medium mb-0">
                  <b>Motivo de anulación:</b>
                </p>
                <p class="text-weight-medium mb-0">
                  {{
                    data_information_form?.general_information
                      .annulation_reason || '-'
                  }}
                </p>
              </div>
            </div>
            <q-separator class="q-my-md" />
            <div class="row q-col-gutter-lg mt-1 q-pa-md">
              <div class="col-12 col-md-12">
                <h6 class="text-weight-medium mb-0 text-black-10">
                  <b>Información del beneficiario</b>
                </h6>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 mb-2">
                <p class="text-weight-medium mb-0">
                  <b>Beneficiario:</b>
                </p>
                <p class="text-weight-medium mb-0">
                  {{
                    data_information_form?.beneficiary_information?.beneficiary
                      ?.document
                      ? `${data_information_form.beneficiary_information.beneficiary.document} - ${data_information_form.beneficiary_information.beneficiary.name}`
                      : '-'
                  }}
                </p>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 mb-2">
                <p class="text-weight-medium mb-0">
                  <b>Cheque:</b>
                </p>
                <p class="text-weight-medium mb-0">
                  {{
                    data_information_form?.check_information.check_number || '-'
                  }}
                </p>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 mb-2">
                <p class="text-weight-medium mb-0">
                  <b>Banco beneficiado:</b>
                </p>
                <p class="text-weight-medium mb-0">
                  {{
                    data_information_form?.beneficiary_information
                      ?.beneficiary_bank?.description || '-'
                  }}
                </p>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 mb-2">
                <p class="text-weight-medium mb-0">
                  <b>Oficina:</b>
                </p>
                <p class="text-weight-medium mb-0">
                  {{ data_information_form?.check_information.office }} -
                  {{ data_information_form?.check_information.office_name }}
                </p>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 mb-2">
                <p class="text-weight-medium mb-0">
                  <b>Cuenta beneficiario:</b>
                </p>
                <p class="text-weight-medium mb-0">
                  {{
                    data_information_form?.general_information.account
                      .account_number
                  }}
                  -
                  {{
                    data_information_form?.general_information.account
                      .account_name
                  }}
                </p>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 mb-2">
                <p class="text-weight-medium mb-0">
                  <b>Estado dispersión:</b>
                </p>
                <p class="text-weight-medium mb-0">
                  {{
                    data_information_form?.check_information.dispersal_status ||
                    '-'
                  }}
                </p>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 mb-2">
                <p class="text-weight-medium mb-0">
                  <b>Sucursal retiro:</b>
                </p>
                <p class="text-weight-medium mb-0">
                  {{
                    data_information_form?.general_information?.bank_branch
                      ?.name
                  }}
                  -
                  {{
                    data_information_form?.general_information?.bank_branch
                      ?.code
                  }}
                </p>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 mb-2">
                <p class="text-weight-medium mb-0">
                  <b>Fecha efectiva:</b>
                </p>
                <p class="text-weight-medium mb-0">
                  {{
                    data_information_form?.check_information.effective_date ||
                    '-'
                  }}
                </p>
              </div>
            </div>
            <q-separator class="q-my-md" />
            <div class="row q-col-gutter-lg mt-1 q-pa-md">
              <div class="col-12 col-md-12">
                <h6 class="text-weight-medium mb-0 text-black-10">
                  <b>Información de registro</b>
                </h6>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 mb-2">
                <p class="text-weight-medium mb-0">
                  <b>Registra</b>
                </p>
                <p class="text-weight-medium mb-0">
                  {{
                    data_information_form?.registry_information.registered_by
                      ?.name || '-'
                  }}
                </p>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 mb-2">
                <p class="text-weight-medium mb-0">
                  <b>Autoriza</b>
                </p>
                <p class="text-weight-medium mb-0">
                  {{
                    data_information_form?.registry_information.authorized_by
                      ?.name || '-'
                  }}
                </p>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 mb-2">
                <p class="text-weight-medium mb-0">
                  <b>Cheque recaudo</b>
                </p>
                <p class="text-weight-medium mb-0">
                  {{
                    data_information_form?.registry_information
                      .collection_check || '-'
                  }}
                </p>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 mb-2">
                <p class="text-weight-medium mb-0">
                  <b>Banco cheque</b>
                </p>
                <p class="text-weight-medium mb-0">
                  {{
                    data_information_form?.registry_information.check_bank ||
                    '-'
                  }}
                </p>
              </div>
              <div class="mb-2">
                <div class="flex q-gutter-x-md">
                  <Button
                    v-if="
                      validateRouter(
                        'Treasury',
                        'CheckTreasuryReceiptList',
                        'show'
                      )
                    "
                    :outline="true"
                    label="Comprobante contable"
                    size="md"
                    color="orange"
                    :style-text="{ color: '#333' }"
                    class="text-capitalize btn-filter custom"
                    @click="handleGoToListAccountingVoucher()"
                  />
                  <Button
                    :outline="true"
                    label="Operación de pago"
                    size="md"
                    color="orange"
                    :style-text="{ color: '#333' }"
                    class="text-capitalize btn-filter custom"
                  />
                  <Button
                    :outline="true"
                    label="Operación monetaria"
                    size="md"
                    color="orange"
                    :style-text="{ color: '#333' }"
                    class="text-capitalize btn-filter custom"
                  />
                  <Button
                    :outline="true"
                    label="Operación portafolio"
                    size="md"
                    color="orange"
                    :style-text="{ color: '#333' }"
                    class="text-capitalize btn-filter custom"
                  />
                </div>
              </div>
            </div>

            <q-separator class="q-my-md" />

            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  :outline="false"
                  label="Finalizar"
                  size="md"
                  unelevated
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="$router.push({ name: 'CheckTreasuryReceiptList' })"
                />
              </div>
            </section>
          </template>
        </Card>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import Card from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'

import { useCheckTreasuryReceiptView } from './CheckTreasuryReceiptView'
import ShowStatus from '@/components/showStatus/ShowStatus.vue'

const {
  tabs,
  activeTab,
  headerProperties,
  tabActiveIdx,
  data_information_form,
  handleGoToListAccountingVoucher,
  validateRouter,
} = useCheckTreasuryReceiptView()
</script>
