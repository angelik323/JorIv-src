<template>
  <q-card-section v-if="!showAmortizationData">
    <LoaderComponet />
  </q-card-section>
  <q-card-section v-else>
    <q-form>
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div
            class="col-12"
            v-if="getUrlPath === '/negocios-fiduciarios/tablas-de-amortizacion'"
          >
            <div class="row q-col-gutter-md justify-end">
              <div class="col-auto">
                <Button
                  :outline="false"
                  label="Ver tabla de amortización"
                  color="orange"
                  class-custom="custom"
                  :disabled="
                    !showInfoUpdate(
                      obligationSelected,
                      amortizationBusinessInfo.options
                    ).file
                  "
                  @click="handlerShowViewerFile(obligationSelected)"
                />
              </div>

              <div class="col-auto">
                <Button
                  outline
                  label="Descargar"
                  size="md"
                  unelevated
                  color="orange"
                  class-custom="custom"
                  :disabled="
                    !showInfoUpdate(
                      obligationSelected,
                      amortizationBusinessInfo.options
                    ).file
                  "
                  @click="loadDocumentPDF(obligationSelected)"
                />
              </div>
              <div class="col-auto">
                <Button
                  :outline="false"
                  label="Crear plan de pagos"
                  color-icon="#FFFFFF"
                  :disabled="
                    validateFileAndPlan(
                      obligationSelected,
                      amortizationBusinessInfo.options
                    )
                  "
                  @click="
                    openAmortizationCreateModal(
                      obligationSelected,
                      'financial-plan/create'
                    )
                  "
                />
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
            <GenericInput
              label="Nombre de negocio"
              :required="true"
              :disabled="true"
              :default_value="amortizationBusinessInfo.businessName"
              :rules="[]"
              @update:model-value="
                amortizationBusinessInfo.businessName = $event
              "
            />
          </div>
        </div>
        <div class="row q-col-gutter-md">
          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
            <GenericSelector
              label="Número de obligación financiera"
              auto_complete
              first_filter_option="label"
              second_filter_option="value"
              :manual_option="amortizationBusinessInfo.options"
              :map_options="true"
              :disabled="
                loadAutoUpdate(amortizationBusinessInfo.options.length)
              "
              :required="true"
              :default_value="obligationSelected"
              @update:modelValue="obligationSelected = $event"
              :rules="[]"
            />
          </div>

          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
            <CurrencyInput
              v-model="
                showInfoUpdate(
                  obligationSelected,
                  amortizationBusinessInfo.options
                ).creditAmount
              "
              :currency="'COP'"
              :disabled="true"
              :placeholder="'Ingrese un valor'"
              currencyLabel="Valor del crédito"
              :rules="[]"
            />
          </div>

          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
            <GenericInput
              label="Plazo"
              type="number"
              :required="true"
              :disabled="true"
              :default_value="
                showInfoUpdate(
                  obligationSelected,
                  amortizationBusinessInfo.options
                ).paymentQuotas
              "
              :rules="[]"
            />
          </div>

          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
            <GenericInput
              label="Tasa(%)"
              :required="true"
              type="text"
              :disabled="true"
              :default_value="
                showInfoUpdate(
                  obligationSelected,
                  amortizationBusinessInfo.options
                ).interestRate
              "
              :rules="[]"
            />
          </div>
        </div>
        <q-card-section v-if="props.action === 'create'">
          <div class="row justify-center">
            <div class="col-12">
              <UploadFile
                ref="attachDocumentRef"
                :title="uploadProps.title"
                :styles-customs="uploadProps.styleCustom"
                :multiple-files="uploadProps.multiple"
                :label-upload-btn="uploadProps.labelBtn"
                :bordered="uploadProps.bordered"
                :accept="uploadProps.accept"
                color-icon="orange"
                @added="addedFiles"
                @rejected="rejectedFiles"
                @removed="deleteFiles"
              />
            </div>
          </div>
        </q-card-section>
      </q-card-section>
      <q-card-section
        v-if="props.action === 'create' && tableProps.rows.length > 0"
      >
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="['actions', 'status']"
          :hide-bottom="true"
        >
          <template #status>
            <ShowStatus :type="29" />
          </template>

          <template #actions>
            <Button
              :left-icon="defaultIconsLucide.trash"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Eliminar'"
              @click="deleteFiles()"
            />
          </template>
        </TableList>
      </q-card-section>

      <q-card-actions
        align="right"
        v-if="props.action !== 'create'"
        class="q-mr-lg"
      >
      </q-card-actions>
      <q-separator inset class="q-my-lg" />
      <q-card-actions align="right" v-if="props.action === 'create'">
        <Button
          :outline="false"
          label="Crear"
          color-icon="#FFFFFF"
          @click="
            handlerCreateAmortization(
              obligationSelected,
              currentSelectFile,
              props.action
            )
          "
        />
      </q-card-actions>

      <q-card-section
        v-if="props.action !== 'create' && tableProps.rows.length > 0"
      >
        <div class="q-mx-md">
          <FinancialPlanningForm
            :obligationSelected="getActions.id"
            :hasPlan="
              availableCreatePlanning(
                showInfoUpdate(
                  obligationSelected,
                  amortizationBusinessInfo.options
                ).financialPlanning,
                obligationSelected
              )
            "
            :businessCode="amortizationBusinessInfo"
            :action="getActions.type"
          />
        </div>
      </q-card-section>
    </q-form>
  </q-card-section>

  <ViewFile ref="viewerFileComponentRef" />
</template>

<script setup lang="ts">
// components
import GenericSelector from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'

import LoaderComponet from '@/components/ShowEmptyScreen/ShowEmptyScreen.vue'
import TableList from '@/components/table-list/TableList.vue'
import UploadFile from '@/components/common/UploadFile/UploadFile.vue'
import ViewFile from '@/components/ViewFile/ViewFile.vue'
import FinancialPlanningForm from '@/components/Forms/FinancialObligations/AmortizationForms/FinancialPlanning/FinancialPlanningForm.vue'

import ShowStatus from '@/components/showStatus/ShowStatus.vue'

import Button from '@/components/common/Button/Button.vue'

import { ISelectorAddTypes } from '@/interfaces/customs'

import useAmortizationBasicForm from '@/components/Forms/FinancialObligations/AmortizationForms/BasicForm/AmortizationBasicForm'

const props = withDefaults(
  defineProps<{
    action: ISelectorAddTypes
  }>(),
  {
    action: 'default',
  }
)

const {
  amortizationBusinessInfo,
  obligationSelected,
  tableProps,
  showAmortizationData,
  currentSelectFile,
  attachDocumentRef,
  defaultIconsLucide,
  uploadProps,
  viewerFileComponentRef,
  getActions,
  getUrlPath,
  showInfoUpdate,
  handlerCreateAmortization,
  addedFiles,
  rejectedFiles,
  deleteFiles,
  loadDocumentPDF,
  handlerShowViewerFile,
  openAmortizationCreateModal,
  availableCreatePlanning,
  loadAutoUpdate,
  validateFileAndPlan,
} = useAmortizationBasicForm()
</script>
