# Cypress Testing for RecipeSocial

## Overview
This project uses Cypress for end-to-end (E2E) testing of the RecipeSocial app running on Expo Web.

## Setup Complete ✅
- Cypress installed
- Configuration files created
- Sample tests written
- Custom commands defined
- Test fixtures added

## Running Tests

### Option 1: Interactive Mode (Recommended for Development)
```bash
# Start the Expo web server in one terminal
npm run web

# In another terminal, open Cypress Test Runner
npm run cypress:open
```

### Option 2: Headless Mode (Recommended for CI/CD)
```bash
# Runs tests in headless mode
npm run test:e2e
```

### Option 3: Manual Process
```bash
# Terminal 1: Start the web server
npm run web

# Terminal 2: Run Cypress
npm run cypress:run
```

## Test Structure

### Directory Layout
```
cypress/
├── e2e/              # End-to-end test files
│   └── app.cy.js     # Main app tests
├── fixtures/         # Test data
│   ├── users.json    # User test data
│   └── recipes.json  # Recipe test data
└── support/          # Helper files
    ├── commands.js   # Custom Cypress commands
    └── e2e.js        # Global configuration
```

### Custom Commands Available

- `cy.login(email, password)` - Log in a user
- `cy.logout()` - Log out the current user
- `cy.addToFavorites(recipeTitle)` - Add a recipe to favorites
- `cy.searchRecipe(searchTerm)` - Search for recipes
- `cy.navigateTo(screenName)` - Navigate to a screen (Home, Collections, Create, Profile)
- `cy.waitForApp()` - Wait for app initialization

## Writing Tests

### Example Test
```javascript
describe('My Feature', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.waitForApp();
  });

  it('should do something', () => {
    cy.navigateTo('Collections');
    cy.contains('My Collections').should('be.visible');
  });
});
```

## Important Notes

### Testing React Native with Cypress
- Cypress tests your app running in **web mode** (Expo Web)
- Make sure your app works on web: `npm run web`
- Not all React Native features work on web (e.g., some native modules)
- Tests run in a browser environment, not on actual mobile devices

### Adding Test IDs
To make tests more reliable, add `data-testid` attributes to your components:

```jsx
<TouchableOpacity data-testid="favorite-button">
  <Ionicons name="heart" />
</TouchableOpacity>
```

Then in tests:
```javascript
cy.get('[data-testid="favorite-button"]').click();
```

### Test Data
- Use fixtures for consistent test data
- Create test users in your Supabase database
- Consider using environment variables for test credentials

## Configuration

### cypress.config.js
- Base URL: `http://localhost:8081` (Expo web default)
- Viewport: 375x667 (mobile size)
- Videos and screenshots enabled

### Modifying Configuration
Edit `cypress.config.js` to change:
- Base URL
- Viewport size
- Video/screenshot settings
- Timeouts

## Best Practices

1. **Use data-testid attributes** instead of relying on text or class names
2. **Keep tests independent** - each test should work on its own
3. **Use fixtures** for test data
4. **Clean up after tests** - remove created data
5. **Use custom commands** for repeated actions
6. **Wait appropriately** - use `cy.wait()` or better, wait for elements

## Troubleshooting

### App not loading
- Ensure Expo web server is running: `npm run web`
- Check that the base URL matches your server port
- Look for errors in the browser console

### Tests failing
- Check if the app works manually in a browser
- Verify selectors are correct
- Add `cy.wait()` if elements load slowly
- Check for console errors

### Supabase/API Issues
- Ensure you're using test credentials
- Check network tab in Cypress for API responses
- Consider mocking API calls for faster, more reliable tests

## Next Steps

1. **Add data-testid attributes** to your components
2. **Write more specific tests** for your features
3. **Set up CI/CD** to run tests automatically
4. **Create test users** in your database
5. **Mock API calls** for faster tests (optional)

## Resources

- [Cypress Documentation](https://docs.cypress.io)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Testing React Native with Cypress](https://docs.expo.dev/guides/testing-with-cypress/)

