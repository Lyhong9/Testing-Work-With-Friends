const {checkPaymentStatus,generateKHQR,verifyKHQR} = require("../controllers/khrq.controller");
const {validate_token} = require("../middleware/auth");
const khrqRoute = (app) => {
    app.post("/api/khqr/generate", generateKHQR);
    app.post("/api/khqr/verify",  verifyKHQR);
    app.post("/api/khqr/checkpayment",  checkPaymentStatus);
}

module.exports = khrqRoute