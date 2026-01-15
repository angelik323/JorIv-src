<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="headerProps.btn.label"
      :btn-icon="headerProps.btn.icon"
      @to="goToURL('BudgetDocumentTypesCreate')"
    >
      <section class="q-mt-md">
        <FiltersComponent
          ref="filterComponentRef"
          :fields="filterConfig"
          trigger_event_by_field
          @filter="search"
          @clear-filters="clearFilters"
        />
      </section>
      <section class="q-mt-xl">
        <TableList
          dense
          :loading="documentTypeTableProps.loading"
          :columns="documentTypeTableProps.columns"
          :rows="documentTypeTableProps.rows"
          :pages="documentTypeTableProps.pages"
          :custom-columns="[
            'radio',
            'requires_authorization',
            'allows_adjustments',
            'validity_closure',
            'creates_new_document',
            'allows_additions',
            'allows_deductions',
            'validates_area',
            'requires_city',
            'has_expiration_date',
            'requires_balance_validation_by_document_type',
            'actions',
          ]"
          @update-page="updatePage"
          @update-rows-per-page="updateRowsPerPage"
        >
          <template #custom-header>
            <div class="row justify-between full-width">
              <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
                {{ documentTypeTableProps.title }}
              </p>
              <Button
                class-custom="custom"
                label="Descargar excel"
                color="orange"
                outline
                :styleContent="{
                  'place-items': 'center',
                  color: 'black',
                }"
                :left-img="imgButtonHeaderTable"
                @click="downloadDocumentTypes"
              />
            </div>
          </template>
          <template #radio="{ row }">
            <RadioYesNo
              class="justify-center"
              v-model="row.selected"
              :options="[{ label: '', value: true }]"
              @update:model-value="selectDocumentType(row)"
            />
          </template>
          <template #requires_authorization="{ row }">
            <RadioYesNo
              class="justify-center"
              v-model="row.requires_authorization"
              :is-radio-button="false"
              :is-switch="false"
              is-disabled
            />
          </template>
          <template #allows_adjustments="{ row }">
            <RadioYesNo
              class="justify-center"
              v-model="row.allows_adjustments"
              :is-radio-button="false"
              :is-switch="false"
              is-disabled
            />
          </template>
          <template #validity_closure="{ row }">
            <RadioYesNo
              class="justify-center"
              v-model="row.validity_closure"
              :is-radio-button="false"
              :is-switch="false"
              is-disabled
            />
          </template>
          <template #creates_new_document="{ row }">
            <RadioYesNo
              class="justify-center"
              v-model="row.creates_new_document"
              :is-radio-button="false"
              :is-switch="false"
              is-disabled
            />
          </template>
          <template #allows_additions="{ row }">
            <RadioYesNo
              class="justify-center"
              v-model="row.allows_additions"
              :is-radio-button="false"
              :is-switch="false"
              is-disabled
            />
          </template>
          <template #allows_deductions="{ row }">
            <RadioYesNo
              class="justify-center"
              v-model="row.allows_deductions"
              :is-radio-button="false"
              :is-switch="false"
              is-disabled
            />
          </template>
          <template #validates_area="{ row }">
            <RadioYesNo
              class="justify-center"
              v-model="row.validates_area"
              :is-radio-button="false"
              :is-switch="false"
              is-disabled
            />
          </template>
          <template #requires_city="{ row }">
            <RadioYesNo
              class="justify-center"
              v-model="row.requires_city"
              :is-radio-button="false"
              :is-switch="false"
              is-disabled
            />
          </template>
          <template #has_expiration_date="{ row }">
            <RadioYesNo
              class="justify-center"
              v-model="row.has_expiration_date"
              :is-radio-button="false"
              :is-switch="false"
              is-disabled
            />
          </template>
          <template #requires_balance_validation_by_document_type="{ row }">
            <RadioYesNo
              class="justify-center"
              v-model="row.requires_balance_validation_by_document_type"
              :is-radio-button="false"
              :is-switch="false"
              is-disabled
            />
          </template>
          <template #actions="{ row }">
            <Button
              v-if="row.id"
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Editar"
              @click="goToURL('BudgetDocumentTypesEdit', row.id)"
            />
            <Button
              v-if="row.id"
              :left-icon="defaultIconsLucide.trash"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Eliminar"
              @click="openDeleteConfirmationModal(row.id)"
            />
          </template>
        </TableList>
      </section>
      <section
        class="q-mt-xl"
        v-if="
          selectedDocumentType &&
          selectedDocumentType.requires_balance_validation_by_document_type
        "
      >
        <TableList
          dense
          :loading="balanceValidationTableProps.loading"
          :columns="balanceValidationTableProps.columns"
          :rows="balanceValidationTableProps.rows"
          :pages="balanceValidationTableProps.pages"
          :custom-columns="['actions']"
          @update-page="updatePage"
          @update-rows-per-page="updateRowsPerPage"
        >
          <template #custom-header>
            <div class="row justify-between full-width">
              <p class="text-black-10 text-weight-bold text-h6 q-mb-none">
                {{ balanceValidationTableProps.title }}
              </p>
              <Button
                :outline="false"
                label="Agregar"
                left-icon="PlusCircle"
                color-icon="white"
                :styleContent="{
                  'place-items': 'center',
                  'border-radius': '20px',
                  'font-size': '13px',
                }"
                @click="
                  goToURL(
                    'BudgetDocumentTypesBalanceValidationCreate',
                    selectedDocumentType.id
                  )
                "
              />
            </div>
          </template>
          <template #actions="{ row }">
            <Button
              v-if="row.id"
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Editar"
              @click="editBalanceValidation(row, row.id)"
            />
            <Button
              v-if="row.id"
              :left-icon="defaultIconsLucide.trash"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Eliminar"
              @click="openDeleteBalanceValidationModal(row.id)"
            />
          </template>
        </TableList>
      </section>
      <AlertModalComponent
        ref="deleteDocumentTypeModalRef"
        styleModal="min-width: 480px"
        :title="`¿Desea eliminar el tipo de documento presupuestal?`"
        @confirm="deleteDocumentType"
      >
      </AlertModalComponent>
      <AlertModalComponent
        ref="deleteBalanceValidationModalRef"
        styleModal="min-width: 480px"
        :title="`¿Desea eliminar la validación de saldo?`"
        @confirm="deleteBalanceValidation"
      >
      </AlertModalComponent>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import imgButtonHeaderTable from '@/assets/images/excel.svg'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// Composables
import { useGoToUrl } from '@/composables'

// Logic view
import useBudgetDocumentTypesList from '@/views/budget/document-types/v1/list/BudgetDocumentTypesList'

const { goToURL } = useGoToUrl()

const {
  headerProps,
  filterConfig,
  defaultIconsLucide,
  selectedDocumentType,
  documentTypeTableProps,
  deleteDocumentTypeModalRef,
  deleteBalanceValidationModalRef,
  balanceValidationTableProps,
  search,
  updatePage,
  clearFilters,
  updateRowsPerPage,
  selectDocumentType,
  deleteDocumentType,
  downloadDocumentTypes,
  openDeleteConfirmationModal,
  openDeleteBalanceValidationModal,
  deleteBalanceValidation,
  editBalanceValidation,
} = useBudgetDocumentTypesList()
</script>
