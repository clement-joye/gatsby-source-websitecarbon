# gatsby-source-websitecarbon

Gatsby source for Website Carbon badge api: https://www.websitecarbon.com/api/

## Install

```bash
yarn add gatsby-source-websitecarbon
```

## How to use

```js
// In your gatsby-config.js
plugins: [
  {
    resolve: "gatsby-source-websitecarbon",
    options: {
      url: "www.google.com",
    },
  },
];
```