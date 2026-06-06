// Maps Japanese ward/city names (as extracted from Google Maps addresses) to English.
// Falls back to the original Japanese string if not found.
// Keys are deduplicated — identical ward names (e.g. 北区) translate the same regardless of city.
const JA_TO_EN: Record<string, string> = {
  // Generic directional/positional wards (appear in many cities)
  '北区': 'Kita', '南区': 'Minami', '東区': 'Higashi', '西区': 'Nishi',
  '中央区': 'Chuo', '中区': 'Naka', '港区': 'Minato',
  '旭区': 'Asahi', '緑区': 'Midori', '青葉区': 'Aoba',
  '泉区': 'Izumi', '栄区': 'Sakae', '鶴見区': 'Tsurumi',
  // Tokyo 23 special wards
  '千代田区': 'Chiyoda', '新宿区': 'Shinjuku', '文京区': 'Bunkyo',
  '台東区': 'Taito', '墨田区': 'Sumida', '江東区': 'Koto',
  '品川区': 'Shinagawa', '目黒区': 'Meguro', '大田区': 'Ota',
  '世田谷区': 'Setagaya', '渋谷区': 'Shibuya', '中野区': 'Nakano',
  '杉並区': 'Suginami', '豊島区': 'Toshima', '荒川区': 'Arakawa',
  '板橋区': 'Itabashi', '練馬区': 'Nerima', '足立区': 'Adachi',
  '葛飾区': 'Katsushika', '江戸川区': 'Edogawa',
  // Osaka wards
  '都島区': 'Miyakojima', '福島区': 'Fukushima', '此花区': 'Konohana',
  '大正区': 'Taisho', '天王寺区': 'Tennoji', '浪速区': 'Naniwa',
  '西淀川区': 'Nishi-Yodogawa', '淀川区': 'Yodogawa',
  '東淀川区': 'Higashi-Yodogawa', '東成区': 'Higashi-Nari', '生野区': 'Ikuno',
  '城東区': 'Joto', '阿倍野区': 'Abeno', '住之江区': 'Suminoe',
  '住吉区': 'Sumiyoshi', '東住吉区': 'Higashi-Sumiyoshi',
  '平野区': 'Hirano', '西成区': 'Nishinari',
  // Yokohama wards
  '神奈川区': 'Kanagawa', '港南区': 'Konan', '保土ヶ谷区': 'Hodogaya',
  '磯子区': 'Isogo', '金沢区': 'Kanazawa', '港北区': 'Kohoku',
  '都筑区': 'Tsuzuki', '戸塚区': 'Totsuka', '瀬谷区': 'Seya',
  // Nagoya wards
  '千種区': 'Chikusa', '中村区': 'Nakamura', '昭和区': 'Showa',
  '瑞穂区': 'Mizuho', '熱田区': 'Atsuta', '中川区': 'Nakagawa',
  '守山区': 'Moriyama', '名東区': 'Meito', '天白区': 'Tenpaku',
  // Kyoto wards
  '上京区': 'Kamigyo', '左京区': 'Sakyo', '中京区': 'Nakagyo',
  '東山区': 'Higashiyama', '下京区': 'Shimogyo', '右京区': 'Ukyo',
  '伏見区': 'Fushimi', '山科区': 'Yamashina', '西京区': 'Nishikyo',
  // Kobe wards
  '灘区': 'Nada', '東灘区': 'Higashinada', '兵庫区': 'Hyogo',
  '長田区': 'Nagata', '須磨区': 'Suma', '垂水区': 'Tarumi',
  // Sapporo wards
  '白石区': 'Shiroishi', '豊平区': 'Toyohira', '厚別区': 'Atsubetsu',
  '手稲区': 'Teine', '清田区': 'Kiyota',
  // Fukuoka wards
  '博多区': 'Hakata', '城南区': 'Jonan', '早良区': 'Sawara',
  // Sendai wards
  '宮城野区': 'Miyagino', '若林区': 'Wakabayashi', '太白区': 'Taihaku',
  // Cities (市)
  '大阪市': 'Osaka', '横浜市': 'Yokohama', '名古屋市': 'Nagoya',
  '札幌市': 'Sapporo', '福岡市': 'Fukuoka', '神戸市': 'Kobe',
  '京都市': 'Kyoto', '仙台市': 'Sendai', '川崎市': 'Kawasaki',
  '千葉市': 'Chiba', '広島市': 'Hiroshima', '北九州市': 'Kitakyushu',
  '新潟市': 'Niigata', '浜松市': 'Hamamatsu', '岡山市': 'Okayama',
  '相模原市': 'Sagamihara', '静岡市': 'Shizuoka', '堺市': 'Sakai',
  '熊本市': 'Kumamoto', '八王子市': 'Hachioji', '立川市': 'Tachikawa',
  '武蔵野市': 'Musashino', '三鷹市': 'Mitaka', '府中市': 'Fuchu',
  '調布市': 'Chofu', '町田市': 'Machida', '小平市': 'Kodaira',
  '日野市': 'Hino', '国分寺市': 'Kokubunji', '国立市': 'Kunitachi',
  '狛江市': 'Komae', '多摩市': 'Tama', '稲城市': 'Inagi',
  '西東京市': 'Nishi-Tokyo', 'さいたま市': 'Saitama',
};

export function translateArea(ja: string): string {
  return JA_TO_EN[ja] ?? ja;
}
