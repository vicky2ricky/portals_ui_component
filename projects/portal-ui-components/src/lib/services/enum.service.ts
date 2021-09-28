import { Injectable } from '@angular/core';
import { ObjectUtil } from '../utils/object-util';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class EnumService {
  enums: any[] = [
    {
      enumType: 'priorityLevel',
      enumItems: {
        system: {
          level: '14'
        },
        building: {
          level: '16'
        },
        zone: {
          level: '10'
        },
        module: {
          level: '8'
        }
      }
    },
    {
      enumType: 'commands',
      enumItems: {
        building: [
          {
            label: 'Restart All CCUs',
            remoteCmdType: 'restart_ccu'
          },
          {
            label: 'Restart All Tablets',
            remoteCmdType: 'restart_tablet',
            children: [

            ]
          },
          {
            label: 'Reinit All CMs',
            remoteCmdType: 'reset_cm',
            children: []
          },
          {
            label: 'Update All CCUs',
            remoteCmdType: 'update_ccu',
            children: [
              {
                type: 'text',
                placeholder: 'RENATUS_CCU_env_ver.apk',
                control: 'version',
                children: [

                ]
              }
            ]
          },
          {
            label: 'Save All CCU Logs',
            remoteCmdType: 'save_ccu_logs',
            children: []
          },
          {
            label: 'Update All Smart Nodes',
            remoteCmdType: 'ota_update_smartdevice',
            children: [
              {
                type: 'text',
                placeholder: 'SmartNode_v1.0',
                control: 'version',
                children: [

                ]
              }
            ]
          },{
            label: 'Update All HyperStats',
            remoteCmdType: 'ota_update_hyperStat',
            children: [
              {
                type: 'text',
                placeholder: 'HyperStat_v1.1',
                control: 'version',
                children: [

                ]
              }
            ]
          },{
            label: 'Update All ITMs',
            remoteCmdType: 'ota_update_itm',
            children: [
              {
                type: 'text',
                placeholder: 'Itm_v1.0',
                control: 'version',
                children: [

                ]
              }
            ]
          }
        ],
        system: [
          {
            label: 'Restart CCU',
            remoteCmdType: 'restart_ccu'
          },
          {
            label: 'Restart Tablet',
            remoteCmdType: 'restart_tablet'
          },
          {
            label: 'Reinit CM',
            remoteCmdType: 'reset_cm'
          },
          {
            label: 'Update CCU',
            remoteCmdType: 'update_ccu',
            children: [
              {
                type: 'text',
                placeholder: 'RENATUS_CCU_env_ver.apk',
                control: 'version',
                children: [

                ]
              }
            ]
          },
          {
            label: 'Save CCU Logs',
            remoteCmdType: 'save_ccu_logs',
            children: []
          },{
            label: 'Update All Smart Nodes',
            remoteCmdType: 'ota_update_smartdevice',
            children: [
              {
                type: 'text',
                placeholder: 'SmartNode_v1.0',
                control: 'version',
                children: [

                ]
              }
            ]
          },{
            label: 'Update All HyperStats ',
            remoteCmdType: 'ota_update_hyperStat',
            children: [
              {
                type: 'text',
                placeholder: 'HyperStat_v1.1',
                control: 'version',
                children: [

                ]
              }
            ]
          },{
            label: 'Update All ITMs',
            remoteCmdType: 'ota_update_itm',
            children: [
              {
                type: 'text',
                placeholder: 'Itm_v1.0',
                control: 'version',
                children: [

                ]
              }
            ]
          }
        ],
        zone: [
          {
            label: 'Update All Smart Nodes',
            remoteCmdType: 'ota_update_smartdevice',
            children: [
              {
                type: 'text',
                placeholder: 'SmartNode_v1.0',
                control: 'version',
                children: [

                ]
              }
            ]
          },{
            label: 'Update All ITMs',
            remoteCmdType: 'ota_update_itm',
            children: [
              {
                type: 'text',
                placeholder: 'Itm_v1.0',
                control: 'version',
                children: [

                ]
              }
            ]
          },{
            label: 'Update All HyperStats ',
            remoteCmdType: 'ota_update_hyperStat',
            children: [
              {
                type: 'text',
                placeholder: 'HyperStat_v1.1',
                control: 'version',
                children: [

                ]
              }
            ]
          },{
            label: 'Restart All Modules',
            remoteCmdType: 'restart_module',
            children: []
          }
        ],
        module: [
          {
            label: 'Update Smart Node',
            remoteCmdType: 'ota_update_smartdevice',
            children: [
              {
                type: 'text',
                placeholder: 'SmartNode_v1.0',
                control: 'version',
                children: [

                ]
              }
            ]
          },
          {
            label: 'Update All HyperStats',
            remoteCmdType: 'ota_update_hyperStat',
            children: [
              {
                type: 'text',
                placeholder: 'HyperStat_v1.1',
                control: 'version',
                children: [

                ]
              }
            ]
          },{
            label: 'Update ITM',
            remoteCmdType: 'ota_update_itm',
            children: [
              {
                type: 'text',
                placeholder: 'Itm_v1.0',
                control: 'version',
                children: [

                ]
              }
            ]
          },{
            label: 'Restart Module',
            remoteCmdType: 'restart_module',
            children: []
          }
        ]

      }
    }
  ];

  constructor() { }
  getEnum(key) {
    const self = this;
    const found = _.find(self.enums, 'enumType', key);
    return ObjectUtil.getFromPath(found, ['enumItems']);
  }
}
