/**
 * Um temporizador que pode ser colocado em uma parede.
 */
export class Timer extends Entity {
  // Armazena a entidade de texto para uso no método abaixo

  constructor(transform: TranformConstructorArgs) {
    super();
    engine.addEntity(this);

    this.addComponent(new Transform(transform));

    // O valor a ser exibido será controlado pela própria cena
    this.addComponent(new TextShape());
    this.getComponent(TextShape).color = Color3.Red();
    this.getComponent(TextShape).fontSize = 5;
  }

  private formatTimeString(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return (
      mins.toLocaleString(undefined, { minimumIntegerDigits: 2 }) +
      ":" +
      secs.toLocaleString(undefined, { minimumIntegerDigits: 2 })
    );
  }

  // Este método pode ser chamado a qualquer momento para alterar o número de segundos no relógio
  public updateTimeString(seconds: number): void {
    this.getComponent(TextShape).value = this.formatTimeString(seconds);
  }
}
