<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps?.title"
      :subtitle="headerProps?.subtitle"
      :breadcrumbs="headerProps.breadcrumbs"
    >
      <section class="q-mt-md">
        <FiltersComponent @filter="handleFilter" @clear-filters="handleClear" />
      </section>

      <section class="q-mt-xl q-pt-xl">
        <Statistics :stats="statsProps ?? []" />
      </section>

      <section class="q-mt-xl">
        <TableList
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="['status_id', 'actions']"
          @update-page="updatePage"
          @updateRowsPerPage="updateRows"
        >
          <!-- Custom title table -->
          <template #custom-header>
            <div class="row q-col-gutter-sm" style="width: 100%">
              <div class="col-xs-12 col-sm-12 col-md-9 col-lg-10 self-center">
                <p class="q-my-none text-weight-medium text-h5">
                  {{ tableProps.title }}
                </p>
              </div>
            </div>
          </template>

          <template #status_id="{ row }">
            <ShowStatus
              :type="Number(row?.status_id ?? 1)"
              class-custom="q-px-sm q-py-xs"
            />
          </template>

          <template #actions="{ row }">
            <!-- Ver -->
            <Button
              v-if="validateRouter('Users', 'ListUserView', 'show')"
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Ver"
              @click="
                $router.push({ name: 'ReadUserView', params: { id: row.id } })
              "
            />

            <!-- Editar -->
            <Button
              v-if="validateRouter('Users', 'ListUserView', 'edit')"
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Editar"
              @click="
                $router.push({ name: 'EditUserView', params: { id: row.id } })
              "
            />
          </template>
        </TableList>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components:
import FiltersComponent from '@/components/common/Filters/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import ShowStatus from '@/components/showStatus/ShowStatus.vue'
import TableList from '@/components/table-list/TableList.vue'
import Statistics from '@/components/common/Statistics/Statistics.vue'
import Button from '@/components/common/Button/Button.vue'

// Logic view
import useUserList from '@/views/user-manager/v2/list/UserList'
import { defaultIconsLucide } from '@/utils'

const {
  headerProps,
  tableProps,
  statsProps,

  // Methods
  handleFilter,
  handleClear,
  updatePage,
  updateRows,
  validateRouter,
} = useUserList()
</script>
