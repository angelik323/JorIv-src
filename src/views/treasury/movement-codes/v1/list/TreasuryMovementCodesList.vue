<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="validateRouter('Treasury', 'TreasuryMovementCodesList', 'create') ? 'Crear' : undefined"
      @to="handlerGoTo('TreasuryMovementCodesCreate')"
    >
      <section>
        <FiltersComponentV2
          @filter="handleFilter"
          :fields="filters"
          @clear-filters="handleClear"
        />
      </section>
      <section class="q-mt-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :columns="tableProps.columns"
          :custom-columns="['status', 'actions']"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #actions="{ row }">
            <Button
              v-if="validateRouter('Treasury', 'TreasuryMovementCodesList', 'show')"
              :right-icon="defaultIconsLucide.eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Ver"
              @click="
                $router.push({
                  name: 'TreasuryMovementCodesView',
                  params: { id: row.id },
                })
              "
            />
            <Button
              v-if="validateRouter('Treasury', 'TreasuryMovementCodesList', 'edit')"
              :right-icon="defaultIconsLucide.edit"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Editar"
              @click="
                () =>
                  $router.push({
                    name: 'TreasuryMovementCodesEdit',
                    params: { id: row.id },
                    query: { code: row.code },
                  })
              "
            />
            <Button
              v-if="validateRouter('Treasury', 'TreasuryMovementCodesList', 'delete')"
              :right-icon="defaultIconsLucide.delete"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Eliminar"
              @click="openAlertModal(row.id)"
            />
          </template>
        </TableList>
      </section>
      <AlertModalComponent
        ref="alertModalRef"
        styleModal="max-width: 400px; flex-direction: row;"
        :showImgDefault="false"
        :title="alertModalConfig.description"
        :description_message="''"
        @confirm="changeStatus()"
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
<script lang="ts" setup>
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import useTreasureMovementCodesList from './TreasuryMovementCodesList'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
const {
  headerProps,
  tableProps,
  alertModalConfig,
  alertModalRef,
  defaultIconsLucide,
  filters,
  handlerGoTo,
  openAlertModal,
  updatePage,
  updatePerPage,
  changeStatus,
  handleClear,
  handleFilter,
  validateRouter
} = useTreasureMovementCodesList()
</script>

<style lang="scss" src="./TreasuryMovementCodesList.scss" />
