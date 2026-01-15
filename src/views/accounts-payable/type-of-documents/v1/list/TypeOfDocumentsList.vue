<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter('AccountsPayable', 'TypeOfDocumentsList', 'create')
          ? headerProps.btn.label
          : undefined
      "
      :btn-icon="headerProps.btn.icon"
      @to="goToURL('TypeOfDocumentsCreate')"
    >
      <section>
        <FiltersComponentV2
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="handleClearFilters"
        />
      </section>

      <NoDataState
        v-if="isListEmpty"
        :type="!showState ? 'empty' : 'no-results'"
      />

      <TableList
        v-else
        :title="tableProps.title"
        :loading="tableProps.loading"
        :columns="tableProps.columns"
        :rows="tableProps.rows"
        :pages="tableProps.pages"
        :custom-columns="tableProps.customColumns"
        @update-page="updatePage"
        @update-rows-per-page="updatePerPage"
      >
        <template
          v-for="col in tableProps.customColumns.filter(
            (c) => !['status', 'actions'].includes(c)
          )"
          #[col]="{ row }"
          :key="col"
        >
          <Icon v-if="row[col]" name="CheckCircle2" :size="20" color="orange" />
          <Icon v-else name="XCircle" :size="20" color="grey" />
        </template>

        <template #status="{ row }">
          <div
            class="inline-flex items-center justify-center"
            :class="
              canEdit ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'
            "
            @click.stop="onToggleClick(row)"
          >
            <div :style="{ pointerEvents: 'none' }">
              <CustomToggle
                :value="isRowActive(row.status?.id)"
                :width="100"
                :height="30"
                checked-text="Activo"
                unchecked-text="Inactivo"
                readonly
              />
            </div>
          </div>
        </template>

        <!-- Acciones -->
        <template #actions="{ row }">
          <Button
            v-if="
              validateRouter('AccountsPayable', 'TypeOfDocumentsList', 'edit')
            "
            :left-icon="defaultIconsLucide.edit"
            color="orange"
            :class-custom="'custom'"
            :outline="false"
            :flat="true"
            tooltip="Editar"
            @click="goToURL('TypeOfDocumentsEdit', row.id)"
          />
          <Button
            v-if="canDelete"
            :left-icon="defaultIconsLucide.trash"
            color="orange"
            :class-custom="'custom'"
            :outline="false"
            :flat="true"
            tooltip="Eliminar"
            @click="openDeleteModal(row)"
          />
        </template>
      </TableList>

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
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import CustomToggle from '@/components/common/CustomToggle/CustomToggle.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import Icon from '@/components/common/Icon/Icon.vue'

// logic
import useTypeOfDocumentsList from './TypeOfDocumentsList'

const {
  // configs
  headerProps,
  filterConfig,
  tableProps,

  // flags
  showState,
  isListEmpty,

  // modal
  alertModalRef,
  alertModalConfig,
  handleConfirmAction,
  openDeleteModal,

  // utils
  defaultIconsLucide,
  goToURL,
  validateRouter,
  canEdit,
  canDelete,

  // actions
  handleFilter,
  handleClearFilters,
  updatePage,
  updatePerPage,

  // estado
  isRowActive,
  onToggleClick,
} = useTypeOfDocumentsList()
</script>
