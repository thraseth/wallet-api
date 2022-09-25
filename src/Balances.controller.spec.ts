import { Test} from '@nestjs/testing';
import * as request from 'supertest';
import { BalancesModule } from './Balances.module';
import { INestApplication } from '@nestjs/common';

describe('BalancesController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [BalancesModule]
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe('ETHEREUM - Right parameters : ', () => {
    it('should return an array of token objects', async () => {
      async() => {await request(app.getHttpServer())
        .get('/Balances/ethereum/0x01Fe13639b3C0B9127412b6f8210e4753ac1Da37')
        .then(response =>{
          expect('token_address' in response.body[0]).toBeTruthy();
        })
      }
    });
  });

  describe('POLYGON - Right parameters : ', () => {
    it('should return an array of token objects', async () => {
      async() => {await request(app.getHttpServer())
        .get('/Balances/polygon/0x01Fe13639b3C0B9127412b6f8210e4753ac1Da37')
        .then(response =>{
          expect('token_address' in response.body[0]).toBeTruthy();
        })
      }
    });
  });

  describe('ARBITRUM - Right parameters : ', () => {
    it('should return an array of token objects', async () => {
      async() => {await request(app.getHttpServer())
        .get('/Balances/arbitrum/0x01Fe13639b3C0B9127412b6f8210e4753ac1Da37')
        .then(response =>{
          expect('token_address' in response.body[0]).toBeTruthy();
        })
      }
    });
  });

  describe('Wrong parameters (chain) : ', () => {
    it('should throw an error', async () => {
      async() => {await request(app.getHttpServer())
      .get('/Balances/ether/0x01Fe13639b3C0B9127412b6f8210e4753ac1Da37')
      .expect(500)
      }
    });
  });

  describe('Wrong parameters (wallet) : ', () => {
    it('should throw an error emitted by Alchemy', async () => {
      async () => {await request(app.getHttpServer())
      .get('/Balances/ethereum/wrongwallet')
      .expect(500)
      }
    });
  });

  describe('Wrong endpoint ("/Balances/ethereum") : ', () => {
    it('should throw an error', async () => {
      async() => {await request(app.getHttpServer())
      .get('/Balances/ethereum')
      .expect(500)
      }
    });
  });

  
});

