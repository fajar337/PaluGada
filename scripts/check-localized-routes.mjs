import assert from "node:assert/strict";
import { fmtCurrency, getPricingForSelection } from "../src/features/palugada/constants.js";
import { getRouteState, getViewPath } from "../src/features/palugada/lib/seo.js";

assert.deepEqual(getRouteState("/jp/produk/netflix-premium/"), {
  locale: "jp",
  view: "detail",
  activeProductSlug: "netflix-premium",
});
assert.equal(getViewPath("detail", { name: "Netflix Premium" }, "", "jp"), "/jp/produk/netflix-premium/");
assert.equal(getViewPath("home", null, "netflix", "id"), "/id/?q=netflix");
assert.equal(getViewPath("admin", null, "", "jp"), "/admin");

const product = {
  id: "p_test",
  price: 20000,
  oldPrice: 30000,
  priceJpy: 450,
  oldPriceJpy: 600,
  pricingPlans: [{
    id: "standard",
    name: "STANDARD",
    options: [{ id: "month", duration: "1 Bulan", price: 25000, priceJpy: 500 }],
  }],
};
const selection = { planId: "standard", optionId: "month" };
const promos = [{ active: true, productId: "p_test", planId: "standard", optionId: "month", promoPrice: 15000, promoPriceJpy: 400, compareAtPriceJpy: 500 }];

assert.equal(getPricingForSelection(product, promos, selection, "id").displayPrice, 15000);
assert.equal(getPricingForSelection(product, promos, selection, "jp").displayPrice, 400);
assert.equal(getPricingForSelection({ price: 20000 }, [], null, "jp").displayPrice, 200);
assert.match(fmtCurrency(400, "JPY"), /400/);
assert.doesNotMatch(fmtCurrency(400, "JPY"), /Rp/);

console.log("Localized route and currency checks passed.");
