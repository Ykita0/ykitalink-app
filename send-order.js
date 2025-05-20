import nodemailer from 'nodemailer';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Méthode non autorisée');
  }

  const { email, pdfContent } = req.body;

  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;
    const lines = pdfContent.split('\n');

    lines.forEach((line, i) => {
      page.drawText(line.trim(), {
        x: 50,
        y: 380 - i * 20,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
    });

    const pdfBytes = await pdfDoc.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'moiseatiky@gmail.com',
        pass: 'vldpjbhfrnrcocxz',
      },
    });

    await transporter.sendMail({
      from: 'YkitaLink <moiseatiky@gmail.com>',
      to: email,
      subject: 'Nouvelle commande de T-shirt - YkitaLink',
      text: 'Veuillez trouver ci-joint le résumé de la commande.',
      attachments: [
        {
          filename: 'commande.pdf',
          content: pdfBytes,
          contentType: 'application/pdf',
        },
      ],
    });

    res.status(200).json({ message: 'Commande envoyée par email.' });
  } catch (error) {
    console.error('Erreur d’envoi :', error);
    res.status(500).json({ error: 'Erreur lors de l’envoi du mail' });
  }
}
