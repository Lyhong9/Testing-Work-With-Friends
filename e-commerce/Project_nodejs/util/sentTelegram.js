const axios = require("axios");

const sendTelegramMessage = async (text) => {
  try {
    const token = "8294721630:AAGvqrbKK4nFa6sd3IAWH1aRiTVbLtpiNBw";
    const chatId = "5934277627";

    if (!token || !chatId) {
      console.log(
        "Telegram bot token or chat ID is not configured - skipping notification",
      );
      return;
    }
    console.log("Sending Telegram message to chat ID:", chatId);

    const response = await axios.post(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        chat_id: chatId,
        text,
        parse_mode: "HTML",
      },
    );

    console.log(
      "✅ Telegram notification sent successfully! Message ID:",
      response.data.result.message_id,
    );
  } catch (error) {
    console.error("❌ Telegram send error:");
    console.error("   Status:", error.response?.status);
    console.error("   Error:", error.response?.data || error.message);

    if (error.response?.status === 400) {
      console.error("   Possible causes:");
      console.error("   - Chat ID is incorrect");
      console.error(
        "   - You have not started a conversation with the bot (send /start)",
      );
      console.error("   - Bot is blocked by the user");
    }
  }
};

const alertNewSale = async (sale, items) => {
  try {
    // Use created_on for accurate timestamp with time, fallback to sale_date
    const dateToFormat = sale.createdAt || new Date();
    console.log(
      "📅 Input to format:",
      dateToFormat,
      "Type:",
      typeof dateToFormat,
    );
    const formattedDate = new Date(dateToFormat).toLocaleString("en-US", {
      timeZone: "Asia/Phnom_Penh",
    });
    console.log(
      "✅ Formatted output:",
      formattedDate,
      "Type:",
      typeof formattedDate,
    );

    const message =
      `🧾 <b>New Sale</b>\n\n` +
      `<b>Sale ID:</b> ${sale.id}\n` +
      `<b>Invoice ID:</b> ${sale.invoiceId}\n` +
      `<b>Amount:</b> $${parseFloat(sale.totalAmount || 0).toFixed(2)}\n` +
      //   `<b>Subtotal:</b> $${parseFloat(sale.subTotal || 0).toFixed(2)}\n` +
      `<b>Tax:</b> $${parseFloat(sale.tax || 0).toFixed(2)}\n` +
      `<b>Payment Method:</b> ${sale.paymentMethod}\n` +
      `<b>Items:</b> ${
        items.map((item) => `
            <b>Product ID:</b> ${item.productId}, 
            <b>Quantity:</b> ${item.quantity}, 
            <b>Price:</b> ${item.price}`).join("\n")}\n` +
      `<b>Date:</b> ${formattedDate}\n` +
      `<b>Created By:</b> ${sale.createdAt}`;

    console.log("📤 Sending message with formatted date");
    await sendTelegramMessage(message);
  } catch (error) {
    console.error("❌ Error in alertNewSale:", error.message);
  }
};

const alertLowStock = async (products) => {
  if (!products || products.length === 0) return;

  let message = `⚠️ <b>Low Stock Alert</b>\n\n`;

  products.forEach((p, index) => {
    message +=
      `<b>${index + 1}. ${p.name}</b>\n` +
      `ID: ${p.id}\n` +
      `Stock Left: ${p.stockQuantity}\n\n`;
  });

  message += `<b>Status:</b> Low Stock (≤10 items)`;

  await sendTelegramMessage(message);
};

const alertOutOfStock = async (products) => {
  if (!products || products.length === 0) return;

  let message = `❌ <b>Out of Stock Alert</b>\n\n`;

  products.forEach((p, index) => {
    message +=
      `<b>${index + 1}. ${p.name}</b>\n` +
      `ID: ${p.id}\n` +
      `Quantity: ${p.stockQuantity}\n\n`;
  });

  message += `<b>Status:</b> OUT OF STOCK`;

  await sendTelegramMessage(message);
};

