Feature: Banners features
    As a website administrator, i should be able to create a banner, edit a banner, delete a banner, and switch the status of a banner

  @create-banner
  Scenario: Successful banner creation
    Given the admin user is logged in
    And the user is on the "/admin/banners/new" page
    When the user enters "Summer Sale" in the "title" field
    And the user uploads an image "dress.png"
    And the form is submitted
    And the user is redirected to the "/admin/banners" page
    And the user sees the banner "Summer Sale" in the list

  @edit-banner
  Scenario: Successful banner editing
    Given the admin user is logged in
    And the banner "Tuxedo Discount" exists
    And the user is on the "/admin/banners" page
    When the user opens the edit page for the banner "Tuxedo Discount"
    And the user changes the "title" field to "Winter Sale"
    And the form is submitted
    Then the user is redirected to the "/admin/banners" page
    And the user sees the banner "Winter Sale" in the list

  @delete-banner
  Scenario: Successful banner deletion
    Given the admin user is logged in
    And the banner "Tuxedo Discount" exists
    And the user is on the "/admin/banners" page
    When the user deletes the banner "Tuxedo Discount"
    Then the user stays on the "/admin/banners" page
    And the user does not see the banner "Tuxedo Discount" in the list

  @activate-banner
  Scenario: Successful banner activation
    Given the admin user is logged in
    And the banner "Tuxedo Discount" exists
    And the user is on the "/admin/banners" page
    And the banner "Tuxedo Discount" is inactive
    When the user switches the status of the "Tuxedo Discount" banner
    Then the user sees the status active for the "Tuxedo Discount" banner

  @deactivate-banner
  Scenario: Successful banner deactivation
    Given the admin user is logged in
    And the banner "Tuxedo Discount" exists
    And the user is on the "/admin/banners" page
    And the banner "Tuxedo Discount" is active
    When the user switches the status of the "Tuxedo Discount" banner
    Then the user sees the status inactive for the "Tuxedo Discount" banner

  @active-banner-visible
  Scenario: Active banner is displayed on the homepage
    Given the admin user is logged in
    And the banner "Summer Sale" exists
    And the banner "Summer Sale" is active
    When the user is on the "/" page
    Then the banner "Summer Sale" is present on the page

  @inactive-banner-hidden
  Scenario: Inactive banner is not displayed on the homepage
    Given the admin user is logged in
    And the banner "Summer Sale" exists
    And the banner "Summer Sale" is inactive
    When the user is on the "/" page
    Then the banner "Summer Sale" is not present on the page