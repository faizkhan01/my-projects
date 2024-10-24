This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Prerequisites

Make sure you have installed all of the following prerequisites on your development machine:

- Node.js (v16 or higher)

You can use [nvm](https://github.com/nvm-sh/nvm) or [nvm-windows](https://github.com/coreybutler/nvm-windows) to manage your Node versions.

## Installation

```bash
$ yarn install
```

## Getting Started

First, run the development server:

```bash
$ yarn run dev
```

Open [http://localhost:3002](http://localhost:3002) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Setup E2E tests with Cypress

1. Make sure that the API is running with `docker compose up test`.
2. Create the `cypress.env.json` in the root of the project and add all the needed keys from `cypress.env.example.json`.
   For the E2E_USER_PASSWORD you need to make sure it's the same as in the API
3. Run `yarn run cypress`

## Technologies

- [Storybook](https://storybook.js.org/docs/react/get-started/introduction)
- [Next.js](https://nextjs.org/learn/basics/create-nextjs-app)
- [Material UI](https://mui.com/material-ui/getting-started/learn/#free)
- [Typescript](https://www.typescriptlang.org/cheatsheets)
- [Jest](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/docs/)

## FAQ

### Where can I learn all of those technologies?

What I recommend to everyone is spending some time trying to read the documentation of every technology. It's the best way to learn them. Or you can watch some youtube videos to learn the basics.

Here I'll leave some **cheatsheets** so you can learn "fast".

- [GIT](https://education.github.com/git-cheat-sheet-education.pdf)
- [Typescript with React](https://react-typescript-cheatsheet.netlify.app/)
- [React](https://www.freecodecamp.org/news/the-react-cheatsheet/)

### I get an error running git commit, it's something with Husky.

There are a lot of reasons, the most common reason is because you have errors with Eslint or Typescript.

To see the errors of Eslint you can run:

```bash
$ yarn run lint
```

And for Typescript you can run:

```bash
$ npx tsc -p tsconfig.json
```

If you get any errors running any of them, please try to solve them.

If you don't have any errors, please try making the commit following the guidelines of [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/).

For example:

```bash
$ git commit -m "feat: my really descriptive commit about a feature"
```

```bash
$ git commit -m "fix: my fix of a problem"
```

### I can't change of branch with git checkout. Help!

Check if you have any changes files on changed status or staged status. To check that, use:

```bash
$ git status
```

If you have any files there then, you have some options, it depends of the context.

1. **I want to change of branch because my branch will be deleted, but for some reason I made changes that won't be used.**

Just remove the changes that you might have running:

```bash
$ git restore .
```

2. **I want to change of branch to check another branch but I don't want to loose my changes and I don't want to make a commit.**

You can save them temporarily using [git stash](https://www.atlassian.com/git/tutorials/saving-changes/git-stash):

```bash
$ git stash
```

And now you can change of branch.

If you need to recover those changes run:

```bash
$ git stash apply
```

3. **I want to change of branch and keep my changes with a commit.**

Save your changes with [git add](https://github.com/git-guides/git-add).

And create a [commit](https://github.com/git-guides/git-commit), please make sure to follow [conventional commit guidelines](https://www.conventionalcommits.org/en/v1.0.0/#summary)

### When I run the app with yarn dev, it shows an error like: a module couldn't be found.

Just install/update dependencies:

```bash
$ yarn install
```

### The frontend doesn't connect with the backend

Make sure that you have created the **.env.local** file, you can see the required variables inside .env.example file.

<!-- ## CI/CD Gitlab group runner -->
<!-- sudo gitlab-runner register -n --url https://gitlab.com/ --registration-token GR1348941_pSYHKe4VENYAm29qLtq --executor docker --description "DC-WeteloNode Group Docker Runner" --docker-image "docker:19.03.12" --docker-privileged --docker-volumes "/certs/client" -->
<!-- sudo gitlab-runner verify --delete -->
<!---->
<!-- ### new staging server -->
<!-- new server -->
<!---->
<!-- pm2 deploy pm2-app.json staging setup -->
<!-- pm2 deploy pm2-app.json production setup -->
<!---->
<!-- CI/CD -->
<!---->
<!-- https://gitlab.com/wetelo-hussein-mohammed/digit-carts/spa -->
