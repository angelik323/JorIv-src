<template>
  <div class="q-mx-xl">
    <ContentComponent
      indentation
      content-indentation
      :title="headerProps.title"
      :breadcrumbs="headerProps.breadcrumbs"
      show-back-btn
      @on-back="$router.push({ name: 'RemoteAuthorizationList' })"
    >
      <section class="q-my-md q-pl-lg">
        <TabsComponent
          :tab-active="tabActive"
          :tabs="filteredTabs"
          :tab-active-idx="tabActiveIdx"
          @update:tab-active="tabActive = $event"
        />

        <VCard>
          <template #content-card>
            <div
              v-if="tabActive === 'basic_data'"
              class="q-mt-xl q-mb-lg q-px-lg"
            >
              <div class="row q-col-gutter-lg">
                <div class="col-12 col-md-3">
                  <div class="text-bold text-lg mb-3">Código</div>
                  <div>{{ authorization.number }}</div>
                </div>

                <div class="col-12 col-md-3">
                  <div class="text-bold text-lg mb-3">Nombre</div>
                  <div>{{ authorization?.authorized_by?.name }}</div>
                </div>

                <div class="col-12 col-md-3">
                  <div class="text-bold text-lg mb-3">Nit</div>
                  <div>{{ authorization?.bank_data?.nit }}</div>
                </div>

                <div class="col-12 col-md-3">
                  <div class="text-bold text-lg mb-3">Código bancario</div>
                  <div>{{ authorization?.bank_data?.bank_code }}</div>
                </div>

                <div class="col-12 col-md-3">
                  <div class="text-bold text-lg mb-3">Estado</div>
                  <ShowStatus
                    :type="Number(authorization.status?.id)"
                    statusType="treasury"
                  />
                </div>

                <div class="col-12 col-md-3">
                  <div class="text-bold text-lg mb-3">Antiguedad entidad</div>
                  <div>{{ authorization.old_entity }}</div>
                </div>
              </div>
              <q-separator class="my-4" />

              <div class="row q-mt-lg justify-between">
                <Button
                  :outline="true"
                  label="Grupo de dispersión"
                  size="md"
                  color="orange"
                  :style-text="{ color: '#333' }"
                  class="text-capitalize btn-filter custom"
                  :disabled="true"
                />
                <Button
                  label="Finalizar"
                  :outline="false"
                  color="orange"
                  size="md"
                  :classCustom="'text-capitalize btn-filter custom'"
                  @click="$router.push({ name: 'RemoteAuthorizationList' })"
                />
              </div>
            </div>
          </template>
        </VCard>
      </section>
    </ContentComponent>
  </div>
</template>

<script setup lang="ts">
//components
import ContentComponent from '@/components/common/ViewContainter/ContentComponent.vue'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import VCard from '@/components/common/VCard/VCard.vue'
import Button from '@/components/common/Button/Button.vue'
import ShowStatus from '@/components/showStatus/v2/ShowStatus.vue'

// Logic
import useRemoteAuthorizationView from './RemoteAuthorizationView'

const { headerProps, filteredTabs, tabActive, tabActiveIdx, authorization } =
  useRemoteAuthorizationView()
</script>
