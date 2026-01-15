<template>
  <div class="q-px-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      :btn-label="
        validateRouter('ScheduleNotifications', 'ConfigCalendarList', 'create')
          ? 'Crear'
          : undefined
      "
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="goToURL('ConfigCalendarCreate')"
    >
      <FiltersComponent
        :fields="filterConfig"
        show_actions
        trigger_event_by_field
        @filter="handleFilter"
        @clear-filters="handleClearFilters"
      />

      <NoDataState
        v-if="isConfigCalendarEmpty"
        :type="showState === 0 ? 'empty' : 'no-results'"
      />

      <div class="q-pt-md q-my-xl" v-else>
        <TableList
          :title="tableProperties.title"
          :loading="tableProperties.loading"
          :rows="tableProperties.rows"
          :columns="tableProperties.columns"
          :pages="tableProperties.pages"
          :custom-columns="['actions']"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #custom-header-action>
            <Button
              v-if="
                validateRouter(
                  'ScheduleNotifications',
                  'ConfigCalendarList',
                  'show'
                )
              "
              label="Ver calendario"
              left-icon="Calendar"
              color="orange"
              :class-custom="'custom'"
              :outline="true"
              colorIcon="#762344"
              :styleText="{ color: 'black' }"
              @click="goToURL('ConfigCalendarView')"
            />
          </template>

          <template #actions="{ row }">
            <Button
              v-if="
                validateRouter(
                  'ScheduleNotifications',
                  'ConfigCalendarList',
                  'edit'
                )
              "
              left-icon="Pencil"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Editar'"
              @click="handleOptions('edit', row.id)"
            />
            <Button
              v-if="
                validateRouter(
                  'ScheduleNotifications',
                  'ConfigCalendarList',
                  'delete'
                )
              "
              left-icon="Trash"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Eliminar'"
              @click="handleOptions('delete', row.id)"
            />
          </template>
        </TableList>
      </div>

      <AlertModalComponent
        ref="alertModalRef"
        styleModal="min-width: 470px"
        :showImgDefault="false"
        :title="alertModalConfig.description"
        :description_message="''"
        @confirm="deleteItem()"
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
// Components
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

// Logic view
import useConfigCalendarList from '@/views/agenda/config-calendar/v1/list/ConfigCalendarList'

const {
  goToURL,
  showState,
  deleteItem,
  updatePage,
  filterConfig,
  handleFilter,
  updatePerPage,
  alertModalRef,
  handleOptions,
  validateRouter,
  tableProperties,
  headerProperties,
  alertModalConfig,
  handleClearFilters,
  defaultIconsLucide,
  isConfigCalendarEmpty,
} = useConfigCalendarList()
</script>
