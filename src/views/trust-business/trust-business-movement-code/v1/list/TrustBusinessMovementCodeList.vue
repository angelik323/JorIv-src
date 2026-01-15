<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter(
          'BusinessTrust',
          'TrustBusinessMovementCodesList',
          'create'
        )
          ? 'Crear'
          : undefined
      "
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="handlerGoTo('TrustBusinessMovementCodesCreate')"
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
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="['actions']"
          :hideHeader="tableProps.rows.length === 0"
          @update-page="updatePage"
          @update-rows-per-page="updateRowsPerPage"
        >
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
                    v-if="
                      validateRouter(
                        'BusinessTrust',
                        'TrustBusinessMovementCodesList',
                        'export'
                      )
                    "
                    outline
                    class-custom="custom"
                    label="Descargar excel"
                    color="orange"
                    :styleContent="{
                      'place-items': 'center',
                      color: 'black',
                    }"
                    :left-img="imgButtonHeaderTable"
                    :disabled="tableProps.rows.length === 0"
                    @click="downloadExcel"
                  />
                </div>
              </div>
            </div>
          </template>
          <template #actions="{ row }">
            <!-- Ver -->
            <Button
              v-if="
                validateRouter(
                  'BusinessTrust',
                  'TrustBusinessMovementCodesList',
                  'show'
                )
              "
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Ver'"
              @click="
                $router.push({
                  name: 'TrustBusinessMovementCodesView',
                  params: {
                    id: row.id,
                  },
                })
              "
            />

            <!-- Editar -->
            <Button
              v-if="
                validateRouter(
                  'BusinessTrust',
                  'TrustBusinessMovementCodesList',
                  'edit'
                )
              "
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Editar'"
              @click="
                $router.push({
                  name: 'TrustBusinessMovementCodesEdit',
                  params: {
                    id: row.id,
                  },
                })
              "
            />

            <!-- Eliminar -->
            <Button
              v-if="
                validateRouter(
                  'BusinessTrust',
                  'TrustBusinessMovementCodesList',
                  'delete'
                )
              "
              :left-icon="defaultIconsLucide.trash"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Eliminar'"
              @click="openAlertModal('eliminar', row.id)"
            />
          </template>
        </TableList>
      </section>

      <AlertModalComponent
        ref="alertModalRef"
        styleModal="min-width: 480px"
        title="¿Desea eliminar  el código de movimiento?"
        :show-img-default="false"
        @confirm="changeStatusAction"
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
// components
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import imgButtonHeaderTable from '@/assets/images/excel.svg'

// logic
import useBusinessTrustMovementCodesList from './TrustBusinessMovementCodeList'

// utils
import { defaultIconsLucide } from '@/utils'

const {
  headerProps,
  tableProps,
  filterConfig,
  alertModalRef,

  downloadExcel,
  openAlertModal,
  handleClearFilters,
  changeStatusAction,
  handleFilter,
  handlerGoTo,
  updatePage,
  updateRowsPerPage,
  validateRouter,
} = useBusinessTrustMovementCodesList()
</script>
