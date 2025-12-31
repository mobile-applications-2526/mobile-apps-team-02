const { defineConfig } = require('cypress');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

module.exports = defineConfig({
  env: {
    E2E: true,
  },

  e2e: {
    baseUrl: 'http://localhost:8081',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',

    setupNodeEvents(on, config) {
      const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY // REQUIRED
      );

      on('task', {
        async deleteTestRecipe() {
          console.log('[E2E] deleteTestRecipe started');

          const { data, error } = await supabase
            .from('recipes')
            .delete()
            .eq('title', 'Test Recipe')
            .select(); // REQUIRED to get deleted rows

          if (error) {
            console.error('[E2E] Supabase error:', error);
            throw error;
          }

          console.log('[E2E] Deleted rows:', data.length);
          return data.length;
        },
      });
    },
  },

  component: {
    devServer: {
      framework: 'react',
      bundler: 'webpack',
    },
    specPattern: 'cypress/component/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/component.js',
  },

  viewportWidth: 412,
  viewportHeight: 924,
  video: true,
  screenshotOnRunFailure: true,
});
