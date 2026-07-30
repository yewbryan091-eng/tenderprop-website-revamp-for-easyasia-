/* Taxonomy, states and area lists reproduced verbatim from the live
   tenderprop.com tender search. Labels are live wording — do not "tidy". */

export type TypeOption = {
  value: string;
  label: string;
  cat?: string;
  types?: string[];
};

export const TYPE_TAXONOMY: TypeOption[] = [
    { value: "all",            label: "All Property Types" },
    { value: "cat:residential", label: "----All Residential----", cat: "residential" },
    { value: "res-apt",   label: "Apartment/Condominium/Serviced Apartment", types: ["Apartment", "Condominium", "Serviced Apartment", "Serviced Residence"] },
    { value: "res-ter",   label: "Terrace/link/Townhouse",                   types: ["Terrace House", "Link House", "Townhouse"] },
    { value: "res-semid", label: "Semi-D/Bungalow/Villa",                    types: ["Semi-Detached House", "Bungalow", "Villa"] },
    { value: "cat:commercial", label: "----All Commercial----", cat: "commercial" },
    { value: "com-shop",   label: "Shop",                         types: ["Shop"] },
    { value: "com-office", label: "Office",                       types: ["Office"] },
    { value: "com-soho",   label: "Soho/Sovo/Sofo",               types: ["SOHO", "SOVO", "SOFO"] },
    { value: "com-retail", label: "Retail Space/Lot",             types: ["Retail Space", "Retail Lot"] },
    { value: "com-hotel",  label: "Hotel/Resort",                 types: ["Hotel", "Resort"] },
    { value: "com-bldg",   label: "Commercial Building/Bungalow", types: ["Commercial Building", "Commercial Bungalow"] },
    { value: "cat:industrial", label: "----All Industrial----", cat: "industrial" },
    { value: "ind-factory",   label: "Factory",   types: ["Factory"] },
    { value: "ind-warehouse", label: "Warehouse", types: ["Warehouse"] },
    { value: "cat:land", label: "----All Land----", cat: "land" },
    { value: "land-agri",  label: "Agricultural Land", types: ["Agricultural Land"] },
    { value: "land-res",   label: "Residential Land",  types: ["Residential Land"] },
    { value: "land-com",   label: "Commercial Land",   types: ["Commercial Land"] },
    { value: "land-ind",   label: "Industrial Land",   types: ["Industrial Land"] },
    { value: "land-dev",   label: "Development Land",  types: ["Development Land"] },
    { value: "land-plant", label: "Plantation Land",   types: ["Plantation Land"] }
];

export const STATES: { key: string; name: string }[] = [
    { key: "johor", name: "Johor" }, { key: "kedah", name: "Kedah" },
    { key: "kelantan", name: "Kelantan" }, { key: "kl", name: "Kuala Lumpur" },
    { key: "labuan", name: "Labuan" }, { key: "melaka", name: "Melaka" },
    { key: "negeri-sembilan", name: "Negeri Sembilan" }, { key: "pahang", name: "Pahang" },
    { key: "penang", name: "Penang" }, { key: "perak", name: "Perak" },
    { key: "perlis", name: "Perlis" }, { key: "putrajaya", name: "Putrajaya" },
    { key: "sabah", name: "Sabah" }, { key: "sarawak", name: "Sarawak" },
    { key: "selangor", name: "Selangor" }, { key: "terengganu", name: "Terengganu" }
];

