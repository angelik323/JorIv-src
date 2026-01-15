<template>
  <q-form ref="formInformation">
    <section>
      <div class="mx-3 mt-2 mb-3">
        <div class="q-mb-lg">
          <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
            Información general
          </p>
        </div>

        <div class="row q-col-gutter-lg mt-1">
          <div
            class="col-12 col-xs-4 col-md-4"
            v-if="!'create'.includes(props.action)"
          >
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              label="ID Póliza"
              :default_value="models.id"
              type="text"
              :required="false"
              :readonly="isEditableRegistrationStatus"
              :rules="[]"
              @update:modelValue="models.id = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">ID Póliza</p>
              <p class="text-weight-medium no-margin">
                {{ models.id }}
              </p>
            </div>
          </div>
          <div class="col-12 col-xs-4 col-md-4">
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(props.action)"
              :label="`Nombre del negocio`"
              auto_complete
              first_filter_option="label"
              second_filter_option="value"
              :manual_option="business_trusts_with_code"
              :map_options="true"
              :required="true"
              :readonly="isEditableRegistrationStatus"
              :default_value="models.business_trust_id"
              @update:modelValue="models.business_trust_id = $event"
              :rules="[(v: string) => useRules().is_required(v)]"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Nombre del negocio</p>
              <p class="text-weight-medium no-margin">
                {{ models.business_trust_name }}
              </p>
            </div>
          </div>

          <div class="col-12 col-xs-4 col-md-4">
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(props.action)"
              :label="`Tipo de póliza`"
              auto_complete
              first_filter_option="label"
              second_filter_option="value"
              :manual_option="policy_types"
              :map_options="true"
              :required="true"
              :readonly="
                models.record_status_id === TrustBusinessStatusID.AUTHORIZED
              "
              :default_value="models.policy_type"
              @update:modelValue="models.policy_type = $event"
              :rules="[(v: string) => useRules().is_required(v)]"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Tipo de póliza</p>
              <p class="text-weight-medium no-margin">
                {{ models.policy_type }}
              </p>
            </div>
          </div>

          <div class="col-12 col-xs-4 col-md-4">
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              label="N° de póliza"
              :default_value="models.policy_number"
              type="text"
              :required="true"
              :rules="[
                (v: string) =>
                  useRules().is_required(v, 'El número de póliza es requerido'),
                (v: string) => useRules().max_length(v, 15),
                (v: string) => useRules().only_alphanumeric(v),
              ]"
              :readonly="!models.policy_type || isRegistrationStatusEditable"
              @update:modelValue="models.policy_number = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">N° de póliza</p>
              <p class="text-weight-medium no-margin">
                {{ models.policy_number }}
              </p>
            </div>
          </div>

          <div class="col-12 col-xs-4 col-md-4">
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(props.action)"
              :label="`Aseguradora`"
              auto_complete
              first_filter_option="label"
              second_filter_option="value"
              :manual_option="policy_insurers_with_id"
              :map_options="true"
              :required="true"
              :readonly="isRegistrationStatusEditable"
              :default_value="models.insurer_id"
              @update:modelValue="models.insurer_id = $event"
              :rules="[(v: string) => useRules().is_required(v)]"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Aseguradora</p>
              <p class="text-weight-medium no-margin">
                {{ models.insurer_name }}
              </p>
            </div>
          </div>

          <div class="col-12 col-xs-4 col-md-4">
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(props.action)"
              :label="`Tomador`"
              auto_complete
              first_filter_option="label"
              second_filter_option="value"
              :manual_option="business_trust_third_parties"
              :map_options="true"
              :required="true"
              :readonly="isRegistrationStatusEditable"
              :default_value="models.policy_holder_id"
              @update:modelValue="models.policy_holder_id = $event"
              :rules="[
                (v: string) => useRules().is_required(v),
                (v: string) =>
                  useRules().validate_values_not_equal(
                    v,
                    models.beneficiary_id,
                    'Tomador',
                    'beneficiario'
                  ),
              ]"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Tomador</p>
              <p class="text-weight-medium no-margin">
                {{ models.policy_holder_name }}
              </p>
            </div>
          </div>

          <div class="col-12 col-xs-4 col-md-4">
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(props.action)"
              :label="`Beneficiario`"
              auto_complete
              first_filter_option="label"
              second_filter_option="value"
              :manual_option="business_trust_third_parties"
              :map_options="true"
              :required="true"
              :readonly="isRegistrationStatusEditable"
              :default_value="models.beneficiary_id"
              @update:modelValue="models.beneficiary_id = $event"
              :rules="[
                (v: string) => useRules().is_required(v),
                (v: string) =>
                  useRules().validate_values_not_equal(
                    models.policy_holder_id,
                    v,
                    'Beneficiario',
                    'tomador'
                  ),
              ]"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Beneficiario</p>
              <p class="text-weight-medium no-margin">
                {{ models.beneficiary_name }}
              </p>
            </div>
          </div>

          <div class="col-12 col-xs-4 col-md-4">
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(props.action)"
              :label="`Moneda`"
              auto_complete
              first_filter_option="label"
              second_filter_option="value"
              :manual_option="coins"
              :map_options="true"
              :required="true"
              :readonly="isRegistrationStatusEditable"
              :default_value="models.currency_id"
              @update:modelValue="models.currency_id = $event"
              :rules="[(v: string) => useRules().is_required(v)]"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Moneda</p>
              <p class="text-weight-medium no-margin">
                {{ models.currency_name }}
              </p>
            </div>
          </div>

          <div class="col-12 col-xs-4 col-md-4">
            <CurrencyInput
              v-if="['create', 'edit'].includes(action)"
              v-model="models.insured_value"
              label="Valor asegurado"
              :currency="'COP'"
              :placeholder="''"
              :disabled="isRegistrationStatusEditable"
              required
              :rules="[
                (v: string) =>
                  useRules().is_required(v, 'El valor es requerido'),
                (val: string) => useRules().only_positive_value(val),
                (val: string) => useRules().max_length(val, 40),
                (val: string) => useRules().min_length(val, 1),
              ]"
              @update:modelValue="models.insured_value = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Valor asegurado</p>
              <p class="text-weight-medium no-margin">
                {{ formatCurrency(`${models.insured_value}`) }}
              </p>
            </div>
          </div>

          <div class="col-12 col-xs-4 col-md-4">
            <GenericDateInputComponent
              v-if="['create', 'edit'].includes(props.action)"
              label="Fecha de emisión"
              :default_value="models.issue_date"
              :required="true"
              :rules="[
                (v: string) =>
                  useRules().is_required(v, 'La fecha es requerida'),
              ]"
              :option_calendar="emisionDateAllowed"
              :disabled="
                isRegistrationStatusEditable ||
                !['create'].includes(props.action)
              "
              @update:modelValue="models.issue_date = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Fecha de emisión</p>
              <p class="text-weight-medium no-margin">
                {{ models.issue_date }}
              </p>
            </div>
          </div>

          <div class="col-12 col-xs-4 col-md-4">
            <GenericDateInputComponent
              v-if="['create', 'edit'].includes(props.action)"
              label="Fecha inicio de vigencia"
              :default_value="models.effective_start_date"
              :required="true"
              :readonly="!models.issue_date || isRegistrationStatusEditable"
              :rules="[
                (v: string) =>
                  useRules().is_required(v, 'La fecha es requerida'),
              ]"
              :option_calendar="
                useCalendarRules().only_after(models.issue_date ?? '')
              "
              @update:modelValue="models.effective_start_date = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Fecha inicio de vigencia</p>
              <p class="text-weight-medium no-margin">
                {{ models.effective_start_date }}
              </p>
            </div>
          </div>

          <div class="col-12 col-xs-4 col-md-4">
            <GenericDateInputComponent
              v-if="['create', 'edit'].includes(props.action)"
              label="Fecha finalización de vigencia"
              :default_value="models.effective_end_date"
              :required="true"
              :disabled="
                !models.effective_start_date || isRegistrationStatusEditable
              "
              :rules="[
                (v: string) =>
                  useRules().is_required(v, 'La fecha es requerida'),
              ]"
              :option_calendar="
                useCalendarRules().only_after(models.effective_start_date ?? '')
              "
              @update:modelValue="models.effective_end_date = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">
                Fecha finalización de vigencia
              </p>
              <p class="text-weight-medium no-margin">
                {{ models.effective_end_date }}
              </p>
            </div>
          </div>

          <div class="col-12 col-xs-4 col-md-4">
            <CurrencyInput
              v-if="['create', 'edit'].includes(action)"
              v-model="models.premium!"
              label="Prima"
              :currency="'COP'"
              :disabled="isRegistrationStatusEditable"
              :rules="[
                (val: string) => useRules().only_positive_value(val),
                (val: string) => useRules().only_number_with_max_integers_and_decimals_ignore_symbols(val, 30, 2),
                (val: string) => useRules().min_length(val, 1),
              ]"
              @update:modelValue="models.premium = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Prima</p>
              <p class="text-weight-medium no-margin">
                {{ formatCurrency(`${models.premium}`) }}
              </p>
            </div>
          </div>

          <div class="col-12 col-xs-4 col-md-4">
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(props.action)"
              :label="`Forma de pago`"
              auto_complete
              first_filter_option="label"
              second_filter_option="value"
              :manual_option="policy_payment_methods"
              :map_options="true"
              :required="true"
              :readonly="isRegistrationStatusEditable"
              :default_value="models.payment_method"
              @update:modelValue="models.payment_method = $event"
              :rules="[(v: string) => useRules().is_required(v)]"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Forma de pago</p>
              <p class="text-weight-medium no-margin">
                {{ models.payment_method }}
              </p>
            </div>
          </div>

          <div class="col-12 col-xs-4 col-md-4">
            <GenericInput
              v-if="['create', 'edit'].includes(action)"
              label="Contrato asociado"
              :default_value="models.associated_contract"
              type="text"
              :required="true"
              :readonly="isRegistrationStatusEditable"
              :rules="[(v: string) => useRules().is_required(v)]"
              @update:modelValue="models.associated_contract = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Contrato asociado</p>
              <p class="text-weight-medium no-margin">
                {{ models.associated_contract }}
              </p>
            </div>
          </div>

          <div class="col-12 col-xs-4 col-md-4">
            <GenericDateInputComponent
              v-if="['create', 'edit'].includes(action)"
              label="Fecha de registro"
              :default_value="models.created_date"
              :required="false"
              :disabled="true"
              :rules="[]"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Fecha de registro</p>
              <p class="text-weight-medium no-margin">
                {{ models.created_date }}
              </p>
            </div>
          </div>
          <div class="col-12 col-xs-4 col-md-4">
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              label="Estado del registro"
              :manual_option="policies_record_status"
              :map_options="false"
              :required="true"
              :default_value="models.record_status_id"
              :auto_complete="false"
              :clearable="false"
              :readonly="true"
              :rules="[(val: string) => useRules().is_required(val)]"
              @update:modelValue="models.record_status_id = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Estado del registro</p>
              <p class="text-weight-medium no-margin">
                <ShowStatus :type="Number(models.record_status_id ?? 0)" />
              </p>
            </div>
          </div>

          <div class="col-12 col-xs-4 col-md-4">
            <GenericSelectorComponent
              v-if="['create', 'edit'].includes(action)"
              label=" Estado de la póliza"
              :manual_option="policies_status"
              :map_options="false"
              :required="true"
              :default_value="models?.policy_status_id"
              :auto_complete="false"
              :clearable="false"
              :readonly="
                models.record_status_id !== TrustBusinessStatusID.AUTHORIZED
              "
              :placeholder="'Seleccione'"
              :rules="[(val: string) => useRules().is_required(val)]"
              @update:modelValue="models.policy_status_id = $event"
            />
            <div v-else class="text-black-90">
              <p class="text-weight-bold no-margin">Estado de la póliza</p>
              <p class="text-weight-medium no-margin">
                <ShowStatus :type="Number(models.policy_status_id ?? 0)" />
              </p>
            </div>
          </div>

          <div class="col-12">
            <GenericInput
              :readonly="
                ['view', 'authorize'].includes(action) ||
                isRegistrationStatusEditable
              "
              label="Observaciones"
              :default_value="models.observations"
              type="textarea"
              :required="!'view'.includes(action)"
              :rules="
                !'view'.includes(action)
                  ? [
                      (val: string) =>
                        useRules().is_required(
                          val,
                          'Las observaciones son requeridas'
                        ),
                      (val: string) => useRules().min_length(val, 20),
                      (val: string) => useRules().max_length(val, 200),
                    ]
                  : []
              "
              @update:modelValue="models.observations = $event"
            />
          </div>
        </div>
        <q-separator class="mt-2"></q-separator>
      </div>
    </section>
  </q-form>

  <div class="mx-3 mt-2 mb-3">
    <div class="q-mb-lg">
      <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
        Soporte documental
      </p>
    </div>
    <UploadFile
      v-if="
        !['view', 'authorize'].includes(props.action) &&
        models.documents?.length === 0
      "
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

    <TableList
      v-else
      :loading="tableProps.loading"
      :columns="tableProps.columns"
      :rows="tableProps.rows"
      :pages="tableProps.pages"
      :custom-columns="['actions', 'status_id', 'name']"
      :hide-bottom="true"
    >
      <template #name="{ row }">
        <div class="q-pa-md row items-center justify-center">
          <img
            class="image-excel q-mr-sm"
            src="@/assets/images/pdf.svg"
            alt="Pdf Icon"
          />
          {{ row.name }}
        </div>
      </template>

      <template #status_id="{ row }">
        <div class="q-pa-md row items-center justify-center">
          <ShowStatus :type="Number(row?.status_id ?? 20)" />
        </div>
      </template>

      <template #actions="{ row }">
        <!-- Eliminar archivo -->
        <Button
          v-if="['create', 'edit'].includes(props.action)"
          :left-icon="defaultIconsLucide.trash"
          color="orange"
          :class-custom="'custom'"
          :outline="false"
          :flat="true"
          colorIcon="#f45100"
          :tooltip="'Eliminar'"
          :disabled="models.record_status_id === 71"
          @click="openAlertModal(row)"
        />
        <!-- Descargar archivo -->
        <Button
          v-if="!['create', 'edit'].includes(props.action)"
          :left-icon="defaultIconsLucide.download"
          color="orange"
          :class-custom="'custom'"
          :outline="false"
          :flat="true"
          colorIcon="#f45100"
          :tooltip="'Descargar'"
          @click="downloadFileS3(row)"
        />
      </template>
    </TableList>
  </div>

  <AlertModalComponent
    ref="alertModalRef"
    styleModal="min-width: 480px"
    title="¿Desea eliminar el documento?"
    @confirm="changeStatusAction"
  >
  </AlertModalComponent>
