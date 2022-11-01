import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import {
  PLUNK_ADDRESS_SEARCH_PARAM,
  PLUNK_ADDRESS_SEARCH_URL,
  PLUNK_API_HEADER_NAME,
  PLUNK_HOME_VALUATION_URL,
  PLUNK_MODULE_OPTIONS,
} from './plunk.constants';
import { PlunkService } from './plunk.service';
import * as camelifyFunctions from './utils/camelify.util';

const MOCKED_API_KEY = 'mocked-api-key';

describe('PlunkService', () => {
  let plunkService: PlunkService;
  let httpService: HttpService;
  const requestOptions = {
    headers: {
      [PLUNK_API_HEADER_NAME]: MOCKED_API_KEY,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlunkService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn().mockImplementation(() => of({})),
          },
        },
        {
          provide: PLUNK_MODULE_OPTIONS,
          useValue: {
            apiKey: MOCKED_API_KEY,
          },
        },
      ],
    }).compile();

    plunkService = module.get(PlunkService);
    httpService = module.get(HttpService);
  });

  it('should be defined', () => {
    expect(plunkService).toBeDefined();
  });

  it('should parse and return plunk api response for addresses when calling findAddresses', async () => {
    const mockedAddress = 'mocked address';
    const mockedPlunkResponse = {
      data: {
        hits: [
          {
            address: {
              street_pre_direction: 'E',
              street_post_direction: '',
              secondary_designator: '',
              street_name: 'ALTADENA',
              street_suffix: 'DR',
              secondary_number: '',
              primary_number: '1675',
              parcel_id: 'd1d848bc-7e8d-585a-8a97-03313892a959',
              city_name: 'ALTADENA',
              state_code: 'CA',
              zip_code: '91001',
            },
          },
        ],
      },
    };

    const mockedServiceResponse = {
      hits: [
        {
          address: {
            streetPreDirection: 'E',
            streetPostDirection: '',
            secondaryDesignator: '',
            streetName: 'ALTADENA',
            streetSuffix: 'DR',
            secondaryNumber: '',
            primaryNumber: '1675',
            parcelId: 'd1d848bc-7e8d-585a-8a97-03313892a959',
            cityName: 'ALTADENA',
            stateCode: 'CA',
            zipCode: '91001',
          },
        },
      ],
    };
    httpService.get = jest
      .fn()
      .mockImplementation(() => of(mockedPlunkResponse));
    const camelifyObjectSpy = jest.spyOn(camelifyFunctions, 'camelifyObject');
    const response = await plunkService.findAddresses(mockedAddress);
    expect(httpService.get).toHaveBeenCalledWith(
      `${PLUNK_ADDRESS_SEARCH_URL}`,
      {
        ...requestOptions,
        params: {
          [`${PLUNK_ADDRESS_SEARCH_PARAM}`]: mockedAddress,
        },
      }
    );
    mockedPlunkResponse.data.hits.forEach(({ address }) => {
      expect(camelifyObjectSpy).toHaveBeenCalledWith(address);
    });
    expect(response).toEqual(mockedServiceResponse);
  });

  it('should parse and return plunk api response for home valuations when calling getHomeValuationByParcelId', async () => {
    const mockedParcelId = 'mocked parcelId';
    const mockedPlunkResponse = {
      data: {
        appreciation_per_second: 0.03204034391534392,
        value_date: '2022-10-08',
        value_dollars: 2340613,
        parcel_id: 'd1d848bc-7e8d-585a-8a97-03313892a959',
      },
    };

    const mockedServiceResponse = {
      appreciationPerSecond: 0.03204034391534392,
      valueDate: '2022-10-08',
      valueDollars: 2340613,
      parcelId: 'd1d848bc-7e8d-585a-8a97-03313892a959',
    };
    httpService.get = jest
      .fn()
      .mockImplementation(() => of(mockedPlunkResponse));
    const camelifyObjectSpy = jest.spyOn(camelifyFunctions, 'camelifyObject');
    const response = await plunkService.getHomeValuationByParcelId(
      mockedParcelId
    );
    expect(camelifyObjectSpy).toHaveBeenCalledWith(mockedPlunkResponse.data);
    expect(httpService.get).toHaveBeenCalledWith(
      `${PLUNK_HOME_VALUATION_URL}/${mockedParcelId}`,
      {
        ...requestOptions,
      }
    );
    expect(response).toEqual(mockedServiceResponse);
  });
});
