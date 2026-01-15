<template>
  <div class="q-mx-xl">
    <q-form ref="SeizuresFormRef" class="q-mt-lg">
      <div class="row q-col-gutter-lg">
        <div class="col-12 col-md-3">
          <GenericInputComponent
            v-if="action !== 'view'"
            label="Número de proceso"
            :default_value="formData.process_number"
            :required="true"
            :disabled="isEditMode"
            @update:model-value="formData.process_number = $event"
          />

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Número de proceso</p>
            <p class="text-weight-medium no-margin">
              {{ formData.process_number ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericInputComponent
            v-if="action !== 'view'"
            label="Número oficio de embargo"
            :default_value="formData.order_number"
            :required="true"
            :rules="[
      (val: string) =>
        useRules().is_required(
          val,
          'El número de oficio de embargo es requerido'
        ),
    ]"
            @update:model-value="formData.order_number = $event"
          />

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Número oficio de embargo</p>
            <p class="text-weight-medium no-margin">
              {{ formData.order_number ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="action !== 'view'"
            label="Juzgado / profiere embargo"
            :manual_option="courst"
            map_options
            display_label="name"
            display_value="id"
            :default_value="formData.court_id"
            :required="true"
            :rules="[
      (val: number | null | undefined) =>
        useRules().is_required(
          val ? String(val) : '',
          'El juzgado es requerido'
        ),
    ]"
            @update:modelValue="formData.court_id = $event"
          />

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Juzgado / profiere embargo</p>
            <p class="text-weight-medium no-margin">
              {{ courst.find((c) => c.id === formData.court_id)?.name ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="action !== 'view'"
            label="Tipo de demandado"
            :manual_option="type_defendants"
            map_options
            display_label="name"
            display_value="id"
            :default_value="formData.type_defendant_id"
            :required="true"
            :rules="[
      (val: number | null | undefined) =>
        useRules().is_required(
          val ? String(val) : '',
          'El tipo de demandado es requerido'
        ),
    ]"
            :disabled="isEditMode"
            @update:modelValue="formData.type_defendant_id = $event"
          />

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tipo de demandado</p>
            <p class="text-weight-medium no-margin">
              {{
                type_defendants.find((t) => t.id === formData.type_defendant_id)
                  ?.name ?? '-'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            v-if="action !== 'view'"
            label="Demandante"
            :manual_option="third_parties"
            map_options
            :default_value="formData.claimant_object"
            :required="true"
            :rules="[
      (val: string) =>
        useRules().is_required(val, 'El demandante es requerido'),
    ]"
            return_object
            :disabled="isEditMode"
            @update:modelValue="formData.claimant_object = $event"
          />

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Demandante</p>
            <p class="text-weight-medium no-margin">
              {{
                formData.claimant_object?.label ??
                formData.claimant_object?.name ??
                '-'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <GenericSelectorComponent
            v-if="action !== 'view'"
            label="Demandado"
            :manual_option="defendantOptions"
            map_options
            :default_value="formData.defendant_object"
            :required="true"
            :rules="[
      (val: string) =>
        useRules().is_required(val, 'El demandado es requerido'),
    ]"
            return_object
            :disabled="isDefendantDisabled"
            @update:modelValue="formData.defendant_object = $event"
          />

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Demandado</p>
            <p class="text-weight-medium no-margin">
              {{
                formData.defendant_object?.label ??
                formData.defendant_object?.name ??
                '-'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <RadioYesNo
            has-title
            title="¿Con negocio asignado?"
            :model-value="formData.has_assigned_business"
            :is-disabled="isViewMode"
            @update:modelValue="
              formData.has_assigned_business = $event === true || $event === 1
            "
          />
        </div>

        <div v-if="showBusinessField" class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="action !== 'view'"
            label="Negocio"
            :manual_option="business_trusts_participants_for_business"
            map_options
            :default_value="formData.business_trusts_object || ''"
            :required="true"
            :rules="[
      (val: string) =>
        useRules().is_required(val, 'El negocio es requerido'),
    ]"
            return_object
            :disabled="isBusinessDisabled"
            @update:modelValue="
              (val) => {
                formData.business_trusts_object = val
                updateBankAccountByBussinesId()
              }
            "
          />

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Negocio</p>
            <p class="text-weight-medium no-margin">
              {{
                formData.business_trusts_object?.label ??
                formData.business_trusts_object?.name ??
                '-'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericDateInput
            v-if="action !== 'view'"
            label="Fecha del oficio"
            :default_value="formData.order_date"
            :rules="[
      (val: string) =>
        useRules().is_required(val, 'La fecha de oficio es requerida'),
      (val: string) =>
        useRules().date_before_or_equal_to_the_current_date(val),
      (val: string) =>
        useRules().date_after_or_equal_to_specific_date(
          val,
          formData.order_date,
          'fecha del oficio'
        ),
      (val: string) =>
        useRules().date_before_or_equal_to_the_specific_date(
          val,
          formData.seizure_date ?? val,
          'La fecha de oficio no puede ser mayor a la fecha del embargo'
        ),
    ]"
            @update:modelValue="formData.order_date = $event"
          />

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Fecha del oficio</p>
            <p class="text-weight-medium no-margin">
              {{ formData.order_date ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericDateInput
            v-if="action !== 'view'"
            label="Fecha de conocimiento"
            :default_value="formData.awareness_date"
            :rules="[
      (val: string) =>
        useRules().is_required(val, 'La fecha de conocimiento es requerida'),
      (val: string) =>
        useRules().date_before_or_equal_to_the_current_date(val),
      (val: string) =>
        useRules().date_after_or_equal_to_specific_date(
          val,
          formData.order_date,
          'fecha de conocimiento'
        ),
      (val: string) =>
        useRules().date_before_or_equal_to_the_specific_date(
          val,
          formData.seizure_date ?? val,
          'La fecha de conocimiento no puede ser mayor a la fecha del embargo'
        ),
    ]"
            @update:modelValue="formData.awareness_date = $event"
          />

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Fecha de conocimiento</p>
            <p class="text-weight-medium no-margin">
              {{ formData.awareness_date ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericDateInput
            v-if="action !== 'view'"
            label="Fecha del embargo"
            :default_value="formData.seizure_date"
            disabled
            :rules="[
      (val: string) =>
        useRules().is_required(val, 'La fecha del embargo es requerida'),
    ]"
          />

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Fecha del embargo</p>
            <p class="text-weight-medium no-margin">
              {{ formData.seizure_date ?? '-' }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            v-if="action !== 'view'"
            v-model="formData.value_seizure"
            label="Valor del embargo/cuenta"
            currency="COP"
            :rules="[
      (val: string) =>
        useRules().is_required(val, 'El valor del embargo es requerido'),
    ]"
            :required="true"
            :hideIcon="true"
          />

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Valor del embargo/cuenta</p>
            <p class="text-weight-medium no-margin">
              {{
                formData.value_seizure !== null
                  ? formatCurrency(formData.value_seizure)
                  : '-'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <CurrencyInput
            v-if="action !== 'view'"
            v-model="formData.active_seizure_total"
            label="Total embargos activos"
            currency="COP"
            disabled
            :hideIcon="true"
          />

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Total embargos activos</p>
            <p class="text-weight-medium no-margin">
              {{ formatCurrency(formData.active_seizure_total ?? 0) }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="action !== 'view'"
            label="Ciudad del embargo"
            :manual_option="cities"
            map_options
            :default_value="formData.city_object"
            return_object
            :required="true"
            :rules="[
      (val: string) =>
        useRules().is_required(val, 'La ciudad del embargo es requerida'),
    ]"
            @update:modelValue="formData.city_object = $event"
          />

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Ciudad del embargo</p>
            <p class="text-weight-medium no-margin">
              {{
                formData.city_object?.label ?? formData.city_object?.name ?? '-'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <GenericSelectorComponent
            v-if="action !== 'view'"
            label="Área responsable de gestión"
            :manual_option="management_areas"
            map_options
            :default_value="formData.management_area_id"
            :required="true"
            :rules="[]"
            @update:modelValue="formData.management_area_id = $event"
          />

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">
              Área responsable de gestión
            </p>
            <p class="text-weight-medium no-margin">
              {{
                management_areas.find(
                  (m) => m.id === formData.management_area_id
                )?.label ??
                management_areas.find(
                  (m) => m.id === formData.management_area_id
                )?.name ??
                '-'
              }}
            </p>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <template v-if="action === 'create'">
            <GenericInputComponent
              label="Estado"
              default_value="Registrado"
              disabled
            />
          </template>

          <template v-else-if="action === 'edit'">
            <GenericSelectorComponent
              label="Estado"
              :manual_option="seizure_status"
              map_options
              display_label="status"
              display_value="id"
              :rules="[]"
              :required="true"
              :default_value="formData.status_id"
              :disabled="true"
            />
          </template>

          <template v-else>
            <div class="text-black-90">
              <p class="text-weight-bold no-margin">Estado</p>
              <p class="text-weight-medium no-margin">
                {{
                  seizure_status.find((s) => s.id === formData.status_id)
                    ?.status ?? 'Registrado'
                }}
              </p>
            </div>
          </template>
        </div>

        <div class="col-12 col-md-4">
          <GenericSelectorComponent
            v-if="action !== 'view'"
            label="Tipo de proceso"
            :manual_option="process_types"
            map_options
            :default_value="formData.process_type_id"
            :required="true"
            :rules="[
      (val: string) =>
        useRules().is_required(val, 'El tipo de proceso es requerido'),
    ]"
            :disabled="isEditMode"
            @update:modelValue="formData.process_type_id = $event"
          />

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Tipo de proceso</p>
            <p class="text-weight-medium no-margin">
              {{
                process_types.find((p) => p.id === formData.process_type_id)
                  ?.label ??
                process_types.find((p) => p.id === formData.process_type_id)
                  ?.name ??
                '-'
              }}
            </p>
          </div>
        </div>
        <div class="col-12 col-md-3">
          <GenericFileInputComponent
            v-if="!isViewMode"
            label="Oficio"
            accept=".pdf"
            :multiple="false"
            placeholder="Adjuntar"
            :default_value="null"
            @update:modelValue="handleDocumentChange"
          >
            <template #after>
              <Icon name="CloudUpload" :size="24" class="opacity-70" />
            </template>
          </GenericFileInputComponent>

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Oficio</p>

            <div
              v-if="hasDownloadableAttachment"
              class="row items-center cursor-pointer text-primary"
              @click="handleDownload"
            >
              <span>Descargar</span>
              <Icon name="CloudDownload" :size="18" class="q-ml-sm" />
            </div>

            <p v-else class="text-grey-6 no-margin">No hay documento adjunto</p>
          </div>
        </div>

        <div class="col-12">
          <GenericInputComponent
            v-if="action !== 'view'"
            label="Observaciones"
            type="textarea"
            :default_value="formData.observations"
            :disabled="isViewMode"
            @update:model-value="formData.observations = $event"
          />

          <div v-else class="text-black-90">
            <p class="text-weight-bold no-margin">Observaciones</p>
            <p class="text-weight-medium no-margin">
              {{ formData.observations ?? '-' }}
            </p>
          </div>
        </div>
      </div>

      <q-separator v-if="showAssetsSection" class="q-my-xl" />

      <div
        v-if="showAssetsSection"
        class="row items-center justify-between q-mb-md"
      >
        <div class="col-auto">
          <p class="text-black text-weight-bold text-h6 q-mb-none">
            Bienes embargados
          </p>
        </div>

        <div class="col-auto">
          <Button
            v-if="!isViewMode"
            label="Agregar"
            :outline="false"
            :left-icon="defaultIconsLucide.plusCircleOutline"
            color="primary"
            color-icon="white"
            @click="openAssetModal"
          />
        </div>
      </div>

      <TableList
        v-if="showAssetsSection"
        :rows="tableAssets.rows"
        :loading="false"
        :columns="tableAssets.columns"
        :pages="assetsPagination"
        :custom-columns="['actions']"
        @update-page="updateAssetsPage"
        @update-rows-per-page="updateAssetsRows"
      >
        <template #actions="{ row, index }">
          <Button
            v-if="
              isViewMode &&
              row.asset_type === 2 &&
              row.seizure_assets_products_type_id === 3
            "
            :left-icon="defaultIconsLucide.eye"
            color="orange"
            flat
            outline
            tooltip="Ver"
            @click="openBankContactsModal(row)"
          />

          <Button
            v-else-if="!isViewMode"
            :left-icon="defaultIconsLucide.trash"
            color="orange"
            flat
            outline
            tooltip="Eliminar"
            @click="removeAsset(index)"
          />
        </template>
      </TableList>
    </q-form>

    <AlertModalComponent
      v-model="isModalOpen"
      titleHeader="Bien a embargar"
      styleModal="width: 700px; max-width: 90vw"
      persistent
      :showImgDefault="false"
      :showBtnConfirm="true"
      :showBtnCancel="true"
      textBtnConfirm="Aceptar"
      textBtnCancel="Cancelar"
      classTitle="mt-0"
      marginTopBody="mt-0"
      @confirm="handleConfirmAsset"
      @close="closeAssetModal"
    >
      <template #default-body>
        <q-form ref="modalFormRef" @submit.prevent="saveAsset">
          <section class="q-pa-md">
            <div class="row q-col-gutter-md q-mb-md">
              <div class="col-12">
                <GenericSelectorComponent
                  label="Tipo de bien"
                  :manual_option="typeOfAssetOptions"
                  map_options
                  :default_value="modalForm.type_of_asset"
                  :required="true"
                  :rules="[
                (val: string) =>
                  useRules().is_required(val, 'El tipo de bien es requerido'),
              ]"
                  @update:modelValue="modalForm.type_of_asset = $event"
                />
              </div>

              <div
                class="col-12 col-md-12"
                v-if="modalForm.type_of_asset === 2"
              >
                <GenericSelectorComponent
                  label="Tipo de producto"
                  :manual_option="seizureAssetsProductsTypesFiltered"
                  map_options
                  :default_value="modalForm.seizure_assets_products_type_id"
                  :required="true"
                  :rules="[
                (val: string) =>
                  useRules().is_required(
                    val,
                    'El tipo de producto es requerido'
                  ),
              ]"
                  @update:modelValue="
                    modalForm.seizure_assets_products_type_id = $event
                  "
                />
              </div>
            </div>

            <template v-if="modalForm.type_of_asset === 1">
              <div class="row q-mb-md">
                <div class="col-12">
                  <GenericSelectorComponent
                    label="Activo fijo"
                    :manual_option="fixed_assets"
                    map_options
                    :default_value="modalForm.active_fixed_id"
                    return_object
                    :required="true"
                    :rules="[
                  (val: string) =>
                    useRules().is_required(
                      val,
                      'El activo fijo es requerido'
                    ),
                ]"
                    @update:modelValue="
                      modalForm.active_fixed_id = $event?.value ?? null
                    "
                  />
                </div>
              </div>

              <div class="row q-mb-md">
                <div class="col-12">
                  <GenericInputComponent
                    label="Folio de matrícula"
                    :default_value="modalForm.folio"
                    disabled
                  />
                </div>
              </div>

              <div class="row q-mb-md">
                <div class="col-12">
                  <CurrencyInput
                    v-model="modalForm.asset_value"
                    label="Valor del bien"
                    currency="COP"
                    disabled
                  />
                </div>
              </div>
            </template>

            <template
              v-if="
                modalForm.type_of_asset === 2 &&
                modalForm.seizure_assets_products_type_id === 2
              "
            >
              <div class="row q-col-gutter-md">
                <div class="col-12">
                  <GenericSelectorComponent
                    label="Producto (FIC)"
                    :manual_option="fiduciary_investment_plans"
                    display_label="label_code_name"
                    display_value="value"
                    map_options
                    :default_value="modalForm.product_id"
                    :required="true"
                    :rules="[
                  (val: string) =>
                    useRules().is_required(
                      val,
                      'El producto (FIC) es requerido'
                    ),
                ]"
                    @update:modelValue="modalForm.product_id = $event"
                  />
                </div>

                <div class="col-12 col-md-12">
                  <CurrencyInput
                    v-model="modalForm.asset_value"
                    label="Saldo al día"
                    currency="COP"
                    disabled
                  />
                </div>
              </div>
            </template>

            <template
              v-if="
                modalForm.type_of_asset === 2 &&
                modalForm.seizure_assets_products_type_id === 3
              "
            >
              <div class="row q-col-gutter-md">
                <div class="col-12">
                  <GenericSelectorComponent
                    label="Cuenta bancaria"
                    :manual_option="bank_accounts_with_name"
                    map_options
                    :default_value="modalForm.product_id"
                    :required="true"
                    :rules="[
                  (val: string) =>
                    useRules().is_required(
                      val,
                      'La cuenta bancaria es requerida'
                    ),
                ]"
                    @update:modelValue="modalForm.product_id = $event"
                  />
                </div>

                <div class="col-12 col-md-12">
                  <CurrencyInput
                    v-model="modalForm.asset_value"
                    label="Saldo"
                    currency="COP"
                    :required="true"
                  />
                </div>
              </div>
            </template>

            <template
              v-if="
                modalForm.type_of_asset === 2 &&
                modalForm.seizure_assets_products_type_id === 4
              "
            >
              <div class="row q-col-gutter-md">
                <div class="col-12">
                  <GenericSelectorComponent
                    label="Fideicomitente"
                    :manual_option="
                      business_trusts_participants_for_third_party
                    "
                    map_options
                    return_object
                    :default_value="modalForm.trustee_id"
                    :required="true"
                    :rules="[
                  (val: string) =>
                    useRules().is_required(
                      val,
                      'El fideicomitente es requerido'
                    ),
                ]"
                    @update:modelValue="
                      (val) => {
                        modalForm.trustee_id = val?.value ?? null
                        modalForm.percentage =
                          val?.percentage_participation ?? 0
                      }
                    "
                  />
                </div>

                <div class="col-12 col-md-12">
                  <GenericInputComponent
                    label="Porcentaje de participación"
                    :default_value="modalForm.percentage + '%'"
                    disabled
                  />
                </div>
              </div>
            </template>
          </section>
        </q-form>
      </template>
    </AlertModalComponent>

    <AlertModalComponent
      v-model="isBankContactsModalOpen"
      titleHeader="Contactos bancarios"
      styleModal="width: 800px; max-width: 95vw"
      :showImgDefault="false"
      :showBtnConfirm="false"
      :showBtnCancel="true"
      textBtnCancel="Cerrar"
      classTitle="mt-0"
      marginTopBody="mt-0"
      @close="isBankContactsModalOpen = false"
    >
      <template #default-body>
        <TableList
          :rows="bankContactsTable.rows"
          :columns="bankContactsTable.columns"
          :loading="bankContactsTable.loading"
          hide-pagination
        />
      </template>
    </AlertModalComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import Icon from '@/components/common/Icon/Icon.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import GenericFileInputComponent from '@/components/common/GenericFileInputComponent/GenericFileInputComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericDateInput from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'
import useSeizuresCreateForm from '@/components/Forms/Seizures/SeizuresForm/SeizuresForm'

// Interfaces - constants
import { ActionType } from '@/interfaces/global'
import { ISeizuresCreateForm } from '@/interfaces/customs/seizures/Seizures'

// Composables
import { useRules } from '@/composables'

const props = defineProps<{
  action: ActionType
  data?: ISeizuresCreateForm
}>()

const handleDownload = () => {
  emit('onDownloadAttachment')
}

const emit = defineEmits<{
  (e: 'update:data', value: ISeizuresCreateForm): void
  (e: 'onDownloadAttachment'): void
}>()

const {
  formData,
  tableAssets,
  third_parties,
  cities,
  isViewMode,
  isEditMode,
  typeOfAssetOptions,
  fixed_assets,
  business_trusts_participants_for_third_party,
  business_trusts_participants_for_business,
  modalForm,
  isModalOpen,
  fiduciary_investment_plans,
  bank_accounts_with_name,
  seizureAssetsProductsTypesFiltered,
  management_areas,
  courst,
  process_types,
  type_defendants,
  seizure_status,
  isBankContactsModalOpen,
  bankContactsTable,
  assetsPagination,
  SeizuresFormRef,
  defaultIconsLucide,
  modalFormRef,
  isDefendantDisabled,
  defendantOptions,
  isBusinessDisabled,
  showBusinessField,
  showAssetsSection,
  hasDownloadableAttachment,
  handleDocumentChange,
  formatCurrency,
  handleConfirmAsset,
  openBankContactsModal,
  openAssetModal,
  closeAssetModal,
  saveAsset,
  removeAsset,
  updateAssetsPage,
  updateAssetsRows,
  updateBankAccountByBussinesId,
} = useSeizuresCreateForm(props, emit)

defineExpose({
  getModels: () => formData.value,
  validateForm: () => SeizuresFormRef.value?.validate(),
})
</script>
