-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 02, 2025 at 04:35 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `portal_berita`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `created_at`) VALUES
(1, 'Technology', '2025-03-16 06:35:19'),
(2, 'Science', '2025-03-16 06:35:19'),
(3, 'business', '2025-03-16 06:35:19'),
(4, 'Entertainment', '2025-03-16 06:35:19'),
(5, 'Sports', '2025-03-16 06:35:19'),
(6, 'Health', '2025-05-12 04:17:42');

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `news_id` int(11) DEFAULT NULL,
  `news_source` enum('internal','external') NOT NULL,
  `news_external_url` varchar(255) DEFAULT NULL,
  `comment` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `news_title` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `user_id`, `news_id`, `news_source`, `news_external_url`, `comment`, `created_at`, `news_title`) VALUES
(171, 114, NULL, 'external', 'https://www.npr.org/2025/06/29/nx-s1-5450122/irish-rap-group-kneecap-glastonbury', 'tesss', '2025-06-30 10:28:29', 'Northern Irish rap group Kneecap plays Glastonbury despite controversy - NPR'),
(172, 113, NULL, 'external', 'https://www.bbc.com/sport/live/c8e4dwz21knt', 'test', '2025-06-30 11:04:29', 'F1 LIVE: Austrian Grand Prix 2025: UK start time, grid, radio & updates from Red Bull Ring - BBC'),
(173, 36, NULL, 'external', 'https://www.cbssports.com/boxing/news/jake-paul-vs-julio-cesar-chavez-jr-results-highlights-problem-child-cruises-to-easy-decision-win/live/', 'TEST', '2025-06-30 14:12:47', 'Jake Paul vs. Julio Cesar Chavez Jr. results, highlights: \'Problem Child\' cruises to easy decision win - CBS Sports'),
(174, 98, NULL, 'external', 'https://www.pushsquare.com/news/2025/06/uks-death-stranding-2-ps5-physical-sales-displace-mario-kart-world-but-down-66percent-compared-to-predecessor', 'tester', '2025-07-01 14:13:24', 'UK\'s Death Stranding 2 PS5 Physical Sales Displace Mario Kart World, But Down 66% Compared to Predecessor - Push Square'),
(175, 98, NULL, 'external', 'https://www.pushsquare.com/news/2025/06/uks-death-stranding-2-ps5-physical-sales-displace-mario-kart-world-but-down-66percent-compared-to-predecessor', 'tester', '2025-07-01 14:13:24', 'UK\'s Death Stranding 2 PS5 Physical Sales Displace Mario Kart World, But Down 66% Compared to Predecessor - Push Square');

-- --------------------------------------------------------

--
-- Table structure for table `news`
--

