const { defineConfig } = require('cypress');

module.exports = defineConfig({
  env: {
    E2E: true
  },
  e2e: {
    baseUrl: 'http://localhost:8081', // Expo web default port
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'webpack',
    },
    specPattern: 'cypress/component/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/component.js',
  },
  viewportWidth: 412, // Mobile viewport width
  viewportHeight: 924, // Mobile viewport height
  video: true,
  screenshotOnRunFailure: true,
});

