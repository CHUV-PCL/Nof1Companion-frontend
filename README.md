<p align="center">
  <a href="https://nextjs.org">
    <img src="https://assets.vercel.com/image/upload/v1607554385/repositories/next-js/next-logo.png" height="128" alt="Next.js logo">
  </a>
</p>

# N-of-1 Companion - Frontend

## Description

_N-of-1 Companion_ is a web application designed to facilitate the conduct of N-of-1 therapeutic tests. It allows you to design and manage your tests, collect patient data, perform statistical analysis and many other features.

This tool is offered by the [Clinical Pharmacology Department of the University Hospital of Vaud (PCL - CHUV, Switzerland)](https://www.chuv.ch/fr/pcl/pcl-home/).
With the collaboration of the [School of Engineering and Management Vaud (HEIG-VD)](https://heig-vd.ch).

---

**This is the frontend part of the _N-of-1 Companion_ web application.**

Build with:

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [MUI](https://mui.com/)

> The backend part of the application can be found [here][nof1companion-backend-repo].

## Prerequisites

Please ensure that the following items are installed on your operating system :

- [Node.js](https://nodejs.org/en/download/) (version >= 16.13.0)
- [yarn](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

**Important** : Install the [backend part][nof1companion-backend-repo] of the application.

Create a `.env` file if not present and configure the following environment variables :

```bash
# Backend API URL
NEXT_PUBLIC_BACKEND_API_URL=http://your_backend_application_url # /!\ without a trailing /
# Application URL, used to send a link to an application page by email
NEXT_PUBLIC_APP_URL=https://nof1-app.vercel.app/ # /!\ without a trailing /
```

## Installation

Clone the repository and install the project dependencies using the following command in the project root folder:

```bash
$ yarn install
```

## Running the app

Commands:

```bash
# development mode
$ yarn dev

# production mode
$ yarn build
$ yarn start
```

> Default url : http://localhost:3000/ (or port :process.env.PORT)

## Maintenance
There is no guarantee that the project will be further developed. But you are welcome to fork the project.

## Contributors

- [Daniel Sciarra](https://github.com/DS-Daniel/)

Initially developed as a Bachelor study project at the [HEIG-VD](https://heig-vd.ch), then taken over as a Junior Software Engineer.

## License

Distributed under the GNU AGPLv3 license. See LICENSE for more information.

<!-- MARKDOWN LINKS -->

[nof1companion-backend-repo]: https://github.com/CHUV-PCL/Nof1Companion-backend
