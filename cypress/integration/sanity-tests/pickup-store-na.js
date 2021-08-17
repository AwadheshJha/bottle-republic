describe('Assert UI when pick-up store not available', function() {
  beforeEach(function() {
    cy.intercept({ method: 'GET', path: '/api/features' }).as('feature')
    cy.intercept({ method: 'GET', path: '/settings' }).as('settings')
    cy.intercept({ method: 'GET', path: '/api/products?**' }).as('product')
    cy.intercept({ method: 'PUT', path: '/api/orders/**' }).as('addedtocart');

  });

  it('Should be able to enter the site', function() {
    cy.visit(Cypress.env('stagingurl'));
    cy.clearCookies();
    cy.wait('@feature');
    cy.url().should('include', 'https://bottlerepublic-web-stage.herokuapp.com/');
    cy.get('div[class^="verification-form"]').within(function() {
      cy.get('input[type*=checkbox]').click();
      cy.get('button[class=verification-submit]').click();
    });
  });

  it('Should be able to search a product', function() {
    cy.get('iframe').then($iframe => {
      cy.get('input[class=search-input]').type(Cypress.env('stagingproductkey'));
      cy.get('[class*=input-icon]').eq(0).click();
    });
    cy.wait('@product');
    cy.get('.card-container-3d > .card > .face-front').eq(0).within(function() {
      cy.get('footer > .product-actions > .add-button > button').click();
      cy.scrollTo('top');
    });
    cy.get('#cart-total').should('contain', '1');
    cy.get('.notification-count-container').eq(0).click();
    cy.contains('Continue >').click();
    cy.get('#checkout > div > div.container__option > div > div:nth-child(2)').click();
    cy.get('.option__store--disabled').within(function() {
      cy.contains('Currently not available at this store');
    })
  });
});
