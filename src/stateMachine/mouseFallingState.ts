import { StateMachine } from "../modules/stateMachine";
import utils from "../../node_modules/decentraland-ecs-utils/index";
import { StateMachineCollisionEvent } from "./stateMachineCollisionEvent";
import { MouseComponent } from "../components/mouseComponent";

/**
 * Estado para quando o rato está caindo após a explosão da bolha
 */
export class MouseFallingState extends StateMachine.State {
  mouseComponent: MouseComponent;
  isStateRunning: boolean;
  deadState: StateMachine.State;

  /**
   * Cria uma instância do estado
   * @param mouseComponent Componente do rato
   * @param deadState Estado para iniciar se o rato morrer
   */
  constructor(mouseComponent: MouseComponent, deadState: StateMachine.State) {
    super();
    this.mouseComponent = mouseComponent;
    this.deadState = deadState;
  }

  /**
   * Chamado quando o estado começa
   */
  onStart() {
    // define o estado como em execução
    this.isStateRunning = true;
    // move o rato um pouco para cima com um efeito de saída
    this.mouseComponent.mouseEntity.addComponent(
      new utils.MoveTransformComponent(
        this.mouseComponent.transform.position,
        this.mouseComponent.transform.position.add(new Vector3(0, 0.1, 0)),
        0.2,
        (): void => {
          // calcula a posição no chão
          const targetPosition = new Vector3(
            this.mouseComponent.transform.position.x,
            1,
            this.mouseComponent.transform.position.z
          );
          // move o rato para o chão
          this.mouseComponent.mouseEntity.addComponent(
            new utils.MoveTransformComponent(
              this.mouseComponent.transform.position,
              targetPosition,
              0.5,
              (): void => {
                // o estado deve terminar agora
                this.isStateRunning = false;
              },
              utils.InterpolationType.EASEINQUAD
            )
          );
        },
        utils.InterpolationType.EASEOUTQUAD
      )
    );
  }

  /**
   * Chamado quando o estado é atualizado
   * @returns TRUE para manter o estado em execução, FALSE para finalizar o estado
   */
  onUpdateState() {
    // o estado ainda está em execução?
    return this.isStateRunning;
  }

  /**
   * Manipula os eventos recebidos pela máquina de estados
   * @param event Evento a ser manipulado
   */
  onHandleEvent(event: StateMachine.IStateEvent) {
    // se provocarmos uma colisão durante a queda
    if (event instanceof StateMachineCollisionEvent) {
      // se colidirmos com uma PIKE ou com uma BOX
      if (
        event.triggerType == StateMachineCollisionEvent.PIKES ||
        event.triggerType == StateMachineCollisionEvent.BOXES
      ) {
        // parar de mover para baixo
        if (
          this.mouseComponent.mouseEntity.hasComponent(
            utils.MoveTransformComponent
          )
        ) {
          this.mouseComponent.mouseEntity.removeComponent(
            utils.MoveTransformComponent
          );
        }
        // o rato deve morrer
        event.stateMachine.setState(this.deadState);
      }
    }
  }
}
