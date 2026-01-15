<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
    >
      <section class="q-mt-md">
        <FiltersComponentV2
          ref="filtersRef"
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="handleClearFilters"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows ?? []"
          :pages="tableProps.pages"
          :custom-columns="['actions']"
          selection="multiple"
          v-model:selected="selectedOperations"
          :hideHeader="tableProps.rows.length === 0"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #custom-header>
            <div class="row justify-between" style="width: 100%">
              <p class="q-my-none text-weight-medium text-h5">
                {{ tableProps.rows.length > 0 ? tableProps.title : '' }}
              </p>
            </div>
          </template>

          <template #actions="{ row }">
            <Button
              v-if="
                isOperationEditable(row) &&
                validateRouter('Budget', 'OperationAuthorizationsList', 'show')
              "
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Ver"
              @click="
                goToURL(
                  'OperationAuthorizationsView',
                  { id: row.id },
                  { operation_type: row.operation_type.toString() }
                )
              "
            />

            <Button
              v-if="
                isOperationEditable(row) &&
                validateRouter('Budget', 'OperationAuthorizationsList', 'edit')
              "
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Editar"
              @click="
                goToURL(
                  'OperationAuthorizationsEdit',
                  { id: row.id },
                  { operation_type: row.operation_type.toString() }
                )
              "
              :disabled="!row.budget_document_type.allows_adjustments"
            />
          </template>
        </TableList>
      </section>
      <section class="q-mt-xl mb-10">
        <div class="row q-col-gutter-sm" style="width: 100%">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <div class="row justify-end q-gutter-sm">
              <Button
                v-if="hasSelectedOperations"
                class-custom="custom"
                :outline="true"
                label="Rechazar"
                color="positive"
                :styleContent="{
                  'place-items': 'center',
                }"
                @click="openRejectModal"
              />
              <Button
                v-if="hasSelectedOperations"
                class-custom="custom"
                :outline="false"
                label="Autorizar"
                color="positive"
                :styleContent="{
                  'place-items': 'center',
                }"
                @click="openApproveModal"
              />
            </div>
          </div>
        </div>
      </section>
    </ContentComponent>
  </div>

  <!-- Modal de Autorización -->
  <AlertModalComponent
    ref="approveModalRef"
    styleModal="min-width: 470px"
    :showImgDefault="false"
    title="¿Desea confirmar la autorización de las operaciones seleccionadas?"
    @confirm="handleApprove"
  >
    <template #default-img>
      <q-img
        src="@/assets/images/icons/alert_popup.svg"
        max-width="80px"
        width="80px"
        fit="contain"
      />
    </template>
  </AlertModalComponent>

  <!-- Modal de Rechazo -->
  <AlertModalComponent
    ref="rejectModalRef"
    styleModal="min-width: 470px"
    :showImgDefault="false"
    title="¿Desea rechazar las operaciones seleccionadas?"
    @confirm="handleReject"
  >
    <template #default-img>
      <q-img
        src="@/assets/images/icons/alert_popup_delete.svg"
        max-width="80px"
        width="80px"
        fit="contain"
      />
    </template>
    <template #default-body>
      <div class="q-mt-md">
        <q-input
          v-model="rejectionReasonRef"
          class="q-mx-md"
          outlined
          type="textarea"
          label="Establezca motivo de rechazo*"
          placeholder="Ingrese el motivo del rechazo"
          maxlength="100"
          counter
          :rules="[
            (val) =>
              useRules().is_required(val, 'El motivo de rechazo es requerido'),
            (val) => useRules().max_length(val, 100),
          ]"
        />
      </div>
    </template>
  </AlertModalComponent>
</template>

<script setup lang="ts">
// Components
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// Logic view
import useOperationAuthorizationsList from '@/views/budget/operation-authorizations/v1/list/OperationAuthorizationsList'
// Composables
import { useRules } from '@/composables'

const {
  filtersRef,
  headerProps,
  tableProps,
  filterConfig,
  defaultIconsLucide,
  selectedOperations,
  approveModalRef,
  rejectModalRef,
  rejectionReasonRef,
  hasSelectedOperations,
  handleFilter,
  updatePage,
  handleClearFilters,
  validateRouter,
  updatePerPage,
  goToURL,
  openApproveModal,
  openRejectModal,
  handleApprove,
  handleReject,
  isOperationEditable,
} = useOperationAuthorizationsList()
</script>
