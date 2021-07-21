# node-js-template

Template to quickly start node-js projects.

Pre-Configured ESLint + Prettier

First runs Prettier then ESLint

## Setup

### VS Code Settings 

```json
  // formatting
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[javascript]": {
    "editor.formatOnSave": false,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.codeActionsOnSave": [
      "source.formatDocument",
      "source.organizeImports",
      "source.fixAll.eslint"
    ]
  },
```

### VS Code Plugins

- [Format Code Action](https://marketplace.visualstudio.com/items?itemName=rohit-gohri.format-code-action)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
