import DataStore from "../../../store/DataStore";
import { useState, useEffect } from "react";
import { alertError } from "../../../swertalert/AlertSuccess";

const UseSalePos = () => {
  const [Cart, setCart] = useState([]);
  const [Case, setCase] = useState([]);
  const [Qr, setQr] = useState([]);
  const [cashReceived, setcashReceived] = useState();
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isOpen, setIsOpen] = useState(false);

  // ⏱ 5 minutes countdown (300 seconds)
  const [countMinutes, setCountMinutes] = useState(300);

  // ===============================
  // ADD PRODUCT TO CART
  // ===============================
  const handleAddList = (product) => {
    setCart((prev) => {
      const exist = prev.find((c) => c.id === product.id);

      if (exist) {
        return prev.map((c) =>
          c.id === product.id
            ? { ...c, stockQuantity: c.stockQuantity + 1 }
            : c,
        );
      }

      return [...prev, { ...product, stockQuantity: 1 }];
    });
  };

  // ===============================
  // QUANTITY CONTROL
  // ===============================
  const handleQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((c) =>
          c.id === id ? { ...c, stockQuantity: c.stockQuantity + delta } : c,
        )
        .filter((c) => c.stockQuantity > 0),
    );
  };

  // ===============================
  // TOTAL PRICE
  // ===============================
  const totalPrice = Cart.reduce(
    (sum, item) => sum + item.price * item.stockQuantity,
    0,
  );

  // ===============================
  // REMOVE / CLEAR CART
  // ===============================
  function removeItem(id) {
    setCart((prev) => prev.filter((c) => c.id !== id));
  }

  function clearCart() {
    setCart([]);
  }

  // ===============================
  // CHECKOUT (EMPTY FOR NOW)
  // ===============================
  const checkout = () => {};

  // ===============================
  // PAYMENT METHOD HANDLER
  // ===============================
  const handlePayMethod = (type) => {
    if (Cart.length === 0) {
      alertError({
        title: "warning",
        text: "Cart is empty! Please add products first.",
      });
      return;
    }

    setPaymentMethod(type);

    if (type === "qr") {
      setCountMinutes(5); // reset timer when QR opens
    }

    setIsOpen(true);
  };

  // ===============================
  // QR COUNTDOWN TIMER (5 MIN)
  // ===============================
  useEffect(() => {
    let timer;

    if (paymentMethod === "qr") {
      timer = setInterval(() => {
        setCountMinutes((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsOpen(false);

            alertError({
              title: "Expired",
              text: "QR payment expired. Please try again.",
            });

            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    if(countMinutes === 0) {
      setIsOpen(false);
    }

    return () => clearInterval(timer);
  }, [paymentMethod]);

  // ===============================
  // FORMAT TIME (MM:SS)
  // ===============================
  const formatTime = (sec) => {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;

    return `${minutes} min ${seconds.toString().padStart(2, "0")} sec`;
  };

  // ===============================
  // RETURN VALUES
  // ===============================
  return {
    Cart,
    handleAddList,
    handleQty,
    totalPrice,
    removeItem,
    clearCart,
    Case,
    setCase,
    Qr,
    setQr,
    checkout,
    cashReceived,
    setcashReceived,
    handlePayMethod,
    paymentMethod,
    isOpen,
    setIsOpen,
    countMinutes,
    formatTime,
  };
};

export default UseSalePos;
