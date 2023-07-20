import { StateMachine } from "../modules/stateMachine";

/**
 * Evento para a máquina de estados quando uma colisão é acionada.
 */
export class StateMachineCollisionEvent implements StateMachine.IStateEvent {
  static readonly PIKES = 0;
  static readonly BOXES = 1;
  static readonly FANS = 2;
  static readonly CAGE = 3;

  stateMachine: StateMachine;
  entity: Entity;
  triggerType: number;

  /**
   *
   * @param stateMachine Referência da máquina de estados
   * @param entity Referência da entidade com a qual colidimos
   * @param triggerType Tipo do gatilho com o qual colidimos
   */
  constructor(stateMachine: StateMachine, entity: Entity, triggerType: number) {
    this.stateMachine = stateMachine;
    this.entity = entity;
    this.triggerType = triggerType;
  }
}
