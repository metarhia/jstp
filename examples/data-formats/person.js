{
  name: ['Marcus', 'Aurelius'].join(' '),
  passport: 'AE' + '127095',
  birth: {
    date: new Date('1990-02-15'),
    place: 'Rome'
  },
  age: function() {
    var difference = new Date() - birth.date;
    return Math.floor(difference / 31536000000);
  },
  address: {
    country: 'Ukraine',
    city: 'Kiev',
    zip: '03056',
    street: 'Pobedy',
    building: '37',
    floor: '1',
    room: '158'
  }
}
