/**
 * nutritionData.js
 * Menu makan 7 hari (Senin-Minggu) × 2 tier (budget/standard) × 4 waktu makan
 * Basis data pangan lokal Indonesia untuk HealthEngine V2
 */

export const WEEKLY_MEALS = {
  // ==================== SENIN ====================
  Senin: {
    budget: {
      breakfast: {
        id: 'sen-bf-b', name: 'Omelet Telur Tempe Sayur + Nasi', shortDesc: 'Protein ganda murah meriah dan padat gizi.',
        ingredients: '1 butir telur, 50g tempe cincang, daun bayam, 1 piring nasi putih (150g)',
        calories: 420, protein: 18, carbs: 58, fat: 12, priceEstimateIdr: 6500, prepTime: '10 menit',
        cookTip: 'Kocok telur dengan tempe cincang. Gunakan teflon antilengket dengan sedikit minyak.', benefits: 'Kolin dari telur untuk fokus otak, serat tempe untuk kenyang awet.', emoji: '🍳',
      },
      lunch: {
        id: 'sen-lu-b', name: 'Nasi + Tahu Tempe Bacem + Sayur Bening', shortDesc: 'Paket serat & nabati murah dari pasar tradisional.',
        ingredients: '1 piring nasi (150g), 1 potong tahu, 1 potong tempe bacem, sayur bening bayam jagung',
        calories: 480, protein: 22, carbs: 76, fat: 9, priceEstimateIdr: 8000, prepTime: '20 menit',
        cookTip: 'Kukus tahu tempe tanpa minyak goreng agar kalori lebih rendah.', benefits: 'Bayam kaya magnesium dan zat besi untuk mencegah kantuk siang.', emoji: '🥬',
      },
      snack: {
        id: 'sen-sn-b', name: 'Pisang Kepok Kukus (2 Buah)', shortDesc: 'Camilan manis alami penahan lapar sore hari.',
        ingredients: '2 buah pisang kepok matang dikukus',
        calories: 180, protein: 2, carbs: 44, fat: 1, priceEstimateIdr: 3000, prepTime: '10 menit',
        cookTip: 'Kukus bersama kulit 10-12 menit sampai merekah.', benefits: 'Kaya kalium untuk mencegah kram otot.', emoji: '🍌',
      },
      dinner: {
        id: 'sen-dn-b', name: 'Sup Tahu Telur Puyuh + Wortel Buncis', shortDesc: 'Menu malam hangat ringan kalori.',
        ingredients: '150g tahu sutra, 4 butir telur puyuh, wortel, buncis, kuah bening bawang putih',
        calories: 340, protein: 21, carbs: 24, fat: 14, priceEstimateIdr: 7500, prepTime: '15 menit',
        cookTip: 'Masukkan wortel dulu hingga empuk baru tahu dan telur puyuh.', benefits: 'Rendah karbohidrat, cocok untuk makan malam ringan sebelum tidur.', emoji: '🍲',
      },
    },
    standard: {
      breakfast: {
        id: 'sen-bf-s', name: 'Roti Gandum Alpukat + Telur Mata Sapi', shortDesc: 'Sarapan lemak sehat dan serat gandum utuh.',
        ingredients: '2 lembar roti gandum, 1 telur ceplok, 50g alpukat lumat, biji chia',
        calories: 440, protein: 19, carbs: 42, fat: 22, priceEstimateIdr: 16000, prepTime: '8 menit',
        cookTip: 'Oleskan alpukat dengan perasan jeruk nipis dan lada hitam.', benefits: 'Lemak tak jenuh alpukat untuk kesehatan pembuluh darah.', emoji: '🥑',
      },
      lunch: {
        id: 'sen-lu-s', name: 'Nasi Merah + Ayam Bakar Madu + Tumis Buncis', shortDesc: 'Karbohidrat serat tinggi dan protein rendah lemak.',
        ingredients: '140g nasi merah, 130g dada ayam bumbu madu ketumbar, buncis tumis',
        calories: 530, protein: 42, carbs: 62, fat: 11, priceEstimateIdr: 18000, prepTime: '25 menit',
        cookTip: 'Marinasi ayam 15 menit, panggang teflon 4-5 menit per sisi.', benefits: 'Nasi merah memberi energi stabil tanpa lonjakan gula darah.', emoji: '🍗',
      },
      snack: {
        id: 'sen-sn-s', name: 'Edamame Rebus + Garam Laut', shortDesc: 'Kedelai segar kaya protein nabati.',
        ingredients: '120g edamame polong, garam secukupnya',
        calories: 145, protein: 14, carbs: 11, fat: 6, priceEstimateIdr: 8000, prepTime: '6 menit',
        cookTip: 'Rebus 5 menit dalam air bergaram agar tetap hijau cerah.', benefits: 'Isoflavon edamame sebagai antioksidan penangkal radikal bebas.', emoji: '🫛',
      },
      dinner: {
        id: 'sen-dn-s', name: 'Capcay Seafood (Udang & Cumi) + Nasi Ringan', shortDesc: 'Aneka sayur dan protein laut segar.',
        ingredients: '100g nasi, 60g udang, 40g cumi, brokoli, wortel, sawi putih, saus tiram',
        calories: 450, protein: 30, carbs: 54, fat: 10, priceEstimateIdr: 19000, prepTime: '15 menit',
        cookTip: 'Sayur keras masuk dulu, seafood terakhir cukup 2-3 menit.', benefits: 'Kaya zinc dan selenium untuk imunitas tubuh.', emoji: '🍤',
      },
    },
  },

  // ==================== SELASA ====================
  Selasa: {
    budget: {
      breakfast: {
        id: 'sel-bf-b', name: 'Bubur Havermut Pisang + Telur Rebus', shortDesc: 'Karbohidrat kompleks cepat saji.',
        ingredients: '40g oatmeal, 1 pisang potong, 1 telur rebus',
        calories: 360, protein: 14, carbs: 56, fat: 8, priceEstimateIdr: 5500, prepTime: '5 menit',
        cookTip: 'Seduh oat dengan air panas, tambah pisang tanpa gula tambahan.', benefits: 'Beta-glukan oat menurunkan kolesterol dan stabilkan gula darah.', emoji: '🥣',
      },
      lunch: {
        id: 'sel-lu-b', name: 'Nasi + Ikan Kembung Goreng + Sambal Dabu-Dabu', shortDesc: 'Omega-3 lokal setara salmon.',
        ingredients: '150g nasi, 1 ekor ikan kembung (90g), sambal dabu-dabu segar, lalapan',
        calories: 520, protein: 34, carbs: 58, fat: 14, priceEstimateIdr: 11000, prepTime: '15 menit',
        cookTip: 'Lumuri ikan dengan jeruk nipis dan kunyit agar tidak amis.', benefits: 'EPA & DHA ikan kembung menjaga fungsi kognitif dan anti-inflamasi.', emoji: '🐟',
      },
      snack: {
        id: 'sel-sn-b', name: 'Telur Rebus Lada Hitam (2 Butir)', shortDesc: 'Snack padat protein murni.',
        ingredients: '2 butir telur rebus, garam dan lada hitam',
        calories: 155, protein: 13, carbs: 1, fat: 10, priceEstimateIdr: 4000, prepTime: '7 menit',
        cookTip: 'Rebus tepat 6.5 menit untuk kuning telur yang lumer.', benefits: 'Leusin tinggi untuk memicu sintesis protein otot.', emoji: '🥚',
      },
      dinner: {
        id: 'sel-dn-b', name: 'Mie Rebus Sayur + Telur + Sawi Hijau', shortDesc: 'Mie instan upgrade sehat ala anak kos.',
        ingredients: '1 bungkus mie instan, 1 telur, sawi hijau, wortel, bumbu setengah saja',
        calories: 410, protein: 15, carbs: 62, fat: 12, priceEstimateIdr: 5500, prepTime: '10 menit',
        cookTip: 'Gunakan hanya setengah bumbu. Tambah banyak sayur dan telur.', benefits: 'Telur dan sayur menambah nilai gizi mie instan secara signifikan.', emoji: '🍜',
      },
    },
    standard: {
      breakfast: {
        id: 'sel-bf-s', name: 'Bubur Ayam Jakarta Komplit', shortDesc: 'Klasik nusantara dengan suwir dada ayam.',
        ingredients: '200g bubur beras kuah kaldu, 70g suwiran dada ayam, kedelai goreng, seledri',
        calories: 410, protein: 26, carbs: 60, fat: 7, priceEstimateIdr: 14000, prepTime: 'Beli siap saji',
        cookTip: 'Skip kerupuk dan bawang goreng berlebih untuk kurangi lemak jenuh.', benefits: 'Mudah dicerna dan tinggi protein dari suwiran dada ayam.', emoji: '🍲',
      },
      lunch: {
        id: 'sel-lu-s', name: 'Gado-Gado + Lontong + 2 Telur Rebus', shortDesc: 'Salad Indonesia kaya fitonutrien.',
        ingredients: 'Sayuran kukus, lontong, 2 telur rebus, bumbu kacang segar',
        calories: 570, protein: 28, carbs: 64, fat: 21, priceEstimateIdr: 16000, prepTime: 'Siap saji',
        cookTip: 'Pilih bumbu kacang tidak terlalu berminyak.', benefits: 'Spektrum antioksidan lengkap dari berbagai warna sayuran.', emoji: '🥗',
      },
      snack: {
        id: 'sel-sn-s', name: 'Yogurt Plain + Pepaya + Madu', shortDesc: 'Penyegar sore menyehatkan usus.',
        ingredients: '150ml greek yogurt, 100g pepaya potong, 1 sdt madu',
        calories: 165, protein: 9, carbs: 26, fat: 3, priceEstimateIdr: 11000, prepTime: '3 menit',
        cookTip: 'Gunakan yogurt plain tanpa perasa sintetis.', benefits: 'Probiotik untuk melancarkan pencernaan dan kesehatan usus.', emoji: '🍧',
      },
      dinner: {
        id: 'sel-dn-s', name: 'Soto Daging Sapi Bening + Nasi', shortDesc: 'Daging has empuk dalam kuah rempah segar.',
        ingredients: '120g nasi, 80g daging sapi has, tauge, seledri, jeruk nipis',
        calories: 490, protein: 33, carbs: 52, fat: 14, priceEstimateIdr: 22000, prepTime: '30 menit',
        cookTip: 'Pilih potongan tanpa gajih berlebih. Buang busa rebusan pertama.', benefits: 'Zat besi heme daging sapi cepat diserap untuk cegah anemia.', emoji: '🥩',
      },
    },
  },

  // ==================== RABU ====================
  Rabu: {
    budget: {
      breakfast: {
        id: 'rab-bf-b', name: 'Nasi Goreng Telur Sederhana', shortDesc: 'Sarapan cepat dari sisa nasi semalam.',
        ingredients: '150g nasi sisa, 1 telur, kecap manis, bawang merah, cabai',
        calories: 430, protein: 14, carbs: 64, fat: 13, priceEstimateIdr: 5000, prepTime: '8 menit',
        cookTip: 'Gunakan nasi sisa dingin agar butiran terpisah dan tidak lembek.', benefits: 'Karbohidrat cepat untuk energi awal hari.', emoji: '🍛',
      },
      lunch: {
        id: 'rab-lu-b', name: 'Nasi + Pecel Sayur + Tempe Goreng', shortDesc: 'Bumbu kacang khas Jawa dengan sayur segar.',
        ingredients: '150g nasi, kangkung, tauge, kacang panjang rebus, 1 potong tempe goreng, bumbu pecel',
        calories: 490, protein: 19, carbs: 72, fat: 14, priceEstimateIdr: 8000, prepTime: '15 menit',
        cookTip: 'Rebus sayuran sebentar saja agar vitamin tidak hilang.', benefits: 'Bumbu kacang kaya mineral dan vitamin E dari kacang tanah.', emoji: '🥜',
      },
      snack: {
        id: 'rab-sn-b', name: 'Singkong Rebus + Gula Merah Cair', shortDesc: 'Camilan tradisional sederhana dan mengenyangkan.',
        ingredients: '150g singkong kukus, 1 sdm gula merah cair',
        calories: 195, protein: 2, carbs: 48, fat: 0, priceEstimateIdr: 3000, prepTime: '15 menit',
        cookTip: 'Kukus singkong hingga empuk, siram gula merah cair.', benefits: 'Sumber energi karbohidrat kompleks dengan indeks glikemik moderat.', emoji: '🍠',
      },
      dinner: {
        id: 'rab-dn-b', name: 'Nasi + Sayur Asem Jawa + Tahu Goreng', shortDesc: 'Kuah asem segar khas nusantara.',
        ingredients: '150g nasi, sayur asem (labu siam, kacang panjang, jagung, melinjo), 2 potong tahu goreng',
        calories: 420, protein: 16, carbs: 68, fat: 10, priceEstimateIdr: 7000, prepTime: '25 menit',
        cookTip: 'Masukkan asam jawa di akhir masak agar rasa segar tidak hilang.', benefits: 'Labu siam rendah kalori dan kaya vitamin C.', emoji: '🥘',
      },
    },
    standard: {
      breakfast: {
        id: 'rab-bf-s', name: 'Nasi Uduk + Ayam Goreng + Sambal Kacang', shortDesc: 'Nasi santan gurih khas Betawi.',
        ingredients: '150g nasi uduk, 1 potong ayam goreng paha bawah, sambal kacang, mentimun',
        calories: 520, protein: 28, carbs: 56, fat: 20, priceEstimateIdr: 15000, prepTime: 'Beli siap saji',
        cookTip: 'Buang kulit ayam jika ingin mengurangi lemak jenuh.', benefits: 'Protein lengkap dari ayam untuk energi pagi.', emoji: '🍗',
      },
      lunch: {
        id: 'rab-lu-s', name: 'Nasi + Rendang Daging Sapi + Daun Singkong', shortDesc: 'Rendang kering kaya bumbu rempah.',
        ingredients: '140g nasi, 80g rendang daging sapi, daun singkong rebus, sambal hijau',
        calories: 560, protein: 35, carbs: 58, fat: 20, priceEstimateIdr: 24000, prepTime: 'Beli / 2 jam',
        cookTip: 'Pilih rendang kering tanpa terlalu banyak minyak sawit.', benefits: 'Rempah rendang (kunyit, lengkuas) mengandung kurkumin anti-inflamasi.', emoji: '🥘',
      },
      snack: {
        id: 'rab-sn-s', name: 'Smoothie Pisang + Susu Rendah Lemak', shortDesc: 'Minuman kental bernutrisi tinggi.',
        ingredients: '1 pisang, 200ml susu rendah lemak, 1 sdm madu, es batu',
        calories: 185, protein: 8, carbs: 34, fat: 3, priceEstimateIdr: 7000, prepTime: '3 menit',
        cookTip: 'Blender semua bahan hingga halus. Tambah oat 1 sdm untuk serat.', benefits: 'Kalsium susu untuk tulang kuat dan kalium pisang untuk otot.', emoji: '🥤',
      },
      dinner: {
        id: 'rab-dn-s', name: 'Pepes Ikan Mas + Nasi Putih Ringan', shortDesc: 'Ikan kukus dalam balutan daun pisang.',
        ingredients: '120g nasi, 100g ikan mas, bumbu pepes (kemangi, cabai, tomat), daun pisang',
        calories: 440, protein: 32, carbs: 50, fat: 11, priceEstimateIdr: 17000, prepTime: '30 menit',
        cookTip: 'Bungkus rapat daun pisang agar bumbu meresap sempurna.', benefits: 'Memasak dengan daun pisang tanpa minyak menjaga kandungan nutrisi ikan.', emoji: '🐟',
      },
    },
  },

  // ==================== KAMIS ====================
  Kamis: {
    budget: {
      breakfast: {
        id: 'kam-bf-b', name: 'Lontong Sayur Labu + Telur', shortDesc: 'Lontong kuah santan tipis khas Jawa.',
        ingredients: '1 potong lontong (150g), sayur labu siam kuah santan encer, 1 telur rebus',
        calories: 400, protein: 16, carbs: 62, fat: 10, priceEstimateIdr: 7000, prepTime: 'Beli siap saji',
        cookTip: 'Pilih kuah santan yang encer, bukan santan kental.', benefits: 'Labu siam rendah kalori dan kaya serat larut.', emoji: '🥘',
      },
      lunch: {
        id: 'kam-lu-b', name: 'Nasi + Telur Balado + Sayur Kangkung', shortDesc: 'Telur bumbu merah pedas khas Padang.',
        ingredients: '150g nasi, 2 telur goreng balado, kangkung tumis bawang putih',
        calories: 510, protein: 20, carbs: 64, fat: 18, priceEstimateIdr: 9000, prepTime: '15 menit',
        cookTip: 'Goreng telur setengah matang, siram bumbu balado di atasnya.', benefits: 'Kangkung kaya vitamin A dan zat besi, baik untuk kesehatan mata.', emoji: '🌶️',
      },
      snack: {
        id: 'kam-sn-b', name: 'Jagung Rebus (1 Tongkol)', shortDesc: 'Camilan sore alami dari jagung manis.',
        ingredients: '1 tongkol jagung manis rebus, sedikit garam/margarin opsional',
        calories: 155, protein: 5, carbs: 34, fat: 2, priceEstimateIdr: 3500, prepTime: '15 menit',
        cookTip: 'Rebus jagung dengan sedikit gula pasir agar manis alami.', benefits: 'Serat tinggi dan antioksidan lutein untuk kesehatan mata.', emoji: '🌽',
      },
      dinner: {
        id: 'kam-dn-b', name: 'Bubur Kacang Hijau + Roti', shortDesc: 'Manis hangat bergizi tinggi untuk malam hari.',
        ingredients: '200ml bubur kacang hijau, 1 lembar roti tawar, sedikit santan/gula merah',
        calories: 350, protein: 12, carbs: 62, fat: 5, priceEstimateIdr: 5000, prepTime: '30 menit',
        cookTip: 'Masak kacang hijau dengan gula merah, skip santan untuk kalori lebih rendah.', benefits: 'Kacang hijau kaya asam folat dan zat besi untuk regenerasi sel.', emoji: '🫘',
      },
    },
    standard: {
      breakfast: {
        id: 'kam-bf-s', name: 'Pancake Oat + Madu + Buah Segar', shortDesc: 'Pancake sehat dari tepung oat tanpa gula tambahan.',
        ingredients: '50g tepung oat, 1 telur, 50ml susu, 1 sdm madu, stroberi/pisang potong',
        calories: 380, protein: 16, carbs: 54, fat: 10, priceEstimateIdr: 12000, prepTime: '12 menit',
        cookTip: 'Blend oat jadi tepung, campurkan semua bahan, masak di teflon.', benefits: 'Karbohidrat kompleks oat memberi energi stabil hingga siang.', emoji: '🥞',
      },
      lunch: {
        id: 'kam-lu-s', name: 'Nasi + Ikan Dori Panggang + Salad Segar', shortDesc: 'Protein ikan putih rendah lemak.',
        ingredients: '140g nasi, 120g fillet dori bumbu lemon pepper, salad sayur segar, dressing olive oil',
        calories: 480, protein: 35, carbs: 52, fat: 13, priceEstimateIdr: 20000, prepTime: '20 menit',
        cookTip: 'Panggang dori di teflon 3-4 menit per sisi dengan sedikit olive oil.', benefits: 'Ikan dori rendah lemak dan mudah dicerna, protein berkualitas tinggi.', emoji: '🐟',
      },
      snack: {
        id: 'kam-sn-s', name: 'Kacang Almond Panggang (30g) + Kurma (3 biji)', shortDesc: 'Lemak sehat dan gula alami.',
        ingredients: '30g kacang almond panggang, 3 biji kurma',
        calories: 190, protein: 6, carbs: 22, fat: 10, priceEstimateIdr: 10000, prepTime: '0 menit',
        cookTip: 'Pilih almond tanpa garam dan tanpa minyak tambahan.', benefits: 'Almond kaya vitamin E, kurma kaya kalium dan energi cepat.', emoji: '🥜',
      },
      dinner: {
        id: 'kam-dn-s', name: 'Sup Ayam Jahe + Nasi Putih', shortDesc: 'Sup hangat penambah imun tubuh.',
        ingredients: '120g nasi, 80g dada ayam suwir, jahe iris, wortel, seledri, kuah kaldu bening',
        calories: 420, protein: 30, carbs: 50, fat: 9, priceEstimateIdr: 15000, prepTime: '20 menit',
        cookTip: 'Jahe iris tipis agar rasa hangat meresap ke kuah.', benefits: 'Jahe mengandung gingerol anti-mual dan anti-inflamasi.', emoji: '🍲',
      },
    },
  },

  // ==================== JUMAT ====================
  Jumat: {
    budget: {
      breakfast: {
        id: 'jum-bf-b', name: 'Nasi Kuning + Telur Dadar + Mie Bihun', shortDesc: 'Sarapan khas tumpeng mini anak kos.',
        ingredients: '150g nasi kuning, 1 telur dadar, 50g mie bihun goreng, irisan mentimun',
        calories: 440, protein: 15, carbs: 66, fat: 13, priceEstimateIdr: 7000, prepTime: '15 menit',
        cookTip: 'Masak nasi dengan kunyit, daun salam, dan serai untuk aroma.', benefits: 'Kunyit mengandung kurkumin dengan efek anti-inflamasi.', emoji: '🍛',
      },
      lunch: {
        id: 'jum-lu-b', name: 'Nasi + Ayam Geprek Sambal + Lalapan', shortDesc: 'Ayam crispy geprek pedas favorit anak muda.',
        ingredients: '150g nasi, 1 potong dada ayam goreng geprek, sambal ulek, lalapan',
        calories: 550, protein: 30, carbs: 62, fat: 18, priceEstimateIdr: 12000, prepTime: 'Beli siap saji',
        cookTip: 'Makan dengan banyak lalapan segar untuk serat tambahan.', benefits: 'Capsaicin cabai meningkatkan metabolisme dan pembakaran kalori.', emoji: '🍗',
      },
      snack: {
        id: 'jum-sn-b', name: 'Ubi Jalar Rebus (150g)', shortDesc: 'Karbohidrat bersih rendah glikemik.',
        ingredients: '150g ubi jalar oranye kukus',
        calories: 135, protein: 2, carbs: 32, fat: 0, priceEstimateIdr: 3000, prepTime: '15 menit',
        cookTip: 'Kukus ubi sampai empuk, nikmati tanpa tambahan apapun.', benefits: 'Ubi jalar oranye kaya beta-karoten (vitamin A) untuk imunitas.', emoji: '🍠',
      },
      dinner: {
        id: 'jum-dn-b', name: 'Ubi Cilembu Bakar + Pepes Tongkol', shortDesc: 'Kombinasi rempah nusantara khas makan malam.',
        ingredients: '150g ubi cilembu bakar, 1 bungkus pepes tongkol kemangi',
        calories: 430, protein: 29, carbs: 56, fat: 8, priceEstimateIdr: 10000, prepTime: '20 menit',
        cookTip: 'Pepes ikan dalam daun pisang menjaga kelembapan dan rasa.', benefits: 'Tongkol menyuplai asam amino esensial untuk pemulihan malam.', emoji: '🐟',
      },
    },
    standard: {
      breakfast: {
        id: 'jum-bf-s', name: 'Sandwich Tuna + Sayuran Segar', shortDesc: 'Roti isi protein tinggi untuk pagi aktif.',
        ingredients: '2 lembar roti gandum, 80g tuna kaleng (air), selada, tomat, mayo light',
        calories: 400, protein: 28, carbs: 40, fat: 14, priceEstimateIdr: 14000, prepTime: '5 menit',
        cookTip: 'Gunakan tuna dalam air, bukan minyak. Mayo light untuk kurangi lemak.', benefits: 'Tuna kaya omega-3 dan selenium untuk kesehatan tiroid.', emoji: '🥪',
      },
      lunch: {
        id: 'jum-lu-s', name: 'Nasi + Ikan Bakar Jimbaran + Sambal Matah', shortDesc: 'Cita rasa Bali dengan ikan segar.',
        ingredients: '140g nasi, 100g ikan kakap/gurame bakar, sambal matah, plecing kangkung',
        calories: 510, protein: 38, carbs: 52, fat: 14, priceEstimateIdr: 22000, prepTime: '25 menit',
        cookTip: 'Bakar ikan dengan arang atau teflon panas. Sambal matah pakai minyak kelapa sedikit.', benefits: 'Ikan kakap kaya protein dan rendah merkuri dibanding ikan predator besar.', emoji: '🐟',
      },
      snack: {
        id: 'jum-sn-s', name: 'Puding Chia Seed + Susu Almond', shortDesc: 'Snack superfood kaya serat.',
        ingredients: '2 sdm chia seed, 200ml susu almond, 1 sdt madu, buah berry',
        calories: 160, protein: 5, carbs: 20, fat: 7, priceEstimateIdr: 12000, prepTime: '4 jam (rendam)',
        cookTip: 'Rendam chia seed semalaman di kulkas untuk tekstur puding.', benefits: 'Chia seed kaya omega-3 nabati dan serat larut untuk kenyang lama.', emoji: '🫐',
      },
      dinner: {
        id: 'jum-dn-s', name: 'Rawon Daging Sapi + Nasi Putih', shortDesc: 'Sup hitam kluwek khas Jawa Timur.',
        ingredients: '120g nasi, 80g daging sapi, kluwek, tauge, telur asin, sambal',
        calories: 500, protein: 34, carbs: 52, fat: 16, priceEstimateIdr: 25000, prepTime: '45 menit',
        cookTip: 'Kluwek harus benar-benar matang dan tidak pahit.', benefits: 'Kluwek mengandung antioksidan unik dan daging sapi kaya vitamin B12.', emoji: '🥩',
      },
    },
  },

  // ==================== SABTU ====================
  Sabtu: {
    budget: {
      breakfast: {
        id: 'sab-bf-b', name: 'Nasi + Sarden Kaleng Tumis Cabai', shortDesc: 'Sarapan cepat kaya omega-3 dari ikan kalengan.',
        ingredients: '150g nasi, 1/2 kaleng sarden tomat, cabai, bawang merah, tomat segar',
        calories: 450, protein: 22, carbs: 58, fat: 14, priceEstimateIdr: 8000, prepTime: '8 menit',
        cookTip: 'Tumis bawang merah dan cabai, masukkan sarden dan tomat segar.', benefits: 'Sarden kaya kalsium (tulangnya bisa dimakan) dan omega-3.', emoji: '🥫',
      },
      lunch: {
        id: 'sab-lu-b', name: 'Mie Ayam Bakso Mangkok', shortDesc: 'Jajanan legendaris Indonesia yang mengenyangkan.',
        ingredients: '1 porsi mie ayam, 2 biji bakso sapi, pangsit goreng kecil, sawi hijau',
        calories: 500, protein: 24, carbs: 68, fat: 14, priceEstimateIdr: 12000, prepTime: 'Beli siap saji',
        cookTip: 'Minta sawi diperbanyak, skip kerupuk untuk kurangi lemak.', benefits: 'Mie gandum memberi karbohidrat, bakso sapi memberi protein.', emoji: '🍜',
      },
      snack: {
        id: 'sab-sn-b', name: 'Tahu Crispy Bumbu Rempah (3 potong)', shortDesc: 'Tahu goreng renyah tinggi protein nabati.',
        ingredients: '3 potong tahu, bumbu kunyit bawang, sedikit minyak goreng',
        calories: 170, protein: 12, carbs: 8, fat: 10, priceEstimateIdr: 4000, prepTime: '10 menit',
        cookTip: 'Goreng dengan api besar sebentar agar renyah di luar tapi lembut di dalam.', benefits: 'Tahu kaya isoflavon dan kalsium dari proses koagulasi kedelai.', emoji: '🧈',
      },
      dinner: {
        id: 'sab-dn-b', name: 'Nasi + Sop Buntut Sederhana', shortDesc: 'Sop hangat tulang sapi kaya kolagen.',
        ingredients: '150g nasi, sop buntut sapi (wortel, kentang, tomat, seledri)',
        calories: 430, protein: 25, carbs: 54, fat: 12, priceEstimateIdr: 10000, prepTime: '25 menit',
        cookTip: 'Rebus buntut hingga empuk, buang lemak mengambang di permukaan.', benefits: 'Kolagen dari tulang sapi baik untuk sendi dan kulit.', emoji: '🍲',
      },
    },
    standard: {
      breakfast: {
        id: 'sab-bf-s', name: 'Nasi Goreng Seafood Spesial', shortDesc: 'Nasi goreng premium akhir pekan.',
        ingredients: '150g nasi goreng, udang, cumi, telur, sawi hijau, acar',
        calories: 500, protein: 26, carbs: 60, fat: 17, priceEstimateIdr: 18000, prepTime: '15 menit',
        cookTip: 'Gunakan nasi dingin, api besar, dan kecap manis secukupnya.', benefits: 'Seafood kaya zinc untuk imunitas dan hormon metabolisme.', emoji: '🍳',
      },
      lunch: {
        id: 'sab-lu-s', name: 'Nasi + Ayam Betutu Bali + Sayur Urap', shortDesc: 'Ayam bumbu rempah khas upacara Bali.',
        ingredients: '140g nasi, 100g ayam betutu, sayur urap (kacang panjang, tauge, kelapa parut)',
        calories: 550, protein: 36, carbs: 56, fat: 18, priceEstimateIdr: 22000, prepTime: 'Beli / 2 jam',
        cookTip: 'Pilih bagian dada tanpa kulit untuk protein lebih dan lemak lebih sedikit.', benefits: 'Bumbu betutu (basa genep) mengandung rempah anti-inflamasi lengkap.', emoji: '🍗',
      },
      snack: {
        id: 'sab-sn-s', name: 'Acai Bowl Mini + Granola', shortDesc: 'Bowl superfruit kaya antioksidan.',
        ingredients: '100g acai frozen/blueberry, 30g granola, 1 sdm madu, pisang',
        calories: 200, protein: 4, carbs: 38, fat: 5, priceEstimateIdr: 15000, prepTime: '5 menit',
        cookTip: 'Blend buah beku hingga kental, tuang granola dan madu di atas.', benefits: 'Antioksidan anthocyanin dari buah beri melindungi sel dari kerusakan.', emoji: '🫐',
      },
      dinner: {
        id: 'sab-dn-s', name: 'Steak Tempe + Mashed Potato + Salad', shortDesc: 'Versi nabati steak yang kaya protein.',
        ingredients: '150g tempe steak bumbu lada hitam, 100g kentang tumbuk, salad segar',
        calories: 460, protein: 26, carbs: 54, fat: 15, priceEstimateIdr: 16000, prepTime: '20 menit',
        cookTip: 'Marinasi tempe dengan kecap, lada hitam, dan olive oil. Panggang sampai caramelized.', benefits: 'Tempe fermentasi lebih mudah dicerna dan kaya probiotik alami.', emoji: '🥩',
      },
    },
  },

  // ==================== MINGGU ====================
  Minggu: {
    budget: {
      breakfast: {
        id: 'min-bf-b', name: 'Nasi Uduk Ekonomis + Telur + Tempe Orek', shortDesc: 'Sarapan santai hari Minggu ala warung.',
        ingredients: '150g nasi uduk, 1 telur dadar, tempe orek kecap, kerupuk',
        calories: 460, protein: 17, carbs: 64, fat: 15, priceEstimateIdr: 7000, prepTime: 'Beli siap saji',
        cookTip: 'Skip kerupuk dan kurangi santan jika ingin lebih sehat.', benefits: 'Sarapan lengkap karbohidrat + protein + lemak untuk energi libur.', emoji: '🍚',
      },
      lunch: {
        id: 'min-lu-b', name: 'Nasi + Opor Ayam Kuah Kuning + Lalapan', shortDesc: 'Opor rumahan dengan bumbu kuning sederhana.',
        ingredients: '150g nasi, 1 potong ayam opor (paha atas), kuah opor kuning, lalapan',
        calories: 520, protein: 28, carbs: 58, fat: 18, priceEstimateIdr: 12000, prepTime: '30 menit',
        cookTip: 'Gunakan santan encer dan buang kulit ayam untuk kurangi lemak.', benefits: 'Kunyit dalam opor mengandung kurkumin anti-inflamasi.', emoji: '🍗',
      },
      snack: {
        id: 'min-sn-b', name: 'Roti Bakar Cokelat + Keju (1 Potong)', shortDesc: 'Camilan manis akhir pekan yang simpel.',
        ingredients: '1 lembar roti tawar, 1 sdm selai cokelat, 1 lembar keju',
        calories: 200, protein: 6, carbs: 28, fat: 8, priceEstimateIdr: 4000, prepTime: '5 menit',
        cookTip: 'Panggang roti di teflon tanpa margarin tambahan.', benefits: 'Cokelat mengandung flavonoid dan keju menyumbang kalsium.', emoji: '🍞',
      },
      dinner: {
        id: 'min-dn-b', name: 'Nasi + Sayur Lodeh + Telur Bumbu Kuning', shortDesc: 'Lodeh sayur nusantara hangat malam Minggu.',
        ingredients: '150g nasi, sayur lodeh (labu, tempe, tahu, nangka muda), 1 telur bumbu kuning',
        calories: 440, protein: 18, carbs: 62, fat: 13, priceEstimateIdr: 8000, prepTime: '25 menit',
        cookTip: 'Gunakan santan encer. Masukkan labu terakhir agar tidak terlalu lembek.', benefits: 'Nangka muda kaya serat dan labu kaya beta-karoten.', emoji: '🥘',
      },
    },
    standard: {
      breakfast: {
        id: 'min-bf-s', name: 'French Toast + Buah Segar + Madu', shortDesc: 'Brunch akhir pekan ala kafe.',
        ingredients: '2 lembar roti, 1 telur, susu, kayu manis, stroberi/pisang, 1 sdm madu',
        calories: 420, protein: 15, carbs: 56, fat: 15, priceEstimateIdr: 13000, prepTime: '10 menit',
        cookTip: 'Celup roti di campuran telur-susu-kayu manis, panggang teflon.', benefits: 'Kayu manis membantu regulasi gula darah.', emoji: '🍞',
      },
      lunch: {
        id: 'min-lu-s', name: 'Nasi + Bebek Goreng Sambal Korek + Lalapan', shortDesc: 'Bebek crispy khas lamongan.',
        ingredients: '140g nasi, 1 potong bebek goreng, sambal korek, lalapan lengkap',
        calories: 580, protein: 32, carbs: 56, fat: 24, priceEstimateIdr: 25000, prepTime: 'Beli siap saji',
        cookTip: 'Buang kulit bebek jika ingin kurangi lemak jenuh secara drastis.', benefits: 'Bebek kaya vitamin B dan zat besi heme.', emoji: '🦆',
      },
      snack: {
        id: 'min-sn-s', name: 'Salad Buah Yogurt + Granola', shortDesc: 'Campuran buah segar dengan yogurt.',
        ingredients: '150g buah campur (semangka, melon, anggur), 100ml yogurt, 20g granola',
        calories: 180, protein: 7, carbs: 30, fat: 4, priceEstimateIdr: 12000, prepTime: '5 menit',
        cookTip: 'Potong buah segar, tuang yogurt dan granola. Nikmati dingin.', benefits: 'Kombinasi probiotik, serat, dan vitamin C untuk imunitas.', emoji: '🍓',
      },
      dinner: {
        id: 'min-dn-s', name: 'Sop Kambing Tanpa Santan + Nasi', shortDesc: 'Sup kambing bening kaya protein.',
        ingredients: '120g nasi, 80g daging kambing muda, tomat, kentang, wortel, seledri',
        calories: 480, protein: 32, carbs: 48, fat: 16, priceEstimateIdr: 23000, prepTime: '40 menit',
        cookTip: 'Rebus kambing hingga empuk, buang lemak yang mengambang.', benefits: 'Daging kambing muda kaya zat besi dan protein untuk pemulihan.', emoji: '🥩',
      },
    },
  },
};

// Hitung total kalori basis dari hari Senin untuk scaling
function calcDayTotal(dayMeals) {
  return (dayMeals.breakfast?.calories || 0) + (dayMeals.lunch?.calories || 0) +
         (dayMeals.snack?.calories || 0) + (dayMeals.dinner?.calories || 0);
}

export const BASE_DAILY_CALORIES = {
  budget: calcDayTotal(WEEKLY_MEALS.Senin.budget),
  standard: calcDayTotal(WEEKLY_MEALS.Senin.standard),
};
