// Importando utilitários e recursos necessários
import utils from "../../node_modules/decentraland-ecs-utils/index";
import resources from "../resources";
import {
  MovableEntity,
  NumPadLock,
  Door,
  Spotlight
} from "../gameObjects/index";
import { Keypad, MunaDialog } from "../ui/index";

// Função para criar a sala 6, recebendo o canvas do jogo como parâmetro
export function CreateRoom6(gameCanvas: UICanvas): void {
  // Criando a porta e configurando o comportamento de abertura ao clicar nela
  const door = new Door(
    resources.models.door6,
    {
      position: new Vector3(28.3, 0.25, 19.75),
      rotation: Quaternion.Euler(0, 180, 0)
    },
    resources.sounds.doorSqueak
  );

  // Uma estátua bloqueia a passagem
  const munaStatue = new MovableEntity(
    resources.models.muna,
    { position: new Vector3(26.748, 0.1054, 20.765) },
    resources.sounds.moveObject1,
    new Vector3(0, 0, 2),
    1.5
  );

  // Preparando a interface do teclado numérico
  const keypad = new Keypad(gameCanvas);
  keypad.container.visible = false;

  // Adicionando um painel que abre a interface ao ser clicado
  const numPadLock = new NumPadLock(resources.models.numpad2);
  numPadLock.addComponent(
    new OnPointerDown((): void => {
      keypad.container.visible = true;
    })
  );

  // Conectando a lógica do teclado numérico
  let currentInput = "";
  keypad.onInput = (value: number): void => {
    currentInput += value;
    keypad.display(currentInput);
    numPadLock.playButtonPressed();
  };
  keypad.onReset = (): void => {
    currentInput = "";
    keypad.display(currentInput);
    numPadLock.playButtonPressed();
  };
  keypad.onSubmit = (): void => {
    if (currentInput == "104") {
      // Correto!
      keypad.display("OK!", Color4.Green());
      numPadLock.playAccessGranted();
      numPadLock.removeComponent(OnPointerDown);
      munaStatue.getComponent(utils.ToggleComponent).toggle();
      numPadLock.addComponentOrReplace(
        new utils.Delay(2000, (): void => {
          keypad.container.visible = false;
          door.openDoor();
        })
      );
    } else {
      // A senha está incorreta
      keypad.display("Erro", Color4.Red());
      numPadLock.playAccessDenied();
      currentInput = "";
    }
  };

  // Refletores
  const spotLight1 = new Spotlight(
    {
      position: new Vector3(-0.04, 0, 0)
    },
    "1"
  );
  spotLight1.setParent(munaStatue);
  const spotLight2 = new Spotlight(
    {
      position: new Vector3(-0.02, 0, 0),
      rotation: Quaternion.Euler(0, 90, 0)
    },
    "0"
  );
  spotLight2.setParent(munaStatue);
  const spotLight3 = new Spotlight(
    {
      position: new Vector3(-0.03, 0, 0),
      rotation: Quaternion.Euler(0, 180, 0)
    },
    "4"
  );
  spotLight3.setParent(munaStatue);

  // Definindo a estrutura da árvore de diálogo
  const dialog = new MunaDialog(gameCanvas);

  // Iniciando o diálogo quando a estátua é clicada
  munaStatue.addComponent(
    new OnPointerDown((): void => {
      dialog.run();
    })
  );

  // Revelando as dicas conforme o jogador responde corretamente às perguntas.
  dialog.onCorrectAnswer = (questionId: number) => {
    if (questionId === 0) {
      spotLight1.getComponent(utils.ToggleComponent).set(utils.ToggleState.On);
    } else if (questionId === 1) {
      spotLight2.getComponent(utils.ToggleComponent).set(utils.ToggleState.On);
    } else {
      spotLight3.getComponent(utils.ToggleComponent).set(utils.ToggleState.On);
    }
  };
}
