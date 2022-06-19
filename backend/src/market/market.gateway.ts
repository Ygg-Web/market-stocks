import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { readFileSync, writeFileSync } from 'fs';
import { SetDate } from './dto/settings.dto';
import { Trade } from './dto/trade.dto';
import { Stock } from './dto/stocks.dto';
import { Database } from './dto/database.dto';

const database: Database = JSON.parse(readFileSync('db.json', 'utf-8'));

let startTimeOut: any;
let interval: any;
let endTimeOut: any;
const currentDate: number = new Date().getTime();
const startTime: number = new Date(database.settings.dateStart).getTime();
const endTime: number = new Date(database.settings.dateEnd).getTime();


@Injectable()
@WebSocketGateway()
export class MarketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  async handleConnection() {
    console.log('Клиет подключился');
  }

  async handleDisconnect() {
    console.log('Клиет отключился');
  }

  @SubscribeMessage('start')
  async handleStart(client: Socket, date: SetDate) {
    console.log('Торги начались');
    console.log(date);
    clearTimeout(startTimeOut);
    clearInterval(interval);
    this.server.sockets.json.emit('start', date);
    client.broadcast.emit('start', date);

    database.settings.status = 'start';
    database.settings.interval = date.interval;
    database.settings.dateEnd = date.dateEnd;
    writeFileSync('db.json', JSON.stringify(database, null, 2));

    endTimeOut = setTimeout(() => {
      console.log('end');
      this.server.sockets.json.emit('end');

      database.settings.status = 'end';
      writeFileSync('db.json', JSON.stringify(database, null, 2));
      clearInterval(interval);
    }, endTime - currentDate);

    interval = setInterval(() => {
      for (let stock of database.stocks) {
        generatePrice(stock);
      }
      console.log('Цена акций изменилась');
      this.server.sockets.json.emit('change', database.stocks);

      writeFileSync('db.json', JSON.stringify(database, null, 2));
    }, database.settings.interval * 1000);
  }

  @SubscribeMessage('end')
  async handleEnd(client: Socket) {
    console.log('Торги окончены');
    clearTimeout(endTimeOut);
    clearInterval(interval);
    this.server.sockets.json.emit('end');
    client.broadcast.json.emit('end');

    database.settings.status = 'end';
    writeFileSync('db.json', JSON.stringify(database, null, 2));
  }

  @SubscribeMessage('sell')
  async handleSell(client: Socket, trade: Trade) {
    console.log('sell', trade);
    const countStocksUser = database.users[trade.sellerId].stocks[trade.stockId].count;

    if (trade.count <= countStocksUser) {
      this.server.sockets.json.emit('sell', trade);
      client.broadcast.json.emit('sell', trade);

      database.users[trade.sellerId].stocks[trade.stockId].count -= trade.count;
      database.users[trade.sellerId].balance += trade.price * trade.count;
      database.stocks[trade.stockId].count += trade.count;
      writeFileSync('db.json', JSON.stringify(database, null, 2));
    }
  }

  @SubscribeMessage('buy')
  async handleBuy(client: Socket, trade: Trade) {
    console.log('buy', trade);
    const balanceUser = database.users[trade.buyerId].balance;

    if (balanceUser >= trade.count * trade.price) {
      this.server.sockets.json.emit('buy', trade);
      client.broadcast.emit('buy', trade);

      database.users[trade.buyerId].stocks[trade.stockId].count += trade.count;
      database.users[trade.buyerId].balance -= trade.price * trade.count;
      database.stocks[trade.stockId].count -= trade.count;
      writeFileSync('db.json', JSON.stringify(database, null, 2));
    }
  }

  startTimeOut = setTimeout(() => {
    console.log('start');
    this.server.sockets.json.emit('start');
    database.settings.status = 'start';
    writeFileSync('db.json', JSON.stringify(database, null, 2));

    interval = setInterval(() => {
      for (let stock of database.stocks) {
        generatePrice(stock);
      }
      console.log('Цена акций изменилась');
      this.server.sockets.json.emit('change', database.stocks);

      writeFileSync('db.json', JSON.stringify(database, null, 2));
    }, database.settings.interval * 1000);
  }, startTime - currentDate);

  endTimeOut = setTimeout(() => {
    console.log('end');
    this.server.sockets.json.emit('end');
    database.settings.status = 'end';
    writeFileSync('db.json', JSON.stringify(database, null, 2));
    clearInterval(interval);
  }, endTime - currentDate);
}

const generatePrice = (stock: Stock): void => {
  let dif: number;

  dif = Math.round(Math.random() * (stock.stepChange * 2) - stock.stepChange);
  dif > 0 ? stock.price = stock.price + dif : stock.price = 10;
};

