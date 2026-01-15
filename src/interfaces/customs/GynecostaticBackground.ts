export interface IGynecostaticBackgroundForm {
  pregnant_details: boolean
  pregnant_currently_pregnant: boolean
  pregnant_pregnant_test: boolean
  pregnant_ultrasound: boolean

  last_pregnancy_date: boolean
  last_pregnancy_weeks: boolean
  last_pregnancy_details: boolean

  last_menstruation_date: boolean
  last_menstruation_is_reliable_date: boolean
  last_menstruation_is_planning_method: boolean
  last_menstruation_detail_planning_method: boolean
  last_menstruation_diu: boolean
  last_menstruation_subdermal: boolean
  last_menstruation_oral: boolean
  last_menstruation_bhcg: boolean
  last_menstruation_menarche: boolean

  obstetric_profile_pregnancies: boolean
  obstetric_profile_childbirth: boolean
  obstetric_profile_caesarean: boolean
  obstetric_profile_births: boolean
  obstetric_profile_cool: boolean
  obstetric_profile_ectopic: boolean
  obstetric_profile_abortions: boolean
  obstetric_profile_stillbirth: boolean

  menstrual_cicle_is_regular: boolean
  menstrual_cicle_duration_time: boolean

  last_cytology_date: boolean
  last_cytology_observation: boolean
}
export interface IGynecostaticBackground {
  id?: number

  pregnant: boolean
  pregnant_details: string
  pregnant_currently_pregnant: null | boolean
  pregnant_pregnant_test: null | boolean
  pregnant_ultrasound: null | boolean

  last_pregnancy: boolean
  last_pregnancy_date: string
  last_pregnancy_weeks: number | string | null
  last_pregnancy_details: string

  last_menstruation: boolean
  last_menstruation_date: string
  last_menstruation_is_reliable_date: null | boolean
  last_menstruation_is_planning_method: null | boolean
  last_menstruation_detail_planning_method: string
  last_menstruation_diu: null | boolean
  last_menstruation_subdermal: null | boolean
  last_menstruation_oral: null | boolean
  last_menstruation_bhcg: null | boolean
  last_menstruation_menarche: string

  obstetric_profile: boolean
  obstetric_profile_pregnancies: number | string | null
  obstetric_profile_childbirth: number | string | null
  obstetric_profile_caesarean: number | string | null
  obstetric_profile_births: number | string | null
  obstetric_profile_cool: number | string | null
  obstetric_profile_ectopic: number | string | null
  obstetric_profile_abortions: number | string | null
  obstetric_profile_stillbirth: number | string | null

  menstrual_cicle: boolean
  menstrual_cicle_is_regular: null | boolean
  menstrual_cicle_duration_time: string

  last_cytology: boolean
  last_cytology_date: string
  last_cytology_observation: string
}
