import { onMounted, ref } from 'vue'
import { checkDigit } from '@/utils'
import { useLogin } from '@/stores'
import { storeToRefs } from 'pinia'

const useSMSVerify = () => {
  const { _startCountdownVerifySMSOTP, _restartCountdownVerifySMSOTP } =
    useLogin()
  const { contador_sms } = storeToRefs(useLogin())
  const form = ref(Array(6).fill(''))

  const handleKeyUp = (event: KeyboardEvent, index: number) => {
    const inputs = document.querySelectorAll('input')
    const currentInput = inputs[index]
    const nextInput = inputs[index + 1]

    if (event.key === 'Backspace' && currentInput.value === '') {
      if (index > 0) {
        inputs[index - 1].focus()
      }
    } else if (currentInput.value.length === 1 && nextInput) {
      nextInput.focus()
    }
  }

  onMounted(() => {
    const inputs = document.querySelectorAll('input')
    inputs[0].focus()
    _startCountdownVerifySMSOTP()
  })

  return {
    form,
    contador_sms,

    handleKeyUp,
    checkDigit,
    _restartCountdownVerifySMSOTP,
  }
}

export default useSMSVerify
