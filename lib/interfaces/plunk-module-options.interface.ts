import { ModuleMetadata, Type } from '@nestjs/common/interfaces';

export type PlunkModuleOptions = {
  apiKey: string;
};

export interface PlunkModuleOptionsFactory {
  createPlunkModuleOptions(): Promise<PlunkModuleOptions> | PlunkModuleOptions;
}

export interface PlunkModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<PlunkModuleOptionsFactory>;
  useClass?: Type<PlunkModuleOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<PlunkModuleOptions> | PlunkModuleOptions;
  inject?: any[];
}
