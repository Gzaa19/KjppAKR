import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

// Create Prisma client with pg adapter (same as src/lib/prisma.ts)
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
