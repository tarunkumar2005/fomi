import LoginEmailTemplate from '@/components/template/login-template';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function sendLoginEmail(magicLink: string, userEmail: string) {
  try {
    const data = await resend.emails.send({
      from: 'Fomi <no-reply@iamtarunkumar.me>',
      to: userEmail,
      subject: 'Your magic link to sign in to Fomi',
      react: LoginEmailTemplate({
        magicLink,
        userEmail
      })
    })

    console.log('Magic link email sent', data);
    return data;
  } catch (error) {
    console.log('Error sending magic link email', error);
    throw error;
  }
}