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
          ref="filtersRef"
          :fields="filters"
          @filter="handleFilter"
          @clear-filters="handleClear"
          @update:values="onFilterChange"
        />
      </section>
      <div class="text-subtitle1 text-weight-bold">
        Listado de autorización de cuentas
      </div>
      <section class="q-mt-xl">
        <div class="q-pt-md q-my-xl">
          <TableList
            :loading="tableProps.loading"
            :columns="tableProps.columns"
            :rows="tableProps.rows"
            :pages="tableProps.pages"
            :custom-columns="['state', 'selected']"
            @update-page="updatePage"
            @update-rows-per-page="updatePerPage"
          >
            <template #state="{ row }">
              <ShowStatus :type="Number(row.state)" />
            </template>

            <template #selected="{ row }">
              <RadioYesNo
                v-model="row.selected"
                :required="true"
                :isRadioButton="false"
                :hasTitle="false"
                :hasSubtitle="false"
                :isDisabled="false"
              />
            </template>
          </TableList>
        </div>
      </section>

      <div v-if="tableProps.rows.length > 0" class="q-pa-md">
        <section class="q-mb-lg">
          <GenericInput
            label="Motivo de rechazo"
            :default_value="models.rejection_reason ?? ''"
            required
            type="textarea"
            :rules="[
                (val: string) => no_special_characters_extended(val),
                (val: string) => max_length(val, 150)
              ]"
            @update:model-value="models.rejection_reason = $event"
          />
        </section>

        <section class="q-my-lg">
          <div class="row justify-end q-gutter-md">
            <div class="col-auto">
              <Button
                :outline="true"
                label="Errores"
                class="mr-1"
                color="orange"
                class-custom="custom"
                :disable="!hasErrorsForDownload"
                @click="handleOptions('errores')"
              />
            </div>

            <div class="col-auto">
              <Button
                :outline="false"
                class-custom="custom"
                label="Autorizar"
                size="md"
                @click="handleOptions('autorizar')"
                color="orange"
              />
            </div>

            <div class="col-auto">
              <Button
                :outline="false"
                label="Rechazar"
                class="mr-1"
                @click="handleOptions('rechazar')"
              />
            </div>
          </div>
        </section>
      </div>

      <AlertModalComponent
        ref="alertModalRef"
        styleModal="min-width: 470px"
        :showImgDefault="false"
        :title="alertModalConfig.description"
        :description_message="''"
        @confirm="handleActions()"
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
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'

// Logic view
import { useAuthorizationAssignmentBankAccountsList } from '@/views/treasury/authorization-assignment-bank-accounts/v1/list/AuthorizationAssignmentBankAccountsList'

const {
  headerProps,
  filters,
  tableProps,
  filtersRef,
  alertModalRef,
  models,
  updatePage,
  updatePerPage,
  handleFilter,
  onFilterChange,
  handleOptions,
  no_special_characters_extended,
  max_length,
  handleActions,
  alertModalConfig,
  hasErrorsForDownload,
  handleClear,
} = useAuthorizationAssignmentBankAccountsList()
</script>
