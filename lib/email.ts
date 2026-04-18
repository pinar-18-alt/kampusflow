import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendRegistrationConfirmation(
  userEmail: string,
  userName: string,
  eventTitle: string,
  eventDeadline: Date
) {
  try {
    await resend.emails.send({
      from: "KampüsFlow <onboarding@resend.dev>",
      to: userEmail,
      subject: `✅ Kayıt Onayı — ${eventTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1E3A8A, #2563EB); padding: 32px; border-radius: 16px 16px 0 0;">
            <h1 style="color: white; margin: 0;">KampüsFlow</h1>
            <p style="color: #93C5FD; margin: 4px 0 0;">Uludağ Üniversitesi Etkinlik Platformu</p>
          </div>
          <div style="background: white; padding: 32px; border-radius: 0 0 16px 16px; border: 1px solid #E2E8F0;">
            <h2 style="color: #1E3A8A;">Merhaba ${userName}! 👋</h2>
            <p style="color: #475569;">
              <strong>${eventTitle}</strong> etkinliğine kaydınız başarıyla alındı.
            </p>
            <div style="background: #F8FAFF; border-left: 4px solid #2563EB; padding: 16px; border-radius: 8px; margin: 24px 0;">
              <p style="margin: 0; color: #1E3A8A; font-weight: bold;">📅 Etkinlik Bilgileri</p>
              <p style="margin: 8px 0 0; color: #475569;">Son başvuru: ${eventDeadline.toLocaleDateString("tr-TR")}</p>
            </div>
            <a href="${process.env.NEXTAUTH_URL}/events" 
               style="display: inline-block; background: linear-gradient(135deg, #1E3A8A, #2563EB); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 16px;">
              Etkinliklere Git →
            </a>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error("Email gönderilemedi:", error);
  }
}

export async function sendWaitlistConfirmation(
  userEmail: string,
  userName: string,
  eventTitle: string,
  position: number
) {
  try {
    await resend.emails.send({
      from: "KampüsFlow <onboarding@resend.dev>",
      to: userEmail,
      subject: `⏳ Bekleme Listesi — ${eventTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1E3A8A, #2563EB); padding: 32px; border-radius: 16px 16px 0 0;">
            <h1 style="color: white; margin: 0;">KampüsFlow</h1>
            <p style="color: #93C5FD; margin: 4px 0 0;">Uludağ Üniversitesi Etkinlik Platformu</p>
          </div>
          <div style="background: white; padding: 32px; border-radius: 0 0 16px 16px; border: 1px solid #E2E8F0;">
            <h2 style="color: #1E3A8A;">Merhaba ${userName}!</h2>
            <p style="color: #475569;">
              <strong>${eventTitle}</strong> etkinliği dolduğu için 
              <strong>${position}. sıraya</strong> bekleme listesine alındınız.
            </p>
            <div style="background: #FFFBEB; border-left: 4px solid #F59E0B; padding: 16px; border-radius: 8px; margin: 24px 0;">
              <p style="margin: 0; color: #92400E;">
                ⏳ Birisi iptal ederse otomatik olarak kayıt listesine alınacak ve email ile bilgilendirileceksiniz.
              </p>
            </div>
            <a href="${process.env.NEXTAUTH_URL}/events" 
               style="display: inline-block; background: linear-gradient(135deg, #1E3A8A, #2563EB); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
              Etkinliklere Git →
            </a>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error("Email gönderilemedi:", error);
  }
}

export async function sendWaitlistPromoted(
  userEmail: string,
  userName: string,
  eventTitle: string
) {
  try {
    await resend.emails.send({
      from: "KampüsFlow <onboarding@resend.dev>",
      to: userEmail,
      subject: `🎉 Etkinliğe Alındınız — ${eventTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1E3A8A, #2563EB); padding: 32px; border-radius: 16px 16px 0 0;">
            <h1 style="color: white; margin: 0;">KampüsFlow</h1>
            <p style="color: #93C5FD; margin: 4px 0 0;">Uludağ Üniversitesi Etkinlik Platformu</p>
          </div>
          <div style="background: white; padding: 32px; border-radius: 0 0 16px 16px; border: 1px solid #E2E8F0;">
            <h2 style="color: #059669;">🎉 Harika haber, ${userName}!</h2>
            <p style="color: #475569;">
              Bekleme listesinden <strong>${eventTitle}</strong> etkinliğine alındınız!
            </p>
            <div style="background: #ECFDF5; border-left: 4px solid #059669; padding: 16px; border-radius: 8px; margin: 24px 0;">
              <p style="margin: 0; color: #065F46; font-weight: bold;">
                ✅ Kaydınız onaylandı. Etkinliğe katılabilirsiniz!
              </p>
            </div>
            <a href="${process.env.NEXTAUTH_URL}/profile" 
               style="display: inline-block; background: linear-gradient(135deg, #1E3A8A, #2563EB); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
              Profilime Git →
            </a>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error("Email gönderilemedi:", error);
  }
}

export async function sendWelcomeEmail(userEmail: string, userName: string) {
  try {
    await resend.emails.send({
      from: "KampüsFlow <onboarding@resend.dev>",
      to: userEmail,
      subject: "🎓 KampüsFlow'a Hoş Geldiniz!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1E3A8A, #2563EB); padding: 32px; border-radius: 16px 16px 0 0;">
            <h1 style="color: white; margin: 0;">KampüsFlow</h1>
            <p style="color: #93C5FD; margin: 4px 0 0;">Uludağ Üniversitesi Etkinlik Platformu</p>
          </div>
          <div style="background: white; padding: 32px; border-radius: 0 0 16px 16px; border: 1px solid #E2E8F0;">
            <h2 style="color: #1E3A8A;">Hoş geldin, ${userName}! 🎉</h2>
            <p style="color: #475569;">
              KampüsFlow ailesine katıldığın için teşekkürler. 
              Artık UYBİST ve diğer toplulukların etkinliklerini takip edebilir, 
              tek tıkla kayıt olabilirsin.
            </p>
            <a href="${process.env.NEXTAUTH_URL}/events" 
               style="display: inline-block; background: linear-gradient(135deg, #1E3A8A, #2563EB); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 16px;">
              Etkinlikleri Keşfet →
            </a>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error("Email gönderilemedi:", error);
  }
}
