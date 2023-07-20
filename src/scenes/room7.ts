// Importando recursos necessários
import resources from "../resources";
import { Door, ToggleEntity, Button } from "../gameObjects/index";
import { ToggleModelComponent } from "../components/toggleModelComponent";

// Posições dos botões e lâmpadas
const buttonPositions = [
  new Vector3(23.0891, 1.58507, 10.2526),
  new Vector3(23.0891, 1.48205, 11.2557),
  new Vector3(23.0891, 1.38123, 12.2855),
  new Vector3(23.0891, 1.52253, 13.2941)
];
const bulbPositions = [
  new Vector3(23.408, 2.26006, 10.3273),
  new Vector3(23.408, 2.22122, 11.1682),
  new Vector3(23.408, 2.10693, 12.1568),
  new Vector3(23.408, 2.24542, 13.1888)
];

// Função para criar a sala 7
export function CreateRoom7(): void {
  // Criando a porta e configurando o comportamento de abertura ao clicar nela
  const door = new Door(
    resources.models.door7,
    {
      position: new Vector3(26.3087, 0, 14.9449),
      rotation: Quaternion.Euler(0, -10.2, 0)
    },
    resources.sounds.doorSqueek
  );
  door.addComponent(
    new OnPointerDown((): void => {
      if (!door.isOpen) {
        door.openDoor();
      }
    })
  );

  // Lâmpadas do quebra-cabeça
  const lightbulbs: ToggleEntity[] = [];
  for (let i = 0; i < 4; i++) {
    lightbulbs.push(
      new ToggleEntity(
        { position: bulbPositions[i] },
        new GLTFShape(resources.models.lightOnSrc),
        new GLTFShape(resources.models.lightOffSrc)
      )
    );
  }

  // Interações dos botões com as lâmpadas
  const buttonInteractions = [
    (): void => {
      lightbulbs[1].getComponent(ToggleModelComponent).toggle();
      lightbulbs[2].getComponent(ToggleModelComponent).toggle();
      lightbulbs[3].getComponent(ToggleModelComponent).toggle();
    },
    (): void => {
      lightbulbs[2].getComponent(ToggleModelComponent).toggle();
      lightbulbs[3].getComponent(ToggleModelComponent).toggle();
    },
    (): void => {
      lightbulbs[0].getComponent(ToggleModelComponent).toggle();
      lightbulbs[3].getComponent(ToggleModelComponent).toggle();
    },
    (): void => {
      lightbulbs[0].getComponent(ToggleModelComponent).toggle();
      lightbulbs[2].getComponent(ToggleModelComponent).toggle();
      lightbulbs[3].getComponent(ToggleModelComponent).toggle();
    }
  ];

  // Verifica se todas as lâmpadas estão ligadas
  const areAllLightsOn = (): boolean => {
    for (const bulb of lightbulbs) {
      if (!bulb.getComponent(ToggleModelComponent).isOn()) {
        return false;
      }
    }
    return true;
  };

  // A TV exibe a dica quando ativada
  const tvScreen = new ToggleEntity(
    { position: new Vector3(26.91, 0, 10.44) },
    resources.models.tvOn,
    resources.models.tvOff
  );

  let areButtonsEnabled = true;
  // Criando os botões e configurando o comportamento ao clicar neles
  for (let i = 0; i < buttonPositions.length; i++) {
    const button = new Button(resources.models.roundButton, {
      position: buttonPositions[i]
    });
    button.addComponent(
      new OnPointerDown((): void => {
        if (areButtonsEnabled) {
          buttonInteractions[i]();
          button.press();

          if (areAllLightsOn()) {
            areButtonsEnabled = false;
            tvScreen.getComponent(ToggleModelComponent).toggle();
          }
        }
      })
    );
  }
}
