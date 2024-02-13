import { IEvents } from './events';
import { IAppModel } from '../AppModel';
import { Modal } from '../common/modal';

export abstract class Presenter<T = undefined> {
	protected events: IEvents;
	protected model: IAppModel;
	protected modal: Modal;
	protected view?: T;

	constructor(model: IAppModel, events: IEvents, modal: Modal, view?: T) {
		this.model = model;
		this.events = events;
		this.modal = modal;
		this.view = view;
		this.initialize();
	}

	protected abstract initialize(): void;
}
