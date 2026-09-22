import {
  dispatchNotification,
  notificationStore,
  DispatchNotificationParams,
} from './notificationEngine';
import { AppUser, EventProject, ServerPayment, Guest, UserRole } from '../src/types';

// 1. User Registration
export async function sendUserRegistrationNotifications(user: {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  subscriptionTier?: string;
}) {
  const regDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // User Welcome & Registration Email
  await dispatchNotification({
    userId: user.id,
    targetRole: user.role,
    recipientEmail: user.email,
    recipientName: user.name,
    recipientPhone: user.phone,
    type: 'REGISTRATION_SUCCESS',
    category: 'ACCOUNT',
    title: 'Welcome to AA Event Maker — Registration Successful',
    message: `Halo ${user.name}, akun AA Event Maker Anda dengan peran ${user.role} telah berhasil dibuat pada ${regDate}.`,
    bodyHtml: `
      <p>Selamat datang di <strong>AA Event Maker</strong> — platform perancangan undangan digital interaktif dan manajemen pernikahan terpadu di Indonesia.</p>
      <div class="card-detail">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 4px 0; color: #64748b;">Nama Lengkap:</td><td style="font-weight: 700; color: #0f172a;">${user.name}</td></tr>
          <tr><td style="padding: 4px 0; color: #64748b;">Email Terdaftar:</td><td style="font-weight: 700; color: #0f172a;">${user.email}</td></tr>
          <tr><td style="padding: 4px 0; color: #64748b;">Tipe Akun / Role:</td><td style="font-weight: 700; color: #2563eb;">${user.role}</td></tr>
          <tr><td style="padding: 4px 0; color: #64748b;">Tanggal Registrasi:</td><td style="font-weight: 700; color: #0f172a;">${regDate}</td></tr>
          <tr><td style="padding: 4px 0; color: #64748b;">Status Akun:</td><td style="font-weight: 700; color: #16a34a;">Aktif (Starter Free)</td></tr>
        </table>
      </div>
      <p>Anda sekarang dapat langsung membuat undangan pernikahan sinematik, mengelola daftar tamu, mengaktifkan QR check-in resepsionis, dan memanfaatkan studio multimedia AI.</p>
    `,
    actionUrl: '/login',
    actionLabel: 'Masuk ke Akun Anda',
    secondaryNotice: 'Jika Anda tidak pernah mendaftarkan akun di AA Event Maker, mohon abaikan email ini atau hubungi support@aa-eventmaker.my.id.',
    idempotencyKey: `reg_${user.id}_${user.email}`,
    channels: ['IN_APP', 'EMAIL'],
  });

  // Admin Alert on New Registration
  await dispatchNotification({
    userId: 'usr_admin_001',
    targetRole: 'ADMIN',
    recipientEmail: 'admin@aa-eventmaker.my.id',
    recipientName: 'Administrator Platform',
    type: 'ADMIN_NEW_USER',
    category: 'ACCOUNT',
    title: `Pendaftaran Pengguna Baru: ${user.name}`,
    message: `Pengguna baru telah mendaftar: ${user.name} (${user.email}) sebagai ${user.role}.`,
    bodyHtml: `
      <p>Pemberitahuan Administrator: Ada pengguna baru yang mendaftar ke platform AA Event Maker.</p>
      <div class="card-detail">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 4px 0; color: #64748b;">Nama:</td><td style="font-weight: 700;">${user.name}</td></tr>
          <tr><td style="padding: 4px 0; color: #64748b;">Email:</td><td style="font-weight: 700;">${user.email}</td></tr>
          <tr><td style="padding: 4px 0; color: #64748b;">Peran (Role):</td><td style="font-weight: 700; color: #2563eb;">${user.role}</td></tr>
          <tr><td style="padding: 4px 0; color: #64748b;">No. Telepon:</td><td style="font-weight: 700;">${user.phone || '-'}</td></tr>
          <tr><td style="padding: 4px 0; color: #64748b;">Tanggal:</td><td style="font-weight: 700;">${regDate}</td></tr>
        </table>
      </div>
    `,
    actionUrl: '/admin/customers',
    actionLabel: 'Lihat Daftar Pengguna',
    idempotencyKey: `admin_reg_${user.id}`,
    channels: ['IN_APP', 'EMAIL'],
    skipPreferencesCheck: true,
  });
}

