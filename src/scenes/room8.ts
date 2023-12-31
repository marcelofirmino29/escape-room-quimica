// Importando recursos necessários
import resources from "../resources";
import { Door, Ticket, Mouse, ArcadeScreen } from "../gameObjects/index";
import {
  MouseFollowPathComponent,
  MouseFollowPathSystem
} from "../components/index";
import utils from "../../node_modules/decentraland-ecs-utils/index";

// Função para criar a sala 8
export function CreateRoom8(): void {
  // Criando a porta e configurando o comportamento de abertura ao clicar nela
  const door = new Door(
    resources.models.door8,
    {
      position: new Vector3(22.612, 0, 14.9205),
      rotation: Quaternion.Euler(0, 135, 0)
    },
    resources.sounds.doorSqueek
  );
  door.addComponent(
    new OnPointerDown((): void => {
      door.openDoor();
    })
  );

  // O bilhete revelará a dica para esta sala
  const ticket = new Ticket({
    position: new Vector3(18.1903, 0.397274, 11.771),
    rotation: Quaternion.Euler(0, 63.6, 0)
  });

  // Adicionando uma tela de fliperama
  const columnCount = 5;
  const rowCount = 5;

  const arcade = new ArcadeScreen(
    new Vector3(0.3, 0.3, 1),
    columnCount,
    rowCount,
    new Vector3(0.09, 0.05, 0),
    new Vector3(17.7913, 0.871266, 10.6956),
    Quaternion.Euler(118, -45, 127.3)
  );

  // Adicionando ratos para correr pela tela
  const mouse1 = new Mouse({
    position: new Vector3(25.82, 1.46, 4.25),
    scale: new Vector3(0.8, 0.8, 0.8)
  });
  const mouse2 = new Mouse({
    position: new Vector3(26.54, 0.85, 3.9),
    scale: new Vector3(0.8, 0.8, 0.8)
  });

  // Adicionando sistema de comportamento para os ratos
  const mouseBehaviorSystem = new MouseFollowPathSystem();
  engine.addSystem(mouseBehaviorSystem);

  // Criando os componentes de seguir caminho para os ratos
  mouse1.addComponent(
    new MouseFollowPathComponent(
      7.5,
      7,
      [
        new Vector3(17.37, 1.69, 10.06),
        new Vector3(16.7, 1.7, 11.47),
        new Vector3(16.3, 2.24, 11.28)
      ],
      2
    )
  );
  mouse2.addComponent(
    new MouseFollowPathComponent(
      0,
      6,
      [
        new Vector3(17.49, 0.6, 11.85),
        new Vector3(16.7, 1.7, 11.47),
        new Vector3(16.36, 1.7, 12.17)
      ],
      5
    )
  );

  // Quando o jogador vence o jogo
  arcade.onCompletion = () => {
    // Revelar a dica
    ticket.emitTicket();

    // Remover os componentes para parar os ratos
    mouse1.removeComponent(utils.FollowPathComponent);
    mouse2.removeComponent(utils.FollowPathComponent);
    engine.removeSystem(mouseBehaviorSystem);
  };
}
