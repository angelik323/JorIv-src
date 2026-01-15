<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter(
          'AccountsPayable',
          'AccountsPayableNotificationsList',
          'create'
        )
          ? headerProps.btn.label
          : undefined
      "
      :btn-icon="headerProps.btn.icon"
      @to="goToURL('AccountsPayableNotificationsCreate')"
    >
      <section>
        <FiltersComponentV2
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="handleClearFilters"
        />
        <NoDataState
          v-if="isAccountsPayableNotificationsListEmpty"
          :type="!showState ? 'empty' : 'no-results'"
        />
        <section v-else>
          <TableList
            :title="tableProps.title"
            :loading="tableProps.loading"
            :columns="tableProps.columns"
            :rows="tableProps.rows"
            :pages="tableProps.pages"
            :custom-columns="['status', 'actions']"
            @update-page="updatePage"
            @update-rows-per-page="updateRowsPerPage"
          >
            <template #status="{ row }">
              <!-- Cambiar estado -->
              <CustomToggle
                :value="isRowActive(row.status.id)"
                :width="100"
                :height="30"
                checked-text="Activo"
                unchecked-text="Inactivo"
                readonly
                @click="openAlertModal(row, 'change-status')"
              />
            </template>
            <template #actions="{ row }">
              <!-- Ver -->
              <Button
                v-if="
                  validateRouter(
                    'AccountsPayable',
                    'AccountsPayableNotificationsList',
                    'show'
                  )
                "
                :left-icon="defaultIconsLucide.eye"
                color="orange"
                :class-custom="'custom'"
                :outline="false"
                :flat="true"
                tooltip="Ver"
                @click="goToURL('AccountsPayableNotificationsView', row.id)"
              />
              <!-- Editar -->
              <Button
                v-if="
                  validateRouter(
                    'AccountsPayable',
                    'AccountsPayableNotificationsList',
                    'edit'
                  )
                "
                :left-icon="defaultIconsLucide.edit"
                color="orange"
                :class-custom="'custom'"
                :outline="false"
                :flat="true"
                tooltip="Editar"
                @click="goToURL('AccountsPayableNotificationsEdit', row.id)"
              />
              <!-- Eliminar -->
              <Button
                v-if="
                  validateRouter(
                    'AccountsPayable',
                    'AccountsPayableNotificationsList',
                    'delete'
                  )
                "
                :outline="false"
                :left-icon="defaultIconsLucide.trash"
                color="orange"
                :flat="true"
                :class-custom="'custom'"
                tooltip="Eliminar"
                @click="openAlertModal(row, 'delete')"
              />
            </template>
          </TableList>
        </section>
      </section>

      <AlertModalComponent
        ref="alertModalRef"
        styleModal="min-width: 470px"
        :showImgDefault="false"
        :title="alertModalConfig.title"
        :description_message="alertModalConfig.description"
        :textBtnConfirm="alertModalConfig.textBtnConfirm"
        :textBtnCancel="alertModalConfig.textBtnCancel"
        @confirm="handleConfirmButtonModal()"
      >
        <template #default-img>
          <q-img
            v-if="alertModalConfig.action === 'delete'"
            src="@/assets/images/icons/alert_popup_delete.svg"
            max-width="80px"
            width="80px"
            fit="contain"
            alt="Imagen de alerta"
          />
          <q-img
            v-else
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
//Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import CustomToggle from '@/components/common/CustomToggle/CustomToggle.vue'

//Logic
import useAccountsPayableNotificationsList from '@/views/accounts-payable/accounts-payable-notifications/v1/list/AccountsPayableNotificationsList'

const {
  defaultIconsLucide,
  headerProps,
  filterConfig,
  tableProps,
  showState,
  isAccountsPayableNotificationsListEmpty,
  alertModalRef,
  alertModalConfig,
  isRowActive,
  handleFilter,
  handleClearFilters,
  openAlertModal,
  handleConfirmButtonModal,
  updatePage,
  updateRowsPerPage,
  goToURL,
  validateRouter,
} = useAccountsPayableNotificationsList()
</script>
