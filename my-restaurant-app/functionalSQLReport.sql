/* Cpsc 471 Functional Progress Report SQL Statements
Jiaqi Wu UCID: 30172397
Sumerah Rowshan UCID: 30160897
Tanvir Himel UCID: 30148868 
Dept. of Computer Science - Faculty of Science - CPSC 471
*/

-- Create Database
CREATE DATABASE RestaurantDB;
USE RestaurantDB;

-- Adding Tables

-- Users table
CREATE TABLE Users(
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Email VARCHAR(100) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    Role ENUM('Admin', 'Customer', 'Staff') NOT NULL DEFAULT 'Customer',
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
    
-- Customers Table
-- This table will store the customer specific information
CREATE TABLE Customers (
    CustomerID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT UNIQUE,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    PhoneNumber VARCHAR(15),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);

-- Staff Table
-- This table will store staff information
CREATE TABLE Staff (
    StaffID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT UNIQUE,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    PhoneNumber VARCHAR(15),
    Role ENUM('KitchenStaff', 'FrontOfHouse') NOT NULL,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
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
    Status ENUM('Pending', 'Completed', 'Cancelled') DEFAULT 'Pending',
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


-- Insert sample data
INSERT INTO Users (Email, PasswordHash, Role)
VALUES ('admin@bakery.com', '$2a$10$U4/tp0uI249ooyhbUR/NKeQOcIhGvJZ9XWV3gBCsz3yqApaq6ruTe', 'Admin');

INSERT INTO MenuItems (ItemName, Description, Price, Category, ImageURL)
VALUES ('Red Velvet Cake', 'A rich and moist red velvet cake with cream cheese frosting.', 10.99, 'Cakes', 'https://i.imgur.com/HyTSrMR.jpeg');

INSERT INTO MenuItems (ItemName, Description, Price, Category, ImageURL)
VALUES ('Chocolate Chip Cookie', 'Classic cookie with rich chocolate chunks baked to golden perfection.', 2.99, 'Cookies', 'https://i.imgur.com/DC5Z3Oc.jpeg');

-- INSERT INTO Orders (UserID, TotalAmount, Status)
-- VALUES (1, 19.98, 'Pending');

-- INSERT INTO OrderDetails (OrderID, ItemID, Quantity, Price)
-- VALUES (1, 1, 2, 9.99);

-- INSERT INTO Reservations (CustomerID, ReservationDate, ReservationTime, NumberOfGuests)
-- VALUES (1, '2023-10-15', '18:00:00', 4);

-- INSERT INTO Staff (FirstName, LastName, Email, PhoneNumber, Role, PasswordHash)
-- VALUES ('Jane', 'Smith', 'jane.smith@example.com', '0987654321', 'Admin', 'hashedpassword456');

-- -- Update Operations

-- -- Update menu item price
-- UPDATE MenuItems
-- SET Price = 10.99
-- WHERE ItemID = 1;

-- -- Update order status
-- UPDATE Orders
-- SET Status = 'Completed'
-- WHERE OrderID = 1;

-- -- Update Reservation Status
-- UPDATE Reservations
-- SET Status = 'Cancelled'
-- WHERE ReservationID = 1;

-- -- Delete operations
-- DELETE FROM Customers
-- WHERE CustomerID = 1;

-- DELETE FROM MenuItems
-- WHERE ItemID = 1;

-- DELETE FROM Orders
-- WHERE OrderID = 1;

-- DELETE FROM Reservations
-- WHERE ReservationID = 1;

-- -- Select operations

-- SELECT * FROM MenuItems;

-- SELECT * FROM MenuItems;

-- SELECT * FROM Reservations
-- WHERE ReservationDate = '2023-10-15';

-- SELECT * FROM Staff
-- WHERE Role = 'Admin';

-- -- View active reservations
-- CREATE VIEW ActiveReservations AS
-- SELECT ReservationID, CustomerID, ReservationDate, ReservationTime, NumberOfGuests
-- FROM Reservations
-- WHERE Status = 'Confirmed';

-- -- Transactions
-- START TRANSACTION;

-- INSERT INTO Orders (CustomerID, TotalAmount)
-- VALUES (1, 19.98);

-- SET @lastOrderID = LAST_INSERT_ID();

-- INSERT INTO OrderDetails (OrderID, ItemID, Quantity, Price)
-- VALUES (@lastOrderID, 1, 2, 9.99);

COMMIT;


