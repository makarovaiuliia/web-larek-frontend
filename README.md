# Web-ларёк | documentation

## Используемый стек

- HTML
- TypeScript
- SCSS
- WebPack
- ESLint

## Структура проекта

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

### Важные файлы

- src/pages/**index.html** — HTML-файл главной страницы
- src/types/**index.ts** — файл с типами
- src/**index.ts** — точка входа приложения
- src/scss/**styles.scss** — корневой файл стилей
- src/utils/**constants.ts** — файл с константами
- src/utils/**utils.ts** — файл с утилитами

## Установка и запуск

Для **установки** проекта необходимо выполнить команды

```bash
npm install
```

Для **запуска проекта** в режиме разработки выполнить команду:

```bash
npm run start
```

**Сборка** проекта

```bash
npm run build
```

## Описание архитектурного решения

В качестве основы для архитектуры приложения выбран паттерн MVP (Model-View-Presenter).

**Model:** при разработке мы придерживается подхода single model, то есть одна модель данных на все приложение.

**View**: в приложении множество классов, которые находятся в слое view. Они отвечают за отображение UI и взаимодействия с ним.

**Presenter**: всего презентеров в приложении 3:
1. CardPresenter - связывает операции с карточками и модель,
2. ShoppingListPresenter - связывает операции с корзиной и модель
3. OrderPresenter - связывает модель и процесс оформления заказа.

## Описание ключевых типов данных

### Интерфейсы

```tsx
/* Интерфейс хранения данных карточки, которую приложение получает из сервера
и на основе которой заполняются карточки в HTML через слой View */

