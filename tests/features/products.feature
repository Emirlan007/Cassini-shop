Feature: Products features
    As a user of the website, i should be able to add an item to my cart, remove an item from my cart, add an item to my wish list, remove an item from my wish list, and search for items

  @add-item-to-cart
  Scenario: Adding an item to the cart
    Given the user is on the "/product/atlasnoe-midi-plate-s-kruzhevnoy-otdelkoy" page
    When the user selects "e4c62d" color
    And the user selects "xs" size
    And the user adds the product to the cart
    Then the user sees the message "Товар добавлен в корзину"
    And the number of items in the cart is 1