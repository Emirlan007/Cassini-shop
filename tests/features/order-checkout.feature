Feature: Checkout process
  As a customer
  I want to complete checkout step by step
  So that my order data is validated correctly

  @cart-to-checkout
  Scenario: User goes from cart to checkout form
    Given the cart contains the product "Атласное миди-платье с кружевной отделкой"
    When the user is on the "/cart" page
    Then the user clicks "checkout-next-from-cart"
    Then the user sees the "checkout-form"

  @checkout-to-payment
  Scenario: User fills checkout form with valid data
    Given the cart contains the product "Атласное миди-платье с кружевной отделкой"
    When the user is on the "/cart" page
    And the user clicks "checkout-next-from-cart"
    Then the user sees the "checkout-form"
    Then the user enters "New Name" in the "name" field
    And the user enters "888888888" in the "phoneNumber" field
    And the user enters "Bishkek" in the "city" field
    And the user enters "Chui 123" in the "address" field
    And the user submits checkout form
    Then the user sees the "payment-step"


  @checkout-validation-error
  Scenario: User cannot continue checkout with empty fields
    Given the cart contains the product "Атласное миди-платье с кружевной отделкой"
    When the user is on the "/cart" page
    And the user clicks "checkout-next-from-cart"
    Then the user sees the "checkout-form"
    Then the user enters "New Name" in the "name" field
    And the user enters "" in the "phoneNumber" field
    And the user enters "" in the "city" field
    And the user enters "" in the "address" field
    And the user submits checkout form
    Then the user sees checkout validation errors

  @checkout-existing-phone
  Scenario: Error is shown when phone number already exists
    Given the cart contains the product "Атласное миди-платье с кружевной отделкой"
    When the user is on the "/cart" page
    And the user clicks "checkout-next-from-cart"
    Then the user sees the "checkout-form"
    Then the user enters "Existing User" in the "name" field
    And the user enters "123123123" in the "phoneNumber" field
    And the user enters "Bishkek" in the "city" field
    And the user enters "Chui 123" in the "address" field
    And the user submits checkout form
    Then the user sees the message "Пользователь уже существует"