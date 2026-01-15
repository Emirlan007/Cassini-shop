const { I } = inject();

Given("the user is on the {string} page", (page: string) => {
  I.amOnPage(page);
});

When(
  "the user enters {string} in the {string} field",
  (value: string, field: string) => {
    I.fillField(field, value);
  }
);

When("the form is submitted", () => {
  I.click('button[type="submit"]');
});

Then("the user is redirected to the {string} page", (page: string) => {
  I.waitInUrl(page, 1);
  I.seeCurrentUrlEquals("/");
});

Then("the user sees the message {string}", (message: string) => {
  I.see(message);
});

Then("the user stays on the {string} page", (page: string) => {
  I.seeCurrentUrlEquals(page);
});
