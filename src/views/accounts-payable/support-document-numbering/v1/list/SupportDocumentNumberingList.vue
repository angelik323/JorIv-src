<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
    >
      <section>
        <FiltersComponentV2
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="handleClearFilters"
        />
        <NoDataState
          v-if="isSupportDocumentNumberingListEmpty"
          :type="!showState ? 'empty' : 'no-results'"
        />
        <section v-else>
          <TableList
            :title="tableProps.title"
            :loading="tableProps.loading"
            :columns="tableProps.columns"
            :rows="tableProps.rows"
            :pages="tableProps.pages"
            :custom-columns="['actions', 'status']"
            @update-page="updatePage"
            @update-rows-per-page="updateRowsPerPage"
          >
            <template #status="{ row }">
              <!-- Cambiar estado -->
              <CustomToggle
                :value="
                  isRowActive(row.support_document_numbering_issuer_status_id)
                "
                :width="100"
                :height="30"
                checked-text="Activo"
                unchecked-text="Inactivo"
                readonly
                @click="openAlertModal(row)"
              />
            </template>
            <template #actions="{ row }">
              <!-- Ver -->
              <Button
                v-if="
                  validateRouter(
                    'AccountsPayable',
                    'SupportDocumentNumberingList',
                    'show'
                  )
                "
                :left-icon="defaultIconsLucide.eye"
                color="orange"
                :class-custom="'custom'"
                :outline="false"
                :flat="true"
                colorIcon="#f45100"
                tooltip="Ver"
                @click="goToURL('SupportDocumentNumberingView', row.id)"
              />
              <!-- Editar -->
              <Button
                v-if="
                  validateRouter(
                    'AccountsPayable',
                    'SupportDocumentNumberingList',
                    'edit'
                  )
                "
                :left-icon="defaultIconsLucide.edit"
                color="orange"
                :class-custom="'custom'"
                :outline="false"
                :flat="true"
                tooltip="Editar"
                @click="goToURL('SupportDocumentNumberingEdit', row.id)"
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
        :textBtnConfirm="alertModalConfig.textBtnConfirm"
        :textBtnCancel="alertModalConfig.textBtnCancel"
        @confirm="toggleStatus()"
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
//Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import CustomToggle from '@/components/common/CustomToggle/CustomToggle.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

//Logic
import useSupportDocumentNumberingList from '@/views/accounts-payable/support-document-numbering/v1/list/SupportDocumentNumberingList'

const {
  defaultIconsLucide,
  headerProps,
  filterConfig,
  tableProps,
  showState,
  isSupportDocumentNumberingListEmpty,
  alertModalRef,
  alertModalConfig,
  handleFilter,
  handleClearFilters,
  updatePage,
  updateRowsPerPage,
  isRowActive,
  openAlertModal,
  toggleStatus,
  goToURL,
  validateRouter,
} = useSupportDocumentNumberingList()
</script>
