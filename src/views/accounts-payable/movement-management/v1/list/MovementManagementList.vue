<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="headerProps.btn.label"
      :btn-icon="headerProps.btn.icon"
      @to="goToURL('MovementManagementCreate')"
    >
      <section>
        <FiltersComponentV2
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="handleClearFilters"
        />
      </section>

      <NoDataState
        v-if="isMovementListEmpty"
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
          <CustomToggle
            :value="isRowActive(row.status.id)"
            :width="100"
            :height="30"
            checked-text="Activo"
            unchecked-text="Inactivo"
            readonly
            @click="
              validateRouter(
                'AccountsPayable',
                'MovementManagementList',
                'edit'
              )
                ? openStatusModal(row)
                : null
            "
          />
        </template>

        <template #actions="{ row }">
          <!-- ver -->
          <Button
            v-if="
              validateRouter(
                'AccountsPayable',
                'MovementManagementList',
                'show'
              )
            "
            :left-icon="defaultIconsLucide.eye"
            color="orange"
            :class-custom="'custom'"
            :outline="false"
            :flat="true"
            tooltip="Ver"
            @click="goToURL('MovementManagementView', row.id)"
          />

          <!-- Editar -->
          <Button
            v-if="
              validateRouter(
                'AccountsPayable',
                'MovementManagementList',
                'edit'
              )
            "
            :left-icon="defaultIconsLucide.edit"
            color="orange"
            :class-custom="'custom'"
            :outline="false"
            :flat="true"
            tooltip="Editar"
            @click="goToURL('MovementManagementEdit', row.id)"
          />

          <!-- Eliminar -->
          <Button
            v-if="
              validateRouter(
                'AccountsPayable',
                'MovementManagementList',
                'delete'
              )
            "
            :outline="false"
            :left-icon="defaultIconsLucide.trash"
            color="orange"
            :flat="true"
            :class-custom="'custom'"
            tooltip="Eliminar"
            @click="openDeleteModal(row.id)"
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
        @confirm="handleDelete()"
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
      </AlertModalComponent>

      <AlertModalComponent
        ref="statusModalRef"
        styleModal="min-width: 470px"
        :showImgDefault="false"
        :title="alertStatusModalConfig.title"
        :description_message="alertStatusModalConfig.description"
        :textBtnConfirm="alertStatusModalConfig.textBtnConfirm"
        :textBtnCancel="alertStatusModalConfig.textBtnCancel"
        @confirm="changeStatusAction()"
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

<script lang="ts" setup>
// components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import Icon from '@/components/common/Icon/Icon.vue'
import CustomToggle from '@/components/common/CustomToggle/CustomToggle.vue'

// logic view
import useMovementManagementList from './MovementManagementList'

const {
  // configs
  headerProps,
  filterConfig,
  tableProps,
  alertModalConfig,
  alertStatusModalConfig,

  // refs
  isMovementListEmpty,
  showState,
  alertModalRef,
  statusModalRef,

  // utils
  defaultIconsLucide,

  // methods
  handleFilter,
  handleClearFilters,
  handleDelete,
  openDeleteModal,
  isRowActive,
  changeStatusAction,
  goToURL,
  updatePage,
  updatePerPage,
  validateRouter,
  openStatusModal,
} = useMovementManagementList()
</script>
