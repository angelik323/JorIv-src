<template>
  <q-dialog v-model="isModalOpen" persistent>
    <q-card
      flat
      bordered
      class="relative v-card-rounded q-pa-md generator-card"
    >
      <!-- <q-btn
        round
        flat
        icon="mdi-close"
        class="absolute-top-right q-ma-md q-mr-xl z-top"
        @click="closeModal"
      /> -->

      <section>
        <TabsComponent
          :tabs="tabs"
          :tab-active="tabActive"
          :tab-active-idx="tabActiveIdx"
        />
      </section>

      <q-separator class="q-mt-sm" color="grey-4" />

      <!-- Contenido -->
      <section class="q-mt-md q-px-md">
        <BasicDataForm
          v-if="tabActive === 'basic_data'"
          ref="basicDataFormRef"
          :formType="formType"
          :data="itemToEdit"
          :is-natural-person="isNaturalPerson"
          :is-legal-person="isLegalPerson"
        />

        <PEPForm
          v-if="tabActive === 'pep'"
          ref="pepFormRef"
          :formType="formType"
          :data="itemToEdit"
        />

        <q-separator class="q-mt-xs" color="grey-4" />

        <!-- Acciones -->
        <section class="q-mt-lg q-mb-md">
          <div class="row justify-end q-gutter-x-md">
            <q-btn
              v-if="tabs.findIndex((tab) => tab.name === tabActive) === 0"
              type="button"
              outline
              rounded
              no-caps
              label="Cancelar"
              color="orange"
              size="md"
              dense
              class="q-py-sm q-px-md custom"
              @click="closeModal"
            />

            <q-btn
              v-else
              type="button"
              outline
              rounded
              no-caps
              label="Atrás"
              color="orange"
              size="md"
              dense
              class="q-py-sm q-px-md custom"
              @click="backTab"
            />

            <q-btn
              v-if="
                tabs.findIndex((tab) => tab.name === tabActive) > -1 &&
                tabs.findIndex((tab) => tab.name === tabActive) <
                  tabs.length - 1
              "
              type="button"
              rounded
              no-caps
              label="Continuar"
              color="orange"
              size="md"
              dense
              unelevated
              class="custom q-py-sm q-px-md"
              @click="nextTab"
            />

            <q-btn
              v-if="
                tabs.findIndex((tab) => tab.name === tabActive) ===
                  tabs.length - 1 && ['view'].includes(formType)
              "
              type="button"
              rounded
              no-caps
              label="Cerrar"
              color="orange"
              size="md"
              dense
              unelevated
              class="custom q-py-sm q-px-md"
              @click="closeModal"
            />

            <q-btn
              v-if="
                tabs.findIndex((tab) => tab.name === tabActive) ===
                  tabs.length - 1 && ['create', 'edit'].includes(formType)
              "
              type="button"
              rounded
              no-caps
              :label="formType === 'create' ? 'Crear' : 'Actualizar'"
              color="orange"
              size="md"
              dense
              unelevated
              class="custom q-py-sm q-px-md"
              @click="onSubmit"
            />
          </div>
        </section>
      </section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { IManager } from '@/interfaces/customs/Clients'
import { ValidationRule } from 'quasar'
import TabsComponent from '@/components/common/Tabs/TabsComponent.vue'
import BasicDataForm from './BasicData/BasicDataForm.vue'
import PEPForm from './PEP/PEPForm.vue'
import { useManagerGenerator } from './ManagerGenerator'

const props = withDefaults(
  defineProps<{
    isOpen: boolean
    rules?: ValidationRule[]
    itemToEdit?: IManager
    required?: boolean
    personType: 'Natural' | 'Juridica'
    formType: 'create' | 'edit' | 'view'
  }>(),
  {
    isOpen: false,
    required: false,
    personType: 'Natural',
    formType: 'create',
  }
)

const emit = defineEmits<{
  (e: 'update:isOpen', value: boolean): void
  (e: 'save', item: IManager): void
}>()

const {
  isModalOpen,
  isNaturalPerson,
  isLegalPerson,
  tabs,
  tabActive,
  tabActiveIdx,
  basicDataFormRef,
  pepFormRef,
  nextTab,
  backTab,
  onSubmit,
  closeModal,
} = useManagerGenerator(props, emit)
</script>

<style scoped lang="scss">
.generator-card {
  width: 1040px;
  max-width: 90vw;
  border-radius: 15px !important;
}
</style>