export interface ICard {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

/* Интерфейс элемента корзины покупок. Включает в себя id и price. Id - для
отправки данных заказа на сервер, а price - чтобы посчитать итоговую сумму заказа */

export interface IShoppingListItem {
	id: string;
	price: number;
	title: string;
}

/* Интерфейс хранения данных заказа */

export type PaymentMethod = 'онлайн' | 'при получении' | '';

export interface IFormState {
	valid: boolean;
	errors: string[];
}
export interface IContactsForm extends IFormState {
	email: string;
	phone: string;
	render: (state: Partial<IContactsForm> & IFormState) => HTMLElement;
}

export interface IOrderForm extends IFormState {
	payment: PaymentMethod;
	address: string;
	render: (state: Partial<IOrderForm> & IFormState) => HTMLElement;
}

export interface IOrderItems {
	total: number;
	items: string[];
}

export interface IOrderData extends IOrderItems {
	payment: PaymentMethod;
	address: string;
	email: string;
	phone: string;
}

export type FormErrors = Partial<Record<keyof IOrderData, string>>;
export type ButtonState = 'В корзину' | 'Убрать из корзины';

/* Интерфейс удачного оформления заказа */

export interface ISuccessOrder {
	total: number;
	id: string;
}
```

### Классы: Базовые классы

В данном проекте присутствует несколько базовых классов:

- **Api** - базовый класс по работе с Api проекта

    **Поля класса**:

    - `baseUrl`: string
    - `options`: RequestInit (headers)

    Все поля заполняются при инициализации класса с помощью конструктора.

    **Методы класса:**

    - `protected **handleResponse**(response: Response)` - возвращает ответ из сервера в формате JSON. При возникновении ошибки - обрабатывает ее. Данный метод вызывается из всех остальных методов
    - `**get**(uri: string)` - принимает путь, возвращает информацию от сервера
    - `**post**(uri: string, data: object, method: ApiPostMethods = 'POST')`- принимает путь и данные для отправки на сервер, возвращает информацию от сервера

    Примечание: от этого класса наследует класс ProjectApi, описанный далее.

- **EventEmitter** - брокер событий, базовый класс по работе с событиями

    При инициализации создает общий брокер события для всего приложения. Он представляет слой presenter.

    **Поля класса**:

    - `_events`: Map<EventName, Set<Subscriber>>, где eventName - это строка или регулярное выражение, а Subscriber - функция;

    **Методы класса:**

    - `**on**<T extends object>(eventName: EventName), callBack: (event: T) => void): void` : подписывает коллбек функцию на определенное событие. Если события не существует, то создает его.
    - `**off**(eventName: EventName, callback: Subscriber): void` : удаляет подписку на событие. Если больше нет других подписок, то удаляет событие
    - `**emit**<T extends object>(eventName: string, data?: T): void` : отправляет событие всем подписчикам. Если eventName соответствует RegExp или строке, выполняются соответствующие коллбеки.
    - `**onAll**(callback: (event: EmitterEvent) => void): void` : подписывает коллбэк на все события, создаваемые экземпляром.
    - `**offAll**(): void` : удаляет все подписки вызванные экземпляром
    - `**trigger**<T extends object>(eventName: string, context?: Partial<T>): (data: T) => void` : cоздает и возвращает функцию триггера для определенного события, которая при вызове генерирует событие с предоставленными данными и контекстом.
- **Component** - абстрактный класс, который является базовым классом для создания UI компонентов. Он содержит методы, которые эффективно манипулируют DOM элементами
    
    **Конструктор класса:**
    
    Конструктор принимает `**container**: HTMLElement` и инициализирует его.
    
    **Поля класса:**
    
    Собственных полей нет
    
    **Методы класса:**
    
    - `**toggleClass**(element: HTMLElement, className: string, force?: boolean): void` : переключает класс указанного элемента. Также можно указать логический параметр Force для явного добавления или удаления класса.
    - `**setText**(element: HTMLElement, value: unknown): void` : устанавливает текстовое содержимое указанного элемента в заданное значение.
    - `**setDisabled**(element: HTMLElement, state: boolean): void` : активирует или деактивирует указанный элемент в зависимости от предоставленного состояния.
    - `**setHidden**(element: HTMLElement): void` : скрывает указанный элемент.
    - `**setVisible**(element: HTMLElement): void` : показывает указанный элемент
    - `**setImage**(element: HTMLImageElement, src: string, alt?: string): void` устанавливает источник и алтернативный текст для картинки
    - `**render**(data?: Partial<T>): HTMLElement` : рендерит компонент, при необходимости объединяя предоставленные данные со свойствами компонента. Возвращает корневой элемент контейнера.
- **Presenter** - абстрактный класс, который является базовым классом для всех презентеров
    
    **Конструктор класса:**
    
    Конструктор принимает от 3х до 5-ти аргументов. 3 - обязательные: это модель, eventEmitter и модальное окно. Далее идут от одного до трех необязательных view классов.
    
    **Поля класса:**
    
    - `protected _events`: IEvents;
    - `protected _model`: IAppModel;
    - `protected _modal`: Modal;
    - `protected _view?`: V;
    - `protected _view2?`: V2;
    - `protected _view3?`: V3
    
    **Методы класса:**
    
    собственных методов нет
    

### Класс: Project Api

Для облегчения работы с Api создается наследник класса Api - ProjectApi. Он реализует следующий интерфейс:

```tsx
export interface IProjectApi {
	getCardList: () => Promise<ICard[]>;
	getCard: (id: string) => Promise<ICard>;
	postOrder: (order: IOrderData) => Promise<ISuccessOrder>;
}
```

**Конструктор класса:**

Класс принимает на входе помимо указанных в базовом классе параметров, параметр cdn для путей изображений. baseUrl и options уходят в super();

**Поля класса:**

- `readonly cdn:` string;

**Методы класса:**

- `getCardList: () => Promise<ICard[]>` : получает массив карточек с сервера
- `getCard: (id: string) => Promise<ICard>` : получает информацию о конкретной карточке
- `postOrder: (order: IOrderData) => Promise<ISuccessOrder>` : отправляет заказ на сервер

### Класс: слой Model

Слой Model представлен классом AppModel, он имплементирует следующий интерфейс:

```tsx
interface IAppModel {
	cardCatalog: ICard[];
	shoppingList: IShoppingListItem[];
	order: IOrderData | null;

