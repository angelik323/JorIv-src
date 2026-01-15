export interface IVitalSigns {
  imc: number | string | null
  weight_level: string
  breathing_frequency: string | number | null
  systolic_blood_pressure: string | number | null
  diastolic_blood_pressure: string | number | null
  average_blood_pressure: number | string | null
  heart_rate: string | number | null
  temperature: string | number | null
  weight: string | number | null
  height: string | number | null
  head_circunference: number | string | null
  abdominal_circunference: number | string | null
  upperarm_circunference: number | string | null
  oxygen_saturation: string
  uterine_height: string
  fetocardia: string | null | number
}

export interface IStructureGraphicData {
  color: string
  name: string
  data: { x: number; y: number }[]
}

export interface IAnnotationPoint {
  x: number
  y: number
  marker: {
    size: number
    fillColor: string
    strokeColor: string
    radius: number
  }
  label: {
    text: string
    borderColor: string
    offsetX: number
    style: {
      color: string
      background: string
    }
  }
}
