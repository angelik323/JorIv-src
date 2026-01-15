<script setup lang="ts">
// Components:
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import ChangePasswordUserModal from '@/components/Modals/User/ChangePasswordUserModal.vue'
import Statistics from '@/components/common/Statistics/Statistics.vue'
import TableList from '@/components/table-list/TableList.vue'
import FiltersComponent from '@/components/common/Filters/FiltersComponent.vue'
import ShowStatus from '@/components/showStatus/ShowStatus.vue'
// Utils:
import { defaultIcons } from '@/utils'
// Logic
import { useListUserView } from '@/views/user-manager/list/ListUserView'

const {
  headerProps,
  statsProps,
  tableProperties,
  disableXlsxBtn,
  openModal,
  goToView,
  updatePage,
  handleClear,
  handleSearch,
  exportXlsx,
  changeStatus,
  changePassword,
  userId,
  edit,
  read,
} = useListUserView()
</script>

<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
    >
      <template #addBefore>
        <div class="row q-gutter-sm">
          <q-btn
            no-caps
            unelevated
            class="btn-header"
            label="Crear"
            :icon="defaultIcons.plus"
            text-color="white"
            @click="goToView('CreateUserView')"
          />
          <q-btn
            no-caps
            unelevated
            outline
            class="btn-header custom txt-color-new-primary"
            label="Roles"
            size="md"
            @click="goToView('ListRoles')"
          />
        </div>
      </template>

      <section class="q-mt-md">
        <FiltersComponent @filter="handleSearch" @clear-filters="handleClear" />
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
        >
          <template #custom-header-action>
            <q-btn
              no-caps
              outline
              unelevated
              class="btn-table"
              text-color="orange"
              size="100%"
              color="white"
              :disable="disableXlsxBtn"
              @click="exportXlsx"
            >
              <img
                class="image-excel q-mr-sm"
                src="@/assets/images/excel.svg"
                alt="Excel Icon"
              />
              Descargar excel
            </q-btn>
          </template>

          <template #status="{ row }">
            <ShowStatus :type="row.status.id" />
          </template>

          <template #actions="{ row }">
            <!-- Ver -->
            <q-btn
              flat
              rounded
              size="14px"
              :icon="defaultIcons.eye"
              @click="read(row.id)"
            >
              <q-tooltip
                transition-show="flip-right"
                transition-hide="flip-left"
                class="primary"
              >
                <p class="q-ma-none text-body2">Ver</p>
              </q-tooltip>
            </q-btn>

            <!-- Editar -->
            <q-btn
              flat
              rounded
              size="14px"
              :icon="defaultIcons.edit"
              @click="edit(row.id)"
            >
              <q-tooltip
                transition-show="flip-right"
                transition-hide="flip-left"
                class="primary"
              >
                <p class="q-ma-none text-body2">Editar</p>
              </q-tooltip>
            </q-btn>

            <!-- Inactivar -->
            <q-btn
              v-if="row.status.id === 1"
              flat
              rounded
              size="14px"
              :icon="defaultIcons.pause"
              @click="changeStatus(row.id, row.status.id)"
            >
              <q-tooltip
                transition-show="flip-right"
                transition-hide="flip-left"
                class="primary"
              >
                <p class="q-ma-none text-body2">Inactivar</p>
              </q-tooltip>
            </q-btn>

            <!-- Activar -->
            <q-btn
              v-if="row.status.id === 2"
              flat
              rounded
              size="14px"
              :icon="defaultIcons.play"
              @click="changeStatus(row.id, row.status.id)"
            >
              <q-tooltip
                transition-show="flip-right"
                transition-hide="flip-left"
                class="primary"
              >
                <p class="q-ma-none text-body2">Activar</p>
              </q-tooltip>
            </q-btn>

            <!-- Cambiar contraseña -->
            <q-btn
              flat
              rounded
              size="14px"
              :icon="defaultIcons.lockOpen"
              @click="changePassword(row.id)"
            >
              <q-tooltip
                transition-show="flip-right"
                transition-hide="flip-left"
                class="primary"
              >
                <p class="q-ma-none text-body2">Cambiar contraseña</p>
              </q-tooltip>
            </q-btn>
          </template>
        </TableList>
        <div v-if="openModal">
          <ChangePasswordUserModal
            :showModal="true"
            @close="openModal = false"
            :user-id="userId"
          />
        </div>
      </section>
    </ContentComponent>
  </div>
</template>

<style lang="scss" src="./ListUserView.scss" scoped />
