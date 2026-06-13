import { create } from 'zustand'

const useStore = create((set) => ({
   cate: null,
   address: null,
   setArress: (address) => set({address: address}),
   setCate: (cate) => set({cate: cate})
}))

export default useStore