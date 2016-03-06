# JSTP / JavaScript Transfer Protocol

## Концепция

Это семейство форматов данных и соответствующих библиотек для работы с ними,
которые основаны на нескольких простых допущениях:
* передавать данные в виде JavaScript кода можно красивее и удобнее, чем в
формате сериализации JavaScript объектов JSON;
  - это даже не потребует специального парсера, т.к. он уже встроен в передающую
  и принимающую системы;
  - человекочитаемый формат может быть почти таким же минималистичным, как
  бинарный, не многим ему уступая в эффективности кодирования, но сильно
  выигрывать от простоты просмотра пакетов;
  - формат сериализации и методика моделирования данных должены быть максимально
  однозначными и иметь понятные ответы на вопрос: почему именно так, а не иначе;
  - возможность применять различное форматирование и комментарииж
* передавать структуру вместе с данными каждый раз - это избыточно и нужно
оптимизировать формат сериализации и протокол, выделив метамодель и передавать
ее только если получающая система еще не имеет закешированной версии
метамодели;
* протокол взаимодействия между двумя JavaScript приложениями должен обладать
такими характеристиками: 
  - двусторонний асинхронный обмен данными с поддержкой множества параллельных
  (не блокирующих) взаимодействий и идентификаторов пакетов, позволяющих,
  например, установить соответствие между запросом и ответом;
  - поддержка вызова удаленных процедур RPC с поддержкой множественных API
  интерфейсов должна быть настолько прозрачна, что приложения не должны знать,
  происходит ли вызов внутри адресного пространства приложения или передан на
  удаленную систему для исполнения;
  - поддержка как прямого ответа от метода RPC API, так и ответа по обратному
  вызову `callback`;
  - поддержка трансляции именованных событий прикрепленными к ним данными и
  именованных каналов для группировки событий;
  - поддержка автоматической синхронизации объектов в памяти приложений,
  специально зарегистрированы для синхронизации;
  - только одна из сторон может стать инициатором соединения, но обе стороны
  могут инициировать обмен данными по уже открытому каналу;
  - транспортный уровень должен обеспечивать надежную передачу данных с
  установкой соединения и гарантированной доставкой (TCP базовый транспорт, но
  мы не ограничиваемся им и может быть использован аналог для передачи данных
  через RS232, USB или Websocket);
  - все типы пакетов (вызов, ответ, колбэек, событие и данные) могут быть
  разделены на несколько частей, если тело прикрепленных данных слишком большое;
  - необходима возможность прекратить передачу данных, если данные, передаваемые
  по частям, слишком большие и еще не получена последняя их часть;
* передача данных в JavaScript может быть не менее безопасна, чем в JSON, даже
с учетом возможности передачи тела функций или выражений, содержащих вызовы
функций, потому, что их исполнение на удаленной стороне происходит в песочницах
и протокол должен иметь специальные механизмы обеспечения безопасности;
* необходимо минимизировать преобразование данных при передаче между системами,
хранении и обработке, минимизировать перекладывание из одних структур в другие,
экономить память и канал связи;
* количество структур данных, необходимых для работы большинства систем является
конечным, а сами структуры должны стать фактическими стандартами в результате
консенсуса специалистов с возможностью их версионного изменения;
* нестандартизированные структуры данных могут передаваться между системами,
снабженные метаданными, которые позволяют их интерпретировать и до известной
степени обеспечить универсальную обработку, если удаленные стороны доверяют друг
другу, а формализация данных не имеет смысла;

## Структура семейства форматов

* [JSRS / JavaScript Record Serialization](JSRS--JavaScript-Record-Serialization)
`{ name: 'Marcus Aurelius', passport: 'AE127095' }`
* [JSRM / JavaScript Record Metadata]([JSRM--JavaScript-Record-Metadata])
`{ name: 'string', passport: '[string]' }`
* [JSRD / JavaScript Record Data](JSRD--JavaScript-Record-Data)
`['Marcus Aurelius','AE127095']`
* [JSTP / JavaScript Transfer Protocol](JSTP--JavaScript-Transfer-Protocol)
`{ hdr: [17], event: ['accounts.insert', ['Marcus Aurelius', 'AE127095']] }`

## JSRS / JavaScript Record Serialization

JSRS это просто JavaScript описывающий структуру данных. В отличие от JSON в нем
не нужно помещать ключи в двойные кавычки, можно вставлять комментарии, гибко
форматировать и все остальное, что можно в обычном JavaScript. Например:
```JavaScript
{
  name: 'Marcus Aurelius',
  passport: 'AE127095',
  birth: {
    date: '1990-02-15',
    place: 'Rome'
  },
  contacts: {
    email: 'marcus@aurelius.it',
    phone: '+380505551234',
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
}
```
В JSRS возможны выражения, обращения к функциям и объявления функций, например:
```JavaScript
{
  name: ['Marcus', 'Aurelius'].join(' '),
  passport: 'AE' + '127095',
  birth: {
    date: new Date('1990-02-15'),
    place: 'Rome'
  },
  age: function() {
    var defference = new Date() - birth.date;
    return Math.floor(defference / 31536000000);
  }
}
```
Из примера видно, в функциях можно использовать ссылки на поля структуры,
например: `birth.date`.

