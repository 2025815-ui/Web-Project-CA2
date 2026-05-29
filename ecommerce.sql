-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: May 29, 2026 at 07:30 PM
-- Server version: 8.0.44
-- PHP Version: 8.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ecommerce`
--

-- --------------------------------------------------------

--
-- Table structure for table `basket`
--

CREATE TABLE `basket` (
  `id` int NOT NULL,
  `session_id` varchar(100) DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `quantity` int DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  `isNewRelease` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `category`, `price`, `image`, `isNewRelease`) VALUES
(1, 'Cyberpunk 2077', 'RPG', 59.99, '/images/cyberpunk.jpeg', 1),
(2, 'EA Sports FC 25', 'Sports', 69.99, '/images/FC25.png', 1),
(3, 'Call of Duty MW3', 'Shooter', 79.99, '/images/CODMW3.jpg', 1),
(4, 'Minecraft', 'Adventure', 29.99, '/images/Minecraft.jpg', 0),
(5, 'Forza Horizon 5', 'Racing', 49.99, '/images/Forza Horizon.avif', 1),
(6, 'The Last of Us Part II', 'Adventure', 59.99, '/images/LOU2.jpeg', 1),
(7, 'God of War Ragnarok', 'Action', 69.99, '/images/godofwar.jpg', 1),
(8, 'Valorant', 'Shooter', 0.00, '/images/valorant.jpg', 0),
(9, 'League of Legends', 'MOBA', 0.00, '/images/leagueoflegend.jpeg', 0),
(10, 'Apex Legends', 'Battle Royale', 0.00, '/images/apex.jpg', 1),
(11, 'Resident Evil 4 Remake', 'Horror', 64.99, '/images/resident evil.jpg', 1),
(12, 'FIFA 24', 'Sports', 59.99, '/images/FC24.avif', 0),
(13, 'Red Dead Redemption 2', 'Adventure', 39.99, '/images/red dead redemption 2.jpg', 0),
(14, 'Assassin’s Creed Mirage', 'Action', 54.99, '/images/assassin creed.avif', 1),
(15, 'Fortnite', 'Battle Royale', 0.00, '/images/fornite.jpg', 0),
(16, 'Gran Turismo 7', 'Racing', 49.99, '/images/gran turismo 7.jpg', 1),
(17, 'Elden Ring', 'RPG', 59.99, '/images/elden ring.jpg', 1),
(18, 'NBA 2K25', 'Sports', 69.99, '/images/NBA 2K25.jpg', 1),
(19, 'Overwatch 2', 'Shooter', 0.00, '/images/overwatch.jpg', 0),
(20, 'Need for Speed Unbound', 'Racing', 39.99, '/images/NFS.jpg', 1),
(21, 'Grand Theft Auto VI', 'Action', 89.99, '/images/gta6.png', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `basket`
--
ALTER TABLE `basket`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `basket`
--
ALTER TABLE `basket`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `basket`
--
ALTER TABLE `basket`
  ADD CONSTRAINT `basket_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