// 2. Email Verification
export async function sendEmailVerification(user: { id: string; name: string; email: string }, token: string) {
  const verifyLink = `https://aa-eventmaker.my.id/verify-email?token=${token}&email=${encodeURIComponent(user.email)}`;

  await dispatchNotification({
    userId: user.id,
    recipientEmail: user.email,
    recipientName: user.name,
    type: 'EMAIL_VERIFICATION_REQUEST',
    category: 'ACCOUNT',
    title: 'Verify Your Email — AA Event Maker',
    message: `Silakan verifikasi alamat email Anda untuk membuka seluruh fitur premium di AA Event Maker.`,
    bodyHtml: `
      <p>Terima kasih telah mendaftar di AA Event Maker. Klik tombol di bawah ini untuk memverifikasi alamat email Anda:</p>
      <div class="card-detail">
        <p style="margin: 0; font-size: 12px; color: #64748b;">Tautan verifikasi ini berlaku selama <strong>24 jam</strong>. Demi keamanan, jangan berikan tautan ini kepada siapa pun.</p>
      </div>
    `,
    actionUrl: verifyLink,
    actionLabel: 'Verifikasi Alamat Email',
    secondaryNotice: 'Jika Anda tidak meminta verifikasi ini, Anda dapat mengabaikan email ini dengan aman.',
    idempotencyKey: `verif_req_${user.id}_${token.slice(0, 8)}`,
    channels: ['IN_APP', 'EMAIL'],
    skipPreferencesCheck: true,
  });
}

export async function sendEmailVerifiedSuccess(user: { id: string; name: string; email: string }) {
  await dispatchNotification({
    userId: user.id,
    recipientEmail: user.email,
    recipientName: user.name,
    type: 'EMAIL_VERIFIED',
    category: 'ACCOUNT',
    title: 'Your email has been successfully verified.',
    message: `Alamat email ${user.email} telah berhasil diverifikasi. Akun Anda kini aktif penuh.`,
    bodyHtml: `
      <p>Selamat! Alamat email Anda telah berhasil diverifikasi oleh sistem AA Event Maker.</p>
      <p>Sekarang Anda dapat mengundang tamu tanpa batas, membuat kode QR E-Pass yang aman, dan menerbitkan undangan online ke publik.</p>
    `,
    actionUrl: '/dashboard',
    actionLabel: 'Buka Dasbor AA Event Maker',
    idempotencyKey: `verif_ok_${user.id}`,
    channels: ['IN_APP', 'EMAIL'],
  });
}

// 3. Login Notification (Security Alert)
export async function sendLoginSecurityAlert(user: { id: string; name: string; email: string }, meta?: { ip?: string; userAgent?: string; timestamp?: number }) {
  const now = new Date(meta?.timestamp || Date.now()).toLocaleString('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  await dispatchNotification({
    userId: user.id,
    recipientEmail: user.email,
    recipientName: user.name,
    type: 'LOGIN_ALERT',
    category: 'SECURITY',
    title: 'New login detected',
    message: `Masuk baru terdeteksi pada akun AA Event Maker Anda pada ${now}.`,
    bodyHtml: `
      <p>Kami mendeteksi aktivitas masuk baru pada akun Anda:</p>
      <div class="card-detail">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 4px 0; color: #64748b;">Waktu:</td><td style="font-weight: 700;">${now}</td></tr>
          <tr><td style="padding: 4px 0; color: #64748b;">Perangkat:</td><td style="font-weight: 700;">${meta?.userAgent ? meta.userAgent.slice(0, 60) : 'Browser Web Standar'}</td></tr>
          <tr><td style="padding: 4px 0; color: #64748b;">Alamat IP:</td><td style="font-weight: 700;">${meta?.ip || '127.0.0.1 (Lokal)'}</td></tr>
        </table>
      </div>
      <p style="font-size: 13px; color: #64748b;">Jika ini adalah Anda, tidak ada tindakan lebih lanjut yang diperlukan. Jika bukan Anda, segera ganti kata sandi akun Anda demi keamanan.</p>
    `,
    actionUrl: '/settings',
    actionLabel: 'Periksa Keamanan Akun',
    secondaryNotice: 'Pemberitahuan keamanan dikirim secara otomatis untuk melindungi privasi data acara dan tamu Anda.',
    idempotencyKey: `login_alert_${user.id}_${Math.floor(Date.now() / (10 * 60 * 1000))}`, // Max 1 per 10 mins
    channels: ['IN_APP', 'EMAIL'],
    skipPreferencesCheck: true,
  });
}

