import { StateMachine } from "../modules/stateMachine";
import utils from "../../node_modules/decentraland-ecs-utils/index";
import { MouseComponent } from "../components/mouseComponent";

/**
 * Estado de aparição do rato
 */
export class MouseStateAppear extends StateMachine.State {
  mouseComponent: MouseComponent;

  constructor(mouseComponent: MouseComponent) {
    super();
    this.mouseComponent = mouseComponent;
  }

  /**
   * Chamado quando o estado começa
   */
  onStart() {
    // define a posição inicial do rato
    this.mouseComponent.transform.position = new Vector3(
      -0.872083,
      1,
      -0.579439
    );
    // define a escala inicial do rato
    this.mouseComponent.transform.scale = Vector3.Zero();
    // define a direção como zero
    this.mouseComponent.direction = Vector3.Zero();
    // inicia a escalonamento do rato e define a direção quando terminar de escalonar
    this.mouseComponent.mouseEntity.addComponent(
      new utils.ScaleTransformComponent(
        Vector3.Zero(),
        Vector3.One(),
        1,
        (): void => {
          this.mouseComponent.direction = Vector3.Right();
          this.mouseComponent.transform.lookAt(
            this.mouseComponent.transform.position.add(
              this.mouseComponent.direction
            )
          );
        },
        utils.InterpolationType.EASEQUAD
      )
    );
  }
}
