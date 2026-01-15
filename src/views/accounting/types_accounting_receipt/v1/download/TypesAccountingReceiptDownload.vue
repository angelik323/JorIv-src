<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="$router.push({ name: 'TypeAccountingReceiptList' })"
    >
    </ContentComponent>

    <section class="q-mt-md">
      <FiltersComponent
        @filter="handleFilter"
        @clear-filters="_cleanData"
        @update:values="onFilterChange"
      />
    </section>

    <section class="q-mt-xl">
      <TableList
        :title="tableProps.title"
        :loading="tableProps.loading"
        :columns="tableProps.columns"
        :rows="tableProps.rows"
        :pages="tableProps.pages"
        :custom-columns="[
          'sub_code',
          'sub_name',
          'status_id',
          'cancellation_association',
          'is_cancellation',
          'is_upload_receipt',
        ]"
        @update-page="updatePage"
        @update-rows-per-page="updateRows"
      >
        <template #custom-header-action>
          <q-btn
            no-caps
            outline
            unelevated
            class="text-capitalize btn-filter custom"
            text-color="black"
            size="100%"
            color="white"
            @click="exportExcel"
            :tooltip="'Descargar excel'"
            :disabled="tableProps.loading || tableProps.rows.length === 0"
          >
            <img
              class="image-excel q-mr-sm"
              src="@/assets/images/excel.svg"
              alt="Excel Icon"
            />
            Descargar excel
          </q-btn>
        </template>

        <template #sub_code="{ row }: { row: ITypeAccountingAction }">
          <SubReceiptCell :items="row.sub_receipt_types || []">
            <template #default="{ element }: { element: ISubReceiptType }">
              {{ element.code }}
            </template>
          </SubReceiptCell>
        </template>

        <template #sub_name="{ row }: { row: ITypeAccountingAction }">
          <SubReceiptCell :items="row.sub_receipt_types || []">
            <template #default="{ element }: { element: ISubReceiptType }">
              {{ element.name }}
            </template>
          </SubReceiptCell>
        </template>

        <template
          #cancellation_association="{ row }: { row: ITypeAccountingAction }"
        >
          <SubReceiptCell :items="row.sub_receipt_types || []">
            <template #default="{ element }: { element: ISubReceiptType }">
              {{ element.cancellation_association?.name }}
            </template>
          </SubReceiptCell>
        </template>

        <template #is_cancellation="{ row }: { row: ITypeAccountingAction }">
          <SubReceiptCell :items="row.sub_receipt_types || []">
            <template #default="{ element }: { element: ISubReceiptType }">
              {{ element.is_cancellation ? 'Si' : 'No' }}
            </template>
          </SubReceiptCell>
        </template>

        <template #is_upload_receipt="{ row }: { row: ITypeAccountingAction }">
          <SubReceiptCell :items="row.sub_receipt_types || []">
            <template #default="{ element }: { element: ISubReceiptType }">
              {{ element.is_upload_receipt ? 'Si' : 'No' }}
            </template>
          </SubReceiptCell>
        </template>

        <template #status_id="{ row }: { row: ITypeAccountingAction }">
          <SubReceiptCell :items="row.sub_receipt_types || []">
            <template #default="{ element }: { element: ISubReceiptType }">
              <ShowStatus :type="element.status_id || 0" />
            </template>
          </SubReceiptCell>
        </template>
      </TableList>
    </section>
  </div>
</template>

<script setup lang="ts">
// Components:
import FiltersComponent from '@/components/common/Filters/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import ShowStatus from '@/components/showStatus/ShowStatus.vue'
import SubReceiptCell from '@/components/common/SubReceiptCell/SubReceiptCell.vue'

// Logic view
import useTypesAccountingReceiptDownload from './TypesAccountingReceiptDownload'

//interfaces
import { ISubReceiptType, ITypeAccountingAction } from '@/interfaces/customs'

const {
  headerProps,
  tableProps,
  _cleanData,
  updatePage,
  updateRows,
  exportExcel,
  handleFilter,
  onFilterChange,
} = useTypesAccountingReceiptDownload()
</script>
