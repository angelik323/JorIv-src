<template>
  <ModalComponent
    :openDialog="props.openDialog"
    :showImgDefault="true"
    imageWidth="80px"
    :imageSrc="alertIcon"
    minWidth="500px"
    @update:openDialog="$emit('update:openDialog', $event)"
  >
    <template #content-modal>
      <q-form ref="formElementRef" greedy>
        <div class="q-mb-lg">
          <p class="text-center text-body1 q-mb-md">
            Asigne un valor de cancelación al documento presupuestal
            {{ props.data.numberDocument }}
          </p>
          <InputMoneyComponent
            label="Valor de cancelación"
            required
            v-model="models.value_balance_cancellation"
            :max_integer_digits="17"
            :rules="[
              (val: string) => useRules().is_required(val, 'El valor de la unidad es requerido'),
            ]"
            @update:model-value="
              ({ rawValue }) => (models.value_balance_cancellation = rawValue)
            "
          />
        </div>
      </q-form>
      <q-separator />
      <div class="row justify-center q-mt-md">
        <Button
          label="Cancelar"
          color="orange"
          class="q-mr-sm"
          outline
          @click="$emit('update:openDialog', false)"
        />
        <Button
          :label="'Aceptar'"
          :class-custom="'custom'"
          size="md"
          color="orange"
          :outline="false"
          @click="handleSave()"
        />
      </div>
    </template>
  </ModalComponent>
</template>

<script setup lang="ts">
// Images
import alertIcon from '@/assets/images/icons/alert_popup.svg'

// Components
import ModalComponent from '@/components/common/Modal/ModalComponent.vue'
import Button from '@/components/common/Button/Button.vue'
import InputMoneyComponent from '@/components/InputMoney/InputMoneyComponent.vue'

// Logic view
import useAssignCancellationBalancesModal from '@/components/Forms/Budget/CancellationBalances/Modal/AssignCancellationBalancesModal'
import { useRules } from '@/composables'

const props = defineProps<{
  openDialog: boolean
  data: {
    numberDocument: number
    cancellationId: number | null
    isFromOperationLog: boolean
    valueBalanceCancellation?: number
  }
}>()

const { models, saveCancellationBalances } = useAssignCancellationBalancesModal(
  props.data
)

const emit = defineEmits<{
  (e: 'update:openDialog', value: boolean): void
  (e: 'update:success'): void
}>()

const handleSave = async () => {
  const result = await saveCancellationBalances()
  if (result) {
    emit('update:openDialog', false)
    emit('update:success')
  }
}
</script>
