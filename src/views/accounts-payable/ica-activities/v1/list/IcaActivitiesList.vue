<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="headerProps.btn.label"
      :btn-icon="headerProps.btn.icon"
      :second-btn-label="'Test'"
      @to="goToURL('IcaActivitiesCreate')"
    >
      <template #addBefore>
        <div>
          <Button
            :outline="false"
            label="Relaciones ciudad tercero"
            color="orange"
            color-icon="white"
            :left-icon="defaultIconsLucide.plusCircleOutline"
            class-custom="custom full-width"
            :styleContent="{ 'place-items': 'center', padding: '0.3rem' }"
            :disabled="false"
            @click="goToURL('IcaRelationList')"
          />
        </div>
      </template>

      <section>
        <FiltersComponentV2
          ref="filtersRef"
          :fields="filterConfig"
          :buttons="['more_filters']"
          @update:values="changeCity"
          @show-more="handleShowFilters"
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
        :custom-columns="['applies_to_third_party', 'status', 'actions']"
        @update-page="updatePage"
        @update-rows-per-page="updatePerPage"
      >
        <template #applies_to_third_party="{ row }" :key="col">
          <Icon
            v-if="row.applies_to_third_party"
            name="CheckCircle2"
            :size="20"
            color="orange"
          />
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
              validateRouter('AccountsPayable', 'IcaActivitiesList', 'edit')
                ? openAlertModal(row)
                : null
            "
          />
        </template>

        <template #actions="{ row }">
          <!-- Editar -->
          <Button
            v-if="
              validateRouter('AccountsPayable', 'IcaActivitiesList', 'edit')
            "
            :left-icon="defaultIconsLucide.edit"
            color="orange"
            :class-custom="'custom'"
            :outline="false"
            :flat="true"
            tooltip="Editar"
            @click="goToURL('IcaActivitiesEdit', row.id)"
          />

          <!-- Eliminar -->
          <Button
            v-if="
              validateRouter('AccountsPayable', 'IcaActivitiesList', 'delete')
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
        ref="alertModalStatusRef"
        styleModal="min-width: 400px"
        :title="alertModalStatusConfig.description"
        @confirm="changeStatusAction"
      />
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
import CustomToggle from '@/components/common/CustomToggle/CustomToggle.vue'
import Icon from '@/components/common/Icon/Icon.vue'

// logic view
import useIcaActivitiesList from '@/views/accounts-payable/ica-activities/v1/list/IcaActivitiesList'

const {
  // configs
  headerProps,
  filterConfig,
  tableProps,
  alertModalConfig,
  alertModalStatusConfig,

  // refs
  alertModalStatusRef,
  filtersRef,
  isListEmpty,
  showState,
  alertModalRef,

  // utils
  defaultIconsLucide,

  // methods
  handleFilter,
  handleClearFilters,
  handleShowFilters,
  handleDelete,
  openDeleteModal,
  openAlertModal,
  isRowActive,
  changeStatusAction,
  goToURL,
  updatePage,
  updatePerPage,
  validateRouter,
  changeCity,
} = useIcaActivitiesList()
</script>
