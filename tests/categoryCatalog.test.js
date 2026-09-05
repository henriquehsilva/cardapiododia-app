import test from "node:test";
import assert from "node:assert/strict";
import { categoryIconType, categorySuggestions } from "../src/categoryCatalog.js";

test("filtra sugestões ignorando acentos e categorias já usadas", () => {
  const suggestions = categorySuggestions("acai", ["Marmitas"]);
  assert.equal(suggestions[0].name, "Açaí");
  assert.equal(categorySuggestions("marmitas", ["Marmitas"]).some((item) => item.name === "Marmitas"), false);
});

test("associa categorias a famílias visuais", () => {
  assert.equal(categoryIconType("Marmitas"), "food");
  assert.equal(categoryIconType("Hambúrgueres"), "shop");
  assert.equal(categoryIconType("Vegetarianos"), "garden");
  assert.equal(categoryIconType("Bebidas"), "food");
});
