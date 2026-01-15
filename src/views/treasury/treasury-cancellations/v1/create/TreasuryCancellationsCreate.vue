<template>
  <div class="q-px-xl" main>
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      :show-back-btn="true"
      @on-back="goToURL('TreasuryCancellationsList')"
    >
      <section
        class="q-my-md"
        aria-label="Sección de creación de detalles del movimiento"
      >
        <TabsComponent
          :tabs="tabs"
          :tab-active="tabActive"
          :tab-active-idx="tabActiveIdx"
        />

        <VCard>
          <template #content-card>
            <div class="q-pa-lg">
              <p class="text-weight-bold text-h6">Campos requeridos</p>
              <div class="row q-col-gutter-x-lg q-col-gutter-y-md">
                <div class="col-12 col-md-3">
                  <GenericInputComponent
                    :default_value="
                      treasury_cancellation_selected?.business_trust?.code
                    "
                    label="Negocio"
                    placeholder="-"
                    type="text"
                    disabled
                  />
                </div>

                <div class="col-12 col-md-3">
                  <GenericInputComponent
                    :default_value="
                      treasury_cancellation_selected?.business_trust?.name
                    "
                    label="Nombre del negocio"
                    placeholder="-"
                    type="text"
                    disabled
                  />
                </div>

                <div class="col-12 col-md-3">
                  <GenericInputComponent
                    :default_value="treasury_cancellation_selected?.fiscal_year"
                    label="Vigencia"
                    placeholder="-"
                    type="text"
                    disabled
                  />
                </div>

                <div class="col-12 col-md-3">
                  <CurrencyInput
                    label="Valor"
                    v-model="formDisableds.value_local"
                    :currency="'COP'"
                    :placeholder="'Valor'"
                    disabled
                  />
                </div>

                <div class="col-12 col-md-4">
                  <GenericInputComponent
                    :default_value="
                      treasury_cancellation_selected?.treasury_movement_code
                        ?.code +
                      ' - ' +
                      treasury_cancellation_selected?.treasury_movement_code
                        ?.description
                    "
                    label="Código de movimiento de anulación origen"
                    placeholder="-"
                    type="text"
                    disabled
                  />
                </div>

                <div class="col-12 col-md-4">
                  <GenericInputComponent
                    :default_value="treasury_cancellation_selected?.voucher"
                    label="Código comprobante anulación origen"
                    placeholder="-"
                    type="text"
                    disabled
                  />
                </div>

                <div class="col-12 col-md-4">
                  <GenericInputComponent
                    :default_value="treasury_cancellation_selected?.sub_voucher"
                    label="Código subcomprobante de anulación origen"
                    placeholder="-"
                    type="text"
                    disabled
                  />
                </div>

                <div
                  v-if="type === 'transfers'"
                  class="row q-col-gutter-x-lg q-col-gutter-y-md"
                >
                  <div class="col-12 col-md-4">
                    <GenericInputComponent
                      :default_value="formData.codigo_movimiento_destino"
                      label="Código de movimiento de anulación destino"
                      placeholder="-"
                      type="text"
                      disabled
                    />
                  </div>

                  <div class="col-12 col-md-4">
                    <GenericInputComponent
                      :default_value="formData.codigo_comprobante_destino"
                      label="Código comprobante anulación destino"
                      placeholder="-"
                      type="text"
                      disabled
                    />
                  </div>

                  <div class="col-12 col-md-4">
                    <GenericInputComponent
                      :default_value="formData.codigo_subcomprobante_destino"
                      label="Código subcomprobante de anulación destino"
                      placeholder="-"
                      type="text"
                      disabled
                    />
                  </div>
                </div>
              </div>

              <q-separator class="q-my-lg" />

              <p class="text-weight-bold text-h6">Datos de anulación</p>

              <div class="row q-col-gutter-x-lg q-col-gutter-y-md">
                <div class="col-12 col-md-6">
                  <GenericDateInputComponent
                    label="Fecha de anulación"
                    :default_value="formData.fecha"
                    mask="YYYY-MM-DD"
                    placeholder="YYYY-MM-DD"
                    required
                    :rules="[
                      (val: string) => useRules().is_required(val, 'La fecha de anulación es requerida.'),
                      (val: string) => useRules().valid_format_date(val, 'YYYY-MM-DD')
                    ]"
                    @update:modelValue="(val: string) => formData.fecha = val"
                    :navigation_max_year="new Date().getFullYear().toString()"
                    :navigation_min_year="'1000/01'"
                    :option_calendar="
                      ($event) => useUtils().isDateAllowed($event, holidays)
                    "
                    :onNavigation="handlerHolidays"
                  />
                </div>

                <div class="col-12 col-md-6">
                  <GenericSelectorComponent
                    label="Período"
                    :manual_option="periodsSelect"
                    map_options
                    required
                    :default_value="formData.periodo"
                    auto_complete
                    placeholder="Seleccione"
                    :rules="[
                      (val: string) => useRules().is_required(val, 'El período es requerido.')
                    ]"
                    @update:modelValue="(val: string) => formData.periodo = val"
                  />
                </div>

                <div class="col-12">
                  <GenericInputComponent
                    :default_value="formData.observaciones"
                    label="Observaciones"
                    placeholder="Inserte"
                    type="text"
                    @update:modelValue="(val: string) => formData.observaciones = val"
                  />
                </div>

                <div class="col-12">
                  <GenericSelectorComponent
                    label="Causal de anulación"
                    :manual_option="reasons_bank_return"
                    map_options
                    required
                    :default_value="formData.causal"
                    auto_complete
                    placeholder="Seleccione"
                    :rules="[
                      (val: string) => useRules().is_required(val, 'La causal es requerida.')
                    ]"
                    @update:modelValue="(val: string) => formData.causal = val"
                  />
                </div>
              </div>

              <div class="row justify-end q-gutter-md">
                <Button
                  :outline="false"
                  label="Anular"
                  color="orange"
                  class="text-capitalize btn-filter custom"
                  @click="openModalCancellation"
                />
              </div>
            </div>
          </template>
        </VCard>
      </section>

      <AlertModalComponent
        ref="cancellationModalRef"
        styleModal="min-width: 470px"
        :showImgDefault="false"
        :title="cancellationModalConfig.description"
        :description_message="''"
        @confirm="handleCancellation"
      >
        <template #default-img>
          <q-img
            src="@/assets/images/icons/alert_popup_delete.svg"
            max-width="80px"
            width="80px"
            fit="contain"
            alt="Imagen de alerta"
          />
        </template>
      </AlertModalComponent>
    </ContentComponent>
  </div>
</template>
<script setup lang="ts">
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'

import { useRules } from '@/composables'

import useTreasuryCancellationCreate from './TreasuryCancellationsCreate'

const {
  tabs,
  type,
  formData,
  tabActive,
  tabActiveIdx,
  headerProperties,
  handleCancellation,
  cancellationModalRef,
  openModalCancellation,
  goToURL,
  cancellationModalConfig,
  periodsSelect,
  reasons_bank_return,
  treasury_cancellation_selected,
  formDisableds,
  holidays,
  handlerHolidays,
  useUtils,
} = useTreasuryCancellationCreate()
</script>
