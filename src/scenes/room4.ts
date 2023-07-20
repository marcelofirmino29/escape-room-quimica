// Importando entidades móveis e rotacionáveis e os utilitários necessários
import { MovableEntity, RotatableEntity } from "../gameObjects/index";
import utils from "../../node_modules/decentraland-ecs-utils/index";
import resources from "../resources";

// Função para criar a sala 4
export function CreateRoom4(): void {
  // Criando uma estante móvel
  const bookshelf = new MovableEntity(
    resources.models.door4,
    new Transform({
      position: new Vector3(20.6557, 5.4996, 15.041)
    }),
    resources.sounds.moveObject1,
    new Vector3(1.5, 0, 0),
    3
  );

  // Criando um livro móvel
  const movableBook = new MovableEntity(
    resources.models.book2,
    new Transform({
      position: new Vector3(20.41, 6.4118, 10.4922)
    }),
    resources.sounds.moveObject1,
    new Vector3(0, 0, -0.2)
  );
  movableBook.addComponent(
    new OnPointerDown((): void => {
      movableBook.getComponent(utils.ToggleComponent).toggle();
    })
  );

  // Criando um copo de vinho móvel
  const wineGlass = new MovableEntity(
    resources.models.glass,
    new Transform({
      position: new Vector3(25.7505, 6.95786, 10.5917)
    }),
    resources.sounds.moveObject2,
    new Vector3(0.2, 0, 0)
  );
  wineGlass.addComponent(
    new OnPointerDown((): void => {
      wineGlass.getComponent(utils.ToggleComponent).toggle();
    })
  );

  // Criando um telescópio rotacionável
  const telescope = new RotatableEntity(
    resources.models.telescope,
    new Transform({
      position: new Vector3(22.6554, 7.02615, 10.6208)
    }),
    resources.sounds.moveObject1,
    Quaternion.Euler(0, 127, 0)
  );
  telescope.addComponent(
    new OnPointerDown((): void => {
      telescope.getComponent(utils.ToggleComponent).toggle();
    })
  );

  // Criando um globo terrestre rotacionável
  const globe = new RotatableEntity(
    resources.models.globe,
    new Transform({
      position: new Vector3(21.2191, 7.11234, 10.6817),
      rotation: Quaternion.Euler(0.146, 34.9, -33.8)
    }),
    resources.sounds.moveObject1,
    Quaternion.Euler(174, -26.43, -149.37)
  );

  globe.addComponent(
    new OnPointerDown((): void => {
      globe.getComponent(utils.ToggleComponent).toggle();
    })
  );

  // Criando um livro rotacionável
  const rotatableBook = new RotatableEntity(
    resources.models.book1,
    new Transform({
      position: new Vector3(15.8321, 7.83095, 14.1252)
    }),
    resources.sounds.moveObject1,
    Quaternion.Euler(0, 0, -25)
  );

  rotatableBook.addComponent(
    new OnPointerDown((): void => {
      rotatableBook.getComponent(utils.ToggleComponent).toggle();
    })
  );

  // Criando um suporte para velas rotacionável
  const candleHolder = new RotatableEntity(
    resources.models.candleHolder,
    new Transform({
      position: new Vector3(17.5056, 7.61611, 15.3835)
    }),
    resources.sounds.moveObject2,
    Quaternion.Euler(0, 0, 30)
  );

  candleHolder.addComponent(
    new OnPointerDown((): void => {
      candleHolder.getComponent(utils.ToggleComponent).toggle();
      bookshelf.getComponent(utils.ToggleComponent).toggle();
    })
  );
}
