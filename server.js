const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors());
app.use(express.json());

// ----------------------------
// CREATE PAYMENT INTENT
// ----------------------------
app.post("/create-payment-intent", async (req, res) => {
    const { amount, description } = req.body;

    // Validate amount
    if (!amount || amount < 1) {
        return res.status(400).json({ error: "Invalid amount" });
    }

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,         // amount in cents (sent from frontend)
            currency: "usd",
            description: description || "BizPilot Payment",
            automatic_payment_methods: {
                enabled: true
            }
        });

        return res.json({
            clientSecret: paymentIntent.client_secret
        });

    } catch (err) {
        console.error("Stripe Error:", err);
        return res.status(500).json({ error: err.message });
    }
});

// ----------------------------
// BASE TEST ROUTE
// ----------------------------
app.get("/", (req, res) => {
    res.send("BizPilot Stripe Backend is running.");
});

// ----------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Stripe backend running on port ${PORT}`));
