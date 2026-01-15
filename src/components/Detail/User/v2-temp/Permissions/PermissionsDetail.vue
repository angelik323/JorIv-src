<script lang="ts" setup>
// Components
import FiltersComponent from '@/components/common/Filters/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
// Logic
import { usePermissionsDetail } from '@/components/Detail/User/v2-temp/Permissions/PermissionsDetail'

const { defaultIcons, tableProperties, filterPermissionList, clearFilters } =
  usePermissionsDetail()
</script>
<template>
  <section>
    <div class="q-mx-md q-mt-lg">
      <div class="row q-px-md q-col-gutter-md">
        <div class="col-12">
          <p class="text-black-10 text-weight-bold text-h6 mb-0">
            Permisos del usuario
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Permissions Filter: -->
  <section class="q-mx-md q-mt-lg">
    <div class="q-px-md">
      <FiltersComponent
        @filter="filterPermissionList"
        @clear-filters="clearFilters"
      />
    </div>
  </section>

  <!-- Permissions List -->
  <section class="q-mx-md q-mt-xl">
    <div class="q-px-md q-pa-sm">
      <TableList
        :title="tableProperties.title"
        :loading="tableProperties.loading"
        :rows="tableProperties.rows"
        :columns="tableProperties.columns"
        :rows-per-page-options="tableProperties.rowsLength"
        :hide-bottom="tableProperties.hiddeQta"
        :custom-columns="['status']"
      >
        <template #status="{ row }">
          <q-badge
            v-if="row.status_id === 1"
            class="justify-center"
            style="
              background: #e7ffe4;
              color: #333742;
              width: 8em !important;
              height: 2em !important;
              border-radius: 200px;
              justify-content: space-around;
            "
          >
            Permitido
            <q-icon
              :name="defaultIcons?.checkCircle"
              style="color: #39ba2e"
              class="pl-1"
              size="xs"
            />
          </q-badge>
          <q-badge
            v-if="row.status_id === 2"
            class="justify-center"
            style="
              background: #ffeaeb;
              color: #333742;
              width: 8em !important;
              height: 2em !important;
              border-radius: 200px;
              justify-content: space-around;
            "
          >
            No permitido
            <q-icon
              :name="defaultIcons?.closeCircle"
              style="color: #d20008"
              class="pl-1"
              size="xs"
            />
          </q-badge>
        </template>
      </TableList>
    </div>
    <q-separator />
  </section>
</template>
