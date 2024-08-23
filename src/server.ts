import { createServer } from 'http';
import app from './config/app.config';
import { AppDataSource } from './config/database.config';
import { DotenvConfig } from './config/env.config';
import Print from './utils/print';
import { Socket } from './socket/socket';

function listen() {
  const socket = new Socket();
  const PORT = DotenvConfig.PORT;
  const httpServer = createServer(app);
  socket.ChatSocket(httpServer);
  httpServer.listen(PORT);
  Print.info(`🚀 Server is listening on port ${DotenvConfig.PORT}`);
}

AppDataSource.initialize()
  .then(async () => {
    Print.info(`🚀 Database connected successfully `);
    listen();
  })
  .catch(err => {
    Print.error(`❌ Database failed to connect${err?.message}`);
  });
