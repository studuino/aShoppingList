describe('Login Page', () => {
    const email = 'e2e@test.dk';
    const password = '123456';
    const baseUrl = 'http://localhost:8100';
    const emailFieldSelector = 'input[name=email]';
    const passwordFieldSelector = 'input[name=password]';
    const fieldInvalidClass = 'ng-invalid';

    beforeEach(() => {
        cy.viewport('iphone-6');
        cy.visit(`${baseUrl}/login`);
    });

    it('should have a title', function () {
        cy.contains('Please Login');
    });

    it('should block protected routes', () => {
        cy.visit(`${baseUrl}/shopping`);
        cy.url().should('include', 'login');
    });

    it('should have disabled login button', () => {
        cy.get('ion-button').should('have.class', 'button-disabled');
    });

    it('should display input field errors', () => {
        // Email
        cy.get(emailFieldSelector).type('INCORRECT EMAIL');
        cy.get('ion-input').first().should('have.class', fieldInvalidClass);
        cy.get(passwordFieldSelector).click();
        cy.contains('Please enter an email');
        // Password
        cy.get(emailFieldSelector).clear().type(email);
        cy.contains('Please enter a password');
        cy.get(passwordFieldSelector).clear().type('123');
        cy.contains('Password should be at least 4 characters');
    });

    it('should login with valid form', () => {
        cy.get(emailFieldSelector).type(email);
        cy.get(passwordFieldSelector).type(password);
        cy.get('ion-button').click();
        cy.url().should('include', 'shopping');
    });
});
