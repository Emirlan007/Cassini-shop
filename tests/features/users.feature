Feature: User features
    As a user of the website, i should be able to register and log in

  @register
  Scenario: Successful user registration
    Given the user is on the "/register" page
    When the user enters "Test user" in the "name" field
    And the user enters "550871243" in the "phoneNumber" field
    And the form is submitted
    Then the user is redirected to the "/" page

  @register-with-existing-phone-number
  Scenario: User registration with an existing phone number
    Given the user is on the "/register" page
    When the user enters "Admin User" in the "name" field
    And the user enters "999999999" in the "phoneNumber" field
    And the form is submitted
    Then the user sees the message "Пользователь с таким номером уже существует"
    And the user stays on the "/register" page

  @login
  Scenario: Successful user login
    Given the user is on the "/login" page
    When the user enters "Test User" in the "name" field
    And the user enters "123123123" in the "phoneNumber" field
    And the form is submitted
    Then the user is redirected to the "/" page

  @login-with-non-existent-phone-number
  Scenario: User login with a non-existent phone number
    Given the user is on the "/login" page
    When the user enters "Nonexistent User" in the "name" field
    And the user enters "000000000" in the "phoneNumber" field
    And the form is submitted
    Then the user sees the message "Пользователь с таким номером не найден"
    And the user stays on the "/login" page