CREATE TABLE `news` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `author_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('draft','published') DEFAULT 'draft'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `news`
--

INSERT INTO `news` (`id`, `title`, `content`, `image`, `category_id`, `author_id`, `created_at`, `status`) VALUES
(105, 'Unggahan Ibu Ahmad Dhani Disorot Setelah Anaknya Sindir Maia Estianty: Drama yang Direncanakan', '<p>Ahmad Dhani menjadi sorotan setelah mengunggah video YouTube berjudul \'Kompilasi Gibah dan Fitnah Maia Estianty\' pada Senin (30/6/2025).</p>\r\n<p>Video itu ia maksudkan untuk membela Mulan Jameela dan menuduh Maia sudah melontarkan berita tidak benar tentangnya.</p>\r\n<p>Ahmad Dhani menganggap bahwa Mulan Jameela dan anak-anaknya terus diserang lantaran Maia melontarkan pernyataan yang mengundang publik untuk melontarkan komentar negatif.</p>\r\n<p>Di tengah kabar ini, postingan ibu kandung Ahmad Dhani, Joyce Pamela Abdul, juga menuai sorotan.</p>\r\n<p>Melalui akun Facebooknya, Joyce sempat menyinggung seseorang yang sedang menyiapkan drama.</p>\r\n<p class=\"continue-read-break\">\"Drama yang direncanakan telah berlalu dan akan menjadi bumerang di kemudian, let\'s see,\" tulis Joyce di unggahan itu.</p>\r\n<p>Entah ditujukan untuk siapa unggahan Joyce lantaran ia tidak secara gamblang menyebutkan nama.</p>', '/uploads/thumb-1751465375937.jpeg', 4, 36, '2025-07-02 14:09:35', 'published'),
(106, 'Peterpan Comeback Tanpa Ariel dan Uki, Fans Kecewa: Terus yang Nyanyi Siapa?', '<p>Warganet bereaksi setelah adanya pengumuman resmi siapa saja personel grup band Peterpan yang akan&nbsp;<em>comeback</em>&nbsp;di konser bertajuk \"The Journey Continues\" di Bandung, Jawa Barat, pada Minggu, 31 Agustus 2025.</p>\r\n<p>Ternyata, diumumkan bahwa konser tersebut tanpa kehadiran Ariel dan Uki.</p>\r\n<p>Beberapa bahkan kecewa karena Ariel tak hadir dalam comeback tersebut.</p>\r\n<p>\"<em>Gue masih bisa terima kalo Uki ga bisa hadir, tapi kalo tanpa Ariel, ntahlah. Ariel nyawanya Peterpan,</em>\" tulis @aenymoja.</p>\r\n<p>\"<em>BENERAN NGGA ADA ARIEL??? Alhamdulillah aman tabungan?</em>\" tulis @anggundevinta.</p>', '/uploads/thumb-1751465595155.jpeg', 4, 36, '2025-07-02 14:13:15', 'published'),
(107, 'Kronologi Mahasiswi UNS Terjun ke Sungai Bengawan Solo, Tinggalkan Surat Wasiat dan Permintaan Maaf ke Dosen', '<p>Seorang mahasiswi UNS berinisial DA (22) asal Temanggung, Jawa Tengah diduga bunuh diri dengan cara terjun ke Sungai Bengawan Solo pada Selasa (1/7/2025). Pihak Badan Penanggulangan Bencana Daerah (BPBD) Surakarta pun telah mengkonfirmasi identitasnya.</p>\r\n<p>\"Identitas korban sudah diketahui. Informasi yang diterima dari UNS,” ujar Haryana, Koordinator Lapangan BPBD Surakarta.</p>\r\n<p class=\"continue-read-break\">Mengutip Kompas.com, DA merupakan mahasiswi Program Studi K3 UNS angkatan 2021. Sebelum terjun ke Sungai Bengawan Solo, DA meninggalkan satu unit motor metik yang dikendarainya dan sebuah surat wasiat.</p>\r\n<p>Detik-detik DA hendak lompat ke Sunga Bengawan Solo rupanya sempat dipergoki oleh salah satu pengendara ojek online yang melintas. Berikut adalah kronologi lengkapnya.</p>\r\n<p><strong>Kronologi Mahasiswi UNS Terjun ke Sungai Bengawan Solo</strong></p>\r\n<p>Dalam sebuah video yang beredar di TikTok, seorang pengemudi ojek online membeberkan kronologi kejadian miris yang menimpa DA. Pada Selasa (1/7/2025) siang, pria tersebut mengaku sedang melintas di area Jembatan Jurug sambil membawa penumpang. Ia kemudian melihat seorang wanita muda sedang berdiri di tepi jembatan sebelum akhirnya melompat ke Sungai Bengawan Solo.</p>', '/uploads/thumb-1751465694518.jpeg', 6, 36, '2025-07-02 14:14:54', 'published'),
(108, 'Peterpan Umumkan Comeback ke Panggung Lewat The Journey Continues, Formasi Personel Disorot', '<p>Nama Peterpan kembali menggema setelah sekian lama.</p>\r\n<p>Grup band legendaris tersebut akan tampil dalam proyek bertajuk \"The Journey Continues\" yang rencananya digelar di Bandung pada 31 Agustus 2025.</p>\r\n<p>Kabar itu diumumkan lewat Instagram resmi @aloka.id.</p>\r\n<p><em>\"Nama itu pernah mengisi harimu. Dan lagu-lagunya tetap abadi di ingatan. Kini, sebuah perjalanan dimulai kembali,\"</em> tulis akun @aloka.id dan @thejourneyproject.id dikutip Kompas.com, Jumat (27/6/2025).</p>\r\n<p class=\"continue-read-break\">Momen ini diprediksi menjadi nostalgia besar bagi para Sahabat Peterpan, sebutan bagi penggemar band tersebut, yang telah lama menantikan reuni dan penampilan spesial dari band yang kini telah dikenal dengan nama NOAH.</p>\r\n<p>Meski belum ada keterangan resmi soal susunan acara atau formasi personel yang akan tampil, pengumuman ini sudah mencuri perhatian ribuan warganet yang membanjiri unggahan tersebut.</p>\r\n<p><em>\"Terpantau hingga hari ini hanya Uki dan Ariel yang tidak follow peterpan.. antara gimmick atau memang gak masuk comebacknya peterpan..,\"&nbsp;</em>tulis @setyawanbagus04.&nbsp;</p>\r\n<p><em>\"Minimal kasih kepastian bakalan 6 personil atau enggak. Kalo enggak mah mending skip pake nama Peterpan,\"</em>&nbsp;tulis @juliusfery.</p>\r\n<p class=\"\"><em>“Apakah Andika dan Boril sudah rujuk?”</em>&nbsp;tulis @nugrahapurnaa.</p>\r\n<p><em>\"Apakah personil lengkap ? Ariel ? Indra ? Andika ? Oki ? Lukman ?,\"</em> tulis @indra_06moon.</p>', '/uploads/thumb-1751465773771.jpeg', 4, 36, '2025-07-02 14:16:13', 'published'),
(111, 'Bantah Peras Reza Gladys, Nikita Mirzani Singgung soal Kesepakatan Bisnis: Itu Sudah Biasa Saya Lakukan', '<p>Ia juga membantah adanya dugaan pemerasan yang dilakukannya pada Reza Gladys. Nikita menyebut sejumlah uang yang ia dapat merupakan hasil dari kesepakatan bisnis kedua belah pihak.</p>\r\n<p class=\"continue-read-break\">Terutama dalam kasus ini, Nikita mengaku uang yang diterima merupakan bayaran kerja sama usai mereview produk&nbsp;<em>skincare</em>&nbsp;Glafidsya. Ibunda Lolly menganggap hal itu sebagai suatu bentuk pekerjaan yang disepakati bersama.</p>\r\n<p>\"Percakapan itu berbentuk kesepakatan di mana adanya jasa dan harga yang dibayarkan yang bernilai bisnis,\" ungkapnya, dikutip dari Kompas.com.</p>\r\n<p>Percakapan yang dimaksud adalah penawaran dari asistennya, Mail kepada pihak Reza Gladys soal \"<em>speak up</em>\" produk Glafidsya. Totalnya disebut mencapai Rp 5 miliar.</p>\r\n<p>\"Itu sudah biasa saya lakukan yang merupakan pekerjaan saya untuk&nbsp;<em>endorse</em> dan mereview produk, baik produk kecantikan atau produk lainnya,\" ujar Nikita.</p>', '/uploads/thumb-1751466304253.jpeg', 3, 36, '2025-07-02 14:25:04', 'published');

-- --------------------------------------------------------

--
-- Table structure for table `news_views`
--

CREATE TABLE `news_views` (
  `id` int(11) NOT NULL,
  `news_id` int(11) DEFAULT NULL,
  `external_url` varchar(500) DEFAULT NULL,
  `source_type` enum('internal','external') NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `viewed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `duration` int(11) DEFAULT NULL,
  `title` text DEFAULT NULL,
  `device_type` varchar(20) DEFAULT 'Desktop',
  `traffic_source` varchar(20) DEFAULT 'Direct'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `news_views`
