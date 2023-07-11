@Component("toggleModelComponent")
export class ToggleModelComponent {
  private onModel: GLTFShape;
  private offModel: GLTFShape;

  constructor(entity: IEntity, onModel: GLTFShape, offModel: GLTFShape) {
    this.onModel = onModel;
    const onEntity = new Entity();
    onEntity.addComponent(this.onModel);
    onEntity.setParent(entity);

    this.offModel = offModel;
    const offEntity = new Entity();
    offEntity.addComponent(this.offModel);
    offEntity.setParent(entity);

    this.onModel.visible = false;
  }

  isOn(): boolean {
    return this.onModel.visible;
  }

  toggle() {
    if (this.isOn()) {
      this.onModel.visible = false;
      this.offModel.visible = true;
    } else {
      this.offModel.visible = false;
      this.onModel.visible = true;
    }
  }
}
