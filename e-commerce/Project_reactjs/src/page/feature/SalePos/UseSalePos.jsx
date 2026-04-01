import DataStore from "../../../store/DataStore";
import { useEffect, useState } from "react";
const UseSalePos = () => {
  const { addProduct, data } = DataStore();
  const [filed, setFiled] = useState(1);
  const [filedId, setFiledId] = useState(null);

  const handleAddList = (product) => {
    addProduct(product);
    
    setFiled(filed);
    setFiledId(product.id);
  };

  useEffect(() => {
  
  }, []);

    const handlePlusQty = (e) => {
      e.preventDefault();
      setFiled(filed + 1);
    };
  
    const handleSubtractQty = (e) => {
      e.preventDefault();
      if (filed > 1) {
        setFiled(filed - 1);
      }
    };

  return {
    handleAddList,
    filed,
    setFiled,
    handleSubtractQty,
    handlePlusQty
  };
};

export default UseSalePos;
