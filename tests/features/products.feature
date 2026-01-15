Feature: Products features
    As a user of the website, i should be able to add an item to my cart, remove an item from my cart, add an item to my wish list, remove an item from my wish list, and search for items

  @add-item-to-cart
  Scenario: Adding an item to the cart
    Given the user is on the "/product/atlasnoe-midi-plate-s-kruzhevnoy-otdelkoy" page
    When the user selects "e4c62d" color
    And the user selects "xs" size
    And the user checks the current number of items in the cart
    And the user adds the product to the cart
    Then the user sees the message "Товар добавлен в корзину"
    And the number of items in the cart increases by 1

  @remove-item-from-cart
  Scenario: Removing an item from the cart
    Given the cart contains the product "Атласное миди-платье с кружевной отделкой"
    When the user is on the "/cart" page
    And the user removes the product "Атласное миди-платье с кружевной отделкой" from the cart
    Then the user does not see the product "Атласное миди-платье с кружевной отделкой" in the cart

  @increase-item-quantity
  Scenario: Increase item quantity in the cart
    Given the cart contains the product "Атласное миди-платье с кружевной отделкой"
    And the user is on the "/cart" page
    And the user checks the quantity of the product "Атласное миди-платье с кружевной отделкой"
    When the user increases the quantity of the product "Атласное миди-платье с кружевной отделкой"
    Then the quantity of the product "Атласное миди-платье с кружевной отделкой" increases by 1

  @decrease-item-quantity
  Scenario: Decrease item quantity in the cart
    Given the cart contains the product "Атласное миди-платье с кружевной отделкой"
    And the user is on the "/cart" page
    And the quantity of the product "Атласное миди-платье с кружевной отделкой" is greater than 1
    When the user decreases the quantity of the product "Атласное миди-платье с кружевной отделкой"
    Then the quantity of the product "Атласное миди-платье с кружевной отделкой" decreases by 1

  @add-item-to-wishlist
  Scenario: Adding an item to the wishlist
    Given the user is logged in
    And the wishlist does not contain the product "Атласное миди-платье с кружевной отделкой"
    And the user is on the "/product/atlasnoe-midi-plate-s-kruzhevnoy-otdelkoy" page
    When the user adds the product to the wishlist
    Then the user sees the message "Товар добавлен в избранное"
    And the user is on the "/wishlist" page
    Then the user sees the product "Атласное миди-платье с кружевной отделкой" on the page

  @remove-item-from-wishlist
  Scenario: Removing an item from the wishlist
    Given the user is logged in
    And the wishlist contains the product "Атласное миди-платье с кружевной отделкой"
    And the user is on the "/product/atlasnoe-midi-plate-s-kruzhevnoy-otdelkoy" page
    When the user removes the product from the wishlist
    Then the user sees the message "Товар удалён из избранного"
    And the user is on the "/wishlist" page
    And the user does not see the product "Атласное миди-платье с кружевной отделкой" on the page

  @add-item-to-wishlist-not-logged-in
  Scenario: Adding an item to the wishlist without logging in
    Given the user is not logged in
    And the user is on the "/product/atlasnoe-midi-plate-s-kruzhevnoy-otdelkoy" page
    When the user adds the product to the wishlist
    Then the user sees the message "Войдите в аккаунт, чтобы добавить товар в избранное"

  @search-products
  Scenario: Searching for a products
    Given the user is on the "/search" page
    When the user enters "джинсы" in the "searchQuery" field
    And the form is submitted
    Then the user sees 6 products

  @search-language-switch
  Scenario: Search results update when language is changed
    Given the user is on the "/search" page
    And the user is searching for "джинсы"
    When the user switches the language to "en"
    Then the user sees 6 products