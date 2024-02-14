import { IEvents } from '../base/events';
import { Form } from '../common/form';
import { IOrderData, IOrderForm, PaymentMethod } from '../../types';

export class OrderForm extends Form<IOrderForm> {
	buttonElements: HTMLButtonElement[];
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this.buttonElements = Array.from(
			this.container.querySelectorAll('.button_alt')
		);
		this.buttonElements.forEach((button) => {
			button.addEventListener('click', (event) =>
				this.handlePaymentChange(event)
			);
		});
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}

	set payment(value: PaymentMethod) {}

	private handlePaymentChange(event: Event) {
		const target = event.target as HTMLButtonElement;

		this.buttonElements.forEach((button) => {
			button.classList.remove('button_alt-active');
		});

		target.classList.add('button_alt-active');

		this.events.emit('order.payment:change', {
			field: 'payment',
			value: target.textContent.toLowerCase(),
		});
	}
}