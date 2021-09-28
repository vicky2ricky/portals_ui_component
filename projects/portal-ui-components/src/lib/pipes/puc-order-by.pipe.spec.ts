import { PucOrderByPipe } from './puc-order-by.pipe';

describe('PucOrderByPipe', () => {
  it('create an instance', () => {
    const pipe = new PucOrderByPipe();
    expect(pipe).toBeTruthy();
  });

  it('transform: should sort data based on desc direction', () => {
    const sampleData = [
      {
        _id: 'SG1',
        dis: 'Smartgroup1',
        updatedAt: '2020-01-08T09:23:26.204Z',
        children: [
          {
            dis: 'secret dev 239',
            type: 'building',
            _id: 'BU1',
            ccuCount: 1,
            zoneCount: 1,
            children: [
              {
                _id: 'SY1',
                gatewayRef: 'GW1',
                dis: 'ji',
                ahuRef: 'AH1',
                siteRef: '@BU1',
                type: 'system',
                children: [
                  {
                    _id: 'Z1',
                    dis: 'z1',
                    siteRef: '@BU1',
                    ahuRef: '@AH1',
                    gatewayRef: '',
                    type: 'zone',
                    children: [
                      {
                        _id: 'M1',
                        roomRef: 'R1',
                        dis: 'secret dev 239-VAV-7400',
                        ahuRef: '@AH1',
                        siteRef: '@BU1',
                        type: 'module',
                        selected: true
                      }
                    ]

                  }
                ],

              }
            ],
            address: {
              geoAddr: 'kl',
              geoCity: 'lk',
              geoPostalCode: '517501',
              geoState: 'kl',
              geoCountry: 'lk'
            },
            selected: true
          },
          {
            dis: 'building-2',
            type: 'building',
            _id: 'BU1',
            ccuCount: 2,
            zoneCount: 2,
            children: [
              {
                _id: 'SY1',
                gatewayRef: 'GW1',
                dis: 'ji',
                ahuRef: 'AH1',
                siteRef: '@BU1',
                type: 'system',
                children: [
                  {
                    _id: 'Z1',
                    dis: 'z1',
                    siteRef: '@BU1',
                    ahuRef: '@AH1',
                    gatewayRef: '',
                    type: 'zone',
                    children: [
                      {
                        _id: 'M1',
                        roomRef: 'R1',
                        dis: 'secret dev 239-VAV-7400',
                        ahuRef: '@AH1',
                        siteRef: '@BU1',
                        type: 'module',
                        selected: true
                      }
                    ]

                  }
                ],

              }
            ],
            address: {
              geoAddr: 'kl',
              geoCity: 'lk',
              geoPostalCode: '517501',
              geoState: 'kl',
              geoCountry: 'lk'
            },
            selected: true
          },

        ]
      }
    ];

    const pipe = new PucOrderByPipe();
    pipe.transform(sampleData[0].children, 'ccuCount', 'desc');

    expect(sampleData[0].children[0].dis).toEqual('building-2');
  });

  it('transform: should return the value as is if property not mentioned', () => {
    const sampleData = [
      {
        _id: 'SG1',
        dis: 'Smartgroup1',
        updatedAt: '2020-01-08T09:23:26.204Z',
        children: [
          {
            dis: 'secret dev 239',
            type: 'building',
            _id: 'BU1',
            ccuCount: 1,
            zoneCount: 1,
            children: [
              {
                _id: 'SY1',
                gatewayRef: 'GW1',
                dis: 'ji',
                ahuRef: 'AH1',
                siteRef: '@BU1',
                type: 'system',
                children: [
                  {
                    _id: 'Z1',
                    dis: 'z1',
                    siteRef: '@BU1',
                    ahuRef: '@AH1',
                    gatewayRef: '',
                    type: 'zone',
                    children: [
                      {
                        _id: 'M1',
                        roomRef: 'R1',
                        dis: 'secret dev 239-VAV-7400',
                        ahuRef: '@AH1',
                        siteRef: '@BU1',
                        type: 'module',
                        selected: true
                      }
                    ]

                  }
                ],

              }
            ],
            address: {
              geoAddr: 'kl',
              geoCity: 'lk',
              geoPostalCode: '517501',
              geoState: 'kl',
              geoCountry: 'lk'
            },
            selected: true
          },
          {
            dis: 'building-2',
            type: 'building',
            _id: 'BU1',
            ccuCount: 2,
            zoneCount: 2,
            children: [
              {
                _id: 'SY1',
                gatewayRef: 'GW1',
                dis: 'ji',
                ahuRef: 'AH1',
                siteRef: '@BU1',
                type: 'system',
                children: [
                  {
                    _id: 'Z1',
                    dis: 'z1',
                    siteRef: '@BU1',
                    ahuRef: '@AH1',
                    gatewayRef: '',
                    type: 'zone',
                    children: [
                      {
                        _id: 'M1',
                        roomRef: 'R1',
                        dis: 'secret dev 239-VAV-7400',
                        ahuRef: '@AH1',
                        siteRef: '@BU1',
                        type: 'module',
                        selected: true
                      }
                    ]

                  }
                ],

              }
            ],
            address: {
              geoAddr: 'kl',
              geoCity: 'lk',
              geoPostalCode: '517501',
              geoState: 'kl',
              geoCountry: 'lk'
            },
            selected: true
          },

        ]
      }
    ];

    const pipe = new PucOrderByPipe();
    pipe.transform(sampleData[0].children, null);

    expect(sampleData).toEqual(sampleData);
  });
});
