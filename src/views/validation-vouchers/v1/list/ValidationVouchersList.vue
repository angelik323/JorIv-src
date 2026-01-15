<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter('Accounting', 'ValidationVoucherList', 'create')
          ? headerProps.btn.label
          : undefined
      "
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="handleGoTo('ValidationVoucherCreate')"
    >
      <template #addBefore>
        <Button
          :left-icon="defaultIconsLucide.reload"
          colorIcon="white"
          :outline="false"
          :class-custom="'btn-header custom'"
          label="Actualizar"
          size="md"
          color="orange"
          @click="$router.push({ name: 'ValidationVouchersEdit' })"
        />
      </template>

      <FiltersComponent
        :fields="filterConfig"
        @filter="handleFilter"
        @show-more="handleShowMoreFilters"
        @clear-filters="clearFilters"
        :buttons="['more_filters']"
      />

      <section class="q-mt-xl">
        <TableList
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows ?? []"
          :pages="tableProps.pages"
          :custom-columns="['status', 'actions']"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #status="{ row }">
            <ShowStatus :type="Number(row?.status.id ?? 1)" />
          </template>

          <template #custom-header>
            <div class="row q-col-gutter-sm" style="width: 100%">
              <div class="col-xs-12 col-sm-12 col-md-9 col-lg-10 self-center">
                <p class="q-my-none text-weight-medium text-h5">
                  {{ tableProps.title }}
                </p>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-2">
                <div class="row justify-end">
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
                    :disabled="isDownloadDisabled"
                    @click="downloadAction"
                  />
                </div>
              </div>
            </div>
          </template>

          <template #actions="{ row }">
            <!-- Ver -->
            <Button
              v-if="
                validateRouter('Accounting', 'ValidationVoucherList', 'show')
              "
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Ver"
              @click="
                $router.push({
                  name: 'ValidationVouchersView',
                  params: { id: row.id },
                })
              "
            />

            <!-- Editar -->
          </template>
        </TableList>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components:
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import imgButtonHeaderTable from '@/assets/images/excel.svg'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'

// Logic view
import useValidationvouchersList from '@/views/validation-vouchers/v1/list/ValidationVouchersList'

// Utils
import { defaultIconsLucide } from '@/utils'

const {
  // Props
  headerProps,
  tableProps,
  filterConfig,
  isDownloadDisabled,
  handleFilter,
  clearFilters,
  handleGoTo,
  updatePage,
  handleShowMoreFilters,
  downloadAction,
  updatePerPage,
  validateRouter,
} = useValidationvouchersList()
</script>
