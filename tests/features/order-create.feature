Feature: Order creation
  As a customer
  I want to place an order
  So that it appears in my account page

  @order-success
  Scenario: Successful order creation
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
    When the user chooses qrCode payment
    And the user enters "Доставить после 18:00" in the "comment" field
    And the user places the order
    Then the user sees the message "Заказ оформлен!"
    And the user sees her order on the account page
    When the user refreshes the "/account" page
    And the order contains the product "Атласное миди-платье с кружевной отделкой"
