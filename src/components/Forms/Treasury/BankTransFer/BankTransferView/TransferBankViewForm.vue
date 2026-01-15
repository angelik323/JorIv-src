<template>
  <q-card-section>
    <q-card-section>
      <div class="row q-col-gutter-md">
        <div class="col-xs-12 col-sm-6 col-md-3">
          <GenericDate
            :label="'Fecha*'"
            :default_value="formFilterInitial?.date"
            :mask="'YYYY-MM-DD'"
            :required="true"
            :disabled="true"
            :placeholder="'Inserte una fecha'"
            :rules="[]"
          />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-3">
          <GenericInput
            label="Oficina"
            :required="true"
            type="text"
            :disabled="true"
            :default_value="formFilterInitial?.office_label"
            :rules="[]"
          />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-3">
          <GenericInput
            label="Nombre oficina"
            :required="true"
            type="text"
            :disabled="true"
            :default_value="formFilterInitial?.name_office"
            :rules="[]"
          />
        </div>

        <div class="col-xs-12 col-sm-6 col-md-3">
          <GenericInput
            label="Observaciones"
            :required="true"
            type="text"
            :disabled="true"
            :default_value="formFilterInitial?.observations"
            :rules="[]"
          />
        </div>
      </div>
    </q-card-section>
    <q-card-actions align="right">
      <Button
        :outline="false"
        label="Confirmar"
        color-icon="#FFFFFF"
        :disabled="false"
        @click="openTransferConfirmModal"
      />
    </q-card-actions>
  </q-card-section>

  <q-card-section>
    <TableList
      :title="tableOriginProps.title"
      :loading="tableOriginProps.loading"
      :columns="tableOriginProps.columns"
      :rows="tableOriginProps.rows"
      :pages="tableOriginProps.pages"
      :custom-columns="['actions', 'status']"
    >
      <template #actions>
        <Button
          outline
          flat
          rounded
          color="orange"
          :left-icon="defaultIconsLucide.eye"
          class-custom="custom"
          @click="showTransferDetail(true, 'origin')"
          tooltip="Ver"
        />
        <Button
          :left-icon="defaultIconsLucide.edit"
          color="orange"
          class-custom="custom"
          :outline="false"
          :flat="true"
          tooltip="Editar"
          @click="updateTransferBankTab('origin-data')"
        />
      </template>
    </TableList>
    <VCard v-if="showOrigin">
      <template #content-card>
        <q-card-section>
          <ViewInfo
            title="Ver origen"
            :info="showConvertToInfo(tableDestinyProps.columns, getInfoOrigin)"
          />
        </q-card-section>
      </template>
    </VCard>
  </q-card-section>

  <q-card-section>
    <TableList
      :title="tableDestinyProps.title"
      :loading="tableDestinyProps.loading"
      :columns="tableDestinyProps.columns"
      :rows="tableDestinyProps.rows"
      :pages="tableDestinyProps.pages"
      :custom-columns="['actions', 'status']"
    >
      <template #actions>
        <Button
          outline
          flat
          rounded
          color="orange"
          :left-icon="defaultIconsLucide.eye"
          class-custom="custom"
          @click="showTransferDetail(true, 'destiny')"
          tooltip="Ver"
        />
        <Button
          :left-icon="defaultIconsLucide.edit"
          color="orange"
          class-custom="custom"
          :outline="false"
          :flat="true"
          tooltip="Editar"
          @click="updateTransferBankTab('destiny-data')"
        />
      </template>
    </TableList>
    <VCard v-if="showDestiny">
      <template #content-card>
        <q-card-section>
          <ViewInfo
            title="Ver destino"
            :info="showConvertToInfo(tableDestinyProps.columns, getInfoDestiny)"
          />
        </q-card-section>
      </template>
    </VCard>
  </q-card-section>
  <q-card-section>
    <div class="row justify-end q-col-gutter-lg">
      <div class="col-auto">
        <Button
          outline
          label="Reiniciar"
          size="md"
          unelevated
          color="orange"
          class="text-capitalize btn-filter custom"
          @click="resetFullBankTraslate"
        />
      </div>
      <div class="col-auto">
        <Button
          :outline="false"
          label="Confirmar"
          size="md"
          unelevated
          color="orange"
          @click="openTransferConfirmModal()"
        />
      </div>
    </div>
    <InfoModal
      ref="alertTransferConfirmlRef"
      styleModal="min-width: 470px"
      :title="alertConfirmConfig.title"
      :description_message="alertConfirmConfig.description"
      :textBtnConfirm="alertConfirmConfig.btnLabel"
      :show-btn-confirm="false"
      :showCloseBtn="true"
      :showBtnCancel="false"
    >
      <template #default-body> </template>
      <template #custom-actions>
        <Button
          outline
          label="Cancelar"
          size="md"
          unelevated
          color="orange"
          class="text-capitalize btn-filter custom"
          @click="closeTransferConfirmModal"
        />
        <Button
          :outline="false"
          label="Confirmar"
          size="md"
          unelevated
          color="orange"
          @click="
            createBankBankTransfer(
              formCreateAndUpdateOrigin,
              formCreateAndUpdateDestiny
            )
          "
        />
      </template>
    </InfoModal>
  </q-card-section>
</template>
<script lang="ts" setup>
import useTransferBankViewForm from '@/components/Forms/Treasury/BankTransFer/BankTransferView/TransferBankViewForm'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericDate from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import ViewInfo from '@/components/showViewInfo/ShowViewInfo.vue'
import InfoModal from '@/components/common/AlertModal/AlertModalComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import TableList from '@/components/table-list/TableList.vue'

const {
  tableOriginProps,
  tableDestinyProps,
  defaultIconsLucide,
  alertTransferConfirmlRef,
  alertConfirmConfig,
  formFilterInitial,
  getInfoDestiny,
  getInfoOrigin,
  showOrigin,
  showDestiny,
  formCreateAndUpdateOrigin,
  formCreateAndUpdateDestiny,
  createBankBankTransfer,
  showTransferDetail,
  openTransferConfirmModal,
  closeTransferConfirmModal,
  updateTransferBankTab,
  showConvertToInfo,
  resetFullBankTraslate,
} = useTransferBankViewForm()
</script>
