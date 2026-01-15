<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      btn-label="Crear"
      @to="goToURL('BankNetworkLoadCreate')"
    >
      <section class="q-mt-md">
        <FiltersComponentV2
          :fields="filters"
          @filter="handleFilter"
          @clear-filters="handleClear"
        />
      </section>
      <div class="text-subtitle1 text-weight-bold">Listado de cargues</div>

      <section>
        <div class="q-pa-md">
          <TableList
            :loading="tableProps.loading"
            :columns="tableProps.columns"
            :rows="tableProps.rows"
            :pages="tableProps.pages"
            :custom-columns="['status', 'actions']"
            @update-page="updatePage"
            @update-rows-per-page="updatePerPage"
          >
            <template #status="{ row }">
              <ShowStatus
                :type="Number(row?.status.id ?? 1)"
                :statusType="'treasury'"
              />
            </template>

            <template #actions="{ row }">
              <Button
                :left-icon="defaultIconsLucide.delete"
                color="orange"
                :class-custom="'custom'"
                :outline="false"
                :flat="true"
                colorIcon="#f45100"
                tooltip="Eliminar"
                :disabled="row?.status.id == 24 || row?.status.id == 68"
                @click="handleOptions('delete', row.id)"
              />
              <Button
                :left-icon="defaultIconsLucide.eye"
                color="orange"
                :class-custom="'custom'"
                :outline="false"
                :flat="true"
                colorIcon="#f45100"
                tooltip="Ver"
                @click="handleOptions('view', row.id)"
              />
              <Button
                :left-icon="defaultIconsLucide.edit"
                color="orange"
                :class-custom="'custom'"
                :outline="false"
                :flat="true"
                colorIcon="#f45100"
                tooltip="Editar"
                :disabled="row?.status.id == 24 || row?.status.id == 68"
                @click="handleOptions('edit', row.id)"
              />
              <Button
                :left-icon="defaultIconsLucide.circleOff"
                color="orange"
                :class-custom="'custom'"
                :outline="false"
                :flat="true"
                colorIcon="#f45100"
                tooltip="Reporte de errores"
                :disabled="row?.status.id == 24"
                @click="handleOptions('errors', row.id)"
              />
            </template>
          </TableList>
        </div>
      </section>

      <AlertModalComponent
        ref="alertModalRef"
        styleModal="min-width: 470px"
        :showImgDefault="false"
        :title="alertModalConfig.description"
        :description_message="''"
        @confirm="deleteBankNetworkLoad()"
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

<script lang="ts" setup>
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

// Utils
import { defaultIconsLucide } from '@/utils'

// Logic view
import { useBankNetworkLoadList } from '@/views/treasury/bank-network-load/v1/list/BankNetworkLoadList'

const {
  headerProps,
  tableProps,
  filters,
  alertModalRef,
  alertModalConfig,
  updatePage,
  updatePerPage,
  handleOptions,
  deleteBankNetworkLoad,
  handleFilter,
  handleClear,
  goToURL,
} = useBankNetworkLoadList()
</script>
