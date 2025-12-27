# Cypress Testing - Quick Start Guide

## ✅ Setup Complete!

Cypress has been successfully installed and configured for your RecipeSocial app.

## How to Run Tests

### Step 1: Start Your App on Web
In one terminal:
```bash
npm run web
```
Wait for the server to start (usually at http://localhost:8081)

### Step 2: Open Cypress Test Runner
In another terminal:
```bash
npm run cypress:open
```

This will open the Cypress GUI where you can:
- See all your tests
- Run tests interactively
- Watch tests run in a browser
- Debug failing tests

### Alternative: Run Tests in Headless Mode
```bash
npm run test:e2e
```
This will:
- Start the web server automatically
- Run all tests in the background
- Generate videos and screenshots
- Perfect for CI/CD pipelines

## What's Been Set Up

### 📁 Files Created:
- `cypress.config.js` - Main configuration
- `cypress/e2e/app.cy.js` - Sample tests
- `cypress/support/commands.js` - Custom test commands
- `cypress/support/e2e.js` - Global setup
- `cypress/fixtures/users.json` - Test user data
- `cypress/fixtures/recipes.json` - Test recipe data
- `cypress/README.md` - Detailed documentation

### 📦 Packages Installed:
- `cypress` - The testing framework
- `start-server-and-test` - Automatically starts server before tests

### 🎯 New NPM Scripts:
- `npm run cypress:open` - Open Cypress GUI
- `npm run cypress:run` - Run tests headlessly
- `npm run test:e2e` - Start server + run tests

## Testing Limitations for React Native

⚠️ **Important**: Cypress tests your app in **web mode only**

### What This Means:
- Your app runs in a browser (via Expo Web)
- Only web-compatible features can be tested
- Native modules (camera, push notifications, etc.) won't work
- Tests simulate mobile viewport (375x667)

### What You CAN Test:
✅ UI rendering and layout
✅ Navigation between screens
✅ User interactions (clicks, typing)
✅ API calls and data fetching
✅ Form submissions
✅ Search functionality
✅ Collections/Favorites management

### What You CANNOT Test:
❌ Native device features
❌ App-specific gestures (unless web-compatible)
❌ Real mobile performance
❌ Platform-specific behavior

## Next Steps to Improve Tests

### 1. Add Test IDs to Your Components
Make tests more reliable by adding `data-testid` attributes:

```jsx
// In your components (e.g., Navbar.js)
<TouchableOpacity data-testid="nav-home" onPress={() => navigation.navigate('Home')}>
  <Ionicons name="home" />
</TouchableOpacity>

<TouchableOpacity data-testid="nav-collections" onPress={() => navigation.navigate('Collections')}>
  <Ionicons name="heart" />
</TouchableOpacity>
```

Then in tests:
```javascript
cy.get('[data-testid="nav-collections"]').click();
```

### 2. Create Test Users in Supabase
You'll need real test accounts to test authentication:
1. Create test users in your Supabase database
2. Update `cypress/fixtures/users.json` with real credentials
3. Never commit real passwords to git!

### 3. Write Tests for Your Features
Example test for Collections screen:
```javascript
describe('Collections Screen', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.login('test@example.com', 'testpassword');
    cy.navigateTo('Collections');
  });

  it('should display user favorites', () => {
    cy.contains('My Collections').should('be.visible');
    cy.get('[data-testid="recipe-card"]').should('exist');
  });

  it('should allow clicking on a recipe', () => {
    cy.get('[data-testid="recipe-card"]').first().click();
    cy.contains('Ingredients').should('be.visible'); // Recipe detail screen
  });
});
```

## Troubleshooting

### "baseUrl is not responding"
- Make sure your web server is running: `npm run web`
- Check the port in `cypress.config.js` matches your server

### Tests are flaky
- Add `cy.waitForApp()` at the start of tests
- Use `cy.get().should('be.visible')` instead of `cy.wait()`
- Add `data-testid` attributes for more reliable selectors

### Can't find elements
- Check if the element exists on web (not just mobile app)
- Use Cypress selector playground in the GUI
- Check for typos in selectors

## Resources

📚 **Documentation:**
- Full guide: `cypress/README.md`
- Cypress docs: https://docs.cypress.io
- Expo testing: https://docs.expo.dev/guides/testing-with-cypress/

🎓 **Learning:**
- Cypress Best Practices: https://docs.cypress.io/guides/references/best-practices
- Custom Commands: https://docs.cypress.io/api/cypress-api/custom-commands
- API Testing: https://docs.cypress.io/guides/guides/network-requests

## Example: Running Your First Test

1. **Start the web server:**
   ```bash
   npm run web
   ```

2. **Open Cypress:**
   ```bash
   npm run cypress:open
   ```

3. **Choose E2E Testing** in the Cypress window

4. **Select a browser** (Chrome recommended)

5. **Click on `app.cy.js`** to run the sample tests

6. **Watch the magic happen!** 🎉

The tests will run in the browser, and you'll see each step execute in real-time.

---

**Questions?** Check out the detailed README in `cypress/README.md` or visit the Cypress documentation.

Happy Testing! 🧪

