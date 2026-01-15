export interface ITemplate {
  title: string
  description: string
  physical_exam_id: number
  id: number
}

export type IPhysicalExam = Omit<ITemplate, 'id'>
export type IPhysicalExamKeys =
  | 'skin'
  | 'head'
  | 'neck'
  | 'respiratory'
  | 'cardiovascular'
  | 'abdomen'
  | 'neurological'
  | 'eyes'
  | 'ears'
  | 'nose'
  | 'mouth'
  | 'chest'
  | 'genitourinary'
  | 'extremities'
  | 'thought'
