<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :subtitle="headerProperties.subtitle"
      :breadcrumbs="headerProperties.breadcrumbs"
      :btn-label="validateRouter('Users', 'ListRoles', 'create') ? headerProperties.btn.label : undefined"
      @to="handlerGoTo('CreateRoles')"
    >
      <section class="q-mt-md">
        <FiltersComponent
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="handleClearFilters"
        />
      </section>
      <section class="q-mt-xl q-pt-xl">
        <Statistics :stats="statsProps ?? []" />
      </section>

      <section>
        <TableList
          :title="tableProperties.title"
          :loading="tableProperties.loading"
          :rows="tableProperties.rows"
          :columns="tableProperties.columns"
          :pages="tableProperties.pages"
          :custom-columns="['status', 'actions']"
          @update-page="updatePage"
          @update-rows-per-page="updateRows"
        >
          <template #status="{ row }">
            <ShowStatus
              :type="row.status_id ?? 1"
              class-custom="q-px-sm q-py-xs"
            />
          </template>

          <template #actions="{ row }">
            <!-- Ver -->
            <Button
              v-if="validateRouter('Users', 'ListRoles', 'show')"
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Ver"
              @click="handlerAction('view', row)"
            />

            <!-- Editar -->
            <Button
              v-if="validateRouter('Users', 'ListRoles', 'edit')"
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Editar"
              @click="handlerAction('edit', row)"
            />

            <!-- Activar / Inactivar -->
            <Button
              v-if="row.status_id && validateRouter('Users', 'ListRoles', 'edit')"
              :left-icon="defaultIconsLucide.ArrowLeftRight"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Cambiar estado"
              @click="
                openAlertModal(
                  row.status_id == 2 ? 'activar' : 'inactivar',
                  row.id
                )
              "
            />
          </template>
        </TableList>

        <AlertModalComponent
          ref="alertModalRef"
          styleModal="min-width: 470px"
          :title="alertModalConfig.title"
          :description_message="alertModalConfig.description"
          @confirm="changeStatus()"
        />
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import Statistics from '@/components/common/Statistics/Statistics.vue'
import TableList from '@/components/table-list/TableList.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import ShowStatus from '@/components/showStatus/ShowStatus.vue'
import Button from '@/components/common/Button/Button.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// utils
import { defaultIconsLucide } from '@/utils'

// logic view
import useRolList from './ListRoles'

const {
  tableProperties,
  statsProps,
  alertModalRef,
  alertModalConfig,
  filterConfig,
  headerProperties,

  openAlertModal,
  changeStatus,
  handlerGoTo,
  handlerAction,
  handleClearFilters,
  handleFilter,
  updatePage,
  updateRows,
  validateRouter,
} = useRolList()
</script>
