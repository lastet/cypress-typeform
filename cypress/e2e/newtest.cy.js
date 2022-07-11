const sampleForm = require('../fixtures/exampleForm.json');
const API_URL = Cypress.env('API_BASE_URL');
const authorization = `Bearer ${Cypress.env('TYPEFORM_ACCESS_TOKEN')}`



describe('Typeform API', () => {
  it('retrieves my user information', () => {
    cy.request({
      method: 'GET',
      url: `${API_URL}me`,
      headers: { authorization }
    }).should(({ status, body }) => {
      const { alias, language } = body
      expect(status).to.eq(200)
      expect(alias).to.eq(Cypress.env('userAlias'))
      expect(language).to.eq('en')
    })
  })

  it('retrieves form responses', () => {
    cy.request({
      method: 'GET',
      url: `${API_URL}forms/${Cypress.env('formId')}/responses`,
      headers: { authorization }
    }).should(({ status, body }) => {
      expect(status).to.eq(200)
      expect(body.total_items).to.eq(body.items.length)
    })
  })

 
  context('cleanup boards before start', () => {
    beforeEach(() => {
      cy.request({
        method: 'GET',
        url: `${API_URL}forms`,
        headers: { authorization }
    }).should(({ status,body }) => {
      expect(status).to.eq(200)
      body.items.forEach(item => {
        if (item.title === sampleForm.title) {
          cy.request({
            method:'DELETE',
            url: `${API_URL}forms/${item.id}`,
            headers: { authorization }
          }).should(({ status }) => {
            expect(status).to.eq(204)
          })
        }
      })
    })

})


    it('creates a new form', () => {
      cy.request({
        method: 'POST',
        url: `${API_URL}forms`,
        headers: { authorization },
        body: sampleForm
      }).should(({ status, body }) => {
          const { fields, title, type } = body
          expect(status).to.eq(201)
          expect(fields.length).to.eq(sampleForm.fields.length)
          expect(title).to.eq(sampleForm.title)
          expect(type).to.eq(sampleForm.type)
        })
    })
  })
})