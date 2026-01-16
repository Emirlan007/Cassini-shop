const { I } = inject();

Given("the user is on the {string} page", (page: string) => {
  I.amOnPage(page);
  I.wait(2)
});

When(
  "the user enters {string} in the {string} field",
  (value: string, field: string) => {
    I.fillField(field, value);
    I.wait(2)
  }
);

When("the form is submitted", () => {
  I.click('button[type="submit"]');
  I.wait(2)
});

Then("the user is redirected to the {string} page", (page: string) => {
  I.waitInUrl(page, 5);
  I.wait(2)
});

Then("the user sees the message {string}", (message: string) => {
  I.waitForText(message, 5);
  I.wait(2)
});

Then("the user stays on the {string} page", (page: string) => {
  I.waitInUrl(page, 5);
  I.wait(2)
});
