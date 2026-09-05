import test from "node:test";
import assert from "node:assert/strict";
import { escapeHtml, plainText, productSchema, safeJsonLd } from "../netlify/functions/_seo.js";

test("escapa HTML e remove formatação das descrições de SEO", () => {
  assert.equal(escapeHtml('<Loja "A">'), "&lt;Loja &quot;A&quot;&gt;");
  assert.equal(plainText("## Prato **leve**\ncom qualidade"), "Prato leve com qualidade");
});

test("gera oferta estruturada com preço final e disponibilidade", () => {
  const schema = productSchema({ baseUrl: "https://cardapiododia.app", store: { slug: "meu-restaurante", brand: "Meu Restaurante" }, productId: "p1", product: { name: "Prato executivo", price: 30, cashbackPercent: 10, imageUrl: "/foto.jpg" } });
  assert.equal(schema.offers.price, "27.00");
  assert.equal(schema.offers.availability, "https://schema.org/InStock");
  assert.match(safeJsonLd({ value: "</script>" }), /\\u003c/);
});