// 4. Password Reset
export async function sendPasswordResetRequest(user: { id: string; name: string; email: string }, resetToken: string) {
  const resetLink = `https://aa-eventmaker.my.id/reset-password?token=${resetToken}&email=${encodeURIComponent(user.email)}`;

  await dispatchNotification({
    userId: user.id,
    recipientEmail: user.email,
    recipientName: user.name,
    type: 'PASSWORD_RESET_REQUEST',
    category: 'SECURITY',
    title: 'Reset Your AA Event Maker Password',
    message: `Permintaan reset kata sandi diterima. Tautan reset berlaku selama 1 jam.`,
    bodyHtml: `
      <p>Kami menerima permintaan untuk mengatur ulang kata sandi akun AA Event Maker Anda. Klik tombol di bawah ini untuk membuat kata sandi baru:</p>
      <div class="card-detail">
        <p style="margin: 0; font-size: 13px; color: #b91c1c; font-weight: 700;">⚠️ Peringatan Keamanan:</p>
        <p style="margin: 4px 0 0 0; font-size: 12px; color: #64748b;">Tautan ini bersifat rahasia dan akan kedaluwarsa dalam 60 menit. Jika Anda tidak meminta reset kata sandi, abaikan email ini dan akun Anda akan tetap aman.</p>
      </div>
    `,
    actionUrl: resetLink,
    actionLabel: 'Atur Ulang Kata Sandi',
    idempotencyKey: `pwd_reset_req_${user.id}_${resetToken.slice(0, 8)}`,
    channels: ['IN_APP', 'EMAIL'],
    skipPreferencesCheck: true,
  });
}

export async function sendPasswordChangedSuccess(user: { id: string; name: string; email: string }) {
  await dispatchNotification({
    userId: user.id,
    recipientEmail: user.email,
    recipientName: user.name,
    type: 'PASSWORD_CHANGED',
    category: 'SECURITY',
    title: 'Your password has been changed successfully.',
    message: `Kata sandi akun AA Event Maker Anda telah berhasil diperbarui.`,
    bodyHtml: `
      <p>Kata sandi untuk akun AA Event Maker Anda (<strong>${user.email}</strong>) baru saja berhasil diubah.</p>
      <p style="font-size: 13px; color: #64748b;">Jika Anda yang melakukan perubahan ini, Anda dapat langsung masuk dengan kata sandi baru Anda. Jika Anda tidak merasa melakukan perubahan ini, segera hubungi tim dukungan kami di support@aa-eventmaker.my.id.</p>
    `,
    actionUrl: '/login',
    actionLabel: 'Masuk dengan Kata Sandi Baru',
    idempotencyKey: `pwd_chg_${user.id}_${Date.now()}`,
    channels: ['IN_APP', 'EMAIL'],
    skipPreferencesCheck: true,
  });
}

// 5. Profile Changes
export async function sendProfileUpdatedNotification(user: { id: string; name: string; email: string }, changedFields: string[]) {
  const fieldsText = changedFields.join(', ') || 'Informasi Profil';

  await dispatchNotification({
    userId: user.id,
    recipientEmail: user.email,
    recipientName: user.name,
    type: 'PROFILE_UPDATED',
    category: 'ACCOUNT',
    title: 'Your AA Event Maker Account Was Updated',
    message: `Perubahan profil berhasil disimpan untuk: ${fieldsText}.`,
    bodyHtml: `
      <p>Informasi akun AA Event Maker Anda telah diperbarui pada ${new Date().toLocaleString('id-ID')}.</p>
      <div class="card-detail">
        <p style="margin: 0; font-weight: 700; color: #0f172a;">Bidang yang diperbarui:</p>
        <p style="margin: 4px 0 0 0; color: #2563eb; font-weight: 600;">${fieldsText}</p>
      </div>
    `,
    actionUrl: '/settings',
    actionLabel: 'Tinjau Profil Akun',
    idempotencyKey: `prof_upd_${user.id}_${Math.floor(Date.now() / 60000)}`,
    channels: ['IN_APP', 'EMAIL'],
  });
}

