<template>
  <div class="q-px-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      :btn-label="
        validateRouter('ScheduleNotifications', 'CalendarEventList', 'create')
          ? 'Crear'
          : undefined
      "
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="goToURL('CalendarEventCreate')"
    >
      <FiltersComponent
        show_actions
        trigger_event_by_field
        :fields="filterConfig"
        @filter="handleFilter"
        @clear-filters="handleClearFilters"
      />

      <NoDataState
        v-if="isEventsEmpty"
        :type="showState === 0 ? 'empty' : 'no-results'"
      />

      <div v-else class="q-pt-md q-my-xl">
        <TableList
          :title="tableProperties.title"
          :loading="tableProperties.loading"
          :rows="tableProperties.rows"
          :columns="tableProperties.columns"
          :pages="tableProperties.pages"
          :custom-columns="['actions']"
          @update-page="handleUpdatePage"
          @update-rows-per-page="handleUpdatePerPage"
        >
          <template #custom-header-action>
            <Button
              label="Ver agenda"
              left-icon="Calendar"
              color="orange"
              :class-custom="'custom'"
              :outline="true"
              colorIcon="#762344"
              :styleText="{ color: 'black' }"
              @click="goToURL('CalendarAgendaView')"
            />
          </template>

          <template #actions="{ row }">
            <Button
              v-if="
                validateRouter(
                  'ScheduleNotifications',
                  'CalendarEventList',
                  'show'
                )
              "
              :label="''"
              left-icon="Eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              :tooltip="'Ver'"
              @click="handleOptions('view', row.id)"
            />
            <Button
              v-if="
                validateRouter(
                  'ScheduleNotifications',
                  'CalendarEventList',
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
                  'CalendarEventList',
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
        @confirm="handleDeleteItem"
      >
        <template #default-img>
          <q-img
            src="@/assets/images/icons/alert_popup_delete.svg"
            max-width="80px"
            width="80px"
            fit="contain"
            alt="Imagen de alerta"
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
import useCalendarEventList from '@/views/agenda/config-agenda/v1/list/CalendarEventList'

const {
  goToURL,
  showState,
  handleFilter,
  filterConfig,
  handleOptions,
  alertModalRef,
  isEventsEmpty,
  validateRouter,
  tableProperties,
  handleDeleteItem,
  headerProperties,
  handleUpdatePage,
  alertModalConfig,
  defaultIconsLucide,
  handleClearFilters,
  handleUpdatePerPage,
} = useCalendarEventList()
</script>
