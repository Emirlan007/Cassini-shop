const { I } = inject();

let cartItemsCount = 0;

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
  I.waitInUrl(page, 1);
  I.wait(2)
  I.seeCurrentUrlEquals("/");
  I.wait(2)
});

Then("the user sees the message {string}", (message: string) => {
  I.see(message);
  I.wait(2)
});

Then("the user stays on the {string} page", (page: string) => {
  I.seeCurrentUrlEquals(page);
  I.wait(2)
});

When("the user adds the product to the cart", () => {
  I.click('[data-testid="add-to-cart"]');
});

Given("the cart contains the product {string}", async (product: string) => {
  I.amOnPage("/cart");

  const exists = await I.grabNumberOfVisibleElements(
    locate('[data-testid="cart-item"]').withText(product)
  );

  cartItemsCount = exists;

  if (!exists) {
    I.amOnPage("/product/atlasnoe-midi-plate-s-kruzhevnoy-otdelkoy");
    I.click('[data-testid="color-e4c62d"]');
    I.click('[data-testid="size-xs"]');
    I.click('[data-testid="add-to-cart"]');
    I.see("Товар добавлен в корзину");
    I.amOnPage("/cart");

    cartItemsCount = await I.grabNumberOfVisibleElements(
      '[data-testid="cart-item"]'
    );
  }
});

Then("the user sees the product {string} on the page", (product: string) => {
  I.see(product);
});

/////////////

When('the user clicks "checkout-next-from-cart"', () => {
  I.click('[data-testid="checkout-next-from-cart"]');
  I.wait(2);
});

Then('the user sees the "checkout-form"', (step: string) => {
  I.waitForElement('[data-testid="checkout-form"]', 5);
});

Then('the user sees the "payment-step"', (step: string) => {
  I.waitForElement('[data-testid="payment-step"]', 5);
  I.wait(2);
});

Then('checkout step "{string}" is active', async (step: string) => {
  const isActive = await I.grabAttributeFrom(
    `[data-testid="checkout-step-${step}"]`,
    "data-active"
  );

  if (isActive !== "true") {
    throw new Error(`Checkout step ${step} is not active`);
  }
});


When("the user submits checkout form", () => {
  I.click('[data-testid="checkout-submit"]');
  I.wait(1);
});

Then('the user sees checkout validation errors', async () => {
  await I.wait(1);
  await I.waitForText('Пожалуйста, заполните все поля', 7);
});

Then('the user sees the message {string}', (message: string) => {
  I.wait(1);
  I.see(message);
});

When('the user chooses qrCode payment', () => {
  I.click('[data-testid="payment-qr"]');
});

When('the user places the order', () => {
  I.click('[data-testid="place-order-button"]');
});

Then('the user sees her order on the account page', () => {
  I.waitForElement('[data-testid="user-orders-title"]', 5);
  I.seeElement('[data-testid="order-card"]');
});

When('the user refreshes the {string} page', (page: string) => {
  I.amOnPage(page);
  I.refreshPage();
});

Then('only one order is displayed', async () => {
  const ordersCount = await I.grabNumberOfVisibleElements('[data-testid="order-card"]');
  if (ordersCount !== 1) {
    throw new Error(`Expected 1 order, but found ${ordersCount}`);
  }
});

Then('the order contains the product {string}', (product: string) => {
  I.see(product, '[data-testid="order-card"]');
});
