/**
 * nutritionData.js
 * Menu makan 7 hari (Senin-Minggu) × 2 tier (budget/standard) × 4 waktu makan
 * Basis data pangan lokal Indonesia untuk HealthEngine V2.5
 * Dilengkapi takaran Ukuran Rumah Tangga (URT), kategori Jajan padat nutrisi, dan data Buah Harian.
 */

export const DAILY_FRUITS = {
  Senin: {
    name: 'Pisang Ambon',
    portion: '2 buah sedang',
    householdPortion: '2 buah pisang ambon matang (~120g)',
    calories: 105,
    carbs: 27,
    protein: 1.3,
    fat: 0.3,
    emoji: '🍌',
    benefits: 'Kaya kalium dan pektin untuk menjaga irama jantung serta melancarkan pencernaan.',
  },
  Selasa: {
    name: 'Pepaya Segar',
    portion: '2 potong sedang',
    householdPortion: '2 potong pepaya manis (~150g)',
    calories: 100,
    carbs: 25,
    protein: 1.0,
    fat: 0.2,
    emoji: '🍈',
    benefits: 'Tinggi enzim papain dan vitamin C untuk mempercepat pemulihan jaringan otot.',
  },
  Rabu: {
    name: 'Apel Segar',
    portion: '1 buah sedang',
    householdPortion: '1 buah apel segar dicuci bersih (~130g)',
    calories: 100,
    carbs: 26,
    protein: 0.5,
    fat: 0.3,
    emoji: '🍎',
    benefits: 'Antioksidan quercetin dan serat larut pektin menjaga kestabilan glukosa darah.',
  },
  Kamis: {
    name: 'Jeruk Manis',
    portion: '2 buah sedang',
    householdPortion: '2 buah jeruk peras / kupas segar (~160g)',
    calories: 100,
    carbs: 24,
    protein: 1.8,
    fat: 0.2,
    emoji: '🍊',
    benefits: 'Melimpah vitamin C dan bioflavonoid untuk menjaga imunitas dan dinding pembuluh darah.',
  },
  Jumat: {
    name: 'Semangka Merah',
    portion: '2 potong juring',
    householdPortion: '2 potong juring semangka segar (~200g)',
    calories: 100,
    carbs: 24,
    protein: 1.8,
    fat: 0.4,
    emoji: '🍉',
    benefits: 'Kandungan L-citrulline dan elektrolit tinggi untuk rehidrasi sel otot pasca latihan.',
  },
  Sabtu: {
    name: 'Mangga Harum Manis',
    portion: '1 buah sedang',
    householdPortion: '1 buah mangga harum manis potong dadu (~140g)',
    calories: 120,
    carbs: 30,
    protein: 1.1,
    fat: 0.5,
    emoji: '🥭',
    benefits: 'Tinggi vitamin A, folat, dan amilase untuk mendukung metabolisme karbohidrat alami.',
  },
  Minggu: {
    name: 'Jambu Biji Merah',
    portion: '1 buah besar',
    householdPortion: '1 buah jambu biji merah matang potong (~150g)',
    calories: 100,
    carbs: 22,
    protein: 2.5,
    fat: 0.8,
    emoji: '🍐',
    benefits: 'Kandungan vitamin C 4x lipat dari jeruk serta likopen tinggi penangkal stres oksidatif.',
  },
};

