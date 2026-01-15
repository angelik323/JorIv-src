<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      btn-label="Crear"
      @to="$router.push({ name: 'PriceProviderFileCreate' })"
    >
      <section class="q-mt-md">
        <FiltersComponent
          :fields="filters"
          @filter="handleFilter"
          @clear-filters="_clearData"
        />
      </section>
      <p class="q-my-none text-weight-medium text-h5">
        Listado archivos proveedor precio
      </p>
      <section class="q-mt-xl">
        <div class="q-pt-md q-my-xl">
          <TableList
            :loading="tableProps.loading"
            :columns="tableProps.columns"
            :rows="tableProps.rows"
            :pages="tableProps.pages"
            :custom-columns="['status', 'actions']"
            @update-page="updatePage"
            @update-rows-per-page="updatePerPage"
          >
            <template #actions="{ row }">
              <Button
                :left-icon="defaultIconsLucide.eye"
                color="orange"
                class-custom="custom"
                :outline="false"
                flat
                colorIcon="#f45100"
                tooltip="Ver"
                @click="
                  $router.push({
                    name: 'PriceProviderFileView',
                    params: {
                      id: row.id_price_provider,
                    },
                  })
                "
              />
              <Button
                :left-icon="defaultIconsLucide.edit"
                color="orange"
                class-custom="custom"
                :outline="false"
                flat
                colorIcon="#f45100"
                tooltip="Editar"
                @click="
                  $router.push({
                    name: 'PriceProviderFileEdit',
                    params: {
                      id: row.id_price_provider,
                    },
                  })
                "
              />
              <Button
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
        </div>
      </section>

      <AlertModalComponent
        ref="alertModalRef"
        styleModal="min-width: 470px"
        :showImgDefault="false"
        :title="alertModalConfig.title"
        :description_message="alertModalConfig.description"
        @confirm="deletePriceProviderFile()"
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
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

// Utils
import { defaultIconsLucide } from '@/utils'

// Logic view
import { usePriceProviderFile } from '@/views/investment-portfolio/price-provider-file/v1/list/PriceProviderFileList'

const {
  headerProps,
  filters,
  tableProps,
  handleFilter,
  handleOptions,
  alertModalRef,
  deletePriceProviderFile,
  alertModalConfig,
  updatePage,
  updatePerPage,
  _clearData,
} = usePriceProviderFile()
</script>
