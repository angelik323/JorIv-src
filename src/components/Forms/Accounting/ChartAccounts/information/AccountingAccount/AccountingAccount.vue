<template>
  <q-dialog v-model="isModalOpen" persistent>
    <q-card flat bordered class="elative v-card-rounded q-pa-md generator-card">
      <InformationFormModal
        ref="formInformationModal"
        :action="isEditing ? 'edit' : 'create'"
        :data="props.itemEdit"
      />
      <!-- Acciones -->
      <section class="q-mt-lg q-mb-md">
        <div class="row justify-center q-gutter-x-md">
          <Button
            outline
            rounded
            no-caps
            label="Cancelar"
            color="orange"
            size="md"
            dense
            unelevated
            class="custom q-py-sm q-px-md"
            @click="closeModal"
          />

          <Button
            :outline="false"
            rounded
            no-caps
            :label="!isEditing ? 'Agregar' : 'Actualizar'"
            :right-icon="defaultIconsLucide.chevronRight"
            :color-icon="'white'"
            color="orange"
            size="md"
            dense
            unelevated
            class="custom q-py-sm q-px-md"
            @click="onSubmit"
          />
        </div>
      </section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
// components
import Button from '@/components/common/Button/Button.vue'
import InformationFormModal from './InformationFormModal/InformationFormModal.vue'

// interfaces
import { IChartAccount } from '@/interfaces/customs'

// logic view
import { useAccountingAccount } from './AccountingAccount'

// Utils
import { defaultIconsLucide } from '@/utils'

const props = withDefaults(
  defineProps<{
    isOpen: boolean
    isEditing: boolean
    action: 'create' | 'edit' | 'view'
    itemEdit: IChartAccount | undefined
  }>(),
  {
    isOpen: false,
    isEditing: false,
    action: 'create',
  }
)

const emit = defineEmits<{
  (e: 'update:isOpen', value: boolean): void
  (e: 'save', item: IChartAccount, isEditing: boolean): void
}>()

const { isModalOpen, formInformationModal, onSubmit, closeModal } =
  useAccountingAccount(props, emit)
</script>

<style scoped lang="scss">
.generator-card {
  width: 1040px;
  max-width: 90vw;
  border-radius: 15px !important;
}
</style>
