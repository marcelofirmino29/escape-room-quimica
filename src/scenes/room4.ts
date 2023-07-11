import { MovableEntity, RotatableEntity } from "../gameObjects/index";
import utils from "../../node_modules/decentraland-ecs-utils/index";
import resources from "../resources";


export function CreateRoom4(): void {
  const bookshelf = new MovableEntity(
    resources.models.door4,
    new Transform({
      position: new Vector3(20.6557, 5.4996, 15.041)
    }),
    resources.sounds.moveObject1,
    new Vector3(1.5, 0, 0),
    3
  );

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
  const telescope = new RotatableEntity(
    new GLTFShape("models/room4/Puzzle04_Telescope.glb"),
    new Transform({
      position: new Vector3(22.6554, 7.02615, 10.6208)
    }),
    new AudioClip("sounds/move_object1.mp3"),
    Quaternion.Euler(0, 127, 0)
  );
  telescope.addComponent(
    new OnPointerDown((): void => {
      telescope.getComponent(utils.ToggleComponent).toggle();
    })
  );
  
  const globe = new RotatableEntity(
    new GLTFShape("models/room4/Puzzle04_Globe.glb"),
    new Transform({
      position: new Vector3(21.2191, 7.11234, 10.6817),
      rotation: Quaternion.Euler(0.146, 34.9, -33.8)
    }),
    new AudioClip("sounds/move_object1.mp3"),
    Quaternion.Euler(174, -26.43, -149.37)
  );
  
  globe.addComponent(
    new OnPointerDown((): void => {
      globe.getComponent(utils.ToggleComponent).toggle();
    })
  );
  
  const rotatableBook = new RotatableEntity(
    new GLTFShape("models/room4/Puzzle04_Book1.glb"),
    new Transform({
      position: new Vector3(15.8321, 7.83095, 14.1252)
    }),
    new AudioClip("sounds/move_object1.mp3"),
    Quaternion.Euler(0, 0, -25)
  );
  
  rotatableBook.addComponent(
    new OnPointerDown((): void => {
      rotatableBook.getComponent(utils.ToggleComponent).toggle();
    })
  );

  const candleHolder = new RotatableEntity(
    new GLTFShape("models/room4/Puzzle04_CandleHolder.glb"),
    new Transform({
      position: new Vector3(17.5056, 7.61611, 15.3835)
    }),
    new AudioClip("sounds/move_object2.mp3"),
    Quaternion.Euler(0, 0, 30)
  );
  
  candleHolder.addComponent(
    new OnPointerDown((): void => {
      candleHolder.getComponent(utils.ToggleComponent).toggle();
      bookshelf.getComponent(utils.ToggleComponent).toggle();
    })
  );
}