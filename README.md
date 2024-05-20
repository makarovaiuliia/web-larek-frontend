# Web-Laryok | Documentation

[deploy](https://makarovaiuliia.github.io/web-larek-frontend/)

## Tech Stack

- HTML
- TypeScript
- SCSS
- Webpack
- ESLint

## Project Structure

- `src/` — project source files
- `src/components/` — folder with JS components
- `src/components/base/` — folder with base code

### Key Files

- `src/pages/index.html` — HTML file for the main page
- `src/types/index.ts` — file with types
- `src/index.ts` — entry point of the application
- `src/scss/styles.scss` — root styles file
- `src/utils/constants.ts` — file with constants
- `src/utils/utils.ts` — file with utilities

## Installation and Launch

To **install** the project, run the following commands:

```bash
npm install
```

To **start the project** in development mode, run:

```bash
npm run start
```

To **build** the project, run:

```bash
npm run build
```

## Architectural Solution Description

The application architecture is based on the MVP (Model-View-Presenter) pattern.

**Model:** We follow the single model approach, meaning one data model for the entire application.

**View:** The application contains numerous classes in the view layer responsible for displaying the UI and interacting with it.

**Presenter:** There are three presenters in the application:
1. **CardPresenter** - handles operations with cards and the model,
2. **ShoppingListPresenter** - handles operations with the shopping cart and the model,
3. **OrderPresenter** - connects the model and the order processing.

## Key Data Types Description

### Interfaces

```tsx
/* Interface for storing card data, which the application receives from the server
and uses to fill out cards in HTML through the View layer */

export interface ICard {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

/* Interface for shopping cart items. Includes id and price. Id is for
sending order data to the server, and price is to calculate the total order amount */

export interface IShoppingListItem {
	id: string;
	price: number;
	title: string;
}

/* Interface for storing order data */

export type PaymentMethod = 'online' | 'on delivery' | '';

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
export type ButtonState = 'Add to Cart' | 'Remove from Cart';

/* Interface for successful order completion */

export interface ISuccessOrder {
	total: number;
	id: string;
}
```

### Classes: Base Classes

This project includes several base classes:

- **Api** - base class for working with the project's API

    **Class Fields**:

    - `baseUrl`: string
    - `options`: RequestInit (headers)

    All fields are populated during class initialization using the constructor.

    **Class Methods**:

    - `protected handleResponse(response: Response)` - returns the server response in JSON format. Handles errors if any occur. This method is called by all other methods.
    - `get(uri: string)` - takes a path, returns information from the server.
    - `post(uri: string, data: object, method: ApiPostMethods = 'POST')`- takes a path and data to send to the server, returns information from the server.

    Note: the ProjectApi class described below inherits from this class.

- **EventEmitter** - event broker, base class for working with events

    Initializes a common event broker for the entire application. It represents the presenter layer.

    **Class Fields**:

    - `_events`: Map<EventName, Set<Subscriber>>, where EventName is a string or regular expression, and Subscriber is a function.

    **Class Methods**:

    - `on<T extends object>(eventName: EventName, callBack: (event: T) => void): void`: subscribes a callback function to a specific event. If the event does not exist, it creates it.
    - `off(eventName: EventName, callback: Subscriber): void`: removes the subscription to the event. If there are no other subscriptions, it deletes the event.
    - `emit<T extends object>(eventName: string, data?: T): void`: sends the event to all subscribers. If EventName matches RegExp or a string, the corresponding callbacks are executed.
    - `onAll(callback: (event: EmitterEvent) => void): void`: subscribes a callback to all events created by the instance.
    - `offAll(): void`: removes all subscriptions triggered by the instance.
    - `trigger<T extends object>(eventName: string, context?: Partial<T>): (data: T) => void`: creates and returns a trigger function for a specific event, which, when called, generates an event with the provided data and context.

- **Component** - abstract class that serves as the base class for creating UI components. It contains methods that efficiently manipulate DOM elements.
    
    **Class Constructor:**
    
    The constructor takes `container: HTMLElement` and initializes it.
    
    **Class Fields:**
    
    No own fields.
    
    **Class Methods:**
    
    - `toggleClass(element: HTMLElement, className: string, force?: boolean): void`: toggles the specified class of the element. A boolean force parameter can be provided to explicitly add or remove the class.
    - `setText(element: HTMLElement, value: unknown): void`: sets the text content of the specified element to the given value.
    - `setDisabled(element: HTMLElement, state: boolean): void`: enables or disables the specified element based on the provided state.
    - `setHidden(element: HTMLElement): void`: hides the specified element.
    - `setVisible(element: HTMLElement): void`: shows the specified element.
    - `setImage(element: HTMLImageElement, src: string, alt?: string): void`: sets the source and alternative text for the image.
    - `render(data?: Partial<T>): HTMLElement`: renders the component, optionally merging the provided data with the component's properties. Returns the root container element.

- **Presenter** - abstract class that serves as the base class for all presenters.

    **Class Constructor:**

    The constructor takes 3 to 5 arguments. The 3 required ones are the model, eventEmitter, and modal window. Additional optional arguments include one to three view classes. The view classes can vary, such as an order form for modal window content or a shopping cart. The solution uses numbering since not all presenters follow a unified pattern for accepting view layer elements as arguments. The presenter has generics - V, V2, and V3 - that need to be specified when implementing the class, e.g., `<IOrderForm, IContactsForm, ISuccessModal>`.

    **Class Fields:**

    - `protected _events`: IEvents;
    - `protected _model`: IAppModel;
    - `protected _modal`: Modal;
    - `protected _view?`: V;
    - `protected _view2?`: V2;
    - `protected _view3?`: V3

    **Class Methods:**

    No own methods.

### Class: Project Api

To facilitate working with the API, the ProjectApi class inherits from the Api class. It implements the following interface:

```tsx
export interface IProjectApi {
	getCardList: () => Promise<ICard[]>;
	getCard: (id: string) => Promise<ICard>;
	postOrder: (order: IOrderData) => Promise<ISuccessOrder>;
}
```

**Class Constructor:**

The class takes an additional parameter `cdn` for image paths, besides the parameters specified in the base class. `baseUrl` and `options` are passed to `super()`.

**Class Fields:**

- `readonly cdn: string`;

**Class Methods:**

- `getCardList: () => Promise<ICard[]>`: retrieves an array of cards from the server.
- `getCard: (id: string) => Promise<ICard>`: retrieves information about a specific card.
- `postOrder: (order: IOrderData) => Promise<ISuccessOrder>`: sends the order to the server.

### Class: Model Layer

The model layer is represented by the AppModel class, which implements the following interface:

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

**Class Constructor:**

The class takes initialized instances of ProjectApi and EventEmitter, and also calls the `initialize()` method.

**Class Fields:**

- `protected projectAPI`: IProjectApi;
- `protected events: IEvents;
- `cardCatalog: ICard[];
- `shoppingList: IShoppingListItem[];

**Class Methods:**

- `private initialize(): void`: called from the constructor and uses `fetchCards()`.
- `private fetchCards()`: uses the API class to retrieve an array of cards from the

 server.
- `addToShoppingList(item: IShoppingListItem)`: adds a card to the shopping cart and to LocalStorage.
- `removeFromShoppingList(itemId: string)`: removes a card from the shopping cart by its ID and from LocalStorage.
- `getShoppingList(): void`: loads cards from LocalStorage and stores them in the `shoppingList` variable.
- `placeOrder(orderData: IOrderData)`: places an order using the API.
- `clearShoppingList(): void`: clears the shopping cart in the model and LocalStorage.

### Class: View Layer

Common class:

- **Modal** extends Component - serves as the foundation for creating and managing modal windows in the application.

    **Class Constructor:**

    Takes a container and events. Within the container, it finds the close button (`_closeButton`) and content (`_content`). Event listeners are set on the close button and the container to close the modal when clicking the button or anything outside the modal window.

    **Class Fields:**

    - `protected _closeButton`: HTMLButtonElement;
    - `protected _content`: HTMLElement;

    **Class Methods:**

    - `set content(value: HTMLElement)`: sets or updates the content displayed in the modal window.
    - `open(): void`: opens the modal window.
    - `close(): void`: closes the modal window.
    - `render(data: IModalData): HTMLElement`: displays the modal window with the provided data. Automatically opens the modal window after rendering.

- **Card** extends Component - foundation for cards in the catalog and in the modal window.

    **Class Constructor:**

    Takes `HTMLElement` as a container, which is passed to `super()`. Fields are filled using a template and `querySelector`.

    **Class Fields:**

    - `_card`: ICard;
    - `events`: IEvent;
    - `protected _titleElement`: HTMLElement;
    - `protected _imageElement`: HTMLImageElement;
    - `protected _categoryElement`: HTMLElement;
    - `protected _priceElement`: HTMLElement;

    **Class Methods:**
    - `setTitle(title: string)`: void: sets the card's title.
    - `setImage(src: string)`: void: sets the image source.
    - `setCategory(category: string)`: void: sets the card's category.
    - `setPrice(price: number)`: void: sets the item's price.

- **Form<T>** extends Component<IFormState> - foundation for order forms.

    **Class Constructor:**

    Takes a form element and an EventEmitter. Sets event listeners on input elements and the submit button.

    **Class Fields:**

    - `protected _submit`: HTMLButton
    - `protected _errors`: HTMLElement

    **Class Methods:**

    - `protected onInputChange(field: keyof T, value: string)`: reacts to changes in the form's input elements.
    - `set valid(value: boolean)`: sets the form's validity.
    - `set errors(value: string[])`: sets the form's errors.
    - `render(state: Partial<T> & IFormState)`: renders the form.

**Display Classes**

Cards

- **CardView** extends Card - for displaying cards in the catalog.

    **Class Constructor:**

    Calls `super` and sets an event listener on the card itself, emitting a `card:select` event when clicked.

    **Class Fields:**

    No own fields.

    **Class Methods:**

    No own methods.

- **CardPreview** extends Card - for displaying cards in the modal window.

    **Class Constructor:**

    Calls `super` and sets an event listener on the "Add to Cart" button.

    **Class Fields:**

    - `private descriptionElement`: HTMLElement;
    - `private buttonElement`: HTMLButtonElement;

    **Class Methods:**

    - `set description(title: string)`: void: sets the card's description.
    - `set button(buttonText: ButtonState)`: void: sets the "Add to Cart" button state.

Shopping Cart

- **ShoppingListView** extends Component - renders the shopping cart with items.

    **Class Constructor:**

    Takes the shopping cart's HTMLElement as a parameter, which is passed to `super()`. Finds `listElement`, `buttonElement`, and `totalPriceElement` within the container. Sets an event listener on `buttonElement` to emit an `order:start` event.

    **Class Fields:**

    - `private listElement`: HTMLElement;
    - `private totalSumElement`: HTMLElement;
    - `private buttonElement`: HTMLElement;
    - `private counterElement`: HTMLElement;
    - `private events`: IEvent;
    
    **Class Methods:**
    
    - `private updateTotalSum(): void`: updates the total price when cards are added/removed from the cart.
    - `private updateOrderData(): void`: updates order data in `this.orderData` and sends it to the model.
    - `public updateView(shoppingListItems: IShoppingListItem[]): void`: updates the cart items after adding/removing.
    - `protected toggleButton(empty: boolean)`: enables or disables the "place order" button depending on whether the cart is empty.

- **ShoppingListItemView** extends Component - renders cart items.
    
    **Class Constructor:**
    
    Takes the shopping cart's HTMLElement as a parameter, which is passed to `super()`. Finds `indexElement`, `priceElement`, `titleElement`, and `buttonElement` within the container. Sets an event listener on `buttonElement` to emit a `card:remove` event when clicked.
    
    **Class Fields:**
    
    - `private indexElement`: HTMLElement;
    - `private titleElement`: HTMLElement;
    - `private priceElement`: HTMLElement;
    - `private buttonElement`: HTMLButtonElement;
    
    **Class Methods:**
    
    - `setTitle(title: string)`: void: sets the card's title.
    - `setIndex(index: string)`: void: sets the index.
    - `setPrice(price: number)`: void: sets the item's price.

Order Forms

- **OrderForm** extends Form<IOrderForm> - renders the first part of the order form.

    **Class Constructor:**

    Takes the form element and EventEmitter and passes them to `super()`. Sets event listeners on payment method buttons.

    **Class Fields:**

    - `private buttonElements`: HTMLButtonElement[];

    **Class Methods:**

    - `set address(value: string)`: sets the address.
    - `set payment(value: PaymentMethod)`: sets the payment method.
    - `handlePaymentChange(event: IEvent)`: reacts to payment method button clicks.

- **ContactsForm** extends Form<IContactsForm> - renders the second part of the order form.

    **Class Constructor:**

    Takes the form element and EventEmitter and passes them to `super()`. Sets event listeners on payment method buttons.

    **Class Fields:**

    No own fields.

    **Class Methods:**

    - `set phone(value: string)`: sets the phone number.
    - `set email(value: PaymentMethod)`: sets the email.

- **SuccessModal** extends Component<ISuccessOrder> - renders the modal window with the successful order result.

    **Class Constructor:**

    Takes the container and EventEmitter and passes them to `super()`. Finds the element with order cost information and the "new shopping" button. Sets event listeners on the "new shopping" button.

    **Class Fields:**

    - `private descriptionElement`: HTMLElement;
    - `private buttonElement`: HTMLButtonElement;
    - `private events`: IEvents;

    **Class Methods:**

    - `set total(value: string)`: sets the total order cost in `descriptionElement`.

### Presenter Layer Classes

- **CardPresenter** extends Presenter - presenter for connecting AppModel and CardView.

    **Class Constructor:**

    Takes instances of AppModel, Modal, and EventEmitter, which are initialized when the code runs.

    **Class Fields:**

    No own fields.

    **Class Methods:**

    - `loadCards(): void`: in response to the `cards:fetched` event, this function creates each card and displays it in the UI.
    - `handleOpenModal(cardInfo: ICard): void`: passes the clicked card's data to the modal window and the model.

- **ShoppingListPresenter** extends Presenter<ShoppingListView> - presenter for connecting AppModel and ShoppingListView.

    **Class Constructor:**

    Takes the common Model, EventEmitter, Modal, and ShoppingListView and passes them to `super()`.

    **Class Methods:**

    - `handleAddToShoppingList(item: IShoppingListItem): void`: adds an item to the cart, sends it to the model, and calls `updateView()`.
    - `handleRemoveFromShoppingList(id: string): void`: removes an item from the cart, sends it to the model, and calls `updateView()`.
    - `handleOrderPlacement(): void`: passes order information and starts the ordering process.
    - `handleOpenModal(): void`: opens the cart modal window.

- **OrderPresenter** extends Presenter<IOrderForm, IContactsForm, SuccessModal> - presenter for connecting AppModel and all forms.

    **Class Constructor:**

    Takes the common Model, EventEmitter, Modal, all forms, and SuccessModal and passes them to `super()`.

    **Class Fields:**

    - `private orderDetails`: IOrderData;
    - `private formErrors`: FormErrors = {};

    **Class Methods:**

    - `handleOpenOrderForm(): void`: opens the order form window.
    - `handleOpenContactsForm(): void`: opens the

 contacts form window.
    - `handleChangeInput<K extends keyof IOrderData>(): void`: substitutes values from the form into the order data variable.
    - `validateOrder(): boolean`: checks if all necessary order data is present and returns an error if something is missing.
    - `handleErrors(): void`: passes error texts.
    - `handleSendOrderDetails(): void`: sends the order to the server through the model's method.
    - `handleClearShoppingList()`: called by `handleSendOrderDetails()` and clears the shopping cart in the model.

## Event Descriptions

The project uses the EventEmitter class (described above) to manage events.

**Event List**

| Event | Trigger | Reaction |
| --- | --- | --- |
| `cards:fetched` | Promise resolution that loads cards from the server | cardPresenter uses the loaded cards to display them in the UI |
| `card:select` | Clicking on any card | Sends the selected card data to AppModel and opens the modal window with the card |
| `card:add` | Clicking the "Add to Cart" button | Adds an item to the cart and updates the cart item list in the model |
| `card:remove` | Clicking the "Remove from Cart" button | Removes an item from the cart, updates the cart item list in the model |
| `modal:open` | Opening any modal window | The page is blocked |
| `modal:closed` | Closing any modal window | The page block is removed |
| `order:start` | Clicking the "Place Order" button in the cart | Opens the order form |
| `order:submit` | When the first part of the form is filled out and the "Next" button is clicked | Opens the second part of the form |
| `contacts:submit` | When the second part of the form is filled out and the "Pay" button is clicked | Calls the `placeOrder` method - information is sent to the server |
| `form:submit` | When order information is sent to the server and a positive response is received | Opens the success window |
| `order:done` | Clicking the "New Shopping" button in the success modal window | The shopping cart in the model is cleared, and localStorage is also cleared |
| `formErrors:change` | Detecting errors during validation | Displays errors in the form |
| `/^(order|contacts)\..*:change$/` | Changing any input elements in forms | Fills in the details for the order |

---
