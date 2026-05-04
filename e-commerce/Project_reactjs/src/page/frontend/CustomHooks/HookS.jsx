import { create } from 'zustand'

const useStore = create((set) => ({
   cate: null,
   setCate: (cate) => set({cate: cate})
}))

export default useStore