
import { create } from 'zustand'

const GlobleData = create((set) => ({
  brand: [],
  category: [],
  setCategory: () => set((state) => ({ category: state.category })),
  setBrand: () => set((state) => ({ brand: state.brand })),
}))

export default GlobleData