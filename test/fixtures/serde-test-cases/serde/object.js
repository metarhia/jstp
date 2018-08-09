'use strict';

module.exports = [
  {
    name: 'empty object',
    value: {},
    serialized: '{}',
  },
  {
    name: 'object',
    value: { field1: 'value', field2: null },
    serialized: "{field1:'value',field2:null}",
  },
  {
    name: 'Marcus object',
    value: {
      name: 'Marcus Aurelius',
      passport: 'AE127095',
      birth: {
        date: '1990-02-15T00:00:00.000Z',
        place: 'Rome',
      },
      address: {
        country: 'Ukraine',
        city: 'Kiev',
        zip: '03056',
        street: 'Pobedy',
        building: '37',
        floor: '1',
        room: '158',
      },
    },
    serialized:
      "{name:'Marcus Aurelius',passport:'AE127095'," +
      "birth:{date:'1990-02-15T00:00:00.000Z',place:'Rome'}," +
      "address:{country:'Ukraine',city:'Kiev',zip:'03056'," +
      "street:'Pobedy',building:'37',floor:'1',room:'158'}}",
  },
];