// 6. Event Creation
export async function sendEventCreatedNotification(user: { id: string; name: string; email: string }, project: EventProject) {
  await dispatchNotification({
    userId: user.id,
    recipientEmail: user.email,
    recipientName: user.name,
    type: 'EVENT_CREATED',
    category: 'EVENT',
    title: 'Your Event Has Been Created',
    message: `Acara "${project.name}" berhasil dibuat untuk tanggal ${project.date || 'mendatang'}.`,
    bodyHtml: `
      <p>Selamat! Acara baru Anda berhasil dibuat di sistem AA Event Maker.</p>
      <div class="card-detail">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 4px 0; color: #64748b;">Nama Acara:</td><td style="font-weight: 700; color: #0f172a;">${project.name}</td></tr>
          <tr><td style="padding: 4px 0; color: #64748b;">Tipe Acara:</td><td style="font-weight: 700; color: #2563eb;">${project.type}</td></tr>
          <tr><td style="padding: 4px 0; color: #64748b;">Tanggal Acara:</td><td style="font-weight: 700;">${project.date}</td></tr>
          <tr><td style="padding: 4px 0; color: #64748b;">Lokasi:</td><td style="font-weight: 700;">${project.location}</td></tr>
          <tr><td style="padding: 4px 0; color: #64748b;">Status:</td><td style="font-weight: 700; color: #16a34a;">Draf Aktif</td></tr>
        </table>
      </div>
      <p>Langkah selanjutnya: lengkapi cerita/rundown, atur desain undangan, dan mulai susun daftar tamu undangan.</p>
    `,
    actionUrl: '/dashboard',
    actionLabel: 'Buka Dasbor Acara',
    idempotencyKey: `evt_created_${project.id}`,
    channels: ['IN_APP', 'EMAIL'],
  });
}

// 7. Invitation Creation
export async function sendInvitationCreatedNotification(user: { id: string; name: string; email: string }, project: EventProject, invitationUrl: string) {
  await dispatchNotification({
    userId: user.id,
    recipientEmail: user.email,
    recipientName: user.name,
    type: 'INVITATION_CREATED',
    category: 'INVITATION',
    title: 'Your Digital Invitation Is Ready',
    message: `Undangan digital untuk acara "${project.name}" telah siap dan dapat dipratinjau.`,
    bodyHtml: `
      <p>Desain undangan digital untuk <strong>${project.name}</strong> telah selesai dirancang.</p>
      <div class="card-detail">
        <p style="margin: 0; font-size: 12px; color: #64748b;">Tautan Pratinjau Undangan:</p>
        <p style="margin: 4px 0 0 0; font-weight: 700; color: #2563eb; word-break: break-all;">${invitationUrl}</p>
      </div>
      <p>Anda dapat mengedit musik latar, galeri foto, kisah cinta, dan formulir RSVP sebelum mempublikasikannya.</p>
    `,
    actionUrl: invitationUrl,
    actionLabel: 'Pratinjau Undangan Digital',
    idempotencyKey: `inv_created_${project.id}`,
    channels: ['IN_APP', 'EMAIL'],
  });
}

// 8. Invitation Published
export async function sendInvitationPublishedNotification(user: { id: string; name: string; email: string; phone?: string }, project: EventProject, publicUrl: string) {
  await dispatchNotification({
    userId: user.id,
    recipientEmail: user.email,
    recipientName: user.name,
    recipientPhone: user.phone,
    type: 'INVITATION_PUBLISHED',
    category: 'INVITATION',
    title: 'Your Invitation Is Now Live',
    message: `Undangan digital "${project.name}" telah resmi tayang langsung (Live) dan siap dibagikan ke para tamu!`,
    bodyHtml: `
      <p>Undangan digital Anda kini telah aktif dan dapat diakses publik oleh seluruh tamu undangan.</p>
      <div class="card-detail">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 4px 0; color: #64748b;">Acara:</td><td style="font-weight: 700;">${project.name}</td></tr>
          <tr><td style="padding: 4px 0; color: #64748b;">Tautan Publik:</td><td style="font-weight: 700; color: #2563eb; word-break: break-all;">${publicUrl}</td></tr>
          <tr><td style="padding: 4px 0; color: #64748b;">Status:</td><td style="font-weight: 700; color: #16a34a;">Published (Online)</td></tr>
        </table>
      </div>
      <p>Gunakan tombol di bawah ini untuk melihat langsung undangan Anda, atau bagikan secara instan ke WhatsApp tamu.</p>
    `,
    actionUrl: publicUrl,
    actionLabel: 'Buka Undangan Live',
    idempotencyKey: `inv_pub_${project.id}`,
    channels: ['IN_APP', 'EMAIL', 'WHATSAPP'],
  });
}

// 9. Invitation Updated (Throttled)
export async function sendInvitationUpdatedNotification(user: { id: string; name: string; email: string }, project: EventProject) {
  // Idempotency TTL per hour prevents spam on repeated small edits
  const hourBucket = Math.floor(Date.now() / (60 * 60 * 1000));

  await dispatchNotification({
    userId: user.id,
    recipientEmail: user.email,
    recipientName: user.name,
    type: 'INVITATION_UPDATED',
    category: 'INVITATION',
    title: 'Your invitation has been updated successfully.',
    message: `Perubahan pada undangan "${project.name}" telah berhasil diperbarui dan disinkronkan.`,
    bodyHtml: `
      <p>Informasi pada undangan <strong>${project.name}</strong> baru saja diperbarui.</p>
      <p style="font-size: 13px; color: #64748b;">Seluruh tamu yang membuka tautan undangan akan langsung melihat konten terbaru secara real-time.</p>
    `,
    actionUrl: '/dashboard',
    actionLabel: 'Lihat Dasbor Undangan',
    idempotencyKey: `inv_upd_${project.id}_${hourBucket}`,
    channels: ['IN_APP', 'EMAIL'],
  });
}

