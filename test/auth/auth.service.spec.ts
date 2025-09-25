import { AuthService } from '../../src/modules/auth/auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../src/modules/user/user.service';
import { Argon2Service } from '../../src/helper/argon2/argon2.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService.#generateRTK(User)', () => {
  let authService: AuthService;
  let userService: UserService;
  let refreshTokenRepositoryMock: { save: jest.Mock }

  const testCases = [
    { envValue: '1d', expectedDate: '2025-01-02T00:00:00.000Z' },
    { envValue: '1w', expectedDate: '2025-01-08T00:00:00.000Z' },
    { envValue: '1m', expectedDate: '2025-01-31T00:00:00.000Z' },
    { envValue: '1y', expectedDate: '2026-01-01T00:00:00.000Z' },
  ];

  beforeEach(async () => {
    refreshTokenRepositoryMock = { save: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        Argon2Service,
        JwtService,
        UserService,
        {
          provide: 'REFRESH_TOKEN_REPOSITORY',
          useValue: refreshTokenRepositoryMock,
        },
        {
          provide: 'USER_REPOSITORY',
          useValue: {},
        },
      ],
    }).compile();

    authService = module.get(AuthService);
    userService = module.get(UserService);

    jest.useFakeTimers().setSystemTime(new Date('2025-01-01T00:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test.each(testCases)(
    'should generate a refresh token with REFRESH_TOKEN_EXPIRES=$envValue',
    async ({ envValue, expectedDate }) => {
      // given
      const mockUser = { id: 1, email: 'test@example.com' } as any;
      process.env.REFRESH_TOKEN_EXPIRES = envValue;

      // when
      const rtk = await authService.generateRTK(mockUser);
      const savedToken = refreshTokenRepositoryMock.save.mock.calls[0][0];

      // then
      expect(rtk).toHaveLength(128);
      expect(refreshTokenRepositoryMock.save).toHaveBeenCalled();
      expect(new Date(savedToken.expiresAt).toISOString()).toBe(expectedDate);
    },
  );
});
