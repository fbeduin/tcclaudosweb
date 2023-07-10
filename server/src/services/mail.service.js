const nodemailer = require('nodemailer'); 

exports.sendEmail = async (destinatario, assunto, mensagem) => {
    let transport = nodemailer.createTransport({
        host: process.env.MAIL_URL,
        port: process.env.MAIL_PORT,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS
        }
      });

    let mailOptions = {
        from: '"Clínica" <clinica@aaa.com>',
        to: destinatario,
        subject: assunto,
        html: mensagem
    };

    transport.sendMail(mailOptions, (error, info) => {
        if (error) return console.log(error);
        console.log(`Mensagem enviada: ${info.messageId}`);
    });
};