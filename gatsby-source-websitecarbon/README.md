# gatsby-source-websitecarbon

## Introduction

Gatsby source for Website Carbon api: https://www.websitecarbon.com/api/.

Fetch the data for the defined url from the api and lets you use it via StaticQuery.

_NB: This plugin goes hand in hand with : https://www.npmjs.com/package/react-websitecarbon-badge_

## Install

```bash
yarn add gatsby-source-websitecarbon
```

or

```bash
npm i gatsby-source-websitecarbon
```

## How to use

```js
// In your gatsby-config.js
plugins: [
  {
    resolve: "gatsby-source-websitecarbon",
    options: {
      url: "www.google.com",
      verbose: false,
      nocache: false,
    },
  },
];

// In your component
import React from "react";
import { StaticQuery, graphql } from "gatsby";

const query = graphql`
  query WebsiteCarbonQuery {
    websiteCarbonBadge {
      bytes
      cleanerThan
      green
      timestamp
      url
      originalUrl
      statistics {
        adjustedBytes
        energy
        co2 {
          grid {
            grams
            litres
          }
          renewable {
            grams
            litres
          }
        }
      }
    }
  }
`;

function MyComponent(props: any) {
  return (
    <StaticQuery
      query={query}
      render={(data) => (
        // If using react-websitecarbon-badge
        <WebsiteCarbonBadge
          dark={true}
          co2={data.websiteCarbonBadge?.statistics.co2.renewable.grams.toFixed(
            2
          )}
          percentage={data.websiteCarbonBadge?.cleanerThan * 100}
        />
      )}
    />
  );
}

export default MyComponent;
```
