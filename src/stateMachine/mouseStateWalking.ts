import { StateMachine } from "../modules/stateMachine";
import { StateMachineCollisionEvent } from "./stateMachineCollisionEvent";
import { StateMachineOnClickEvent } from "./stateMachineOnClickEvent";
import { MouseComponent } from "../components/mouseComponent";

/**
 * Estado de caminhada do rato.
 */
export class MouseStateWalking extends StateMachine.State {
  mouseComponent: MouseComponent;
  deadState: StateMachine.State;
  cageState: StateMachine.State;

  /**
   * Criar uma instância do estado
   * @param mouseComponent Componente do rato
   * @param deadState Estado para o rato morrer
   * @param cageState Estado para entrar na gaiola
   */
  constructor(
    mouseComponent: MouseComponent,
    deadState: StateMachine.State,
    cageState: StateMachine.State
  ) {
    super();
    this.mouseComponent = mouseComponent;
    this.deadState = deadState;
    this.cageState = cageState;
  }
  /**
   * Chamado quando o estado começa.
   */
  onStart() {
    // Rota o rato para olhar na direção
    this.mouseComponent.transform.lookAt(
      this.mouseComponent.transform.position.add(this.mouseComponent.direction)
    );
  }
  /**
   * Chamado quando o estado é atualizado.
   * @param dt delta
   * Retorna TRUE para manter o estado em execução, FALSE para finalizar o estado
   */
  onUpdateState(dt: number) {
    // Move o rato
    this.mouseComponent.transform.position = this.mouseComponent.transform.position.add(
      this.mouseComponent.direction.scale(0.5 * dt)
    );
    // Verifica os limites do cenário para fazer o rato quicar e ir na outra direção
    if (this.mouseComponent.transform.position.x < -1.12) {
      this.mouseComponent.transform.position.x = -1.12;
      this.changeDirection();
    } else if (this.mouseComponent.transform.position.x > 0.98) {
      this.mouseComponent.transform.position.x = 0.98;
      this.changeDirection();
    }
    if (this.mouseComponent.transform.position.z > 1.33) {
      this.mouseComponent.transform.position.z = 1.33;
      this.changeDirection();
    } else if (this.mouseComponent.transform.position.z < -1.37) {
      this.mouseComponent.transform.position.z = -1.37;
      this.changeDirection();
    }
    return true;
  }
  /**
   * Lida com os eventos recebidos pela máquina de estados.
   * @param event Evento a ser tratado
   */
  onHandleEvent(event: StateMachine.IStateEvent) {
    // Se uma colisão for recebida
    if (event instanceof StateMachineCollisionEvent) {
      // Se for PIKES, o rato deve morrer
      if (event.triggerType == StateMachineCollisionEvent.PIKES) {
        event.stateMachine.setState(this.deadState);
      }
      // Se for uma caixa, o rato deve mudar sua direção de movimento
      else if (event.triggerType == StateMachineCollisionEvent.BOXES) {
        this.changeDirection();
      }
      // Se for a GAIOLA, chamamos o estado para finalizar o quebra-cabeça
      else if (event.triggerType == StateMachineCollisionEvent.CAGE) {
        const mouseForward = Vector3.Forward().rotate(
          this.mouseComponent.transform.rotation
        );
        if (mouseForward.x >= 0.9) {
          event.stateMachine.setState(this.cageState);
        }
      }
    }
    // Se o rato for clicado, a bolha deve aparecer
    else if (event instanceof StateMachineOnClickEvent) {
      event.stateMachine.setState(event.bubbleState);
    }
  }

  /**
   * Muda a direção de movimento do rato e a rotação do rato.
   */
  private changeDirection() {
    this.mouseComponent.direction = this.mouseComponent.direction.scale(-1);
    this.mouseComponent.transform.lookAt(
      this.mouseComponent.transform.position.add(this.mouseComponent.direction)
    );
  }
}