export const WEEKLY_MEALS = {
  // ==================== SENIN ====================
  Senin: {
    budget: {
      breakfast: {
        id: 'sen-bf-b', name: 'Omelet Telur Tempe Sayur + Nasi', shortDesc: 'Protein ganda murah meriah dan padat gizi.',
        householdPortion: '1.5 centong nasi putih (~150g) + 1 butir telur dadar tempe + 2 sdm sayur bayam',
        ingredients: '1 butir telur, 50g tempe cincang, daun bayam, 1 piring nasi putih (150g)',
        calories: 420, protein: 18, carbs: 58, fat: 12, priceEstimateIdr: 6500, prepTime: '10 menit',
        cookTip: 'Kocok telur dengan tempe cincang. Gunakan teflon antilengket dengan sedikit minyak.', benefits: 'Kolin dari telur untuk fokus otak, serat tempe untuk kenyang awet.', emoji: '🍳',
      },
      lunch: {
        id: 'sen-lu-b', name: 'Nasi + Tahu Tempe Bacem + Sayur Bening', shortDesc: 'Paket serat & nabati murah dari pasar tradisional.',
        householdPortion: '1.5 centong nasi (~150g) + 1 potong tahu bacem + 1 potong tempe bacem + 1 mangkok sayur bening bayam',
        ingredients: '1 piring nasi (150g), 1 potong tahu, 1 potong tempe bacem, sayur bening bayam jagung',
        calories: 480, protein: 22, carbs: 76, fat: 9, priceEstimateIdr: 8000, prepTime: '20 menit',
        cookTip: 'Kukus tahu tempe tanpa minyak goreng agar kalori lebih rendah.', benefits: 'Bayam kaya magnesium dan zat besi untuk mencegah kantuk siang.', emoji: '🥬',
      },
      snack: {
        id: 'sen-sn-b', name: 'Martabak Telur Mini Daun Bawang', shortDesc: 'Jajan gurih padat telur dan protein nabati.',
        householdPortion: '2 potong martabak telur mini + 1 mangkok kecil acar timun',
        ingredients: '2 butir telur, 2 lembar kulit lumpia, daun bawang iris tebal, 1 sdm tahu lumat',
        calories: 220, protein: 12, carbs: 18, fat: 11, priceEstimateIdr: 6000, prepTime: '12 menit',
        cookTip: 'Panggang dengan sedikit olesan minyak di teflon panas tertutup sampai matang merata.', benefits: 'Kaya protein berkualitas untuk menahan rasa lapar sebelum makan malam.', emoji: '🥟',
      },
      dinner: {
        id: 'sen-dn-b', name: 'Sup Tahu Telur Puyuh + Wortel Buncis', shortDesc: 'Menu malam hangat ringan kalori.',
        householdPortion: '1 mangkok sedang sup tahu + 4 butir telur puyuh + 3 sdm sayur wortel buncis',
        ingredients: '150g tahu sutra, 4 butir telur puyuh, wortel, buncis, kuah bening bawang putih',
        calories: 340, protein: 21, carbs: 24, fat: 14, priceEstimateIdr: 7500, prepTime: '15 menit',
        cookTip: 'Masukkan wortel dulu hingga empuk baru tahu dan telur puyuh.', benefits: 'Rendah karbohidrat, cocok untuk makan malam ringan sebelum tidur.', emoji: '🍲',
      },
    },
    standard: {
      breakfast: {
        id: 'sen-bf-s', name: 'Roti Gandum Alpukat + Telur Mata Sapi', shortDesc: 'Sarapan lemak sehat dan serat gandum utuh.',
        householdPortion: '2 lembar roti gandum + 1 butir telur ceplok + 2 sdm alpukat lumat',
        ingredients: '2 lembar roti gandum, 1 telur ceplok, 50g alpukat lumat, biji chia',
        calories: 440, protein: 19, carbs: 42, fat: 22, priceEstimateIdr: 16000, prepTime: '8 menit',
        cookTip: 'Oleskan alpukat dengan perasan jeruk nipis dan lada hitam.', benefits: 'Lemak tak jenuh alpukat untuk kesehatan pembuluh darah.', emoji: '🥑',
      },
      lunch: {
        id: 'sen-lu-s', name: 'Nasi Merah + Ayam Bakar Madu + Tumis Buncis', shortDesc: 'Karbohidrat serat tinggi dan protein rendah lemak.',
        householdPortion: '1.5 centong nasi merah (~140g) + 1 potong dada ayam bakar (~130g) + 2 sdm tumis buncis',
        ingredients: '140g nasi merah, 130g dada ayam bumbu madu ketumbar, buncis tumis',
        calories: 530, protein: 42, carbs: 62, fat: 11, priceEstimateIdr: 18000, prepTime: '25 menit',
        cookTip: 'Marinasi ayam 15 menit, panggang teflon 4-5 menit per sisi.', benefits: 'Nasi merah memberi energi stabil tanpa lonjakan gula darah.', emoji: '🍗',
      },
      snack: {
        id: 'sen-sn-s', name: 'Tahu Bakso Daging Sapi Kuah Kaldu', shortDesc: 'Jajan khas nusantara kaya protein hewani.',
        householdPortion: '3 potong tahu bakso sapi kukus + 1 mangkok kecil kuah kaldu segar',
        ingredients: '3 potong tahu bakso isi daging sapi giling premium, kuah kaldu sapi bening daun bawang',
        calories: 210, protein: 16, carbs: 14, fat: 9, priceEstimateIdr: 12000, prepTime: '8 menit',
        cookTip: 'Kukus tahu bakso sampai panas mengepul, santap dengan sedikit cabai rawit ulek.', benefits: 'Protein hewani murni untuk pemulihan otot sore hari tanpa minyak trans.', emoji: '🍢',
      },
      dinner: {
        id: 'sen-dn-s', name: 'Capcay Seafood (Udang & Cumi) + Nasi Ringan', shortDesc: 'Aneka sayur dan protein laut segar.',
        householdPortion: '1 centong nasi putih (~100g) + 1 mangkok capcay seafood (6 ekor udang + cumi + brokoli)',
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
        householdPortion: '4 sdm oatmeal seduh + 1 buah pisang iris + 1 butir telur rebus',
        ingredients: '40g oatmeal, 1 pisang potong, 1 telur rebus',
        calories: 360, protein: 14, carbs: 56, fat: 8, priceEstimateIdr: 5500, prepTime: '5 menit',
        cookTip: 'Seduh oat dengan air panas, tambah pisang tanpa gula tambahan.', benefits: 'Beta-glukan oat menurunkan kolesterol dan stabilkan gula darah.', emoji: '🥣',
      },
      lunch: {
        id: 'sel-lu-b', name: 'Nasi + Ikan Kembung Goreng + Sambal Dabu-Dabu', shortDesc: 'Omega-3 lokal setara salmon.',
        householdPortion: '1.5 centong nasi (~150g) + 1 ekor ikan kembung bakar/goreng + 2 sdm dabu-dabu',
        ingredients: '150g nasi, 1 ekor ikan kembung (90g), sambal dabu-dabu segar, lalapan',
        calories: 520, protein: 34, carbs: 58, fat: 14, priceEstimateIdr: 11000, prepTime: '15 menit',
        cookTip: 'Lumuri ikan dengan jeruk nipis dan kunyit agar tidak amis.', benefits: 'EPA & DHA ikan kembung menjaga fungsi kognitif dan anti-inflamasi.', emoji: '🐟',
      },
      snack: {
        id: 'sel-sn-b', name: 'Roti Bakar Selai Kacang Pisang', shortDesc: 'Jajan padat energi alami dari selai kacang murni.',
        householdPortion: '1 tangkup (2 lembar) roti bakar + 1.5 sdm selai kacang + 1 buah pisang iris',
        ingredients: '2 lembar roti tawar gandum/putih, 1.5 sdm selai kacang tanah murni, 1 buah pisang',
        calories: 240, protein: 9, carbs: 36, fat: 8, priceEstimateIdr: 6000, prepTime: '5 menit',
        cookTip: 'Panggang roti di teflon kering hingga renyah keemasan sebelum dioles selai.', benefits: 'Kombinasi lemak tak jenuh dan kalium untuk menyuplai stamina saat beraktivitas.', emoji: '🥪',
      },
      dinner: {
        id: 'sel-dn-b', name: 'Mie Rebus Sayur + Telur + Sawi Hijau', shortDesc: 'Mie instan upgrade sehat ala anak kos.',
        householdPortion: '1 mangkok mie kuah + 1 butir telur rebus/setengah matang + 3 sdm sayur sawi wortel',
        ingredients: '1 bungkus mie instan, 1 telur, sawi hijau, wortel, bumbu setengah saja',
        calories: 410, protein: 15, carbs: 62, fat: 12, priceEstimateIdr: 5500, prepTime: '10 menit',
        cookTip: 'Gunakan hanya setengah bumbu. Tambah banyak sayur dan telur.', benefits: 'Telur dan sayur menambah nilai gizi mie instan secara signifikan.', emoji: '🍜',
      },
    },
    standard: {
      breakfast: {
        id: 'sel-bf-s', name: 'Bubur Ayam Jakarta Komplit', shortDesc: 'Klasik nusantara dengan suwir dada ayam.',
        householdPortion: '1 mangkok bubur kaldu gurih + 3 sdm suwiran dada ayam + 1 sdm kedelai',
        ingredients: '200g bubur beras kuah kaldu, 70g suwiran dada ayam, kedelai goreng, seledri',
        calories: 410, protein: 26, carbs: 60, fat: 7, priceEstimateIdr: 14000, prepTime: 'Beli siap saji',
        cookTip: 'Skip kerupuk dan bawang goreng berlebih untuk kurangi lemak jenuh.', benefits: 'Mudah dicerna dan tinggi protein dari suwiran dada ayam.', emoji: '🍲',
      },
      lunch: {
        id: 'sel-lu-s', name: 'Gado-Gado + Lontong + 2 Telur Rebus', shortDesc: 'Salad Indonesia kaya fitonutrien.',
        householdPortion: '1 mangkok sayuran kukus campur + 1 potong lontong sedang + 2 butir telur rebus + 2 sdm bumbu kacang',
        ingredients: 'Sayuran kukus, lontong, 2 telur rebus, bumbu kacang segar',
        calories: 570, protein: 28, carbs: 64, fat: 21, priceEstimateIdr: 16000, prepTime: 'Siap saji',
        cookTip: 'Pilih bumbu kacang tidak terlalu berminyak.', benefits: 'Spektrum antioksidan lengkap dari berbagai warna sayuran.', emoji: '🥗',
      },
      snack: {
        id: 'sel-sn-s', name: 'Pisang Keju Panggang Kayu Manis', shortDesc: 'Jajan manis hangat nusantara kaya kalsium.',
        householdPortion: '2 buah pisang kepok panggang + 1 sdm keju cheddar parut + taburan kayu manis',
        ingredients: '2 buah pisang kepok matang, 20g keju cheddar parut, sedikit bubuk kayu manis',
        calories: 210, protein: 5, carbs: 38, fat: 5, priceEstimateIdr: 8000, prepTime: '10 menit',
        cookTip: 'Panggang pisang di atas teflon tanpa mentega hingga karamel alami keluar, taburi keju.', benefits: 'Kalsium keju dan polifenol kayu manis membantu sensitivitas insulin.', emoji: '🍌',
      },
      dinner: {
        id: 'sel-dn-s', name: 'Soto Daging Sapi Bening + Nasi', shortDesc: 'Daging has empuk dalam kuah rempah segar.',
        householdPortion: '1.2 centong nasi putih (~120g) + 1 mangkok soto bening (4 potong daging has sapi + tauge)',
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
        householdPortion: '1.5 centong nasi (~150g) goreng bumbu bawang + 1 butir telur orak-arik',
        ingredients: '150g nasi sisa, 1 telur, kecap manis, bawang merah, cabai',
        calories: 430, protein: 14, carbs: 64, fat: 13, priceEstimateIdr: 5000, prepTime: '8 menit',
        cookTip: 'Gunakan nasi sisa dingin agar butiran terpisah dan tidak lembek.', benefits: 'Karbohidrat cepat untuk energi awal hari.', emoji: '🍛',
      },
      lunch: {
        id: 'rab-lu-b', name: 'Nasi + Pecel Sayur + Tempe Goreng', shortDesc: 'Bumbu kacang khas Jawa dengan sayur segar.',
        householdPortion: '1.5 centong nasi (~150g) + 2 potong tempe goreng tepung tipis + 1 mangkok sayur pecel',
        ingredients: '150g nasi, kangkung, tauge, kacang panjang rebus, 1 potong tempe goreng, bumbu pecel',
        calories: 490, protein: 19, carbs: 72, fat: 14, priceEstimateIdr: 8000, prepTime: '15 menit',
        cookTip: 'Rebus sayuran sebentar saja agar vitamin tidak hilang.', benefits: 'Bumbu kacang kaya mineral dan vitamin E dari kacang tanah.', emoji: '🥜',
      },
      snack: {
        id: 'rab-sn-b', name: 'Bubur Kacang Hijau Gula Aren', shortDesc: 'Jajan tradisional kaya zat besi dan serat.',
        householdPortion: '1 mangkok sedang bubur kacang hijau (~200ml) kuah jahe pandan',
        ingredients: '50g kacang hijau rebus, 1 keping kecil gula aren, jahe, pandan (tanpa santan kental)',
        calories: 220, protein: 9, carbs: 44, fat: 1, priceEstimateIdr: 5000, prepTime: '20 menit',
        cookTip: 'Rebus kacang hijau hingga pecah merekah dengan jahe dan daun pandan.', benefits: 'Zat besi dan asam folat tinggi untuk meregenerasi sel darah merah.', emoji: '🫘',
      },
      dinner: {
        id: 'rab-dn-b', name: 'Nasi + Sayur Asem Jawa + Tahu Goreng', shortDesc: 'Kuah asem segar khas nusantara.',
        householdPortion: '1.5 centong nasi (~150g) + 2 potong tahu goreng + 1 mangkok sayur asem segar',
        ingredients: '150g nasi, sayur asem (labu siam, kacang panjang, jagung, melinjo), 2 potong tahu goreng',
        calories: 420, protein: 16, carbs: 68, fat: 10, priceEstimateIdr: 7000, prepTime: '25 menit',
        cookTip: 'Masukkan asam jawa di akhir masak agar rasa segar tidak hilang.', benefits: 'Labu siam rendah kalori dan kaya vitamin C.', emoji: '🥘',
      },
    },
    standard: {
      breakfast: {
        id: 'rab-bf-s', name: 'Nasi Uduk + Ayam Goreng + Sambal Kacang', shortDesc: 'Nasi santan gurih khas Betawi.',
        householdPortion: '1.5 centong nasi uduk (~150g) + 1 potong ayam paha bawah + 2 iris mentimun',
        ingredients: '150g nasi uduk, 1 potong ayam goreng paha bawah, sambal kacang, mentimun',
        calories: 520, protein: 28, carbs: 56, fat: 20, priceEstimateIdr: 15000, prepTime: 'Beli siap saji',
        cookTip: 'Buang kulit ayam jika ingin mengurangi lemak jenuh.', benefits: 'Protein lengkap dari ayam untuk energi pagi.', emoji: '🍗',
      },
      lunch: {
        id: 'rab-lu-s', name: 'Nasi + Rendang Daging Sapi + Daun Singkong', shortDesc: 'Rendang kering kaya bumbu rempah.',
        householdPortion: '1.4 centong nasi putih (~140g) + 1 potong rendang daging has (~80g) + 2 sdm daun singkong rebus',
        ingredients: '140g nasi, 80g rendang daging sapi, daun singkong rebus, sambal hijau',
        calories: 560, protein: 35, carbs: 58, fat: 20, priceEstimateIdr: 24000, prepTime: 'Beli / 2 jam',
        cookTip: 'Pilih rendang kering tanpa terlalu banyak minyak sawit.', benefits: 'Rempah rendang (kunyit, lengkuas) mengandung kurkumin anti-inflamasi.', emoji: '🥘',
      },
      snack: {
        id: 'rab-sn-s', name: 'Martabak Telur Mini Daging Cincang', shortDesc: 'Jajan gurih tinggi protein daging sapi padat nutrisi.',
        householdPortion: '2 potong martabak telur mini isi daging sapi + kuah cuka rempah',
        ingredients: '2 lembar kulit lumpia, 2 butir telur bebek/ayam, 50g daging sapi cincang, daun bawang',
        calories: 250, protein: 17, carbs: 16, fat: 14, priceEstimateIdr: 14000, prepTime: '15 menit',
        cookTip: 'Tumis daging cincang dulu hingga matang sebelum dicampur telur dan dipanggang teflon.', benefits: 'Kaya kreatin alami dan zat besi dari daging sapi cincang untuk tenaga otot.', emoji: '🥟',
      },
      dinner: {
        id: 'rab-dn-s', name: 'Pepes Ikan Mas + Nasi Putih Ringan', shortDesc: 'Ikan kukus dalam balutan daun pisang.',
        householdPortion: '1.2 centong nasi putih (~120g) + 1 ekor pepes ikan mas bumbu kemangi (~100g)',
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
        householdPortion: '1 potong lontong sedang (~150g) + 1 butir telur rebus + 1 mangkok sayur labu santan encer',
        ingredients: '1 potong lontong (150g), sayur labu siam kuah santan encer, 1 telur rebus',
        calories: 400, protein: 16, carbs: 62, fat: 10, priceEstimateIdr: 7000, prepTime: 'Beli siap saji',
        cookTip: 'Pilih kuah santan yang encer, bukan santan kental.', benefits: 'Labu siam rendah kalori dan kaya serat larut.', emoji: '🥘',
      },
      lunch: {
        id: 'kam-lu-b', name: 'Nasi + Telur Balado + Sayur Kangkung', shortDesc: 'Telur bumbu merah pedas khas Padang.',
        householdPortion: '1.5 centong nasi (~150g) + 2 butir telur balado + 2 sdm kangkung tumis',
        ingredients: '150g nasi, 2 telur goreng balado, kangkung tumis bawang putih',
        calories: 510, protein: 20, carbs: 64, fat: 18, priceEstimateIdr: 9000, prepTime: '15 menit',
        cookTip: 'Goreng telur setengah matang, siram bumbu balado di atasnya.', benefits: 'Kangkung kaya vitamin A dan zat besi, baik untuk kesehatan mata.', emoji: '🌶️',
      },
      snack: {
        id: 'kam-sn-b', name: 'Tahu Bakso Daging Ayam Kukus', shortDesc: 'Jajan tahu isi daging kaya protein tanpa gorengan basah.',
        householdPortion: '3 potong tahu bakso ayam kukus + sambal kecap cabai rawit',
        ingredients: '3 potong tahu putih isi adonan dada ayam giling dan bawang putih',
        calories: 190, protein: 15, carbs: 12, fat: 7, priceEstimateIdr: 6000, prepTime: '10 menit',
        cookTip: 'Kukus di atas air mendidih selama 10 menit, sajikan hangat dengan sambal kecap encer.', benefits: 'Protein tinggi rendah lemak jenuh untuk menjaga massa otot tetap padat.', emoji: '🍢',
      },
      dinner: {
        id: 'kam-dn-b', name: 'Bubur Kacang Hijau + Roti', shortDesc: 'Manis hangat bergizi tinggi untuk malam hari.',
        householdPortion: '1 mangkok bubur kacang hijau (~200ml) + 1 lembar roti tawar gandum',
        ingredients: '200ml bubur kacang hijau, 1 lembar roti tawar, sedikit santan/gula merah',
        calories: 350, protein: 12, carbs: 62, fat: 5, priceEstimateIdr: 5000, prepTime: '30 menit',
        cookTip: 'Masak kacang hijau dengan gula merah, skip santan untuk kalori lebih rendah.', benefits: 'Kacang hijau kaya asam folat dan zat besi untuk regenerasi sel.', emoji: '🫘',
      },
    },
    standard: {
      breakfast: {
        id: 'kam-bf-s', name: 'Pancake Oat + Madu + Buah Segar', shortDesc: 'Pancake sehat dari tepung oat tanpa gula tambahan.',
        householdPortion: '2 lembar pancake oat teflon + 1 sdm madu murni + potongan buah pisang/stroberi',
        ingredients: '50g tepung oat, 1 telur, 50ml susu, 1 sdm madu, stroberi/pisang potong',
        calories: 380, protein: 16, carbs: 54, fat: 10, priceEstimateIdr: 12000, prepTime: '12 menit',
        cookTip: 'Blend oat jadi tepung, campurkan semua bahan, masak di teflon.', benefits: 'Karbohidrat kompleks oat memberi energi stabil hingga siang.', emoji: '🥞',
      },
      lunch: {
        id: 'kam-lu-s', name: 'Nasi + Ikan Dori Panggang + Salad Segar', shortDesc: 'Protein ikan putih rendah lemak.',
        householdPortion: '1.4 centong nasi putih (~140g) + 1 potong fillet dori panggang (~120g) + 1 mangkok salad',
        ingredients: '140g nasi, 120g fillet dori bumbu lemon pepper, salad sayur segar, dressing olive oil',
        calories: 480, protein: 35, carbs: 52, fat: 13, priceEstimateIdr: 20000, prepTime: '20 menit',
        cookTip: 'Panggang dori di teflon 3-4 menit per sisi dengan sedikit olive oil.', benefits: 'Ikan dori rendah lemak dan mudah dicerna, protein berkualitas tinggi.', emoji: '🐟',
      },
      snack: {
        id: 'kam-sn-s', name: 'Roti Bakar Selai Kacang Pisang Madu', shortDesc: 'Jajan gandum utuh padat protein kacang & energi pisang.',
        householdPortion: '1 tangkup (2 lembar) roti gandum bakar + 2 sdm selai kacang + 1 buah pisang + 1 sdt madu',
        ingredients: '2 lembar roti gandum utuh, 2 sdm selai kacang tanpa gula, 1 buah pisang ambon iris',
        calories: 260, protein: 11, carbs: 38, fat: 9, priceEstimateIdr: 11000, prepTime: '5 menit',
        cookTip: 'Panggang gandum kering di teflon, oles selai kacang tebal dan tata pisang manis.', benefits: 'Serat gandum dan protein kacang mencegah penurunan gula darah mendadak.', emoji: '🥪',
      },
      dinner: {
        id: 'kam-dn-s', name: 'Sup Ayam Jahe + Nasi Putih', shortDesc: 'Sup hangat penambah imun tubuh.',
        householdPortion: '1.2 centong nasi putih (~120g) + 1 mangkok sup ayam jahe (3 sdm suwiran dada ayam + wortel)',
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
        householdPortion: '1.5 centong nasi kuning (~150g) + 1 butir telur dadar iris + 2 sdm bihun goreng',
        ingredients: '150g nasi kuning, 1 telur dadar, 50g mie bihun goreng, irisan mentimun',
        calories: 440, protein: 15, carbs: 66, fat: 13, priceEstimateIdr: 7000, prepTime: '15 menit',
        cookTip: 'Masak nasi dengan kunyit, daun salam, dan serai untuk aroma.', benefits: 'Kunyit mengandung kurkumin dengan efek anti-inflamasi.', emoji: '🍛',
      },
      lunch: {
        id: 'jum-lu-b', name: 'Nasi + Ayam Geprek Sambal + Lalapan', shortDesc: 'Ayam crispy geprek pedas favorit anak muda.',
        householdPortion: '1.5 centong nasi (~150g) + 1 potong dada ayam goreng geprek + 1 mangkok kecil lalapan timun kol',
        ingredients: '150g nasi, 1 potong dada ayam goreng geprek, sambal ulek, lalapan',
        calories: 550, protein: 30, carbs: 62, fat: 18, priceEstimateIdr: 12000, prepTime: 'Beli siap saji',
        cookTip: 'Makan dengan banyak lalapan segar untuk serat tambahan.', benefits: 'Capsaicin cabai meningkatkan metabolisme dan pembakaran kalori.', emoji: '🍗',
      },
      snack: {
        id: 'jum-sn-b', name: 'Pisang Keju Panggang Teflon', shortDesc: 'Jajan legit mengenyangkan dari pisang kepok lokal.',
        householdPortion: '2 buah pisang kepok bakar teflon + 1 lembar keju cheddar leleh',
        ingredients: '2 buah pisang kepok matang, 1 lembar keju cheddar slice dipanggang',
        calories: 200, protein: 5, carbs: 36, fat: 4, priceEstimateIdr: 5000, prepTime: '8 menit',
        cookTip: 'Pipihkan pisang kepok sedikit, panggang bolak-balik di wajan teflon sampai kecokelatan.', benefits: 'Karbohidrat lambat serap memberi rasa kenyang awet hingga malam.', emoji: '🍌',
      },
      dinner: {
        id: 'jum-dn-b', name: 'Ubi Cilembu Bakar + Pepes Tongkol', shortDesc: 'Kombinasi rempah nusantara khas makan malam.',
        householdPortion: '1 buah ubi cilembu bakar sedang (~150g) + 1 bungkus pepes tongkol kemangi',
        ingredients: '150g ubi cilembu bakar, 1 bungkus pepes tongkol kemangi',
        calories: 430, protein: 29, carbs: 56, fat: 8, priceEstimateIdr: 10000, prepTime: '20 menit',
        cookTip: 'Pepes ikan dalam daun pisang menjaga kelembapan dan rasa.', benefits: 'Tongkol menyuplai asam amino esensial untuk pemulihan malam.', emoji: '🐟',
      },
    },
    standard: {
      breakfast: {
        id: 'jum-bf-s', name: 'Sandwich Tuna + Sayuran Segar', shortDesc: 'Roti isi protein tinggi untuk pagi aktif.',
        householdPortion: '2 lembar roti gandum + 3 sdm tuna chunks dalam air + selada dan tomat',
        ingredients: '2 lembar roti gandum, 80g tuna kaleng (air), selada, tomat, mayo light',
        calories: 400, protein: 28, carbs: 40, fat: 14, priceEstimateIdr: 14000, prepTime: '5 menit',
        cookTip: 'Gunakan tuna dalam air, bukan minyak. Mayo light untuk kurangi lemak.', benefits: 'Tuna kaya omega-3 dan selenium untuk kesehatan tiroid.', emoji: '🥪',
      },
      lunch: {
        id: 'jum-lu-s', name: 'Nasi + Ikan Bakar Jimbaran + Sambal Matah', shortDesc: 'Cita rasa Bali dengan ikan segar.',
        householdPortion: '1.4 centong nasi putih (~140g) + 1 ekor ikan kakap bakar (~100g) + 2 sdm sambal matah + plecing kangkung',
        ingredients: '140g nasi, 100g ikan kakap/gurame bakar, sambal matah, plecing kangkung',
        calories: 510, protein: 38, carbs: 52, fat: 14, priceEstimateIdr: 22000, prepTime: '25 menit',
        cookTip: 'Bakar ikan dengan arang atau teflon panas. Sambal matah pakai minyak kelapa sedikit.', benefits: 'Ikan kakap kaya protein dan rendah merkuri dibanding ikan predator besar.', emoji: '🐟',
      },
      snack: {
        id: 'jum-sn-s', name: 'Bubur Kacang Hijau Ketan Hitam Rendah Gula', shortDesc: 'Jajan legendaris nusantara kaya antosianin dan serat.',
        householdPortion: '1 mangkok bubur kacang hijau campur ketan hitam (~220ml) kuah santan encer',
        ingredients: '60g campuran kacang hijau dan ketan hitam empuk, sedikit gula kelapa, daun pandan',
        calories: 230, protein: 8, carbs: 46, fat: 2, priceEstimateIdr: 9000, prepTime: '25 menit',
        cookTip: 'Rebus ketan hitam terpisah hingga lunak agar bubur tetap kental alami tanpa maizena.', benefits: 'Pigmen ungu ketan hitam mengandung antioksidan antosianin tinggi pelindung sel.', emoji: '🫘',
      },
      dinner: {
        id: 'jum-dn-s', name: 'Rawon Daging Sapi + Nasi Putih', shortDesc: 'Sup hitam kluwek khas Jawa Timur.',
        householdPortion: '1.2 centong nasi putih (~120g) + 1 mangkok rawon (4 potong daging sapi empuk + tauge)',
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
        householdPortion: '1.5 centong nasi (~150g) + 0.5 kaleng sarden saus tomat tumis cabai',
        ingredients: '150g nasi, 1/2 kaleng sarden tomat, cabai, bawang merah, tomat segar',
        calories: 450, protein: 22, carbs: 58, fat: 14, priceEstimateIdr: 8000, prepTime: '8 menit',
        cookTip: 'Tumis bawang merah dan cabai, masukkan sarden dan tomat segar.', benefits: 'Sarden kaya kalsium (tulangnya bisa dimakan) dan omega-3.', emoji: '🥫',
      },
      lunch: {
        id: 'sab-lu-b', name: 'Mie Ayam Bakso Mangkok', shortDesc: 'Jajanan legendaris Indonesia yang mengenyangkan.',
        householdPortion: '1 porsi mie ayam basah + 2 butir bakso sapi + 1 mangkok sawi hijau rebus',
        ingredients: '1 porsi mie ayam, 2 biji bakso sapi, pangsit goreng kecil, sawi hijau',
        calories: 500, protein: 24, carbs: 68, fat: 14, priceEstimateIdr: 12000, prepTime: 'Beli siap saji',
        cookTip: 'Minta sawi diperbanyak, skip kerupuk untuk kurangi lemak.', benefits: 'Mie gandum memberi karbohidrat, bakso sapi memberi protein.', emoji: '🍜',
      },
      snack: {
        id: 'sab-sn-b', name: 'Martabak Telur Mini Gurih', shortDesc: 'Jajan protein telur renyah berpadu rempah bawang.',
        householdPortion: '2 potong martabak telur mini + acar timun cabai rawit',
        ingredients: '2 butir telur kocok, irisan daun bawang tebal, kulit martabak tipis renyah',
        calories: 220, protein: 12, carbs: 18, fat: 11, priceEstimateIdr: 6000, prepTime: '10 menit',
        cookTip: 'Lipat rapi amplop kulit martabak, goreng teflon dengan api sedang agar kulit renyah.', benefits: 'Kolin telur mendukung fungsi saraf motorik saat berolahraga di akhir pekan.', emoji: '🥟',
      },
      dinner: {
        id: 'sab-dn-b', name: 'Nasi + Sop Buntut Sederhana', shortDesc: 'Sop hangat tulang sapi kaya kolagen.',
        householdPortion: '1.5 centong nasi (~150g) + 1 mangkok sop buntut/daging sapi + sayur wortel kentang',
        ingredients: '150g nasi, sop buntut sapi (wortel, kentang, tomat, seledri)',
        calories: 430, protein: 25, carbs: 54, fat: 12, priceEstimateIdr: 10000, prepTime: '25 menit',
        cookTip: 'Rebus buntut hingga empuk, buang lemak mengambang di permukaan.', benefits: 'Kolagen dari tulang sapi baik untuk sendi dan kulit.', emoji: '🍲',
      },
    },
    standard: {
      breakfast: {
        id: 'sab-bf-s', name: 'Nasi Goreng Seafood Spesial', shortDesc: 'Nasi goreng premium akhir pekan.',
        householdPortion: '1.5 centong nasi goreng (~150g) + 4 ekor udang + 3 potong cumi + 1 butir telur',
        ingredients: '150g nasi goreng, udang, cumi, telur, sawi hijau, acar',
        calories: 500, protein: 26, carbs: 60, fat: 17, priceEstimateIdr: 18000, prepTime: '15 menit',
        cookTip: 'Gunakan nasi dingin, api besar, dan kecap manis secukupnya.', benefits: 'Seafood kaya zinc untuk imunitas dan hormon metabolisme.', emoji: '🍳',
      },
      lunch: {
        id: 'sab-lu-s', name: 'Nasi + Ayam Betutu Bali + Sayur Urap', shortDesc: 'Ayam bumbu rempah khas upacara Bali.',
        householdPortion: '1.4 centong nasi putih (~140g) + 1 potong ayam betutu dada (~100g) + 2 sdm urap sayur kelapa',
        ingredients: '140g nasi, 100g ayam betutu, sayur urap (kacang panjang, tauge, kelapa parut)',
        calories: 550, protein: 36, carbs: 56, fat: 18, priceEstimateIdr: 22000, prepTime: 'Beli / 2 jam',
        cookTip: 'Pilih bagian dada tanpa kulit untuk protein lebih dan lemak lebih sedikit.', benefits: 'Bumbu betutu (basa genep) mengandung rempah anti-inflamasi lengkap.', emoji: '🍗',
      },
      snack: {
        id: 'sab-sn-s', name: 'Tahu Bakso Sapi Super Kuah Segar', shortDesc: 'Jajan khas ungaran padat daging sapi giling premium.',
        householdPortion: '3 potong tahu bakso sapi super + 1 mangkok kecil kuah kaldu seledri',
        ingredients: '3 potong tahu pong isi daging sapi giling lada putih, taburan seledri dan kuah kaldu tulang',
        calories: 220, protein: 17, carbs: 14, fat: 10, priceEstimateIdr: 13000, prepTime: '8 menit',
        cookTip: 'Kukus tahu bakso sampai kenyal padat, siram kuah panas dengan perasan jeruk nipis.', benefits: 'Sumber asam amino murni glutamin untuk pemulihan jaringan usus dan otot.', emoji: '🍢',
      },
      dinner: {
        id: 'sab-dn-s', name: 'Steak Tempe + Mashed Potato + Salad', shortDesc: 'Versi nabati steak yang kaya protein.',
        householdPortion: '1 potong besar steak tempe bakar (~150g) + 2 centong kentang tumbuk (~100g) + salad',
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
        householdPortion: '1.5 centong nasi uduk (~150g) + 1 butir telur dadar + 2 sdm tempe orek manis',
        ingredients: '150g nasi uduk, 1 telur dadar, tempe orek kecap, kerupuk',
        calories: 460, protein: 17, carbs: 64, fat: 15, priceEstimateIdr: 7000, prepTime: 'Beli siap saji',
        cookTip: 'Skip kerupuk dan kurangi santan jika ingin lebih sehat.', benefits: 'Sarapan lengkap karbohidrat + protein + lemak untuk energi libur.', emoji: '🍚',
      },
      lunch: {
        id: 'min-lu-b', name: 'Nasi + Opor Ayam Kuah Kuning + Lalapan', shortDesc: 'Opor rumahan dengan bumbu kuning sederhana.',
        householdPortion: '1.5 centong nasi (~150g) + 1 potong opor ayam (paha atas) + 1 mangkok kuah santan encer',
        ingredients: '150g nasi, 1 potong ayam opor (paha atas), kuah opor kuning, lalapan',
        calories: 520, protein: 28, carbs: 58, fat: 18, priceEstimateIdr: 12000, prepTime: '30 menit',
        cookTip: 'Gunakan santan encer dan buang kulit ayam untuk kurangi lemak.', benefits: 'Kunyit dalam opor mengandung kurkumin anti-inflamasi.', emoji: '🍗',
      },
      snack: {
        id: 'min-sn-b', name: 'Roti Bakar Selai Kacang Pisang', shortDesc: 'Jajan santai akhir pekan tinggi energi sehat.',
        householdPortion: '1 tangkup (2 lembar) roti bakar + 1.5 sdm selai kacang gurih + 1 buah pisang iris',
        ingredients: '2 lembar roti tawar, 1.5 sdm selai kacang tanah, 1 buah pisang matang',
        calories: 240, protein: 9, carbs: 36, fat: 8, priceEstimateIdr: 6000, prepTime: '5 menit',
        cookTip: 'Panggang roti di teflon kering tanpa margarin berlebih.', benefits: 'Kombinasi asam folat, vitamin B6, dan serat untuk menjaga kebugaran akhir pekan.', emoji: '🍞',
      },
      dinner: {
        id: 'min-dn-b', name: 'Nasi + Sayur Lodeh + Telur Bumbu Kuning', shortDesc: 'Lodeh sayur nusantara hangat malam Minggu.',
        householdPortion: '1.5 centong nasi (~150g) + 1 butir telur rebus bumbu kuning + 1 mangkok sayur lodeh labu tempe',
        ingredients: '150g nasi, sayur lodeh (labu, tempe, tahu, nangka muda), 1 telur bumbu kuning',
        calories: 440, protein: 18, carbs: 62, fat: 13, priceEstimateIdr: 8000, prepTime: '25 menit',
        cookTip: 'Gunakan santan encer. Masukkan labu terakhir agar tidak terlalu lembek.', benefits: 'Nangka muda kaya serat dan labu kaya beta-karoten.', emoji: '🥘',
      },
    },
    standard: {
      breakfast: {
        id: 'min-bf-s', name: 'French Toast + Buah Segar + Madu', shortDesc: 'Brunch akhir pekan ala kafe.',
        householdPortion: '2 lembar roti celup telur panggang + 1 sdm madu + irisan buah pisang/stroberi',
        ingredients: '2 lembar roti, 1 telur, susu, kayu manis, stroberi/pisang, 1 sdm madu',
        calories: 420, protein: 15, carbs: 56, fat: 15, priceEstimateIdr: 13000, prepTime: '10 menit',
        cookTip: 'Celup roti di campuran telur-susu-kayu manis, panggang teflon.', benefits: 'Kayu manis membantu regulasi gula darah.', emoji: '🍞',
      },
      lunch: {
        id: 'min-lu-s', name: 'Nasi + Bebek Goreng Sambal Korek + Lalapan', shortDesc: 'Bebek crispy khas lamongan.',
        householdPortion: '1.4 centong nasi putih (~140g) + 1 potong bebek bakar/goreng tiris (~100g) + lalapan',
        ingredients: '140g nasi, 1 potong bebek goreng, sambal korek, lalapan lengkap',
        calories: 580, protein: 32, carbs: 56, fat: 24, priceEstimateIdr: 25000, prepTime: 'Beli siap saji',
        cookTip: 'Buang kulit bebek jika ingin kurangi lemak jenuh secara drastis.', benefits: 'Bebek kaya vitamin B dan zat besi heme.', emoji: '🦆',
      },
      snack: {
        id: 'min-sn-s', name: 'Pisang Keju Panggang Tabur Almond', shortDesc: 'Jajan spesial manis gurih kaya vitamin E dan kalsium.',
        householdPortion: '2 buah pisang kepok panggang + 1 sdm keju cheddar parut + 1 sdm irisan kacang almond sangrai',
        ingredients: '2 buah pisang kepok, 20g keju parut, 15g kacang almond sangrai, 1 sdt madu',
        calories: 230, protein: 7, carbs: 36, fat: 7, priceEstimateIdr: 12000, prepTime: '10 menit',
        cookTip: 'Panggang pisang dengan madu di atas teflon, taburi keju parut dan almond renyah.', benefits: 'Vitamin E almond dan kalsium keju menjaga kesehatan jaringan sendi dan kulit.', emoji: '🍌',
      },
      dinner: {
        id: 'min-dn-s', name: 'Sop Kambing Tanpa Santan + Nasi', shortDesc: 'Sup kambing bening kaya protein.',
        householdPortion: '1.2 centong nasi putih (~120g) + 1 mangkok sop kambing bening (4 potong daging kambing empuk + wortel)',
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
