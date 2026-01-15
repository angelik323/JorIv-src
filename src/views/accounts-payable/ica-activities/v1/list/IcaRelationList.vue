<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :show-back-btn="true"
      @on-back="goToURL('IcaActivitiesList')"
    >
      <template #addBefore>
        <div class="btn-move-md">
          <Button
            :outline="false"
            :label="headerProps.btn.label"
            color-icon="white"
            :left-icon="headerProps.btn.icon"
            :styleContent="{ 'place-items': 'center', padding: '0.3rem' }"
            :disabled="false"
            @click="handleCreate"
          />
        </div>
      </template>

      <section>
        <FiltersComponentV2
          :fields="filterConfig"
          @filter="handleFilter"
          @clear-filters="handleClearFilters"
        />
      </section>

      <NoDataState
        v-if="isListEmpty"
        :type="!showState ? 'empty' : 'no-results'"
      />

      <TableList
        v-else
        :title="tableProps.title"
        :loading="tableProps.loading"
        :columns="tableProps.columns"
        :rows="tableProps.rows"
        :pages="tableProps.pages"
        :custom-columns="['actions']"
        @update-page="updatePage"
        @update-rows-per-page="updatePerPage"
      >
        <template #actions="{ row }">
          <!-- Editar -->
          <Button
            v-if="
              validateRouter('AccountsPayable', 'IcaActivitiesList', 'edit')
            "
            :left-icon="defaultIconsLucide.edit"
            color="orange"
            :class-custom="'custom'"
            :outline="false"
            :flat="true"
            tooltip="Editar"
            @click="handleEdit(row.id)"
          />

          <!-- Eliminar -->
          <Button
            v-if="
              validateRouter('AccountsPayable', 'IcaActivitiesList', 'delete')
            "
            :outline="false"
            :left-icon="defaultIconsLucide.trash"
            color="orange"
            :flat="true"
            :class-custom="'custom'"
            tooltip="Eliminar"
            @click="openDeleteModal(row.id)"
          />
        </template>
      </TableList>

      <AlertModalComponent
        ref="alertModalFormRef"
        styleModal="min-width: 470px"
        marginTopBody="mt-0"
        :show-img-default="false"
        class-title="mt-0"
        :title-header="alertModalFormConfig.title"
        :textBtnConfirm="alertModalFormConfig.textBtnConfirm"
        :textBtnCancel="alertModalFormConfig.textBtnCancel"
        @confirm="handleAction()"
      >
        <template #default-body>
          <div class="text-left mx-1 q-px-lg">
            <p class="text-grey-6">{{ alertModalFormConfig.description }}</p>

            <q-form ref="formRef">
              <div>
                <GenericSelectorComponent
                  label="Ciudad"
                  :default_value="models.city_id"
                  :manual_option="models.id ? citiesAssociated : cities"
                  :auto_complete="true"
                  :required="true"
                  :map_options="true"
                  :disabled="models.id ? true : false"
                  :rules="[(val: string) => is_required(val, 'La ciudad es requerida')]"
                  @update:model-value="models.city_id = $event"
                />
              </div>

              <div>
                <GenericSelectorComponent
                  label="NIT tercero"
                  :default_value="models.third_party_id"
                  :manual_option="third_parties"
                  :auto_complete="true"
                  :required="true"
                  :map_options="true"
                  :rules="[(val: string) => is_required(val, 'El tercero es requerido')]"
                  @update:model-value="changeThirdPartyNit($event)"
                />
              </div>

              <div>
                <GenericSelectorComponent
                  label="Periodicidad"
                  :default_value="models.periodicity"
                  :manual_option="periodicityList"
                  :auto_complete="true"
                  :required="true"
                  :map_options="true"
                  :rules="[(val: string) => is_required(val, 'La periodicidad es requerida')]"
                  @update:model-value="changePeriodicity($event)"
                />
              </div>
            </q-form>
          </div>
        </template>
      </AlertModalComponent>

      <AlertModalComponent
        ref="alertModalRef"
        styleModal="min-width: 470px"
        :showImgDefault="false"
        :title="alertModalConfig.description"
        :textBtnConfirm="alertModalConfig.textBtnConfirm"
        :textBtnCancel="alertModalConfig.textBtnCancel"
        @confirm="handleDelete()"
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

<script lang="ts" setup>
// components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'

// styles
import '@/views/accounts-payable/ica-activities/v1/list/IcaRelationList.scss'

// logic view
import useIcaRelationsList from '@/views/accounts-payable/ica-activities/v1/list/IcaRelationList'

const {
  // configs
  headerProps,
  filterConfig,
  tableProps,
  alertModalConfig,
  alertModalFormConfig,

  // selects
  cities,
  citiesAssociated,
  third_parties,
  periodicityList,

  // refs
  models,
  isListEmpty,
  showState,
  alertModalRef,
  alertModalFormRef,
  formRef,

  // utils
  defaultIconsLucide,

  // methods
  handleFilter,
  handleClearFilters,
  handleDelete,
  openDeleteModal,
  updatePage,
  updatePerPage,
  goToURL,
  validateRouter,
  handleCreate,
  handleEdit,
  handleAction,
  changeThirdPartyNit,
  changePeriodicity,
  is_required,
} = useIcaRelationsList()
</script>
