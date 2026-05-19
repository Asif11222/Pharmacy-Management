import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
	constructor(private readonly mailerService: MailerService) {}

	async sendPasswordResetEmail(email: string, resetToken: string) {
		const frontendUrl =
			process.env.FRONTEND_URL ?? 'http://localhost:30001';
		const resetUrl = `${frontendUrl}/reset-password?token=${encodeURIComponent(resetToken)}`;

		return this.mailerService.sendMail({
			to: email,
			subject: 'Reset your password',
			text: `You requested a password reset. Use this token: ${resetToken}. Reset link: ${resetUrl}`,
			html: `
				<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
					<h2>Password Reset Request</h2>
					<p>You requested a password reset for your Pharmacy Management account.</p>
					<p><strong>Reset token:</strong> ${resetToken}</p>
					<p><strong>Reset link:</strong> <a href="${resetUrl}">${resetUrl}</a></p>
					<p>This token expires in 15 minutes.</p>
				</div>
			`,
		});
	}
}