// 10. Guest Management (Added / Imported)
export async function sendGuestListUpdatedNotification(
  user: { id: string; name: string; email: string },
  projectName: string,
  stats: { totalAdded: number; successCount: number; failedCount: number }
) {
  await dispatchNotification({
    userId: user.id,
    recipientEmail: user.email,
    recipientName: user.name,
    type: 'GUEST_LIST_UPDATED',
    category: 'GUEST',
    title: 'Guest List Updated',
    message: `Daftar tamu untuk "${projectName}" diperbarui: ${stats.successCount} tamu berhasil ditambahkan.`,
    bodyHtml: `
      <p>Proses pembaruan/impor daftar tamu untuk <strong>${projectName}</strong> telah selesai diproses.</p>
      <div class="card-detail">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 4px 0; color: #64748b;">Total Data:</td><td style="font-weight: 700;">${stats.totalAdded} tamu</td></tr>
          <tr><td style="padding: 4px 0; color: #64748b;">Berhasil Masuk:</td><td style="font-weight: 700; color: #16a34a;">${stats.successCount} record</td></tr>
          <tr><td style="padding: 4px 0; color: #64748b;">Gagal / Duplikat:</td><td style="font-weight: 700; color: ${stats.failedCount > 0 ? '#b91c1c' : '#64748b'};">${stats.failedCount} record</td></tr>
        </table>
      </div>
      <p>Setiap tamu secara otomatis telah memiliki kode QR E-Pass khusus untuk memudahkan proses check-in di hari H.</p>
    `,
    actionUrl: '/dashboard',
    actionLabel: 'Lihat Buku Tamu & RSVP',
    idempotencyKey: `guest_upd_${user.id}_${Date.now()}`,
    channels: ['IN_APP', 'EMAIL'],
  });
}

// 11. Guest RSVP Received
export async function sendRsvpReceivedNotification(
  ownerUser: { id: string; name: string; email: string },
  projectName: string,
  guest: Guest
) {
  const rsvpBadge = guest.rsvpStatus === 'Attending' ? 'Hadir' : guest.rsvpStatus === 'Not Attending' ? 'Tidak Hadir' : 'Mungkin Hadir';
  const timestamp = new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });

  await dispatchNotification({
    userId: ownerUser.id,
    recipientEmail: ownerUser.email,
    recipientName: ownerUser.name,
    type: 'RSVP_RECEIVED',
    category: 'RSVP',
    title: `New RSVP Received — ${projectName}`,
    message: `${guest.name} telah merespons RSVP: "${rsvpBadge}" (${guest.pax} orang).`,
    bodyHtml: `
      <p>Ada konfirmasi kehadiran baru untuk acara <strong>${projectName}</strong>:</p>
      <div class="card-detail">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 4px 0; color: #64748b;">Nama Tamu:</td><td style="font-weight: 700; color: #0f172a;">${guest.name}</td></tr>
          <tr><td style="padding: 4px 0; color: #64748b;">Status RSVP:</td><td style="font-weight: 700; color: ${guest.rsvpStatus === 'Attending' ? '#16a34a' : '#b91c1c'};">${rsvpBadge}</td></tr>
          <tr><td style="padding: 4px 0; color: #64748b;">Jumlah Tamu:</td><td style="font-weight: 700;">${guest.pax || 1} orang</td></tr>
          ${guest.wishes ? `<tr><td style="padding: 4px 0; color: #64748b;">Ucapan & Doa:</td><td style="font-style: italic; color: #334155;">"${guest.wishes}"</td></tr>` : ''}
          <tr><td style="padding: 4px 0; color: #64748b;">Waktu Konfirmasi:</td><td style="font-weight: 700;">${timestamp}</td></tr>
        </table>
      </div>
    `,
    actionUrl: '/dashboard',
    actionLabel: 'Periksa Rekapitulasi RSVP',
    idempotencyKey: `rsvp_${guest.id}_${guest.rsvpStatus}_${Math.floor(Date.now() / 60000)}`,
    channels: ['IN_APP', 'EMAIL', 'WHATSAPP'],
  });
}

