<template>
  <div>
    <VCard class="q-pa-lg">
      <template #content-card>
        <div class="row q-col-gutter-x-lg q-col-gutter-y-lg text-black-90">
          <div class="col-12 col-md-3">
            <p class="text-weight-bold no-margin">Fecha de registro</p>
            <p class="text-weight-medium no-margin">
              {{ formData.request_date || '-' }}
            </p>
          </div>

          <div class="col-12 col-md-3">
            <p class="text-weight-bold no-margin">Número de operación</p>
            <p class="text-weight-medium no-margin">
              {{ formData.operation_number || '-' }}
            </p>
          </div>

          <div class="col-12 col-md-3">
            <p class="text-weight-bold no-margin">Plan de inversión</p>
            <p class="text-weight-medium no-margin">
              {{ formData.investment_plan || '-' }}
            </p>
          </div>

          <div class="col-12 col-md-3">
            <p class="text-weight-bold no-margin">Fecha de operación</p>
            <p class="text-weight-medium no-margin">
              {{ formData.compliance_date || '-' }}
            </p>
          </div>

          <div class="col-12 col-md-3">
            <p class="text-weight-bold no-margin">Código fondo de inversión</p>
            <p class="text-weight-medium no-margin">
              {{ formData.fund_code || '-' }}
            </p>
          </div>

          <div class="col-12 col-md-3">
            <p class="text-weight-bold no-margin">
              Descripción fondo de inversión
            </p>
            <p class="text-weight-medium no-margin">
              {{ formData.fund_name || '-' }}
            </p>
          </div>

          <div class="col-12 col-md-3">
            <p class="text-weight-bold no-margin">Negocio fondo</p>
            <p class="text-weight-medium no-margin">
              {{ formData.business_trust_name || '-' }}
            </p>
          </div>

          <div class="col-12 col-md-3">
            <p class="text-weight-bold no-margin">Operación</p>
            <p class="text-weight-medium no-margin">
              {{ formData.type || '-' }}
            </p>
          </div>

          <div class="col-12 col-md-3">
            <p class="text-weight-bold no-margin">Identificación titular</p>
            <p class="text-weight-medium no-margin">
              {{ formData.holder_identification || '-' }}
            </p>
          </div>

          <div class="col-12 col-md-3">
            <p class="text-weight-bold no-margin">Descripción titular</p>
            <p class="text-weight-medium no-margin">
              {{ formData.holder_name || '-' }}
            </p>
          </div>

          <div class="col-12 col-md-3">
            <p class="text-weight-bold no-margin">Negocio plan de inversión</p>
            <p class="text-weight-medium no-margin">
              {{ formData.plan_business_trust_code || '-' }}
            </p>
          </div>

          <div class="col-12 col-md-3">
            <p class="text-weight-bold no-margin">Oficina</p>
            <p class="text-weight-medium no-margin">
              {{ formData.office_code || '-' }}
            </p>
          </div>

          <div class="col-12 col-md-3">
            <p class="text-weight-bold no-margin">Descripción oficina</p>
            <p class="text-weight-medium no-margin">
              {{ formData.office || '-' }}
            </p>
          </div>

          <div class="col-12 col-md-3">
            <p class="text-weight-bold no-margin">
              Usuario que realiza operación
            </p>
            <p class="text-weight-medium no-margin">
              {{ formData.holder_name || '-' }}
            </p>
          </div>

          <div class="col-12 col-md-3">
            <p class="text-weight-bold no-margin">Valor de la operación</p>
            <p class="text-weight-medium no-margin">
              {{ formatCurrency(formData.operation_value) || '-' }}
            </p>
          </div>

          <div class="col-12 col-md-3">
            <p class="text-weight-bold no-margin">Anulado</p>
            <p class="text-weight-medium no-margin">
              {{ formData.closing_date ? 'Sí' : 'No' }}
            </p>
          </div>
        </div>
      </template>
    </VCard>

    <VCard class="q-pa-lg">
      <template #content-card>
        <section>
          <div class="row justify-between items-center q-pb-lg">
            <p class="text-black-90 no-margin text-weight-bold text-h6">
              {{ tableProps.title }}
            </p>
          </div>

          <VCard class="q-pa-lg">
            <template #content-card>
              <TableList
                hidePagination
                :loading="tableProps.loading"
                :columns="tableProps.columns"
                :rows="tableProps.rows"
                :hide-header="!tableProps.rows?.length"
                :custom-columns="['radio']"
                :rows-per-page-options="tableProps.rowsLength"
              >
                <template #radio="{ row }">
                  <RadioYesNo
                    v-model="row.selected"
                    :options="[{ label: '', value: true }]"
                    @update:model-value="selectDetail(row)"
                  />
                </template>

                <template #actions="{ row }">
                  <Button
                    :left-icon="defaultIconsLucide.eye"
                    color="orange"
                    :class-custom="'custom'"
                    :outline="false"
                    :flat="true"
                    colorIcon="#f45100"
                    tooltip="Ver"
                    @click="openDetailModal(row)"
                  />
                </template>

                <template v-if="tableProps.rows.length" #custom-bottom-row>
                  <q-tr>
                    <q-td colspan="4" style="height: 1.75rem" align="right">
                      <strong class="text-primary_fiduciaria">
                        Total operación
                      </strong>
                    </q-td>
                    <q-td colspan="5" style="height: 1.75rem">
                      <span>{{
                        `${formatCurrency(formData.maximum_value)}`
                      }}</span>
                    </q-td>
                  </q-tr>
                </template>
              </TableList>
            </template>
          </VCard>

          <div
            class="row q-col-gutter-x-lg q-col-gutter-y-lg"
            v-if="selectedRow?.id"
          >
            <div class="col-12 col-md-3">
              <p class="text-weight-bold no-margin">Banco de recaudo</p>
              <p class="text-weight-medium no-margin">
                {{ selectedRow.collection_bank_code || '-' }}
              </p>
            </div>

            <div class="col-12 col-md-3">
              <p class="text-weight-bold no-margin">Descripción banco</p>
              <p class="text-weight-medium no-margin">
                {{ selectedRow.collection_bank || '-' }}
              </p>
            </div>

            <div class="col-12 col-md-3">
              <p class="text-weight-bold no-margin">Cuenta de recaudo</p>
              <p class="text-weight-medium no-margin">
                {{ selectedRow.fic_account_number || '-' }}
              </p>
            </div>

            <div class="col-12 col-md-3">
              <p class="text-weight-bold no-margin">
                Descripción cuenta de recaudo
              </p>
              <p class="text-weight-medium no-margin">
                {{ selectedRow.fic_account || '-' }}
              </p>
            </div>

            <div class="col-12">
              <p class="text-weight-bold no-margin">Observaciones</p>
              <p class="text-weight-medium no-margin">
                {{ selectedRow.observation ?? 'Sin observaciones' }}
              </p>
            </div>
          </div>

          <div class="col-12">
            <q-separator class="q-my-md" />
          </div>
        </section>

        <section>
          <slot name="buttons" />
        </section>
      </template>
    </VCard>

    <AlertModalComponent
      ref="modalDetailRef"
      :show-img-default="false"
      marginTopBody=""
      title-header="Cuenta"
      styleModal="padding: 1vw; min-width: 400px; max-width: 500px"
    >
      <template #default-body>
        <div class="row q-col-gutter-x-lg q-col-gutter-y-lg text-black-90">
          <div class="col-12">
            <p class="text-weight-bold no-margin">
              Número de cuenta/plan de inversión
            </p>
            <p class="text-weight-medium no-margin">
              {{ selectedRow?.fic_account ?? '-' }}
            </p>
          </div>

          <div class="col-12">
            <p class="text-weight-bold no-margin">Fondo/banco</p>
            <p class="text-weight-medium no-margin">
              {{ selectedRow?.check_bank ?? '-' }}
            </p>
          </div>

          <div class="col-12">
            <p class="text-weight-bold no-margin">Tipo de cuenta*</p>
            <p class="text-weight-medium no-margin">
              {{ selectedRow?.collection_form ?? '-' }}
            </p>
          </div>

          <div class="col-12">
            <p class="text-weight-bold no-margin">Identificación titular*</p>
            <p class="text-weight-medium no-margin">
              {{ '-' }}
            </p>
          </div>

          <div class="col-12">
            <p class="text-weight-bold no-margin">Nombre titular</p>
            <p class="text-weight-medium no-margin">
              {{ '-' }}
            </p>
          </div>
        </div>
      </template>
    </AlertModalComponent>
  </div>
</template>
<script setup lang="ts">
// Components
import useViewOperationDetailForm from '@/components/Forms/Fics/InvestmentPlanOperations/View/ViewOperationForm'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import RadioYesNo from '@/components/common/RadioYesNo/RadioYesNo.vue'
import TableList from '@/components/table-list/TableList.vue'
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Interfaces
import { IMonetaryOperation } from '@/interfaces/customs/fics/InvestmentPlanOperations'

const props = withDefaults(
  defineProps<{
    data: IMonetaryOperation
  }>(),
  {}
)

const {
  formData,
  tableProps,
  selectedRow,
  selectDetail,
  formatCurrency,
  modalDetailRef,
  openDetailModal,
  defaultIconsLucide,
} = useViewOperationDetailForm(props)

defineExpose({
  formData,
})
</script>
