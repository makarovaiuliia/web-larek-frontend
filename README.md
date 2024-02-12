# Web-ларёк | documentation

Здравствуйте! Всю документацию можно посмотреть на [этом сайте](https://green-receipt-741.notion.site/Web-documentation-51926a96fb1d4cb7be2e63f5e373307e?pvs=4), так будет удобнее:)

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
- src/styles/**styles.scss** — корневой файл стилей
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

## UML-диаграмма

[Диаграмма в Miro](https://miro.com/welcomeonboard/d2J1aGxhMjBmcnEycmZpeDN6aGdPZ282VWt1Nlk0N0twSktOTzVPM1g4aUFqMXY2c0Rha2JyeDFnVjY5THl5YnwzNDU4NzY0NTc3ODc4MjgxMzk0fDI=?share_link_id=781197361819)


## Описание ключевых типов данных

### Интерфейсы

```tsx
/* Интерфейс хранения данных всего приложения, включает в себя каталог
 всех карточек, массив добавленных в корзину товаров и данные заказа */

interface IAppModel{
		projectAPI: API; // API - класс, который есть в базовом коде
    cardCatalog: ICard[];
    shoppingList: IShoppingListItem[];
    order: IOrderData | null;
}

/* Интерфейс хранения данных карточки, которую приложение получает из сервера
и на основе которой заполняются карточки в HTML через слой View */

interface ICard {
		id: string;
		description: string;
		image: string;
		title: string;
		category: string;
		price: number;
}

/* Интерфейс элемента корзины покупок. Включает в себя id и price. Id - для
отправки данных заказа на сервер, а price - чтобы посчитать итоговую сумму заказа */

interface IShoppingListItem {
		id: string;
		price: number;
		title: string;
}

/* Интерфейс хранения данных заказа */

type PaymentMethod = 'онлайн' | 'при получении';

interface IOrderForm {
    payment: PaymentMethod;
    email: string;
    phone: string;
		address: string;
}

interface IOrderItems {
		total: number;
		items: string[];
}

interface IOrderData {
		form: IorderForm;
		items: IOrderItems;
}

/* Интерфейс удачного оформления заказа */

interface ISucsessOrder {
		total: number
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
- **Component** - абстрактный класс, который обслуживает создание UI компонентов. Он содержит методы, которые эффективно манипулируют DOM элементами
    
    **Конструктор класса:**
    
    Конструктор принимает `**container**: HTMLElement` и инициализирует его.
    
    **Методы класса:**
    
    - `**toggleClass**(element: HTMLElement, className: string, force?: boolean): void` : переключает класс указанного элемента. Также можно указать логический параметр Force для явного добавления или удаления класса.
    - `**setText**(element: HTMLElement, value: unknown): void` : устанавливает текстовое содержимое указанного элемента в заданное значение.
    - `**setDisabled**(element: HTMLElement, state: boolean): void` : активирует или деактивирует указанный элемент в зависимости от предоставленного состояния.
    - `**setHidden**(element: HTMLElement): void` : скрывает указанный элемент.
    - `**setVisible**(element: HTMLElement): void` : показывает указанный элемент
    - `**setImage**(element: HTMLImageElement, src: string, alt?: string): void` устанавливает источник и альтернативный текст для картинки
    - `**render**(data?: Partial<T>): HTMLElement` : рендерит компонент, при необходимости объединяя предоставленные данные со свойствами компонента. Возвращает корневой элемент контейнера.

### Класс: API

### Класс: слой Model

Слой Model представлен классом AppModel, он имплементирует следующий интерфейс:

```tsx
interface IAppModel {
    projectAPI: API;
    cardCatalog: ICard[];
    shoppingList: IShoppingListItem[];
    order: IOrderData | null;
    openedCard: IShoppingListItem | null;
    events: IEvents;

    set cards(): void
    addToShoppingList(item: IShoppingListItem): void;
    removeFromShoppingList(itemId: string): void;
    placeOrder(orderData: IOrderData): void
    emitChanges(event: string, payload?: object): void;
}
```

В классе AppModel зашиты следующие методы:

- **`set cards()`**: использует класс API для того, чтобы получить массив карточек с сервера.
- **`addToShoppingList(item: IShoppingListItem)`**: добавляет карточку в корзину, а также в LocalStorage
- **`removeFromShoppingList(itemId: string)`**: удаляет карточку из корзины по идентификатору, а также из LocalStorage
- **`fetchShoppingList(): IShoppingListItem[] | null`** : выгружает карточки из localStorage перед отображением их в корзине
- **`placeOrder(orderData: IOrderData)`**: делает заказ, используя API.
- **`emitChanges(event: string, payload?: object)`**: уведомляет все заинтересованные компоненты об изменениях в модели, позволяя им адаптироваться к новому состоянию данных.

### Класс: слой View

Базовый класс:

- **Modal** extends Component - предоставить основу для создания и управления модальными окнами в приложении.
    
    **Конструктор класса:**
    
    Принимает container и events. В контейнере ищет кнопку закрытия - `_*closeButton`, и контент - `_content`*.  На кнопку и на контейнер ставит обработчик событий, который закрывает модальное окно при нажатии на кнопку и на все, что находится вне модального окна. 
    
    **Поля класса:**
    
    - protected `_closeButton`: HTMLButtonElement;
    - protected `_content`: HTMLElement;
    
    **Методы класса:**
    
    - **`set content**(value: HTMLElement)` ****: устанавливает или обновляет контент, отображаемый в модальном окне;
    - `**open()**: void` :открывает модальное окно;
    - `**close()**: void` :закрывает модальное окно;
    - **`render**(data: IModalData): HTMLElement` :отображает модальное окно с предоставленными данными. Автоматически открывает модальное окно после рендеринга.

Классы отображения

- **CardView** extends Component - нужен для отображения карточек в приложении
    
    **Конструктор класса:**
    
    На входе класс принимает `HTMLTemplateElement`, который будет играть роль контейнера. При инициализации класса сразу же шаблон клонируется и отправляется в `super()`. Далее с помощью шаблона и querySelector заполняются поля класса.
    
    Также при инициализации на `this.container` добавляется eventListener(’click’, openModal), который будет передавать данные карточки для открытия модального окна 
    
    ```html
    <!-- Шаблон для карточек -->
    <template id="card-catalog">
    		<button class="gallery__item card">
    			<span class="card__category card__category_soft">софт-скил</span>
    			<h2 class="card__title">+1 час в сутках</h2>
    			<img class="card__image" src="<%=require('../images/Subtract.svg')%>" alt="" />
    			<span class="card__price">750 синапсов</span>
    		</button>
    	</template>
    ```
    
    **Поля класса:**
    
    - private `titleElement`: HTMLElement;
    - private `imageElement`: HTMLImageElement;
    - private `categoryElement`: HTMLElement;
    - private `priceElement`: HTMLElement;
    
    **Методы класса**
    
    - `**setTitle**(title: string)`: void: устанавливает название карточки;
    - `**setImage**(src: string): void` : устанавливает данные изображения;
    - **`setCategory**(category: string): void` : устанавливает категорию карточки;
    - **`setPrice**(price: number): void` : устанавливает цену товара;
    
- **ShoppingListView**  extends Component - рендерит корзину с товарами
    
    **Конструктор класса:**
    
    Конструктор получает на входе шаблон для корзины, он клонируется и отправляется в super(), далее внутри контейнера находятся listElement, buttonElement и totalPriceElement. На buttonElement устанавливается обработчик событий, который передает данные для заказа. На listElement также добавляется обработчик событий, который реагирует на нажатие кнопки удаления элемента из корзины.
    
    ```html
    <!-- шаблон корзины -->
    <template id="basket">
    		<div class="basket">
    			<h2 class="modal__title">Корзина</h2>
    			<ul class="basket__list"></ul>
    			<div class="modal__actions">
    				<button class="button basket__button">Оформить</button>
    				<span class="basket__price">0 синапсов</span>
    			</div>
    		</div>
    	</template>
    ```
    
    **Поля класса:**
    
    - private listElement: HTMLElement;
    - private totalPriceElement: HTMLElement;
    - buttonElement: HTMLElement;
    
    **Методы класса:**
    
    - `private **updateTotalPrice**(): void` : обновляет цену при добавлении/удалении карточек из корзины
    - `private **updateOrderData**(): void` : обновляет данные в this.orderData и передает их в модель
- **ShoppingListItemView** extends Component - нужен для рендера элементов корзины
    
    **Конструктор класса:**
    
    Конструктор получает на входе шаблон для корзины, он клонируется и отправляется в super(), далее внутри контейнера находятся indexElement, priceElement и titleElement.
    
    ```html
    <template id="card-basket">
    		<li class="basket__item card card_compact">
    			<span class="basket__item-index">1</span>
    			<span class="card__title">Фреймворк куки судьбы</span>
    			<span class="card__price">2500 синапсов</span>
    			<button class="basket__item-delete card__button" aria-label="удалить"></button>
    		</li>
    	</template>
    ```
    
    **Поля класса:**
    
    - private indexElement: HTMLElement
    - private titleElement: HTMLElement;
    - private priceElement: HTMLElement;
    
    **Методы класса:**
    
    - `**setTitle**(title: string)`: void: устанавливает название карточки;
    - `**setIndex**(index: string): void` : устанавливает индекс;
    - **`setPrice**(price: number): void` : устанавливает цену товара;
    

Модальные окна

- **CardInfoModal** extends Modal - модальное окно с отображением информации об отдельной карточке
    
    **Конструктор класса:**
    
    Принимает на вход контейнер с модальным окном карточки, он передается в super(), а также eventEmitter.
    
    ```html
    <!-- модальное окно для карточки -->
    <div class="modal modal_active" id="card-modal">
    		<div class="modal__container">
    			<button class="modal__close" aria-label="закрыть"></button>
    			<div class="modal__content">
    				<div class="card card_full">
    					<img class="card__image" src="<%=require('../images/Subtract.svg')%>" alt="" />
    					<div class="card__column">
    						<span class="card__category card__category_other">другое</span>
    						<h2 class="card__title">Бэкенд-антистресс</h2>
    						<p class="card__text">Если планируете решать задачи в тренажёре, берите два.</p>
    						<div class="card__row">
    							<button class="button">В корзину</button>
    							<span class="card__price">1000 синапсов</span>
    						</div>
    					</div>
    				</div>
    			</div>
    		</div>
    	</div>
    ```
    
    **Поля класса:**
    
    - private `titleElement`: HTMLElement;
    - private `imageElement`: HTMLImageElement;
    - private `categoryElement`: HTMLElement;
    - private `priceElement`: HTMLElement;
    - private `textElement`: HTMLElement;
    
    **Методы класса:**
    
    - `**setTitle**(title: string)`: void: устанавливает название карточки;
    - `**setImage**(src: string): void` : устанавливает данные изображения;
    - **`setCategory**(category: string): void` : устанавливает категорию карточки;
    - **`setPrice**(price: number): void` : устанавливает цену товара;
    - **`setText**(text: string): void`: устанавливает описание;
- **ShoppingListModal** extends Modal - модальное окно с корзиной
    
    **Конструктор класса:**
    
    Принимает на вход контейнер с модальным окном корзины, он передается в super(), а также eventEmitter. Также в конструкторе происходит следующее: инизиализируется сама корзина (класс **ShoppingListView**) и используется модальным окном.
    
    ```html
    <!-- Элемент, который получается этот класс -->
    <div class="modal" id="shopping-list-modal">
    		<div class="modal__container">
    			<button class="modal__close" aria-label="закрыть"></button>
    			<div class="modal__content">
    				<div class="basket">
    					...
    				</div>
    			</div>
    		</div>
    	</div>
    ```
    
    Поля класса:
    
    - private **`shoppingList:`** ShoppingListView;
- **PaymentFormModal** extends Modal - модальное окно с формой заказа
    
    **Конструктор класса:**
    
    Принимает на вход контейнер с модальным окном формы, он передается в super(), а также eventEmitter. С помощью querySelector находится кнопка “далее” и все input.
    
    ```html
    <!-- модальное окно формы -->
    <div class="modal" id="order-place-modal">
    		<div class="modal__container">
    			<button class="modal__close" aria-label="закрыть"></button>
    			<div class="modal__content">
    				<form class="form">
    					<div class="order">
    						<div class="order__field">
    							<h2 class="modal__title">Способ оплаты</h2>
    							<div class="order__buttons">
    								<button type="button" class="button button_alt">Онлайн</button>
    								<button type="button" class="button button_alt">При получении</button>
    							</div>
    						</div>
    						<label class="order__field">
    							<span class="form__label modal__title">Адрес доставки</span>
    							<input class="form__input" type="text" placeholder="Введите адрес" />
    						</label>
    					</div>
    					<div class="modal__actions">
    						<button disabled class="button">Далее</button>
    					</div>
    				</form>
    			</div>
    		</div>
    	</div>
    ```
    
    **Поля класса:**
    
    - `buttonElement`: HTMLButtonElement;
    - private `inputElements`: HTMLInputElements[]
    
    **Методы класса:**
    
    - `**setupValidation**(): void` : устанавливает валидацию для всех полей формы и не дает пройти дальше без заполнения всех полей
- **OrderDetailsModal** extends Modal - модальное окно с формой заказа
    
    **Конструктор класса:**
    
    Принимает на вход контейнер с модальным окном формы, он передается в super(), а также eventEmitter. С помощью querySelector находится кнопка “оплатить” и все input.
    
    ```html
    <!-- модальное окно формы -->
    <div class="modal" id="order-data-model">
    		<div class="modal__container">
    			<button class="modal__close" aria-label="закрыть"></button>
    			<div class="modal__content">
    				<form class="form">
    					<div class="order">
    						<label class="order__field">
    							<span class="form__label modal__title">Email</span>
    							<input class="form__input" type="text" placeholder="Введите Email" />
    						</label>
    						<label class="order__field">
    							<span class="form__label modal__title">Телефон</span>
    							<input class="form__input" type="text" placeholder="+7 (" />
    						</label>
    					</div>
    					<div class="modal__actions">
    						<button disabled class="button">Оплатить</button>
    					</div>
    				</form>
    			</div>
    		</div>
    	</div>
    ```
    
    **Поля класса:**
    
    - `buttonElement`: HTMLButtonElement;
    - private `inputElements`: HTMLInputElements[]
    
    **Методы класса:**
    
    - `**setupValidation**(): void` : устанавливает валидацию для всех полей формы и не дает пройти дальше без заполнения всех полей
- **SuccessModal** extends Modal - модальное окно с результатом заказа
    
    **Конструктор класса:**
    
    Принимает на вход контейнер с модальным окном формы, он передается в super(), а также eventEmitter. С помощью querySelector находится кнопка “оплатить” и все input.
    
    ```html
    <!-- модальное окно успешного заказа -->
    <div class="modal" id="success-modal">
    		<div class="modal__container">
    			<button class="modal__close" aria-label="закрыть"></button>
    			<div class="modal__content">
    				<div class="order-success">
    					<h2 class="order-success__title">Заказ оформлен</h2>
    					<p class="order-success__description">Списано 0 синапсов</p>
    					<button class="button order-success__close">За новыми покупками!</button>
    				</div>
    			</div>
    		</div>
    	</div>
    ```
    
    **Поля класса:**
    
    - private `descriptionElement`: HTMLElement;
    - `buttonElements`: HTMLButtonElement;

### Классы: слой Presenter

Базовый класс:

```tsx
abstract class Presenter<M, V> {
    protected model: M;
    protected view?: V;

    constructor(model: M, view: V) {
        this.model = model;
        this.view = view;
        this.initialize();
    }
    protected abstract initialize(): void;
}
```

Презентеры

- **CardPresenter** extends Presenter<AppModel, CardView> - пресентер для связи AppModel и CardView;
    
    **Конструктор класса:**
    
    Принимает общую Модель, CardView, CardInfoModal. Модель и CardView уходят в super().
    
    **Поля класса:**
    
    - private `cardInfoModal`: CardInfoModal
    
    **Методы класса**
    
    - `**initialise**(): void` : добавляет слушатели событий и сами события (в частности на кнопку “в корзину”/”удалить из корзины” в модальном окне и на саму карточку);
    - **`handleAddToShoppingList**(item: IShoppingListItem): void` : отправляет данные о добавленном элементе в модель
    - **`handleRemoveFromShoppingList**(id: string): void` : отправляет данные об удаленном элементе в модель
    - **`handleOpenModal**(cardInfo: ICard): void` : передает данные о нажатой карточке в модальное окно
- **ShoppingListPresenter** extends Presenter<AppModel, ShoppingListView> - пресентер для связи AppModel и ShoppingListView;
    
    **Конструктор класса:**
    
    Принимает общую Модель и ShoppingListView. Они же уходят в super().
    
    **Методы класса:**
    
    - `**initialise**(): void` : добавляет слушатели событий и сами события (например, ставит слушатель событий на кнопку оформить заказ)
    - **`updateView**(): void` : обновляет вид UI
    - **`handleOrderPlacement**(): void` : передает информацию о заказе, начинает процесс оформления
    - **`removeItem**(id: string): void` : удаляет элемент из корзины, отправляет в модель и вызывает updateView()
- **OrderPresenter** extends Presenter<AppModel> - пресентер для связи AppModel и всех форм;
    
    **Конструктор класса:**
    
    Принимает общую Модель. Она же уходит в super(). Также он инициализирует два класса: PaymentFormModal, OrderDetailsModal и SuccessModel, таким образом у него будет к нему доступ ко всем модальным окнам, которые связаны с заказом.
    
    **Поля класса:**
    
    - private `paymentMethodModal`: PaymentMethodModal;
    - private `orderDetailsModal`: OrderDetailsModal;
    - private `successModal`: SuccessModal
    
    **Методы класса:**
    
    - `**initialise**(): void` : добавляет слушатели событий и сами события
    - `public **startOrderProcess**(): void` : открывает модальное первое модальное окно;
    - `private **handlePaymentMethodSelected**()`: Открывает следующее окно
    - `private **handleOrderDetailsSubmitted**()`: Отправляет заказ в модель для отправки на сервер
    - `private **handleOpenSuccessModal**()`: Когда заказ отправлен, открывает окно SuccessModal
    - `private **HandleClosingSuccessModal**(): void`: закрывает окно успешного заказа
    

## Описание событий

Для контроля событий в проекте используется класс EventEmitter (класс описан выше).

**Список событий**

| Событие | Триггер | Реакция |
| --- | --- | --- |
| card:select | При нажатии на любую из карточек | Отправка в AppModel данных выбранной карточки |
| cards:changed | При добавлении в корзину/удалении из корзины карточки | Переотрисовка карточек в каталоге |
| shoppingListItem:add | при нажатии на кнопку добавить в корзину | ShoppingListPresenter отрисовывает новый элемент в корзине и передает инфо в модель |
| shoppingListItem:remove | при нажатии на кнопку убрать из корзины | ShoppingListPresenter удаляет элемент из корзины и передает инфо в модель |
| paymentMethod:select | при нажатии на одну из кнопок выбора метода оплаты | Добавить инфо в модель |
| order:sumbit | когда информация о заказе ушла на сервер и вернулся положительный ответ | открывает sucessWindow |
