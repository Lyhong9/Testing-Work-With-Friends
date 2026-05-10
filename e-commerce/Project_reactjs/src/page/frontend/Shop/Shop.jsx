import React from 'react'
import useStore from '../CustomHooks/HookS';

const Shop = () => {
  const {cate} = useStore();
  return (
    <div className='shop mt-5'>{cate}</div>
  )
}

export default Shop
