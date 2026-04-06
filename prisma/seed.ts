import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { addDays } from "date-fns";

const prisma = new PrismaClient();

async function main() {
  await prisma.registration.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();

  const saltRounds = 10;

  const admin1 = await prisma.user.create({
    data: {
      email: "admin@uludag.edu.tr",
      password: await hash("admin123", saltRounds),
      role: "admin",
      name: "Admin Kullanıcı",
    },
  });

  await prisma.user.create({
    data: {
      email: "topluluk@uludag.edu.tr",
      password: await hash("topluluk123", saltRounds),
      role: "admin",
      name: "Topluluk Yöneticisi",
    },
  });

  await prisma.user.create({
    data: {
      email: "ali@uludag.edu.tr",
      password: await hash("user123", saltRounds),
      role: "user",
      name: "Ali Yılmaz",
      faculty: "İnegöl İşletme Fakültesi",
    },
  });

  await prisma.user.create({
    data: {
      email: "ayse@uludag.edu.tr",
      password: await hash("user123", saltRounds),
      role: "user",
      name: "Ayşe Kaya",
      faculty: "İnegöl İşletme Fakültesi",
    },
  });

  await prisma.user.create({
    data: {
      email: "mehmet@uludag.edu.tr",
      password: await hash("user123", saltRounds),
      role: "user",
      name: "Mehmet Demir",
      faculty: "İnegöl İşletme Fakültesi",
    },
  });

  const now = new Date();

  const communityDefaults = {
    community: "UYBİST",
    communityLogo: "/uybist-logo.png",
  } as const;

  await prisma.event.create({
    data: {
      ...communityDefaults,
      title: "Yapay Zeka ve Gelecek Paneli",
      description:
        "Yapay zekanın eğitim, sağlık ve iş dünyasındaki dönüşümünü uzman konuşmacılarla ele alıyoruz. Akademisyenler, sektör temsilcileri ve öğrencilerin bir araya geleceği panelde güncel trendler, etik tartışmalar ve kariyer fırsatları paylaşılacak. Soru-cevap bölümü ve networking için zaman ayrılmıştır.",
      quota: 50,
      status: "active",
      deadline: addDays(now, 7),
      createdBy: admin1.id,
    },
  });

  await prisma.event.create({
    data: {
      ...communityDefaults,
      title: "Kariyer Günleri 2025",
      description:
        "Üniversitemizin en büyük kariyer etkinliklerinden biri olan Kariyer Günleri’nde onlarca firma stant açıyor, staj ve iş ilanları sunuyor. CV danışmanlığı, mock mülakatlar ve sektörel sunumlarla mezuniyet öncesi profesyonel dünyaya hazırlanın. Tüm sınıflar davetlidir.",
      quota: 100,
      status: "active",
      deadline: addDays(now, 14),
      createdBy: admin1.id,
    },
  });

  await prisma.event.create({
    data: {
      ...communityDefaults,
      title: "Girişimcilik Workshopu",
      description:
        "Fikirden MVP’ye giden yolu uygulamalı olarak öğreneceğiniz yoğun bir atölye. İş modeli kanvası, pazar doğrulama ve sunum teknikleri üzerinde çalışacağız. Küçük gruplar halinde mentor eşliğinde proje geliştireceksiniz; son gün kısa pitch oturumu yapılacaktır.",
      quota: 20,
      status: "active",
      deadline: addDays(now, 3),
      createdBy: admin1.id,
    },
  });

  await prisma.event.create({
    data: {
      ...communityDefaults,
      title: "Mezunlarla Buluşma",
      description:
        "Farklı mesleklerden mezunlarımız kampüste öğrencilerle buluşuyor. Deneyim paylaşımı, mentörlük ve networking odaklı bu etkinlikte mezunların kariyer yolculuklarını dinleyebilir, sorularınızı iletebilirsiniz. Kontenjan sınırlıdır; kayıt sırasına göre onay verilecektir.",
      quota: 30,
      status: "active",
      deadline: addDays(now, 1),
      createdBy: admin1.id,
    },
  });

  const userCount = await prisma.user.count();
  const eventCount = await prisma.event.count();
  console.log(`Seed tamamlandı: ${userCount} kullanıcı, ${eventCount} etkinlik oluşturuldu.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
