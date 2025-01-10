export interface Annotation {
  id: string
  type: 'highlight' | 'freehand' | 'rectangle'
  page: number
  color: string
  lineWidth?: number
  x?: number
  y?: number
  width?: number
  height?: number
  points?: { x: number; y: number }[]
}


