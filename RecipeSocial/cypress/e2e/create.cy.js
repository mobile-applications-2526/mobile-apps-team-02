

describe('Create Recipe Flow', () => {
    beforeEach(() => {
        cy.loginWithTestUser();
        cy.navigateTo('Create');
        cy.wait(2000);
    });

    it('creates a recipe successfully', () => {
        // ---------- STEP 1: INGREDIENTS ----------
        cy.get('[data-testid="ingredient-name-input"]').type('Butter');
        cy.get('[data-testid="ingredient-qty-input"]').type('100g');
        cy.get('[data-testid="ingredient-add-button"]').click();

        cy.contains('Butter'); // verify added
        cy.get('[data-testid="ingredients-next-button"]').click();

        // ---------- STEP 2: TEXT ----------
        cy.get('[data-testid="recipe-title-input"]').type('Test Recipe');
        cy.get('[data-testid="recipe-description-input"]').type(
            'This is an automated test recipe'
        );

        cy.get('[data-testid="text-next-button"]').click();

        // ---------- STEP 3: DETAILS ----------
        // Select first category
        cy.get('[data-testid^="category-"]').first().click();

        // Difficulty picker (RN Web)
        cy.get('[data-testid="difficulty-picker"]').select('easy');

        // Prep time
        cy.get('[data-testid="prep-time-input"]').type('30');

        // Share
        cy.get('[data-testid="share-button"]').click();


        cy.contains('Test Recipe').should('exist');
    });
});
