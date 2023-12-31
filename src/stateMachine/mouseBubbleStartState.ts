import { StateMachine } from "../modules/stateMachine";
import utils from "../../node_modules/decentraland-ecs-utils/index";
import { StateMachineOnClickEvent } from "./stateMachineOnClickEvent";
import { StateMachineCollisionEvent } from "./stateMachineCollisionEvent";
import { MouseComponent } from "../components/mouseComponent";

/**
 * Estado para a bolha aparecer e depois subir no ar.
 */
export class MouseBubbleStartState extends StateMachine.State {
  mouseComponent: MouseComponent;
  bubbleState: StateMachine.State;
  isUp: boolean;
  audioClipInflate: AudioClip;

  /**
   * Cria uma instância do estado.
   * @param mouseComponent componente do rato
   * @param bubbleState estado para o rato dentro da bolha flutuando no lugar
   */
  constructor(mouseComponent: MouseComponent, bubbleState: StateMachine.State) {
    super();
    this.mouseComponent = mouseComponent;
    this.bubbleState = bubbleState;
    this.audioClipInflate = new AudioClip("sounds/inflator.mp3");
  }

  /**
   * Chamado quando o estado começa.
   */
  onStart() {
    // O rato ainda não está totalmente no ar
    this.isUp = false;
    // Vamos fazer a bolha aparecer
    this.mouseComponent.bubble.getComponent(SphereShape).visible = true;
    // Escalamos a bolha para sua escala padrão
    this.mouseComponent.bubble.addComponent(
      new utils.ScaleTransformComponent(
        Vector3.Zero(),
        new Vector3(0.3, 0.3, 0.3),
        1.5,
        (): void => {
          // Quando a bolha terminar de escalar, levantamos o rato no ar
          const currentPosition = this.mouseComponent.transform.position;
          const targetPosition = new Vector3(
            currentPosition.x,
            1.4,
            currentPosition.z
          );
          this.mouseComponent.mouseEntity.addComponent(
            new utils.MoveTransformComponent(
              currentPosition,
              targetPosition,
              1,
              (): void => {
                // Agora o rato está totalmente no ar
                this.isUp = true;
              }
            )
          );
        }
      )
    );
    // Tocamos o som
    const audioSource = new AudioSource(this.audioClipInflate);
    this.mouseComponent.mouseEntity.addComponentOrReplace(audioSource);
    audioSource.playOnce();
  }

  /**
   * Chamado quando o estado é atualizado.
   * @param dt delta
   * Retorna TRUE para continuar o estado, FALSE para finalizar o estado
   */
  onUpdateState(dt: number) {
    return true;
  }

  /**
   * Manipula os eventos recebidos pela máquina de estados.
   * @param event evento a ser tratado
   */
  onHandleEvent(event: StateMachine.IStateEvent) {
    // Se a bolha for clicada
    if (event instanceof StateMachineOnClickEvent) {
      // E estivermos totalmente no ar
      if (this.isUp) {
        // Estouramos a bolha
        event.stateMachine.setState(event.burstState);
      }
    }
    // Se recebermos um evento de colisão
    else if (event instanceof StateMachineCollisionEvent) {
      // E a colisão for com um gatilho de um ventilador
      if (event.triggerType == StateMachineCollisionEvent.FANS) {
        // Obtemos o vetor de frente do ventilador e definimos como a direção do rato
        const parentForward = Vector3.Forward().rotate(
          event.entity.getComponent(Transform).rotation
        );
        this.mouseComponent.direction = parentForward;
        // E mudamos o estado para o estado de bolha flutuante ao redor
        event.stateMachine.setState(this.bubbleState);
      }
    }
  }
}
