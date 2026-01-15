<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      :btn-label="headerProperties.btn.label"
      :btn-icon="headerProperties.btn.icon"
      @to="goToURL('BudgetMovementCodesCreate')"
    >
      <FiltersComponentV2
        :fields="filterFields"
        @clear-filters="handleClear"
        @filter="handleFilterSearch"
      />

      <section class="q-mt-xl">
        <TableList
          :title="tableProperties.title"
          :loading="tableProperties.loading"
          :columns="tableProperties.columns"
          :rows="tableProperties.rows"
          :pages="tableProperties.pages"
          :hideHeader="tableProperties.rows.length === 0"
          :custom-columns="['actions']"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #custom-header-action>
            <Button
              class-custom="custom"
              :outline="true"
              label="Descargar excel"
              color="orange"
              :styleContent="{
                'place-items': 'center',
                color: 'black',
              }"
              :left-img="imgButtonHeaderTable"
              @click="downloadAction"
              :disabled="tableProperties.rows.length === 0"
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
              @click="goToURL('BudgetMovementCodesEdit', row.id)"
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
              @click="openAlertModal('eliminar', row.id)"
            />
          </template>
        </TableList>
        <AlertModalComponent
          ref="alertModalRef"
          styleModal="min-width: 480px"
          title="¿Desea eliminar el código de movimiento?"
          @confirm="changeStatusAction"
        ></AlertModalComponent>
      </section>

      <FiltersComponentV2
        :fields="filterConfigDestination"
        @clear-filters="handleClearDestination"
        @filter="handleDestinationFilterSearch"
      />

      <section class="q-mt-xl">
        <TableList
          :title="tablePropertiesDestination.title"
          :loading="tablePropertiesDestination.loading"
          :columns="tablePropertiesDestination.columns"
          :rows="tablePropertiesDestination.rows"
          :pages="tablePropertiesDestination.pages"
          :hideHeader="tablePropertiesDestination.rows.length === 0"
          :custom-columns="['actions']"
          @update-page="updatePageDestination"
          @update-rows-per-page="updatePerPageDestination"
        >
          <template #custom-header-action>
            <div class="col-auto">
              <Button
                :left-icon="defaultIconsLucide.plusCircle"
                :outline="false"
                label="Agregar"
                color-icon="white"
                class-custom="custom q-mr-sm"
                @click="handleOptions('create')"
              >
              </Button>

              <Button
                class-custom="custom"
                :outline="true"
                label="Descargar excel"
                color="orange"
                :styleContent="{
                  'place-items': 'center',
                  color: 'black',
                }"
                :left-img="imgButtonHeaderTable"
                :disabled="tablePropertiesDestination.rows.length === 0"
                @click="downloadActionDestination"
              />
            </div>
          </template>

          <template #actions="{ row }">
            <Button
              v-if="row.id"
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Editar"
              @click="handleOptions('edit', row.id)"
            />
          </template>
        </TableList>
      </section>
    </ContentComponent>

    <AlertModalComponent
      styleModal="max-width: 1000px; width: 100%;"
      ref="managerMovementCodeModal"
      :title-header="
        formAction === 'create'
          ? 'Agregar códigos de movimiento fuente - destino '
          : 'Editar movimiento fuente - destino'
      "
      @close="handleCancel"
      @confirm="handleSubmit"
      :text-btn-confirm="formAction === 'create' ? 'Agregar' : 'Actualizar'"
      :showImgDefault="false"
      margin-top-actions="mt-0"
      margin-top-body="mt-0"
    >
      <template #default-body>
        <InformationForm
          ref="formRef"
          :action="formAction"
          :data="formData"
          @update:data="formData = $event"
        />
      </template>
    </AlertModalComponent>
  </div>

  <AlertModalComponent
    ref="deleteModalRef"
    styleModal="min-width: 470px"
    :showImgDefault="false"
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
</template>

<script setup lang="ts">
// Components
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import InformationForm from '@/components/Forms/Budget/MovementCodes/Information/InformationForm.vue'
import Button from '@/components/common/Button/Button.vue'
import imgButtonHeaderTable from '@/assets/images/excel.svg'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// Logic view
import useMovementCodesList from './BudgetMovementCodesList'

const {
  filterFields,
  filterConfigDestination,
  headerProperties,
  formAction,
  formData,
  formRef,
  tableProperties,
  tablePropertiesDestination,
  alertModalRef,
  defaultIconsLucide,
  managerMovementCodeModal,
  handleFilterSearch,
  handleDestinationFilterSearch,
  updatePage,
  updatePageDestination,
  updatePerPage,
  updatePerPageDestination,
  handleOptions,
  handleClear,
  handleClearDestination,
  handleSubmit,
  handleCancel,
  changeStatusAction,
  downloadAction,
  downloadActionDestination,
  openAlertModal,
  goToURL,
} = useMovementCodesList()
</script>
