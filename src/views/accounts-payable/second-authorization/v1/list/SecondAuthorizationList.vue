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
          :buttons="['more_filters']"
          @show-more="handleShowFilters"
          @clear-filters="handleClearFilters"
        />
        <NoDataState
          v-if="isSecondAuthorizationListEmpty"
          :type="!showState ? 'empty' : 'no-results'"
        />
        <section v-else>
          <TableList
            :title="tableProps.title"
            :loading="tableProps.loading"
            :columns="tableProps.columns"
            :rows="tableProps.rows"
            :pages="tableProps.pages"
            :custom-columns="[
              'status',
              'first_authorization_tax_settlement_generation_status',
              'orpa_status',
              'actions',
            ]"
            selection="multiple"
            v-model:selected="selectedOrders"
            @update-page="updatePage"
            @update-rows-per-page="updateRowsPerPage"
          >
            <template #status="{ row }">
              <ShowStatus
                :type="row.status.id ?? 0"
                statusType="accountsPayable"
              />
            </template>
            <template
              #first_authorization_tax_settlement_generation_status="{ row }"
            >
              <ShowStatus
                :type="
                  row.first_authorization_tax_settlement_generation_status
                    ?.id ?? 0
                "
                statusType="accountsPayable"
              />
            </template>
            <template #orpa_status="{ row }">
              <ShowStatus
                :type="row.orpa_status?.id ?? 0"
                statusType="accountsPayable"
              />
            </template>
            <template #actions="{ row }">
              <!-- Ver -->
              <Button
                v-if="
                  validateRouter(
                    'AccountsPayable',
                    'SecondAuthorizationList',
                    'show'
                  )
                "
                :left-icon="defaultIconsLucide.eye"
                color="orange"
                :class-custom="'custom'"
                :outline="false"
                :flat="true"
                tooltip="Ver"
                @click="goToURL('SecondAuthorizationView', row.id)"
              />

              <!-- Descargar -->
              <Button
                v-if="
                  validateRouter(
                    'AccountsPayable',
                    'SecondAuthorizationList',
                    'show'
                  )
                "
                :left-icon="defaultIconsLucide.download"
                color="orange"
                :class-custom="'custom'"
                :outline="false"
                :flat="true"
                tooltip="Descargar PDF"
                @click="handleDownloadPdf(row.id)"
              />
            </template>
          </TableList>

          <div
            class="flex justify-end q-gutter-md q-mb-lg"
            v-if="showAuthorizationButtons"
          >
            <Button
              :outline="true"
              label="Autorizar"
              size="md"
              color="orange"
              :style-text="{ color: '#333', fontWeight: 'bold' }"
              class="custom"
              @click="openAlertModal('authorize')"
            />

            <Button
              :outline="false"
              label="Rechazar"
              size="md"
              color="orange"
              class="custom"
              @click="openAlertModal('reject')"
            />

            <Button
              :outline="false"
              label="Devolver"
              size="md"
              @click="openAlertModal('return')"
            />
          </div>
        </section>
      </section>

      <AlertModalComponent
        ref="alertModalRef"
        styleModal="min-width: 470px"
        :showImgDefault="false"
        :title="alertModalConfig.title"
        :textBtnConfirm="alertModalConfig.textBtnConfirm"
        :textBtnCancel="alertModalConfig.textBtnCancel"
        @confirm="handleConfirmButtonModal()"
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
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'

// Logic
import useSecondAuthorizationList from '@/views/accounts-payable/second-authorization/v1/list/SecondAuthorizationList'

const {
  defaultIconsLucide,
  headerProps,
  filterConfig,
  selectedOrders,
  tableProps,
  showState,
  isSecondAuthorizationListEmpty,
  alertModalRef,
  alertModalConfig,
  showAuthorizationButtons,
  handleFilter,
  handleClearFilters,
  handleShowFilters,
  openAlertModal,
  handleConfirmButtonModal,
  updatePage,
  updateRowsPerPage,
  handleDownloadPdf,
  goToURL,
  validateRouter,
} = useSecondAuthorizationList()
</script>
