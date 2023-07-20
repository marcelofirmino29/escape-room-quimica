import resources from "../resources";

// Constantes para posicionamento
const panelPosition = new Vector2(12, -24);
const buttonSize = new Vector2(55, 55);
const buttonSpace = new Vector2(5, 5);

/**
 * Classe para o teclado numérico.
 */
export class Keypad {
  // Expor o contêiner para alterar a visibilidade
  public container: UIContainerRect;

  private panelInputs: UIText[];

  /**
   * Chamado quando uma tecla numérica é pressionada.
   */
  public onInput: (value: number) => void;

  /**
   * Chamado quando o botão de reset é pressionado.
   */
  public onReset: () => void;

  /**
   * Chamado quando o botão de envio é pressionado.
   */
  public onSubmit: () => void;

  constructor(parent: UIShape) {
    this.container = new UIContainerRect(parent);
    this.container.positionX = -50;
    this.container.positionY = 50;
    this.container.width = "100%";
    this.container.height = "100%";

    // Exibir uma imagem no fundo para o teclado numérico
    const panelBackground = new UIImage(
      this.container,
      resources.textures.panelBackground
    );
    panelBackground.sourceWidth = 918;
    panelBackground.sourceHeight = 1300;
    panelBackground.width = 310;
    panelBackground.height = 420;
    panelBackground.positionX = 70;
    panelBackground.positionY = -55;

    // Adicionar um botão de fechar próximo ao canto superior direito
    const closeImage = new UIImage(
      this.container,
      resources.textures.closeButton
    );
    closeImage.sourceWidth = 92;
    closeImage.sourceHeight = 92;
    closeImage.width = 32;
    closeImage.height = 32;
    closeImage.positionX = 194;
    closeImage.positionY = 108;

    // Quando o botão de fechar é clicado, esconder o UI
    closeImage.onClick = new OnClick((): void => {
      this.container.visible = false;
    });

    // 3 caixas para mostrar o código inserido ou a mensagem atual
    this.panelInputs = [];
    for (let i = 0; i < 3; i++) {
      const inputImage = new UIImage(
        this.container,
        resources.textures.inputBox
      );
      const inputSlot = new UIText(this.container);
      inputImage.sourceWidth = 173;
      inputImage.sourceHeight = 173;
      inputImage.width = inputSlot.width = buttonSize.x;
      inputImage.height = inputSlot.height = buttonSize.y;
      inputImage.positionX = inputSlot.positionX =
        i * (buttonSpace.x + buttonSize.x) + 5;
      inputImage.positionY = inputSlot.positionY = 45;
      inputSlot.fontAutoSize = true;
      inputSlot.hTextAlign = "center";
      this.panelInputs.push(inputSlot);
    }

    // Botões de entrada do usuário
    for (let col = 0; col < 3; col++) {
      for (let row = 0; row < 4; row++) {
        // O valor representado por este botão
        let value: number;
        if (col == 1 && row == 3) {
          // O botão 0 é um caso especial
          value = 0;
        } else {
          value = row * 3 + col + 1;
        }

        // Criar o botão e seu evento
        let buttonImage: UIImage = null;
        if (col == 0 && row == 3) {
          // O botão de limpar no canto inferior esquerdo
          buttonImage = new UIImage(
            this.container,
            resources.textures.clearButton
          );

          // Chamar onReset quando clicado
          buttonImage.onClick = new OnClick((): void => {
            this.onReset();
          });
        } else if (col == 2 && row == 3) {
          // O botão de enviar no canto inferior direito
          buttonImage = new UIImage(
            this.container,
            resources.textures.enterButton
          );

          // Chamar onSubmit quando clicado
          buttonImage.onClick = new OnClick((): void => {
            this.onSubmit();
          });
        } else {
          // Botão de valor numérico
          buttonImage = new UIImage(
            this.container,
            resources.textures.numberButton
          );

          const numberText = new UIText(buttonImage);
          numberText.isPointerBlocker = false;
          numberText.positionX = -23;
          numberText.fontAutoSize = true;
          numberText.hTextAlign = "center";
          numberText.value = value.toString();

          // Chamar onInput quando clicado
          buttonImage.onClick = new OnClick((): void => {
            this.onInput(value);
          });
        }

        // Configurar a imagem do botão
        buttonImage.sourceWidth = 171;
        buttonImage.sourceHeight = 171;
        buttonImage.width = buttonSize.x;
        buttonImage.height = buttonSize.y;
        buttonImage.positionX =
          panelPosition.x + col * (buttonSpace.x + buttonSize.x);
        buttonImage.positionY =
          panelPosition.y - row * (buttonSpace.y + buttonSize.y);
      }
    }
  }

  // Exibir uma mensagem acima do teclado numérico, até 3 caracteres
  public display(message: string, color: Color4 = Color4.White()): void {
    for (let i = 0; i < this.panelInputs.length; i++) {
      const character = message.length > i ? message[i] : "";
      this.panelInputs[i].value = character;
      this.panelInputs[i].color = color;
    }
  }
}
