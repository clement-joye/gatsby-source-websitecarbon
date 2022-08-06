import React from "react";
import { graphql, useStaticQuery } from "gatsby";

const query = graphql`
  {
    wc: websiteCarbonBadge {
      co2
      percentage
      url
    }
  }
`

function IndexPage() {
  const { wc } = useStaticQuery(query);

  return (
    <React.Fragment>
      <h1>Website carbon data</h1>
      <span>{wc.url}</span>
      <br/>
      <span>CO<sub>2</sub>: {wc.co2}</span>
      <br/>
      <span>Rank: {wc.percentage}</span>
    </React.Fragment>
  );
}

export default IndexPage;