	addToShoppingList(item: IShoppingListItem): void;
	removeFromShoppingList(itemId: string): void;
	ifExists(id: string): boolean;
}
```

**Конструктор класса:**

Класс принимает на входе инициализированные классы ProjectApi и EventEmitter, а также запускает метод `initialize()`

**Поля класса:**

- `protected projectAPI`: IProjectApi;
- `protected events:` : IEvents;
- `cardCatalog`: ICard[];
- `shoppingList`: IShoppingListItem[];

**Методы класса:**

- `private initialize():void` :вызывается из конструктора и использует fetchCards();
- `private fetchCards()`: использует класс API для того, чтобы получить массив карточек с сервера.
- `addToShoppingList(item: IShoppingListItem)`: добавляет карточку в корзину, а также в LocalStorage
- `removeFromShoppingList(itemId: string)`: удаляет карточку из корзины по идентификатору, а также из LocalStorage
- `getShoppingList(): void` : выгружает карточки из localStorage и заносит в переменную shoppingList
- `placeOrder**(orderData: IOrderData)`: делает заказ, используя API.
- `clearShoppingList(): void` : очищает корзину из модели и localStorage

### Класс: слой View

Общий класс:

- **Modal** extends Component - представляет собой основу для создания и управления модальными окнами в приложении.

    **Конструктор класса:**

    Принимает container и events. В контейнере ищет кнопку закрытия - `_*closeButton`, и контент - `_content`.  На кнопку и на контейнер ставит обработчик событий, который закрывает модальное окно при нажатии на кнопку и на все, что находится вне модального окна. 

    **Поля класса:**

    - `protected _closeButton`: HTMLButtonElement;
    - `protected _content`: HTMLElement;

    **Методы класса:**

    - `set content(value: HTMLElement)` ****: устанавливает или обновляет контент, отображаемый в модальном окне;
    - `open(): void` :открывает модальное окно;
    - `close(): void` :закрывает модальное окно;
    - `render(data: IModalData): HTMLElement` :отображает модальное окно с предоставленными данными. Автоматически открывает модальное окно после рендеринга.
- **Card** extends Component - основа для карточек в каталоге и в модальном окне

    **Конструктор класса:**

    На входе класс принимает `HTMLElement`, который будет играть роль контейнера, он отправляется в `super()`. Далее с помощью шаблона и querySelector заполняются поля класса.

    **Поля класса:**

    - `protected _card`: ICard;
    - `events`: IEvent;
    - `protected _titleElement`: HTMLElement;
    - `protected _imageElement`: HTMLImageElement;
    - `protected _categoryElement`: HTMLElement;
    - `protected _priceElement`: HTMLElement;

    **Методы класса**
    - `setTitle(title: string)`: void: устанавливает название карточки;
    - `setImage(src: string): void` : устанавливает данные изображения;
    - `setCategory(category: string): void` : устанавливает категорию карточки;
    - `setPrice(price: number): void` : устанавливает цену товара;
- **Form**<T> extends Component<IFormState> - основа для форм заказа
    
    **Конструктор класса:**
    
    Принимает элемент формы, а также EventEmitter. Также вешает слушатели событий на input элементы и на кнопку submit;
    
    **Поля класса:**
    
    - `protected _submit`: HTMLButton
    - `protected _errors`: HTMLElement
    
    **Методы класса:**
    
    - `protected **onInputChange**(field: keyof T, value: string)` : реагирует на изменения в Input элементах формы
    - `set valid(value: boolean)` : устанавливает валидность формы
    - `set errors(value: string[])` : устанавливает ошибки формы
    - `render(state: Partial<T> & IFormState)` : рендерит форму

**Классы отображения**

Карточки

- **CardView** extends Card - нужен для отображения карточек в каталоге

    **Конструктор класса:**

    Вызывает super, а также ставить слушатель событий на саму карточку, при нажатии эмитирует событие `card:select`.

    **Поля класса:**

    собственных полей нет

    **Методы класса**

    собственных методов нет

- **CardPreview** extends Card - нужен для отображения карточек в модальном окне

    **Конструктор класса**

    Вызывает super, а также ставить слушатель событий на кнопку “В корзину”

    **Поля класса:**

    - private `descriptionElement:` HTMLElement;
    - private `buttonElement:` HTMLButtonElement;

    **Методы класса:**

    - `set description(title: string)`: void: устанавливает описание карточки;
    - `set button(buttonText: ButtonState): void`: устанавливает состояние кнопки добавления в корзину

Корзина

- **ShoppingListView**  extends Component - рендерит корзину с товарами

    **Конструктор класса:**

    Конструктор получает на входе HTMLElement корзины, он отправляется в super(), далее внутри контейнера находятся listElement, buttonElement и totalPriceElement. На buttonElement устанавливается обработчик событий, который эмитирует событие `order:start`.

    **Поля класса:**

    - `private listElement`: HTMLElement;
    - `private totalSumElement`: HTMLElement;
    - `private buttonElement`: HTMLElement;
    - `private events`: IEvent
    
    **Методы класса:**
    
    - `private updateTotalSum(): void` : обновляет цену при добавлении/удалении карточек из корзины
    - `private updateOrderData(): void` : обновляет данные в this.orderData и передает их в модель
    - `public updateView(*shoppingListItems*: IShoppingListItem[]): void`: обновляет элементы в корзине после добавления/удаления
- **ShoppingListItemView** extends Component - нужен для рендера элементов корзины
    
    **Конструктор класса:**
    
    Конструктор получает на входе HTMLElement корзины, он отправляется в super(), далее внутри контейнера находятся indexElement, priceElement и titleElement и buttonElement. На buttonElement вешается слушатель событий, который при клике на кнопку эмитирует событие `card:remove`.
    
    **Поля класса:**
    
    - `private indexElement`: HTMLElement
    - `private titleElement`: HTMLElement;
    - `private priceElement`: HTMLElement;
    - `private buttonElement`: HTMLButtonElement;
    
    **Методы класса:**
    
    - `setTitle(title: string)`: void: устанавливает название карточки;
    - `setIndex(index: string): void` : устанавливает индекс;
    - `setPrice(price: number): void` : устанавливает цену товара;


Формы заказа

- **OrderForm** extends Form<IOrderForm> - рендерит первую часть формы заказа

    **Конструктор класса:**

    Принимает элемент формы, а также EventEmitter и отправляет в super(). Также вешает слушатели событий на кнопки выбора способа оплаты

    **Поля класса:**

    - `private buttonElements:` HTMLButtonElement[];

    **Методы класса:**

    - `set address(value: string)` : устанавливает адрес
    - `set payment(value: PaymentMethod)` : устанавливает метод оплаты
    - `handlePaymentChange(event: IEvent)`: реагирует на нажатие кнопок выбора способа оплаты
- **ContactsForm** extends Form<IContactsForm> - рендерит вторую часть формы заказа

    **Конструктор класса:**

    Принимает элемент формы, а также EventEmitter и отправляет в super(). Также вешает слушатели событий на кнопки выбора способа оплаты

    **Поля класса:**

    нет собственных полей

    **Методы класса:**

    - `set phone(value: string)` : устанавливает телефон
    - `set email(value: PaymentMethod)` : устанавливает почту
- **SuccessModal** extends Component<ISuccessOrder> - рендерит модальное окно с успешным итогом заказа

    **Конструктор класса:**

    Принимает контейнер и отправляет в super(), а также EventEmitter. Затем щет внутри элемент, где расположена информация о стоимость заказа и кнопку “за новыми покупками”. Также вешает слушатели событий на кнопку “за новыми покупками”.

    **Поля класса:**

    - `private descriptionElement`: HTMLElement;
    - `private buttonElement**`: HTMLButtonElement;
    - `private events`: IEvents;

    **Методы класса:**

    - `set total(value: string)` : устанавливает общую стоимость заказа в descriptionElement

### Классы: слой Presenter

- **CardPresenter** extends Presenter - презентер для связи AppModel и CardView;

    **Конструктор класса:**

    Принимает экземпляры классов AppModel, Modal, EventEmitter, которе инициализируются при запуске кода.

    **Поля класса:**

    Собственных полей нет

    **Методы класса**

    - `loadCards**(): void` : в ответ на событие cards:fetched запускается эта функция, которая создает каждую карточку и выводит ее в UI
    - `handleOpenModal(cardInfo: ICard): void` : передает данные о нажатой карточке в модальное окно и в модель
- **ShoppingListPresenter** extends Presenter<ShoppingListView> - пресентер для связи AppModel и ShoppingListView;

    **Конструктор класса:**

    Принимает общую Модель, EventEmitter, Modal и ShoppingListView. Они же уходят в super().

    **Методы класса:**

    - `handleAddToShoppingList**(item: IShoppingListItem): void` - добавляет элемент в корзину, отправляет в модель и вызывает вызывает updateView()
    - `handleRemoveFromShoppingList(id: string): void` - удаляет элемент из корзины, отправляет в модель и вызывает updateView()
    - `handleOrderPlacement**(): void` : передает информацию о заказе, начинает процесс оформления
    - `**handleOpenModal**(): void`: открывает модальное окно корзины
- **OrderPresenter** extends Presenter<IOrderForm, IContactsForm, SuccessModal> - презентер для связи AppModel и всех форм;

    **Конструктор класса:**

    Принимает общую Модель, EventEmitter, Modal, все формы и также SuccessModal. Все это уходит в super().

    **Поля класса:**

    - `private orderDetails`: IOrderData;
    - `private formErrors`: FormErrors = {};

    **Методы класса:**

    - `handleOpenOrderForm(): void` : открывает окно с формой заказа
    - `handleOpenContactsForm*(): void` : открывает окно с формой заказа
    - `handleChangeInput(): void` : подставляет значения из формы в переменную с данными заказа
    - `setOrderField(): void` : подставляет значения из формы в переменную с данными заказа
    - `validateOrder(): boolean` :проверяет, все ли нужные для заказа данные есть и передает ошибку, если чего то не хватает
    - `handleErrors**(): void` : передает тексты ошибок
    - `handleSendOrderDetails(): void` : отправляет заказ на сервер через метод модели
    - `handleOrderFinish(): void` : заканчивает процесс оформления заказа

## Описание событий

Для контроля событий в проекте используется класс EventEmitter (класс описан выше).

**Список событий**

| Событие | Триггер | Реакция |
| --- | --- | --- |
| cards:fetched | разрешение промиса, который загружает карточки с сервера | cardPresenter использует загруженные карточки для отображения их в UI |
| card:select | При нажатии на любую из карточек | Отправка в AppModel данных выбранной карточки, а также открытие модального окна с этой карточкой |
| card:add | при нажатии на кнопку “в корзину” | добавляет элемент в корзину и обновляет список элементов корзины в модели |
| card:remove | при нажатии на кнопку “убрать из корзины” | удаляет элемент из корзины, обновляет список элементов корзины в модели |
| modal:open | при открытии любого модального окна | блокируется страница |
| modal:closed | при закрытии любого модального окна | блокировка страницы снимается |
| order:start | при нажатии кнопки “оформить” в корзине | открывается форма оформления заказа |
| order:submit | когда первая часть формы была заполнена и нажата кнопка “далее” | открывается вторая часть формы |
| contacts:submit | когда вторая часть формы была заполнена и нажата кнопка “оплатить” название кнопки | вызывается метод placeOrder - информация отправляется на сервер |
| form:submit | когда информация о заказе ушла на сервер и вернулся положительный ответ | открывает successWindow |
| order:done | при нажатии на кнопку “за новыми покупками” в success модальном окне | корзина товаров в модели очищается, а также очищается localStorage |
| formErrors:change | при обнаружении событий при валидации | отображение ошибок в форме |
| /^(order|contacts)\..*:change$/ | изменение любых input элементов в формах | заполнение деталей для заказа |