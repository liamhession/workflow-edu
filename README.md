# Workflow Edu

## TODO
* Create real rules to lock down data read/writes to [Firestore](https://console.firebase.google.com/u/2/project/workflow-edu/database/firestore/rules) 
* The Gatsby way to pull in data would be with GraphQL sources and there is a plugin for firestore, but not sure i could input new entries with that

# Notes from starter project:
A JavaScript function intercepts form submits and sends them using `fetch` instead. There's also a helper to get field values using their name, [see `getFieldValue(form, fieldName)` on GitHub](https://github.com/HugoDF/netlify-lambda-tailwind-static-starter/blob/fc936bd76f201c90ade459a9ab73bf19fdab6aec/public/index.html#L65).

This is a good starting point for quick Lambda demos.

## Development setup

You should run `yarn` before starting.

The following scripts are available:

* `yarn start`: start the Lambda(s) and serving the static directory using [Netlify Dev](https://www.netlify.com/products/dev/) . **Important:** before `start`, `yarn build:tw` runs.
* `yarn build:tw`: build the full set of Tailwind CSS utilities (useful for development), make sure to check what your site looks will look like live using `yarn build:css`
* `yarn build`: run netlify-lambda build + Tailwind CSS production build (removes unused classes using PurgeCSS)
* `yarn build:css`: Tailwind CSS production build (removes unused classes using PurgeCSS)
* `yarn lint` and `yarn format`: runs XO, the "JavaScript linter with great defaults" (see [github.com/xojs/xo](https://github.com/xojs/xo#readme)) with or without the `--fix` flag respectively
