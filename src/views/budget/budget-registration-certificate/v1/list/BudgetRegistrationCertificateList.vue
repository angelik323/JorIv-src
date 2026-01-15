<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
    >
      <VCard>
        <template #content-card>
          <div class="q-pa-lg">
            <div class="row row q-col-gutter-x-lg q-col-gutter-y-sm">
              <div class="col-12 col-md-6">
                <GenericSelectorComponent
                  :default_value="models.business_trust_id"
                  label="Negocio"
                  placeholder="Seleccione"
                  :manual_option="business_trusts_with_budget_documents"
                  auto_complete
                  map_options
                  required
                  :rules="[(val: string) => useRules().is_required(val, 'El negocio es requerido')]"
                  @update:model-value="models.business_trust_id = $event"
                />
              </div>

              <div class="col-12 col-md-6">
                <GenericDateInputComponent
                  label="Vigencia"
                  placeholder="Inserte"
                  :required="true"
                  :default_value="models.validity"
                  :rules="[
                    (val: string) => useRules().is_required(val, 'La vigencia es requerida'),
                    (val: string) => useRules().max_length(val, 4),
                    (val: string) => useRules().only_number(val),
                    (val: string )=> useRules().date_not_before_year_2000(val, 'YYYY')
                  ]"
                  mask="YYYY"
                  @update:model-value="models.validity = $event"
                />
              </div>

              <div class="col-12 col-md-6">
                <GenericSelectorComponent
                  :default_value="models.budget_level_id"
                  label="Nivel"
                  placeholder="Seleccione"
                  :manual_option="budget_level_for_documents"
                  auto_complete
                  map_options
                  required
                  :rules="[(val: string) => useRules().is_required(val, 'El nivel es requerido')]"
                  @update:model-value="models.budget_level_id = $event"
                />
              </div>

              <div class="col-12 col-md-3">
                <GenericSelectorComponent
                  :default_value="models.document_from"
                  label="Número de documento desde"
                  placeholder="Seleccione"
                  :manual_option="budget_documents_by_level"
                  auto_complete
                  map_options
                  required
                  :rules="[
                    (val: string) =>
                      useRules().is_required(val, 'El número de documento desde es requerido'),
                    ]"
                  @update:model-value="
                    models.document_from =
                      typeof $event === 'string' ? Number($event) : $event
                  "
                />
              </div>

              <div class="col-12 col-md-3">
                <GenericSelectorComponent
                  :default_value="models.document_to"
                  label="Número de documento hasta"
                  placeholder="Seleccione"
                  :manual_option="budget_documents_by_level"
                  auto_complete
                  map_options
                  required
                  :rules="[
                    (val: string) =>
                    useRules().is_required(val, 'El número de documento hasta es requerido'),
                    (val:string)=> useRules().min_value(val, Number(models.document_from ))
                  ]"
                  @update:model-value="models.document_to = $event"
                />
              </div>

              <div class="col-12 col-md-6">
                <GenericInputComponent
                  :default_value="models.description_society"
                  label="Descripción de sociedad"
                  placeholder="Inserte"
                  type="text"
                  required
                  :rules="[
                    (val: string) =>
                      useRules().is_required(val, 'La descripción de sociedad es requerida'),
                    (val: string) => useRules().only_alphanumeric(val),
                    (val: string) => useRules().max_length(val, 100),
                  ]"
                  @update:model-value="
                    models.description_society =
                      typeof $event === 'string' ? $event.toUpperCase() : $event
                  "
                />
              </div>

              <div class="col-12 col-md-6">
                <GenericSelectorComponent
                  :default_value="models.user_signature_id"
                  label="Usuario firma"
                  placeholder="Seleccione"
                  :manual_option="users"
                  auto_complete
                  map_options
                  required
                  :rules="[(val: string) => useRules().is_required(val, 'El usuario firma es requerido')]"
                  @update:model-value="models.user_signature_id = $event"
                />
              </div>
            </div>

            <div class="row justify-end q-gutter-md q-mt-xs">
              <Button
                no-caps
                label="Generar certificado"
                color-icon="white"
                text-color="white"
                :outline="false"
                color="primary"
                class="text-capitalize"
                @click="handleGenerateCertificate"
              />
            </div>
          </div>
        </template>
      </VCard>

      <section>
        <p class="text-weight-bold text-h4 q-mb-lg">
          Historial de certificados generados
        </p>

        <FiltersComponent
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="handleClearFilters"
        />

        <div class="q-pt-md q-my-xl">
          <TableList
            :loading="tableProps.loading"
            :columns="tableProps.columns"
            :rows="tableProps.rows"
            :pages="tableProps.pages"
            :custom-columns="['status', 'actions']"
            @update-page="handleUpdatePage"
            @update-rows-per-page="handleUpdatePerPage"
          >
            <template #custom-header>
              <div class="row col-12 items-center justify-between q-mb-md">
                <p class="q-my-none text-weight-medium text-h5">
                  {{ tableProps.title }}
                </p>

                <div class="row items-center q-gutter-sm">
                  <Button
                    outline
                    class-custom="custom"
                    label="Creación masiva de certificados PDF"
                    color="orange"
                    :disabled="!canCreateBulkPdfCertificates"
                    :style-text="{ color: 'black' }"
                    :left-img="pdfIcon"
                    @click="handleBulkCertificateCreation"
                  />
                  <Button
                    outline
                    class-custom="custom"
                    label="Descargar certificados"
                    color="orange"
                    :disabled="canCreateBulkPdfCertificates"
                    :style-text="{ color: 'black' }"
                    :left-img="excelIcon"
                    @click="handleCertificatesGenerationStatus"
                  />
                </div>
              </div>
            </template>

            <template #status="{ row }">
              <ShowStatus
                :type="Number(row?.operation_log?.status?.id ?? 0)"
                statusType="budget"
              />
            </template>

            <template #actions="{ row }">
              <Button
                flat
                left-icon="Eye"
                color="orange"
                :class-custom="'custom'"
                :outline="false"
                colorIcon="#f45100"
                :tooltip="'Ver'"
                @click="handleViewCertificate(row.id)"
              />
              <Button
                flat
                left-icon="Download"
                color="orange"
                :class-custom="'custom'"
                :outline="false"
                colorIcon="#f45100"
                :tooltip="'Descargar'"
                @click="downloadCertificate(row.id)"
              />
            </template>
          </TableList>
        </div>
      </section>
    </ContentComponent>

    <AlertModalComponent
      ref="alertModalRef"
      :title="alertModalConfig.title"
      :description_message="alertModalConfig.descriptionMessage"
      :show-btn-cancel="alertModalConfig.showBtnCancel"
      @confirm="handleCloseAlertModal"
    />
  </div>
</template>

<script lang="ts" setup>
// Components
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInputComponent from '@/components/common/GenericInput/GenericInputComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'

// Assets
import excelIcon from '@/assets/images/excel.svg'
import pdfIcon from '@/assets/images/pdf.svg'

// Composables
import { useRules } from '@/composables'

// Logic view
import useBudgetRegistrationCertificateList from '@/views/budget/budget-registration-certificate/v1/list/BudgetRegistrationCertificateList'

const {
  tableProps,
  headerProps,
  filterConfig,
  business_trusts_with_budget_documents,
  budget_level_for_documents,
  users,
  budget_documents_by_level,
  models,
  canCreateBulkPdfCertificates,
  alertModalConfig,
  handleFilter,
  handleUpdatePage,
  handleClearFilters,
  handleUpdatePerPage,
  handleGenerateCertificate,
  handleViewCertificate,
  handleBulkCertificateCreation,
  handleCertificatesGenerationStatus,
  handleCloseAlertModal,
  downloadCertificate,
} = useBudgetRegistrationCertificateList()
</script>