// 12. QR Check-In Real-Time
export async function sendQrCheckInNotification(
  organizerUser: { id: string; name: string; email: string },
  guestName: string,
  projectName: string,
  checkInTime: string
) {
  await dispatchNotification({
    userId: organizerUser.id,
    recipientEmail: organizerUser.email,
    recipientName: organizerUser.name,
    type: 'QR_CHECKIN_SUCCESS',
    category: 'CHECK_IN',
    title: 'Guest checked in',
    message: `${guestName} telah berhasil check-in di acara "${projectName}" pada ${checkInTime}.`,
    bodyHtml: `
      <p>Pemberitahuan Check-In Resepsionis Real-Time:</p>
      <div class="card-detail">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 4px 0; color: #64748b;">Nama Tamu:</td><td style="font-weight: 700; color: #0f172a;">${guestName}</td></tr>
          <tr><td style="padding: 4px 0; color: #64748b;">Acara:</td><td style="font-weight: 700;">${projectName}</td></tr>
          <tr><td style="padding: 4px 0; color: #64748b;">Waktu Check-In:</td><td style="font-weight: 700; color: #16a34a;">${checkInTime}</td></tr>
        </table>
      </div>
    `,
    actionUrl: '/dashboard',
    actionLabel: 'Buka Buku Tamu Resepsionis',
    idempotencyKey: `chk_${guestName}_${Math.floor(Date.now() / 10000)}`,
    channels: ['IN_APP'], // High volume check-in focuses on in-app to avoid email spam
  });
}

// 13. Payment Submitted
export async function sendPaymentSubmittedNotification(user: { id: string; name: string; email: string }, payment: ServerPayment) {
  const formattedAmount = `Rp ${payment.amount.toLocaleString('id-ID')}`;

  // Notify User
  await dispatchNotification({
    userId: user.id,
    recipientEmail: user.email,
    recipientName: user.name,
    type: 'PAYMENT_SUBMITTED',
    category: 'PAYMENT',
    title: 'Payment Submitted — Awaiting Verification',
    message: `Konfirmasi pembayaran untuk paket "${payment.packageName}" (${payment.referenceNumber}) telah diterima dan sedang menunggu verifikasi admin.`,
    bodyHtml: `
      <p>Terima kasih, konfirmasi pembayaran Anda telah kami terima:</p>
      <div class="card-detail">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 4px 0; color: #64748b;">No. Referensi:</td><td style="font-weight: 700; color: #0f172a;">${payment.referenceNumber}</td></tr>
          <tr><td style="padding: 4px 0; color: #64748b;">Paket Langganan:</td><td style="font-weight: 700; color: #2563eb;">${payment.packageName}</td></tr>
          <tr><td style="padding: 4px 0; color: #64748b;">Total Transfer:</td><td style="font-weight: 700; color: #0f172a;">${formattedAmount}</td></tr>
          <tr><td style="padding: 4px 0; color: #64748b;">Metode Pembayaran:</td><td style="font-weight: 700;">${payment.paymentMethod}</td></tr>
          <tr><td style="padding: 4px 0; color: #64748b;">Status:</td><td style="font-weight: 700; color: #f59e0b;">Menunggu Verifikasi (Pending)</td></tr>
        </table>
      </div>
      <p>Tim admin kami akan memverifikasi mutasi bank dalam waktu 1x24 jam. Anda akan menerima pemberitahuan otomatis segera setelah paket diaktifkan.</p>
    `,
    actionUrl: '/dashboard',
    actionLabel: 'Periksa Status Pembayaran',
    idempotencyKey: `pay_sub_usr_${payment.id}`,
    channels: ['IN_APP', 'EMAIL'],
  });

  // Notify Admin
  await dispatchNotification({
    userId: 'usr_admin_001',
    targetRole: 'ADMIN',
    recipientEmail: 'admin@aa-eventmaker.my.id',
    recipientName: 'Administrator Platform',
    type: 'ADMIN_PAYMENT_ALERT',
    category: 'PAYMENT',
    title: 'New Payment Requires Verification',
    message: `Pembayaran baru membutuhkan verifikasi: ${user.name} (${payment.referenceNumber} - ${formattedAmount}).`,
    bodyHtml: `
      <p>Ada konfirmasi pembayaran baru yang membutuhkan tinjauan dan verifikasi administrator:</p>
      <div class="card-detail">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 4px 0; color: #64748b;">Pengguna:</td><td style="font-weight: 700;">${user.name} (${user.email})</td></tr>
          <tr><td style="padding: 4px 0; color: #64748b;">Paket:</td><td style="font-weight: 700; color: #2563eb;">${payment.packageName}</td></tr>
          <tr><td style="padding: 4px 0; color: #64748b;">Jumlah:</td><td style="font-weight: 700;">${formattedAmount}</td></tr>
          <tr><td style="padding: 4px 0; color: #64748b;">No. Ref:</td><td style="font-weight: 700;">${payment.referenceNumber}</td></tr>
          <tr><td style="padding: 4px 0; color: #64748b;">Waktu:</td><td style="font-weight: 700;">${new Date(payment.submittedAt).toLocaleString('id-ID')}</td></tr>
        </table>
      </div>
    `,
    actionUrl: '/admin/payments',
    actionLabel: 'Buka Menu Verifikasi Pembayaran',
    idempotencyKey: `pay_sub_adm_${payment.id}`,
    channels: ['IN_APP', 'EMAIL'],
    skipPreferencesCheck: true,
  });
}

