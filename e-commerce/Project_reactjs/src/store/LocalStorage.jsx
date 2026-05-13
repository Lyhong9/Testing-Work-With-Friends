// export const SetLocalUser = (data) => {
//   localStorage.setItem("token_key", JSON.stringify(data));
// };

// export const GetLocalStorage = () => {
//   const data = localStorage.getItem("token_key");
//   return data ? JSON.parse(data) : null;
// };

// export const RemoveLocalStorage = () => {
//   localStorage.removeItem("token_key");
// };
export const SetLocalUser = (data) => {
  localStorage.setItem("token_key", data);
};

export const GetLocalStorage = () => {
  return localStorage.getItem("token_key");
};

export const RemoveLocalStorage = () => {
  return localStorage.removeItem("token_key");
};



// Set Product to LocalStorage    
export const SetProductLocal = (newRows) => {
  const existingRows = JSON.parse(localStorage.getItem("productLocal")) || [];

  const updatedRows = [...existingRows];

  newRows.forEach((newItem) => {
    const existingIndex = updatedRows.findIndex(
      (item) => item.chooseSiz === newItem.chooseSiz && item.id === newItem.id,
    );

    if (existingIndex !== -1) {
      updatedRows[existingIndex].quantity =
        (updatedRows[existingIndex].quantity || 1) + (newItem.quantity || 1);
    } else {
      updatedRows.push({
        ...newItem,
        quantity: newItem.quantity || 1,
      });
    }
  });

  localStorage.setItem("productLocal", JSON.stringify(updatedRows));
};



// Get Product from LocalStorage   
export const GetProductLocal = () => {
  const data = localStorage.getItem("productLocal");
  return data ? JSON.parse(data) : [];
};


// clear localStorage   
export const ClearProductLocal = () => {
  localStorage.removeItem("productLocal");
};

// remove  item   
export const RemoveProduct = (size, id) => {
  const products = JSON.parse(localStorage.getItem("productLocal")) || [];

  const updatedProducts = products.filter((item) => item.id !== id && item.chooseSiz !== size);

  localStorage.setItem("productLocal", JSON.stringify(updatedProducts));

  return updatedProducts;
};


// update qty 
export const UpdateQuantityProduct = (size, id, newQuantity) => {
  const products = JSON.parse(localStorage.getItem("productLocal")) || [];

  const updatedProducts = products.map((item) =>
    item.chooseSiz === size && item.id === id
      ? {
          ...item,
          quantity: newQuantity,
        }
      : item,
  );

  localStorage.setItem("productLocal", JSON.stringify(updatedProducts));

  return updatedProducts;
};
