// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// -- Custom Commands for RecipeSocial App --

// Login command - expects to already be on login screen
Cypress.Commands.add('login', (email, password) => {
  // Clear any existing text first
  cy.get('[data-testid="login-email-input"]').clear();
  cy.get('[data-testid="login-password-input"]').clear();

  // Type credentials
  cy.get('[data-testid="login-email-input"]').type(email);
  cy.get('[data-testid="login-password-input"]').type(password);

  // Click login button
  cy.get('[data-testid="login-button"]').click();

  // Wait longer for navigation and async operations
  cy.wait(4000);
});

// Complete login flow from start - navigates from start screen to login and performs login
Cypress.Commands.add('loginFromStart', (email, password) => {
  cy.visit('/');
  cy.waitForApp();

  // Click "Log in" button on start screen
  cy.contains('Log in').click();
  cy.wait(1000);

  // Use login command
  cy.login(email, password);
});

// Helper to login with default test credentials
// Usage: cy.loginWithTestUser()
Cypress.Commands.add('loginWithTestUser', () => {
  // Replace these with your actual test credentials
  const testEmail = Cypress.env('TEST_EMAIL') || 'test@example.com';
  const testPassword = Cypress.env('TEST_PASSWORD') || 'testpassword';

  cy.loginFromStart(testEmail, testPassword);
});

// Logout command
Cypress.Commands.add('logout', () => {
  cy.get('[data-testid="profile-button"]').click();
  cy.contains('button', 'Logout').click();
});

// Add to favorites/collections
Cypress.Commands.add('addToFavorites', (recipeTitle) => {
  cy.contains(recipeTitle).click();
  cy.get('[data-testid="favorite-button"]').click();
  cy.go('back');
});

// Search for recipe
Cypress.Commands.add('searchRecipe', (searchTerm) => {
  cy.get('[data-testid="search-input"], [aria-label="search-input"], #search-input').first().clear().type(searchTerm);
});

// Navigate to screen
Cypress.Commands.add('navigateTo', (screenName) => {
  const screenMap = {
    'Home': 'nav-home',
    'Collections': 'nav-collections',
    'Create': 'nav-create',
    'Profile': 'nav-profile',
  };

  const testId = screenMap[screenName];
  if (testId) {
    // Try multiple selectors - React Native Web might use different attributes
    cy.get(`[data-testid="${testId}"], [aria-label="${testId}"], #${testId}`).first().click();
  }
});

// Wait for app to load
Cypress.Commands.add('waitForApp', () => {
  cy.wait(2000); // Wait for app initialization
});

// -- Example of overwriting existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

