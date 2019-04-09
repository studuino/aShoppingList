describe('Logout Page', () => {
    const baseUrl = 'http://localhost:8100';

    beforeEach(() => {
        cy.viewport('iphone-6');
        cy.visit(`${baseUrl}/login`);
    });

    it('should logout', () => {
        cy.login().wait(3000);
        // TODO ALH workout menu toggle click!
    });
});
