import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { AddressesResponse, Valuation } from './dtos';
import { PlunkModuleOptions } from './interfaces/plunk-module-options.interface';
import {
  PLUNK_ADDRESS_SEARCH_PARAM,
  PLUNK_ADDRESS_SEARCH_URL,
  PLUNK_API_HEADER_NAME,
  PLUNK_HOME_VALUATION_URL,
  PLUNK_MODULE_OPTIONS,
} from './plunk.constants';
import { camelifyObject } from './utils/camelify.util';

@Injectable()
export class PlunkService {
  private requestOptions;
  constructor(
    @Inject(PLUNK_MODULE_OPTIONS) private options: PlunkModuleOptions,
    private readonly httpService: HttpService
  ) {
    this.requestOptions = {
      headers: {
        [PLUNK_API_HEADER_NAME]: this.options.apiKey,
      },
    };
  }

  async findAddresses(address: string): Promise<AddressesResponse> {
    const { data } = await firstValueFrom(
      this.httpService.get(`${PLUNK_ADDRESS_SEARCH_URL}`, {
        ...this.requestOptions,
        params: {
          [`${PLUNK_ADDRESS_SEARCH_PARAM}`]: address,
        },
      })
    );
    return {
      hits: data.hits!.map((res) => ({
        address: camelifyObject(res.address),
      })),
    };
  }

  async getHomeValuationByParcelId(
    parcelId: string
  ): Promise<Valuation | never> {
    const { data } = await firstValueFrom(
      this.httpService.get(`${PLUNK_HOME_VALUATION_URL}/${parcelId}`, {
        ...this.requestOptions,
      })
    );
    return camelifyObject(data) as Valuation;
  }
}
