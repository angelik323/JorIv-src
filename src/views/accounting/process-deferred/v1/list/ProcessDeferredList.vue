<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="$router.push({ name: 'ScheduleDeferralList' })"
    >
      <section class="q-mt-md">
        <TabsComponent
          :tab-active="tabActive"
          :tabs="filteredTabs"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="tabActive = $event"
        />
        <VCard class="q-mb-sm" custom-style="margin-bottom: 24px">
          <template #content-card>
            <div v-if="tabActive === 'information'">
              <q-form ref="informationForm" class="q-px-lg q-pt-lg">
                <section>
                  <div class="row q-col-gutter-x-lg q-col-gutter-y-sm">
                    <template v-if="isSelectiveRequest">
                      <div class="col-12 col-md-4">
                        <p class="text-bold mb-0 text-black-90">Estructura</p>
                        <div>
                          {{
                            `${deferred_schedule.structure.code} - ${deferred_schedule.structure.name}`
                          }}
                        </div>
                      </div>
                      <div class="col-12 col-md-4">
                        <p class="text-bold mb-0 text-black-90">Negocio</p>
                        <div>
                          {{
                            `${deferred_schedule.business_trust.code} - ${deferred_schedule.business_trust.name}`
                          }}
                        </div>
                      </div>
                      <div class="col-12 col-md-4">
                        <p class="text-bold mb-0 text-black-90">Periodo</p>
                        <div>{{ `${deferred_schedule.period}` }}</div>
                      </div>
                    </template>
                    <template v-else>
                      <div class="col-12 col-md-3">
                        <GenericSelectorComponent
                          label="Estructura"
                          map_options
                          :required="true"
                          placeholder="Seleccione"
                          :clearable="false"
                          :manual_option="account_structures"
                          :default_value="''"
                          :rules="[
                          (v: string) =>
                            useRules().is_required(v, 'El campo estructura es requerido'),
                          ]"
                          @update:modelValue="selectStructure($event)"
                        />
                      </div>
                      <div class="col-12 col-md-3">
                        <GenericDateInputComponent
                          label="Periodo"
                          required
                          placeholder="AAAA-MM"
                          mask="YYYY-MM"
                          :default_value="''"
                          :rules="[
                          (v: string) =>
                            useRules().is_required(v, 'El campo periodo es requerido'),
                        ]"
                          @update:modelValue="basicForm.period = $event"
                        />
                      </div>
                      <div class="col-12 col-md-3">
                        <GenericSelectorComponent
                          label="Desde negocio"
                          map_options
                          required
                          placeholder="Seleccione"
                          :manual_option="business_trust"
                          :default_value="''"
                          :rules="[
                            (v: string) =>
                              useRules().is_required(
                                v,
                                'El campo desde negocio es requerido'
                              ),
                          ]"
                          @update:modelValue="
                            basicForm.from_business_trust_id = $event
                          "
                        />
                      </div>
                      <div class="col-12 col-md-3">
                        <GenericSelectorComponent
                          label="Hasta negocio"
                          map_options
                          required
                          placeholder="Seleccione"
                          :manual_option="business_trust"
                          :default_value="''"
                          :rules="[
                          (v: string) =>
                            useRules().is_required(v, 'El campo hasta negocio es requerido'),
                        ]"
                          @update:modelValue="
                            basicForm.to_business_trust_id = $event
                          "
                        />
                      </div>
                    </template>
                  </div>
                </section>
              </q-form>
              <q-separator
                class="q-mx-lg"
                :class="isSelectiveRequest ? 'q-mt-md' : ''"
              />
              <section v-if="isSelectiveRequest" class="q-mx-lg q-mt-md">
                <p class="text-black-10 text-weight-bold text-h6 q-mb-md">
                  {{ tableProps.title }}
                </p>
                <VCard class="q-px-lg q-pb-lg" custom-style="margin-bottom: 0">
                  <template #content-card>
                    <TableList
                      :loading="tableProps.loading"
                      :columns="tableProps.columns"
                      :rows="tableProps.rows"
                      :pages="tableProps.pages"
                      :custom-columns="['actions']"
                      :hide-header="!tableProps.rows.length"
                      @update-page="updatePage"
                      @update-rows-per-page="updatePerPage"
                    >
                      <template #actions="{ row }">
                        <Button
                          v-if="
                            validateRouter(
                              'Accounting',
                              'ScheduleDeferralList',
                              'show'
                            )
                          "
                          color="orange"
                          colorIcon="#f45100"
                          tooltip="Ver"
                          :left-icon="defaultIconsLucide.eye"
                          :class-custom="'custom'"
                          :outline="false"
                          :flat="true"
                          @click="viewVoucher(row)"
                        />
                      </template>
                    </TableList>
                  </template>
                </VCard>
              </section>
              <section class="q-ma-lg">
                <div class="row justify-end q-gutter-md">
                  <Button
                    :outline="false"
                    :class-custom="'custom q-mt-md'"
                    label="Procesar"
                    size="md"
                    color="orange"
                    @click="processVouchers"
                  />
                </div>
              </section>
            </div>
          </template>
        </VCard>
      </section>

      <section v-if="!isSelectiveRequest">
        <p
          v-if="tableProps.rows.length"
          class="text-black-10 text-weight-bold text-h6 q-mb-none"
        >
          {{ tableProps.title }}
        </p>
        <TableList
          :loading="tableProps.loading"
          :columns="tableProps.columns"
          :rows="tableProps.rows"
          :pages="tableProps.pages"
          :custom-columns="['actions']"
          :hide-header="!tableProps.rows.length"
          @update-page="updatePage"
          @update-rows-per-page="updatePerPage"
        >
          <template #actions="{ row }">
            <!-- Ver -->
            <Button
              v-if="
                validateRouter('Accounting', 'ScheduleDeferralList', 'show')
              "
              color="orange"
              colorIcon="#f45100"
              tooltip="Ver"
              :left-icon="defaultIconsLucide.eye"
              :class-custom="'custom'"
              :outline="false"
              :flat="true"
              @click="viewVoucher(row)"
            />
          </template>
        </TableList>
      </section>
      <AlertModalComponent
        :show-img-default="false"
        ref="voucherModalRef"
        marginTopBody=""
        margin-top-actions=""
        styleModal="padding: 1vw; min-width: 80%"
        :title-header="'Comprobante'"
        :show-btn-cancel="false"
        :show-btn-confirm="false"
      >
        <template #default-body>
          <VoucherDetail />
        </template>
      </AlertModalComponent>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
// Components:
import Button from '@/components/common/Button/Button.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import GenericDateInputComponent from '@/components/common/GenericDateInput/GenericDateInputComponent.vue'
import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import TableList from '@/components/table-list/TableList.vue'
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import VoucherDetail from '@/components/Detail/Accounting/ProcessDeferred/VoucherDetail.vue'

// Utils
import { defaultIconsLucide } from '@/utils'
import { useRules } from '@/composables'
// Logic view
import useProcessDeferredList from '@/views/accounting/process-deferred/v1/list/ProcessDeferredList'

const {
  // Props
  basicForm,
  informationForm,
  headerProps,
  tableProps,
  filteredTabs,
  tabActive,
  tabActiveIdx,
  account_structures,
  business_trust,
  voucherModalRef,
  isSelectiveRequest,
  deferred_schedule,
  // Methods
  viewVoucher,
  selectStructure,
  processVouchers,
  updatePage,
  updatePerPage,
  validateRouter,
} = useProcessDeferredList()
</script>
