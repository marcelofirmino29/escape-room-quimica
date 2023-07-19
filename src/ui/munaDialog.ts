import resources from "../resources";
import { SimpleDialog } from "../modules/simpleDialog";

function selectRandom(options: string[]): string {
  return options[Math.floor(Math.random() * (options.length - 1))];
}

export class MunaDialog extends SimpleDialog {
  private dialogTree: SimpleDialog.DialogTree;

  public onCorrectAnswer: (questionId: number) => void;

  constructor(gameCanvas: UICanvas) {
    // Criar um novo SimpleDialog para gerenciar a árvore de diálogo
    super({
      canvas: gameCanvas,
      leftPortrait: {
        width: 256,
        height: 256,
        sourceWidth: 256,
        sourceHeight: 256,
        positionX: "-17%"
      },
      rightPortrait: {
        width: 256,
        height: 256,
        sourceWidth: 256,
        sourceHeight: 256,
        positionX: "15%"
      },
      dialogText: {
        width: "25%",
        height: "25%",
        textSpeed: 15,
        textIdleTime: 5,
        textConfig: { fontSize: 16, paddingLeft: 25, paddingRight: 25 },
        background: resources.textures.textContainer,
        backgroundConfig: { sourceWidth: 512, sourceHeight: 257 }
      },
      optionsContainer: {
        stackOrientation: UIStackOrientation.VERTICAL,
        spacing: 0,
        width: "40%",
        height: "12%",
        vAlign: "top",
        hAlign: "center",
        positionY: "-65%",
        background: resources.textures.optionsContainer,
        backgroundConfig: { sourceWidth: 512, sourceHeight: 79 },
        optionsTextConfig: { fontSize: 20, paddingLeft: 20, positionY: "-35%" }
      }
    });

    // Algumas respostas aleatórias para Muna
    const randomStartingOptions = [
      "Entendo...", "...", "...OK..."
    ];
    const randomWrongAnswers = [
      "Você está apenas adivinhando...",
      "Não não é...",
      "O quê? Nem perto!"
    ];

    // Variáveis usadas na árvore de diálogo
    let firstTimeDialog = true;
    let firstOptionCorrect = false;
    let secondOptionCorrect = false;
    let thirdOptionCorrect = false;

    // Cores do texto do diálogo
    const npcColor = Color4.White();
    const playerColor = new Color4(0.898, 0, 0.157);

    this.dialogTree = new SimpleDialog.DialogTree()
      .if(() => firstTimeDialog)
      .call(() => (firstTimeDialog = false))
      .showPortrait(
        SimpleDialog.PortraitIndex.RIGHT,
        resources.textures.npcPortraitDefault
      )
      .say(() => "Olá estranho!", { color: npcColor })
      .showPortrait(
        SimpleDialog.PortraitIndex.LEFT,
        resources.textures.playerPortraitSurprised
      )
      .say(() => "Uma estátua de cachorro falante?!", { color: playerColor })
      .showPortrait(
        SimpleDialog.PortraitIndex.RIGHT,
        resources.textures.npcPortraitSurprised
      )
      .say(() =>
        "Você também é um urso falante... não me vê fazendo nenhum julgamento.", { color: npcColor })
      .showPortrait(
        SimpleDialog.PortraitIndex.LEFT,
        resources.textures.playerPortraitThinking
      )
      .showPortrait(
        SimpleDialog.PortraitIndex.RIGHT,
        resources.textures.npcPortraitDefault
      )
      .say(() => "Enfim... como faço para sair deste lugar?", {
        color: playerColor
      })
      .showPortrait(
        SimpleDialog.PortraitIndex.RIGHT,
        resources.textures.npcPortraitThinking
      )
      .say(
        () =>
          "Você terá que passar por mim. E eu só vou deixar você responder às minhas três perguntas.",
        { color: npcColor }
      )
      .showPortrait(
        SimpleDialog.PortraitIndex.RIGHT,
        resources.textures.npcPortraitSurprised
      )
      .showPortrait(
        SimpleDialog.PortraitIndex.LEFT,
        resources.textures.playerPortraitSurprised
      )
      .say(
        () =>
          "Então vá em frente, explore as outras salas e resolva os quebra-cabeças para encontrar as respostas para minhas perguntas!",
        { color: npcColor }
      )
      .say(() => "Hum... claro, por que não? Quem sou eu para discutir?", {
        color: playerColor
      })
      .wait(3)
      .else()
      .showPortrait(
        SimpleDialog.PortraitIndex.LEFT,
        resources.textures.playerPortraitDefault
      )
      .showPortrait(
        SimpleDialog.PortraitIndex.RIGHT,
        resources.textures.npcPortraitThinking
      )
      .if(() => firstOptionCorrect && secondOptionCorrect && thirdOptionCorrect)
      .say(() => "Acabamos de falar. \nDigite o código e você pode sair.", {
        color: npcColor
      })
      .wait(3)
      .else()
      .say(() => "Você resolveu meus quebra-cabeças? você sabe as respostas?", {
        color: npcColor
      })
      .showPortrait(
        SimpleDialog.PortraitIndex.LEFT,
        resources.textures.playerPortraitThinking
      )
      .beginOptionsGroup()
      .option(() => "- Sim.")
      .showPortrait(
        SimpleDialog.PortraitIndex.LEFT,
        resources.textures.playerPortraitDefault
      )
      .say(() => "Sim. Por que você acha que vim até aqui?", {
        color: playerColor
      })
      .showPortrait(
        SimpleDialog.PortraitIndex.RIGHT,
        resources.textures.npcPortraitSurprised
      )
      .say(() => selectRandom(randomStartingOptions), { color: npcColor })
      .showPortrait(
        SimpleDialog.PortraitIndex.RIGHT,
        resources.textures.npcPortraitThinking
      )
      .say(() => "Muito bem então... responda-me isto", { color: npcColor })
      .showPortrait(
        SimpleDialog.PortraitIndex.RIGHT,
        resources.textures.npcPortraitDefault
      )
      .if(() => !firstOptionCorrect)
      .say(() => "Qual é a minha cor favorita?", { color: npcColor })
      .showPortrait(
        SimpleDialog.PortraitIndex.LEFT,
        resources.textures.playerPortraitThinking
      )
      .beginOptionsGroup()
      .option(() => "- Verde.")
      .say(() => "É verde?", { color: playerColor })
      .showPortrait(
        SimpleDialog.PortraitIndex.RIGHT,
        resources.textures.npcPortraitSurprised
      )
      .say(() => selectRandom(randomWrongAnswers), { color: npcColor })
      .endOption()
      .option(() => "- Azul.")
      .say(() => "Azul... certo?", { color: playerColor })
      .showPortrait(
        SimpleDialog.PortraitIndex.RIGHT,
        resources.textures.npcPortraitSurprised
      )
      .say(() => selectRandom(randomWrongAnswers), { color: npcColor })
      .endOption()
      .option(() => "- Laranja.")
      .say(() => "Laranja!", { color: playerColor })
      .call(() => (firstOptionCorrect = true))
      .showPortrait(
        SimpleDialog.PortraitIndex.RIGHT,
        resources.textures.npcPortraitSurprised
      )
      .say(() => "Isso mesmo!", { color: npcColor })
      .say(() => '"No meio da escuridão, a luz persiste."', {
        color: npcColor
      })
      .call(() => this.onCorrectAnswer(0))
      .endOption()
      .endOptionsGroup()
      .else()
      .if(() => !secondOptionCorrect)
      .say(() => "Qual é o meu jogo favorito?", { color: npcColor })
      .showPortrait(
        SimpleDialog.PortraitIndex.LEFT,
        resources.textures.playerPortraitThinking
      )
      .beginOptionsGroup()
      .option(() => "- Jogos de arcade retrô.")
      .say(() => "São jogos de arcade retrô?", { color: playerColor })
      .showPortrait(
        SimpleDialog.PortraitIndex.RIGHT,
        resources.textures.npcPortraitSurprised
      )
      .say(() => selectRandom(randomWrongAnswers), { color: npcColor })
      .endOption()
      .option(() => "- Dardos.")
      .say(() => "Dardos?", { color: playerColor })
      .call(() => (secondOptionCorrect = true))
      .showPortrait(
        SimpleDialog.PortraitIndex.RIGHT,
        resources.textures.npcPortraitSurprised
      )
      .say(() => "É sim...", { color: npcColor })
      .say(() => '"Dê luz, e a escuridão desaparecerá por si mesma."', {
        color: npcColor
      })
      .call(() => this.onCorrectAnswer(1))
      .endOption()
      .option(() => "- Boliche.")
      .say(() => "Claro... É boliche... certo?", { color: playerColor })
      .showPortrait(
        SimpleDialog.PortraitIndex.RIGHT,
        resources.textures.npcPortraitSurprised
      )
      .say(() => selectRandom(randomWrongAnswers), { color: npcColor })
      .endOption()
      .endOptionsGroup()
      .else()
      .if(() => !thirdOptionCorrect)
      .say(() => "Qual é a minha sobremesa favorita?", { color: npcColor })
      .showPortrait(
        SimpleDialog.PortraitIndex.LEFT,
        resources.textures.playerPortraitThinking
      )
      .beginOptionsGroup()
      .option(() => "- Bolo de queijo.")
      .say(() => "Bolo de queijo?", { color: playerColor })
      .showPortrait(
        SimpleDialog.PortraitIndex.RIGHT,
        resources.textures.npcPortraitSurprised
      )
      .say(() => selectRandom(randomWrongAnswers), { color: npcColor })
      .endOption()
      .option(() => "- Bolo de Milho.")
      .say(() => "Isso é bolo de milho?...", { color: playerColor })
      .showPortrait(
        SimpleDialog.PortraitIndex.RIGHT,
        resources.textures.npcPortraitSurprised
      )
      .say(() => selectRandom(randomWrongAnswers), { color: npcColor })
      .endOption()
      .option(() => "- Bolo de limão.")
      .say(() => "Bolo de limão!", { color: playerColor })
      .showPortrait(
        SimpleDialog.PortraitIndex.RIGHT,
        resources.textures.npcPortraitSurprised
      )
      .call(() => (thirdOptionCorrect = true))
      .showPortrait(
        SimpleDialog.PortraitIndex.RIGHT,
        resources.textures.npcPortraitSurprised
      )
      .say(() => "Muito bom...", { color: npcColor })
      .say(() => '"Dê luz e as pessoas encontrarão o caminho."')
      .call(() => this.onCorrectAnswer(2))
      .endOption()
      .endOptionsGroup()
      .endif()
      .endif()
      .endif()
      .endOption()
      .option(() => "- Não, não ainda.")
      .showPortrait(
        SimpleDialog.PortraitIndex.LEFT,
        resources.textures.playerPortraitDefault
      )
      .say(() => "Não, não ainda!", { color: playerColor })
      .showPortrait(
        SimpleDialog.PortraitIndex.RIGHT,
        resources.textures.npcPortraitSurprised
      )
      .say(() => "Você está desperdiçando o meu tempo.", { color: npcColor })
      .endOption()
      .endOptionsGroup()
      .endif();
  }

  public run(): void {
    if (!this.isDialogTreeRunning()) {
      this.runDialogTree(this.dialogTree);
    }
  }
}
