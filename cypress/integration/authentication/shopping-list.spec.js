describe('Shopping List Page', () => {
    const baseUrl = 'http://localhost:8100';

    beforeEach(() => {
        cy.viewport('iphone-6');
        cy.visit(`${baseUrl}/login`);
        cy.login();
        cy.wait(2000);
    });

    it('should render default shopping list and location', () => {
        cy.contains('Liste 1');
        cy.contains('Default');
    });

    it('should delete item', () => {
        addItem('Apple');

        // TODO ALH: Work out this
    });

    function addItem(nameOfItem) {
        cy.get('input[type=text]').type(nameOfItem);
        cy.get('#addItemButton').should('be', 'visible').click();
    }
});
