<template>
  <q-form ref="basicDataFormRef" class="q-pa-xl">
    <section>
      <div class="row q-col-gutter-x-lg q-col-gutter-y-lg">
        <div class="col-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Código oficina</p>
            <p class="text-weight-medium no-margin">
              {{ models.office_code ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Descripción oficina
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.office_description ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Desde negocio</p>
            <p class="text-weight-medium no-margin">
              {{ models.from_business ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Nombre del negocio
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.from_business_name ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Hasta negocio</p>
            <p class="text-weight-medium no-margin">
              {{ models.to_business ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Nombre del negocio
            </p>
            <p class="text-weight-medium no-margin">
              {{ models.to_business_name ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Desde solicitud</p>
            <p class="text-weight-medium no-margin">
              {{ models.from_request ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Hasta solicitud</p>
            <p class="text-weight-medium no-margin">
              {{ models.to_request ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Monto desde</p>
            <p class="text-weight-medium no-margin">
              {{ models.amount_from ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Monto hasta</p>
            <p class="text-weight-medium no-margin">
              {{ models.amount_to ?? 'No registrado' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">Estado solicitud</p>
            <p class="text-weight-medium no-margin">
              <ShowStatus
                :type="models.request_status_id ?? 1"
                selection="multiple"
                status-type="accountsPayable"
                class-custom="q-px-sm q-py-xs"
              />
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <div class="text-black-90">
            <p class="text-weight-bold no-margin ellipsis">
              Estado autorización
            </p>
            <p class="text-weight-medium no-margin">
              <ShowStatus
                :type="models.authorization_status_id ?? 1"
                selection="multiple"
                status-type="accountsPayable"
                class-custom="q-px-sm q-py-xs"
              />
            </p>
          </div>
        </div>
      </div>
    </section>

    <q-separator class="q-my-lg" />

    <section>
      <TableList
        :title="paymentDetailTable.title"
        :loading="paymentDetailTable.loading"
        :columns="paymentDetailTable.columns"
        :rows="paymentDetailTable.rows"
        :hide-pagination="true"
      />
    </section>

    <q-separator class="q-my-lg" />

    <section>
      <TableList
        :title="instructionsTableProps.title"
        :loading="instructionsTableProps.loading"
        :columns="instructionsTableProps.columns"
        :rows="instructionsTableProps.rows"
        :custom-columns="['instruction_status']"
        hide-pagination
      >
        <template #instruction_status="{ row }">
          <ShowStatus
            :type="row.instruction_status_id ?? 1"
            selection="multiple"
            status-type="accountsPayable"
          />
        </template>
      </TableList>
    </section>

    <template v-if="showLiquidation">
      <q-separator class="q-my-lg" />

      <section>
        <TableList
          :title="liquidationTableProps.title"
          :loading="liquidationTableProps.loading"
          :columns="liquidationTableProps.columns"
          :rows="liquidationTableProps.rows"
          hide-pagination
          customNoDataMessageTitle="No hay liquidaciones"
          customNoDataMessageSubtitle="Aquí visualizará la liquidación"
        />

        <div class="row justify-end q-mt-md">
          <Button
            label="Rechazar"
            size="md"
            unelevated
            :outline="true"
            color="orange"
            class="text-capitalize btn-filter custom q-mr-md"
            :left-icon="defaultIconsLucide.xCircle"
            @click="handleOpenModal('reject')"
          />
          <Button
            label="Autorizar"
            size="md"
            unelevated
            :outline="false"
            color="orange"
            class="text-capitalize btn-filter custom"
            :left-icon="defaultIconsLucide.checkCircle"
            @click="handleOpenModal('authorize')"
          />
        </div>
      </section>
    </template>

    <AlertModalComponent
      ref="alertModalRef"
      styleModal="min-width: 470px"
      :showImgDefault="false"
      :title="alertModalConfig.description"
      :textBtnConfirm="alertModalConfig.textBtnConfirm"
      :textBtnCancel="alertModalConfig.textBtnCancel"
      @confirm="handleConfirmAction()"
    >
      <template #default-img>
        <q-img
          src="@/assets/images/icons/alert_popup.svg"
          max-width="80px"
          width="80px"
          fit="contain"
          alt="Imagen de alerta"
        />
      </template>
    </AlertModalComponent>
  </q-form>
</template>

<script setup lang="ts">
// components
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// interfaces
import { ActionType } from '@/interfaces/global'
import {
  IFirstAuthorizationBasicData,
  IPaymentDetail,
  IPaymentInstruction,
  ILiquidation,
} from '@/interfaces/customs/accounts-payable/FirstAuthorizationTaxSettlement'

// logic view
import useBasicDataView from '@/components/Forms/AccountsPayable/FirstAuthorizationTaxSettlement/BasicDataView'

const props = withDefaults(
  defineProps<{
    action: ActionType
    data?: IFirstAuthorizationBasicData | null
    paymentDetails?: IPaymentDetail[]
    paymentInstructions?: IPaymentInstruction[]
    paymentLiquidations?: ILiquidation[]
  }>(),
  {}
)

const emit = defineEmits<{
  reload: []
}>()

const {
  basicDataFormRef,
  models,
  paymentDetailTable,
  instructionsTableProps,
  liquidationTableProps,
  showLiquidation,
  alertModalRef,
  alertModalConfig,
  handleOpenModal,
  handleConfirmAction,
  defaultIconsLucide,
} = useBasicDataView(props, emit)

defineExpose({
  validateForm: () => basicDataFormRef.value?.validate(),
})
</script>
