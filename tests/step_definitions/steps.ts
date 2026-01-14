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

When("the user selects {string} color", (color: string) => {
  I.click(`[data-testid="color-${color}"]`);
});

When("the user selects {string} size", (size: string) => {
  I.click(`[data-testid="size-${size}"]`);
});

When("the user adds the product to the cart", () => {
  I.click('button[data-testid="add-to-cart"]');
});

Then("the number of items in the cart is {int}", (count: number) => {
  I.see(`${count}`, '[data-testid="cart-items-count"]');
});
