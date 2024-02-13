export abstract class Presenter<M, V1 = undefined, V2 = undefined, V3 = undefined> {
	protected model: M;
	protected view1: V1 | undefined;
	protected view2: V2 | undefined;
	protected view3: V3 | undefined;

	constructor(model: M, view1?: V1, view2?: V2, view3?: V3) {
		this.model = model;
		this.view1 = view1;
		this.view2 = view2;
		this.view3 = view3;
		this.initialize();
	}

	protected abstract initialize(): void;

}
