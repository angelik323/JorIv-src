<template>
  <div>
    <div class="row justify-end">
      <div class="row items-center justify-between q-mb-md">
        <div class="row q-gutter-md">
          <Button
            outline
            class-custom="custom"
            label="Descargar PDF"
            color="orange"
            :styleContent="{ 'place-items': 'center', color: 'black' }"
            :leftImg="pdfIcon"
            @click="downloadReport('PDF')"
          />

          <Button
            outline
            class-custom="custom"
            label="Descargar excel"
            color="orange"
            :styleContent="{ 'place-items': 'center', color: 'black' }"
            :leftImg="excelIcon"
            @click="downloadReport('EXCEL')"
          />
        </div>
      </div>
    </div>

    <MovementsTable
      v-for="business in reportResult.list"
      :key="business.id"
      :business="business"
      :pages="reportResult.pages"
      :meta="{
        businessType: 'FIDUCIA DE ADMINISTRACIÓN Y PAGOS',
        book: `${business.account_structure.code} - ${business.account_structure.purpose}`,
        currency: (business.amount_type ?? 'Pesos').toUpperCase(),
        period: Boolean(reportFilters?.include_close_voucher),
      }"
    />

    <div v-if="reportResult.pages.lastPage > 1" class="row justify-end q-mb-md">
      <q-pagination
        v-model="filtersFormat.page"
        :max="reportResult.pages.lastPage"
        color="primary"
        boundary-numbers
        direction-links
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// Components
import MovementsTable from '@/components/Lists/AccountingReport/MovementsTable/MovementsTable.vue'
import Button from '@/components/common/Button/Button.vue'

// Interfaces
import { IReportFormProps } from '@/interfaces/customs/accounting/v2/AccountingReport'

// Assets
import excelIcon from '@/assets/images/excel.svg'
import pdfIcon from '@/assets/images/pdf.svg'

// Logic view
import useReportForm from '@/components/Forms/Accounting/AccoutingReport/v2/AccountingReportForm/ReportForm/ReportForm'

const props = defineProps<IReportFormProps>()

const { downloadReport } = useReportForm(props)
</script>
