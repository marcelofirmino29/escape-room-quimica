import { StateMachine } from "../modules/stateMachine";

/**
 * Evento para a máquina de estados quando clicamos no mouse ou na bolha
 */
export class StateMachineOnClickEvent implements StateMachine.IStateEvent {
  stateMachine: StateMachine;
  bubbleState: StateMachine.State;
  burstState: StateMachine.State;

  /**
   *
   * @param stateMachine Referência da máquina de estados
   * @param bubbleState Referência do estado para criar a bolha
   * @param burstState Referência do estado para estourar a bolha
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