export const AREAS: Record<string, string[]> = {
    "johor": ["Johor Bahru","Iskandar Puteri","Skudai","Kulai","Senai","Pasir Gudang","Masai","Ulu Tiram","Tebrau","Mount Austin","Johor Jaya","Permas Jaya","Bukit Indah","Gelang Patah","Tampoi","Larkin","Taman Molek","Setia Tropika","Horizon Hills","Danga Bay","Puteri Harbour","Muar","Batu Pahat","Kluang","Segamat","Pontian","Kota Tinggi","Mersing"],
    "kedah": ["Alor Setar","Sungai Petani","Kulim","Langkawi","Jitra","Baling","Gurun","Pendang","Kuala Kedah","Changlun","Bedong","Lunas","Merbok"],
    "kelantan": ["Kota Bharu","Pasir Mas","Tumpat","Tanah Merah","Gua Musang","Kuala Krai","Pasir Puteh","Bachok","Machang","Jeli","Rantau Panjang","Kubang Kerian"],
    "kl": ["KLCC","Bukit Bintang","Bangsar","Bangsar South","KL Sentral","Mont Kiara","Sri Hartamas","Dutamas","Damansara Heights","Taman Tun Dr Ismail","Desa ParkCity","Bukit Tunku","Ampang","Cheras","Setapak","Wangsa Maju","Setiawangsa","Titiwangsa","Sentul","Segambut","Kepong","Jalan Ipoh","Jalan Kuching","Taman Melawati","Keramat","Bukit Jalil","Sri Petaling","Old Klang Road","Taman Desa","Sungai Besi","Salak South","Seputeh","Kuchai Lama","OUG","Pantai","Pudu","Desa Petaling","Desa Pandan"],
    "labuan": ["Victoria","Bandar Labuan","Rancha-Rancha","Batu Manikar","Layang-Layangan","Patau-Patau","Kiamsam"],
    "melaka": ["Melaka","Melaka City","Ayer Keroh","Bukit Katil","Bukit Beruang","Batu Berendam","Klebang","Bukit Baru","Cheng","Krubong","Bandar Hilir","Ujong Pasir","Semabok","Alor Gajah","Durian Tunggal","Masjid Tanah","Jasin","Merlimau","Bertam"],
    "negeri-sembilan": ["Seremban","Nilai","Port Dickson","Senawang","Sendayan","Mantin","Labu","Rantau","Bahau","Tampin","Rembau","Kuala Pilah","Gemas","Seremban 2","Bandar Sri Sendayan","Lukut","Pajam","Jelebu","Bandar Enstek"],
    "pahang": ["Kuantan","Indera Mahkota","Beserah","Balok","Gebeng","Gambang","Bentong","Genting Highlands","Bukit Tinggi","Temerloh","Mentakab","Raub","Jerantut","Pekan","Kuala Lipis","Bera","Maran","Cameron Highlands","Brinchang","Tanah Rata","Rompin"],
    "penang": ["George Town","Bayan Lepas","Bayan Baru","Gelugor","Jelutong","Air Itam","Tanjung Tokong","Tanjung Bungah","Batu Ferringhi","Pulau Tikus","Green Lane","Sungai Ara","Relau","Batu Maung","Batu Uban","Sungai Nibong","Farlim","Paya Terubong","Balik Pulau","Butterworth","Bukit Mertajam","Seberang Jaya","Perai","Juru","Simpang Ampat","Nibong Tebal"],
    "perak": ["Ipoh","Tambun","Simpang Pulai","Chemor","Meru","Gopeng","Batu Gajah","Kampar","Taiping","Sitiawan","Lumut","Manjung","Teluk Intan","Bidor","Tanjung Malim","Kuala Kangsar","Parit Buntar","Bagan Serai","Slim River","Tapah"],
    "perlis": ["Kangar","Arau","Kuala Perlis","Padang Besar","Simpang Empat","Beseri","Kaki Bukit","Mata Ayer","Sanglang","Chuping","Pauh"],
    "putrajaya": Array.from({ length: 20 }, (_, i) => `Precinct ${i + 1}`),
    "sabah": ["Kota Kinabalu","Penampang","Putatan","Papar","Tuaran","Sandakan","Tawau","Lahad Datu","Keningau","Beaufort","Semporna","Kudat","Ranau","Kota Belud","Inanam","Menggatal","Likas","Sepanggar","Telipok"],
    "sarawak": ["Kuching","Miri","Sibu","Bintulu","Kota Samarahan","Serian","Sri Aman","Limbang","Mukah","Bau","Lundu","Sarikei","Betong","Kapit","Petra Jaya","Matang","Batu Kawa","Tabuan Jaya","Stampin","Stutong"],
    "selangor": ["Petaling Jaya","Subang Jaya","Shah Alam","Puchong","Klang","Kajang","Semenyih","Cyberjaya","Rawang","Sepang","Ara Damansara","Damansara Perdana","Kota Damansara","Bandar Sunway","USJ","Bandar Kinrara","Setia Alam","Setia Eco Park","Kota Kemuning","Bukit Jelutong","Bangi","Serdang","Gombak","Selayang","Batu Caves","Sungai Buloh","Hulu Langat","Kuala Selangor","Banting","Bandar Puteri","Glenmarie","Puncak Alam","Balakong","Bandar Utama","Mutiara Damansara","Kelana Jaya","Damansara Damai","Bandar Sri Damansara","Cheras","Tropicana","Telok Panglima Garang","Dengkil","Jenjarom"],
    "terengganu": ["Kuala Terengganu","Kuala Nerus","Kemaman","Chukai","Dungun","Marang","Besut","Setiu","Hulu Terengganu","Kuala Berang","Jerteh","Gong Badak","Paka","Kerteh"]
};
