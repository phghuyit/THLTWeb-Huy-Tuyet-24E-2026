-- CSDL du an StyleRent (THLTWeb Huy - Tuyet 24E)
-- Tao tu: php artisan migrate:fresh --seed (Laravel 12) ngay 07/11/2026
-- Import bang phpMyAdmin (XAMPP): tab Import -> chon file nay -> Go. File tu tao CSDL thltweb_huy_tuyet.

-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: thltweb_huy_tuyet
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `thltweb_huy_tuyet`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `thltweb_huy_tuyet` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;

USE `thltweb_huy_tuyet`;

--
-- Table structure for table `banners`
--

DROP TABLE IF EXISTS `banners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `banners` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(100) DEFAULT NULL,
  `image_url` varchar(255) NOT NULL,
  `link_url` varchar(255) DEFAULT NULL,
  `position` varchar(50) NOT NULL DEFAULT 'home_main_slider',
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `status` enum('active','hidden') NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `banners`
--

LOCK TABLES `banners` WRITE;
/*!40000 ALTER TABLE `banners` DISABLE KEYS */;
INSERT INTO `banners` VALUES (1,'Bộ Sưu Tập Dạ Hội & Tiệc Cưới 2026','https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80','/products','home_main_slider',1,'active','2026-11-07 07:27:39'),(2,'Áo Dài Lụa Tơ Tằm & Gấm Hoa Truyền Thống','https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1600&q=80','/products?category=ao-dai-truyen-thong','home_main_slider',2,'active','2026-11-07 07:27:39'),(3,'Vest Nam Lịch Lãm Cho Mọi Sự Kiện & Hội Nghị','https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1600&q=80','/products?category=vest-nam','home_main_slider',3,'active','2026-11-07 07:27:39');
/*!40000 ALTER TABLE `banners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `brands`
--

DROP TABLE IF EXISTS `brands`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `brands` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `slug` varchar(120) NOT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `status` enum('active','hidden') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `brands_slug_unique` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brands`
--

LOCK TABLES `brands` WRITE;
/*!40000 ALTER TABLE `brands` DISABLE KEYS */;
INSERT INTO `brands` VALUES (1,'Elise Fashion','elise-fashion','https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=400&q=80','Thương hiệu thời trang thiết kế hàng đầu với các dòng đầm dạ hội, trang phục sự kiện cao cấp.','active','2026-11-07 07:27:38','2026-11-07 07:27:38',NULL),(2,'Chung Thanh Phong Bridal','chung-thanh-phong-bridal','https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=400&q=80','Thương hiệu váy cưới và đầm dạ tiệc cao cấp của NTK Chung Thanh Phong, tôn vinh nét quyến rũ và lộng lẫy.','active','2026-11-07 07:27:38','2026-11-07 07:27:38',NULL),(3,'Adam Store','adam-store','https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=400&q=80','Thương hiệu âu phục và veston nam may sẵn hàng đầu Việt Nam, phong cách lịch lãm và chuẩn phom dáng quý ông.','active','2026-11-07 07:27:38','2026-11-07 07:27:38',NULL),(4,'Linh Bùi Haute Couture','linh-bui-haute-couture','https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=400&q=80','Chuyên các dòng áo dài lụa tơ tằm thêu tay thủ công tinh xảo, áo dài cưới truyền thống và cách tân quý phái.','active','2026-11-07 07:27:38','2026-11-07 07:27:38',NULL),(5,'Juliette Bridal','juliette-bridal','https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80','Thương hiệu váy cưới công chúa hoàng gia nhập khẩu với chất liệu ren Pháp và cườm đá lấp lánh.','active','2026-11-07 07:27:38','2026-11-07 07:27:38',NULL),(6,'Charles & Keith','charles-keith','https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=400&q=80','Thương hiệu phụ kiện túi xách, clutch dạ tiệc thời thượng được phái đẹp yêu thích.','active','2026-11-07 07:27:38','2026-11-07 07:27:38',NULL);
/*!40000 ALTER TABLE `brands` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cart_items` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `cart_id` bigint(20) unsigned NOT NULL,
  `product_id` bigint(20) unsigned NOT NULL,
  `product_size_id` bigint(20) unsigned DEFAULT NULL,
  `quantity` int(10) unsigned NOT NULL DEFAULT 1,
  `rent_start_date` date DEFAULT NULL,
  `rent_end_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cart_items_cart_id_foreign` (`cart_id`),
  KEY `cart_items_product_id_foreign` (`product_id`),
  KEY `cart_items_product_size_id_foreign` (`product_size_id`),
  CONSTRAINT `cart_items_cart_id_foreign` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_items_product_size_id_foreign` FOREIGN KEY (`product_size_id`) REFERENCES `product_sizes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `carts` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `carts_user_id_unique` (`user_id`),
  CONSTRAINT `carts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categories` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `slug` varchar(120) NOT NULL,
  `parent_id` int(10) unsigned DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `status` enum('active','hidden') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_slug_unique` (`slug`),
  KEY `categories_parent_id_foreign` (`parent_id`),
  CONSTRAINT `categories_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Áo dài','ao-dai',NULL,'Các mẫu áo dài truyền thống và hiện đại.','/images/categories/ao-dai.jpg','active','2026-11-07 07:27:37','2026-11-07 07:27:37',NULL),(2,'Váy đầm','vay-dam',NULL,'Váy đầm dành cho dự tiệc và sự kiện.','/images/categories/vay-dam.jpg','active','2026-11-07 07:27:37','2026-11-07 07:27:37',NULL),(3,'Trang phục nam','trang-phuc-nam',NULL,'Trang phục nam lịch sự cho nhiều dịp.','/images/categories/trang-phuc-nam.jpg','active','2026-11-07 07:27:37','2026-11-07 07:27:37',NULL),(4,'Phụ kiện','phu-kien',NULL,'Phụ kiện phối cùng trang phục.','/images/categories/phu-kien.jpg','active','2026-11-07 07:27:37','2026-11-07 07:27:37',NULL),(5,'Áo dài truyền thống','ao-dai-truyen-thong',1,'Danh mục Áo dài truyền thống cho thuê.','/images/categories/ao-dai-truyen-thong.jpg','active','2026-11-07 07:27:37','2026-11-07 07:27:37',NULL),(6,'Áo dài cách tân','ao-dai-cach-tan',1,'Danh mục Áo dài cách tân cho thuê.','/images/categories/ao-dai-cach-tan.jpg','active','2026-11-07 07:27:37','2026-11-07 07:27:37',NULL),(7,'Váy dự tiệc','vay-du-tiec',2,'Danh mục Váy dự tiệc cho thuê.','/images/categories/vay-du-tiec.jpg','active','2026-11-07 07:27:37','2026-11-07 07:27:37',NULL),(8,'Váy cưới','vay-cuoi',2,'Danh mục Váy cưới cho thuê.','/images/categories/vay-cuoi.jpg','active','2026-11-07 07:27:37','2026-11-07 07:27:37',NULL),(9,'Vest nam','vest-nam',3,'Danh mục Vest nam cho thuê.','/images/categories/vest-nam.jpg','active','2026-11-07 07:27:37','2026-11-07 07:27:37',NULL),(10,'Túi xách','tui-xach',4,'Danh mục Túi xách cho thuê.','/images/categories/tui-xach.jpg','active','2026-11-07 07:27:37','2026-11-07 07:27:37',NULL);
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contacts`
--

DROP TABLE IF EXISTS `contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contacts` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `phone` varchar(30) NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  `subject` varchar(200) DEFAULT NULL,
  `message` text NOT NULL,
  `reply_note` text DEFAULT NULL,
  `status` enum('pending','read','replied') NOT NULL DEFAULT 'pending',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contacts`