--

INSERT INTO `news_views` (`id`, `news_id`, `external_url`, `source_type`, `category_id`, `viewed_at`, `duration`, `title`, `device_type`, `traffic_source`) VALUES
(220, NULL, NULL, 'internal', 6, '2025-06-28 06:15:34', 1, NULL, 'Desktop', 'Referral'),
(221, NULL, NULL, 'internal', 6, '2025-06-28 06:16:26', NULL, NULL, 'Desktop', 'Referral'),
(222, NULL, NULL, 'internal', 3, '2025-06-28 07:40:14', 23, NULL, 'Mobile', 'Direct'),
(223, NULL, NULL, 'internal', 6, '2025-06-28 07:48:00', NULL, NULL, 'Desktop', 'Referral'),
(224, NULL, NULL, 'internal', 6, '2025-06-28 07:48:11', NULL, NULL, 'Desktop', 'Referral'),
(225, NULL, NULL, 'internal', 6, '2025-06-28 07:57:38', NULL, NULL, 'Desktop', 'Referral'),
(226, NULL, NULL, 'internal', 6, '2025-06-28 07:58:01', NULL, NULL, 'Desktop', 'Referral'),
(227, NULL, NULL, 'internal', 6, '2025-06-28 08:00:31', NULL, NULL, 'Desktop', 'Referral'),
(228, NULL, NULL, 'internal', 6, '2025-06-28 08:00:43', NULL, NULL, 'Desktop', 'Referral'),
(229, NULL, NULL, 'internal', 6, '2025-06-28 08:01:00', NULL, NULL, 'Desktop', 'Referral'),
(230, NULL, NULL, 'internal', 6, '2025-06-28 08:17:01', NULL, NULL, 'Desktop', 'Referral'),
(231, NULL, NULL, 'internal', 6, '2025-06-28 08:17:08', 12, NULL, 'Desktop', 'Referral'),
(232, NULL, NULL, 'internal', 1, '2025-06-28 08:35:20', 54, NULL, 'Desktop', 'Direct'),
(233, NULL, 'https://variety.com/2025/music/news/diddy-trial-defense-closing-arguments-swinger-1236442744/', 'external', 4, '2025-06-29 02:29:17', 6, 'Diddy Trial Reaches Explosive Conclusion as Defense Asks Jury to ‘Summon That Courage’ to ‘Acquit Sean Combs’ - Variety', 'Desktop', 'Direct'),
(234, NULL, 'https://www.axios.com/2025/06/27/trump-powell-federal-reserve-rates', 'external', 3, '2025-06-29 03:00:10', 1, 'Trump says he\'ll expect next Fed chair to cut rates - Axios', 'Desktop', 'Direct'),
(235, NULL, 'https://www.ign.com/articles/the-nintendo-summer-sale-has-rare-discounts-on-mario-switch-games-today', 'external', 1, '2025-06-29 03:00:43', 129, 'The Nintendo Summer Sale Has Rare Discounts on Mario Switch Games Today - IGN', 'Desktop', 'Direct'),
(236, NULL, NULL, 'internal', 2, '2025-06-29 03:02:57', 2, NULL, 'Desktop', 'Direct'),
(237, NULL, NULL, 'internal', 2, '2025-06-29 03:03:02', 3, NULL, 'Desktop', 'Direct'),
(238, NULL, NULL, 'internal', 4, '2025-06-29 03:05:26', NULL, NULL, 'Desktop', 'Direct'),
(239, NULL, NULL, 'internal', 4, '2025-06-29 03:08:04', 2, NULL, 'Desktop', 'Direct'),
(240, NULL, NULL, 'internal', 4, '2025-06-29 03:08:27', 42, NULL, 'Desktop', 'Direct'),
(241, NULL, NULL, 'internal', 4, '2025-06-29 03:09:19', 3482, NULL, 'Desktop', 'Direct'),
(242, NULL, 'https://www.ign.com/articles/the-nintendo-summer-sale-has-rare-discounts-on-mario-switch-games-today', 'external', 1, '2025-06-29 04:27:38', 8, 'The Nintendo Summer Sale Has Rare Discounts on Mario Switch Games Today - IGN', 'Desktop', 'Direct'),
(243, NULL, 'https://www.ign.com/articles/the-nintendo-summer-sale-has-rare-discounts-on-mario-switch-games-today', 'external', 1, '2025-06-29 04:27:56', 9, 'The Nintendo Summer Sale Has Rare Discounts on Mario Switch Games Today - IGN', 'Desktop', 'Direct'),
(244, NULL, 'https://www.ign.com/articles/the-nintendo-summer-sale-has-rare-discounts-on-mario-switch-games-today', 'external', 1, '2025-06-29 04:49:30', 21, 'The Nintendo Summer Sale Has Rare Discounts on Mario Switch Games Today - IGN', 'Mobile', 'Direct'),
(245, NULL, 'https://www.tomsguide.com/news/live/squid-game-season-3-live', 'external', 4, '2025-06-29 14:20:40', 4, '\'Squid Game\' season 3 LIVE — ending explained, who dies, surprise cameos, and what\'s next - Tom\'s Guide', 'Desktop', 'Direct'),
(246, NULL, 'https://www.nbcsports.com/nfl/profootballtalk/rumor-mill/news/justin-tucker-hopes-to-thread-needle-between-claiming-innocence-accepting-responsibility', 'external', 5, '2025-06-29 15:28:46', 2, 'Justin Tucker hopes to thread needle between claiming innocence, accepting responsibility - NBC Sports', 'Mobile', 'Direct'),
(247, NULL, 'https://pokemongohub.net/post/guide/zamazenta-crowned-shield-raid-guide/', 'external', 1, '2025-06-29 15:30:16', 3, 'Crowned Shield Zamazenta Raid Guide - Pokémon GO Hub', 'Desktop', 'Direct'),
(248, NULL, 'https://www.nintendolife.com/features/22-games-with-secret-performance-bumps-you-should-revisit-on-switch-2', 'external', 1, '2025-06-29 16:11:44', 8, 'Feature: 22 Games With \'Secret\' Performance Bumps You Should Revisit On Switch 2 - Nintendo Life', 'Mobile', 'Direct'),
(249, NULL, NULL, 'internal', 4, '2025-06-29 16:30:31', 54, NULL, 'Desktop', 'Referral'),
(250, NULL, NULL, 'internal', 4, '2025-06-29 16:31:32', 310, NULL, 'Desktop', 'Referral'),
(251, NULL, NULL, 'internal', 4, '2025-06-29 16:36:42', 2, NULL, 'Desktop', 'Referral'),
(252, NULL, NULL, 'internal', 4, '2025-06-29 16:36:53', 53, NULL, 'Desktop', 'Referral'),
(253, NULL, NULL, 'internal', 4, '2025-06-29 16:38:45', 101, NULL, 'Desktop', 'Referral'),
(254, NULL, 'https://www.windowscentral.com/software-apps/windows-11/windows-11-version-25h2-official-announcement', 'external', 1, '2025-06-29 16:40:44', 39, 'Microsoft confirms Windows 11 version 25H2 is coming soon — will install much faster than version 24H2 - Windows Central', 'Desktop', 'Referral'),
(255, NULL, 'http://www.hollywoodreporter.com/tv/tv-features/mariska-hargitay-my-mom-jayne-biological-father-interview-1236301507/', 'external', 4, '2025-06-29 16:41:44', 51, 'Mariska Hargitay on Making ‘My Mom Jayne’ and the “Miracle” of Getting to Reveal a Family Secret on Her Own Terms - hollywoodreporter.com', 'Desktop', 'Referral'),
(256, NULL, 'https://www.investors.com/news/economy/federal-reserve-pce-inflation-rate-may-trump-tariffs-sp-500/', 'external', 3, '2025-06-29 16:48:51', 51, 'Key Fed Inflation Rate Overshoots As Trump Eyes New Chair; S&P 500 Rises - Investor\'s Business Daily', 'Desktop', 'Referral'),
(257, NULL, 'https://apnews.com/article/sean-combs-diddy-trial-jury-deliberations-charges-efd13dc52715625ffe1d17ea406e17b5', 'external', 4, '2025-06-29 16:49:47', 88, 'Jury set to begin deliberating in Sean ‘Diddy’ Combs’ sex trafficking trial. Here\'s what to know - AP News', 'Desktop', 'Referral'),
(258, NULL, 'https://www.bbc.com/news/articles/czryvm3nlvdo', 'external', 6, '2025-06-29 17:04:14', 1, 'Phage therapy: I found a bacteria-eating virus in my loo - BBC', 'Desktop', 'Direct'),
(259, NULL, 'https://www.investors.com/news/economy/federal-reserve-pce-inflation-rate-may-trump-tariffs-sp-500/', 'external', 3, '2025-06-29 17:04:14', NULL, 'Key Fed Inflation Rate Overshoots As Trump Eyes New Chair; S&P 500 Rises - Investor\'s Business Daily', 'Desktop', 'Direct'),
(260, NULL, 'https://www.washingtonpost.com/business/2025/06/27/stock-market-record-tariffs-trump-trade/', 'external', 3, '2025-06-29 17:04:35', NULL, 'S&P 500 squeaks out record high even as new trade tensions emerge with Canada - The Washington Post', 'Desktop', 'Direct'),
(261, NULL, 'https://www.investors.com/news/economy/federal-reserve-pce-inflation-rate-may-trump-tariffs-sp-500/', 'external', 3, '2025-06-29 17:07:44', NULL, 'Key Fed Inflation Rate Overshoots As Trump Eyes New Chair; S&P 500 Rises - Investor\'s Business Daily', 'Desktop', 'Referral'),
(262, NULL, 'https://www.washingtonpost.com/business/2025/06/27/stock-market-record-tariffs-trump-trade/', 'external', 3, '2025-06-29 17:07:45', 59, 'S&P 500 squeaks out record high even as new trade tensions emerge with Canada - The Washington Post', 'Desktop', 'Referral'),
(263, NULL, 'https://www.forbes.com/sites/paultassi/2025/06/28/marathon-nda-alpha-leaks-show-visual-improvements-detail-new-additions/', 'external', 1, '2025-06-29 17:08:48', NULL, '‘Marathon’ NDA Alpha Leaks Show Visual Improvements, Detail New Additions - Forbes', 'Desktop', 'Referral'),
(264, NULL, 'https://www.forbes.com/sites/paultassi/2025/06/28/marathon-nda-alpha-leaks-show-visual-improvements-detail-new-additions/', 'external', 1, '2025-06-29 17:10:31', NULL, '‘Marathon’ NDA Alpha Leaks Show Visual Improvements, Detail New Additions - Forbes', 'Desktop', 'Referral'),
(265, NULL, 'https://www.investors.com/news/economy/federal-reserve-pce-inflation-rate-may-trump-tariffs-sp-500/', 'external', 3, '2025-06-29 17:10:32', NULL, 'Key Fed Inflation Rate Overshoots As Trump Eyes New Chair; S&P 500 Rises - Investor\'s Business Daily', 'Desktop', 'Referral'),
(266, NULL, 'https://www.forbes.com/sites/paultassi/2025/06/28/marathon-nda-alpha-leaks-show-visual-improvements-detail-new-additions/', 'external', 1, '2025-06-29 17:10:59', NULL, '‘Marathon’ NDA Alpha Leaks Show Visual Improvements, Detail New Additions - Forbes', 'Desktop', 'Referral'),
(267, NULL, 'https://www.investors.com/news/economy/federal-reserve-pce-inflation-rate-may-trump-tariffs-sp-500/', 'external', 3, '2025-06-29 17:10:59', NULL, 'Key Fed Inflation Rate Overshoots As Trump Eyes New Chair; S&P 500 Rises - Investor\'s Business Daily', 'Desktop', 'Referral'),
(268, NULL, 'https://www.investors.com/news/economy/federal-reserve-pce-inflation-rate-may-trump-tariffs-sp-500/', 'external', 3, '2025-06-29 17:12:20', NULL, 'Key Fed Inflation Rate Overshoots As Trump Eyes New Chair; S&P 500 Rises - Investor\'s Business Daily', 'Desktop', 'Referral'),
(269, NULL, 'https://www.forbes.com/sites/paultassi/2025/06/28/marathon-nda-alpha-leaks-show-visual-improvements-detail-new-additions/', 'external', 1, '2025-06-29 17:12:21', 1, '‘Marathon’ NDA Alpha Leaks Show Visual Improvements, Detail New Additions - Forbes', 'Desktop', 'Referral'),
(270, NULL, 'https://www.cnn.com/2025/06/28/sport/matthew-schaefer-new-york-islanders-nhl-draft-spt', 'external', 5, '2025-06-29 17:12:28', NULL, 'Matthew Schaefer honors late mother after getting selected first overall by New York Islanders in NHL draft - CNN', 'Desktop', 'Referral'),
(271, NULL, 'https://www.cnn.com/2025/06/28/sport/matthew-schaefer-new-york-islanders-nhl-draft-spt', 'external', 5, '2025-06-29 17:15:33', NULL, 'Matthew Schaefer honors late mother after getting selected first overall by New York Islanders in NHL draft - CNN', 'Desktop', 'Referral'),
(272, NULL, 'https://www.investors.com/news/economy/federal-reserve-pce-inflation-rate-may-trump-tariffs-sp-500/', 'external', 3, '2025-06-29 17:15:33', NULL, 'Key Fed Inflation Rate Overshoots As Trump Eyes New Chair; S&P 500 Rises - Investor\'s Business Daily', 'Desktop', 'Referral'),
(273, NULL, 'https://www.polygon.com/pokemon-go-guide/609534/fest-2025-global-habitat-schedule-ticket-perks', 'external', 1, '2025-06-29 17:16:44', NULL, 'Pokémon Go Fest 2025 event habitat spawns and bonuses - Polygon', 'Desktop', 'Direct'),
(274, NULL, 'https://www.polygon.com/pokemon-go-guide/609534/fest-2025-global-habitat-schedule-ticket-perks', 'external', 1, '2025-06-29 17:17:40', 271, 'Pokémon Go Fest 2025 event habitat spawns and bonuses - Polygon', 'Desktop', 'Referral'),
(275, NULL, 'https://variety.com/2025/film/news/box-office-brad-pitt-f1-movie-opening-day-m3gan-2-1236443223/', 'external', 4, '2025-06-29 17:22:13', 1, 'Box Office: ‘F1’ Leads the Pack With $25 Million Opening Day, ‘M3GAN 2.0’ Not So Fab in Fourth Place Debut - Variety', 'Desktop', 'Referral'),
(276, NULL, 'http://www.rollingstone.com/tv-movies/tv-movie-features/the-bear-season-4-finale-1235369794/', 'external', 4, '2025-06-29 17:22:19', NULL, '‘The Bear’ Season 4 Finale Leaves Us With Plenty to Chew On - Rolling Stone', 'Desktop', 'Referral'),
(277, NULL, 'https://www.cleveland.com/cavs/2025/06/cavs-to-acquire-lonzo-ball-in-trade-with-chicago-bulls.html', 'external', 5, '2025-06-29 17:24:22', 28, 'Cavs to acquire Lonzo Ball in trade with Chicago Bulls - Cleveland.com', 'Desktop', 'Direct'),
(278, NULL, 'https://www.polygon.com/pokemon-go-guide/609534/fest-2025-global-habitat-schedule-ticket-perks', 'external', 1, '2025-06-29 17:29:56', 2, 'Pokémon Go Fest 2025 event habitat spawns and bonuses - Polygon', 'Desktop', 'Direct'),
(279, NULL, NULL, 'internal', 4, '2025-06-29 17:30:04', 56, NULL, 'Desktop', 'Direct'),
(280, NULL, 'https://dailygalaxy.com/2025/06/scientists-discovered-first-pieces-mercury/', 'external', 2, '2025-06-29 17:31:09', 105, 'Scientists May Have Just Discovered the First Ever Pieces of Mercury - The Daily Galaxy', 'Desktop', 'Direct'),
(281, NULL, 'https://www.space.com/space-exploration/satellites/satellites-keep-breaking-up-in-space-insurance-wont-cover-them', 'external', 2, '2025-06-29 17:32:58', 2, 'Satellites keep breaking up in space, insurance won\'t cover them. - Space', 'Desktop', 'Direct'),
(282, NULL, NULL, 'internal', 4, '2025-06-29 17:33:09', 1102, NULL, 'Desktop', 'Direct'),
(283, NULL, 'https://www.wltx.com/article/tech/science/meteor-fireball-south-carolina-georgia-fragment-roof-impact/101-76438d1c-706c-4c57-9a15-373f89a4ee80', 'external', 2, '2025-06-29 17:40:56', 151, 'What we know about the fireball seen across several states Thursday - WLTX', 'Desktop', 'Referral'),
(284, NULL, 'https://www.space.com/space-exploration/satellites/satellites-keep-breaking-up-in-space-insurance-wont-cover-them', 'external', 2, '2025-06-29 17:43:31', 89, 'Satellites keep breaking up in space, insurance won\'t cover them. - Space', 'Desktop', 'Referral'),
(285, NULL, NULL, 'internal', 3, '2025-06-29 17:45:07', 85, NULL, 'Desktop', 'Referral'),
(286, NULL, NULL, 'internal', 3, '2025-06-29 17:46:40', 36, NULL, 'Desktop', 'Referral'),
(287, NULL, NULL, 'internal', 6, '2025-06-29 17:47:25', 44, NULL, 'Desktop', 'Referral'),
(288, NULL, NULL, 'internal', 6, '2025-06-29 17:48:16', 106, NULL, 'Desktop', 'Referral'),
(289, NULL, NULL, 'internal', 6, '2025-06-29 17:50:09', 81, NULL, 'Desktop', 'Referral'),
(290, NULL, NULL, 'internal', 6, '2025-06-29 17:51:31', 1, NULL, 'Desktop', 'Referral'),
(291, NULL, NULL, 'internal', 4, '2025-06-29 17:51:32', NULL, NULL, 'Mobile', 'Direct'),
(292, NULL, NULL, 'internal', 3, '2025-06-29 17:52:37', 126, NULL, 'Desktop', 'Referral'),
(293, NULL, NULL, 'internal', 4, '2025-06-29 17:56:38', 10, NULL, 'Desktop', 'Referral'),
(294, NULL, 'http://www.thecut.com/article/who-will-replace-anna-wintour-at-vogue.html', 'external', 4, '2025-06-29 17:57:01', 7, 'Who Will Replace Anna Wintour at ‘Vogue’? - The Cut', 'Mobile', 'Referral'),
(295, NULL, NULL, 'internal', 6, '2025-06-29 17:57:26', 5, NULL, 'Desktop', 'Referral'),
(296, NULL, 'https://www.tomsguide.com/news/live/squid-game-season-3-live', 'external', 4, '2025-06-29 17:59:39', 8, '\'Squid Game\' season 3 LIVE — ending explained, who dies, surprise cameos, and what\'s next - Tom\'s Guide', 'Desktop', 'Referral'),
(297, NULL, NULL, 'internal', 4, '2025-06-29 18:00:29', 2, NULL, 'Desktop', 'Referral'),
(298, NULL, 'https://www.tomsguide.com/news/live/squid-game-season-3-live', 'external', 4, '2025-06-29 18:34:12', 107, '\'Squid Game\' season 3 LIVE — ending explained, who dies, surprise cameos, and what\'s next - Tom\'s Guide', 'Desktop', 'Direct'),
(299, NULL, 'https://sanjosehockeynow.com/san-jose-sharks-wang-mckinney-mutryn-2025-draft-scouts/', 'external', 5, '2025-06-30 05:25:38', 341, 'NHL Scouts Talk Day 2 of Sharks’ 2025 Draft - San Jose Hockey Now', 'Desktop', 'Direct'),
(300, NULL, 'https://apnews.com/article/jake-paul-chavez-fight-91423402e1e4f69858044a650932f972', 'external', 5, '2025-06-30 05:42:26', 2, 'Jake Paul beats former middleweight champ Julio César Chávez Jr. by unanimous decision - AP News', 'Desktop', 'Direct'),
(301, NULL, 'https://apnews.com/article/robots-foootball-china-ai-d49a4308930f49537b17f463afef5043', 'external', 5, '2025-06-30 05:42:34', 36, 'China’s humanoid robots generate more soccer excitement than their human counterparts - AP News', 'Desktop', 'Direct'),
(302, NULL, NULL, 'internal', 6, '2025-06-30 05:43:18', 219, NULL, 'Desktop', 'Direct'),
(303, NULL, 'https://apnews.com/article/jake-paul-chavez-fight-91423402e1e4f69858044a650932f972', 'external', 5, '2025-06-30 06:04:02', 43, 'Jake Paul beats former middleweight champ Julio César Chávez Jr. by unanimous decision - AP News', 'Desktop', 'Direct'),
(304, NULL, NULL, 'internal', 4, '2025-06-30 06:04:54', NULL, NULL, 'Desktop', 'Direct'),
(305, NULL, NULL, 'internal', 4, '2025-06-30 07:58:16', 1725, NULL, 'Desktop', 'Direct'),
(306, NULL, 'https://mynintendonews.com/2025/06/28/sonic-team-boss-says-remakes-of-the-sonic-adventure-games-not-happening/', 'external', 1, '2025-06-30 09:54:09', 6, 'Sonic Team boss says remakes of the Sonic Adventure games not happening - My Nintendo News', 'Desktop', 'Direct'),
(307, NULL, NULL, 'internal', 6, '2025-06-30 09:54:22', 127, NULL, 'Desktop', 'Direct'),
(308, NULL, NULL, 'internal', 6, '2025-06-30 09:56:30', 1538, NULL, 'Mobile', 'Direct'),
(309, NULL, NULL, 'internal', 4, '2025-06-30 10:18:14', 138, NULL, 'Desktop', 'Direct'),
(310, NULL, 'https://variety.com/2025/tv/news/jake-paul-beats-julio-cesar-chavez-jr-1236441992/', 'external', 5, '2025-06-30 10:22:13', 102, 'Jake Paul Beats Julio César Chávez Jr. by Unanimous Decision in 10-Round Fight, Tells Doubters to ‘Shut the F— Up’ After Win - Variety', 'Desktop', 'Direct'),
(311, NULL, NULL, 'internal', 4, '2025-06-30 10:24:02', 553, NULL, 'Desktop', 'Direct'),
(312, NULL, NULL, 'internal', 4, '2025-06-30 10:25:32', 99, NULL, 'Desktop', 'Direct'),
(313, NULL, NULL, 'internal', 2, '2025-06-30 10:27:18', 63, NULL, 'Mobile', 'Direct'),
(314, NULL, 'https://www.npr.org/2025/06/29/nx-s1-5450122/irish-rap-group-kneecap-glastonbury', 'external', 4, '2025-06-30 10:28:27', 5, 'Northern Irish rap group Kneecap plays Glastonbury despite controversy - NPR', 'Mobile', 'Direct'),
(315, NULL, 'https://www.npr.org/2025/06/29/nx-s1-5450122/irish-rap-group-kneecap-glastonbury', 'external', 4, '2025-06-30 11:01:58', 9, 'Northern Irish rap group Kneecap plays Glastonbury despite controversy - NPR', 'Desktop', 'Direct'),
(316, NULL, NULL, 'internal', 6, '2025-06-30 11:02:14', 120, NULL, 'Desktop', 'Direct'),
(317, NULL, 'https://www.bbc.com/sport/live/c8e4dwz21knt', 'external', 5, '2025-06-30 11:04:26', 15, 'F1 LIVE: Austrian Grand Prix 2025: UK start time, grid, radio & updates from Red Bull Ring - BBC', 'Mobile', 'Direct'),
(318, NULL, 'https://www.bbc.com/sport/live/c8e4dwz21knt', 'external', 5, '2025-06-30 11:04:45', 51, 'F1 LIVE: Austrian Grand Prix 2025: UK start time, grid, radio & updates from Red Bull Ring - BBC', 'Desktop', 'Direct'),
(319, NULL, NULL, 'internal', 6, '2025-06-30 11:05:44', 2410, NULL, 'Desktop', 'Direct'),
(320, NULL, 'https://www.huffpost.com/entry/gay-dad-marriage-mom-death_n_68613131e4b08e0b4a73f2b9', 'external', 4, '2025-06-30 14:12:25', 5, 'My Dad Was Gay — But Married To My Mom For 64 Years. As She Died, I Overheard Something I Can\'t Forget. - HuffPost', 'Desktop', 'Direct'),
(321, NULL, 'https://www.cbssports.com/boxing/news/jake-paul-vs-julio-cesar-chavez-jr-results-highlights-problem-child-cruises-to-easy-decision-win/live/', 'external', 5, '2025-06-30 14:12:44', NULL, 'Jake Paul vs. Julio Cesar Chavez Jr. results, highlights: \'Problem Child\' cruises to easy decision win - CBS Sports', 'Desktop', 'Direct'),
(322, NULL, 'https://ambcrypto.com/arb-crypto-defends-0-30-surges-21-will-0-40-be-next/', 'external', 3, '2025-07-01 09:11:06', 2, 'ARB crypto defends $0.30, surges 21% – Will $0.40 be next? - AMBCrypto', 'Desktop', 'Direct'),
(323, NULL, 'https://hackaday.com/2025/06/29/switching-from-desktop-linux-to-freebsd/', 'external', 1, '2025-07-01 09:11:16', 1, 'Switching From Desktop Linux To FreeBSD - Hackaday', 'Desktop', 'Direct'),
(324, NULL, 'https://ambcrypto.com/arb-crypto-defends-0-30-surges-21-will-0-40-be-next/', 'external', 3, '2025-07-01 09:11:22', 3, 'ARB crypto defends $0.30, surges 21% – Will $0.40 be next? - AMBCrypto', 'Desktop', 'Direct'),
(325, NULL, NULL, 'internal', 6, '2025-07-01 09:11:41', 701, NULL, 'Desktop', 'Direct'),
(326, NULL, NULL, 'internal', 5, '2025-07-01 09:23:30', 126, NULL, 'Desktop', 'Direct'),
(327, NULL, NULL, 'internal', 3, '2025-07-01 09:32:57', 545, NULL, 'Desktop', 'Direct'),
(328, NULL, NULL, 'internal', 4, '2025-07-01 13:47:55', NULL, NULL, 'Desktop', 'Direct'),
(329, NULL, 'https://www.washingtonpost.com/wellness/2025/06/30/measles-vaccine-cost/', 'external', 6, '2025-07-01 13:56:24', 394, 'A Texas boy needed protection from measles. The vaccine cost $1,400. - The Washington Post', 'Desktop', 'Direct'),
(330, NULL, 'https://www.pushsquare.com/news/2025/06/uks-death-stranding-2-ps5-physical-sales-displace-mario-kart-world-but-down-66percent-compared-to-predecessor', 'external', 1, '2025-07-01 14:13:20', 615, 'UK\'s Death Stranding 2 PS5 Physical Sales Displace Mario Kart World, But Down 66% Compared to Predecessor - Push Square', 'Desktop', 'Direct'),
(331, NULL, NULL, 'internal', 4, '2025-07-01 15:41:44', 3, NULL, 'Mobile', 'Referral'),
(332, NULL, NULL, 'internal', 4, '2025-07-01 15:42:17', 74, NULL, 'Mobile', 'Referral'),
(333, NULL, NULL, 'internal', 6, '2025-07-01 15:54:04', 145, NULL, 'Mobile', 'Direct'),
(334, NULL, 'https://apnews.com/article/wnba-expansion-cleveland-detroit-philadelphia-0a3d313baf917010f4d4d5ae0744ec7c', 'external', 5, '2025-07-01 15:56:34', 19, 'WNBA expanding to Cleveland, Detroit and Philadelphia over next five years - AP News', 'Desktop', 'Direct'),
(335, NULL, NULL, 'internal', 6, '2025-07-01 16:02:15', 6365, NULL, 'Mobile', 'Direct'),
(336, NULL, 'https://www.nhl.com/wild/news/minnesota-sports-entertainment-and-grand-casino-announce-arena-naming-rights-partnership-063025', 'external', 5, '2025-07-01 17:48:40', 37, 'Minnesota Sports & Entertainment and Grand Casino Announce Arena Naming Rights Partnership | Minnesota Wild - NHL.com', 'Desktop', 'Direct');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `otp_code` varchar(6) DEFAULT NULL,
  `otp_expired` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `first_name`, `last_name`, `email`, `password`, `role`, `created_at`, `otp_code`, `otp_expired`) VALUES
