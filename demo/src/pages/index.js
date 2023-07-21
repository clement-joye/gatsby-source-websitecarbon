import React from "react";
import { graphql, useStaticQuery } from "gatsby";

const query = graphql`
  {
    wc: websiteCarbonBadge {
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

function IndexPage() {
  const { wc } = useStaticQuery(query);
  console.log(wc);
  return (
    <React.Fragment>
      <h1>Website carbon data</h1>
      <br />
      <span>Bytes: {wc.bytes}</span>
      <br />
      <span>Cleaner Than: {wc.cleanerThan}</span>
      <br />
      <span>Green: {wc.green.toString()}</span>
      <br />
      <span>Timestamp: {wc.timestamp}</span>
      <br />
      <span>URL: {wc.url}</span>
      <br />
      <span>OriginalUrl: {wc.originalUrl}</span>
      <br />
      <span>Adjusted Bytes: {wc.statistics.adjustedBytes}</span>
      <br />
      <span>Energy: {wc.statistics.energy}</span>
      <br />
      <span>Co2 Grid Grams: {wc.statistics.co2.grid.grams}</span>
      <br />
      <span>Co2 Grid Litres: {wc.statistics.co2.grid.litres}</span>
      <br />
      <span>Co2 Renewable Grams: {wc.statistics.co2.renewable.grams}</span>
      <br />
      <span>Co2 Renewable Litres: {wc.statistics.co2.renewable.litres}</span>
      <br />
    </React.Fragment>
  );
}

export default IndexPage;
