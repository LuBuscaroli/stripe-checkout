require('dotenv').config();
const express = require('express');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');

app.use(cors({
  origin: 'https://www.casaoriginalemilano.com',
  methods: ['POST'],
}));

app.use(express.static('public'));
app.use(express.json());

// Mapeamento dos bumps
const bumpPrices = {
  bump1: 'price_1RWQMwCGL2CcxaYAn0DpcdoE',
  bump2: 'price_1RWQQzCGL2CcxaYAShkKabu1',
  bump3: 'price_1RWQPiCGL2CcxaYAARILC4z2',
  bump4: 'price_1RWQQeCGL2CcxaYALWuMW7UL'
};

app.post('/create-checkout-session', async (req, res) => {
  const { orderBumps } = req.body;

  const line_items = [
    {
      price: 'price_1RWYBRGCL2CcxaYAHkn91KoZ', // Produto principal
      quantity: 1,
    },
  ];

  if (Array.isArray(orderBumps)) {
    orderBumps.forEach((bumpKey) => {
      const bumpPriceId = bumpPrices[bumpKey];
      if (bumpPriceId) {
        line_items.push({
          price: bumpPriceId,
          quantity: 1,
        });
      }
    });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items,
    success_url: 'https://seusite.com/sucesso',
    cancel_url: 'https://seusite.com/cancelado',
  });

  res.json({ url: session.url });
});

app.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'));
