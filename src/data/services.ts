export interface Service {
    id: number;
    title: string;
    description: string;
    icon: string;
}

export const services: Service[] = [
    {
        id: 1,
        title: "Bidang Jasa Penilaian Properti",
        description: "Layanan penilaian profesional untuk properti komersial, residensial, tanah, dan aset properti lainnya dengan standar penilaian yang akurat dan terpercaya.",
        icon: "building",
    },
    {
        id: 2,
        title: "Bidang Jasa Penilaian Bisnis",
        description: "Penilaian nilai bisnis untuk merger & akuisisi, IPO, pelaporan keuangan, dan keperluan transaksi bisnis lainnya dengan analisis mendalam.",
        icon: "trending-up",
    },
    {
        id: 3,
        title: "Jasa Analisa Mengenai Dampak Lingkungan",
        description: "Analisis dampak lingkungan yang komprehensif untuk memastikan kepatuhan terhadap regulasi dan praktik pembangunan berkelanjutan.",
        icon: "leaf",
    },
    {
        id: 4,
        title: "Pengawasan Pengelolaan Dana Proyek",
        description: "Pengawasan profesional terhadap pengelolaan dana proyek untuk memastikan transparansi, akuntabilitas, dan alokasi sumber daya yang optimal.",
        icon: "shield-check",
    },
    {
        id: 5,
        title: "Studi Kelayakan",
        description: "Kajian kelayakan proyek yang strategis dengan analisis HBU (Highest and Best Use) untuk memaksimalkan potensi investasi Anda.",
        icon: "file-text",
    },
    {
        id: 6,
        title: "Manajemen Keuangan dan Akunting",
        description: "Layanan manajemen keuangan dan akuntansi profesional untuk mengoptimalkan operasional bisnis dan pelaporan keuangan perusahaan.",
        icon: "calculator",
    },
    {
        id: 7,
        title: "Jasa Agen Properti",
        description: "Layanan agen properti profesional untuk jual beli, sewa menyewa properti komersial dan residensial dengan jaringan luas.",
        icon: "home",
    },
    {
        id: 8,
        title: "Desain Sistem Informasi Aset",
        description: "Perancangan sistem informasi aset yang disesuaikan untuk mempermudah pelacakan, pengelolaan, dan pelaporan aset perusahaan.",
        icon: "database",
    },
    {
        id: 9,
        title: "Pengelolaan Properti",
        description: "Layanan pengelolaan properti menyeluruh termasuk pemeliharaan, hubungan penyewa, dan optimalisasi operasional properti.",
        icon: "key",
    },
];
