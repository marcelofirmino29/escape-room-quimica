// Switch the import to use the index
import utils from "../../node_modules/decentraland-ecs-utils/index";
import { Door, MovableEntity } from "../gameObjects/index";
import resources from "../resources";

export function CreateRoom1(): void {
  const door = new Door(
    resources.models.door1,
    { position: new Vector3(21.18, 10.8, 24.5) },
    resources.sounds.doorSqueak
  );

  // A statue blocks the doorway
  const munaStatue = new MovableEntity(
    resources.models.muna,
    { position: new Vector3(21.89, 10.8, 23.07) },
    resources.sounds.moveObject1,
    new Vector3(2, 0, 0),
    1.5
  );

  door.addComponent(
    new OnClick((): void => {
      munaStatue.getComponent(utils.ToggleComponent).toggle();
      door.openDoor();
    })
  );
}
