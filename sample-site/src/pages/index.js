import { graphql } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import * as React from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"

export const query = graphql`
  query MyQuery {
    allPackageLicense {
      edges {
        node {
          id
          identifier
          license
          licenseText
          package
          url
          version
        }
      }
    }
  }
`

const IndexPage = ({ data }) => (
  <Layout>
    <Seo title="Home" />
    <h1>Hi people</h1>
    <p>Welcome to your new Gatsby site.</p>
    <p>Now go build something great.</p>
    <StaticImage
      src="../images/gatsby-astronaut.png"
      width={300}
      quality={95}
      formats={["AUTO", "WEBP", "AVIF"]}
      alt="A Gatsby astronaut"
      style={{ marginBottom: `1.45rem` }}
    />
    <div>
      <h2>Licenses</h2>
      {data.allPackageLicense.edges.map(({ node }) => (
        <div>{node.identifier}</div>
      ))}
    </div>
  </Layout>
)

export default IndexPage
