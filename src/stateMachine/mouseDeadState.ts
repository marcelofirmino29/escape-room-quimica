import { StateMachine } from "../modules/stateMachine";
import utils from "../../node_modules/decentraland-ecs-utils/index";
import { MouseComponent } from "../components/mouseComponent";

/**
 * Estado para quando o rato morre.
 */
export class MouseDeadState extends StateMachine.State {
  mouseComponent: MouseComponent;
  isStateRunning: boolean;

  constructor(mouseComponent: MouseComponent) {
    super();
    this.mouseComponent = mouseComponent;
  }

  /**
   * Chamado quando o estado começa.
   */
  onStart() {
    // Estado está em execução
    this.isStateRunning = true;
    // Define o tempo para os componentes de transformação do sistema
    const time = 1.5;
    // Rotaciona o rato
    this.mouseComponent.mouseEntity.addComponent(
      new utils.RotateTransformComponent(
        this.mouseComponent.transform.rotation,
        this.mouseComponent.transform.rotation.multiply(
          Quaternion.Euler(0, 270, 0)
        ),
        time
      )
    );
    // E dimensiona o rato para baixo
    this.mouseComponent.mouseEntity.addComponent(
      new utils.ScaleTransformComponent(
        this.mouseComponent.transform.scale,
        Vector3.Zero(),
        time,
        (): void => {
          // Agora o estado deve terminar
          this.isStateRunning = false;
        },
        utils.InterpolationType.EASEINQUAD
      )
    );
  }

  /**
   * Chamado quando o estado é atualizado.
   * @param dt Delta.
   * Retorna TRUE para continuar o estado, FALSE para finalizar o estado.
   */
  onUpdateState() {
    // O estado está em execução?
    return this.isStateRunning;
  }
}
