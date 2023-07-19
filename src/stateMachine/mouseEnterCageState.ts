import { StateMachine } from "../modules/stateMachine";
import utils from "../../node_modules/decentraland-ecs-utils/index";
import { MouseComponent } from "../components/mouseComponent";

/**
 * Estado para fazer o rato entrar na gaiola
 */
export class MouseEnterCageState extends StateMachine.State {
  mouseComponent: MouseComponent;
  isStateRunning: boolean;
  onStateFinish: () => void;

  /**
   * Cria uma instância do estado
   * @param mouseComponent Componente do rato
   * @param onStateFinish Função de retorno quando o estado termina
   */
  constructor(mouseComponent: MouseComponent, onStateFinish: () => void) {
    super();
    this.mouseComponent = mouseComponent;
    this.onStateFinish = onStateFinish;
  }

  /**
   * Chamado quando o estado começa
   */
  onStart() {
    // o estado está em execução
    this.isStateRunning = true;
    // vamos mover o rato para dentro da gaiola
    this.mouseComponent.mouseEntity.addComponent(
      new utils.MoveTransformComponent(
        this.mouseComponent.transform.position,
        new Vector3(1.85275, 1.06965, -0.04),
        1.5,
        (): void => {
          // o estado deve terminar agora
          this.isStateRunning = false;
        },
        utils.InterpolationType.EASEQUAD
      )
    );
  }

  /**
   * Chamado quando o estado é atualizado
   * @returns TRUE para manter o estado em execução, FALSE para finalizar o estado
   */
  onUpdateState() {
    return this.isStateRunning;
  }

  /**
   * Chamado quando o estado termina
   */
  onEnd() {
    // chamada de retorno
    if (this.onStateFinish) this.onStateFinish();
  }
}
