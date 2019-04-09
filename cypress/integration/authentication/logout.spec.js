describe('Login Page', () => {
    const baseUrl = 'http://localhost:8100';

    beforeEach(() => {
        cy.viewport('iphone-6');
        cy.visit(`${baseUrl}/login`);
    });

    it('should logout', () => {
        cy.login();
        cy.get('ion-menu-button')
            .should('be', 'visible')
            .click();
    });
});
