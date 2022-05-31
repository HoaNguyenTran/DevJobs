# Fjob - Platform to provide jobs for the young generation.

![alt logo fjob](https://static-s.aa-cdn.net/img/gp/20600015927164/4V73z25w3uamttxXJw8GAZg1b-VqKvfoAZvRn81V0v8tEXritdB86A22CJofr2gyrg=s300?v=1)

## Tech Stack
- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Redux](https://redux.js.org/)
- [Redux-saga](https://redux-saga.js.org/)
- [Ant Design](https://ant.design/index-cn)

## Installation

You can download the project [here](https://github.com/zetajsc/fjob-frontend) or use command:
```bash
git clone https://github.com/zetajsc/fjob-frontend.git
```

## Available Scripts

### `Package management tool: Yarn`
In the project directory, please use the command to install the necessary packages: 

```bash
yarn install
```

## Usage

### Runs the app in the development mode.
```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

### Step start run in production server. 

```bash
yarn build
```
Build the application for production usage.
Your app is ready to be deployed!

```bash
yarn start
```
Start a Next.js production server.

## Contributing
Please make sure to update tests as appropriate.

## Project structure
```bash
.
├── api                # handle call api (axios)
│   ├── client         # define endpoint in CSR
│   ├── server         # define endpoint in SSR
│   └── config         # config default request (interceptors, refresh token, ...)
├── pages              # Routes structure & handle SSR
├── public             # Storage assets (images, icons, ...)      
├── src                # Main source code
│   ├── components     # Write UI here
│   │   ├── elements   # Reuse component (Header, Footer, ModalPopup, ...)
│   │   ├── layouts    # Layout project
│   │   └── modules    # Component belongs to only page
│   ├── constants      # Define constants
│   ├── hooks          # Custom hook
│   ├── redux          # State management redux (handle side effect: redux-saga)
│   ├── styles         # Style of project (Scss)
│   │   ├── common     # Settings folder
│   │   ├── customAntd # Custom antdesign
│   │   └── utilities  # Define utility className like bootstrap
│   ├── types          # Define types (ts)
│   └── utils          # Reuse func, helper func, utilities func
└── ...
```

## Coding conventions
### `Based on Airbnb Coding conventions:`
+ [ECMAScript 6](https://github.com/airbnb/javascript)
+ [React](https://github.com/airbnb/javascript/blob/master/react)
+ [CSS-in-JS](https://github.com/airbnb/javascript/blob/master/css-in-javascript)

## CSS Breakpoint
375px - (480px) - 576px - 768px - 992px - 1200px - 1440px

## Git conventions
- commit: feat/ chore/ fixup/ style/ refactor 
- branch: feat/ chore/ hotfix/

## Develop team
1. Nguyễn Trần Hoà - hoanguyentrandev@gmail.com - (hoa.nt - Hoa Nguyen Tran - Thomas Nguyen - hoatep)
2. Nguyễn Văn Đạt
3. Trần Quân Đạt