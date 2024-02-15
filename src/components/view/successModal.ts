import { ISuccessOrder } from '../../types';
import { Component } from '../base/component';
import { IEvents } from '../base/events';

export interface ISuccessModal {
	render(data?: Partial<ISuccessOrder>): HTMLElement;
}

export class SuccessModal
	extends Component<ISuccessOrder>
	implements ISuccessModal
{
	private descriptionElement: HTMLElement;
	private buttonElement: HTMLButtonElement;
	private events: IEvents;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;
		this.descriptionElement = this.container.querySelector(
			'.order-success__description'
		);
		this.buttonElement = this.container.querySelector('.order-success__close');

		this.buttonElement.addEventListener('click', () => {
			this.events.emit('order:done');
		});
	}

	set total(total: string) {
		this.descriptionElement.textContent = `Списано: ${total} синапсов`;
	}
}
