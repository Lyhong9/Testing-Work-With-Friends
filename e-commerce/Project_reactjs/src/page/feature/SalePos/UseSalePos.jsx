// import DataStore from "../../../store/DataStore";
import { useState, useEffect } from "react";
import { alertError, alertSuccess } from "../../../swertalert/AlertSuccess";
import { BaseURL } from "../../../utils/BaseURL";
import request from "../../../utils/request";
import { getProfileUser } from "../../../store/ProfileUser";
const UseSalePos = () => {
  const [Cart, setCart] = useState([]);
  const [Case, setCase] = useState([]);
  const [Qr, setQr] = useState([]);
  const [cashReceived, setcashReceived] = useState();
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isOpen, setIsOpen] = useState(false);
  const [caseLoading, setCaseLoading] = useState(false);
  const [Search, setSearch] = useState("");

  const setProfile = getProfileUser();

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
  const subtotal = Cart.reduce(
    (sum, item) => sum + item.price * item.stockQuantity,
    0,
  );
  const totalPrice = Number((subtotal * 1.1).toFixed(2));

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
  const generateInvoiceID = () => {
    const date = new Date();

    const ymd = date.toISOString().slice(0, 10).replace(/-/g, "");
    const random = Math.floor(1000 + Math.random() * 9000);

    return `INV-${ymd}-${random}`;
  };
  // ...existing code...

  const checkout = async () => {
    try {
      if (paymentMethod === "cash") {
        if (
          cashReceived === undefined ||
          cashReceived === null ||
          cashReceived === ""
        ) {
          alertError({
            title: "Error",
            text: "Cash received is required!",
          });
          return;
        }
        if (cashReceived < totalPrice) {
          alertError({
            title: "Error",
            text: "Cash received is not enough!",
          });
          return;
        }

        const invoiceId = generateInvoiceID(); // ✅ generate here
        setCaseLoading(true);
        const res = await request("/api/sale", "POST", {
          invoiceId: invoiceId,
          totalAmount: totalPrice,
          tax: 10,
          paymentMethod: "cash",
          userId: setProfile?.id,
          saleItems: Cart.map((c) => ({
            productId: c.id,
            quantity: c.stockQuantity,
            price: c.price,
          })),
        });

        // Fix: Loop over Cart to send individual PUT requests matching backend expectations (id, quantity)
        for (const item of Cart) {
          await request("/api/sale/quantity", "PUT", {
            id: item.id,
            quantity: item.stockQuantity,
          });
        }

        if (res) {
          setCart([]);
          alertSuccess({
            title: "Success",
            text: "Checkout successful!",
          });
          setCaseLoading(false);
        }
      }
    } catch (error) {
      alertError({
        title: "Error",
        text: error.message,
      });
    }
  };

  // ...existing code...

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

    if (type === "qr") {
      setPaymentMethod("qr");
      setCountMinutes(10); // reset timer when QR opens
    }

    if (type === "cash") {
      setPaymentMethod("cash");
    }
    setIsOpen(true);
  };

  // ===============================
  // QR COUNTDOWN TIMER (5 MIN)
  // ===============================
  useEffect(() => {
    let timer;

    if (isOpen && paymentMethod === "qr") {
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

    return () => clearInterval(timer);
  }, [paymentMethod, isOpen]);

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
    caseLoading,
    setSearch,
  };
};

export default UseSalePos;