// 14. Payment Approved
export async function sendPaymentApprovedNotification(user: { id: string; name: string; email: string }, payment: ServerPayment) {
  const activationDate = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const expirationDate = new Date(Date.now() + 365 * 24 * 3600 * 1000).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  await dispatchNotification({
    userId: user.id,
    recipientEmail: user.email,
    recipientName: user.name,
    type: 'PAYMENT_APPROVED',
    category: 'PAYMENT',
    title: 'Payment Confirmed — Your Package Is Active',
    message: `Pembayaran Anda telah disetujui! Paket "${payment.packageName}" kini telah aktif di akun Anda.`,
    bodyHtml: `
      <p>Kabar gembira! Pembayaran Anda telah berhasil diverifikasi oleh Administrator AA Event Maker.</p>
      <div class="card-detail">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 4px 0; color: #64748b;">Paket Aktif:</td><td style="font-weight: 700; color: #2563eb;">${payment.packageName}</td></tr>
          <tr><td style="padding: 4px 0; color: #64748b;">Nominal:</td><td style="font-weight: 700;">Rp ${payment.amount.toLocaleString('id-ID')}</td></tr>
          <tr><td style="padding: 4px 0; color: #64748b;">Tanggal Aktivasi:</td><td style="font-weight: 700;">${activationDate}</td></tr>
          <tr><td style="padding: 4px 0; color: #64748b;">Berlaku Sampai:</td><td style="font-weight: 700; color: #16a34a;">${expirationDate}</td></tr>
          <tr><td style="padding: 4px 0; color: #64748b;">Fitur Unggulan:</td><td style="font-weight: 600;">Undangan Tanpa Batas, AI Video & Music Studio, QR Pass Resepsionis</td></tr>
        </table>
      </div>
      <p>Semua batasan kuota pada akun Anda telah ditingkatkan secara otomatis.</p>
    `,
    actionUrl: '/dashboard',
    actionLabel: 'Mulai Buat Undangan Sekarang',
    idempotencyKey: `pay_appr_${payment.id}_${payment.status}`,
    channels: ['IN_APP', 'EMAIL'],
  });
}

// 15. Payment Rejected
export async function sendPaymentRejectedNotification(
  user: { id: string; name: string; email: string },
  payment: ServerPayment,
  reason: string
) {
  await dispatchNotification({
    userId: user.id,
    recipientEmail: user.email,
    recipientName: user.name,
    type: 'PAYMENT_REJECTED',
    category: 'PAYMENT',
    title: 'Payment Verification Requires Attention',
    message: `Konfirmasi pembayaran (${payment.referenceNumber}) memerlukan perhatian Anda: ${reason || 'Bukti transfer tidak terbaca'}.`,
    bodyHtml: `
      <p>Mohon maaf, bukti pembayaran yang Anda kirimkan belum dapat diverifikasi oleh tim admin kami.</p>
      <div class="card-detail">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 4px 0; color: #64748b;">No. Referensi:</td><td style="font-weight: 700;">${payment.referenceNumber}</td></tr>
          <tr><td style="padding: 4px 0; color: #64748b;">Paket:</td><td style="font-weight: 700;">${payment.packageName}</td></tr>
          <tr><td style="padding: 4px 0; color: #64748b;">Catatan Admin:</td><td style="font-weight: 700; color: #b91c1c;">${reason || 'Bukti transfer tidak sesuai atau dana belum masuk rekening.'}</td></tr>
        </table>
      </div>
      <p>Silakan periksa kembali mutasi rekening Anda dan unggah ulang bukti transfer yang jelas melalui tombol di bawah ini.</p>
    `,
    actionUrl: '/payment',
    actionLabel: 'Unggah Ulang Bukti Pembayaran',
    idempotencyKey: `pay_rej_${payment.id}_${payment.status}`,
    channels: ['IN_APP', 'EMAIL'],
  });
}

