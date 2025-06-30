-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 30, 2025 at 04:21 PM
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
(160, 113, 68, 'internal', NULL, 'testing 123', '2025-06-30 06:07:17', 'Gelagat Mulan Jameela saat Ahmad Dhani Curhat Soal Ganti Pasangan, Pakar Ekspresi: Ada Gestur Malu'),
(161, 36, NULL, 'external', 'https://mynintendonews.com/2025/06/28/sonic-team-boss-says-remakes-of-the-sonic-adventure-games-not-happening/', 'test', '2025-06-30 09:54:12', 'Sonic Team boss says remakes of the Sonic Adventure games not happening - My Nintendo News'),
(162, 36, NULL, 'external', 'https://mynintendonews.com/2025/06/28/sonic-team-boss-says-remakes-of-the-sonic-adventure-games-not-happening/', 'test', '2025-06-30 09:54:14', 'Sonic Team boss says remakes of the Sonic Adventure games not happening - My Nintendo News'),
(165, 36, 69, 'internal', NULL, 'test', '2025-06-30 09:56:58', 'Farhan: Jangan Pakai Cara Kotor demi Sekolah Impian Anak'),
(166, 114, 68, 'internal', NULL, 'test', '2025-06-30 10:18:21', 'Gelagat Mulan Jameela saat Ahmad Dhani Curhat Soal Ganti Pasangan, Pakar Ekspresi: Ada Gestur Malu'),
(167, 114, 68, 'internal', NULL, 'testerrr', '2025-06-30 10:25:37', 'Gelagat Mulan Jameela saat Ahmad Dhani Curhat Soal Ganti Pasangan, Pakar Ekspresi: Ada Gestur Malu'),
(168, 114, 68, 'internal', NULL, 'test', '2025-06-30 10:26:55', 'Gelagat Mulan Jameela saat Ahmad Dhani Curhat Soal Ganti Pasangan, Pakar Ekspresi: Ada Gestur Malu'),
(169, 114, 94, 'internal', NULL, 'tesss', '2025-06-30 10:27:22', 'Polisi Penipu QRIS Palsu Dipecat Tidak Hormat, Sudah Menipu Puluhan Kali'),
(170, 114, 94, 'internal', NULL, 'tes', '2025-06-30 10:28:15', 'Polisi Penipu QRIS Palsu Dipecat Tidak Hormat, Sudah Menipu Puluhan Kali'),
(171, 114, NULL, 'external', 'https://www.npr.org/2025/06/29/nx-s1-5450122/irish-rap-group-kneecap-glastonbury', 'tesss', '2025-06-30 10:28:29', 'Northern Irish rap group Kneecap plays Glastonbury despite controversy - NPR'),
(172, 113, NULL, 'external', 'https://www.bbc.com/sport/live/c8e4dwz21knt', 'test', '2025-06-30 11:04:29', 'F1 LIVE: Austrian Grand Prix 2025: UK start time, grid, radio & updates from Red Bull Ring - BBC'),
(173, 36, NULL, 'external', 'https://www.cbssports.com/boxing/news/jake-paul-vs-julio-cesar-chavez-jr-results-highlights-problem-child-cruises-to-easy-decision-win/live/', 'TEST', '2025-06-30 14:12:47', 'Jake Paul vs. Julio Cesar Chavez Jr. results, highlights: \'Problem Child\' cruises to easy decision win - CBS Sports');

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
(68, 'Gelagat Mulan Jameela saat Ahmad Dhani Curhat Soal Ganti Pasangan, Pakar Ekspresi: Ada Gestur Malu', '<p><strong>Grid.ID - Pakar mikro ekspresi baca gelagat Mulan Jameela di acara ngunduh mantu Al Ghazali. Gestur wajah istri Ahmad Dhani tersebut rupanya mengandung arti tak biasa.</strong></p>\r\n<p>Acara ngunduh mantu Al Ghazali dan Alyssa Daguise telah rampung dilaksanakan pada 19 Juni 2025 lalu. Namun, sederet momen manis dan hangat di hajatan besar tersebut masih terus jadi perbincangan.</p>\r\n<p>Salah satu yang cukup menarik perhatian adalah momen ketika Ahmad Dhani memberikan wejangan kepada Al Ghazali dan Alyssa. Wejangan tersebut seolah merupakan pelajaran yang Dhani petik dari kehidupannya sendiri.</p>\r\n<p>Sebagaimana diketahui, Ahmad Dhani memang pernah diisukan selingkuh hingga menikah dengan Mulan Jameela, dan menceraikan Maia Estianty.</p>\r\n<p>\"Yang paling berbahaya itu kan bisikan-bisikan sebelah. Kayak,&nbsp;<em>\'Udahlah kamu cerai aja sama Al, udahlah kamu pasti dapat yang lebih hebat lagi\'</em>. Itu hilangkan aja itu,\" ujar Ahmad Dhani seperti dikutip dari Tribun Jatim, Jumat (27/6/2025).</p>', '/uploads/thumb-1751047251539.png', 4, 36, '2025-06-30 13:34:56', 'draft'),
(69, 'Farhan: Jangan Pakai Cara Kotor demi Sekolah Impian Anak', '<p><strong>BANDUNG, KOMPAS.com</strong>&nbsp;– Wali Kota Bandung, Muhammad Farhan, mengimbau para orangtua agar tidak menggunakan cara-cara kotor demi memasukkan anak ke sekolah favorit dalam proses Seleksi Penerimaan Murid Baru (SPMB).</p>\r\n<p>\"Para orangtua sekalian, saya mengerti sekali bahwa kita ingin anak-anak kita mendapatkan pendidikan yang terbaik. Ketahuilah bahwa pastikan anak-anak kita mendapatkan kursi di sekolah yang diinginkan itu dengan cara yang bersih. Jangan dengan cara-cara yang kotor, karunya budak (kasihan anak),\" ucap Farhan saat ditemui seusai penandatanganan Pakta Integritas bersama ratusan kepala sekolah di Aula SMP Negeri 2 Kota Bandung, Jalan Sumatera, Selasa (24/6/2025).</p>', '/uploads/thumb-1751031398733.jpeg', 6, 36, '2025-06-27 13:36:38', 'published'),
(70, 'Bahaya Kanker Pankreas Mengintai Tanpa Gejala, Waspadai Tanda Ini di Toilet', '<p><strong>KOMPAS.com -</strong>&nbsp;Gejala awal kanker pankreas yang selama ini dikenal sebagai \"pembunuh senyap\" ternyata bisa dideteksi dari tinja.</p>\r\n<p>Dalam studi terbaru, peneliti menemukan bahwa pasien kanker pankreas memiliki pola bakteri usus yang berbeda dibandingkan orang sehat, dan perbedaan ini bisa dilihat melalui sampel kotoran.</p>\r\n<p>&nbsp;</p>\r\n<p class=\"continue-read-break\">Penelitian yang dilakukan oleh tim ilmuwan dari Finlandia dan Iran ini meneliti sampel tinja dari pasien kanker pankreas dan membandingkannya dengan orang sehat.</p>\r\n<p>Hasilnya, mereka menemukan bahwa pasien memiliki jenis bakteri usus yang berbeda dan lebih sedikit ragamnya.</p>\r\n<p>Untuk mendapatkan data ini, para peneliti menggunakan teknologi genetik yang disebut&nbsp;<em>16S rRNA gene sequencing.</em></p>\r\n<p>Lewat teknik ini, mereka bisa mengidentifikasi berbagai jenis bakteri dalam tubuh hanya dari DNA-nya.</p>\r\n<p>Menariknya, hasil pengamatan ini kemudian diolah menggunakan kecerdasan buatan (AI) yang mampu membedakan mana sampel dari pasien kanker dan mana yang bukan.</p>', '/uploads/thumb-1751031467308.jpeg', 6, 36, '2025-06-27 13:37:47', 'published'),
(71, 'Keluar Duit Rp 24 M, Ahmad Dhani Ungkap Alasan Ogah Terima Amplop di Ngunduh Mantu Al Ghazali', '<p><strong>Grid.ID - Ahmad Dhani mengaku keluar duit sampai Rp 24 miliar untuk ngunduh mantu Al Ghazali. Anggota DPR RI itu kini ungkap alasan tak mau terima amplop saat acara.</strong></p>\r\n<p>Acara ngunduh mantu pernikahan Al Ghazali dan Alyssa Daguise akan digelar di Jakarta Convention Center (JCC) pada Kamis (19/6/2025). Ahmad Dhani mengaku turut membiayai pernikahan Al Ghazali dan Alyssa Daguise.</p>\r\n<p>Meski keluar duit Rp 24 miliar, Ahmad Dhani ungkap alasan ogah terima amplop saat ngunduh mantu AL Ghazali. Kira-kira apa alasan sang anggota DPR RI?</p>\r\n<p class=\"continue-read-break\">Hal itu diungkap Ahmad Dhani saat bertemu para awak media yang tayang di kanal Youtube Ahmad Dhani dalam Berita, Rabu (25/6/2025). Ahmad Dhani menegaskan bahwa dirinya tidak menerima amplop dalam acara ngunduh mantu putra sulungnya, Al Ghazali, dengan Alyssa Daguise.</p>\r\n<p>Sebagai anggota DPR RI dari Komisi X, Dhani tidak ingin pernikahan anaknya menimbulkan polemik atau spekulasi yang tidak perlu.</p>\r\n<p>\"Soalnya kalau ngasih uang ke saya, masuknya gratifikasi,\" kata Dhani.</p>\r\n<p>\"Enggak boleh,\" lanjutnya.</p>\r\n<p>Tak hanya menolak pemberian dalam bentuk amplop, Dhani juga menolak berbagai tawaran kerja sama promosi atau endorse meski mengaku banyak yang menawarkan.</p>\r\n<p class=\"\">\"Iya (tawaran banyak), pokoknya saya enggak mau endorse,\" ucap Dhani.</p>', '/uploads/thumb-1751031535224.jpeg', 5, 36, '2025-06-27 13:38:55', 'published'),
(72, 'Bukan Hipotermia, RSUD Bali Mandara: Penyebab Kematian Juliana Marins akibat Kerusakan Organ dan Pendarahan', '<p><strong>DENPASAR, KOMPAS.com</strong>&nbsp;- Hasil autopsi jenazah Juliana Marins (27), wisatawan asal Brasil yang jatuh di lereng puncak Gunung Rinjani, akhirnya diumumkan oleh RSUD Bali Mandara, Jumat, 27 Juni 2025.</p>\r\n<p>Dokter forensik RSUD Bali Mandara, dr Ida Bagus Putu Alit, DMF. Sp.F, menjelaskan bahwa autopsi dilakukan pada Kamis, 26 Juni 2025, pukul 22.00 WITA, segera setelah jenazah tiba.</p>\r\n<p>Hasil pemeriksaan menunjukkan luka lecet geser di hampir seluruh tubuh korban, terutama di punggung, kepala, dan anggota gerak.</p>\r\n<p>Luka ini mengindikasikan bahwa tubuh korban tergeser oleh benda-benda tumpul saat jatuh.</p>\r\n<p class=\"continue-read-break\">\"Kami juga menemukan banyak patah tulang, terutama di bagian dada, punggung, dan paha. Dari kerusakan itu terjadi perdarahan hebat dan kerusakan organ-organ dalam,\" ujar dr Alit.</p>\r\n<p>Menurutnya, luka-luka tersebut merupakan penyebab langsung kematian Juliana.</p>\r\n<p>Kesimpulan awal: korban meninggal akibat kekerasan tumpul yang menyebabkan kerusakan organ vital dan pendarahan masif, terutama di daerah dada dan perut.</p>\r\n<p>“Kematian terjadi dalam waktu singkat, diperkirakan paling lama 20 menit setelah korban mengalami luka,” jelasnya.</p>', '/uploads/thumb-1751031606247.jpeg', 1, 36, '2025-06-27 13:40:06', 'published'),
(73, '13 Kebiasaan Sederhana untuk Menjaga Kesehatan Mental Tanpa Harus ke Terapis', '<p><em><strong>Menjaga kesehatan mental tak harus rumit Dengan kebiasaan sederhana, kamu bisa tetap tenang, bahagia, dan lebih menikmati hidup setiap hari.</strong></em></p>\r\n<p><strong>TRIBUNSTYLE.COM -</strong>&nbsp;kebiasaan sehari-hari yang tampak sepele ternyata bisa memberikan dampak besar pada kesehatan mental.</p>\r\n<p>Mulai dari bagaimana Anda memulai pagi, seberapa aktif Anda bergerak, hingga makanan yang Anda konsumsi semuanya berperan dalam membentuk keseimbangan emosional dan kebahagiaan.</p>\r\n<p>Bayangkan memulai hari dengan secangkir teh hangat atau beberapa menit meditasi, bukan langsung terpaku pada layar ponsel.</p>\r\n<p>mengganti camilan tinggi gula dengan buah segar yang penuh nutrisi. Bahkan, hanya dengan berjalan kaki selama 30 menit setiap hari.</p>\r\n<p class=\"continue-read-break\">bisa meningkatkan suasana hati dan mengurangi stres, Kuncinya adalah melakukan perubahan kecil secara konsisten.</p>\r\n<p>Tidak perlu langsung mengubah semuanya dalam sehari, cukup mulai dari kebiasaan sederhana yang bisa Anda nikmati.</p>\r\n<p class=\"\">Dengan begitu, kesehatan mental Anda akan terjaga, dan Anda bisa menjalani hari dengan lebih bahagia dan penuh energi.</p>\r\n<p>Berikut adalah 13 kebiasaan sederhana yang bisa Anda coba:</p>\r\n<p><strong>1. Awali Hari dengan Menulis Tantangan dan Kesempatan</strong></p>\r\n<p>Mulailah pagi Anda dengan menuliskan hal-hal yang ingin Anda hadapi dan peluang yang bisa dimanfaatkan. Ini membantu pikiran Anda lebih terorganisir dan siap menghadapi hari.</p>', '/uploads/thumb-1751031692108.jpeg', 6, 36, '2025-06-27 13:41:32', 'published'),
(74, 'KPK Tangkap Orang Dekat Gubernur Kasus Dugaan Korupsi PUPR Sumut, Bobby Nasution akan Dipanggil?', '<p data-t=\"{&quot;n&quot;:&quot;blueLinks&quot;,&quot;t&quot;:13,&quot;a&quot;:&quot;click&quot;,&quot;b&quot;:76}\">JAKARTA, KOMPAS.TV &ndash; PLT Deputi Penindakan dan Eksekusi KPK, Brigjen Asep Guntur mengatakan KPK akan panggil Gubernur Sumut, Bobby Nasution jika diperlukan terkait dugaan aliran uang kasus korupsi PUPR Sumut.</p>\r\n<p data-t=\"{&quot;n&quot;:&quot;blueLinks&quot;,&quot;t&quot;:13,&quot;a&quot;:&quot;click&quot;,&quot;b&quot;:76}\">Hal ini disampaikan dalam konferensi pers yang digelar di Gedung Merah Putih KPK, Jakarta pada Sabtu (28/6/2025).</p>\r\n<p data-t=\"{&quot;n&quot;:&quot;blueLinks&quot;,&quot;t&quot;:13,&quot;a&quot;:&quot;click&quot;,&quot;b&quot;:76}\">Asep mengatakan bahwa pihaknya masih mengikuti aliran uang korupsi yang didistribusikan.</p>\r\n<p data-t=\"{&quot;n&quot;:&quot;blueLinks&quot;,&quot;t&quot;:13,&quot;a&quot;:&quot;click&quot;,&quot;b&quot;:76}\">Produser: Theo Reza</p>\r\n<p data-t=\"{&quot;n&quot;:&quot;blueLinks&quot;,&quot;t&quot;:13,&quot;a&quot;:&quot;click&quot;,&quot;b&quot;:76}\">#breakingnews #kpk #ottkpk</p>', '/uploads/thumb-1751183835731.jpeg', 3, 36, '2025-06-27 13:43:31', 'published'),
(82, '7 Transformasi Fashion Deddy Corbuzier dari Nyentrik Hingga Formal', '<p>Terlihat sangat berbeda, tapi siapa sangka kalau sosok yang ada dalam foto tersebut adalah Deddy Corbuzier?</p>\r\n<p class=\"continue-read-break\">Foto yang sempat diposting dalam akun Instagram&nbsp;<em>@mastercorbuzier</em> ini memang bikin pangling ya. Dalam foto tersebut telihat sosok Deddy sewaktu masih SMA, sedang mengenakan kemeja putih, lengkap dengan aksesoris berupa jam tangan, dan rambut berponi.</p>', '/uploads/thumb-1751091307162.jpeg', 2, 36, '2025-06-28 06:08:28', 'published'),
(94, 'Polisi Penipu QRIS Palsu Dipecat Tidak Hormat, Sudah Menipu Puluhan Kali', '<p>Seorang pria diduga melakukan penipuan di sebuah toko helm yang berada di Jalan Raya Cileunyi, Kabupaten Bandung, pada Minggu (8/6/2025). Dia membeli helm dengan transaksi digital palsu.</p>\r\n<p>Kabid Humas Polda Jawa Barat, Kombes Pol Hendra Rochmawan mengatakan, pelaku diketahui merupakan Bharatu Cecep (CR). Pelaku telah ditahan oleh Propam Polda Jabar dan Provost Brimob. Dari hasil pemeriksaan diketahui CR sudah bukan anggota Polri.</p>\r\n<p>CR saat melakukan penipuan pembayaran QRIS palsu di sebuah toko helm itu statusnya sudah dipecat sebagai anggota Polri karena melakukan pelanggaran berulang kali.</p>\r\n<p class=\"continue-read-break\">Hendra mengatakan pelaku secara resmi telah dipecat berdasarkan putusan Komisi Kode Etik Polri Nomor: PUT/63/XII/2024 dan vonis dijatuhkan dalam sidang yang digelar pada Selasa, 3 Desember 2024, di Ruang Sidang Bid Propam Polda Jabar.</p>\r\n<p>&ldquo;Keputusan ini diambil setelah Cecep (CR) dinyatakan melakukan pelanggaran berat terhadap kode etik profesi Polri,&rdquo; tutur Hendra dalam keterangannya, Senin (30/5).</p>\r\n<p><strong>Menipu Lebih Dari Sekali</strong></p>\r\n<p>Hendra mengatakan, dalam pemeriksaan, CR juga terbukti melakukan penipuan uang senilai Rp 120 juta terhadap korban bernama Santi Cahyanti, dengan janji akan menyelesaikan kasus hukum di Reserse Polda Jabar. Ia hanya mengembalikan sebagian uang senilai Rp 38 juta.</p>\r\n<p class=\"\">Selain itu, ia juga menipu korban lain bernama Gautama sebesar Rp 243 juta dengan menjanjikan anaknya lulus menjadi anggota Polri atau ASN Polri. Dari jumlah tersebut, baru Rp 15 juta yang dikembalikan.</p>', '/uploads/thumb-1751266848185.jpeg', 2, 36, '2025-06-30 07:00:48', 'draft'),
(95, 'Olla Ramlan Akhirnya Klarifikasi Usai Diisukan Pacaran dengan Teuku Ryan', '<p><strong>Grid.ID -</strong>&nbsp;<strong>Olla Ramlan akhirnya angkat bicara setelah dikabarkan tengah menjalin hubungan asmara dengan Teuku Ryan, mantan suami Ria Ricis. Benarkah keduanya berpacaran?</strong></p>\r\n<p>Artis Olla Ramlan akhirnya angkat bicara usai isu yang menyebut dirinya tengah menjalin hubungan asmara dengan mantan suami YouTuber Ria Ricis. Kabar tersebut beredar setelah Teuku Ryan membagikan potret kebersamaan mereka.</p>\r\n<p>Dalam unggahan Teuku Ryan yang terdiri dari tiga slide, mereka tampak berpose dengan beberapa rekannya. Namun dalam unggahan lain, terlihat foto Teuku Ryan dan Olla Ramlan. Olla Ramlan tampak menyandarkan tangannya pada bahu Teuku Ryan.</p>\r\n<p class=\"continue-read-break\">Teuku Ryan terlihat mengenakan kemeja lengan panjang berwarna putih. Sementara itu, Olla Ramlan tampil cantik dengan dress berwarna hitam tanpa lengan.</p>\r\n<p>\"<em>Congrats bro, semoga kali ini mantap</em>,” tulis komentar Syamsir Alam dikutip Grid.ID, Senin (30/6/2025).</p>\r\n<p>\"<em>Bahagia selalu bro</em>,\" tulis akun @dr.dirgantarawicaksono.</p>', '/uploads/thumb-1751293250251.jpeg', 4, 36, '2025-06-30 14:20:50', 'published');

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
(220, 82, NULL, 'internal', 6, '2025-06-28 06:15:34', 1, NULL, 'Desktop', 'Referral'),
(221, NULL, NULL, 'internal', 6, '2025-06-28 06:16:26', NULL, NULL, 'Desktop', 'Referral'),
(222, 74, NULL, 'internal', 3, '2025-06-28 07:40:14', 23, NULL, 'Mobile', 'Direct'),
(223, NULL, NULL, 'internal', 6, '2025-06-28 07:48:00', NULL, NULL, 'Desktop', 'Referral'),
(224, NULL, NULL, 'internal', 6, '2025-06-28 07:48:11', NULL, NULL, 'Desktop', 'Referral'),
(225, NULL, NULL, 'internal', 6, '2025-06-28 07:57:38', NULL, NULL, 'Desktop', 'Referral'),
(226, NULL, NULL, 'internal', 6, '2025-06-28 07:58:01', NULL, NULL, 'Desktop', 'Referral'),
(227, NULL, NULL, 'internal', 6, '2025-06-28 08:00:31', NULL, NULL, 'Desktop', 'Referral'),
(228, NULL, NULL, 'internal', 6, '2025-06-28 08:00:43', NULL, NULL, 'Desktop', 'Referral'),
(229, NULL, NULL, 'internal', 6, '2025-06-28 08:01:00', NULL, NULL, 'Desktop', 'Referral'),
(230, NULL, NULL, 'internal', 6, '2025-06-28 08:17:01', NULL, NULL, 'Desktop', 'Referral'),
(231, NULL, NULL, 'internal', 6, '2025-06-28 08:17:08', 12, NULL, 'Desktop', 'Referral'),
(232, 72, NULL, 'internal', 1, '2025-06-28 08:35:20', 54, NULL, 'Desktop', 'Direct'),
(233, NULL, 'https://variety.com/2025/music/news/diddy-trial-defense-closing-arguments-swinger-1236442744/', 'external', 4, '2025-06-29 02:29:17', 6, 'Diddy Trial Reaches Explosive Conclusion as Defense Asks Jury to ‘Summon That Courage’ to ‘Acquit Sean Combs’ - Variety', 'Desktop', 'Direct'),
(234, NULL, 'https://www.axios.com/2025/06/27/trump-powell-federal-reserve-rates', 'external', 3, '2025-06-29 03:00:10', 1, 'Trump says he\'ll expect next Fed chair to cut rates - Axios', 'Desktop', 'Direct'),
(235, NULL, 'https://www.ign.com/articles/the-nintendo-summer-sale-has-rare-discounts-on-mario-switch-games-today', 'external', 1, '2025-06-29 03:00:43', 129, 'The Nintendo Summer Sale Has Rare Discounts on Mario Switch Games Today - IGN', 'Desktop', 'Direct'),
(236, 82, NULL, 'internal', 2, '2025-06-29 03:02:57', 2, NULL, 'Desktop', 'Direct'),
(237, NULL, NULL, 'internal', 2, '2025-06-29 03:03:02', 3, NULL, 'Desktop', 'Direct'),
(238, 68, NULL, 'internal', 4, '2025-06-29 03:05:26', NULL, NULL, 'Desktop', 'Direct'),
(239, 68, NULL, 'internal', 4, '2025-06-29 03:08:04', 2, NULL, 'Desktop', 'Direct'),
(240, 68, NULL, 'internal', 4, '2025-06-29 03:08:27', 42, NULL, 'Desktop', 'Direct'),
(241, 68, NULL, 'internal', 4, '2025-06-29 03:09:19', 3482, NULL, 'Desktop', 'Direct'),
(242, NULL, 'https://www.ign.com/articles/the-nintendo-summer-sale-has-rare-discounts-on-mario-switch-games-today', 'external', 1, '2025-06-29 04:27:38', 8, 'The Nintendo Summer Sale Has Rare Discounts on Mario Switch Games Today - IGN', 'Desktop', 'Direct'),
(243, NULL, 'https://www.ign.com/articles/the-nintendo-summer-sale-has-rare-discounts-on-mario-switch-games-today', 'external', 1, '2025-06-29 04:27:56', 9, 'The Nintendo Summer Sale Has Rare Discounts on Mario Switch Games Today - IGN', 'Desktop', 'Direct'),
(244, NULL, 'https://www.ign.com/articles/the-nintendo-summer-sale-has-rare-discounts-on-mario-switch-games-today', 'external', 1, '2025-06-29 04:49:30', 21, 'The Nintendo Summer Sale Has Rare Discounts on Mario Switch Games Today - IGN', 'Mobile', 'Direct'),
(245, NULL, 'https://www.tomsguide.com/news/live/squid-game-season-3-live', 'external', 4, '2025-06-29 14:20:40', 4, '\'Squid Game\' season 3 LIVE — ending explained, who dies, surprise cameos, and what\'s next - Tom\'s Guide', 'Desktop', 'Direct'),
(246, NULL, 'https://www.nbcsports.com/nfl/profootballtalk/rumor-mill/news/justin-tucker-hopes-to-thread-needle-between-claiming-innocence-accepting-responsibility', 'external', 5, '2025-06-29 15:28:46', 2, 'Justin Tucker hopes to thread needle between claiming innocence, accepting responsibility - NBC Sports', 'Mobile', 'Direct'),
(247, NULL, 'https://pokemongohub.net/post/guide/zamazenta-crowned-shield-raid-guide/', 'external', 1, '2025-06-29 15:30:16', 3, 'Crowned Shield Zamazenta Raid Guide - Pokémon GO Hub', 'Desktop', 'Direct'),
(248, NULL, 'https://www.nintendolife.com/features/22-games-with-secret-performance-bumps-you-should-revisit-on-switch-2', 'external', 1, '2025-06-29 16:11:44', 8, 'Feature: 22 Games With \'Secret\' Performance Bumps You Should Revisit On Switch 2 - Nintendo Life', 'Mobile', 'Direct'),
(249, 68, NULL, 'internal', 4, '2025-06-29 16:30:31', 54, NULL, 'Desktop', 'Referral'),
(250, 68, NULL, 'internal', 4, '2025-06-29 16:31:32', 310, NULL, 'Desktop', 'Referral'),
(251, 68, NULL, 'internal', 4, '2025-06-29 16:36:42', 2, NULL, 'Desktop', 'Referral'),
(252, 68, NULL, 'internal', 4, '2025-06-29 16:36:53', 53, NULL, 'Desktop', 'Referral'),
(253, 68, NULL, 'internal', 4, '2025-06-29 16:38:45', 101, NULL, 'Desktop', 'Referral'),
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
(279, 68, NULL, 'internal', 4, '2025-06-29 17:30:04', 56, NULL, 'Desktop', 'Direct'),
(280, NULL, 'https://dailygalaxy.com/2025/06/scientists-discovered-first-pieces-mercury/', 'external', 2, '2025-06-29 17:31:09', 105, 'Scientists May Have Just Discovered the First Ever Pieces of Mercury - The Daily Galaxy', 'Desktop', 'Direct'),
(281, NULL, 'https://www.space.com/space-exploration/satellites/satellites-keep-breaking-up-in-space-insurance-wont-cover-them', 'external', 2, '2025-06-29 17:32:58', 2, 'Satellites keep breaking up in space, insurance won\'t cover them. - Space', 'Desktop', 'Direct'),
(282, 68, NULL, 'internal', 4, '2025-06-29 17:33:09', 1102, NULL, 'Desktop', 'Direct'),
(283, NULL, 'https://www.wltx.com/article/tech/science/meteor-fireball-south-carolina-georgia-fragment-roof-impact/101-76438d1c-706c-4c57-9a15-373f89a4ee80', 'external', 2, '2025-06-29 17:40:56', 151, 'What we know about the fireball seen across several states Thursday - WLTX', 'Desktop', 'Referral'),
(284, NULL, 'https://www.space.com/space-exploration/satellites/satellites-keep-breaking-up-in-space-insurance-wont-cover-them', 'external', 2, '2025-06-29 17:43:31', 89, 'Satellites keep breaking up in space, insurance won\'t cover them. - Space', 'Desktop', 'Referral'),
(285, 74, NULL, 'internal', 3, '2025-06-29 17:45:07', 85, NULL, 'Desktop', 'Referral'),
(286, 74, NULL, 'internal', 3, '2025-06-29 17:46:40', 36, NULL, 'Desktop', 'Referral'),
(287, 69, NULL, 'internal', 6, '2025-06-29 17:47:25', 44, NULL, 'Desktop', 'Referral'),
(288, 70, NULL, 'internal', 6, '2025-06-29 17:48:16', 106, NULL, 'Desktop', 'Referral'),
(289, 70, NULL, 'internal', 6, '2025-06-29 17:50:09', 81, NULL, 'Desktop', 'Referral'),
(290, 70, NULL, 'internal', 6, '2025-06-29 17:51:31', 1, NULL, 'Desktop', 'Referral'),
(291, 68, NULL, 'internal', 4, '2025-06-29 17:51:32', NULL, NULL, 'Mobile', 'Direct'),
(292, 74, NULL, 'internal', 3, '2025-06-29 17:52:37', 126, NULL, 'Desktop', 'Referral'),
(293, 68, NULL, 'internal', 4, '2025-06-29 17:56:38', 10, NULL, 'Desktop', 'Referral'),
(294, NULL, 'http://www.thecut.com/article/who-will-replace-anna-wintour-at-vogue.html', 'external', 4, '2025-06-29 17:57:01', 7, 'Who Will Replace Anna Wintour at ‘Vogue’? - The Cut', 'Mobile', 'Referral'),
(295, 70, NULL, 'internal', 6, '2025-06-29 17:57:26', 5, NULL, 'Desktop', 'Referral'),
(296, NULL, 'https://www.tomsguide.com/news/live/squid-game-season-3-live', 'external', 4, '2025-06-29 17:59:39', 8, '\'Squid Game\' season 3 LIVE — ending explained, who dies, surprise cameos, and what\'s next - Tom\'s Guide', 'Desktop', 'Referral'),
(297, 68, NULL, 'internal', 4, '2025-06-29 18:00:29', 2, NULL, 'Desktop', 'Referral'),
(298, NULL, 'https://www.tomsguide.com/news/live/squid-game-season-3-live', 'external', 4, '2025-06-29 18:34:12', 107, '\'Squid Game\' season 3 LIVE — ending explained, who dies, surprise cameos, and what\'s next - Tom\'s Guide', 'Desktop', 'Direct'),
(299, NULL, 'https://sanjosehockeynow.com/san-jose-sharks-wang-mckinney-mutryn-2025-draft-scouts/', 'external', 5, '2025-06-30 05:25:38', 341, 'NHL Scouts Talk Day 2 of Sharks’ 2025 Draft - San Jose Hockey Now', 'Desktop', 'Direct'),
(300, NULL, 'https://apnews.com/article/jake-paul-chavez-fight-91423402e1e4f69858044a650932f972', 'external', 5, '2025-06-30 05:42:26', 2, 'Jake Paul beats former middleweight champ Julio César Chávez Jr. by unanimous decision - AP News', 'Desktop', 'Direct'),
(301, NULL, 'https://apnews.com/article/robots-foootball-china-ai-d49a4308930f49537b17f463afef5043', 'external', 5, '2025-06-30 05:42:34', 36, 'China’s humanoid robots generate more soccer excitement than their human counterparts - AP News', 'Desktop', 'Direct'),
(302, 69, NULL, 'internal', 6, '2025-06-30 05:43:18', 219, NULL, 'Desktop', 'Direct'),
(303, NULL, 'https://apnews.com/article/jake-paul-chavez-fight-91423402e1e4f69858044a650932f972', 'external', 5, '2025-06-30 06:04:02', 43, 'Jake Paul beats former middleweight champ Julio César Chávez Jr. by unanimous decision - AP News', 'Desktop', 'Direct'),
(304, 68, NULL, 'internal', 4, '2025-06-30 06:04:54', NULL, NULL, 'Desktop', 'Direct'),
(305, 68, NULL, 'internal', 4, '2025-06-30 07:58:16', 1725, NULL, 'Desktop', 'Direct'),
(306, NULL, 'https://mynintendonews.com/2025/06/28/sonic-team-boss-says-remakes-of-the-sonic-adventure-games-not-happening/', 'external', 1, '2025-06-30 09:54:09', 6, 'Sonic Team boss says remakes of the Sonic Adventure games not happening - My Nintendo News', 'Desktop', 'Direct'),
(307, 69, NULL, 'internal', 6, '2025-06-30 09:54:22', 127, NULL, 'Desktop', 'Direct'),
(308, 69, NULL, 'internal', 6, '2025-06-30 09:56:30', 1538, NULL, 'Mobile', 'Direct'),
(309, 68, NULL, 'internal', 4, '2025-06-30 10:18:14', 138, NULL, 'Desktop', 'Direct'),
(310, NULL, 'https://variety.com/2025/tv/news/jake-paul-beats-julio-cesar-chavez-jr-1236441992/', 'external', 5, '2025-06-30 10:22:13', 102, 'Jake Paul Beats Julio César Chávez Jr. by Unanimous Decision in 10-Round Fight, Tells Doubters to ‘Shut the F— Up’ After Win - Variety', 'Desktop', 'Direct'),
(311, 68, NULL, 'internal', 4, '2025-06-30 10:24:02', 553, NULL, 'Desktop', 'Direct'),
(312, 68, NULL, 'internal', 4, '2025-06-30 10:25:32', 99, NULL, 'Desktop', 'Direct'),
(313, 94, NULL, 'internal', 2, '2025-06-30 10:27:18', 63, NULL, 'Mobile', 'Direct'),
(314, NULL, 'https://www.npr.org/2025/06/29/nx-s1-5450122/irish-rap-group-kneecap-glastonbury', 'external', 4, '2025-06-30 10:28:27', 5, 'Northern Irish rap group Kneecap plays Glastonbury despite controversy - NPR', 'Mobile', 'Direct'),
(315, NULL, 'https://www.npr.org/2025/06/29/nx-s1-5450122/irish-rap-group-kneecap-glastonbury', 'external', 4, '2025-06-30 11:01:58', 9, 'Northern Irish rap group Kneecap plays Glastonbury despite controversy - NPR', 'Desktop', 'Direct'),
(316, 70, NULL, 'internal', 6, '2025-06-30 11:02:14', 120, NULL, 'Desktop', 'Direct'),
(317, NULL, 'https://www.bbc.com/sport/live/c8e4dwz21knt', 'external', 5, '2025-06-30 11:04:26', 15, 'F1 LIVE: Austrian Grand Prix 2025: UK start time, grid, radio & updates from Red Bull Ring - BBC', 'Mobile', 'Direct'),
(318, NULL, 'https://www.bbc.com/sport/live/c8e4dwz21knt', 'external', 5, '2025-06-30 11:04:45', 51, 'F1 LIVE: Austrian Grand Prix 2025: UK start time, grid, radio & updates from Red Bull Ring - BBC', 'Desktop', 'Direct'),
(319, 70, NULL, 'internal', 6, '2025-06-30 11:05:44', 2410, NULL, 'Desktop', 'Direct'),
(320, NULL, 'https://www.huffpost.com/entry/gay-dad-marriage-mom-death_n_68613131e4b08e0b4a73f2b9', 'external', 4, '2025-06-30 14:12:25', 5, 'My Dad Was Gay — But Married To My Mom For 64 Years. As She Died, I Overheard Something I Can\'t Forget. - HuffPost', 'Desktop', 'Direct'),
(321, NULL, 'https://www.cbssports.com/boxing/news/jake-paul-vs-julio-cesar-chavez-jr-results-highlights-problem-child-cruises-to-easy-decision-win/live/', 'external', 5, '2025-06-30 14:12:44', NULL, 'Jake Paul vs. Julio Cesar Chavez Jr. results, highlights: \'Problem Child\' cruises to easy decision win - CBS Sports', 'Desktop', 'Direct');

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
(36, 'admin', 'halo', 'adminputh', 'adminputra@gmail.com', '$2b$10$.pd6Y/CuWRvniIZc7h/D6ODCoNymJ6JhCjTwYL4vtNYJv/Vqxw9PW', 'admin', '2025-04-17 03:52:55', NULL, '2025-06-30 15:46:11'),
(98, 'putra ardaa', 'Putra', 'ardiansyah', 'putraardi2@gmail.com', '$2b$10$Y9lsSQE9QUCtmKnVK9vVP.XOfG31aN6XE4XPTEr.Yp2UF6JNxFXwa', 'user', '2025-06-27 15:21:51', NULL, NULL),
(101, 'putra arrdd', 'Putra ardi', 'Ardiansyah', 'putraardi3@gmail.com', '$2b$10$CXiKoQGTG9gOhAVM1b4vYucTKCQ3zG7.TDZPTOXnCWRrLFolsemc2', 'user', '2025-06-28 06:19:46', NULL, NULL),
(102, 'putra', 'Putra ardi', 'Ardiansyah', 'putraardi4@gmail.com', '$2b$10$jBl.liYRkdMWLLBNXphaUuDunaQBa76WqrdsWqELIu8K.gdcskw6a', 'user', '2025-06-28 06:36:49', NULL, NULL),
(104, 'tessss', 'Putra ardi', 'Ardiansyah', 'putraardi5@gmail.com', '$2b$10$R7u1E0P9QU2TOoqLETBjZ.HTsGXTyhX18jUz6X6.KT0fQqB7J4edO', 'user', '2025-06-29 08:34:54', NULL, NULL),
(108, 'putra ardians', '', '', 'putraardi12@gmail.com', '$2b$10$cQGR8l9t1ZtgHs4EpM539ulhnfhErFBdr/QBtCOxoD6qyHlqHqsLK', 'user', '2025-06-29 13:27:48', NULL, NULL),
(109, 'putraardddd', 'Putra ardi', 'Ardiansyah', 'putraardi6@gmail.com', '$2b$10$QnnYe8U6Ls/IDQWZ23dDbezqLBiV1JJivaTE724CXtmx87PVvqQyu', 'user', '2025-06-29 13:40:44', NULL, NULL),
(111, 'putra ardi2', 'testing 123', 'tesss', 'putraardi8@gmail.com', '$2b$10$yIIHNts/qMyAH9jjwQjGhOQoS5TigT/JWx4EkRuIrcd3cphbWOGcy', 'user', '2025-06-30 04:38:51', NULL, NULL),
(113, 'contoh', '', '', 'contoh123@gmail.com', '$2b$10$CDVxX2yc8/e.WmN3A3c8zey1P.cNHyOyu9CIskzzN.bXIkCF.f6.W', 'user', '2025-06-30 06:01:18', NULL, NULL),
(114, 'contoh12', '', '', 'contoh12@gmail.com', '$2b$10$NPrKp7fAGfiJdcyp28hnX.V5deH84fcy/i0/tiKl2kHw7MX69lmp.', 'user', '2025-06-30 08:27:41', NULL, NULL);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=174;

--
-- AUTO_INCREMENT for table `news`
--
ALTER TABLE `news`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=96;

--
-- AUTO_INCREMENT for table `news_views`
--
ALTER TABLE `news_views`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=322;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=115;

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
