<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter('Accounting', 'ScheduleDeferralList', 'action_program')
          ? headerProps.btn.label
          : undefined
      "
      :btn-icon="headerProps.btn.icon"
      @to="handleGoTo('ScheduleDeferralCreate')"
    >
      <template #addBefore>
        <Button
          v-if="validateRouter('Accounting', 'ScheduleDeferralList', 'process')"
          :outline="false"
          :left-icon="defaultIconsLucide.cached"
          label="Procesar"
          color="orange"
          colorIcon="white"
          class-custom="custom full-width btn-header"
          @click="goToProcessDeferred()"
        />
      </template>
      <section class="q-mt-md">
        <FiltersComponent
          ref="filtersComponentRef"
          :fields="filterConfig"
          :buttons="['more_filters']"
          @filter="handleFilter"
          @update:values="updatedFilters"
          @show-more="handleShowFilters"
          @clear-filters="_cleanScheduleDeferralsData"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="['status', 'actions']"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #status="{ row }">
            <ShowStatus :type="Number(row?.status.id ?? 1)" />
          </template>
          <template #actions="{ row }">
            <Button
              v-if="
                validateRouter('Accounting', 'ScheduleDeferralList', 'show')
              "
              color="orange"
              colorIcon="#f45100"
              tooltip="Ver"
              :left-icon="defaultIconsLucide.eye"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              @click="
                $router.push({
                  name: 'ScheduleDeferralView',
                  params: {
                    id: row.id,
                  },
                })
              "
            />
            <Button
              v-if="
                row.status.id !== ScheduleDeferralStatusID.PROGRAMMED &&
                validateRouter('Accounting', 'ScheduleDeferralList', 'edit')
              "
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Editar"
              @click="
                $router.push({
                  name: 'ScheduleDeferralEdit',
                  params: {
                    id: row.id,
                  },
                })
              "
            />
            <Button
              v-if="
                row.status.id === ScheduleDeferralStatusID.PENDING &&
                validateRouter('Accounting', 'ScheduleDeferralList', 'process')
              "
              :left-icon="defaultIconsLucide.cached"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Procesar"
              @click="goToProcessDeferred(row)"
            />
          </template>
        </TableList>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components:
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import ShowStatus from '@/components/showStatus/ShowStatus.vue'
import Button from '@/components/common/Button/Button.vue'
// Utils
import { defaultIconsLucide } from '@/utils'
// Logic view
import useScheduleDeferralList from '@/views/accounting/schedule-deferral/v1/list/ScheduleDeferralList'
import { ScheduleDeferralStatusID } from '@/interfaces/global'

const {
  // Props
  headerProps,
  tableProps,
  filterConfig,
  filtersComponentRef,
  // Methods
  updatedFilters,
  handleFilter,
  handleGoTo,
  updatePage,
  updatePerPage,
  handleShowFilters,
  goToProcessDeferred,
  _cleanScheduleDeferralsData,
  validateRouter,
} = useScheduleDeferralList()
</script>
