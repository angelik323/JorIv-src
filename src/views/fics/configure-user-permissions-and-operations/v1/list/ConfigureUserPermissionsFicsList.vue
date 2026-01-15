<template>
  <div class="q-px-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
    >
      <FiltersComponentV2
        :fields="filterConfig"
        @filter="handleFilter"
        @clear-filters="handleClear"
      />

      <NoDataState v-if="!selectedUserInfo" type="empty" />

      <section v-else>
        <TabsComponent :tabs :tabActive :tabActiveIdx />

        <VCard>
          <template #content-card>
            <div class="q-pa-lg row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <p class="text-weight-bold no-margin">Usuario</p>
                <p class="text-weight-medium no-margin">
                  {{ selectedUserInfo.email }}
                </p>
              </div>
              <div class="col-12 col-md-4">
                <p class="text-weight-bold no-margin">Cargo</p>
                <p class="text-weight-medium no-margin">
                  {{ selectedUserInfo.profile_type }}
                </p>
              </div>
              <div class="col-12 col-md-4">
                <p class="text-weight-bold no-margin">Descripción</p>
                <p class="text-weight-medium no-margin">
                  {{
                    `${selectedUserInfo.name ?? ''} ${
                      selectedUserInfo.last_name ?? ''
                    }`
                  }}
                </p>
              </div>
            </div>
          </template>
        </VCard>

        <div v-if="tabActive === 'basic_data'">
          <TableList
            :title="tablePermissionsFundsByUser.title"
            :columns="tablePermissionsFundsByUser.columns"
            :rows="tablePermissionsFundsByUser.rows"
            :loading="tablePermissionsFundsByUser.loading"
            :custom-columns="['status_id', 'actions']"
            :pages="tablePermissionsFundsByUser.pages"
            @update-page="(page) => updatePage('funds', page)"
            @update-rows-per-page="(rows) => updatePerPage('funds', rows)"
          >
            <template #custom-header-action>
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
                @click="handleAddUserPermissions"
              />
            </template>
            <template #status_id="{ row }">
              <CustomToggle
                :value="isRowActive(row.status_id)"
                :width="100"
                :height="30"
                checked-text="Activo"
                unchecked-text="Inactivo"
                readonly
                @click="openAlertModal(row)"
              />
            </template>
            <template #actions="{ row }">
              <Button
                :left-icon="defaultIconsLucide.trash"
                color="orange"
                :class-custom="'custom'"
                :outline="false"
                :flat="true"
                colorIcon="#f45100"
                tooltip="Eliminar"
                @click="openDeleteModal(row)"
              />
            </template>
          </TableList>
          <q-separator class="q-my-xl" />
          <TableList
            :title="tablePermissionsByOffice.title"
            :columns="tablePermissionsByOffice.columns"
            :rows="tablePermissionsByOffice.rows"
            :loading="tablePermissionsByOffice.loading"
            :custom-columns="['status_id', 'actions']"
            :pages="tablePermissionsByOffice.pages"
            @update-page="(page) => updatePage('office', page)"
            @update-rows-per-page="(rows) => updatePerPage('office', rows)"
          >
            <template #custom-header-action>
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
                @click="addPermissionsByOffice"
              />
            </template>
            <template #status_id="{ row }">
              <CustomToggle
                :value="isRowActive(row.status_id)"
                :width="100"
                :height="30"
                checked-text="Activo"
                unchecked-text="Inactivo"
                readonly
                @click="openAlertModal(row)"
              />
            </template>
            <template #actions="{ row }">
              <Button
                :left-icon="defaultIconsLucide.trash"
                color="orange"
                :class-custom="'custom'"
                :outline="false"
                :flat="true"
                colorIcon="#f45100"
                tooltip="Eliminar"
                @click="openDeleteModal(row)"
              />
            </template>
          </TableList>
          <q-separator class="q-my-xl" />
          <TableList
            :title="tableMonetaryOperationsPermits.title"
            :columns="tableMonetaryOperationsPermits.columns"
            :rows="tableMonetaryOperationsPermits.rows"
            :loading="tableMonetaryOperationsPermits.loading"
            :custom-columns="['status_id']"
            :pages="tableMonetaryOperationsPermits.pages"
            @update-page="(page) => updatePage('operation', page)"
            @update-rows-per-page="(rows) => updatePerPage('operation', rows)"
          >
            <template #status_id="{ row }">
              <CustomToggle
                :value="isRowActive(row.status_id)"
                :width="100"
                :height="30"
                checked-text="Activo"
                unchecked-text="Inactivo"
                readonly
                @click="openAlertModal(row)"
              />
            </template>
          </TableList>
        </div>
      </section>
    </ContentComponent>

    <AlertModalComponent
      :show-img-default="false"
      ref="assignOfficeModalRef"
      styleModal="padding: 1vw; min-width: 80%"
      :title-header="'Agregar permisos sobre oficina'"
      @confirm="handleAssignOffices"
    >
      <template #default-body>
        <InformationFormConfigureUser
          :regions="regions"
          @update:selectedIds="selectedOfficeIds = $event"
        />
        <q-separator class="q-mx-lg"></q-separator>
      </template>
    </AlertModalComponent>

    <AlertModalComponent
      ref="alertModalRef"
      styleModal="min-width: 480px"
      :title="alertModalConfig.description"
      :show-img-default="false"
      @confirm="changeStatusAction"
    >
      <template #default-img>
        <q-img
          src="@/assets/images/icons/alert_popup_delete.svg"
          max-width="80px"
          width="80px"
          fit="contain"
        />
      </template>
    </AlertModalComponent>

    <AlertModalComponent
      ref="deleteModalRef"
      styleModal="min-width: 480px"
      :title="deleteModalConfig.description"
      :show-img-default="false"
      @confirm="confirmDeleteAction"
    >
      <template #default-img>
        <q-img
          src="@/assets/images/icons/alert_popup_delete.svg"
          max-width="80px"
          width="80px"
          fit="contain"
        />
      </template>
    </AlertModalComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import InformationFormConfigureUser from '@/components/Forms/Fics/ConfigureUserPermissions/InformationFormConfigureUser.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import CustomToggle from '@/components/common/CustomToggle/CustomToggle.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Logic view
import useConfigureUserPermissionsList from '@/views/fics/configure-user-permissions-and-operations/v1/list/ConfigureUserPermissionsFicsList'

const {
  tabs,
  regions,
  tabActive,
  updatePage,
  handleClear,
  isRowActive,
  tabActiveIdx,
  filterConfig,
  handleFilter,
  alertModalRef,
  updatePerPage,
  deleteModalRef,
  openAlertModal,
  openDeleteModal,
  selectedUserInfo,
  alertModalConfig,
  headerProperties,
  deleteModalConfig,
  selectedOfficeIds,
  changeStatusAction,
  defaultIconsLucide,
  handleAssignOffices,
  confirmDeleteAction,
  assignOfficeModalRef,
  addPermissionsByOffice,
  handleAddUserPermissions,
  tablePermissionsByOffice,
  tablePermissionsFundsByUser,
  tableMonetaryOperationsPermits,
} = useConfigureUserPermissionsList()
</script>
