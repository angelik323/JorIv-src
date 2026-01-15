<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter('Treasury', 'BankingAccountsList', 'create')
          ? 'Crear'
          : undefined
      "
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="
        () => {
          _resetBankingAccountForms()
          $router.push({ name: 'BankingAccountsCreate' })
        }
      "
    >
      <section class="q-mt-md">
        <FiltersComponentV2
          ref="filtersComponentRef"
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="handleClear"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :rows="tableProps.rows"
          :columns="tableProps.columns"
          :pages="tableProps.pages"
          :custom-columns="['status', 'actions']"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #custom-header-action>
            <Button
              :outline="true"
              label="Descargar excel"
              :leftImg="excelIcon"
              tooltip="Descargar excel"
              :disabled="isDownloadDisabled"
              @click="downloadExcelBankingAccounts()"
            />
          </template>

          <template #status="{ row }">
            <ShowStatus
              :type="row.status.id ?? 1"
              class-custom="q-px-sm q-py-xs"
            />
          </template>

          <template #actions="{ row }">
            <!-- ver -->
            <Button
              v-if="validateRouter('Treasury', 'BankingAccountsList', 'show')"
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Ver"
              @click="handleOptions('view', row.id)"
            />

            <!-- Editar -->
            <Button
              v-if="validateRouter('Treasury', 'BankingAccountsList', 'edit')"
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Editar"
              @click="handleOptions('edit', row.id)"
            />

            <!-- Eliminar -->
            <Button
              v-if="validateRouter('Treasury', 'BankingAccountsList', 'delete')"
              :left-icon="defaultIconsLucide.delete"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Eliminar"
              @click="handleOptions('delete', row.id)"
            />
          </template>
        </TableList>
      </section>

      <AlertModalComponent
        ref="alertModalRef"
        styleModal="min-width: 470px"
        :showImgDefault="false"
        :title="alertModalConfig.description"
        :description_message="''"
        @confirm="deleteBankingAccount()"
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
    </ContentComponent>
  </div>
</template>
<script setup lang="ts">
// Components
import excelIcon from '@/assets/images/excel.svg'
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'
import ShowStatus from '@/components/showStatus/ShowStatus.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// Utils
import { defaultIconsLucide } from '@/utils'

// Logic view
import useBankingAccountsList from '@/views/treasury/banking-accounts/v2/list/BankingAccountsList'

const {
  tableProps,
  headerProps,
  alertModalRef,
  alertModalConfig,
  filterConfig,
  filtersComponentRef,

  deleteBankingAccount,
  handleFilter,
  handleClear,
  handleOptions,
  updatePage,
  updatePerPage,
  _resetBankingAccountForms,
  validateRouter,
  downloadExcelBankingAccounts,
  isDownloadDisabled,
} = useBankingAccountsList()
</script>
