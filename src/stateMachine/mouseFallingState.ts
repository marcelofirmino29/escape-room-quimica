import { StateMachine } from "../modules/stateMachine";
import utils from "../../node_modules/decentraland-ecs-utils/index";
import { StateMachineCollisionEvent } from "./stateMachineCollisionEvent";
import { MouseComponent } from "../components/mouseComponent";

/**
 * Estado para o rato caindo após a bolha explodir.
 */
export class MouseFallingState extends StateMachine.State {
  mouseComponent: MouseComponent;
  isStateRunning: boolean;
  deadState: StateMachine.State;

  /**
   * Cria uma instância do estado.
   * @param mouseComponent Componente do rato.
   * @param deadState Estado para iniciar se o rato morrer.
   */
  constructor(mouseComponent: MouseComponent, deadState: StateMachine.State) {
    super();
    this.mouseComponent = mouseComponent;
    this.deadState = deadState;
  }

  /**
   * Chamado quando o estado começa.
   */
  onStart() {
    // Define o estado como em execução
    this.isStateRunning = true;
    // Move o rato um pouco para cima com uma saída suave (ease out)
    this.mouseComponent.mouseEntity.addComponent(
      new utils.MoveTransformComponent(
        this.mouseComponent.transform.position,
        this.mouseComponent.transform.position.add(new Vector3(0, 0.1, 0)),
        0.2,
        (): void => {
          // Calcula a posição até o chão
          const targetPosition = new Vector3(
            this.mouseComponent.transform.position.x,
            1,
            this.mouseComponent.transform.position.z
          );
          // Move o rato até o chão
          this.mouseComponent.mouseEntity.addComponent(
            new utils.MoveTransformComponent(
              this.mouseComponent.transform.position,
              targetPosition,
              0.5,
              (): void => {
                // O estado deve terminar agora
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
   * Chamado quando o estado é atualizado.
   * @param dt Delta.
   * Retorna TRUE para continuar o estado, FALSE para finalizar o estado.
   */
  onUpdateState() {
    // O estado ainda está em execução?
    return this.isStateRunning;
  }

  /**
   * Manipula eventos recebidos pela máquina de estados.
   * @param event Evento a ser tratado.
   */
  onHandleEvent(event: StateMachine.IStateEvent) {
    // Se desencadeamos uma colisão enquanto caímos
    if (event instanceof StateMachineCollisionEvent) {
      // Se colidimos com uma "PIKE" ou com uma "BOX"
      if (
        event.triggerType == StateMachineCollisionEvent.PIKES ||
        event.triggerType == StateMachineCollisionEvent.BOXES
      ) {
        // Parar de mover para baixo
        if (
          this.mouseComponent.mouseEntity.hasComponent(
            utils.MoveTransformComponent
          )
        ) {
          this.mouseComponent.mouseEntity.removeComponent(
            utils.MoveTransformComponent
          );
        }
        // O rato deve morrer
        event.stateMachine.setState(this.deadState);
      }
    }
  }
}
