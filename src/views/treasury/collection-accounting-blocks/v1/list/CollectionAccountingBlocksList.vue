<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      btn-label="Crear"
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="goToURL('CollectionAccountingBlocksCreate')"
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
          :title="tableProps.title"
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="['select', 'actions']"
          @update-page="updatePage"
          @update-rows-per-page="updateRowsPerPage"
        >
          <template #select="{ row }">
            <div class="px-1 flex justify-center">
              <q-radio
                dense
                size="sm"
                v-model="collectionAccountingBlockSelected"
                :val="row.id"
                color="orange"
              />
            </div>
          </template>
          <template #actions="{ row }">
            <Button
              v-if="
                validateRouter(
                  'Treasury',
                  'CollectionAccountingBlocksList',
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
              @click="handleView(row.id)"
            />

            <Button
              :left-icon="defaultIconsLucide.briefcase"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Consultar negocio"
              @click="handleBusiness(row.id)"
            />

            <Button
              v-if="
                validateRouter(
                  'Treasury',
                  'CollectionAccountingBlocksList',
                  'delete'
                )
              "
              :left-icon="defaultIconsLucide.delete"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Eliminar"
              @click="handleDelete(row.id)"
            />
          </template>
        </TableList>
      </section>

      <div class="col-12 row justify-between" v-if="collectionAccountingBlockSelected">
        <p class="text-black-90 text-weight-bold text-h6">Parámetros</p>

        <Button
          class-custom="custom"
          :outline="true"
          label="Descargar excel"
          color="orange"
          :styleContent="{
            'place-items': 'center',
            color: 'black',
          }"
          :left-img="imgButtonHeaderTable"
          @click="downloadFile"
        />
      </div>

      <section class="q-mt-lg" v-if="collectionAccountingBlockSelected">
        <TabsComponent
          :tabs="filteredTabs"
          :tab-active="tabActive"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="tabActive = $event"
          @update:tab-active-idx="tabActiveIdx = $event"
        />

        <VCard>
          <template #content-card>
            <section v-if="tabActive === 'acounting-collection-param'">
              <CollectionParametersList :controls="true" v-model:data="collectionAccountingBlockSelected" />
            </section>

            <section v-if="tabActive === 'commission'">
              <CommissionList :controls="true" v-model:data="collectionAccountingBlockSelected" />
            </section>

            <section v-if="tabActive === 'commission-param'">
              <CommissionParametersList :controls="true" v-model:data="collectionAccountingBlockSelected" />
            </section>
          </template>
        </VCard>
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

      <AlertModalComponent
        ref="alertModalAssociatedBusinessesRef"
        marginTopBody="mt-0 "
        marginTopActions="mt-0"
        classTitle="mt-0"
        styleModal="min-width: 80%"
        :showImgDefault="false"
        :title="alertModalAssociatedBusinessesConfig.title"
        :description_message="''"
        @confirm="alertModalAssociatedBusinessesRef.closeModal()"
      >
        <template #default-body>
          <AssociatedBusinessesList :action="'view'" v-model:data="alertModalAssociatedBusinessesConfig.id"/>
        </template>
      </AlertModalComponent>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import imgButtonHeaderTable from '@/assets/images/excel.svg'

import CollectionParametersList from '@/components/Lists/Treasury/CollectionAcountingBlocks/CollectionParameters/CollectionParametersList.vue'
import CommissionList from '@/components/Lists/Treasury/CollectionAcountingBlocks/Commission/CommissionList.vue'
import CommissionParametersList from '@/components/Lists/Treasury/CollectionAcountingBlocks/CommissionParameters/CommissionParametersList.vue'

import AssociatedBusinessesList from '@/components/Lists/Treasury/CollectionAcountingBlocks/AssociatedBussinesses/AssociatedBusinessesList.vue'

import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

import useCollectionAccountingBlocksList from './CollectionAccountingBlocksList'

const {
  headerProps,
  defaultIconsLucide,
  filterConfig,
  tableProps,
  alertModalRef,
  alertModalConfig,
  alertModalAssociatedBusinessesRef,
  alertModalAssociatedBusinessesConfig,

  collectionAccountingBlockSelected,
  filteredTabs,
  tabActive,
  tabActiveIdx,

  handleFilter,
  handleClear,
  handleView,
  handleBusiness,
  handleDelete,
  changeStatus,
  downloadFile,
  updatePage,
  updateRowsPerPage,
  goToURL,
  validateRouter,
} = useCollectionAccountingBlocksList()
</script>
