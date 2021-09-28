import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EnumService } from '../../services/enum.service';
import { ArrayUtil } from '../../utils/array-util';
@Component({
  selector: 'puc-tuners-modal',
  templateUrl: './tuners-modal.component.html',
  styleUrls: ['./tuners-modal.component.scss']
})
export class TunersModalComponent implements OnInit {
  buildingsData: any[] = [];
  tunerLevel: any;
  tuners: any[] = [];
  priorityLevel: any;
  pointers: any[] = [];
  pageType: 'sg' | 'building' = 'sg';
  constructor(
    public dialogRef: MatDialogRef<TunersModalComponent>,
    private enumService: EnumService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
    const self = this;
    self.tunerLevel = this.data['tunerLevel'];
    self.priorityLevel = self.enumService.getEnum('priorityLevel')[self.tunerLevel] ?
      self.enumService.getEnum('priorityLevel')[self.tunerLevel]['level'] : '';
    self.tuners = this.data['tuners'] || [];
    self.pointers = self.data['pointers'] || [];
    self.pageType = self.data['pageType'] ? self.data['pageType'] : 'sg';
    if (self.data && self.data['buildingsInfo'] && Array.isArray(self.data['buildingsInfo']) && self.data['buildingsInfo'].length) {
      self.buildingsData = JSON.parse(JSON.stringify(self.data['buildingsInfo']));
      if (self.pageType == 'building') {
        self.buildingsData = [
          {
            dis: '',
            children: ArrayUtil.flatten(self.buildingsData),
            selected: true
          }
        ];
      }

      self.buildingsData = self.buildingsData.filter((_item) => _item && _item['selected']);
      if (self.buildingsData.length) {
        self.walker(self.buildingsData);
      }

    }
  }

  getPointerVal(tuner) {
    const self = this;
    const result: any[] = self.pointers.filter((_item) => {
      if (_item['tunerName'] &&
        _item['tunerName'] == tuner['name'] && _item['tunerGroup'] &&
        _item['tunerGroup'] == tuner['tunerGroup'] && _item['refId']
        && tuner['refId'] == _item['refId']
      ) {
        return _item;
      }
    });
    return (result.length) ? result[0]['val'] : '';
  }

  hasAppicable(tuner) {
    const self = this;
    const result = self.pointers.find((current) => {

      return (current['tunerName'] && current['tunerName'] == tuner['name']
        && current['tunerGroup'] && current['tunerGroup'] == tuner['tunerGroup']
        && current['refId'] == tuner['refId']
      );
    });
    return result;
  }

  walker(obj) {
    let k;
    const has = Object.prototype.hasOwnProperty.bind(obj);
    for (k in obj) {
      if (has(k)) {
        switch (typeof obj[k]) {
          case 'object':
            if (((this.tunerLevel == 'building' && obj[k] && (obj[k]['type'] == 'system'
              || obj[k]['type'] == 'zone' || obj[k]['type'] == 'module'))
              || (this.tunerLevel == 'system' && obj[k] && (obj[k]['type'] == 'zone' || obj[k]['type'] == 'module'))
              || (this.tunerLevel == 'zone' && obj[k] && obj[k]['type'] == 'module')
              || (obj[k].hasOwnProperty('selected') && !obj[k]['selected'])
            )
            ) {

              delete obj[k];
            }

            this.walker(obj[k]);

            if (!Array.isArray(obj[k]) && obj[k] && obj[k]['children']) {

              obj[k]['children'] = obj[k]['children'].filter((_item) => _item['selected']);
              if (obj[k]['children'].length && obj[k]['children'][0].type == this.tunerLevel && this.tuners.length) {
                const children: any[] = JSON.parse(JSON.stringify(obj[k]['children']));
                obj[k]['children'] = [];
                children.forEach(element => {
                  this.tuners.forEach((_item) => {
                    _item['refId'] = (this.tunerLevel == 'system') ? element['ahuRef'] : '@' + element['_id'];

                    const found = this.pointers.length ? this.hasAppicable(_item) : false;
                    const chilObj = { ...element };
                    chilObj['tunerName'] = _item['name'];
                    chilObj['newVal'] = _item['newVal'];
                    chilObj['unit'] = _item['unit'];
                    chilObj['level'] = found ? found['level'] : '';
                    chilObj['isApplicable'] = (found) ? true : false;
                    chilObj['val'] = _item['val'] ? _item['val'] : this.getPointerVal(_item);
                    obj[k]['children'].push(chilObj);
                  });
                });
              }
            }
            break;
        }
      }
    }
  }
}
