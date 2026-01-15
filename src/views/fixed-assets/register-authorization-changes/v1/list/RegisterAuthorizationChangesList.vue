<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
    >
      <template #addAfter>
        <Button
          :label="headerProperties.btn.label"
          :icon="headerProperties.btn.icon"
          :color="headerProperties.btn.color"
          :size="headerProperties.btn.size"
          :class-custom="headerProperties.btn.class"
          :disabled="headerProperties.btn.disable"
          :outline="headerProperties.btn.outline"
          color-icon="white"
          @click="goToURL(headerProperties.btn.routeName)"
        />
      </template>

      <section class="q-mt-md">
        <FiltersComponent
          ref="filterComponentRef"
          :fields="filterConfig"
          @filter="handleFilterSearch"
          @clear-filters="handleClearFilters"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :loading="tableProperties.loading"
          :columns="tableProperties.columns"
          :rows="tableProperties.rows"
          :pages="tableProperties.pages"
          :custom-columns="['actions', 'novelty_status']"
          @update-page="updatePage"
          @update-rows-per-page="updateRowsPerPage"
        >
          <template #novelty_status="{ row }">
            <ShowStatus :type="row?.novelty_status?.id ?? 1" />
          </template>

          <template #actions="{ row }">
            <Button
              :left-icon="defaultIconsLucide.eye"
              flat
              :outline="false"
              tooltip="Ver"
              @click="goToURL('RegisterAuthorizationChangesView', row.id)"
            />

            <Button
              :left-icon="defaultIconsLucide.edit"
              flat
              :outline="false"
              tooltip="Editar"
              @click="
                goToURL('RegisterAuthorizationChangesEdit', { id: row.id })
              "
            />

            <Button
              :left-icon="defaultIconsLucide.checkCircle"
              flat
              color="green"
              :outline="false"
              tooltip="Autorizar"
              @click="openAuthorizeModal(row)"
            />

            <Button
              :left-icon="defaultIconsLucide.closeCircle"
              flat
              color="red"
              :outline="false"
              tooltip="Anular"
              @click="openCancelModal(row)"
            />
          </template>
        </TableList>
      </section>
      <AlertModalComponent
        ref="confirmModalRef"
        :title="confirmModalTitle"
        :description_message="confirmModalMessage"
        textBtnConfirm="Aceptar"
        textBtnCancel="Cancelar"
        @confirm="confirmAction"
      >
        <template #default-body>
          <div v-if="selectedNovelty" class="q-mt-sm q-px-lg">
            <p>
              <strong>Código novedad:</strong>
              {{ selectedNovelty.novelty_code }}
            </p>

            <p style="word-break: break-word; overflow-wrap: anywhere">
              <strong>Descripción:</strong>
              {{ selectedNovelty.novelty_description }}
            </p>

            <p>
              <strong>Activo asociado:</strong>
              {{ selectedNovelty.asset_status?.status ?? '-' }}
            </p>

            <p>
              <strong>Tipo de novedad:</strong>
              {{ selectedNovelty.novelty_type?.description ?? '-' }}
            </p>
          </div>
        </template>
      </AlertModalComponent>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import ShowStatus from '@/components/showStatus/ShowStatus.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// Composable
import useFixedAssetsNoveltiesList from '@/views/fixed-assets/register-authorization-changes/v1/list/RegisterAuthorizationChangesList'

const {
  defaultIconsLucide,
  headerProperties,
  tableProperties,
  filterComponentRef,
  filterConfig,
  confirmModalRef,
  confirmModalTitle,
  confirmModalMessage,
  selectedNovelty,
  goToURL,
  handleClearFilters,
  handleFilterSearch,
  updatePage,
  updateRowsPerPage,
  openAuthorizeModal,
  openCancelModal,
  confirmAction,
} = useFixedAssetsNoveltiesList()
</script>
