<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="goToURL('SeizuresList')"
    >
      <section class="q-my-md">
        <VCard>
          <template #content-card>
            <SeizuresForm
              :action="'view'"
              :data="formData"
              @onDownloadAttachment="handleDownloadAttachment"
            />
          </template>
        </VCard>
      </section>

      <section class="q-my-xl">
        <VCard>
          <template #content-card>
            <div class="q-px-xl q-pt-lg q-mb-lg">
              <p class="text-black text-weight-bold text-h6 q-mb-none">
                Histórico de gestiones
              </p>
            </div>

            <TableList
              :rows="historyTableProps.rows"
              :columns="historyTableProps.columns"
              :loading="historyTableProps.loading"
              :pages="historyPagination"
              :custom-columns="['actions']"
              @update-page="updateHistoryPage"
              @update-rows-per-page="updateHistoryRows"
            >
              <template #actions="{ row }">
                <Button
                  size="sm"
                  flat
                  outline
                  color="orange"
                  :left-icon="defaultIconsLucide.eye"
                  class-custom="custom"
                  @click="
                    goToURL(
                      'SeizuresViewManage',
                      { id: id },
                      {
                        type: row.seizure_procedure_type_id,
                        mode: 'view',
                        historyId: row.id,
                      }
                    )
                  "
                />
              </template>
            </TableList>
          </template>
        </VCard>
      </section>

      <section class="mx-2 mb-2 q-mt-lg">
        <div class="row justify-end q-gutter-md">
          <Button
            label="Gestionar"
            size="md"
            unelevated
            outline
            color="blue"
            :disable="!canManageSeizure"
            @click="manageModalRef?.openModal()"
          />

          <Button
            label="Finalizar"
            size="md"
            unelevated
            :outline="false"
            color="orange"
            class="text-capitalize btn-filter custom"
            :disable="!isLoaded"
            @click="goToURL('SeizuresList')"
          />
        </div>
      </section>
    </ContentComponent>
    <AlertModalComponent
      ref="manageModalRef"
      title="Realizar gestión"
      classTitle="mt-4 q-px-lg"
      styleModal="width: 360px"
      :showBtnCancel="false"
      :show-img-default="false"
      :showBtnConfirm="false"
    >
      <template #default-body>
        <div class="q-px-lg">
          <GenericSelectorComponent
            label="Gestión a realizar"
            :manual_option="procedures_type"
            map_options
            :required="true"
            :rules="[]"
            :default_value="selectedManagement"
            @update:modelValue="selectedManagement = $event"
          />
        </div>
      </template>

      <template #custom-actions>
        <Button
          label="Cancelar"
          flat
          :outline="false"
          @click="manageModalRef?.closeModal()"
        />

        <Button
          label="Aceptar"
          :outline="false"
          class="text-capitalize btn-filter custom"
          color="orange"
          :disable="!selectedManagement"
          @click="
            () => {
              handleAcceptManagement()
              manageModalRef?.closeModal()
            }
          "
        />
      </template>
    </AlertModalComponent>
  </div>
</template>

<script setup lang="ts">
// Components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import SeizuresForm from '@/components/Forms/Seizures/SeizuresForm/SeizuresForm.vue'

// logic view
import useSeizureView from '@/views/seizures/seizures/v1/view/SeizuresView'

const {
  headerProps,
  formData,
  historyTableProps,
  isLoaded,
  selectedManagement,
  procedures_type,
  historyPagination,
  manageModalRef,
  defaultIconsLucide,
  id,
  canManageSeizure,
  handleDownloadAttachment,
  updateHistoryPage,
  updateHistoryRows,
  goToURL,
  handleAcceptManagement,
} = useSeizureView()
</script>
