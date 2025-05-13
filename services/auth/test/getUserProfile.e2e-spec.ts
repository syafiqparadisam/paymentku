import { describe, it } from "node:test";
import { AppModule } from "../src/app.module";
import { UsersModule } from "../src/users/users.module";
import { RedisModule } from "../src/redis/redis.module";
import { UsersService } from "../src/users/users.service";
import { RedisService } from "../src/redis/redis.service";
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { loginRequest, registerRequest, VerifyDeleteAccount } from "../src/auth/dtos/request";
import cookieParser from "cookie-parser";
import { parsingCookie } from "./utils";
import request from 'supertest';
import { AuthModule } from "../src/auth/auth.module";
import { AccessTokenGuardGuard } from "src/access-token-guard/access-token-guard.guard";

describe("Get User Profile", () => {
	let app: INestApplication;
	let userSvc: UsersService;
	let redisSvc: RedisService;
	let loginDto: loginRequest;
	let userRegister: registerRequest;
	let cookies;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
		  imports: [AppModule, UsersModule, RedisModule, AccessTokenGuardGuard],
		}).compile();
	
		app = moduleFixture.createNestApplication();
		userSvc = moduleFixture.get<UsersService>(UsersService);
		redisSvc = moduleFixture.get<RedisService>(RedisService);
	
		app.use(cookieParser());
		app.enableCors();
		await app.init();
	
		userRegister = {
		  user: 'syafiq12',
		  password: '12345678',
		  email: 'syafiq12@gmail.com',
		};
	
		// create user
		await userSvc.createAccount(userRegister);
	  });
	
	  //login user before each test
	  beforeEach(async () => {
		loginDto = {
		  user: userRegister.user,
		  password: userRegister.password,
		};
	
		const req = await request(app.getHttpServer())
		  .post('/api/v1/login')
		  .send(loginDto)
		  .set('Content-type', 'application/json');
	
		cookies = req.header['set-cookie'];
	  });
	
	  // delete authTooken after each test
	  afterEach(async () => {
		cookies as Array<string>;
		if (Array.isArray(cookies)) {
		  cookies.map((cookie) => {
			const objCookie = parsingCookie(cookie);
			const lockKey = crypto.randomUUID();
			const deleteToken = async () => {
			  return await redisSvc.deleteToken(
				objCookie.value.slice(10, objCookie.value.length),
				[lockKey],
			  );
			};
			deleteToken();
		  });
		}
	  });
	
	  // after test ended, close the server
	  afterAll(async () => {
		try {
		  await app.close();
		} catch (error) {
		  console.log(error);
		}
	  });
	
	  it("Should return user", async () => {
		const req = await request(app.getHttpServer()).get("/api/v1/profile").set('Cookie', cookies)

		console.log(req.error)
		expect(req.status).toBe(200)
	  })
})