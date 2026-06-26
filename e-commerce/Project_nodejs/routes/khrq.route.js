const {checkPaymentStatus,generateKHQR,verifyKHQR} = require("../controllers/khrq.controller");
const {validate_token} = require("../middleware/auth");
const khrqRoute = (app) => {
    app.post("/api/khqr/generate", validate_token(), generateKHQR);
    app.post("/api/khqr/verify", validate_token(), verifyKHQR);
    app.post("/api/khqr/checkpayment", validate_token(), checkPaymentStatus);
}

module.exports = khrqRoute