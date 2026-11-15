# Quick Fix: Live Liquid Error on Human Edge Series Product Pages

During the automated storefront audit of `https://humanedgepress.com/products/human-edge-kind` (and sibling Human Edge Series pages), Shopify rendered:

```text
Liquid error (sections/product-human-edge-content line 107): comparison of String with 1 failed
```

## Cause
In Shopify Liquid, metafields or theme settings stored as strings cannot be compared directly using `>`, `<`, or `>=` against a number (`1`) without numeric coercion.

## 1-Line Fix
Open **Shopify Admin → Online Store → Themes → Edit code → `sections/product-human-edge-content.liquid`** around **line 107** and coerce the variable to a number with `| plus: 0` before comparing:

```liquid
{%- assign numeric_val = some_string_variable | plus: 0 -%}
{%- if numeric_val > 1 -%}
```
