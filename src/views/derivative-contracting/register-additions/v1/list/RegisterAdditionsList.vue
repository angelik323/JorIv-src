<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
    >
      <section class="q-mt-md">
        <FiltersComponentV2
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="handleClear"
        />
      </section>

      <section class="q-mt-xl">
        <TableList
          :title="tablePropsContracts.title"
          :loading="tablePropsContracts.loading"
          :columns="tablePropsContracts.columns"
          :rows="tablePropsContracts.rows"
          :pages="tablePropsContracts.pages"
          :custom-columns="['select', 'status_id']"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #select="{ row }">
            <div class="px-1 flex justify-center">
              <q-radio
                dense
                size="sm"
                v-model="selectedRow"
                :val="row.id"
                color="orange"
              />
            </div>
          </template>

          <template #status_id="{ row }">
            <ShowStatus :type="row.status_id" />
          </template>
        </TableList>
      </section>

      <section class="q-mt-xl" v-if="tablePropsContracts.rows.length > 0">
        <TableList
          :title="tablePropsAdditions.title"
          :loading="tablePropsAdditions.loading"
          :columns="tablePropsAdditions.columns"
          :rows="tablePropsAdditions.rows"
          :pages="tablePropsAdditions.pages"
          :custom-columns="['actions', 'status_id']"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #custom-header-action>
            <Button
              v-if="
                validateRouter(
                  'DerivativeContracting',
                  'RegisterAdditionsList',
                  'create'
                )
              "
              :outline="false"
              :label="'Crear'"
              :class-custom="'items-center'"
              :left-icon="defaultIconsLucide.plusCircleOutline"
              color-icon="white"
              @click="goToURL('RegisterAdditionsCreate', selectedRow ?? 0)"
              :disabled="!selectedRow"
            />
          </template>
          <template #status_id="{ row }">
            <ShowStatus :type="row.status_id" />
          </template>

          <template #actions="{ row }">
            <Button
              v-if="
                validateRouter(
                  'DerivativeContracting',
                  'RegisterAdditionsList',
                  'show'
                )
              "
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Ver"
              @click="
                goToURL('RegisterAdditionsRead', {
                  id: row.id,
                  contract_id: selectedRow,
                })
              "
            />

            <Button
              v-if="
                validateRouter(
                  'DerivativeContracting',
                  'RegisterAdditionsList',
                  'edit'
                )
              "
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              class-custom="custom"
              :outline="false"
              flat
              colorIcon="#f45100"
              tooltip="Editar"
              @click="
                goToURL('RegisterAdditionsEdit', {
                  id: row.id,
                  contract_id: selectedRow,
                })
              "
            />

            <Button
              v-if="
                validateRouter(
                  'DerivativeContracting',
                  'RegisterAdditionsList',
                  'delete'
                )
              "
              :left-icon="defaultIconsLucide.trash"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Eliminar"
              @click="openDeleteModal(row)"
            />
          </template>
        </TableList>
      </section>
    </ContentComponent>

    <AlertModalComponent
      ref="deleteModalRef"
      styleModal="min-width: 480px"
      title="¿Desea eliminar el registro de adición seleccionado?"
      :show-img-default="false"
      @confirm="confirmDeleteAction"
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
  </div>
</template>

<script setup lang="ts">
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'

// Logic view
import useRegisterAdditions from '@/views/derivative-contracting/register-additions/v1/list/RegisterAdditionsList'
import Button from '@/components/common/Button/Button.vue'

const {
  headerProps,
  tablePropsContracts,
  tablePropsAdditions,
  filterConfig,
  deleteModalRef,
  defaultIconsLucide,
  selectedRow,
  openDeleteModal,
  goToURL,
  confirmDeleteAction,
  handleClear,
  updatePerPage,
  handleFilter,
  updatePage,
  validateRouter,
} = useRegisterAdditions()
</script>
