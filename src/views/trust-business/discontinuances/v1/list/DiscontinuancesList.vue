<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter('BusinessTrust', 'DiscontinuancesList', 'create')
          ? 'Crear'
          : ''
      "
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="handlerGoTo('DiscontinuancesCreate')"
    >
      <section class="q-mt-md">
        <FiltersComponentV2
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="handleClearFilters"
          @update:values="filtersUpdate"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="['status_id', 'actions']"
          @update-page="updatePage"
          @update-rows-per-page="updateRowsPerPage"
        >
          <template #status_id="{ row }">
            <ShowStatus :type="Number(row?.status_id ?? 1)" />
          </template>

          <template #actions="{ row }">
            <!-- Ver -->
            <Button
              v-if="
                validateRouter('BusinessTrust', 'DiscontinuancesList', 'show')
              "
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Ver'"
              @click="handlerGoTo('DiscontinuancesView', row.id)"
            />

            <!-- Editar -->
            <Button
              v-if="
                validateRouter('BusinessTrust', 'DiscontinuancesList', 'edit')
              "
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Editar'"
              :disabled="row.status_id === 71"
              @click="handlerGoTo('DiscontinuancesEdit', row.id)"
            />

            <!-- Eliminar -->
            <Button
              v-if="
                validateRouter('BusinessTrust', 'DiscontinuancesList', 'delete')
              "
              :left-icon="defaultIconsLucide.trash"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Eliminar'"
              :disabled="row.status_id === 71"
              @click="openAlertModal('eliminar', row.id)"
            />

            <!-- Autorizar -->
            <Button
              v-if="
                validateRouter('BusinessTrust', 'DiscontinuancesList', 'edit')
              "
              :left-icon="defaultIconsLucide.circleCheckBig"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Autorizar'"
              :disabled="row.status_id === 71 || row.status_id === 10"
              @click="handlerGoTo('DiscontinuancesAuthorize', row.id)"
            />
          </template>
        </TableList>
      </section>
    </ContentComponent>
    <AlertModalComponent
      ref="alertModalRef"
      styleModal="min-width: 480px"
      title="¿Desea eliminar el desistimiento?"
      @confirm="deleteDiscontinuances"
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
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'

// logic
import useDiscontinuancesList from './DiscontinuancesList'

// utils
import { defaultIconsLucide } from '@/utils'

const {
  headerProps,
  tableProps,
  filterConfig,
  alertModalRef,

  deleteDiscontinuances,
  openAlertModal,
  handleFilter,
  handlerGoTo,
  updatePage,
  handleClearFilters,
  filtersUpdate,
  updateRowsPerPage,
  validateRouter,
} = useDiscontinuancesList()
</script>
