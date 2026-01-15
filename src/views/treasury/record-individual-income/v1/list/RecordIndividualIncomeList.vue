<template>
  <div class="q-px-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProperties.title"
      :breadcrumbs="headerProperties.breadcrumbs"
    >
    </ContentComponent>
    <section class="q-my-md">
      <Card>
        <template #content-card>
          <RecordIndividualIncomeFilterForm
            ref="formFilterRef"
            :created-list-data="createdListData"
          />

          <section class="mx-2 mb-4">
            <div class="row justify-end q-gutter-md">
              <Button
                :left-icon="defaultIconsLucide.reload"
                label="Limpiar"
                size="md"
                outline
                unelevated
                color-icon="#762343"
                @click="clearFilter()"
                :disabled="createdListData"
              />
              <Button
                label="Continuar"
                size="md"
                :outline="false"
                unelevated
                color="orange"
                class="text-capitalize btn-filter custom"
                @click="continueToCreate()"
                :disabled="createdListData"
              />
            </div>
          </section>
        </template>
      </Card>

      <section class="mb-4" v-if="createdListData">
        <div class="row justify-end q-gutter-md">
          <Button
            v-if="
              validateRouter('Treasury', 'RecordIndividualIncomeList', 'create')
            "
            no-caps
            unelevated
            label="Agregar"
            :leftIcon="defaultIconsLucide.plusCircle"
            :color-icon="'white'"
            :text-color="'white'"
            :outline="false"
            :color="'primary'"
            @click="$router.push({ name: 'RecordIndividualIncomeCreate' })"
          />
        </div>
        <TableList
          :title="tableProps.title"
          :loading="tableProps.loading"
          :rows="tableProps.rows"
          :columns="tableProps.columns"
          :custom-columns="['status', 'actions']"
          :pages="tableProps.pages"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #actions="{ row }">
            <Button
              v-if="
                validateRouter('Treasury', 'RecordIndividualIncomeList', 'show')
              "
              :left-icon="defaultIconsLucide.eye"
              color="orange"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              colorIcon="#f45100"
              tooltip="Ver"
              @click="openModalView(row.id)"
            />

            <Button
              v-if="
                validateRouter('Treasury', 'RecordIndividualIncomeList', 'edit')
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
                  name: 'RecordIndividualIncomeEdit',
                  params: { id: row.id },
                })
              "
            />

            <Button
              v-if="
                validateRouter(
                  'Treasury',
                  'RecordIndividualIncomeList',
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
              @click="openAlertModal('eliminar', row.id)"
            />
          </template>
        </TableList>

        <section>
          <div class="row q-col-gutter-lg mt-0">
            <div class="col-md-6">
              <CurrencyInput
                :hide-icon="true"
                v-model="models.calculated_local_total"
                :currency="'COP'"
                label="Valor total local"
                placeholder="-"
                :disabled="true"
                :required="false"
              />
            </div>

            <div class="col-md-6">
              <CurrencyInput
                :hide-icon="true"
                v-model="models.calculated_foreign_total"
                :currency="'COP'"
                label="Valor total moneda extranjera"
                placeholder="-"
                :disabled="true"
                :required="false"
              />
            </div>
          </div>
          <div class="row justify-end mt-2">
            <Button
              label="Confirmar"
              size="md"
              unelevated
              :outline="false"
              color="orange"
              class="text-capitalize btn-filter custom"
              @click="openAlertModal('confirmar', null)"
            />
          </div>
        </section>

        <ModalView
          title="Descripción"
          classTitle="text-h6 text-weight-bold"
          :openDialog="showModalView"
          :minWidth="$q.screen.width <= 607 ? '100%' : '70%'"
          @update:openDialog="closeModalView()"
        >
          <template #content-modal>
            <RecordIndividualIncomeDetailForm
              :action="'view'"
              :data="data_detail_view"
            />
          </template>
        </ModalView>

        <AlertModalComponent
          ref="alertModalDeleteRef"
          :title="alertModalConfig.title"
          @confirm="deleteAction"
        >
        </AlertModalComponent>
        <AlertModalComponent
          ref="alertModalConfirmRef"
          :title="alertModalConfig.title"
          @confirm="confirmAction"
        >
        </AlertModalComponent>
      </section>
    </section>
  </div>
</template>

<script setup lang="ts">
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import Card from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import TableList from '@/components/table-list/TableList.vue'
import ModalView from '@/components/common/Modal/ModalComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import { defaultIconsLucide } from '@/utils'
import RecordIndividualIncomeFilterForm from '@/components/Forms/Treasury/RecordIndividualIncome/Filters/RecordIndividualIncomeFilterForm.vue'
import RecordIndividualIncomeDetailForm from '@/components/Forms/Treasury/RecordIndividualIncome/Detail/RecordIndividualIncomeDetailForm.vue'
import useRecordIndividualIncomeList from './RecordIndividualIncomeList'
import CurrencyInput from '@/components/common/CurrencyInput/CurrencyInput.vue'

const {
  headerProperties,
  clearFilter,
  continueToCreate,
  formFilterRef,
  tableProps,
  createdListData,
  alertModalConfig,
  alertModalDeleteRef,
  alertModalConfirmRef,
  openModalView,
  closeModalView,
  showModalView,
  openAlertModal,
  deleteAction,
  confirmAction,
  updatePage,
  updatePerPage,
  models,
  data_detail_view,
  validateRouter,
} = useRecordIndividualIncomeList()
</script>
