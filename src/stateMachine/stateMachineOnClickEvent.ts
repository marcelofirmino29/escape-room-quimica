/**
 * Importação da máquina de estados.
 */
import { StateMachine } from "../modules/stateMachine";

/**
 * Evento para a máquina de estados quando clicamos no mouse ou na bolha.
 */
export class StateMachineOnClickEvent implements StateMachine.IStateEvent {
  stateMachine: StateMachine;
  bubbleState: StateMachine.State;
  burstState: StateMachine.State;

  /**
   * Construtor da classe.
   *
   * @param stateMachine Referência à máquina de estados.
   * @param bubbleState Referência ao estado para criar a bolha.
   * @param burstState Referência ao estado para estourar a bolha.
   */
  constructor(
    stateMachine: StateMachine,
    bubbleState: StateMachine.State,
    burstState: StateMachine.State
  ) {
    this.stateMachine = stateMachine;
    this.bubbleState = bubbleState;
    this.burstState = burstState;
  }
}
