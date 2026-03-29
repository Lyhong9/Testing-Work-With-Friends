
import { create } from 'zustand'

const GlobleData = create((set) => ({
  brand: [],
  category: [],

  setCategory: (data) => set({ category: data }),
  setBrand: (data) => set({ brand: data }),
}))

export default GlobleData