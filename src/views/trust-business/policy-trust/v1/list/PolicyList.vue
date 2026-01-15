<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter('BusinessTrust', 'PolicyList', 'create')
          ? 'Crear'
          : undefined
      "
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="handlerGoTo('PolicyCreate')"
    >
      <section class="q-mt-md">
        <FiltersComponentV2
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="handleClearFilters"
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
            'actions',
            'record_status_id',
            'policy_status_id',
            'insured_value',
          ]"
          @update-page="updatePage"
          @update-rows-per-page="updateRowsPerPage"
        >
          <template #custom-header-action>
            <Button
              v-if="
                validateRouter('BusinessTrust', 'PolicyList', 'export') &&
                tableProps.rows.length !== 0
              "
              class-custom="custom"
              :outline="true"
              label="Descargar excel"
              color="orange"
              :styleContent="{
                'place-items': 'center',
                color: 'black',
              }"
              :left-img="imgButtonHeaderTable"
              @click="downloadExcel"
            />
          </template>

          <template #record_status_id="{ row }">
            <ShowStatus :type="Number(row?.record_status?.id ?? 1)" />
          </template>

          <template #policy_status_id="{ row }">
            <ShowStatus :type="Number(row?.policy_status?.id ?? 1)" />
          </template>

          <template #insured_value="{ row }">
            {{ formatCurrency(`${row.insured_value}`) }}
          </template>

          <template #actions="{ row }">
            <!-- Ver -->
            <Button
              v-if="validateRouter('BusinessTrust', 'PolicyList', 'show')"
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Ver'"
              @click="
                $router.push({
                  name: 'PolicyView',
                  params: {
                    id: row.id,
                  },
                })
              "
            />

            <!-- Editar -->
            <Button
              v-if="validateRouter('BusinessTrust', 'PolicyList', 'edit')"
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Editar'"
              @click="
                $router.push({
                  name: 'PolicyEdit',
                  params: {
                    id: row.id,
                  },
                })
              "
            />

            <!-- Eliminar -->
            <Button
              v-if="validateRouter('BusinessTrust', 'PolicyList', 'delete')"
              :left-icon="defaultIconsLucide.trash"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Eliminar'"
              :disabled="
                row.record_status.id === TrustBusinessStatusID.AUTHORIZED
              "
              @click="openAlertModal('eliminar', row.id)"
            />

            <!-- Descargar -->
            <Button
              v-if="
                validateRouter(
                  'BusinessTrust',
                  'PolicyList',
                  'action_export_individual'
                )
              "
              :left-icon="defaultIconsLucide.download"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Descarga individual'"
              @click="downloadByRowExcel(row.id)"
            />

            <!-- Autorizar -->
            <Button
              v-if="
                validateRouter(
                  'BusinessTrust',
                  'PolicyList',
                  'action_export_individual'
                )
              "
              :left-icon="defaultIconsLucide.circleCheckBig"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Autorizar'"
              :disabled="
                row.record_status.id !== TrustBusinessStatusID.REGISTERED
              "
              @click="
                $router.push({
                  name: 'PolicyAuthorize',
                  params: {
                    id: row.id,
                  },
                })
              "
            />
          </template>
        </TableList>
      </section>
    </ContentComponent>
    <AlertModalComponent
      ref="alertModalRef"
      styleModal="min-width: 480px"
      title="¿Desea eliminar la póliza?"
      @confirm="deleteRealStateProject"
    >
    </AlertModalComponent>
  </div>
</template>

<script setup lang="ts">
// components
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import imgButtonHeaderTable from '@/assets/images/excel.svg'

// logic
import useRealStateProjectList from './PolicyList'

// utils
import { defaultIconsLucide } from '@/utils'

// composables
import { useUtils } from '@/composables'
const { formatCurrency } = useUtils()

const {
  headerProps,
  tableProps,
  filterConfig,
  alertModalRef,
  TrustBusinessStatusID,

  downloadExcel,
  downloadByRowExcel,
  handleFilter,
  handlerGoTo,
  updatePage,
  handleClearFilters,
  deleteRealStateProject,
  openAlertModal,
  validateRouter,
  updateRowsPerPage,
} = useRealStateProjectList()
</script>
