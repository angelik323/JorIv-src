<template>
  <div class="q-px-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
    >
      <section class="q-my-md">
        <Card>
          <template #content-card>
            <BankResponseFilterForm
              ref="filterFormRef"
              v-model:process-type="processTypeSelected"
              @update:process-type="processTypeSelected = $event"
              @search="onSearch"
            />
          </template>
        </Card>

        <section>
          <BankResponsePaymentList
            ref="paymentListRef"
            :process-type-selected="processTypeSelected"
          />

          <q-form ref="detailRejectFormElementRef">
            <p class="text-black-90 text-weight-bold text-h6">
              Detalle rechazo
            </p>
            <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
              <div class="col-xs-12 col-sm-12 col-md-12">
                <GenericDateInput
                  label="Fecha rechazo"
                  :default_value="models.date"
                  :required="bank_response_assign_form?.status === 10"
                  :mask="'YYYY-MM-DD'"
                  :placeholder="'YYYY-MM-DD'"
                  :rules="
                    bank_response_assign_form?.status === 10
                      ? [
                          (v: string) =>
                            useRules().is_required(
                              v,
                              'La Fecha de rechazo es requerida'
                            ),
                          (v: string) =>
                            useRules().date_before_or_equal_to_the_current_date(
                              v
                            ),
                          (v: string) => useRules().date_is_not_weekend(v),
                        ]
                      : []
                  "
                  :disabled="
                    (processTypeSelected !== 'Archivo' &&
                      bank_response_assign_form?.status !== 10) ||
                    bank_response_payment_list.length === 0 ||
                    (processTypeSelected === 'Archivo' && !has_rejected_records)
                  "
                  @update:modelValue="models.date = $event"
                  :option_calendar="($event) => isDateAllowed($event, holidays)"
                  :onNavigation="({ year }) => handlerHolidays(year)"
                />
              </div>
            </div>
          </q-form>

          <section>
            <div class="row justify-end q-gutter-md mt-2">
              <Button
                :disabled="bank_response_payment_list.length === 0"
                label="Procesar"
                size="md"
                unelevated
                :outline="false"
                color="orange"
                class="text-capitalize btn-filter custom"
                @click="onSubmitProcess()"
              />
              <Button
                :disabled="bank_response_payment_list.length === 0"
                label="Errores"
                size="md"
                unelevated
                :outline="true"
                color="orange"
                class="text-capitalize btn-filter custom"
                @click="onSubmitErrors()"
              />
            </div>
          </section>
        </section>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import Card from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import GenericDateInput from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import BankResponseFilterForm from '@/components/Forms/Treasury/BankResponse/BankResponseFilter/BankResponseFilterForm.vue'
import BankResponsePaymentList from '@/components/Lists/Treasury/BankResponse/BankResponsePayment/BankResponsePaymentList.vue'

import useBankResponseList from './BankResponseList'

const {
  bank_response_payment_list,
  models,
  detailRejectFormElementRef,
  filterFormRef,
  paymentListRef,
  processTypeSelected,
  headerProperties,
  bank_response_assign_form,
  holidays,
  has_rejected_records,

  onSubmitErrors,
  onSubmitProcess,
  onSearch,
  useRules,
  isDateAllowed,
  handlerHolidays,
} = useBankResponseList()
</script>
