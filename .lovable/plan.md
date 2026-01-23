

# Google Tag Manager Installation Plan

## Overview
Install Google Tag Manager (GTM) container `GTM-PK82V7VP` to enable advanced ad tracking and conversion measurement for your campaigns.

---

## Part 1: Install GTM Head Script

### 1.1 Update `index.html`
Add the GTM script in the `<head>` section, immediately after the opening tag:

```html
<head>
  <!-- Google Tag Manager -->
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-PK82V7VP');</script>
  <!-- End Google Tag Manager -->
  
  <meta charset="UTF-8" />
  <!-- ... rest of head -->
</head>
```

---

## Part 2: Install GTM Noscript Fallback

### 2.1 Add noscript to `index.html` body
Add immediately after the opening `<body>` tag:

```html
<body>
  <!-- Google Tag Manager (noscript) -->
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PK82V7VP"
  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
  <!-- End Google Tag Manager (noscript) -->
  
  <div id="root"></div>
  <!-- ... rest of body -->
</body>
```

---

## Part 3: Add TypeScript Type Declarations

### 3.1 Update global types for dataLayer
Create/update type declarations so TypeScript recognizes the `dataLayer`:

```typescript
// In src/vite-env.d.ts or a new types file
interface Window {
  dataLayer: unknown[];
}
```

---

## How to Test GTM is Working

### Method 1: Google Tag Assistant (Recommended)
1. Install the [Google Tag Assistant](https://tagassistant.google.com/) Chrome extension
2. Visit your site (use the published URL for accurate testing)
3. Click the Tag Assistant icon - you should see:
   - **GTM-PK82V7VP** with a green checkmark
   - Any tags configured inside GTM firing correctly

### Method 2: GTM Preview Mode
1. Go to [tagmanager.google.com](https://tagmanager.google.com)
2. Open your container (GTM-PK82V7VP)
3. Click **Preview** in the top right
4. Enter your site URL
5. A debug panel will show which tags fire on each page/event

### Method 3: Browser DevTools
1. Open your site and press F12
2. Go to **Console** tab
3. Type `dataLayer` and press Enter
4. You should see an array with GTM events like:
   ```javascript
   [
     { "gtm.start": 1706123456789, "event": "gtm.js" },
     { "event": "gtm.dom" },
     { "event": "gtm.load" }
   ]
   ```

### Method 4: Network Tab
1. Open DevTools > **Network** tab
2. Filter by "gtm"
3. Refresh the page
4. You should see requests to `googletagmanager.com/gtm.js`

---

## Conversion Tracking Setup (Next Steps)

Once GTM is installed, you can configure:

| Conversion Type | GTM Tag to Create |
|-----------------|-------------------|
| Page Views | Google Ads Conversion Linker |
| Form Submissions | Google Ads Conversion (on form submit) |
| Purchases | Google Ads Conversion (on purchase event) |
| Quiz Completions | Custom event trigger |

---

## Summary of Changes

| File | Change |
|------|--------|
| `index.html` | Add GTM script in head, noscript in body |
| `src/vite-env.d.ts` | Add dataLayer type declaration |

---

## Integration with Existing Tracking

Your existing setup includes:
- **Facebook Pixel** (ID: 1609199319332056) - Already installed
- **Google Analytics** (via `VITE_GA_MEASUREMENT_ID`) - Already installed

GTM will work alongside these. You can optionally migrate GA and FB Pixel into GTM for centralized management, but that's not required.

