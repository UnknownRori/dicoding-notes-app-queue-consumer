import amqp from 'amqplib';
import dotenv from 'dotenv';

import NotesService from './NotesService.mjs';
import MailSender from './MailSender.mjs';
import Listener from './Listener.mjs';

const init = async () => {
    dotenv.config();

    const notesService = new NotesService();
    const mailSender = new MailSender();
    const listener = new Listener(notesService, mailSender);

    const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
    const channel = await connection.createChannel();

    await channel.assertQueue('export:notes', {
        durable: true,
    });

    channel.consume('export:notes', listener.listen, { noAck: true });
};

init();
