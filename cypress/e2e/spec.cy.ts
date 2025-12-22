describe("template spec", () => {
  it("passes", () => {
    cy.visit("/");
  });
  it("test_Search", () => {
    cy.visit("/search/");
    cy.get("input").type("muppets");
    cy.get("button").click();
    cy.wait(1000);
    cy.get(".movie-card-list-item__info h3").contains("muppets", {
      matchCase: false,
    });
  });
});