--

LOCK TABLES `contacts` WRITE;
/*!40000 ALTER TABLE `contacts` DISABLE KEYS */;
INSERT INTO `contacts` VALUES (1,'Nguyễn Thị Thu Hà','0912345678','thuha.nguyen@gmail.com','Tư vấn thuê trang phục','Mình cần thuê 1 bộ áo dài cưới cho ngày 15 tháng này, showroom có sẵn mẫu size M tại chi nhánh không ạ?',NULL,'pending',NULL,'2026-11-07 05:27:39','2026-11-07 07:27:39'),(2,'Trần Văn Hoàng','0987654321','hoang.tran@outlook.com','Hỗ trợ đơn hàng','Đơn hàng SR-20261101 của mình muốn dời ngày nhận sang sáng ngày mai có được không?','Đã gọi điện xác nhận dời lịch nhận đồ thành công.','replied',NULL,'2026-11-06 07:27:39','2026-11-07 07:27:39'),(3,'Lê Minh Anh','0909123456','minhanh.le@gmail.com','Đặt lịch thử đồ tại showroom','Mình muốn hẹn lịch thử 3 mẫu váy dạ hội vào 14h chiều thứ 7 tuần này cho 2 người.','Đã xem qua yêu cầu, chờ showroom chuẩn bị trang phục.','read',NULL,'2026-11-05 07:27:39','2026-11-07 07:27:39');
/*!40000 ALTER TABLE `contacts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menus`
--

DROP TABLE IF EXISTS `menus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `menus` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `link` varchar(255) NOT NULL,
  `parent_id` bigint(20) unsigned DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `position` enum('header','footer') NOT NULL DEFAULT 'header',
  `status` enum('active','hidden') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `menus_parent_id_foreign` (`parent_id`),
  CONSTRAINT `menus_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `menus` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menus`
--

LOCK TABLES `menus` WRITE;
/*!40000 ALTER TABLE `menus` DISABLE KEYS */;
INSERT INTO `menus` VALUES (1,'Trang chủ','/',NULL,1,'header','active','2026-11-07 07:27:38','2026-11-07 07:27:38',NULL),(2,'Sản phẩm','/products',NULL,2,'header','active','2026-11-07 07:27:38','2026-11-07 07:27:38',NULL),(3,'Áo dài','/products?category=ao-dai',2,1,'header','active','2026-11-07 07:27:38','2026-11-07 07:27:38',NULL),(4,'Váy đầm','/products?category=vay-dam',2,2,'header','active','2026-11-07 07:27:38','2026-11-07 07:27:38',NULL),(5,'Vest nam','/products?category=vest-nam',2,3,'header','active','2026-11-07 07:27:38','2026-11-07 07:27:38',NULL),(6,'Váy cưới','/products?category=vay-cuoi',2,4,'header','active','2026-11-07 07:27:38','2026-11-07 07:27:38',NULL),(7,'Phụ kiện','/products?category=phu-kien',2,5,'header','active','2026-11-07 07:27:38','2026-11-07 07:27:38',NULL),(8,'Bài viết & Xu hướng','/news',NULL,3,'header','active','2026-11-07 07:27:39','2026-11-07 07:27:39',NULL),(9,'Bảng giá & Quy định','/pricing',NULL,4,'header','active','2026-11-07 07:27:39','2026-11-07 07:27:39',NULL),(10,'Về chúng tôi','/about',NULL,5,'header','active','2026-11-07 07:27:39','2026-11-07 07:27:39',NULL),(11,'Liên hệ','/contact',NULL,6,'header','active','2026-11-07 07:27:39','2026-11-07 07:27:39',NULL),(12,'Toàn bộ bộ sưu tập','/products',NULL,1,'footer','active','2026-11-07 07:27:39','2026-11-07 07:27:39',NULL),(13,'Váy cưới thiết kế','/products?category=vay-cuoi',NULL,2,'footer','active','2026-11-07 07:27:39','2026-11-07 07:27:39',NULL),(14,'Vest & Tuxedo cao cấp','/products?category=vest-nam',NULL,3,'footer','active','2026-11-07 07:27:39','2026-11-07 07:27:39',NULL),(15,'Tin tức & Cẩm nang','/news',NULL,4,'footer','active','2026-11-07 07:27:39','2026-11-07 07:27:39',NULL),(16,'Bảng giá & Quy định','/pricing',NULL,5,'footer','active','2026-11-07 07:27:39','2026-11-07 07:27:39',NULL);
/*!40000 ALTER TABLE `menus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'2026_09_18_152935_create_categories_table',1),(4,'2026_09_19_085545_create_brands_table',1),(5,'2026_09_19_090718_create_products_table',1),(6,'2026_09_20_173657_create_personal_access_tokens_table',1),(7,'2026_09_20_181241_create_banners_table',1),(8,'2026_09_21_035210_create_product_sizes_table',1),(9,'2026_09_21_040013_create_product_images_table',1),(10,'2026_09_21_081749_create_orders_table',1),(11,'2026_09_27_060055_add_deleted_at_to_brands_table=brands',1),(12,'2026_09_27_125126_add_deleted_at_to_categories_table',1),(13,'2026_10_03_223915_create_carts_table',1),(14,'2026_10_03_223919_create_cart_items_table',1),(15,'2026_10_12_020546_add_deleted_at_to_users_table',1),(16,'2026_10_12_022629_create_order_items_table',1),(17,'2026_10_12_031413_add_status_and_timestamps_to_orders_table',1),(18,'2026_10_19_051421_add_customer_details_to_orders_table',1),(19,'2026_10_26_055858_create_reviews_table',1),(20,'2026_10_26_060000_create_post_categories_table',1),(21,'2026_10_26_060100_create_posts_table',1),(22,'2026_10_26_060200_create_menus_table',1),(23,'2026_10_26_060400_update_status_enum_in_reviews_table',1),(24,'2026_11_01_083925_add_deleted_at_to_post_categories_menus_reviews_tables',1),(25,'2026_11_02_063440_create_vouchers_table',1),(26,'2026_11_02_063445_add_voucher_fields_to_orders_table',1),(27,'2026_11_02_070732_create_contacts_table',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `order_items` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint(20) unsigned NOT NULL,
  `product_size_id` bigint(20) unsigned NOT NULL,
  `quantity` int(10) unsigned NOT NULL DEFAULT 1,
  `rent_start_date` date NOT NULL,
  `rent_end_date` date NOT NULL,
  `rental_days` int(10) unsigned NOT NULL,
  `price_per_day` decimal(12,2) NOT NULL,
  `deposit_per_item` decimal(12,2) NOT NULL,
  `total_item_rental` decimal(12,2) NOT NULL,
  `total_item_deposit` decimal(12,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_items_order_id_foreign` (`order_id`),
  KEY `order_items_product_size_id_foreign` (`product_size_id`),
  CONSTRAINT `order_items_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_product_size_id_foreign` FOREIGN KEY (`product_size_id`) REFERENCES `product_sizes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1,4,1,'2026-10-15','2026-10-18',3,350000.00,1750000.00,1050000.00,1750000.00,'2026-11-07 07:27:38','2026-11-07 07:27:38'),(2,1,5,1,'2026-10-15','2026-10-18',3,350000.00,1750000.00,1050000.00,1750000.00,'2026-11-07 07:27:38','2026-11-07 07:27:38'),(3,2,6,2,'2026-10-20','2026-10-22',2,350000.00,1750000.00,1400000.00,3500000.00,'2026-11-07 07:27:38','2026-11-07 07:27:38');
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orders` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `order_code` varchar(30) NOT NULL,
  `user_id` bigint(20) unsigned NOT NULL,
  `receiver_name` varchar(255) DEFAULT NULL,
  `receiver_phone` varchar(30) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `payment_method` varchar(30) NOT NULL DEFAULT 'cod',
  `total_amount` bigint(20) NOT NULL DEFAULT 0,
  `note` text DEFAULT NULL,
  `voucher_code` varchar(50) DEFAULT NULL,
  `discount_amount` int(10) unsigned NOT NULL DEFAULT 0,
  `email_sent_at` timestamp NULL DEFAULT NULL,
  `status` varchar(30) NOT NULL DEFAULT 'confirmed',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `orders_order_code_unique` (`order_code`),
  KEY `orders_user_id_foreign` (`user_id`),
  CONSTRAINT `orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'ORD-20261001-0001',2,NULL,NULL,NULL,'cod',0,NULL,NULL,0,NULL,'confirmed',NULL,NULL,NULL),(2,'ORD-20261005-0002',2,NULL,NULL,NULL,'cod',0,NULL,NULL,0,NULL,'confirmed',NULL,NULL,NULL),(3,'ORD-20261010-0003',1,NULL,NULL,NULL,'cod',0,NULL,NULL,0,NULL,'confirmed',NULL,NULL,NULL);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) unsigned NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_categories`
--

DROP TABLE IF EXISTS `post_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `post_categories` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `slug` varchar(120) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `status` enum('active','hidden') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `post_categories_slug_unique` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_categories`
--

LOCK TABLES `post_categories` WRITE;
/*!40000 ALTER TABLE `post_categories` DISABLE KEYS */;
INSERT INTO `post_categories` VALUES (1,'Xu hướng thời trang','xu-huong-thoi-trang','Cập nhật những xu hướng thời trang, phong cách và màu sắc thịnh hành nhất.','active','2026-11-07 07:27:38','2026-11-07 07:27:38',NULL),(2,'Bí quyết phối đồ','bi-quyet-phoi-do','Mẹo phối đồ dạ hội, công sở và chọn trang phục che khuyết điểm cực tôn dáng.','active','2026-11-07 07:27:38','2026-11-07 07:27:38',NULL),(3,'Cẩm nang cưới & Dạ hội','cam-nang-cuoi-da-hoi','Kinh nghiệm chọn váy cưới lộng lẫy, vest chú rể chuẩn phom và áo dài cưới sang trọng.','active','2026-11-07 07:27:38','2026-11-07 07:27:38',NULL),(4,'Kinh nghiệm & Hướng dẫn thuê','kinh-nghiem-huong-dan-thue','Cẩm nang quy trình thuê, mẹo lấy số đo và chính sách đổi size, giữ gìn trang phục.','active','2026-11-07 07:27:38','2026-11-07 07:27:38',NULL),(5,'Phong cách sống & Sự kiện','phong-cach-song-su-kien','Ý tưởng chụp ảnh kỷ yếu, dress code tiệc gala, prom dạ hội và sự kiện ngoại cảnh.','active','2026-11-07 07:27:38','2026-11-07 07:27:38',NULL),(6,'Tin tức & Ưu đãi','tin-tuc-uu-dai','Các sự kiện đặc biệt, bộ sưu tập mới cập bến và mã ưu đãi độc quyền tại StyleRent.','active','2026-11-07 07:27:38','2026-11-07 07:27:38',NULL);
/*!40000 ALTER TABLE `post_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `posts` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `category_id` bigint(20) unsigned NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `summary` text DEFAULT NULL,
  `content` longtext NOT NULL,
  `is_hot` tinyint(1) NOT NULL DEFAULT 0,
  `views` int(10) unsigned NOT NULL DEFAULT 0,
  `status` enum('published','draft','hidden') NOT NULL DEFAULT 'published',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `posts_slug_unique` (`slug`),
  KEY `posts_category_id_foreign` (`category_id`),
  KEY `posts_user_id_foreign` (`user_id`),
  CONSTRAINT `posts_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `post_categories` (`id`) ON DELETE CASCADE,
  CONSTRAINT `posts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (1,1,1,'Xu Hướng Thời Trang 2026: Tối Giản Nhưng Đầy Quyến Rũ','xu-huong-thoi-trang-2026-toi-gian-quyen-ru','https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80','Khám phá các tông màu trung tính sang trọng và phom dáng cut-out tinh tế đang thống trị sàn diễn thời trang năm nay.','<p>Thời trang năm 2026 chứng kiến sự trở lại mạnh mẽ của phong cách Quiet Luxury kết hợp cùng đường nét hiện đại. Những chiếc đầm lụa trơn, blazer dáng suông mềm mại hay chân váy xẻ tà tinh tế trở thành sự lựa chọn hàng đầu cho các quý cô khi tham dự sự kiện.</p><p>Tại StyleRent, chúng tôi luôn tuyển chọn những bộ sưu tập đón đầu xu hướng để bạn luôn tự tin tỏa sáng mà không cần đầu tư tủ đồ đắt đỏ.</p>',1,1420,'published','2026-11-07 07:27:38','2026-11-07 07:27:38',NULL),(2,1,1,'Những Tông Màu Đầm Dạ Hội Tôn Da Được Ưa Chuộng Nhất','nhung-tong-mau-dam-du-tiec-ton-da-hot-nhat','https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format&fit=crop&q=80','Bí quyết chọn màu sắc đầm dạ hội tôn sắc da: từ đỏ rượu vang quyền lực, xanh rêu cổ điển đến ánh bạc ánh kim kiêu kỳ.','<p>Màu sắc trang phục đóng vai trò quyết định đến 70% ấn tượng thị giác trong những buổi tiệc tối ánh đèn vàng lung linh. Chọn đúng sắc độ sẽ giúp làn da của bạn bật tông rạng rỡ và thu hút mọi ánh nhìn.</p><p>Các gam màu bất hủ luôn nằm trong top cháy hàng tại StyleRent bao gồm: Đỏ Burgundy quý phái, Xanh Navy hoàng gia, Emerald huyền bí và tone Vàng Champagne thanh lịch.</p>',0,1120,'published','2026-11-07 07:27:38','2026-11-07 07:27:38',NULL),(3,2,1,'Top 5 Chiếc Đầm Dạ Hội Được Yêu Thích Nhất Mùa Tiệc Tùng','top-5-chiec-dam-da-hoi-duoc-yeu-thich-nhat','https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&q=80','Điểm danh 5 mẫu thiết kế dạ hội sang trọng, tôn dáng hoàn hảo giúp bạn trở thành tâm điểm của mọi ánh nhìn.','<p>Chọn đầm dự tiệc luôn đòi hỏi sự cân nhắc kỹ lưỡng về vóc dáng và tính chất của bữa tiệc. Dưới đây là top 5 thiết kế dạ hội đắt khách nhất tại showroom StyleRent:</p><ul><li>Đầm dạ hội đuôi cá cúp ngực sang trọng</li><li>Đầm lụa satin lệch vai quý phái</li><li>Váy xòe công chúa đính kết pha lê</li><li>Set vest dạ hội cách điệu cá tính</li><li>Đầm đen body cổ yếm thanh lịch</li></ul>',1,2680,'published','2026-11-07 07:27:38','2026-11-07 07:27:38',NULL),(4,2,1,'Bí Quyết Chọn Áo Dài Truyền Thống Tôn Dáng Cho Mọi Vóc Dáng','bi-quyet-chon-ao-dai-truyen-thong-ton-dang','https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80','Hướng dẫn chọn cổ áo, độ dài tà và họa tiết thêu giúp các nàng tự tin diện áo dài đẹp chuẩn mực trong các dịp lễ Tết, kỷ yếu.','<p>Tà áo dài thướt tha luôn là biểu tượng nét đẹp dịu dàng của người phụ nữ Việt Nam. Để diện áo dài thật tôn dáng, bạn cần nắm rõ tỉ lệ cơ thể:</p><p>Với dáng người tròn trịa, hãy ưu tiên chất liệu lụa rũ mềm và cổ thuyền nhẹ nhàng. Ngược lại, nàng mảnh mai sẽ rất phù hợp với áo dài 4 tà bồng bềnh cùng họa tiết thêu nổi đính ngọc trai.</p>',1,3150,'published','2026-11-07 07:27:38','2026-11-07 07:27:38',NULL),(5,2,1,'Mẹo Phối Túi Xách & Trang Sức Cực Hút Mắt Cùng Đầm Dạ Hội','meo-phoi-phu-kien-tui-xach-giay-cao-got-khi-du-tiec','https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop&q=80','Công thức phối phụ kiện Clutch ánh kim, khuyên tai đính đá và giày cao gót giúp nâng tầm bộ cánh dự tiệc của bạn.','<p>Một bộ đầm dạ hội đắt giá sẽ chưa thể hoàn hảo nếu thiếu đi những món phụ kiện ăn ý. Nguyên tắc vàng khi phối đồ dự tiệc là sự cân bằng: Nếu váy đã có nhiều hạt cườm lấp lánh, hãy chọn túi ví và trang sức tối giản để tránh gây rối mắt.</p><p>StyleRent cung cấp miễn phí dịch vụ tư vấn mix & match phụ kiện đi kèm khi quý khách thuê váy tại cửa hàng.</p>',0,840,'published','2026-11-07 07:27:38','2026-11-07 07:27:38',NULL),(6,3,1,'Xu Hướng Váy Cưới Minimalism: Vẻ Đẹp Thuần Khiết Lên Ngôi','xu-huong-vay-cuoi-minimalism-ve-dep-thuan-khiet','https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=800&auto=format&fit=crop&q=80','Làn sóng váy cưới lụa satin tối giản, đường cắt cúp thanh thoát đang trở thành niềm mơ ước của những cô dâu hiện đại.','<p>Không còn đính kết quá nhiều ren và kim sa cầu kỳ, váy cưới tối giản (Minimalist Wedding Dress) tôn vinh trọn vẹn vẻ đẹp tự nhiên và thần thái của cô dâu. Chất liệu Mikado hay lụa Satin cao cấp mang đến phom dáng đứng form và nét sang trọng vượt thời gian.</p><p>Bộ sưu tập váy cưới mới của StyleRent mang đến đa dạng kiểu dáng từ dáng A nhẹ nhàng đến cúp ngực đuôi cá quyến rũ.</p>',1,2410,'published','2026-11-07 07:27:38','2026-11-07 07:27:38',NULL),(7,3,1,'Top 4 Mẫu Vest Nam Lịch Lãm Cho Chú Rể Và Phù Rể','top-4-mau-vest-nam-lich-lam-cho-chu-re-va-phu-re','https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80','Từ tuxedo đen trang trọng cổ điển đến suit màu kem hiện đại, bí quyết để các quý ông xuất hiện phong độ trong ngày trọng đại.','<p>Chọn âu phục cho ngày cưới quan trọng không kém gì chiếc váy của cô dâu. Sự đồng điệu về phong cách và màu sắc giữa vest chú rể và váy cô dâu sẽ tạo nên những khung hình kỷ niệm hoàn hảo nhất.</p><p>Các mẫu Tuxedo cổ sam bóng và Suit 2 hàng khuy chất liệu wool nhập khẩu tại StyleRent cam kết mang đến sự vừa vặn tôn dáng tuyệt đối.</p>',0,1650,'published','2026-11-07 07:27:38','2026-11-07 07:27:38',NULL),(8,4,1,'Kinh Nghiệm Thuê Đồ Dự Tiệc: Đẹp Chuẩn Gu, Tiết Kiệm Đến 80%','kinh-nghiem-thue-do-du-tiec-tiet-kiem-chi-phi','https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=80','Bí quyết chọn size chuẩn xác, bảo quản trang phục thuê và lên kế hoạch đặt lịch trước ngày tiệc.','<p>Thuê đồ sự kiện ngày nay đã trở thành phong cách sống hiện đại và thông minh của giới trẻ. Bạn có thể xuất hiện trong một chiếc đầm hàng hiệu giá 20 triệu chỉ với chi phí thuê vài trăm nghìn đồng. Hãy lưu ý chọn size dựa trên bảng số đo 3 vòng và đặt đồ trước ngày tiệc 1-2 ngày để thử đồ vừa vặn nhất.</p>',0,950,'published','2026-11-07 07:27:38','2026-11-07 07:27:38',NULL),(9,4,1,'Hướng Dẫn Lấy Số Đo 3 Vòng Chuẩn Xác Khi Thuê Đồ Online','huong-dan-lay-so-do-3-vong-chuan-xac-khi-thue-online','https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop&q=80','Thước dây chuẩn, cách xác định vòng ngực, vòng eo nhỏ nhất và vòng mông để nhân viên hỗ trợ chọn size vừa in không cần chỉnh sửa.','<p>Để thuê được trang phục vừa khít người khi đặt online, việc tự đo số đo tại nhà rất quan trọng. Bạn chỉ cần một chiếc thước dây mềm và làm theo các bước hướng dẫn chi tiết:</p><ol><li>Vòng ngực: Đo quanh điểm nở nang nhất của ngực khi mặc áo ngực vừa vặn.</li><li>Vòng eo: Đo quanh vị trí nhỏ nhất của eo, cách rốn khoảng 3cm phía trên.</li><li>Vòng mông: Đứng thẳng hai chân khép và đo ngang điểm đầy đặn nhất.</li></ol>',0,1340,'published','2026-11-07 07:27:38','2026-11-07 07:27:38',NULL),(10,4,1,'Chính Sách Bảo Quản & Đổi Size Trang Phục Tiện Lợi Tại StyleRent','chinh-sach-bao-quan-va-doi-size-trang-phuc-stylerent','https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80','Giải đáp chi tiết về dịch vụ giặt hấp chuyên nghiệp miễn phí, quy trình hỗ trợ đổi size khẩn cấp trong 24h và bảo hiểm trang phục.','<p>Tại StyleRent, mọi trang phục sau khi nhận lại đều được xử lý qua quy trình giặt hấp tiệt trùng và bảo dưỡng sợi vải nghiêm ngặt. Khách hàng hoàn toàn không cần giặt trước khi hoàn trả.</p><p>Trường hợp thử đồ bị chật hoặc rộng, bạn được hỗ trợ đổi size ngay trong ngày hoàn toàn miễn phí tại nội thành.</p>',0,880,'published','2026-11-07 07:27:38','2026-11-07 07:27:38',NULL),(11,5,1,'Gợi Ý Concept Chụp Ảnh Kỷ Yếu Phong Cách Cổ Điển & Hiện Đại','goi-y-concept-chup-anh-ky-yeu-thanh-xuan-cuc-chat','https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80','Tổng hợp các concept chụp kỷ yếu hot trend: Áo dài retro Sài Gòn thập niên 90, Dạ hội hoàng gia Âu Mỹ và Bohemian lãng mạn.','<p>Kỷ yếu là khoảnh khắc thanh xuân đáng nhớ nhất của thời học sinh, sinh viên. Để bộ ảnh tập thể trở nên đồng bộ và ấn tượng, việc lựa chọn trang phục theo một concept thống nhất là chìa khóa then chốt.</p><p>StyleRent có sẵn hơn 200 bộ áo dài đồng phục và set vest phù hợp cho các lớp chụp ảnh kỷ yếu nhóm đông với mức chiết khấu cực kỳ ưu đãi.</p>',1,2920,'published','2026-11-07 07:27:38','2026-11-07 07:27:38',NULL),(12,5,1,'Bí Quyết Tỏa Sáng Trong Đêm Tiệc Cuối Năm Year-End Party','bi-quyet-toa-sang-trong-dem-tiec-cuoi-nam-year-end-party','https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80','Chọn đồ tiệc công ty vừa thanh lịch, chỉn chu nhưng vẫn nổi bật và thu hút ánh nhìn cho giải thưởng Best Dressed.','<p>Year-End Party là cơ hội tuyệt vời để bạn rũ bỏ trang phục công sở quen thuộc thường ngày và biến hóa thành một phiên bản kiêu sa, quyến rũ hơn.</p><p>Một chiếc đầm cúp ngực ánh kim phối cùng áo khoác blazer lửng hoặc đầm dạ hội nhung đen xẻ tà sẽ giúp bạn cân bằng hoàn hảo giữa tính trang trọng của sự kiện công ty và vẻ đẹp cuốn hút của đêm tiệc.</p>',0,1760,'published','2026-11-07 07:27:38','2026-11-07 07:27:38',NULL),(13,6,1,'StyleRent Ra Mắt Gói Thuê Đồng Hành Cho Mùa Kỷ Yếu & Sự Kiện','stylerent-ra-mat-goi-thue-dong-hanh-ky-yeu','https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80','Ưu đãi nhóm lên đến 25% kèm dịch vụ miễn phí giặt là và giao nhận tận nơi cho các bạn sinh viên.','<p>Đồng hành cùng các bạn học sinh - sinh viên trong các dịp prom, kỷ yếu và thuyết trình tốt nghiệp, StyleRent chính thức triển khai chương trình ưu đãi đặc biệt: Giảm 20% khi thuê từ 3 bộ và tặng voucher phụ kiện đi kèm.</p>',1,1890,'published','2026-11-07 07:27:38','2026-11-07 07:27:38',NULL),(14,6,1,'Ưu Đãi Mùa Cưới 2026: Trọn Gói Váy Cưới & Vest Cao Cấp Tiết Kiệm 30%','uu-dai-mua-cuoi-2026-tron-goi-vay-cuoi-va-vest-nam','https://images.unsplash.com/photo-1546804784-896d0dca3805?w=800&auto=format&fit=crop&q=80','Chương trình tri ân mùa cưới: Đặt combo váy cưới và vest chú rể tặng ngay gói thuê áo dài lễ vu quy và phụ kiện voan cài tóc.','<p>Mùa cưới 2026 rộn ràng với chương trình quà tặng đặc biệt nhất trong năm từ StyleRent. Khi các cặp đôi thuê trọn gói trang phục cưới chính, bạn sẽ được tặng kèm voucher phụ kiện và miễn phí ngày giữ đồ thêm 2 ngày.</p><p>Hãy đặt lịch hẹn thử váy tại showroom để được đội ngũ chuyên viên tạo mẫu tư vấn chuyên sâu.</p>',1,2200,'published','2026-11-07 07:27:38','2026-11-07 07:27:38',NULL),(15,6,1,'Khai Trương Showroom Mới: Nhận Quà Tặng Voucher Thuê Đồ 500.000đ','khai-truong-showroom-moi-nhan-voucher-500k','https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&auto=format&fit=crop&q=80','Chào đón không gian thử đồ sang trọng mới cùng hơn 500 mẫu váy thiết kế mới nhất vừa được bổ sung vào bộ sưu tập.','<p>Nhằm mang đến trải nghiệm thử đồ rộng rãi và chuyên nghiệp nhất cho khách hàng, StyleRent hân hoan khai trương chi nhánh showroom mới với không gian phòng thử chuẩn studio ánh sáng cao cấp.</p><p>100 khách hàng đầu tiên ghé check-in sẽ nhận ngay voucher giảm 500.000đ áp dụng cho mọi hóa đơn thuê trang phục.</p>',0,1530,'published','2026-11-07 07:27:38','2026-11-07 07:27:38',NULL);
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product_images` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint(20) unsigned NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_images_product_id_foreign` (`product_id`),
  CONSTRAINT `product_images_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
INSERT INTO `product_images` VALUES (1,2,'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80',1,NULL),(2,2,'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',2,NULL),(3,1,'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',1,NULL),(4,1,'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',2,NULL),(5,1,'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',3,NULL),(6,8,'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',1,NULL),(7,8,'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',2,NULL),(8,5,'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=800&q=80',1,NULL),(9,5,'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',2,NULL),(10,5,'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80',3,NULL),(11,4,'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80',1,NULL),(12,4,'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',2,NULL),(13,3,'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',1,NULL),(14,3,'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80',2,NULL),(15,3,'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',3,NULL),(16,6,'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',1,NULL),(17,6,'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?auto=format&fit=crop&w=800&q=80',2,NULL),(18,6,'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80',3,NULL),(19,7,'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',1,NULL),(20,7,'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',2,NULL);
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_sizes`
--

DROP TABLE IF EXISTS `product_sizes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product_sizes` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint(20) unsigned NOT NULL,
  `size` enum('XS','S','M','L','XL','2XL','FreeSize') NOT NULL DEFAULT 'FreeSize',
  `stock_quantity` int(11) NOT NULL DEFAULT 0,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_product_size` (`product_id`,`size`),
  CONSTRAINT `product_sizes_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_sizes`
--

LOCK TABLES `product_sizes` WRITE;
/*!40000 ALTER TABLE `product_sizes` DISABLE KEYS */;
INSERT INTO `product_sizes` VALUES (1,2,'S',4,NULL,'2026-11-07 07:27:38','2026-11-07 07:27:38'),(2,2,'M',6,NULL,'2026-11-07 07:27:38','2026-11-07 07:27:38'),(3,2,'L',4,NULL,'2026-11-07 07:27:38','2026-11-07 07:27:38'),(4,1,'S',5,NULL,'2026-11-07 07:27:38','2026-11-07 07:27:38'),(5,1,'M',8,NULL,'2026-11-07 07:27:38','2026-11-07 07:27:38'),(6,1,'L',6,NULL,'2026-11-07 07:27:38','2026-11-07 07:27:38'),(7,1,'XL',3,NULL,'2026-11-07 07:27:38','2026-11-07 07:27:38'),(8,8,'FreeSize',15,NULL,'2026-11-07 07:27:38','2026-11-07 07:27:38'),(9,5,'S',2,NULL,'2026-11-07 07:27:38','2026-11-07 07:27:38'),(10,5,'M',4,NULL,'2026-11-07 07:27:38','2026-11-07 07:27:38'),(11,5,'L',3,NULL,'2026-11-07 07:27:38','2026-11-07 07:27:38'),(12,5,'FreeSize',2,NULL,'2026-11-07 07:27:38','2026-11-07 07:27:38'),(13,4,'S',3,NULL,'2026-11-07 07:27:38','2026-11-07 07:27:38'),(14,4,'M',4,NULL,'2026-11-07 07:27:38','2026-11-07 07:27:38'),(15,4,'L',2,NULL,'2026-11-07 07:27:38','2026-11-07 07:27:38'),(16,3,'XL',2,NULL,'2026-11-07 07:27:38','2026-11-07 07:27:38'),(17,3,'S',5,NULL,'2026-11-07 07:27:38','2026-11-07 07:27:38'),(18,3,'M',6,NULL,'2026-11-07 07:27:38','2026-11-07 07:27:38'),(19,3,'L',3,NULL,'2026-11-07 07:27:38','2026-11-07 07:27:38'),(20,6,'M',6,NULL,'2026-11-07 07:27:38','2026-11-07 07:27:38'),(21,6,'L',8,NULL,'2026-11-07 07:27:38','2026-11-07 07:27:38'),(22,6,'XL',5,NULL,'2026-11-07 07:27:38','2026-11-07 07:27:38'),(23,6,'2XL',2,NULL,'2026-11-07 07:27:38','2026-11-07 07:27:38'),(24,7,'S',3,NULL,'2026-11-07 07:27:38','2026-11-07 07:27:38'),(25,7,'M',5,NULL,'2026-11-07 07:27:38','2026-11-07 07:27:38'),(26,7,'L',5,NULL,'2026-11-07 07:27:38','2026-11-07 07:27:38'),(27,7,'XL',2,NULL,'2026-11-07 07:27:38','2026-11-07 07:27:38');
/*!40000 ALTER TABLE `product_sizes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `products` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `category_id` int(10) unsigned NOT NULL,
  `brand_id` int(10) unsigned DEFAULT NULL,
  `name` varchar(200) NOT NULL,
  `slug` varchar(220) NOT NULL,
  `thumbnail` varchar(255) NOT NULL,
  `short_description` varchar(500) DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `rental_price_per_day` decimal(12,2) NOT NULL DEFAULT 0.00,
  `sale_rental_price` decimal(12,2) DEFAULT NULL,
  `deposit_price` decimal(12,2) NOT NULL DEFAULT 0.00,
  `original_value` decimal(12,2) NOT NULL DEFAULT 0.00,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `is_sale` tinyint(1) NOT NULL DEFAULT 0,
  `view_count` int(11) NOT NULL DEFAULT 0,
  `status` enum('active','hidden') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `products_slug_unique` (`slug`),
  KEY `products_category_id_foreign` (`category_id`),
  KEY `products_brand_id_foreign` (`brand_id`),
  CONSTRAINT `products_brand_id_foreign` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE SET NULL,
  CONSTRAINT `products_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,5,4,'Áo dài truyền thống lụa tơ tằm thêu hoa sen','ao-dai-truyen-thong-hoa-sen','https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80','Áo dài lụa tơ tằm thủ công thêu hoa sen tỉ mỉ, tôn vinh nét duyên dáng người phụ nữ Việt.','Chất liệu lụa tơ tằm cao cấp mềm mại, thoáng mát và co giãn nhẹ. Tà áo 2 lớp bay bổng, đường may sắc nét chuẩn phom dáng truyền thống. Phù hợp cho dịp lễ Tết, kỷ yếu và sự kiện trang trọng.',350000.00,280000.00,1750000.00,2500000.00,1,1,128,'active','2026-11-07 07:27:38','2026-11-07 07:27:38',NULL),(2,6,4,'Áo dài cách tân gấm đỏ hoa văn quý phái','ao-dai-cach-tan-gam-do','https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80','Áo dài cách tân chất liệu gấm dệt nổi họa tiết may mắn, kết hợp tay bồng hiện đại.','Thiết kế cách tân trẻ trung với cổ tròn đính viền ngọc trai, phối cùng chân váy xòe xếp ly nhẹ nhàng mang lại vẻ đẹp thanh lịch cho tiệc cưới và dạ hội.',280000.00,NULL,1260000.00,1800000.00,0,0,64,'active','2026-11-07 07:27:38','2026-11-07 07:27:38',NULL),(3,7,2,'Đầm dạ hội đỏ Ruby xẻ tà đính pha lê','vay-du-tiec-do-xe-ta-sang-trong','https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80','Đầm dạ hội màu đỏ Ruby xẻ tà quyến rũ, cúp ngực ôm sát tôn trọn đường cong cơ thể.','Mẫu đầm làm từ satin lụa bóng sang trọng, cúp ngực đính kết pha lê thủ công lấp lánh dưới ánh đèn tiệc. Đường xẻ tà cao tinh tế giúp tôn đôi chân thon dài.',450000.00,380000.00,2520000.00,3600000.00,1,1,215,'active','2026-11-07 07:27:38','2026-11-07 07:27:38',NULL),(4,7,1,'Váy dạ hội đuôi cá ánh kim sa vàng Gold','vay-da-hoi-anh-kim-sa-vang','https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80','Váy dạ hội form đuôi cá phủ sequin ánh vàng lộng lẫy, hoàn hảo cho đêm tiệc thảm đỏ.','Chất liệu kim sa cao cấp có lớp lót lụa êm ái chống ngứa, ôm trọn vóc dáng và bung nhẹ từ đầu gối. Giúp bạn trở thành tâm điểm của mọi ánh nhìn trong các đêm gala sang trọng.',500000.00,NULL,2940000.00,4200000.00,0,0,92,'active','2026-11-07 07:27:38','2026-11-07 07:27:38',NULL),(5,8,5,'Váy cưới công chúa ren Pháp hoàng gia','vay-cuoi-cong-chua-ren-phap','https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=800&q=80','Váy cưới bồng bềnh phong cách công chúa với ren thêu nổi Pháp và hàng ngàn hạt cườm ngọc trai.','Tùng váy xòe rộng 8 lớp voan vi tính tạo độ bồng tự nhiên. Thân áo corset nâng đỡ form dáng chuẩn mực, siết eo thon gọn giúp cô dâu tỏa sáng trong ngày trọng đại.',1200000.00,990000.00,6650000.00,9500000.00,1,1,340,'active','2026-11-07 07:27:38','2026-11-07 07:27:38',NULL),(6,9,3,'Bộ vest nam Classic đen Tuxedo lịch lãm','vest-nam-classic-den-lich-lam','https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80','Bộ Tuxedo nam màu đen cổ sam bóng sang trọng, chuẩn phong cách quý ông tiệc cưới.','Trọn bộ bao gồm áo vest, quần âu và nơ cổ. Vải tuýtsi pha len cao cấp đứng form, hạn chế nhăn. Cầu vai đệm vừa vặn tạo phom người nam tính, đĩnh đạc.',400000.00,NULL,2240000.00,3200000.00,1,0,180,'active','2026-11-07 07:27:38','2026-11-07 07:27:38',NULL),(7,9,3,'Bộ vest nam phong cách Hàn Quốc ghi xám sáng','vest-nam-han-quoc-ghi-sang','https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80','Bộ vest nam màu ghi sáng trẻ trung, form slimfit hiện đại tôn dáng người mặc.','Thiết kế 2 nút trẻ trung, gam màu ghi xám thanh lịch phù hợp cho chụp ảnh ngoại cảnh, tiệc đính hôn hoặc làm rể phụ. Chất liệu co giãn nhẹ tạo sự thoải mái khi di chuyển.',350000.00,299000.00,1960000.00,2800000.00,0,1,75,'active','2026-11-07 07:27:38','2026-11-07 07:27:38',NULL),(8,10,6,'Clutch cầm tay dạ tiệc đính ngọc trai quý phái','tui-xach-du-tiec-dinh-ngoc-trai','https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80','Ví clutch cầm tay đính hạt ngọc trai nhân tạo sang trọng, kèm dây xích đeo vai ánh kim.','Phụ kiện hoàn hảo phối cùng áo dài và váy dạ hội. Kích thước vừa vặn đựng điện thoại và vật dụng cá nhân. Khóa bấm kim loại mạ vàng sáng bóng và chắc chắn.',80000.00,NULL,525000.00,750000.00,0,0,45,'active','2026-11-07 07:27:38','2026-11-07 07:27:38',NULL);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reviews` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint(20) unsigned NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `author_name` varchar(100) NOT NULL,
  `rating` tinyint(4) NOT NULL DEFAULT 5,
  `content` text NOT NULL,
  `size_worn` varchar(50) DEFAULT NULL,
  `height_cm` smallint(5) unsigned DEFAULT NULL,
  `status` enum('pending','approved','hidden') NOT NULL DEFAULT 'approved',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `reviews_product_id_foreign` (`product_id`),
  KEY `reviews_user_id_foreign` (`user_id`),
  CONSTRAINT `reviews_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,1,1,'Trần Mỹ Duyên',5,'Lụa tơ tằm thêu sen thủ công rất tinh xảo, màu sắc nhã nhặn. Đồ được giặt ủi thơm tho và đóng gói cẩn thận khi giao tới.','S',160,'approved','2026-11-02 07:27:38','2026-11-02 07:27:38',NULL),(2,3,1,'Vũ Hà My',5,'Váy satin lụa bóng sang trọng, cúp ngực ôm chắc chắn nên di chuyển rất thoải mái trong đêm tiệc gala.','M',166,'approved','2026-11-04 07:27:38','2026-11-04 07:27:38',NULL),(3,5,1,'Nguyễn Thanh Vân',5,'Ren Pháp đính ngọc trai bên ngoài nhìn sang hơn ảnh chụp nhiều. Váy xòe bồng công chúa tôn dáng cô dâu trong ngày cưới.','S',162,'approved','2026-11-05 07:27:38','2026-11-05 07:27:38',NULL),(4,6,1,'Đỗ Trung Kiên',5,'Vest tuxedo đứng form, vải không nhăn. Rất tiện lợi cho ai cần vest dự tiệc cưới mà không muốn mua mới.','L',175,'approved','2026-11-06 07:27:38','2026-11-06 07:27:38',NULL);
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `role` enum('admin','member') NOT NULL DEFAULT 'member',
  `fullname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `status` enum('active','locked') NOT NULL DEFAULT 'active',
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','Quản Trị Viên','admin@gmail.com','$2y$12$g7/iPoveHajVZvFFFAVXi.9CPJzgsfznGiC3rRED5L246KlT1vHke','0901234567','TP. Hồ Chí Minh','https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff','active',NULL,'2026-11-07 07:27:38','2026-11-07 07:27:38',NULL),(2,'member','Nguyễn Văn Member','member@gmail.com','$2y$12$5gFxNTlFL38JhNO5xZsoh.O0DLuax7SUIBWiyUKYbf/FmmKaORNlG','0987654321','Hà Nội','https://ui-avatars.com/api/?name=Member+User&background=28a745&color=fff','active',NULL,'2026-11-07 07:27:38','2026-11-07 07:27:38',NULL),(3,'member','Tài Khoản Bị Khóa','locked@gmail.com','$2y$12$SWtXHnVRNUyo2n1Yrgzy0u0CHh8TnYEjT8Jz7f3ziy7HhLDJxB1MW','0911223344','Đà Nẵng','https://ui-avatars.com/api/?name=Locked+User&background=dc3545&color=fff','locked',NULL,'2026-11-07 07:27:38','2026-11-07 07:27:38',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vouchers`
--

DROP TABLE IF EXISTS `vouchers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vouchers` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `discount_amount` int(10) unsigned NOT NULL,
  `min_order_amount` int(10) unsigned NOT NULL DEFAULT 0,
  `used_count` int(10) unsigned NOT NULL DEFAULT 0,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `vouchers_code_unique` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vouchers`
--

LOCK TABLES `vouchers` WRITE;
/*!40000 ALTER TABLE `vouchers` DISABLE KEYS */;
INSERT INTO `vouchers` VALUES (1,'GIAM50K','Ưu đãi thuê đồ tiệc (Đơn từ 300k)',50000,300000,0,'active',NULL,'2026-11-07 07:27:39','2026-11-07 07:27:39'),(2,'GIAM100K','Ưu đãi khách hàng VIP (Đơn từ 500k)',100000,500000,0,'active',NULL,'2026-11-07 07:27:39','2026-11-07 07:27:39'),(3,'WELCOME30K','Chào mừng thành viên mới (Đơn từ 150k)',30000,150000,0,'active',NULL,'2026-11-07 07:27:39','2026-11-07 07:27:39');
/*!40000 ALTER TABLE `vouchers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'thltweb_huy_tuyet'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed
