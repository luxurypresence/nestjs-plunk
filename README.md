## Description

Plunk module for [Nest](https://github.com/nestjs/nest) based on the [plunk api](https://api.getplunk.com/homevalue/openapi).

## Installation

```bash
$ npm i --save @luxury-presence/nestjs-plunk @nestjs/axios rxjs
```

## Usage

Import `PlunkModule`:

```typescript
@Module({
  imports: [PlunkModule.register({
    apiKey: 'PLUNK_API_KEY',
  })],
  providers: [...],
})
export class SearchModule {}
```

Inject `PlunkService`:

```typescript
@Injectable()
export class SearchService {
  constructor(private readonly plunkService: PlunkService) {}

  async findByAddress(address: string): Promise<Address> {
      return this.plunkService.findAddresses(address);
  }

  async findByParcelId(parcelId: string): Promise<Valuation> {
      return this.plunkService.getHomeValuationByParcelId(parcelId);
  }
}
```

## Async options

Quite often you might want to asynchronously pass your module options instead of passing them beforehand. In such case, use `registerAsync()` method, that provides a couple of various ways to deal with async data.

**1. Use factory**

```typescript
PlunkModule.registerAsync({
  useFactory: () => ({
    apiKey: 'PLUNK_API_KEY',
  })
});
```

Obviously, our factory behaves like every other one (might be `async` and is able to inject dependencies through `inject`).

```typescript
PlunkModule.registerAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    apiKey: configService.get('PLUNK_API_KEY'),
  }),
  inject: [ConfigService],
}),
```

**2. Use class**

```typescript
PlunkModule.registerAsync({
  useClass: PlunkConfigService
});
```

Above construction will instantiate `PlunkConfigService` inside `PlunkModule` and will leverage it to create options object.

```typescript
class PlunkConfigService implements PlunkModuleOptionsFactory {
  createPlunkModuleOptions(): PlunkModuleOptions {
    return {
       apiKey: 'PLUNK_API_KEY',
    };
  }
}
```

**3. Use existing**

```typescript
PlunkModule.registerAsync({
  imports: [ConfigModule],
  useExisting: ConfigService,
}),
```

It works the same as `useClass` with one critical difference - `PlunkModule` will lookup imported modules to reuse already created `ConfigService`, instead of instantiating it on its own.

## License

[MIT](./LICENSE)