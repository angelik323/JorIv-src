<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
      show-back-btn
      @on-back="goToURL('RetentionGroupList')"
    >
      <section class="q-mt-md">
        <FiltersComponent
          ref="filterComponentRef"
          :fields="filterConfig"
          trigger_event_by_field
          @filter="handleFilterSearch"
          @clear-filters="handleClearFilters"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="tableProperties.title"
          :loading="tableProperties.loading"
          :columns="tableProperties.columns"
          :rows="tableProperties.rows"
          :pages="tableProperties.pages"
          :custom-columns="['actions']"
          @update-page="updatePage"
          @update-rows-per-page="updateRowsPerPage"
        >
          <template #actions="{ row }">
            <Button
              :left-icon="defaultIconsLucide.eye"
              color="primary"
              :class-custom="'custom'"
              :flat="true"
              :outline="false"
              colorIcon="#f45100"
              :tooltip="'Ver'"
              @click="goToView(row)"
            />

            <Button
              :left-icon="defaultIconsLucide.emailOutline"
              color="primary"
              :class-custom="'custom'"
              :flat="true"
              :outline="false"
              colorIcon="#f45100"
              :tooltip="'Enviar correo'"
              @click="openSendModal(row.id)"
            />
          </template>
        </TableList>
      </section>
    </ContentComponent>
    <AlertModalComponent
      ref="alertModalRef"
      styleModal="min-width: 480px"
      :title="alertModalConfig.title"
      @confirm="handleSendEmail"
    />
  </div>
</template>
<script setup lang="ts">
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// Logic view
import { useGenerationRetentionCertificateList } from '@/views/normative/generation-certificate/retention/list/detail/RetentionDetailList'

const {
  defaultIconsLucide,
  headerProperties,
  tableProperties,
  filterComponentRef,
  filterConfig,

  alertModalRef,
  alertModalConfig,
  //validateRouter,
  goToURL,
  handleClearFilters,
  handleFilterSearch,
  updatePage,
  updateRowsPerPage,
  goToView,
  handleSendEmail,
  openSendModal,
} = useGenerationRetentionCertificateList()
</script>