Самый простой парсер JSRS на Node.js выглядит так:

```JavaScript
var JSRS = {};

JSRS.parse = function(jsrs) {
  var sandbox = vm.createContext({});
  var js = vm.createScript('(' + jsrs + ')');
  var exported = js.runInNewContext(sandbox);
  for (var key in exported) {
    sandbox[key] = exported[key];
  }
  return exported;
};
```
А вот пример его использования:
```JavaScript
fs.readFile('./person.jsrs', function(err, jsrs) {
  console.log('JavaScript Record Serialization');
  var person = JSRS.parse(jsrs);
  console.dir(person);
  console.log('Age = ' + person.age());
});
```

## JSRM / JavaScript Record Metadata

JSRM это метаданные, т.е. данные о структуре и типах JSRS данных, описанные на
том же JSRS. Таким образом, для JSRM нам подходит тот же базовый парсер, но поля
описываются при помощи дополнительного синтаксиса. Например: `number(4)` это
число, имеющее не более 4 разрядов и поле не может принимать `undefined`, а
`[number(2,4)]` это число от 2 до 4 разрядов или `undefined`. Еще примеры:

```JavaScript
// Файл: Person.jsrm
{
  name: 'string',
  passport: '[string(8)]',
  birth: '[Birth]',
  age: function() {
    var defference = new Date() - birth.date;
    return Math.floor(defference / 31536000000);
  },
  address: '[Address]'
}
// Файл: Birth.jsrm
{
  date: 'Date',
  place: '[string]'
}
// Файл: Address.jsrm
{
  country: 'string',
  city: 'string',
  zip: 'number(5)',
  street: 'string',
  building: 'string',
  room: '[number]'
}
```
Имена типов начинаются с маленькой буквы: `string`, `number`, `boolean`, а
ссылки на другие записи начинаются с большой: `Birth`, `Address`. Все описания
записей хранятся в специальном хранилище структур и могут кешироваться на
серверах и пользовательских устройствах.

## JSRD / JavaScript Record Data

JSRD это JSRS, из которого удалены все имена полей, а хеши заменены на массивы.
Если поле не имеет значения, т.е. `undefined`, то значение в массиве просто
пропущено. Например: `[1,,,4]` - это 4 поля, первое и последнее имеют значения
`1` и `4` соответственно, а второе и третье равны `undefined`. 

Пример экземпляра записи `Person` в JSRD:
```JavaScript
['Marcus Aurelius','AE127095',['1990-02-15','Rome'],,['Ukraine','Kiev','03056','Pobedy','37','158']]
```

Если мы имеем соответствующий JSRM, то можем развернуть из JSRD
полный JSRS документ. Например:
```JavaScript
var data = ['Marcus Aurelius','AE127095'];
var metadata = { name: 'string', passport: '[string(8)]' };
var person = JSRS.decode(data, metadata);
console.dir(person);
{ name: 'Marcus Aurelius', passport: 'AE127095' }
```

По JSRM можно обращаться к полям JSRD и не распаковывая. Например:
```JavaScript
var data = ['Marcus Aurelius','AE127095'];
var metadata = { name: 'string', passport: '[string(8)]' };
var name = JSRS.getField(data, metadata, 'name');
JSRS.setField(data, metadata, 'name', 'Marcus');
```

## JSTP / JavaScript Transfer Protocol

JSTP это протокол передачи данных, использующий в качестве формата кодирования
данных JSRS, JSRD и поддерживающий метаданные в формате JSRM. Протокол имеет 4
типа пакетов:
* `call` - вызов процедуры из удаленного API
* `return` - возврат из вызова удаленного API
* `callback` - обратный вызов из удаленного API
* `event` - событие с прикрепленными к нему данными
* `data` - пакет синхронизации данных

```JavaScript
// Номер пакета 17, вызов, имя интерфейса auth, метод newAccount
{hdr:[17],call:['auth.newAccount',['Payload data in JSRD or JSRS format']]}

// Ответ на пакет 17, результат done, идентификатор записи 15703
{hdr:[17],return:['done',[15703]]}

// Событие в пакете 18, интерфейс auth, имя события insert
{hdr:[18],event:['auth.insert', ['Marcus Aurelius', 'AE127095']] }
```

### Идентификация пакетов

### Идентификация интерфейсов, методов и событий

### Пакет вызова call

### Пакет ответа return

### Пакет обратного вызова callback

### Пакет события event

### Пакет синхронизации данных data
