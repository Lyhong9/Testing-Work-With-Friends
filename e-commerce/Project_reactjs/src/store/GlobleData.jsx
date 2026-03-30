
import { create } from 'zustand'

const GlobleData = create((set) => ({
  brand: [],
  category: [],
  role: [],
  setCategory: (data) => set({ category: data }),
  setBrand: (data) => set({ brand: data }),
  setRole: (data) => set({role: data})
}))

export default GlobleData