-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Sep 09, 2026 at 11:55 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `canbel_doc_pro_unizik`
--

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `faculty_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `key` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `faculty_id`, `name`, `key`, `created_at`, `updated_at`) VALUES
(1, 1, 'English Language and Literature', 'english_language_and_literature', NULL, NULL),
(2, 1, 'Chinese Studies', 'chinese_studies', NULL, NULL),
(3, 1, 'History and International Studies', 'history_and_international_studies', NULL, NULL),
(4, 1, 'Linguistics', 'linguistics', NULL, NULL),
(5, 1, 'Modern European Languages', 'modern_european_languages', NULL, NULL),
(6, 1, 'Music', 'music', NULL, NULL),
(7, 1, 'Igbo, African and Communication Studies', 'igbo_african_and_communication_studies', NULL, NULL),
(8, 1, 'Philosophy', 'philosophy', NULL, NULL),
(9, 1, 'Religion and Human Relations', 'religion_and_human_relations', NULL, NULL),
(10, 1, 'Theatre and Film Studies', 'theatre_and_film_studies', NULL, NULL),
(11, 2, 'Agricultural Economics and Extension', 'agricultural_economics_and_extension', NULL, NULL),
(12, 2, 'Animal Science and Technology', 'animal_science_and_technology', NULL, NULL),
(13, 2, 'Crop Science and Horticulture', 'crop_science_and_horticulture', NULL, NULL),
(14, 2, 'Fisheries and Aquaculture', 'fisheries_and_aquaculture', NULL, NULL),
(15, 2, 'Food Science and Technology', 'food_science_and_technology', NULL, NULL),
(16, 2, 'Forestry and Wildlife Management', 'forestry_and_wildlife_management', NULL, NULL),
(17, 2, 'Soil Science and Land Resources Management', 'soil_science_and_land_resources_management', NULL, NULL),
(18, 3, 'Anatomy', 'anatomy', NULL, NULL),
(19, 3, 'Human Biochemistry', 'human_biochemistry', NULL, NULL),
(20, 3, 'Human Physiology', 'human_physiology', NULL, NULL),
(21, 4, 'Pharmacology & Therapeutics', 'pharmacology_therapeutics', NULL, NULL),
(22, 4, 'Chemical Pathology', 'chemical_pathology', NULL, NULL),
(23, 4, 'Haematology & Immunology', 'haematology_immunology', NULL, NULL),
(24, 4, 'Medical Microbiology', 'medical_microbiology', NULL, NULL),
(25, 4, 'Morbid Anatomy (Anatomic Pathology & Forensic Medicine)', 'morbid_anatomy_anatomic_pathology_forensic_medicine', NULL, NULL),
(26, 5, 'Applied Microbiology & Brewing', 'applied_microbiology_brewing', NULL, NULL),
(27, 5, 'Applied Biochemistry', 'applied_biochemistry', NULL, NULL),
(28, 5, 'Botany', 'botany', NULL, NULL),
(29, 5, 'Parasitology & Entomology', 'parasitology_entomology', NULL, NULL),
(30, 5, 'Zoology', 'zoology', NULL, NULL),
(31, 6, 'Adult and Continuing Education', 'adult_and_continuing_education', NULL, NULL),
(32, 6, 'Education Management and Policy', 'education_management_and_policy', NULL, NULL),
(33, 6, 'Early Childhood and Primary Education', 'early_childhood_and_primary_education', NULL, NULL),
(34, 6, 'Educational Foundations', 'educational_foundations', NULL, NULL),
(35, 6, 'Guidance and Counselling', 'guidance_and_counselling', NULL, NULL),
(36, 6, 'Human Kinetics and Health Education', 'human_kinetics_and_health_education', NULL, NULL),
(37, 6, 'Library and Information Science', 'library_and_information_science', NULL, NULL),
(38, 6, 'Science Education', 'science_education', NULL, NULL),
(39, 6, 'Technology and Vocational Education', 'technology_and_vocational_education', NULL, NULL),
(40, 7, 'Agriculture/Bioresources Engineering', 'agriculturebioresources_engineering', NULL, NULL),
(41, 7, 'Civil Engineering', 'civil_engineering', NULL, NULL),
(42, 7, 'Chemical Engineering', 'chemical_engineering', NULL, NULL),
(43, 7, 'Electrical Engineering', 'electrical_engineering', NULL, NULL),
(44, 7, 'Electronics/Computer Engineering', 'electronicscomputer_engineering', NULL, NULL),
(45, 7, 'Industrial/Production Engineering', 'industrialproduction_engineering', NULL, NULL),
(46, 7, 'Metallurgical/Material Engineering', 'metallurgicalmaterial_engineering', NULL, NULL),
(47, 7, 'Mechanical Engineering', 'mechanical_engineering', NULL, NULL),
(48, 7, 'Polymer/Textile Engineering', 'polymertextile_engineering', NULL, NULL),
(49, 7, 'Petroleum Engineering', 'petroleum_engineering', NULL, NULL),
(50, 8, 'Architecture', 'architecture', NULL, NULL),
(51, 8, 'Building', 'building', NULL, NULL),
(52, 8, 'Environmental Management', 'environmental_management', NULL, NULL),
(53, 8, 'Estate Management', 'estate_management', NULL, NULL),
(54, 8, 'Fine and Applied Arts', 'fine_and_applied_arts', NULL, NULL),
(55, 8, 'Geography and Meteorology', 'geography_and_meteorology', NULL, NULL),
(56, 8, 'Quantity Surveying', 'quantity_surveying', NULL, NULL),
(57, 8, 'Surveying and Geo-Informatics', 'surveying_and_geo_informatics', NULL, NULL),
(58, 9, 'Environmental Health Science', 'environmental_health_science', NULL, NULL),
(59, 9, 'Medical Laboratory Science', 'medical_laboratory_science', NULL, NULL),
(60, 9, 'Medical Rehabilitation', 'medical_rehabilitation', NULL, NULL),
(61, 9, 'Nursing Science', 'nursing_science', NULL, NULL),
(62, 9, 'Nutrition and Dietetics', 'nutrition_and_dietetics', NULL, NULL),
(63, 9, 'Radiography', 'radiography', NULL, NULL),
(64, 10, 'Public and Private Law', 'public_and_private_law', NULL, NULL),
(65, 10, 'International Law and Jurisprudence', 'international_law_and_jurisprudence', NULL, NULL),
(66, 10, 'Commercial and Property Law', 'commercial_and_property_law', NULL, NULL),
(67, 11, 'Accountancy', 'accountancy', NULL, NULL),
(68, 11, 'Banking & Finance', 'banking_finance', NULL, NULL),
(69, 11, 'Business Administration', 'business_administration', NULL, NULL),
(70, 11, 'Cooperative Economics & Management', 'cooperative_economics_management', NULL, NULL),
(71, 11, 'Marketing', 'marketing', NULL, NULL),
(72, 11, 'Public Administration', 'public_administration', NULL, NULL),
(73, 11, 'Entrepreneurship', 'entrepreneurship', NULL, NULL),
(74, 12, 'Anaesthesiology', 'anaesthesiology', NULL, NULL),
(75, 12, 'Community Medicine', 'community_medicine', NULL, NULL),
(76, 12, 'Internal Medicine', 'internal_medicine', NULL, NULL),
(77, 12, 'Mental Health', 'mental_health', NULL, NULL),
(78, 12, 'Obstetrics and Gynaecology', 'obstetrics_and_gynaecology', NULL, NULL),
(79, 12, 'Ophthalmology', 'ophthalmology', NULL, NULL),
(80, 12, 'Paediatrics', 'paediatrics', NULL, NULL),
(81, 12, 'Radiology', 'radiology', NULL, NULL),
(82, 12, 'Surgery', 'surgery', NULL, NULL),
(83, 14, 'Pharmaceutical Microbiology and Biotechnology', 'pharmaceutical_microbiology_and_biotechnology', NULL, NULL),
(84, 14, 'Clinical Pharmacy and Pharmacy Management', 'clinical_pharmacy_and_pharmacy_management', NULL, NULL),
(85, 14, 'Pharmaceutical and Medicinal Chemistry', 'pharmaceutical_and_medicinal_chemistry', NULL, NULL),
(86, 14, 'Pharmaceutics and Pharmaceutical Technology', 'pharmaceutics_and_pharmaceutical_technology', NULL, NULL),
(87, 14, 'Pharmacognosy and Traditional Medicine', 'pharmacognosy_and_traditional_medicine', NULL, NULL),
(88, 14, 'Pharmacology and Toxicology', 'pharmacology_and_toxicology', NULL, NULL),
(89, 15, 'Computer Science', 'computer_science', NULL, NULL),
(90, 15, 'Geological Sciences', 'geological_sciences', NULL, NULL),
(91, 15, 'Applied Geophysics', 'applied_geophysics', NULL, NULL),
(92, 15, 'Industrial Chemistry', 'industrial_chemistry', NULL, NULL),
(93, 15, 'Industrial Physics', 'industrial_physics', NULL, NULL),
(94, 15, 'Mathematics', 'mathematics', NULL, NULL),
(95, 15, 'Statistics', 'statistics', NULL, NULL),
(96, 15, 'Software Engineering', 'software_engineering', NULL, NULL),
(97, 15, 'Cyber Security', 'cyber_security', NULL, NULL),
(98, 15, 'Information Technology', 'information_technology', NULL, NULL),
(99, 16, 'Economics', 'economics', NULL, NULL),
(100, 16, 'Mass Communication', 'mass_communication', NULL, NULL),
(101, 16, 'Political Science', 'political_science', NULL, NULL),
(102, 16, 'Psychology', 'psychology', NULL, NULL),
(103, 16, 'Sociology and Anthropology', 'sociology_and_anthropology', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `documents`
--

CREATE TABLE `documents` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `type` varchar(255) DEFAULT NULL,
  `holders_name` varchar(255) DEFAULT NULL,
  `registration_number` varchar(255) DEFAULT NULL,
  `nin` varchar(255) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `faculty_id` bigint(20) UNSIGNED DEFAULT NULL,
  `passport_photo` varchar(255) DEFAULT NULL,
  `department_id` bigint(20) UNSIGNED DEFAULT NULL,
  `discipline` varchar(255) DEFAULT NULL,
  `session` varchar(255) DEFAULT NULL,
  `cgpa` varchar(255) DEFAULT NULL,
  `cgpa_class` varchar(255) DEFAULT NULL,
  `effective_date` timestamp NULL DEFAULT NULL,
  `logged_by` varchar(255) DEFAULT NULL,
  `registered_date` timestamp NULL DEFAULT NULL,
  `registered_by` varchar(255) DEFAULT NULL,
  `approved_date` timestamp NULL DEFAULT NULL,
  `approved_by` varchar(255) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT 0,
  `refusal_comment` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `documents`
--

INSERT INTO `documents` (`id`, `type`, `holders_name`, `registration_number`, `nin`, `dob`, `faculty_id`, `passport_photo`, `department_id`, `discipline`, `session`, `cgpa`, `cgpa_class`, `effective_date`, `logged_by`, `registered_date`, `registered_by`, `approved_date`, `approved_by`, `status`, `refusal_comment`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'undergraduate', 'bradley smith', '2019/245779', '76456789', '2015-01-28', 1, 'ebc1602d-2540-414c-a988-cb32fd1da84c.jpg', 1, 'art', NULL, '2.1', 'Third Class Division', '2026-06-09 23:00:00', NULL, '2026-07-21 17:26:37', '4', NULL, NULL, 0, NULL, '2026-07-21 17:26:37', '2026-07-21 17:26:37', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `document_params_position_settings`
--

CREATE TABLE `document_params_position_settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `document_type` varchar(255) NOT NULL,
  `layout_setting_profile_id` bigint(20) UNSIGNED DEFAULT NULL,
  `holders_name_x` decimal(8,2) DEFAULT NULL,
  `holders_name_y` decimal(8,2) DEFAULT NULL,
  `registration_number_x` decimal(8,2) DEFAULT NULL,
  `registration_number_y` decimal(8,2) DEFAULT NULL,
  `department_name_x` decimal(8,2) DEFAULT NULL,
  `department_name_y` decimal(8,2) DEFAULT NULL,
  `discipline_x` decimal(8,2) DEFAULT NULL,
  `discipline_y` decimal(8,2) DEFAULT NULL,
  `session_x` decimal(8,2) DEFAULT NULL,
  `session_y` decimal(8,2) DEFAULT NULL,
  `cgpa_x` decimal(8,2) DEFAULT NULL,
  `cgpa_y` decimal(8,2) DEFAULT NULL,
  `cgpa_class_x` decimal(8,2) DEFAULT NULL,
  `cgpa_class_y` decimal(8,2) DEFAULT NULL,
  `effective_date_x` decimal(8,2) DEFAULT NULL,
  `effective_date_y` decimal(8,2) DEFAULT NULL,
  `nin_x` decimal(8,2) DEFAULT NULL,
  `nin_y` decimal(8,2) DEFAULT NULL,
  `dob_x` decimal(8,2) DEFAULT NULL,
  `dob_y` decimal(8,2) DEFAULT NULL,
  `faculty_x` decimal(8,2) DEFAULT NULL,
  `faculty_y` decimal(8,2) DEFAULT NULL,
  `passport_photo_x` decimal(8,2) DEFAULT NULL,
  `passport_photo_y` decimal(8,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `document_params_position_settings`
--

INSERT INTO `document_params_position_settings` (`id`, `document_type`, `layout_setting_profile_id`, `holders_name_x`, `holders_name_y`, `registration_number_x`, `registration_number_y`, `department_name_x`, `department_name_y`, `discipline_x`, `discipline_y`, `session_x`, `session_y`, `cgpa_x`, `cgpa_y`, `cgpa_class_x`, `cgpa_class_y`, `effective_date_x`, `effective_date_y`, `nin_x`, `nin_y`, `dob_x`, `dob_y`, `faculty_x`, `faculty_y`, `passport_photo_x`, `passport_photo_y`, `created_at`, `updated_at`) VALUES
(1, 'undergraduate', 1, 63.00, 22.00, 63.00, 47.00, 63.00, 73.00, 63.00, 98.00, NULL, NULL, 63.00, 123.00, 63.00, 149.00, 63.00, 174.00, 63.00, 199.00, 63.00, 224.00, 63.00, 250.00, 63.00, 275.00, NULL, NULL),
(2, 'postgraduate', 1, 63.00, 22.00, 63.00, 47.00, 63.00, 73.00, 63.00, 98.00, NULL, NULL, 63.00, 123.00, 63.00, 149.00, 63.00, 174.00, 63.00, 199.00, 63.00, 224.00, 63.00, 250.00, 63.00, 275.00, NULL, NULL),
(9, 'undergraduate', 5, 89.00, 111.00, 63.00, 47.00, 60.00, 170.00, 63.00, 98.00, NULL, NULL, 63.00, 123.00, 60.00, 182.00, 63.00, 212.00, 63.00, 199.00, 63.00, 224.00, 63.00, 250.00, 28.00, 35.00, '2026-07-21 16:01:42', '2026-07-21 16:21:43'),
(10, 'postgraduate', 5, 63.00, 22.00, 63.00, 47.00, 63.00, 73.00, 63.00, 98.00, NULL, NULL, 63.00, 123.00, 63.00, 149.00, 63.00, 174.00, 63.00, 199.00, 63.00, 224.00, 63.00, 250.00, 146.00, 46.00, '2026-07-21 16:01:42', '2026-07-21 16:22:23'),
(11, 'undergraduate', 6, 89.00, 111.00, 63.00, 47.00, 60.00, 170.00, 63.00, 98.00, NULL, NULL, 63.00, 123.00, 60.00, 182.00, 63.00, 212.00, 63.00, 199.00, 63.00, 224.00, 63.00, 250.00, 28.00, 35.00, '2026-07-21 16:28:39', '2026-07-21 16:28:39'),
(12, 'postgraduate', 6, 63.00, 22.00, 63.00, 47.00, 63.00, 73.00, 63.00, 98.00, NULL, NULL, 63.00, 123.00, 63.00, 149.00, 63.00, 174.00, 63.00, 199.00, 63.00, 224.00, 63.00, 250.00, 146.00, 46.00, '2026-07-21 16:28:39', '2026-07-21 16:28:39');

-- --------------------------------------------------------

--
-- Table structure for table `faculties`
--

CREATE TABLE `faculties` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `key` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `faculties`
--

INSERT INTO `faculties` (`id`, `name`, `key`, `created_at`, `updated_at`) VALUES
(1, 'Arts', 'arts', NULL, NULL),
(2, 'Agriculture', 'agriculture', NULL, NULL),
(3, 'Basic Medical Sciences', 'basic_medical_sciences', NULL, NULL),
(4, 'Basic Clinical Sciences', 'basic_clinical_sciences', NULL, NULL),
(5, 'Biosciences', 'biosciences', NULL, NULL),
(6, 'Education', 'education', NULL, NULL),
(7, 'Engineering', 'engineering', NULL, NULL),
(8, 'Environmental Sciences', 'environmental_sciences', NULL, NULL),
(9, 'Health Science and Technology', 'health_science_and_technology', NULL, NULL),
(10, 'Law', 'law', NULL, NULL),
(11, 'Management Sciences', 'management_sciences', NULL, NULL),
(12, 'Medicine', 'medicine', NULL, NULL),
(13, 'Medical Laboratory Science', 'medical_laboratory_science', NULL, NULL),
(14, 'Pharmaceutical Sciences', 'pharmaceutical_sciences', NULL, NULL),
(15, 'Physical Science', 'physical_science', NULL, NULL),
(16, 'Social Science', 'social_science', NULL, NULL),
(17, 'Technology and Vocational Education', 'technology_and_vocational_education', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `layout_setting_profiles`
--

CREATE TABLE `layout_setting_profiles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT 0,
  `show_document_template` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `layout_setting_profiles`
--

INSERT INTO `layout_setting_profiles` (`id`, `name`, `is_default`, `show_document_template`, `created_at`, `updated_at`) VALUES
(1, 'default layout', 1, 1, '2026-07-21 14:35:54', '2026-07-21 17:52:52'),
(5, 'home printer', 0, 1, '2026-07-21 16:01:42', '2026-07-21 17:13:39'),
(6, 'test \'home\' replica', 0, 0, '2026-07-21 16:28:39', '2026-07-21 16:33:43');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2014_10_12_000000_create_users_table', 1),
(2, '2014_10_12_100000_create_password_reset_tokens_table', 1),
(3, '2019_08_19_000000_create_failed_jobs_table', 1),
(4, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(5, '2025_09_03_101134_create_documents_table', 1),
(6, '2025_09_08_141357_change_certain_column_types_in_documents_table', 1),
(7, '2025_09_09_033011_create_departments_table', 1),
(8, '2025_09_10_024015_add_refusal_comment_to_documents_table', 1),
(9, '2026_07_10_222510_create_document_params_position_settings_table', 1),
(10, '2026_07_13_090000_rename_ggpa_columns_in_documents_table', 1),
(11, '2026_07_13_090100_add_discipline_to_documents_table', 1),
(12, '2026_07_13_090200_rename_ggpa_columns_in_document_params_position_settings_table', 1),
(13, '2026_07_14_090000_add_discipline_position_to_document_params_position_settings_table', 1),
(14, '2026_07_15_142655_create_students_submissions_table', 1),
(15, '2026_07_15_182814_add_nin_dob_passport_photo_faculty_to_documents_table', 1),
(16, '2026_07_15_210512_add_student_bio_position_fields_to_document_params_position_settings_table', 1),
(17, '2026_07_20_032826_add_document_type_and_email_to_students_submissions_table', 1),
(18, '2026_07_20_055513_delete_pending_documents', 1),
(19, '2026_07_20_055513_renumber_document_statuses', 1),
(20, '2026_07_20_055514_drop_unique_name_from_documents_table', 1),
(21, '2026_07_20_055514_drop_unique_name_position_columns_from_document_params_position_settings_table', 1),
(22, '2026_07_20_163017_create_faculties_table', 1),
(23, '2026_07_20_163500_add_faculty_id_to_departments_table', 1),
(24, '2026_07_20_200115_convert_faculty_to_faculty_id_on_students_submissions_table', 1),
(25, '2026_07_20_200116_convert_faculty_to_faculty_id_on_documents_table', 1),
(26, '2026_07_20_220213_drop_deleted_at_from_students_submissions_table', 1),
(27, '2026_07_21_000000_change_position_columns_to_decimal_in_document_params_position_settings_table', 1),
(28, '2026_07_21_010000_create_layout_setting_profiles_table', 1),
(29, '2026_07_21_010100_add_layout_setting_profile_id_to_document_params_position_settings_table', 1),
(30, '2026_07_21_020000_add_composite_unique_for_document_type_and_layout_setting_profile_id', 1),
(32, '2026_07_21_030000_cascade_delete_position_settings_on_layout_setting_profile_delete', 2);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `students_submissions`
--

CREATE TABLE `students_submissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `document_type` varchar(255) DEFAULT NULL,
  `registration_number` varchar(255) DEFAULT NULL,
  `nin` varchar(255) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `faculty_id` bigint(20) UNSIGNED DEFAULT NULL,
  `department_id` bigint(20) UNSIGNED NOT NULL,
  `passport_photo` varchar(255) DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `coverUrl` varchar(255) DEFAULT NULL,
  `role` int(11) NOT NULL DEFAULT 0,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `coverUrl`, `role`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Admin', 'admin@slint.com', NULL, 2, NULL, '$2y$10$CijwNTRsxA7.lQMeSGTXAewLe745Jj30Q9sk./8YYPLH7Ryd4U/Fu', NULL, '2026-07-21 14:35:53', '2026-07-21 14:35:53', NULL),
(2, 'Admin', 'admin@canbeltech.com', NULL, 2, NULL, '$2y$10$vGCcaeXGqh4KfMAzzy8NY.xGrSHEKJCX1I4c72V.jMhu1/zRZIZvS', NULL, '2026-07-21 14:35:53', '2026-07-21 14:35:53', NULL),
(3, 'Registrar', 'registrar@example.com', NULL, 0, NULL, '$2y$10$GnGYRslZiSecUUYAQouF7uNGgtKWj8SEwpGL7NOoQ.X/ZguajtkCS', NULL, '2026-07-21 14:35:53', '2026-07-21 14:35:53', NULL),
(4, 'Supervisor', 'supervisor@example.com', NULL, 1, NULL, '$2y$10$9.cNkFWpBASWvFCIrUxEveTfy6huIEfLBLuicC6r8lduWxBakMtS.', NULL, '2026-07-21 14:35:54', '2026-07-21 14:35:54', NULL),
(5, 'Assistant Supervisor', 'assistant-supervisor@example.com', NULL, 3, NULL, '$2y$10$qcgeTTA8kq6X2J78rhZyYeuw6shyBkTTJ32iP15PSd8kiPeKb/gt6', NULL, '2026-07-21 14:35:54', '2026-07-21 14:35:54', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `departments_key_unique` (`key`),
  ADD KEY `departments_faculty_id_foreign` (`faculty_id`);

--
-- Indexes for table `documents`
--
ALTER TABLE `documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `documents_faculty_id_foreign` (`faculty_id`);

--
-- Indexes for table `document_params_position_settings`
--
ALTER TABLE `document_params_position_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `dpps_document_type_layout_profile_unique` (`document_type`,`layout_setting_profile_id`),
  ADD KEY `dpps_layout_setting_profile_id_foreign` (`layout_setting_profile_id`);

--
-- Indexes for table `faculties`
--
ALTER TABLE `faculties`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `faculties_key_unique` (`key`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `layout_setting_profiles`
--
ALTER TABLE `layout_setting_profiles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `students_submissions`
--
ALTER TABLE `students_submissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `students_submissions_department_id_foreign` (`department_id`),
  ADD KEY `students_submissions_faculty_id_foreign` (`faculty_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=104;

--
-- AUTO_INCREMENT for table `documents`
--
ALTER TABLE `documents`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `document_params_position_settings`
--
ALTER TABLE `document_params_position_settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `faculties`
--
ALTER TABLE `faculties`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `layout_setting_profiles`
--
ALTER TABLE `layout_setting_profiles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `students_submissions`
--
ALTER TABLE `students_submissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `departments`
--
ALTER TABLE `departments`
  ADD CONSTRAINT `departments_faculty_id_foreign` FOREIGN KEY (`faculty_id`) REFERENCES `faculties` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `documents`
--
ALTER TABLE `documents`
  ADD CONSTRAINT `documents_faculty_id_foreign` FOREIGN KEY (`faculty_id`) REFERENCES `faculties` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `document_params_position_settings`
--
ALTER TABLE `document_params_position_settings`
  ADD CONSTRAINT `dpps_layout_setting_profile_id_foreign` FOREIGN KEY (`layout_setting_profile_id`) REFERENCES `layout_setting_profiles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `students_submissions`
--
ALTER TABLE `students_submissions`
  ADD CONSTRAINT `students_submissions_department_id_foreign` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`),
  ADD CONSTRAINT `students_submissions_faculty_id_foreign` FOREIGN KEY (`faculty_id`) REFERENCES `faculties` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
