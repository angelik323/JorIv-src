<template>
  <div class="q-mx-xl">
    <ContentComponent
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      @to="goToURL('GeneralContractInquiryView')"
    >
      <section class="q-mt-md">
        <FiltersComponentV2
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="handleClear"
          ref="filtersRef"
        />
      </section>

      <section class="q-mt-md">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="['select', 'status', 'actions']"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #custom-header-action>
            <Button
              v-if="
                validateRouter(
                  'DerivativeContracting',
                  'GeneralContractInquiryList',
                  'export'
                )
              "
              :outline="true"
              label="Descargar excel"
              :leftImg="excelIcon"
              tooltip="Descargar excel"
              @click="downloadFile"
            />
          </template>

          <template #select="{ row }">
            <div class="px-1 flex justify-center">
              <q-radio
                size="sm"
                :val="row.id"
                color="orange"
                v-model="contractsAddendaSelected"
              />
            </div>
          </template>

          <template #status="{ row }">
            <CustomToggle
              :value="row.status.id === StatusID.ACTIVE"
              :width="100"
              :height="30"
              checked-text="Activo"
              unchecked-text="Inactivo"
              readonly
            />
          </template>

          <template #actions="{ row }">
            <Button
              v-if="
                validateRouter(
                  'DerivativeContracting',
                  'GeneralContractInquiryList',
                  'show'
                )
              "
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'ver'"
              @click="goToURL('GeneralContractInquiryView', row.id)"
            />
          </template>
        </TableList>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import CustomToggle from '@/components/common/CustomToggle/CustomToggle.vue'
import Button from '@/components/common/Button/Button.vue'

//assets
import excelIcon from '@/assets/images/excel.svg'

//interfaces
import { StatusID } from '@/interfaces/global'

//logic
import useGeneralContractInquiryList from '@/views/derivative-contracting/general-contract-inquiry/v1/list/GeneralContractInquiryList'

const {
  headerProps,
  filterConfig,
  filtersRef,
  goToURL,
  defaultIconsLucide,

  handleFilter,
  handleClear,

  tableProps,
  updatePage,
  updatePerPage,

  downloadFile,
  contractsAddendaSelected,
  validateRouter,
} = useGeneralContractInquiryList()
</script>
