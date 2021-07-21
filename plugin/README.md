# Gatsby Source Package License

Gatsby Plug-in to source all the licenses from the dependencies of a project.

## How to use

Add to `gatsby-config.js`:

```js
...
  plugins: [
    ...
    {
      resolve: `gatsby-source-package-licenses`,
      options: {
        cacheFile: "yarn.lock",
      },
    },
  ]
...
```

Sourcing is pretty fast but still you can use `cacheFile` to speed up the process. Use `yarn.lock` or `package-lock.json` depending on your package manager.

Query:

```graphql
{
  allPackageLicense {
    edges {
      node {
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
```

Example result:

```json
{
  "node": {
    "identifier": "@gatsbyjs/webpack-hot-middleware@2.25.2",
    "license": "MIT",
    "licenseText": "Copyright JS Foundation and other contributors\n\nPermissionhereby granted...",
    "package": "@gatsbyjs/webpack-hot-middleware",
    "url": "https://github.com/gatsbyjs/webpack-hot-middleware",
    "version": "2.25.2"
  }
}
```

## Development

### Linking the plugins folder to the sample site

```sh
cd plugin
yarn link
cd ../sample-site
yarn link "gatsby-source-package-licenses"
```

### To publish a new version to NPM

1. Bump version in package.json
2. Update readme (both i guess) `cp README.md ./plugin`

```sh 
cd plugins && npm publish
```
