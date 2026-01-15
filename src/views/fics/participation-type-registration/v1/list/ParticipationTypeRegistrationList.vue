<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      :btn-label="
        validateRouter('Fics', 'ParticipationTypeRegistrationList', 'create')
          ? 'Crear'
          : undefined
      "
      :btn-icon="defaultIconsLucide.plusCircleOutline"
      @to="handleCreate"
    >
      <FiltersComponent
        :fields="filters"
        @filter="handleFilter"
        @clear-filters="handleClearFilters"
      />

      <NoDataState
        v-if="isParticipationTypeEmpty"
        :type="showState === 0 ? 'empty' : 'no-results'"
      />

      <section v-else class="q-pt-md q-my-xl">
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :rows="tableProps.rows"
          :columns="tableProps.columns"
          :custom-columns="['actions']"
          :pages="tableProps.pages"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #actions="{ row }">
            <Button
              v-if="
                validateRouter(
                  'Fics',
                  'ParticipationTypeRegistrationList',
                  'edit'
                )
              "
              :left-icon="defaultIconsLucide.edit"
              color="orange"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Editar"
              @click="handleOptions('edit', row.id)"
            />
          </template>
        </TableList>
      </section>
    </ContentComponent>

    <ModalComponent
      v-model:openDialog="openFormModal"
      :title="
        formAction === 'create'
          ? 'Crear tipo de participación'
          : 'Editar tipo de participación'
      "
    >
      <template #content-modal>
        <InformationForm
          ref="formRef"
          :action="formAction"
          :data="formData"
          @update:data="formData = $event"
        />

        <div class="row q-mt-lg justify-end">
          <Button
            label="Cancelar"
            color="orange"
            class="text-capitalize btn-filter custom q-mr-md"
            outline
            @click="handleCancel"
          />
          <Button
            :label="formAction === 'create' ? 'Crear' : 'Actualizar'"
            :class-custom="'custom'"
            size="md"
            color="orange"
            :outline="false"
            @click="handleSubmit"
          />
        </div>
      </template>
    </ModalComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import InformationForm from '@/components/Forms/Fics/ParticipationTypeRegistration/Information/InformationForm.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import NoDataState from '@/components/common/NoDataState/NoDataState.vue'
import ModalComponent from '@/components/common/Modal/ModalComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'

// Logic view
import useParticipationTypeRegistrationList from '@/views/fics/participation-type-registration/v1/list/ParticipationTypeRegistrationList'

const {
  filters,
  formRef,
  formData,
  showState,
  tableProps,
  formAction,
  updatePage,
  headerProps,
  handleCreate,
  handleCancel,
  handleSubmit,
  handleFilter,
  updatePerPage,
  handleOptions,
  openFormModal,
  validateRouter,
  defaultIconsLucide,
  handleClearFilters,
  isParticipationTypeEmpty,
} = useParticipationTypeRegistrationList()
</script>
