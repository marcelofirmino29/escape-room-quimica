import { StateMachine } from "../modules/stateMachine";
import utils from "../../node_modules/decentraland-ecs-utils/index";
import { MouseComponent } from "../components/mouseComponent";

/**
 * Estado de aparecimento do rato.
 */
export class MouseStateAppear extends StateMachine.State {
  mouseComponent: MouseComponent;

  constructor(mouseComponent: MouseComponent) {
    super();
    this.mouseComponent = mouseComponent;
  }

  /**
   * Chamado quando o estado começa.
   */
  onStart() {
    // Define a posição inicial do rato
    this.mouseComponent.transform.position = new Vector3(
      -0.872083,
      1,
      -0.579439
    );
    // Define a escala inicial do rato
    this.mouseComponent.transform.scale = Vector3.Zero();
    // Define a direção como zero
    this.mouseComponent.direction = Vector3.Zero();
    // Inicia a escala do rato e define sua direção quando terminar de escalonar
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
