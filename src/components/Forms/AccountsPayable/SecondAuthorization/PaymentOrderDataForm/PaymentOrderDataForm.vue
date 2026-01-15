<template>
  <div class="q-pa-lg">
    <section class="q-mt-md">
      <p class="text-black-90 text-subtitle1 text-weight-bold">
        {{ tableProps.title }}
      </p>
      <VCard>
        <template #content-card>
          <TableList
            :loading="tableProps.loading"
            :columns="tableProps.columns"
            :rows="tableProps.rows"
            :pages="tableProps.pages"
            hide-pagination
            :rows-per-page-options="[0]"
            selection="single"
            v-model:selected="selectedInstruction"
            class="q-ma-sm"
          />
        </template>
      </VCard>

      <div
        class="flex justify-center q-gutter-md"
        v-if="selectedInstruction.length === 0"
      >
        <Button
          :outline="true"
          label="Comprobante contable"
          color="orange"
          class="custom"
          @click="handleClickOption('accounting_voucher')"
        />

        <Button
          :outline="true"
          label="Comprobante tesorería"
          color="orange"
          class="custom"
          @click="handleClickOption('treasury_voucher')"
          :disabled="treasuryVoucherBtnDisabled"
        />

        <Button
          :outline="true"
          label="Bien"
          color="orange"
          class="custom"
          @click="handleClickOption('asset')"
        />

        <Button
          :outline="true"
          label="Moneda extranjera"
          color="orange"
          class="custom"
          @click="handleClickOption('foreign_currency')"
        />
      </div>
    </section>

    <AlertModalComponent
      ref="alertModalRef"
      styleModal="min-width: 50%"
      :title="alertModalConfig.title"
      margin-top-body="mb-0"
      :show-img-default="true"
      :show-btn-confirm="false"
    >
      <template #default-body>
        <ForeignCurrencyDataForm :data="models.foreign_currency" />
      </template>
    </AlertModalComponent>
  </div>
</template>
<script setup lang="ts">
//Components
import TableList from '@/components/table-list/TableList.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import ForeignCurrencyDataForm from '@/components/Forms/AccountsPayable/SecondAuthorization/ForeignCurrencyDataForm/ForeignCurrencyDataForm.vue'

//Interfaces
import { ISecondAuthorizationPaymentOrderForm } from '@/interfaces/customs/accounts-payable/SecondAuthorization'

//Logic
import usePaymentOrderDataForm from '@/components/Forms/AccountsPayable/SecondAuthorization/PaymentOrderDataForm/PaymentOrderDataForm'

const props = withDefaults(
  defineProps<{
    data?: ISecondAuthorizationPaymentOrderForm | null
    payment_status?: number | null
    payment_request_id?: number | null
    voucher_id?: number | null
  }>(),
  {}
)

const {
  models,
  alertModalRef,
  alertModalConfig,
  selectedInstruction,
  tableProps,
  treasuryVoucherBtnDisabled,
  handleClickOption,
} = usePaymentOrderDataForm(props)
</script>
