const { I } = inject();

let cartItemsCount = 0;

let cartItemQuantity: number;

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
  I.click('[data-testid="add-to-cart"]');
});

Then("the number of items in the cart is {int}", (count: number) => {
  I.see(`${count}`, '[data-testid="cart-items-count"]');
});

Given("the user checks the current number of items in the cart", async () => {
  const value = await I.grabTextFrom('[data-testid="cart-items-count"]');
  cartItemsCount = Number(value || 0);
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

Then("the number of items in the cart increases by 1", async () => {
  const value = await I.grabTextFrom('[data-testid="cart-items-count"]');
  const newCartItemsCount = Number(value || 0);
  if (newCartItemsCount !== cartItemsCount + 1) {
    throw new Error(
      `Expected cart count to increase by 1. Previous: ${cartItemsCount}, Current: ${newCartItemsCount}`
    );
  }
  cartItemsCount = newCartItemsCount;
});

Then("the number of items in the cart decreases by 1", async () => {
  const currentCount = await I.grabNumberOfVisibleElements(
    '[data-testid="cart-item"]'
  );

  if (currentCount !== cartItemsCount - 1) {
    throw new Error(
      `Expected cart items to decrease by 1. Before: ${cartItemsCount}, After: ${currentCount}`
    );
  }
});

Then(
  "the user checks the quantity of the product {string}",
  async (product: string) => {
    const item = locate('[data-testid="cart-item"]').withText(product);
    const quantity = await I.grabTextFrom(
      item.find('[data-testid="cart-item-quantity"]')
    );
    cartItemQuantity = Number(quantity);
  }
);

Then(
  "the quantity of the product {string} is greater than 1",
  async (product: string) => {
    const item = locate('[data-testid="cart-item"]').withText(product);
    const quantity = await I.grabTextFrom(
      item.find('[data-testid="cart-item-quantity"]')
    );
    const quantityValue = Number(quantity);

    if (quantityValue <= 1) {
      I.click(item.find('[data-testid="increase-cart-item-quantity"]'));
      cartItemQuantity = Number(
        await I.grabTextFrom(item.find('[data-testid="cart-item-quantity"]'))
      );
    }
  }
);

Then(
  "the quantity of the product {string} increases by 1",
  async (product: string) => {
    const item = locate('[data-testid="cart-item"]').withText(product);

    const quantity = await I.grabTextFrom(
      item.find('[data-testid="cart-item-quantity"]')
    );
    const currentQuantity = Number(quantity);

    if (currentQuantity !== cartItemQuantity + 1) {
      throw new Error(
        `Expected quantity of "${product}" to increase by 1. Previous: ${cartItemQuantity}, Current: ${currentQuantity}`
      );
    }

    cartItemQuantity = currentQuantity;
  }
);

Then(
  "the quantity of the product {string} decreases by 1",
  async (product: string) => {
    const item = locate('[data-testid="cart-item"]').withText(product);

    const quantity = await I.grabTextFrom(
      item.find('[data-testid="cart-item-quantity"]')
    );

    const currentQuantity = Number(quantity);

    if (currentQuantity !== cartItemQuantity - 1) {
      throw new Error(
        `Expected quantity of "${product}" to decrease by 1. Previous: ${cartItemQuantity}, Current: ${currentQuantity}`
      );
    }

    cartItemQuantity = currentQuantity;
  }
);

When(
  "the user removes the product {string} from the cart",
  (product: string) => {
    const item = locate('[data-testid="cart-item"]').withText(product);
    I.click(item.find('[data-testid="remove-from-cart"]'));
  }
);

Then(
  "the user does not see the product {string} in the cart",
  (product: string) => {
    I.dontSee(product);
  }
);

When(
  "the user increases the quantity of the product {string}",
  (product: string) => {
    const item = locate('[data-testid="cart-item"]').withText(product);
    I.click(item.find('[data-testid="increase-cart-item-quantity"]'));
  }
);

When(
  "the user decreases the quantity of the product {string}",
  (product: string) => {
    const item = locate('[data-testid="cart-item"]').withText(product);
    I.click(item.find('[data-testid="decrease-cart-item-quantity"]'));
  }
);

Given("the user is logged in", async () => {
  I.amOnPage("/login");
  I.fillField("name", "Test User");
  I.fillField("phoneNumber", "123123123");
  I.click('button[type="submit"]');
});

Given("the wishlist contains the product {string}", async (product: string) => {
  I.amOnPage("/product/atlasnoe-midi-plate-s-kruzhevnoy-otdelkoy");

  const isInWishlist = await I.grabAttributeFrom(
    '[data-testid="toggle-is-product-in-wishlist"]',
    "data-active"
  );

  if (isInWishlist !== "true") {
    I.click('[data-testid="toggle-is-product-in-wishlist"]');
    I.see("Товар добавлен в избранное");
  }

  I.amOnPage("/wishlist");
  I.see(product);
});

Given(
  "the wishlist does not contain the product {string}",
  async (product: string) => {
    I.amOnPage("/product/atlasnoe-midi-plate-s-kruzhevnoy-otdelkoy");

    const isInWishlist = await I.grabAttributeFrom(
      '[data-testid="toggle-is-product-in-wishlist"]',
      "data-active"
    );

    if (isInWishlist === "true") {
      I.click('[data-testid="toggle-is-product-in-wishlist"]');
      I.see("Товар удалён из избранного");
    }

    I.amOnPage("/wishlist");
    I.dontSee(product);
  }
);

When("the user adds the product to the wishlist", () => {
  I.click('[data-testid="toggle-is-product-in-wishlist"]');
});

When("the user removes the product from the wishlist", () => {
  I.click('[data-testid="toggle-is-product-in-wishlist"]');
});

Then("the user sees the product {string} on the page", (product: string) => {
  I.see(product);
});

Then(
  "the user does not see the product {string} on the page",
  (product: string) => {
    I.dontSee(product);
  }
);

Given("the user is not logged in", () => {
  I.amOnPage("/");
  I.executeScript(() => localStorage.removeItem("persist:shop:users"));
});

Then("the user sees {int} products", async (count: number) => {
  const products = await I.grabNumberOfVisibleElements(
    '[data-testid="product-card"]'
  );

  if (products !== count) {
    throw new Error(`Expected ${count} products, but found ${products}`);
  }
});

When("the user is searching for {string}", (text: string) => {
  I.fillField("searchQuery", text);
  I.click('button[type="submit"]');
});

When("the user switches the language to {string}", (lang: string) => {
  I.click('[data-testid="language-select"]');
  I.click(`[data-testid="language-${lang}"]`);
});
