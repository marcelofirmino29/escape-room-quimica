import resources from "../resources";

/**
 * Classe para exibir dicas de imagem.
 */
export class ImageHint {
  // Expor o contêiner para alterar a visibilidade
  public container: UIContainerRect;

  constructor(gameCanvas: UICanvas, texture: Texture) {
    this.container = new UIContainerRect(gameCanvas);
    this.container.width = "100%";
    this.container.height = "100%";

    // Adicionar a imagem principal
    const hintImage = new UIImage(this.container, texture);
    hintImage.sourceWidth = 512;
    hintImage.sourceHeight = 512;
    hintImage.width = 512;
    hintImage.height = 512;

    // E adicionar um botão de fechar no canto superior direito
    const close = new UIImage(
      this.container,
      resources.textures.closeHintButton
    );
    close.sourceWidth = 92;
    close.sourceHeight = 92;
    close.width = 46;
    close.height = 46;
    close.positionX = 256;
    close.positionY = 256;

    // O UI tem uma forma diferente de registrar suporte para OnClick
    close.onClick = new OnClick((): void => {
      this.container.visible = false;
    });
  }
}
