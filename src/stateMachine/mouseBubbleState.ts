import { StateMachine } from "../modules/stateMachine";
import { StateMachineOnClickEvent } from "./stateMachineOnClickEvent";
import { StateMachineCollisionEvent } from "./stateMachineCollisionEvent";
import { MouseComponent } from "../components/mouseComponent";

/**
 * Estado da bolha flutuando empurrada por algum vento dos ventiladores
 */
export class MouseBubbleState extends StateMachine.State {
  mouseComponent: MouseComponent;
  bubbleBurstState: StateMachine.State;
  time: number;

  /**
   * Cria uma instância do estado
   * @param mouseComponent Componente do rato
   * @param bubbleBurstState Estado de estouro da bolha
   */
  constructor(
    mouseComponent: MouseComponent,
    bubbleBurstState: StateMachine.State
  ) {
    super();
    this.mouseComponent = mouseComponent;
    this.bubbleBurstState = bubbleBurstState;
  }

  /**
   * Chamado quando o estado começa
   */
  onStart() {
    this.time = 0.5;
  }

  /**
   * Chamado quando o estado é atualizado
   * @param dt Delta
   * @returns TRUE para manter o estado em execução, FALSE para finalizar o estado
   */
  onUpdateState(dt: number) {
    // incrementar o tempo
    this.time += dt;
    // calcular a nova posição de acordo com a direção do rato, velocidade e tempo
    const newPosition = this.mouseComponent.transform.position.add(
      this.mouseComponent.direction.scale(0.2 * dt)
    );
    // vamos usar a função SIN para mover o rato um pouco para cima e para baixo
    newPosition.y = 1.5 + Math.sin(this.time) * 0.1;
    // definir a nova posição para o rato
    this.mouseComponent.transform.position = newPosition;
    // verificar os limites da sala
    if (this.mouseComponent.transform.position.x < -1.12) {
      this.mouseComponent.transform.position.x = -1.12;
    } else if (this.mouseComponent.transform.position.x > 0.98) {
      this.mouseComponent.transform.position.x = 0.98;
    }
    if (this.mouseComponent.transform.position.z > 1.33) {
      this.mouseComponent.transform.position.z = 1.33;
    } else if (this.mouseComponent.transform.position.z < -1.37) {
      this.mouseComponent.transform.position.z = -1.37;
    }
    return true;
  }

  /**
   * Lidar com eventos recebidos pela máquina de estados
   * @param event Evento a ser tratado
   */
  onHandleEvent(event: StateMachine.IStateEvent) {
    // se a bolha for clicada, estouramos ela
    if (event instanceof StateMachineOnClickEvent) {
      event.stateMachine.setState(this.bubbleBurstState);
    }
    // se provocarmos uma colisão
    else if (event instanceof StateMachineCollisionEvent) {
      // se for um VENTILADOR, então nos movemos na direção para a frente dele
      if (event.triggerType == StateMachineCollisionEvent.FANS) {
        const parentForward = Vector3.Forward().rotate(
          event.entity.getComponent(Transform).rotation
        );
        this.mouseComponent.direction = parentForward;
      }
      // se for um ESPIGO, então a bolha deve estourar
      else if (event.triggerType == StateMachineCollisionEvent.PIKES) {
        event.stateMachine.setState(this.bubbleBurstState);
      }
    }
  }
}
