/* Cpsc 471 Functional Progress Report SQL Statements
Jiaqi Wu UCID 30172397 Dept. of Computer Science - Faculty of Science - CPSC 471
*/

-- Create Database
CREATE DATABASE RestaurantDB;
USE RestaurantDB;

-- Adding Tables

-- Customers Table
-- This table will store the customer information
CREATE TABLE Customers (
    CustomerID INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    PhoneNumber VARCHAR(15),
    PasswordHash VARCHAR(255) NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Menu Items table
-- This table will store customer information
CREATE TABLE MenuItems (
    ItemID INT AUTO_INCREMENT PRIMARY KEY,
    ItemName VARCHAR(100) NOT NULL,
    Description TEXT,
    Price DECIMAL(10, 2) NOT NULL,
    Category VARCHAR(50),
    ImageURL VARCHAR(255),
    IsAvailable BOOLEAN DEFAULT TRUE
);


-- Orders Table
-- This table will store the menu items
CREATE TABLE Orders (
    OrderID INT AUTO_INCREMENT PRIMARY KEY,
    CustomerID INT,
    OrderDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    TotalAmount DECIMAL(10, 2) NOT NULL,
    Status ENUM('Pending', 'Processing', 'Completed', 'Cancelled') DEFAULT 'Pending',
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
);

-- Order details table
-- This table will store the details of each order and the items ordered
CREATE TABLE OrderDetails (
    OrderDetailID INT AUTO_INCREMENT PRIMARY KEY,
    OrderID INT,
    ItemID INT,
    Quantity INT NOT NULL,
    Price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
    FOREIGN KEY (ItemID) REFERENCES MenuItems(ItemID)
);

-- Reservations Table
-- This table will store table reservations made by customers
CREATE TABLE Reservations (
    ReservationID INT AUTO_INCREMENT PRIMARY KEY,
    CustomerID INT,
    ReservationDate DATE NOT NULL,
    ReservationTime TIME NOT NULL,
    NumberOfGuests INT NOT NULL,
    Status ENUM('Confirmed', 'Cancelled') DEFAULT 'Confirmed',
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
);

-- Staff Table
-- This table will store staff information
CREATE TABLE Staff (
    StaffID INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    PhoneNumber VARCHAR(15),
    Role ENUM('Admin', 'Manager', 'Waiter') NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO Customers (FirstName, LastName, Email, PhoneNumber, PasswordHash)
VALUES ('John', 'Doe', 'john.doe@example.com', '1234567890', 'hashedpassword123');

INSERT INTO MenuItems (ItemName, Description, Price, Category, ImageURL)
VALUES ('Cheeseburger', 'A classic cheeseburger with lettuce, tomato, and cheese.', 9.99, 'Burgers', 'https://example.com/cheeseburger.jpg');

INSERT INTO Orders (CustomerID, TotalAmount, Status)
VALUES (1, 19.98, 'Pending');

INSERT INTO OrderDetails (OrderID, ItemID, Quantity, Price)
VALUES (1, 1, 2, 9.99);

INSERT INTO Reservations (CustomerID, ReservationDate, ReservationTime, NumberOfGuests)
VALUES (1, '2023-10-15', '18:00:00', 4);

INSERT INTO Staff (FirstName, LastName, Email, PhoneNumber, Role, PasswordHash)
VALUES ('Jane', 'Smith', 'jane.smith@example.com', '0987654321', 'Admin', 'hashedpassword456');

-- Update Operations

-- Update menu item price
UPDATE MenuItems
SET Price = 10.99
WHERE ItemID = 1;

-- Update order status
UPDATE Orders
SET Status = 'Completed'
WHERE OrderID = 1;

-- Update Reservation Status
UPDATE Reservations
SET Status = 'Cancelled'
WHERE ReservationID = 1;

-- Delete operations
DELETE FROM Customers
WHERE CustomerID = 1;

DELETE FROM MenuItems
WHERE ItemID = 1;

DELETE FROM Orders
WHERE OrderID = 1;

DELETE FROM Reservations
WHERE ReservationID = 1;

-- Select operations

SELECT * FROM MenuItems;

SELECT * FROM MenuItems;

SELECT * FROM Reservations
WHERE ReservationDate = '2023-10-15';

SELECT * FROM Staff
WHERE Role = 'Admin';

-- View active reservations
CREATE VIEW ActiveReservations AS
SELECT ReservationID, CustomerID, ReservationDate, ReservationTime, NumberOfGuests
FROM Reservations
WHERE Status = 'Confirmed';

-- Transactions
START TRANSACTION;

INSERT INTO Orders (CustomerID, TotalAmount)
VALUES (1, 19.98);

SET @lastOrderID = LAST_INSERT_ID();

INSERT INTO OrderDetails (OrderID, ItemID, Quantity, Price)
VALUES (@lastOrderID, 1, 2, 9.99);

COMMIT;