module.exports = {
  sendTelegramMessage,
  alertNewSale,
  alertLowStock,
  alertOutOfStock,
};

// const axios = require("axios");

// /* ===============================
//    🔹 CORE: Send Telegram Message
// ================================ */
// const sendTelegramMessage = async (text) => {
//   try {
//     const token = process.env.TELEGRAM_BOT_TOKEN;
//     const chatId = process.env.TELEGRAM_CHAT_ID;

//     if (!token || !chatId) {
//       console.log("⚠️ Missing Telegram config");
//       return;
//     }

//     const res = await axios.post(
//       `https://api.telegram.org/bot${token}/sendMessage`,
//       {
//         chat_id: chatId,
//         text,
//         parse_mode: "HTML",
//       }
//     );

//     console.log("✅ Telegram sent:", res.data.result.message_id);
//   } catch (error) {
//     console.error("❌ Telegram error:", error.response?.data || error.message);
//   }
// };

// /* ===============================
//    🔹 API Controller (POST)
// ================================ */
// const sendTelegramController = async (req, res) => {
//   try {
//     const { text } = req.body;

//     if (!text) {
//       return res.status(400).json({
//         success: false,
//         message: "text is required",
//       });
//     }

//     await sendTelegramMessage(text);

//     return res.json({
//       success: true,
//       message: "Message sent",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       error: error.message,
//     });
//   }
// };

// /* ===============================
//    🔹 Alert: New Sale
// ================================ */
// const alertNewSale = async (sale, items) => {
//   try {
//     const formattedDate = new Date(
//       sale.createdAt || new Date()
//     ).toLocaleString("en-US", {
//       timeZone: "Asia/Phnom_Penh",
//     });

//     const message =
//       `🧾 <b>New Sale</b>\n\n` +
//       `<b>Sale ID:</b> ${sale.id}\n` +
//       `<b>Invoice:</b> ${sale.invoiceId}\n` +
//       `<b>Total:</b> $${parseFloat(sale.totalAmount || 0).toFixed(2)}\n` +
//       `<b>Tax:</b> $${parseFloat(sale.tax || 0).toFixed(2)}\n` +
//       `<b>Payment:</b> ${sale.paymentMethod}\n\n` +
//       `<b>Items:</b>\n` +
//       items.map(i =>
//         `• ID:${i.productId} | Qty:${i.quantity} | $${i.price}`
//       ).join("\n") +
//       `\n\n<b>Date:</b> ${formattedDate}`;

//     await sendTelegramMessage(message);
//   } catch (err) {
//     console.error("❌ alertNewSale:", err.message);
//   }
// };

// /* ===============================
//    🔹 Alert: Low Stock
// ================================ */
// const alertLowStock = async (products) => {
//   if (!products || products.length === 0) return;

//   let message = `⚠️ <b>Low Stock Alert</b>\n\n`;

//   products.forEach((p, i) => {
//     message +=
//       `<b>${i + 1}. ${p.name}</b>\n` +
//       `ID: ${p.id}\n` +
//       `Stock: ${p.stockQuantity}\n\n`;
//   });

//   message += `<b>Status:</b> Low Stock (≤10 items)`;

//   await sendTelegramMessage(message);
// };

// /* ===============================
//    🔹 Alert: Out Of Stock
// ================================ */
// const alertOutOfStock = async (products) => {
//   if (!products || products.length === 0) return;

//   let message = `❌ <b>Out of Stock Alert</b>\n\n`;

//   products.forEach((p, i) => {
//     message +=
//       `<b>${i + 1}. ${p.name}</b>\n` +
//       `ID: ${p.id}\n` +
//       `Quantity: ${p.stockQuantity}\n\n`;
//   });

//   message += `<b>Status:</b> OUT OF STOCK`;

//   await sendTelegramMessage(message);
// };

// /* ===============================
//    🔹 EXPORT
// ================================ */
// module.exports = {
//   sendTelegramMessage,
//   sendTelegramController,
//   alertNewSale,
//   alertLowStock,
//   alertOutOfStock,
// };