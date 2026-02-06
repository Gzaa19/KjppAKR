import { PrismaClient, NewsCategory } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import "dotenv/config";
import { title } from "process";

function createPrismaClient() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
        throw new Error("DATABASE_URL is not defined");
    }

    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);

    return new PrismaClient({ adapter });
}

const prisma = createPrismaClient();

async function main() {
    console.log("🌱 Starting database seed...\n");

    // Create default admin user
    const adminEmail = "admin@kjpp-akr.com";
    const adminPassword = "admin123"; // Change this in production!

    const existingAdmin = await prisma.users.findUnique({
        where: { email: adminEmail },
    });

    if (existingAdmin) {
        console.log("✅ Admin user already exists:");
        console.log(`   Email: ${existingAdmin.email}`);
        console.log(`   ID: ${existingAdmin.id}`);
        console.log(`   Name: ${existingAdmin.name}`);
    } else {
        const hashedPassword = await bcrypt.hash(adminPassword, 12);

        const admin = await prisma.users.create({
            data: {
                email: adminEmail,
                password: hashedPassword,
                name: "Administrator",
                role: "SUPER_ADMIN",
                isActive: true,
                id: crypto.randomUUID(),
                updatedAt: new Date(),
            },
        });

        console.log("✅ Admin user created successfully!");
        console.log(`   Email: ${admin.email}`);
        console.log(`   Password: ${adminPassword}`);
        console.log(`   ID: ${admin.id}`);
        console.log(`   Name: ${admin.name}`);
        console.log(`   Role: ${admin.role}`);
    }

    // Seed Management Teams
    console.log("\n🌱 Seeding Management Teams...");
    const managementTeams = [
        {
            name: "Ir. H. Anas Karim Rivai, M.Ec.Dev.,MAPPI (Cert.)",
            title: "Pemimpin Rekan",
            image: "/image/manajemen/pakAnas.png",
            description: "Lahir di Pendopo pada tanggal 27 September 1958. Beliau mendapatkan gelar Insinyur dari Universitas Trisakti Jurusan Teknik Elektro tahun 1992 dan Master of Economics of Development dari Universitas Gadjah Mada tahun 2011. Beliau telah lulus Ujian Sertifikasi Penilai (USP) dari Asosiasi Masyarakat Profesi Penilai Indonesia (MAPPI) tahun 1993. Selain berkecimpung di penilaian, beliaujuga aktif di beberapa organisasi, antara lain Masyarakat Profesi Penilai Indonesia (MAPPI) sebagai Ketua Kompartemen Penilai Pertanahan, dan DPN INKINDO sebagai Wakil Bendahara Umum. Berbagai macam pelatihan telah diikuti baik pelatihan yang diselenggarakan oleh internal penilai maupun pelatihan yang diselenggarakan oleh institusi dan lembaga yang lain.",
            isMappiCert: true,
            sortOrder: 1
        },
        {
            name: "Ir. Farid Siradju, MAPPI (Cert.)",
            title: "Rekan",
            image: "/image/manajemen/pakFarid.png",
            description: "Lahir di Ternate pada tanggal 16 Mei 1968. Beliau mendapatkan gelar Insinyur dari Institut Pertanian Bogor Jurusan Pertanian tahun 1995, serta telah lulus mengikuti Ujian Sertifikasi Penilai (USP) dari Asosiasi Masyarakat Profesi Penilai Indonesia (MAPPI) tahun 2000. Untuk meningkatkan kompetensi di dalam ilmu penilaian, beliau telah mengikuti berbagai macam pelatihan, baik pelatihan yang dilakukan oleh internal asosiasi ataupun di luar itu. Keahlian yang dimiliki yaitu penilaian properti, pengawasan proyek, studi kelayakan serta studi-studi lainnya.",
            isMappiCert: true,
            sortOrder: 2
        },
        {
            name: "Achmad Nurcholis Sofyan, ST., MAPPI (Cert.)",
            title: "Rekan",
            image: "/image/manajemen/pakKholis.png",
            description: "Lahir di Jakarta pada tanggal 04 September 1988. Beliau mendapatkan gelar Sarjana Teknik dari Universitas Tarumanagara tahun 2010, serta telah lulus mengikuti Ujian Sertifikasi Penilai (USP) dari Asosiasi Masyarakat Profesi Penilai Indonesia (MAPPI) tahun 2021. Beliau memiliki pengalaman dalam bidang penilaian aset daerah, penilaian tanah bangunan, serta beberapa pengalaman lainnya.",
            isMappiCert: true,
            sortOrder: 3
        },
        {
            name: "Ifan Fauzan, SE., MAPPI (Cert.)",
            title: "Rekan",
            image: "/image/manajemen/pakIfan.png",
            description: "Lahir di Jakarta pada tanggal 27 Mei 1974. Beliau mendapatkan gelar Sarjana Ekonomi Akuntansi dari Universitas Pasundan tahun 1999, serta telah lulus mengikuti Ujian Sertifikasi Penilai (USP) dari Asosiasi Masyarakat Profesi Penilai Indonesia (MAPPI) tahun 2019. Beliau memiliki pengalaman dalam bidang penilaian aset daerah, penilaian tanah bangunan, serta beberapa pengalaman lainnya.",
            isMappiCert: true,
            sortOrder: 4
        },
        {
            name: "Yanuar Ari Wibowo, S.P., MAPPI (Cert.)",
            title: "Rekan",
            image: "/image/manajemen/pakYanuar.png",
            description: "Lahir di Jakarta pada tanggal 31 Januari 1983. Beliau mendapatkan gelar Sarjana Pertanian dari Institut Pertanian Bogor tahun 2006, serta telah lulus mengikuti Ujian Sertifikasi Penilai (USP) dari Asosiasi Masyarakat Profesi Penilai Indonesia (MAPPI) tahun 2012. Beliau memiliki pengalaman dalam bidang penilaian Bisnis, serta beberapa pengalaman lainnya.",
            isMappiCert: true,
            sortOrder: 5
        },
        {
            name: "Andri Kurniawan",
            title: "Rekan",
            image: "/image/manajemen/pakAndri.png",
            description: "Lahir di Bogor pada tanggal 29 Maret 1995. Beliau memiliki pengalaman dalam bidang Administrasi Tender dari Tahun 2013 - Sekarang.",
            isMappiCert: false,
            sortOrder: 6
        },
        {
            name: "Say Barian Alzairi, S.E, M.Ec.Dev, MAPPI (Cert.)",
            title: "Rekan",
            image: "/image/manajemen/pakEry.png",
            description: "Lahir di Jakarta pada tanggal ... . Beliau memiliki pengalaman dalam bidang Administrasi Tender dari Tahun ... - Sekarang.",
            isMappiCert: true,
            sortOrder: 7
        }
    ];

    for (const team of managementTeams) {
        const existingTeam = await prisma.managementTeam.findFirst({
            where: { name: team.name }
        });

        if (!existingTeam) {
            await prisma.managementTeam.create({
                data: {
                    ...team,
                    id: crypto.randomUUID(),
                    updatedAt: new Date(),
                }
            });
        }
    }
    console.log(`✅ Seeded ${managementTeams.length} management teams`);

    // Seed Client Categories
    console.log("\n🌱 Seeding Client Categories...");
    const clientCategories = [
        { name: "Bank BUMN/Swasta", slug: "bank-bumn-swasta", sortOrder: 1, isActive: true },
        { name: "Non Bank", slug: "non-bank", sortOrder: 2, isActive: true },
        { name: "Instansi Pemerintah", slug: "instansi-pemerintah", sortOrder: 3, isActive: true },
        { name: "Perusahaan Swasta", slug: "perusahaan-swasta", sortOrder: 4, isActive: true },
        { name: "BUMN", slug: "bumn", sortOrder: 5, isActive: true },
        { name: "Perorangan", slug: "perorangan", sortOrder: 6, isActive: true },
    ];

    for (const category of clientCategories) {
        await prisma.client_categories.upsert({
            where: { slug: category.slug },
            update: { name: category.name, sortOrder: category.sortOrder, isActive: category.isActive, updatedAt: new Date() },
            create: { ...category, id: crypto.randomUUID(), updatedAt: new Date() },
        });
    }
    console.log(`✅ Seeded ${clientCategories.length} client categories`);

    // Seed Clients
    console.log("\n🌱 Seeding Clients...");

    // Get category IDs for reference
    const bankCategory = await prisma.client_categories.findUnique({
        where: { slug: "bank-bumn-swasta" }
    });
    const nonBankCategory = await prisma.client_categories.findUnique({
        where: { slug: "non-bank" }
    });

    if (!bankCategory || !nonBankCategory) {
        console.error("⚠️  Warning: Categories not found, skipping client seeding");
    } else {
        const clients = [
            // Bank BUMN/Swasta
            { name: "PT. Bank Central Asia (Persero) Tbk", logo: "/image/client/bumn/bca.png", categoryId: bankCategory.id, sortOrder: 1 },
            { name: "PT. Bank Rakyat Indonesia (Persero) Tbk", logo: "/image/client/bumn/bri.png", categoryId: bankCategory.id, sortOrder: 2 },
            { name: "PT. Bank Syariah Indonesia Tbk", logo: "/image/client/bumn/bsi.png", categoryId: bankCategory.id, sortOrder: 3 },
            { name: "PT. Bank Tabungan Negara (Persero) Tbk", logo: "/image/client/bumn/btn.png", categoryId: bankCategory.id, sortOrder: 4 },
            { name: "PT. Bank Mandiri (Persero) Tbk", logo: "/image/client/bumn/mandiri.png", categoryId: bankCategory.id, sortOrder: 5 },
            // Non Bank
            { name: "PT. Pertamina (Persero)", logo: "/image/client/nonBank/pertamina.png", categoryId: nonBankCategory.id, sortOrder: 1 },
            { name: "PT. Pertamina Hulu Energi", logo: "/image/client/nonBank/pertaminahe.png", categoryId: nonBankCategory.id, sortOrder: 2 },
            { name: "Dana Pensiun Pertamina", logo: "/image/client/nonBank/dppertamina.png", categoryId: nonBankCategory.id, sortOrder: 3 },
            { name: "PT. Pertamina Internasional EP", logo: "/image/client/nonBank/pertaminiep.png", categoryId: nonBankCategory.id, sortOrder: 4 },
            { name: "PT. Multimedia Nusantara (Telkom Metra)", logo: "/image/client/nonBank/telkommetra.png", categoryId: nonBankCategory.id, sortOrder: 5 },
        ];

        for (const client of clients) {
            const existingClient = await prisma.clients.findFirst({
                where: { name: client.name }
            });

            if (!existingClient) {
                await prisma.clients.create({
                    data: {
                        ...client,
                        id: crypto.randomUUID(), // Need ID
                        updatedAt: new Date(),   // Need updatedAt
                        isPublished: true
                    }
                });
            }
        }
        console.log(`✅ Seeded ${clients.length} clients`);
    }

    // Get admin user ID for news
    const admin = await prisma.users.findUnique({
        where: { email: adminEmail }
    });

    if (!admin) {
        throw new Error("Admin user not found");
    }

    // Seed Publikasi
    console.log("\n🌱 Seeding Publikasi...");
    const newsArticles = [
        {
            title: "Wajah Baru Digital: Peluncuran Website Resmi KJPP Anas Karim Rivai & Rekan",
            slug: "wajah-baru-digital-peluncuran-website-resmi-kjpp-anas-karim-rivai-rekan",
            excerpt: "KJPP Anas Karim Rivai & Rekan resmi meluncurkan website company profile dengan tampilan yang lebih modern dan dinamis. Langkah ini diambil untuk meningkatkan transparansi informasi layanan, profil tim ahli, dan kredibilitas perusahaan bagi seluruh mitra kerja.",
            content: `Pembaruan Layanan Digital untuk Kredibilitas dan Transparansi\n\nSejalan dengan visi kami untuk menjadi perusahaan yang kuat dan tumbuh dalam industri penilaian di tingkat nasional maupun internasional, KJPP Anas Karim Rivai & Rekan dengan bangga memperkenalkan Website Company Profile terbaru kami.\n\nSebelumnya, akses informasi digital mengenai perusahaan sempat terbatas. Kini, kami menghadirkan platform digital yang dinamis dan informatif sebagai sarana komunikasi resmi dengan publik dan klien.\n\nFitur dan Informasi Utama: Website baru ini dirancang untuk memudahkan Anda mengakses berbagai informasi krusial, antara lain:\n* Profil & Legalitas: Informasi lengkap mengenai sejarah, visi-misi, dan legalitas perusahaan untuk menjamin kepercayaan Anda.\n* Layanan Penilaian: Penjelasan rinci mengenai jasa Penilaian Properti, Penilaian Bisnis, dan Konsultasi.\n* Manajemen Tim: Profil tenaga ahli profesional yang siap menangani kebutuhan penilaian aset Anda.\n* Portofolio Klien: Rekam jejak pengalaman kami dalam melayani berbagai sektor industri.\n\nKami berharap kehadiran website ini dapat mempermudah calon klien dan mitra kerja dalam mengenal KJPP Anas Karim Rivai & Rekan lebih dekat, serta mendapatkan layanan penilaian yang profesional dan terpercaya.`,
            coverImage: "/image/news/berita1.png",
            category: NewsCategory.BERITA,
            isPublished: true,
            publishedAt: new Date("2026-02-01"),
            authorId: admin.id
        },
        {
            title: "KJPP Anas Karim Rivai & Rekan Luncurkan SI-MAPAN: Solusi Digital Transparansi Penilaian Aset",
            slug: "kjpp-anas-karim-rivai-rekan-luncurkan-si-mapan-solusi-digital-transparansi-penilaian-aset",
            excerpt: "Jakarta - Sebagai wujud komitmen untuk menjadi perusahaan yang kuat dan tumbuh dalam industri penilaian di tingkat nasional maupun internasional, KJPP Anas Karim Rivai & Rekan dengan bangga memperkenalkan inovasi digital terbaru, SI-MAPAN (Sistem Informasi Manajemen dan Pantau Penilaian).",
            content: `Jakarta - Sebagai wujud komitmen untuk menjadi perusahaan yang kuat dan tumbuh dalam industri penilaian di tingkat nasional maupun internasional, KJPP Anas Karim Rivai & Rekan dengan bangga memperkenalkan inovasi digital terbaru, SI-MAPAN (Sistem Informasi Manajemen dan Pantau Penilaian).
                    Sistem ini hadir sebagai jawaban atas tantangan operasional dalam proses penilaian aset yang panjang dan bertahap. Sebelumnya, klien seringkali merasa cemas menunggu hasil dan harus menghubungi admin berulang kali hanya untuk menanyakan progres pekerjaan. Hal ini tidak hanya membebani waktu klien, tetapi juga menghambat efisiensi tim admin kami.
                    Dengan hadirnya SI-MAPAN, kami menghadirkan fitur unggulan "Cek Resi" atau Tracking Publik. Fitur ini memungkinkan klien untuk memantau status pekerjaan secara mandiri, real-time, dan transparan.
                    Keunggulan Utama SI-MAPAN:
                    - Akses Mudah Tanpa Login: Klien cukup memasukkan Kode Unik (Tiket) untuk melihat progres, tanpa perlu repot melakukan registrasi akun.
                    - Informasi Real-Time: Status pengerjaan—mulai dari inspeksi lapangan hingga penerbitan laporan dapat dipantau saat itu juga.
                    - Efisiensi Layanan: Mengurangi waktu tunggu respon admin, sehingga proses penyelesaian laporan penilaian menjadi lebih fokus dan cepat.`,
            coverImage: "/image/news/berita2.png",
            category: NewsCategory.BERITA,
            isPublished: true,
            publishedAt: new Date("2026-02-01"),
            authorId: admin.id
        },
        {
            title: "KJPP Anas Karim Rivai & Rekan Perluas Jangkauan Layanan, Kini Hadir di Palembang, Bandung, dan Surabaya",
            slug: "kjpp-anas-karim-rivai-rekan-perluas-jangkauan-layanan-kini-hadir-di-palembang-bandung-dan-surabaya",
            excerpt: "JAKARTA - Kantor Jasa Penilai Publik Anas Karim Rivai & Rekan (KJPP AKR), salah satu firma penilai terkemuka di Indonesia, secara resmi mengumumkan penguatan jaringan layanannya di tingkat nasional. Dengan pusat operasional yang berkedudukan di Jakarta, kini KJPP AKR telah efektif mengoperasikan kantor cabang di tiga kota besar: Palembang, Bandung, dan Surabaya.",
            content: `JAKARTA - Kantor Jasa Penilai Publik Anas Karim Rivai & Rekan (KJPP AKR), salah satu firma penilai terkemuka di Indonesia, secara resmi mengumumkan penguatan jaringan layanannya di tingkat nasional. Dengan pusat operasional yang berkedudukan di Jakarta, kini KJPP AKR telah efektif mengoperasikan kantor cabang di tiga kota besar: Palembang, Bandung, dan Surabaya.
                    Langkah ini diambil sebagai bagian dari strategi pertumbuhan perusahaan untuk memberikan layanan yang lebih responsif dan kompetitif bagi para klien di wilayah Sumatera, Jawa Barat, hingga Jawa Timur.
                    Komitmen Dekat dengan Klien
                    Kehadiran cabang-cabang baru ini diharapkan dapat memangkas jarak koordinasi serta mempercepat proses penilaian (appraisal) bagi perbankan, instansi pemerintah, maupun sektor swasta di daerah.
                    "Kehadiran kami di Palembang, Bandung, dan Surabaya adalah bukti komitmen kami untuk selalu dekat dengan klien. Meskipun kendali pusat tetap berada di Jakarta, setiap cabang dibekali dengan tenaga ahli yang kompeten dan standar operasional yang sama ketatnya," ujar perwakilan manajemen KJPP AKR.
                    Layanan Unggulan
                    Seluruh kantor cabang KJPP AKR kini sudah siap melayani berbagai kebutuhan jasa penilaian, antara lain:
                    - Penilaian Properti: Tanah, bangunan, serta sarana pelengkap lainnya.
                    - Penilaian Bisnis: Saham, surat berharga, dan opini kewajaran.
                    - Penilaian Aset Mesin & Peralatan: Inventarisasi aset industri dan manufaktur.
                    - Studi Kelayakan: Analisis aspek ekonomi dan pasar bagi proyek baru.`,
            coverImage: "/image/news/berita3.png",
            category: NewsCategory.PENGUMUMAN,
            isPublished: true,
            publishedAt: new Date("2025-01-15"),
            authorId: admin.id
        },
        {
            title: "Memasuki 2026, Mengapa Jasa Penilai Publik Menjadi Kunci Mitigasi Risiko Finansial Anda?",
            slug: "memasuki-2026-mengapa-jasa-penilai-publik-menjadi-kunci-mitigasi-risiko-finansial-anda",
            excerpt: "JAKARTA - Memasuki tahun 2026, dinamika ekonomi nasional dan global menuntut para pelaku bisnis maupun individu untuk lebih cermat dalam mengelola aset. Di tengah fluktuasi harga properti dan perubahan regulasi perpajakan, peran Kantor Jasa Penilai Publik (KJPP) kini bukan lagi sekadar pelengkap administrasi, melainkan instrumen vital dalam mitigasi risiko finansial.",
            content: `JAKARTA - Memasuki tahun 2026, dinamika ekonomi nasional dan global menuntut para pelaku bisnis maupun individu untuk lebih cermat dalam mengelola aset. Di tengah fluktuasi harga properti dan perubahan regulasi perpajakan, peran Kantor Jasa Penilai Publik (KJPP) kini bukan lagi sekadar pelengkap administrasi, melainkan instrumen vital dalam mitigasi risiko finansial.
                    KJPP Anas Karim Rivai & Rekan (AKR) menyoroti beberapa alasan krusial mengapa penilaian aset profesional menjadi sangat penting di tahun ini.
                    1. Keakuratan Nilai untuk Pengajuan Kredit
                    Dalam proses perbankan, nilai agunan yang akurat adalah syarat mutlak. Dengan standar penilaian yang ketat pada tahun 2026, bank memerlukan laporan dari KJPP yang kredibel untuk menentukan Loan to Value (LTV) yang tepat. Penilaian yang objektif membantu nasabah mendapatkan plafon kredit yang maksimal sekaligus menjaga kesehatan rasio kredit bank.
                    2. Strategi Ekspansi: Merger dan Akuisisi
                    Bagi korporasi yang merencanakan merger atau akuisisi di tahun ini, mengetahui nilai wajar (fair value) dari sebuah entitas bisnis atau aset tetap adalah langkah awal yang menentukan keberhasilan negosiasi. KJPP AKR menyediakan jasa penilaian bisnis yang komprehensif untuk memastikan keputusan investasi didasarkan pada data yang valid, bukan sekadar estimasi.
                    3. Kepatuhan Pajak dan Pelaporan Aset
                    Regulasi pajak yang semakin transparan menuntut pelaporan aset yang jujur dan sesuai pasar. Penilaian dari KJPP memberikan dasar yang kuat bagi wajib pajak dalam melaporkan asetnya, sehingga terhindar dari sanksi atau perselisihan dengan otoritas pajak di kemudian hari.
                    4. Transparansi melalui Teknologi Digital
                    Menjawab tantangan kecepatan di tahun 2026, KJPP AKR kini mengintegrasikan sistem SI-MAPAN. Sistem ini memungkinkan klien memantau proses penilaian secara transparan. Kecepatan data ini sangat membantu manajemen dalam mengambil keputusan darurat di tengah kondisi pasar yang dinamis.
                    "Di KJPP AKR, kami tidak hanya memberikan angka, tetapi kami memberikan kepastian hukum dan finansial. Di tengah ketidakpastian ekonomi, nilai aset yang akurat adalah jangkar bagi setiap keputusan besar," ujar perwakilan manajemen KJPP AKR.
                    Kesimpulan
                    Baik untuk tujuan penjaminan utang, laporan keuangan, hingga urusan hukum, jasa penilai publik memastikan bahwa setiap rupiah dari aset Anda diakui sesuai dengan kondisi pasar yang sebenarnya.
                    Ingin Berkonsultasi Mengenai Aset Anda?
                    Jangan biarkan aset Anda dinilai tanpa dasar yang kuat. Hubungi kantor pusat KJPP AKR di Jakarta atau kunjungi cabang terbaru kami di Palembang, Bandung, dan Surabaya untuk solusi penilaian yang profesional dan terpercaya.`,
            coverImage: "/image/news/berita4.png",
            category: NewsCategory.ARTIKEL,
            isPublished: true,
            publishedAt: new Date("2026-01-10"),
            authorId: admin.id
        },
        {
            title: "Menciptakan Standar Baru: Intip Budaya Kerja Profesional dan Modern di Kantor Pusat KJPP AKR Jakarta",
            slug: "menciptakan-standar-baru-intip-budaya-kerja-profesional-dan-modern-di-kantor-pusat-kjpp-akr-jakarta",
            excerpt: "JAKARTA - Di balik reputasinya sebagai salah satu Kantor Jasa Penilai Publik (KJPP) terkemuka, KJPP Anas Karim Rivai & Rekan (AKR) menyimpan kunci kesuksesan yang terletak pada lingkungan kerjanya. Berkantor pusat di Jakarta, KJPP AKR mengusung konsep budaya kerja yang memadukan kedisiplinan tinggi dengan inovasi teknologi.",
            content: `JAKARTA - Di balik reputasinya sebagai salah satu Kantor Jasa Penilai Publik (KJPP) terkemuka, KJPP Anas Karim Rivai & Rekan (AKR) menyimpan kunci kesuksesan yang terletak pada lingkungan kerjanya. Berkantor pusat di Jakarta, KJPP AKR mengusung konsep budaya kerja yang memadukan kedisiplinan tinggi dengan inovasi teknologi.
                    Memasuki tahun 2026, KJPP AKR tidak hanya fokus pada ekspansi cabang ke Palembang, Bandung, dan Surabaya, tetapi juga pada peningkatan kualitas lingkungan kerja bagi para staf dan tenaga ahlinya.

                    Ekosistem Kerja yang Kolaboratif
                    Sebagai kantor yang menangani proyek-proyek strategis nasional, kolaborasi antar departemen menjadi nyawa utama. Di kantor pusat Jakarta, suasana kerja dirancang untuk mendukung komunikasi yang cepat antara penilai senior dan tim pendukung teknis.

                    "Kami percaya bahwa lingkungan kerja yang nyaman dan suportif akan menghasilkan analisis yang lebih tajam dan akurat. Di sini, setiap pendapat dihargai, dan setiap data diperiksa secara berlapis demi kepuasan klien," ujar salah satu anggota tim manajemen.

                    Fasilitas Modern untuk Kinerja Maksimal
                    Kantor pusat KJPP AKR kini dilengkapi dengan berbagai fasilitas modern, mulai dari ruang rapat berbasis teknologi konferensi video untuk koordinasi dengan kantor cabang, hingga area kerja yang paperless berkat integrasi sistem SI-MAPAN. Hal ini mencerminkan komitmen perusahaan terhadap efisiensi dan keberlanjutan lingkungan.

                    Ruang Bagi Talenta Muda
                    KJPP AKR juga dikenal sebagai tempat yang inklusif bagi talenta muda. Melalui program magang dan pengembangan karir, mahasiswa dari berbagai latar belakang—seperti Informatika dan Ekonomi—diberikan ruang untuk belajar langsung di lapangan. Hal ini menciptakan energi baru yang membuat KJPP AKR selalu relevan dengan perkembangan zaman.

                    Melayani dengan Sepenuh Hati
                    Dengan lingkungan kerja yang sehat, KJPP AKR memastikan bahwa setiap klien yang datang, baik ke kantor pusat di Jakarta maupun ke cabang-cabang di daerah, akan disambut dengan pelayanan yang ramah dan profesional.

                    Kunjungi Kami: Rasakan pengalaman layanan penilaian aset yang transparan dan profesional. Kantor Pusat kami di Jakarta dan kantor cabang kami di daerah siap membantu kebutuhan appraisal Anda dengan standar terbaik di Indonesia.`,
            coverImage: "/image/news/berita5.png",
            category: NewsCategory.ARTIKEL,
            isPublished: true,
            publishedAt: new Date("2026-01-20"),
            authorId: admin.id
        }
    ];

    for (const news of newsArticles) {
        const existingNews = await prisma.news.findUnique({
            where: { slug: news.slug }
        });

        if (!existingNews) {
            await prisma.news.create({
                data: { ...news, id: crypto.randomUUID(), updatedAt: new Date() }
            });
        } else {
            await prisma.news.update({
                where: { slug: news.slug },
                data: { ...news, updatedAt: new Date() }
            });
        }
    }
    console.log(`✅ Seeded ${newsArticles.length} publikasi`);

    console.log("\n🌱 Seeding Gallery...");

    const albums = [
        {
            name: "Kegiatan Kantor",
            slug: "kegiatan-kantor",
            description: "Dokumentasi kegiatan sehari-hari di kantor",
            sortOrder: 1,
            isActive: true
        },
        {
            name: "Survei Lapangan",
            slug: "survei-lapangan",
            description: "Dokumentasi kegiatan survei dan penilaian di lapangan",
            sortOrder: 2,
            isActive: true
        },
        {
            name: "Workshop & Seminar",
            slug: "workshop-seminar",
            description: "Dokumentasi workshop dan seminar yang diselenggarakan",
            sortOrder: 3,
            isActive: true
        },
        {
            name: "Rapat & Pertemuan",
            slug: "rapat-pertemuan",
            description: "Dokumentasi rapat koordinasi dan pertemuan dengan klien",
            sortOrder: 4,
            isActive: true
        },
    ];

    const createdAlbums: any[] = [];
    for (const album of albums) {
        const existingAlbum = await prisma.albums.findUnique({
            where: { slug: album.slug }
        });

        if (!existingAlbum) {
            const newAlbum = await prisma.albums.create({
                data: { ...album, id: crypto.randomUUID(), updatedAt: new Date() }
            });
            createdAlbums.push(newAlbum);
        } else {
            createdAlbums.push(existingAlbum);
        }
    }
    console.log(`✅ Seeded ${albums.length} albums`);

    const galleries = [
        {
            title: "Team Building 2024",
            description: "Kegiatan team building tahunan KJPP AKR",
            imageUrl: "/image/gallery/team-building.jpg",
            albumId: createdAlbums[0]?.id,
            eventDate: new Date("2024-10-30"),
            sortOrder: 1,
            isPublished: true,
            uploadedById: admin.id
        },
        {
            title: "Perayaan HUT KJPP AKR",
            description: "Perayaan ulang tahun KJPP AKR yang ke-20",
            imageUrl: "/image/gallery/hut-kjpp.jpg",
            albumId: createdAlbums[0]?.id,
            eventDate: new Date("2024-09-15"),
            sortOrder: 2,
            isPublished: true,
            uploadedById: admin.id
        },
        {
            title: "Gathering Karyawan",
            description: "Acara gathering karyawan di Puncak",
            imageUrl: "/image/gallery/gathering.jpg",
            albumId: createdAlbums[0]?.id,
            eventDate: new Date("2024-08-20"),
            sortOrder: 3,
            isPublished: true,
            uploadedById: admin.id
        },
        {
            title: "Survei Properti Komersial",
            description: "Kegiatan survei penilaian properti komersial di Jakarta Selatan",
            imageUrl: "/image/gallery/survei-komersial.jpg",
            albumId: createdAlbums[1]?.id,
            eventDate: new Date("2024-11-25"),
            sortOrder: 1,
            isPublished: true,
            uploadedById: admin.id
        },
        {
            title: "Survei Tanah dan Bangunan",
            description: "Survei lapangan untuk penilaian tanah dan bangunan",
            imageUrl: "/image/gallery/survei-tanah.jpg",
            albumId: createdAlbums[1]?.id,
            eventDate: new Date("2024-11-15"),
            sortOrder: 2,
            isPublished: true,
            uploadedById: admin.id
        },
        {
            title: "Inspeksi Pabrik",
            description: "Inspeksi dan penilaian aset pabrik di Bekasi",
            imageUrl: "/image/gallery/inspeksi-pabrik.jpg",
            albumId: createdAlbums[1]?.id,
            eventDate: new Date("2024-10-10"),
            sortOrder: 3,
            isPublished: true,
            uploadedById: admin.id
        },
        {
            title: "Survei Apartemen",
            description: "Survei penilaian apartemen untuk agunan bank",
            imageUrl: "/image/gallery/survei-apartemen.jpg",
            albumId: createdAlbums[1]?.id,
            eventDate: new Date("2024-09-25"),
            sortOrder: 4,
            isPublished: true,
            uploadedById: admin.id
        },
        {
            title: "Workshop Penilaian Properti",
            description: "Workshop penilaian properti untuk sektor perbankan",
            imageUrl: "/image/gallery/workshop-properti.jpg",
            albumId: createdAlbums[2]?.id,
            eventDate: new Date("2024-11-20"),
            sortOrder: 1,
            isPublished: true,
            uploadedById: admin.id
        },
        {
            title: "Seminar Nasional Penilaian",
            description: "Seminar nasional tentang standar penilaian internasional",
            imageUrl: "/image/gallery/seminar-nasional.jpg",
            albumId: createdAlbums[2]?.id,
            eventDate: new Date("2024-10-05"),
            sortOrder: 2,
            isPublished: true,
            uploadedById: admin.id
        },
        {
            title: "Pelatihan Internal",
            description: "Pelatihan internal untuk meningkatkan kompetensi tim",
            imageUrl: "/image/gallery/pelatihan-internal.jpg",
            albumId: createdAlbums[2]?.id,
            eventDate: new Date("2024-09-01"),
            sortOrder: 3,
            isPublished: true,
            uploadedById: admin.id
        },
        {
            title: "Rapat Tim Manajemen",
            description: "Rapat koordinasi tim manajemen membahas strategi perusahaan",
            imageUrl: "/image/gallery/rapat-tim.jpg",
            albumId: createdAlbums[3]?.id,
            eventDate: new Date("2024-12-01"),
            sortOrder: 1,
            isPublished: true,
            uploadedById: admin.id
        },
        {
            title: "Pertemuan dengan Klien Bank",
            description: "Pertemuan koordinasi dengan klien dari sektor perbankan",
            imageUrl: "/image/gallery/meeting-bank.jpg",
            albumId: createdAlbums[3]?.id,
            eventDate: new Date("2024-11-10"),
            sortOrder: 2,
            isPublished: true,
            uploadedById: admin.id
        },
        {
            title: "Rapat Evaluasi Proyek",
            description: "Rapat evaluasi progress proyek penilaian",
            imageUrl: "/image/gallery/rapat-evaluasi.jpg",
            albumId: createdAlbums[3]?.id,
            eventDate: new Date("2024-10-20"),
            sortOrder: 3,
            isPublished: true,
            uploadedById: admin.id
        },
    ];

    for (const gallery of galleries) {
        const existingGallery = await prisma.galleries.findFirst({
            where: { title: gallery.title }
        });

        if (!existingGallery) {
            await prisma.galleries.create({
                data: { ...gallery, id: crypto.randomUUID(), updatedAt: new Date() }
            });
        }
    }
    console.log(`✅ Seeded ${galleries.length} gallery items`);

    // Seed Sekapur Sirih Images
    console.log("\n🌱 Seeding Sekapur Sirih Images...");
    const sekapurSirihImages = [
        {
            imageType: "MANAGING_PARTNER" as const,
            imageUrl: "/image/tentang-kami/anas-karim-rivai.png",
            altText: "Foto Managing Partner KJPP AKR",
            caption: null,
            managingPartnerName: "Ir. H. Anas Karim Rivai, MAPPI (Cert)",
            managingPartnerTitle: "Managing Partner",
            isActive: true
        },
        {
            imageType: "TEAM_PHOTO" as const,
            imageUrl: "/image/tentang-kami/sekapursirih.png",
            altText: "Foto Tim KJPP AKR",
            caption: null,
            managingPartnerName: null,
            managingPartnerTitle: null,
            isActive: true
        }
    ];

    for (const image of sekapurSirihImages) {
        const existingImage = await prisma.sekapur_sirih_images.findFirst({
            where: {
                imageType: image.imageType,
                imageUrl: image.imageUrl
            }
        });

        if (!existingImage) {
            await prisma.sekapur_sirih_images.create({
                data: { ...image, id: crypto.randomUUID(), updatedAt: new Date() }
            });
        }
    }
    console.log(`✅ Seeded ${sekapurSirihImages.length} Sekapur Sirih images`);

    console.log("\n🎉 Seed completed!");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error("❌ Seed error:", e);
        await prisma.$disconnect();
        process.exit(1);
    });
