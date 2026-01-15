<template>
  <div class="q-px-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
    >
      <FiltersComponent
        show_actions
        :fields="filterConfig"
        @filter="handleFilter"
        @clear-filters="handleClearFilters"
      >
        <template #customs-actions>
          <q-btn
            outline
            :round="$q.screen.width <= 800"
            unelevated
            no-caps
            color="primary"
            class="menu__action--bg-white"
            :size="$q.screen.width <= 800 ? 'sm' : 'md'"
            @click="handleOptions"
          >
            <div class="row items-center q-gutter-sm">
              <Icon
                :name="
                  showAdvancedFilters
                    ? defaultIconsLucide.minus
                    : defaultIconsLucide.plus
                "
                :size="20"
                color="#762343"
              />
              <div v-if="$q.screen.width > 800">Opciones</div>
            </div>
          </q-btn>
        </template>
      </FiltersComponent>

      <NoDataState
        v-if="isTableEmpty"
        :type="showState === 0 ? 'empty' : 'no-results'"
      />

      <div v-else class="q-pt-md q-my-xl">
        <TableList
          :title="tableProperties.title"
          :loading="tableProperties.loading"
          :rows="tableProperties.rows"
          :columns="tableProperties.columns"
          :pages="tableProperties.pages"
          :custom-columns="['iva', 'actions']"
          @update-page="updatePage"
          @update-rows-per-page="updateRowsPerPage"
        >
          <template #iva="{ row }">
            <div class="flex justify-center">
              <Icon
                v-if="parseFloat(row.iva || '0') > 0"
                name="CheckCircle2"
                :size="20"
                color="orange"
              />
              <Icon v-else name="XCircle" :size="20" color="grey" />
            </div>
          </template>

          <template #actions="{ row }">
            <Button
              :left-icon="defaultIconsLucide.eye"
              colorIcon="#f45100"
              color="orange"
              :outline="false"
              :flat="true"
              :class-custom="'custom'"
              tooltip="Ver"
              @click="viewDetail(row)"
            />
            <Button
              v-if="canEdit(row)"
              :left-icon="defaultIconsLucide.edit"
              colorIcon="#f45100"
              color="orange"
              :outline="false"
              :flat="true"
              :class-custom="'custom'"
              tooltip="Editar"
              @click="editRecord(row)"
            />
            <Button
              flat
              :left-icon="defaultIconsLucide.moreVertical"
              colorIcon="#f45100"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              tooltip="Opciones"
              :dropdown-options="taxSettlementOptions(row)"
            />
          </template>
        </TableList>
      </div>
    </ContentComponent>

    <AlertModalComponent
      ref="rejectionModalRef"
      styleModal="min-width: 520px"
      :showImgDefault="false"
      title="¿Desea rechazar la solicitud?"
      :textBtnConfirm="'Aceptar'"
      :textBtnCancel="'Cancelar'"
      :disableConfirm="!rejectionModalConfig.cancellation_rejection_reason_id"
      @confirm="handleReject"
    >
      <template #default-img>
        <q-img
          src="@/assets/images/icons/alert_popup_delete.svg"
          max-width="80px"
          width="80px"
          fit="contain"
          alt="Imagen de alerta"
        />
      </template>
      <template #default-body>
        <div class="q-mt-md q-px-md q-gutter-md">
          <GenericSelector
            label="Motivo de rechazo"
            :manual_option="rejection_reasons"
            map_options
            required
            :default_value="''"
            auto_complete
            clearable
            :placeholder="'Seleccione'"
            :rules="[
              (val: string | number | null) =>
                useRules().is_required(String(val ?? ''), 'El motivo de rechazo es requerido.'),
            ]"
            @update:modelValue="handleRejectionReasonChange"
          />
          <GenericInput
            label="Observaciones"
            :default_value="rejectionModalConfig.observations"
            type="textarea"
            :placeholder="'Inserte'"
            required
            :rules="[
              (val: string | null) => useRules().is_required(val as string, 'Las observaciones son requeridas'),
              (val: string | null) => {
                if (!val) return true
                return String(val).length <= 150 ? true : 'Máximo 150 caracteres'
              },
            ]"
            @update:modelValue="rejectionModalConfig.observations = $event"
          />
        </div>
      </template>
    </AlertModalComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import Icon from '@/components/common/Icon/Icon.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import GenericSelector from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'

// Logic
import { useRules } from '@/composables'
import useTaxSettlementList from '@/views/accounts-payable/tax-settlement/v1/list/TaxSettlementList'

const {
  showState,
  handleFilter,
  filterConfig,
  tableProperties,
  headerProperties,
  updatePage,
  handleClearFilters,
  defaultIconsLucide,
  updateRowsPerPage,
  isTableEmpty,
  viewDetail,
  editRecord,
  handleOptions,
  showAdvancedFilters,
  canEdit,
  rejectionModalRef,
  rejectionModalConfig,
  handleReject,
  rejection_reasons,
  handleRejectionReasonChange,
  taxSettlementOptions,
} = useTaxSettlementList()
</script>
