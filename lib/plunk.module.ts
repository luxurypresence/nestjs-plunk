import { HttpModule } from '@nestjs/axios';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import {
  PlunkModuleAsyncOptions,
  PlunkModuleOptions,
  PlunkModuleOptionsFactory,
} from './interfaces/plunk-module-options.interface';
import { PLUNK_MODULE_OPTIONS } from './plunk.constants';
import { PlunkService } from './plunk.service';

@Module({
  imports: [HttpModule],
  providers: [PlunkService],
  exports: [PlunkService],
})
export class PlunkModule {
  static register(options: PlunkModuleOptions): DynamicModule {
    return {
      module: PlunkModule,
      providers: [{ provide: PLUNK_MODULE_OPTIONS, useValue: options }],
    };
  }

  static registerAsync(options: PlunkModuleAsyncOptions): DynamicModule {
    return {
      module: PlunkModule,
      imports: options.imports || [],
      providers: [...this.createAsyncProviders(options)],
    };
  }

  private static createAsyncProviders(
    options: PlunkModuleAsyncOptions
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: PlunkModuleAsyncOptions
  ): Provider {
    if (options.useFactory) {
      return {
        provide: PLUNK_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide: PLUNK_MODULE_OPTIONS,
      useFactory: async (optionsFactory: PlunkModuleOptionsFactory) =>
        await optionsFactory.createPlunkModuleOptions(),
      inject: [options.useExisting || options.useClass],
    };
  }
}
