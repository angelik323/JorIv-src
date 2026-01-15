<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="$router.push({ name: 'ValidationVoucherList' })"
    >
      <section class="q-my-md">
        <!--datos basicos-->
        <TabsComponent
          :tab-active="tabActive"
          :tabs="filteredTabs"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="tabActive = $event"
        />

        <VCard>
          <template #content-card>
            <div v-if="tabActive === 'information'">
              <validationVouchersForm
                ref="validationVouchersForm"
                :action="'create'"
                @update="handleFormUpdate"
              />
            </div>
            <!-- Buttons -->
            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  :outline="false"
                  :class-custom="'custom'"
                  label="Validar comprobante"
                  size="md"
                  color="orange"
                  @click="handleFormUpdate"
                />
              </div>
            </section>
          </template>
        </VCard>

        <VCard>
          <template #content-card>
            <div class="card-status">
              <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
                <section>
                  <div class="col-12 col-md-4">
                    <p class="text-weight-medium mb-0" :class="'text-grey-6'">
                      Estado
                    </p>
                    <GenericInput
                      ref="purposeRef"
                      :required="true"
                      disabled
                      placeholder="-"
                      :default_value="models.status ?? '-'"
                    />
                  </div>
                </section>
              </div>
              <q-separator spaced />
            </div>

            <section v-if="viewTable" class="q-mt-xl table">
              <TableList
                :loading="tablePropsErrors.loading"
                :columns="tablePropsErrors.columns"
                :rows="tablePropsErrors.rows"
                :custom-columns="['status', 'actions']"
                hide-pagination
              >
                <template #custom-header>
                  <div class="row q-col-gutter-sm" style="width: 100%">
                    <div
                      class="col-xs-12 col-sm-12 col-md-9 col-lg-10 self-center"
                    >
                      <p class="q-my-none text-weight-medium text-h5">
                        {{ tablePropsErrors.title }}
                      </p>
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-3 col-lg-2">
                      <div class="row justify-end">
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
                          @click="downloadAction"
                        />
                      </div>
                    </div>
                  </div>
                </template>
              </TableList>
            </section>
            <section class="mx-4 mb-4">
              <div class="row justify-end q-gutter-md">
                <Button
                  :outline="false"
                  :class-custom="'custom'"
                  :disabled="validateButton"
                  label="crear"
                  size="md"
                  color="orange"
                  @click="createValidation"
                />
              </div>
            </section>
          </template>
        </VCard>
      </section>
    </ContentComponent>
  </div>
</template>

<style lang="css">
.card-status {
  padding: 20px;
}

.table {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 20px;
  margin: 20px;
  padding: 20px;
}
</style>
<script setup lang="ts">
import Button from '@/components/common/Button/Button.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import imgButtonHeaderTable from '@/assets/images/excel.svg'
import ValidationVouchersForm from '@/components/Forms/ValidationVouchers/ValidationVouchersForm.vue'
import useValidationVouchersCreate from '@/views/validation-vouchers/v1/create/ValidationVouchersCreate'
import GenericInput from '@/components/common/GenericInput/GenericInputComponent.vue'

const {
  models,
  headerProps,
  filteredTabs,
  tabActive,
  tabActiveIdx,
  viewTable,
  validateButton,
  tablePropsErrors,
  validationVouchersForm,
  createValidation,
  downloadAction,
  handleFormUpdate,
} = useValidationVouchersCreate()
</script>