// 16. Subscription Upgraded
export async function sendPackageUpgradedNotification(
  user: { id: string; name: string; email: string },
  previousPackage: string,
  newPackage: string
) {
  await dispatchNotification({
    userId: user.id,
    recipientEmail: user.email,
    recipientName: user.name,
    type: 'PACKAGE_UPGRADED',
    category: 'SUBSCRIPTION',
    title: 'Your AA Event Maker Package Has Been Upgraded',
    message: `Selamat! Akun Anda telah berhasil di-upgrade dari ${previousPackage} ke ${newPackage}.`,
    bodyHtml: `
      <p>Paket langganan AA Event Maker Anda telah berhasil ditingkatkan:</p>
      <div class="card-detail">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 4px 0; color: #64748b;">Paket Sebelumnya:</td><td style="text-decoration: line-through; color: #64748b;">${previousPackage}</td></tr>
          <tr><td style="padding: 4px 0; color: #64748b;">Paket Baru:</td><td style="font-weight: 700; color: #2563eb;">${newPackage}</td></tr>
          <tr><td style="padding: 4px 0; color: #64748b;">Tanggal Upgrade:</td><td style="font-weight: 700;">${new Date().toLocaleDateString('id-ID')}</td></tr>
        </table>
      </div>
    `,
    actionUrl: '/dashboard',
    actionLabel: 'Jelajahi Fitur Baru',
    idempotencyKey: `pkg_upgr_${user.id}_${newPackage}_${Date.now()}`,
    channels: ['IN_APP', 'EMAIL'],
  });
}

// 17. Contact / Support Request
export async function sendSupportRequestNotifications(
  user: { id: string; name: string; email: string },
  ticket: { id: string; subject: string; message: string; timestamp: number }
) {
  // User receipt
  await dispatchNotification({
    userId: user.id,
    recipientEmail: user.email,
    recipientName: user.name,
    type: 'SUPPORT_REQUEST_RECEIVED',
    category: 'SYSTEM',
    title: 'Your Support Request Has Been Received',
    message: `Permintaan bantuan Anda (#${ticket.id}) telah diterima. Tim AA Event Maker akan segera merespons.`,
    bodyHtml: `
      <p>Terima kasih telah menghubungi kami. Tiket bantuan Anda telah terdaftar:</p>
      <div class="card-detail">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 4px 0; color: #64748b;">ID Tiket:</td><td style="font-weight: 700; color: #2563eb;">#${ticket.id}</td></tr>
          <tr><td style="padding: 4px 0; color: #64748b;">Subjek:</td><td style="font-weight: 700;">${ticket.subject}</td></tr>
          <tr><td style="padding: 4px 0; color: #64748b;">Pesan:</td><td style="color: #334155;">${ticket.message}</td></tr>
        </table>
      </div>
      <p>Petugas helpdesk kami akan membalas ke email Anda dalam waktu 1x24 jam.</p>
    `,
    idempotencyKey: `supp_usr_${ticket.id}`,
    channels: ['IN_APP', 'EMAIL'],
  });

  // Admin alert
  await dispatchNotification({
    userId: 'usr_admin_001',
    targetRole: 'ADMIN',
    recipientEmail: 'admin@aa-eventmaker.my.id',
    recipientName: 'Administrator Helpdesk',
    type: 'ADMIN_SUPPORT_REQUEST',
    category: 'SYSTEM',
    title: `New Support Request: #${ticket.id}`,
    message: `Tiket bantuan baru dari ${user.name} (${user.email}): "${ticket.subject}".`,
    bodyHtml: `
      <p>Ada tiket dukungan baru yang masuk dari pengguna:</p>
      <div class="card-detail">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 4px 0; color: #64748b;">ID Tiket:</td><td style="font-weight: 700;">#${ticket.id}</td></tr>
          <tr><td style="padding: 4px 0; color: #64748b;">Pengguna:</td><td style="font-weight: 700;">${user.name} (${user.email})</td></tr>
          <tr><td style="padding: 4px 0; color: #64748b;">Subjek:</td><td style="font-weight: 700;">${ticket.subject}</td></tr>
          <tr><td style="padding: 4px 0; color: #64748b;">Isi Pesan:</td><td style="color: #334155;">${ticket.message}</td></tr>
        </table>
      </div>
    `,
    idempotencyKey: `supp_adm_${ticket.id}`,
    channels: ['IN_APP', 'EMAIL'],
    skipPreferencesCheck: true,
  });
}