</template>

<script setup lang="ts">
// components
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import UploadFile from '@/components/common/UploadFile/UploadFile.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// logic
import useInformationForm from './InformationForm'

// interfaces
import { IPolicyResponse } from '@/interfaces/customs'

// composables
import { useRules, useCalendarRules, useUtils } from '@/composables'
const formatCurrency = useUtils().formatCurrency

// utils
import { defaultIconsLucide } from '@/utils'

const props = withDefaults(
  defineProps<{
    action: 'create' | 'edit' | 'view' | 'authorize'
    data?: IPolicyResponse | null
  }>(),
  {}
)

const emits = defineEmits(['validate:form'])

const {
  uploadProps,
  attachDocumentRef,
  tableProps,
  formInformation,
  models,
  business_trusts_with_code,
  policy_types,
  business_trust_third_parties,
  policy_payment_methods,
  coins,
  policy_insurers_with_id,
  policies_record_status,
  policies_status,
  isEditableRegistrationStatus,
  isRegistrationStatusEditable,
  TrustBusinessStatusID,
  alertModalRef,

  addedFiles,
  rejectedFiles,
  deleteFiles,
  downloadFileS3,
  emisionDateAllowed,
  openAlertModal,
  changeStatusAction,
} = useInformationForm(props)

defineExpose({
  validateForm: () => formInformation.value?.validate(),
})
</script>