(36, 'admin put', 'halo tes look book', 'tes', 'adminputra@gmail.com', '$2b$10$.pd6Y/CuWRvniIZc7h/D6ODCoNymJ6JhCjTwYL4vtNYJv/Vqxw9PW', 'admin', '2025-04-17 03:52:55', NULL, '2025-06-30 15:46:11'),
(98, 'putra tess', 'Putra tung tung', 'ardiansyah', 'putraardi431@gmail.com', '$2b$10$Y9lsSQE9QUCtmKnVK9vVP.XOfG31aN6XE4XPTEr.Yp2UF6JNxFXwa', 'user', '2025-06-27 15:21:51', NULL, '2025-07-01 19:16:28'),
(101, 'putra arrdd', 'Putra ardi', 'Ardiansyah', 'putraardi3@gmail.com', '$2b$10$CXiKoQGTG9gOhAVM1b4vYucTKCQ3zG7.TDZPTOXnCWRrLFolsemc2', 'user', '2025-06-28 06:19:46', NULL, NULL),
(102, 'putra', 'Putra ardi', 'Ardiansyah', 'putraardi4@gmail.com', '$2b$10$jBl.liYRkdMWLLBNXphaUuDunaQBa76WqrdsWqELIu8K.gdcskw6a', 'user', '2025-06-28 06:36:49', NULL, NULL),
(104, 'tessss', 'Putra ardi', 'Ardiansyah', 'putraardi5@gmail.com', '$2b$10$R7u1E0P9QU2TOoqLETBjZ.HTsGXTyhX18jUz6X6.KT0fQqB7J4edO', 'user', '2025-06-29 08:34:54', NULL, NULL),
(108, 'putra ardians', '', '', 'putraardi12@gmail.com', '$2b$10$cQGR8l9t1ZtgHs4EpM539ulhnfhErFBdr/QBtCOxoD6qyHlqHqsLK', 'user', '2025-06-29 13:27:48', NULL, NULL),
(109, 'putraardddd', 'Putra ardi', 'Ardiansyah', 'putraardi6@gmail.com', '$2b$10$QnnYe8U6Ls/IDQWZ23dDbezqLBiV1JJivaTE724CXtmx87PVvqQyu', 'user', '2025-06-29 13:40:44', NULL, NULL),
(111, 'putra ardi2', 'testing 123', 'tesss', 'putraardi8@gmail.com', '$2b$10$yIIHNts/qMyAH9jjwQjGhOQoS5TigT/JWx4EkRuIrcd3cphbWOGcy', 'user', '2025-06-30 04:38:51', NULL, NULL),
(113, 'contoh', '', '', 'contoh123@gmail.com', '$2b$10$CDVxX2yc8/e.WmN3A3c8zey1P.cNHyOyu9CIskzzN.bXIkCF.f6.W', 'user', '2025-06-30 06:01:18', NULL, NULL),
(114, 'contoh12', '', '', 'contoh12@gmail.com', '$2b$10$NPrKp7fAGfiJdcyp28hnX.V5deH84fcy/i0/tiKl2kHw7MX69lmp.', 'user', '2025-06-30 08:27:41', NULL, NULL),
(115, 'tung tung tung', '', '', 'tungtung123@gmail.com', '$2b$10$wEDzhWi51T0hvxM6b4jh4O2rMbvq3tVyJsxSIgUgAHx1I7rFddxMu', 'user', '2025-07-01 16:37:36', NULL, NULL),
(116, 'putra tes', 'Putra ardi', 'Ardiansyah', 'putraardi422@gmail.com', '$2b$10$oauIaKYitf0pAH8GV7FWB.SIqGQ8V4AsjfIMtCIZxOIe.x.yM3NT2', 'user', '2025-07-01 16:39:43', NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `news_id` (`news_id`);

--
-- Indexes for table `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_category` (`category_id`),
  ADD KEY `fk_author` (`author_id`);

--
-- Indexes for table `news_views`
--
ALTER TABLE `news_views`
  ADD PRIMARY KEY (`id`),
  ADD KEY `news_id` (`news_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=181;

--
-- AUTO_INCREMENT for table `news`
--
ALTER TABLE `news`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=114;

--
-- AUTO_INCREMENT for table `news_views`
--
ALTER TABLE `news_views`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=337;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=117;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`news_id`) REFERENCES `news` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `news`
--
ALTER TABLE `news`
  ADD CONSTRAINT `fk_author` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_news_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `news_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `news_views`
--
ALTER TABLE `news_views`
  ADD CONSTRAINT `news_views_ibfk_1` FOREIGN KEY (`news_id`) REFERENCES `news` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `news_views_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
