// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  autoLogin: false,
  useMockData: false,
  // NEEDS TO BE AN EVEN NUMBER!!!
  reloadEvery: 10,
  apiUrl: 'http://vmkemper14.informatik.tu-muenchen.de:8080',
};
