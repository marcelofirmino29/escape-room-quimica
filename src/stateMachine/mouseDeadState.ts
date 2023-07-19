import { StateMachine } from "../modules/stateMachine";
import utils from "../../node_modules/decentraland-ecs-utils/index";
import { MouseComponent } from "../components/mouseComponent";

/**
 * Estado para quando o rato morre
 */
export class MouseDeadState extends StateMachine.State {
  mouseComponent: MouseComponent;
  isStateRunning: boolean;

  constructor(mouseComponent: MouseComponent) {
    super();
    this.mouseComponent = mouseComponent;
  }

  /**
   * Chamado quando o estado começa
   */
  onStart() {
    // estado em execução
    this.isStateRunning = true;
    // definir o tempo para os componentes do sistema de transformação
    const time = 1.5;
    // rotacionar o rato
    this.mouseComponent.mouseEntity.addComponent(
      new utils.RotateTransformComponent(
        this.mouseComponent.transform.rotation,
        this.mouseComponent.transform.rotation.multiply(
          Quaternion.Euler(0, 270, 0)
        ),
        time
      )
    );
    // e diminuir a escala
    this.mouseComponent.mouseEntity.addComponent(
      new utils.ScaleTransformComponent(
        this.mouseComponent.transform.scale,
        Vector3.Zero(),
        time,
        (): void => {
          // agora o estado deve terminar
          this.isStateRunning = false;
        },
        utils.InterpolationType.EASEINQUAD
      )
    );
  }

  /**
   * Chamado quando o estado é atualizado
   * @returns TRUE para manter o estado em execução, FALSE para finalizar o estado
   */
  onUpdateState() {
    // o estado está em execução?
    return this.isStateRunning;
  }
}
