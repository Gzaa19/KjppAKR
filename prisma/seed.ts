import { PrismaClient, ClientCategory, NewsCategory } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

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
    const adminEmail = "admin@kjppakr.com";
    const adminPassword = "admin123"; // Change this in production!

    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail },
    });

    if (existingAdmin) {
        console.log("✅ Admin user already exists:");
        console.log(`   Email: ${existingAdmin.email}`);
        console.log(`   ID: ${existingAdmin.id}`);
        console.log(`   Name: ${existingAdmin.name}`);
    } else {
        const hashedPassword = await bcrypt.hash(adminPassword, 12);

        const admin = await prisma.user.create({
            data: {
                email: adminEmail,
                password: hashedPassword,
                name: "Administrator",
                role: "SUPER_ADMIN",
                isActive: true,
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
            image: "/image/manajemen/pakAchmad.png",
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
            name: "Imadduddin, SE., MAPPI (Cert.)",
            title: "Rekan",
            image: "/image/manajemen/pakImadduddin.png",
            description: "Lahir di Bukit Gonggang pada tanggal 5 Agustus 1965. Beliau mendapatkan gelar Sarjana Ekonomi Akuntansi dari Universitas Satya Negara Indonesia tahun 1998, serta telah lulus mengikuti Ujian Sertifikasi Penilai (USP) dari Asosiasi Masyarakat Profesi Penilai Indonesia (MAPPI) tahun 2009. Beliau memiliki pengalaman dalam bidang penilaian aset daerah, penilaian tanah bangunan, serta beberapa pengalaman lainnya",
            isMappiCert: true,
            sortOrder: 6
        },
        {
            name: "Andri Kurniawan",
            title: "Rekan",
            image: "",
            description: "Lahir di Bogor pada tanggal 29 Maret 1995. Beliau memiliki pengalaman dalam bidang Administrasi Tender dari Tahun 2013 - Sekarang.",
            isMappiCert: true,
            sortOrder: 7
        }
    ];

    for (const team of managementTeams) {
        // Check if exists by name to avoid duplicates on re-seed
        const existingTeam = await prisma.managementTeam.findFirst({
            where: { name: team.name }
        });

        if (!existingTeam) {
            await prisma.managementTeam.create({
                data: team
            });
        }
    }
    console.log(`✅ Seeded ${managementTeams.length} management teams`);

    // Seed Hero Images
    console.log("\n🌱 Seeding Hero Images...");
    const heroImages = [
        {
            imageUrl: "/image/hero/hero1.png",
            altText: "KJPP AKR Team",
            sortOrder: 1,
            isActive: true
        },
        {
            imageUrl: "/image/hero/hero2.png",
            altText: "KJPP AKR Logo",
            sortOrder: 2,
            isActive: true
        },
        {
            imageUrl: "/image/hero/hero3.jpg",
            altText: "KJPP AKR Team",
            sortOrder: 3,
            isActive: true
        }
    ];

    for (const heroImage of heroImages) {
        const existingImage = await prisma.heroImage.findFirst({
            where: { imageUrl: heroImage.imageUrl }
        });

        if (!existingImage) {
            await prisma.heroImage.create({
                data: heroImage
            });
        }
    }
    console.log(`✅ Seeded ${heroImages.length} hero images`);

    // Seed Clients
    console.log("\n🌱 Seeding Clients...");
    const clients = [
        // Bank BUMN/Swasta
        { name: "PT. Bank Central Asia (Persero) Tbk", logo: "/image/client/bumn/bca.png", category: ClientCategory.BANK_BUMN_SWASTA, sortOrder: 1 },
        { name: "PT. Bank Rakyat Indonesia (Persero) Tbk", logo: "/image/client/bumn/bri.png", category: ClientCategory.BANK_BUMN_SWASTA, sortOrder: 2 },
        { name: "PT. Bank Syariah Indonesia Tbk", logo: "/image/client/bumn/bsi.png", category: ClientCategory.BANK_BUMN_SWASTA, sortOrder: 3 },
        { name: "PT. Bank Tabungan Negara (Persero) Tbk", logo: "/image/client/bumn/btn.png", category: ClientCategory.BANK_BUMN_SWASTA, sortOrder: 4 },
        { name: "PT. Bank Mandiri (Persero) Tbk", logo: "/image/client/bumn/mandiri.png", category: ClientCategory.BANK_BUMN_SWASTA, sortOrder: 5 },
        // Non Bank
        { name: "PT. Pertamina (Persero)", logo: "/image/client/nonBank/pertamina.png", category: ClientCategory.NON_BANK, sortOrder: 1 },
        { name: "PT. Pertamina Hulu Energi", logo: "/image/client/nonBank/pertaminahe.png", category: ClientCategory.NON_BANK, sortOrder: 2 },
        { name: "Dana Pensiun Pertamina", logo: "/image/client/nonBank/dppertamina.png", category: ClientCategory.NON_BANK, sortOrder: 3 },
        { name: "PT. Pertamina Internasional EP", logo: "/image/client/nonBank/pertaminiep.png", category: ClientCategory.NON_BANK, sortOrder: 4 },
        { name: "PT. Multimedia Nusantara (Telkom Metra)", logo: "/image/client/nonBank/telkommetra.png", category: ClientCategory.NON_BANK, sortOrder: 5 },
    ];

    for (const client of clients) {
        const existingClient = await prisma.client.findFirst({
            where: { name: client.name }
        });

        if (!existingClient) {
            await prisma.client.create({
                data: {
                    ...client,
                    isPublished: true
                }
            });
        }
    }
    console.log(`✅ Seeded ${clients.length} clients`);

    // Get admin user ID for news
    const admin = await prisma.user.findUnique({
        where: { email: adminEmail }
    });

    if (!admin) {
        throw new Error("Admin user not found");
    }

    // Seed Publikasi
    console.log("\n🌱 Seeding Publikasi...");
    const newsArticles = [
        {
            title: "KJPP AKR Raih Penghargaan Best Appraisal Firm 2024",
            slug: "kjpp-akr-raih-penghargaan-best-appraisal-firm-2024",
            excerpt: "KJPP Anas Karim Rivai & Rekan berhasil meraih penghargaan sebagai Best Appraisal Firm 2024 dari Asosiasi Penilai Indonesia.",
            content: "Jakarta - KJPP Anas Karim Rivai & Rekan dengan bangga mengumumkan pencapaian luar biasa sebagai penerima penghargaan Best Appraisal Firm 2024 dari Asosiasi Penilai Indonesia. Penghargaan ini merupakan pengakuan atas dedikasi dan profesionalisme tim kami dalam memberikan layanan penilaian aset yang berkualitas tinggi.\n\nDalam acara penganugerahan yang berlangsung di Jakarta Convention Center, Managing Partner kami, Ir. H. Anas Karim Rivai, M.Ec.Dev., MAPPI (Cert.) menyampaikan rasa terima kasih kepada seluruh tim dan klien yang telah mempercayai layanan kami.\n\n\"Penghargaan ini adalah hasil kerja keras seluruh tim KJPP AKR. Kami berkomitmen untuk terus meningkatkan kualitas layanan dan memberikan nilai terbaik bagi klien,\" ujar Pak Anas.\n\nKJPP AKR telah melayani berbagai klien dari sektor perbankan, pemerintahan, dan swasta dengan total lebih dari 1000 proyek penilaian sepanjang tahun 2024.",
            coverImage: "/image/news/award-2024.jpg",
            category: NewsCategory.BERITA,
            isPublished: true,
            publishedAt: new Date("2024-12-15"),
            authorId: admin.id
        },
        {
            title: "Workshop Penilaian Properti untuk Perbankan",
            slug: "workshop-penilaian-properti-untuk-perbankan",
            excerpt: "KJPP AKR menyelenggarakan workshop khusus tentang penilaian properti untuk sektor perbankan dengan menghadirkan praktisi berpengalaman.",
            content: "KJPP Anas Karim Rivai & Rekan menyelenggarakan workshop bertema \"Penilaian Properti untuk Sektor Perbankan\" yang dihadiri oleh lebih dari 50 peserta dari berbagai bank di Indonesia.\n\nWorkshop ini membahas berbagai aspek penting dalam penilaian properti, termasuk:\n- Standar penilaian internasional (IVSC)\n- Metode penilaian yang tepat untuk agunan kredit\n- Analisis pasar properti terkini\n- Studi kasus penilaian properti komersial\n\nAcara ini mendapat respons positif dari para peserta yang mayoritas adalah analis kredit dan risk management officer dari perbankan.",
            coverImage: "/image/news/workshop-2024.jpg",
            category: NewsCategory.KEGIATAN,
            isPublished: true,
            publishedAt: new Date("2024-11-20"),
            authorId: admin.id
        },
        {
            title: "Panduan Memilih Jasa Penilai Properti yang Tepat",
            slug: "panduan-memilih-jasa-penilai-properti-yang-tepat",
            excerpt: "Artikel panduan lengkap untuk membantu Anda memilih jasa penilai properti yang profesional dan terpercaya.",
            content: "Memilih jasa penilai properti yang tepat adalah langkah penting dalam berbagai transaksi properti. Berikut adalah panduan lengkap untuk membantu Anda:\n\n## 1. Periksa Sertifikasi\nPastikan penilai memiliki sertifikasi dari MAPPI (Masyarakat Profesi Penilai Indonesia) dan terdaftar di DJKN.\n\n## 2. Pengalaman dan Track Record\nCari penilai dengan pengalaman minimal 5 tahun dan portfolio yang solid.\n\n## 3. Spesialisasi\nPilih penilai yang memiliki spesialisasi sesuai jenis properti Anda (residensial, komersial, industri).\n\n## 4. Metodologi\nTanyakan metode penilaian yang akan digunakan dan pastikan sesuai standar.\n\n## 5. Transparansi Biaya\nPenilai profesional akan memberikan rincian biaya yang jelas di awal.\n\nKJPP Anas Karim Rivai & Rekan siap membantu Anda dengan layanan penilaian yang profesional dan terpercaya.",
            coverImage: "/image/news/panduan-penilai.jpg",
            category: NewsCategory.ARTIKEL,
            isPublished: true,
            publishedAt: new Date("2024-10-10"),
            authorId: admin.id
        },
        {
            title: "Penilaian Aset untuk Restrukturisasi Perusahaan",
            slug: "penilaian-aset-untuk-restrukturisasi-perusahaan",
            excerpt: "Memahami pentingnya penilaian aset yang akurat dalam proses restrukturisasi perusahaan.",
            content: "Restrukturisasi perusahaan memerlukan penilaian aset yang akurat dan independen. KJPP AKR memiliki pengalaman luas dalam membantu perusahaan melakukan penilaian aset untuk berbagai keperluan restrukturisasi.\n\nLayanan kami meliputi:\n- Penilaian aset tetap (tanah, bangunan, mesin)\n- Penilaian bisnis dan saham\n- Penilaian aset tak berwujud\n- Fairness opinion\n\nDengan metodologi yang sesuai standar internasional, kami memastikan hasil penilaian yang objektif dan dapat dipertanggungjawabkan.",
            coverImage: "/image/news/restrukturisasi.jpg",
            category: NewsCategory.ARTIKEL,
            isPublished: true,
            publishedAt: new Date("2024-09-05"),
            authorId: admin.id
        },
        {
            title: "KJPP AKR Buka Kantor Cabang di Surabaya",
            slug: "kjpp-akr-buka-kantor-cabang-di-surabaya",
            excerpt: "Ekspansi layanan KJPP AKR dengan pembukaan kantor cabang baru di Surabaya untuk melayani klien di Jawa Timur.",
            content: "KJPP Anas Karim Rivai & Rekan dengan bangga mengumumkan pembukaan kantor cabang baru di Surabaya. Langkah ekspansi ini diambil untuk memberikan layanan yang lebih dekat dan responsif kepada klien di wilayah Jawa Timur.\n\nKantor cabang Surabaya akan menyediakan layanan lengkap meliputi:\n- Penilaian properti\n- Penilaian bisnis\n- Konsultasi properti\n- Studi kelayakan\n\nDengan tim profesional bersertifikat MAPPI, kami siap melayani kebutuhan penilaian Anda dengan standar kualitas yang sama seperti kantor pusat di Jakarta.",
            coverImage: "/image/news/cabang-surabaya.jpg",
            category: NewsCategory.PENGUMUMAN,
            isPublished: true,
            publishedAt: new Date("2024-08-01"),
            authorId: admin.id
        }
    ];

    for (const news of newsArticles) {
        const existingNews = await prisma.news.findUnique({
            where: { slug: news.slug }
        });

        if (!existingNews) {
            await prisma.news.create({
                data: news
            });
        }
    }
    console.log(`✅ Seeded ${newsArticles.length} publikasi`);

    // Seed Gallery
    console.log("\n🌱 Seeding Gallery...");

    // First, create albums
    const albums = [
        { name: "Kegiatan Kantor", slug: "kegiatan-kantor", description: "Dokumentasi kegiatan sehari-hari di kantor" },
        { name: "Survei Lapangan", slug: "survei-lapangan", description: "Dokumentasi kegiatan survei dan penilaian di lapangan" },
        { name: "Workshop & Seminar", slug: "workshop-seminar", description: "Dokumentasi workshop dan seminar yang diselenggarakan" },
    ];

    const createdAlbums: any[] = [];
    for (const album of albums) {
        const existingAlbum = await prisma.album.findUnique({
            where: { slug: album.slug }
        });

        if (!existingAlbum) {
            const newAlbum = await prisma.album.create({
                data: album
            });
            createdAlbums.push(newAlbum);
        } else {
            createdAlbums.push(existingAlbum);
        }
    }

    const galleries = [
        {
            title: "Rapat Tim Manajemen",
            description: "Rapat koordinasi tim manajemen membahas strategi perusahaan",
            imageUrl: "/image/gallery/rapat-tim.jpg",
            albumId: createdAlbums[0]?.id,
            eventDate: new Date("2024-12-01"),
            sortOrder: 1,
            uploadedById: admin.id
        },
        {
            title: "Survei Properti Komersial",
            description: "Kegiatan survei penilaian properti komersial di Jakarta Selatan",
            imageUrl: "/image/gallery/survei-komersial.jpg",
            albumId: createdAlbums[1]?.id,
            eventDate: new Date("2024-11-25"),
            sortOrder: 2,
            uploadedById: admin.id
        },
        {
            title: "Workshop Penilaian Properti",
            description: "Workshop penilaian properti untuk sektor perbankan",
            imageUrl: "/image/gallery/workshop-properti.jpg",
            albumId: createdAlbums[2]?.id,
            eventDate: new Date("2024-11-20"),
            sortOrder: 3,
            uploadedById: admin.id
        },
        {
            title: "Survei Tanah dan Bangunan",
            description: "Survei lapangan untuk penilaian tanah dan bangunan",
            imageUrl: "/image/gallery/survei-tanah.jpg",
            albumId: createdAlbums[1]?.id,
            eventDate: new Date("2024-11-15"),
            sortOrder: 4,
            uploadedById: admin.id
        },
        {
            title: "Team Building 2024",
            description: "Kegiatan team building tahunan KJPP AKR",
            imageUrl: "/image/gallery/team-building.jpg",
            albumId: createdAlbums[0]?.id,
            eventDate: new Date("2024-10-30"),
            sortOrder: 5,
            uploadedById: admin.id
        }
    ];

    for (const gallery of galleries) {
        const existingGallery = await prisma.gallery.findFirst({
            where: { title: gallery.title }
        });

        if (!existingGallery) {
            await prisma.gallery.create({
                data: gallery
            });
        }
    }
    console.log(`✅ Seeded ${galleries.length} gallery items`);

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
